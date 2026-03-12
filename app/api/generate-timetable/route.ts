import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';

const prisma = new PrismaClient();

interface GenerateRequest {
  classIds: string[];
  weekStart: string;
  constraints: {
    maxPeriodsPerTeacher: number;
    avoidTeacherConflicts: boolean;
    respectRoomAvailability: boolean;
    priority: "balanced" | "minimize_gaps" | "core_subjects";
  };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Verify user is principal
    if (session.user.role !== 'principal') {
      return NextResponse.json(
        { error: 'Forbidden: Only principals can generate timetables' },
        { status: 403 }
      );
    }

    // 3. Parse and validate request body
    const body: GenerateRequest = await req.json();
    
    if (!body.classIds?.length || !body.weekStart) {
      return NextResponse.json(
        { error: 'classIds and weekStart are required' },
        { status: 400 }
      );
    }

    // 4. Safety checks
    const [teachersCount, classesCount, subjectsCount] = await Promise.all([
      prisma.teacher.count({ where: { isActive: true } }),
      prisma.classGroup.count(),
      prisma.subject.count()
    ]);

    if (teachersCount === 0 || classesCount === 0 || subjectsCount === 0) {
      return NextResponse.json(
        { 
          error: 'Cannot generate timetable: Missing required data',
          details: {
            teachers: teachersCount,
            classes: classesCount,
            subjects: subjectsCount
          }
        },
        { status: 400 }
      );
    }

    // 5. Prepare input data for Python generator
    const organizationId = session.user.organizationId;
    
    const [teachers, classes, subjects, periodSlots] = await Promise.all([
      prisma.teacher.findMany({ 
        where: { organizationId, isActive: true },
        include: { subjects: true }
      }),
      prisma.classGroup.findMany({ where: { organizationId } }),
      prisma.subject.findMany({ where: { organizationId } }),
      prisma.periodSlot.findMany({ where: { organizationId } })
    ]);

    const inputData = {
      organizationId,
      classIds: body.classIds,
      weekStart: body.weekStart,
      constraints: body.constraints,
      teachers: teachers.map(t => ({
        id: t.id,
        name: t.name,
        maxPeriodsPerDay: t.maxPeriodsPerDay,
        subjects: t.subjects.map(s => s.id)
      })),
      classes: classes.map(c => ({
        id: c.id,
        name: c.name
      })),
      subjects: subjects.map(s => ({
        id: s.id,
        name: s.name,
        shortName: s.shortName,
        weeklyHours: s.weeklyHours
      })),
      periodSlots: periodSlots.map(p => ({
        id: p.id,
        dayOfWeek: p.dayOfWeek,
        startTime: p.startTime,
        endTime: p.endTime,
        isBreak: p.isBreak
      }))
    };

    // 6. Execute Python generator
    const result = await new Promise<any>((resolve, reject) => {
      const py = spawn("python", ["generatingalgo/api_scheduler.py"]);
      
      let resultData = '';
      let errorData = '';

      py.stdin.write(JSON.stringify(inputData));
      py.stdin.end();

      py.stdout.on("data", (data) => {
        resultData += data.toString();
      });

      py.stderr.on("data", (data) => {
        errorData += data.toString();
      });

      py.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python script failed: ${errorData}`));
          return;
        }

        try {
          const parsed = JSON.parse(resultData);
          resolve(parsed);
        } catch (err) {
          reject(new Error(`Failed to parse Python output: ${err}`));
        }
      });

      py.on("error", (err) => {
        reject(new Error(`Failed to spawn Python process: ${err}`));
      });
    });

    // 7. Validate and convert generated timetable
    if (!result.timetable || !Array.isArray(result.timetable)) {
      return NextResponse.json(
        { error: 'Invalid timetable output from generator' },
        { status: 500 }
      );
    }

    // 8. Conflict protection validation
    const conflicts = await validateConflicts(result.timetable, organizationId);
    if (conflicts.length > 0) {
      return NextResponse.json(
        { 
          error: 'Generated timetable has conflicts',
          conflicts
        },
        { status: 400 }
      );
    }

    // 9. Save to database
    const savedEntries = await prisma.$transaction(async (tx) => {
      // Clear existing entries for the selected classes and week
      const weekStartDate = new Date(body.weekStart);
      await tx.timetableEntry.deleteMany({
        where: {
          classGroupId: { in: body.classIds },
          organizationId,
          createdAt: {
            gte: weekStartDate
          }
        }
      });

      // Create new timetable entries
      const entries = result.timetable.map((entry: any) => ({
        organizationId,
        classGroupId: entry.classId,
        periodSlotId: entry.periodSlotId,
        teacherId: entry.teacherId,
        subjectId: entry.subjectId,
        room: entry.room
      }));

      return tx.timetableEntry.createMany({
        data: entries
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Timetable generated successfully',
      entriesCreated: savedEntries.count,
      weekStart: body.weekStart,
      classIds: body.classIds
    });

  } catch (error) {
    console.error('Timetable generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate timetable', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function validateConflicts(timetable: any[], organizationId: string) {
  const conflicts: string[] = [];
  
  // Check teacher double booking
  const teacherSchedule = new Map<string, Set<string>>();
  
  // Check room double booking  
  const roomSchedule = new Map<string, Set<string>>();
  
  for (const entry of timetable) {
    const periodKey = `${entry.periodSlotId}`;
    
    // Teacher conflicts
    if (entry.teacherId) {
      if (!teacherSchedule.has(entry.teacherId)) {
        teacherSchedule.set(entry.teacherId, new Set());
      }
      if (teacherSchedule.get(entry.teacherId)?.has(periodKey)) {
        conflicts.push(`Teacher ${entry.teacherId} double booked at period ${periodKey}`);
      }
      teacherSchedule.get(entry.teacherId)?.add(periodKey);
    }
    
    // Room conflicts
    if (entry.room) {
      if (!roomSchedule.has(entry.room)) {
        roomSchedule.set(entry.room, new Set());
      }
      if (roomSchedule.get(entry.room)?.has(periodKey)) {
        conflicts.push(`Room ${entry.room} double booked at period ${periodKey}`);
      }
      roomSchedule.get(entry.room)?.add(periodKey);
    }
  }
  
  return conflicts;
}
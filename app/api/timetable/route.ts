import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type TimetableSlot = {
  id: string;
  day: string;
  period: number;
  subject: string;
  teacher: string;
  room: string;
};

type TimetableData = Record<string, Record<string, TimetableSlot[]>>;

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_TO_PERIOD_INDEX: Record<string, number> = {
  '08:00': 0,
  '09:00': 1,
  '10:00': 2,
  '11:35': 3,
  '12:35': 4,
  '13:35': 5,
  '14:35': 6,
  '15:35': 7,
};

function parseClassGroupName(classGroupName: string) {
  const parts = classGroupName.split('-');
  return {
    classNum: parts[0] ?? classGroupName,
    section: parts[1] ?? 'A',
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId') ?? undefined;

    const entries = await prisma.timetableEntry.findMany({
      where: classId
        ? {
            classGroup: {
              name: classId,
            },
          }
        : undefined,
      include: {
        classGroup: true,
        teacher: true,
        subject: true,
        periodSlot: true,
      },
      orderBy: [
        { classGroup: { name: 'asc' } },
        { periodSlot: { dayOfWeek: 'asc' } },
        { periodSlot: { startTime: 'asc' } },
      ],
    });

    const timetable: TimetableData = {};
    for (const entry of entries) {
      const { classNum, section } = parseClassGroupName(entry.classGroup.name);
      const day = DAY_NAMES[entry.periodSlot.dayOfWeek] ?? entry.periodSlot.dayOfWeek.toString();
      const period = TIME_TO_PERIOD_INDEX[entry.periodSlot.startTime] ?? 0;
      const slot: TimetableSlot = {
        id: entry.id,
        day,
        period,
        subject: entry.subject?.name ?? 'TBD',
        teacher: entry.teacher?.name ?? 'TBD',
        room: entry.room ?? 'Room 101',
      };

      timetable[classNum] = timetable[classNum] ?? {};
      timetable[classNum][section] = timetable[classNum][section] ?? [];
      timetable[classNum][section].push(slot);
    }

    return NextResponse.json(timetable);
  } catch (error) {
    console.error('Failed to fetch timetable:', error);
    return NextResponse.json({ error: 'Failed to fetch timetable' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const classId = body.classId as string;
    const day = body.day as string;
    const time = body.time as string;
    const subjectName = body.subject as string;
    const teacherName = body.teacher as string;
    const room = body.room as string;
    const slotId = body.slotId as string | undefined;

    if (!classId || !day || !time || !subjectName || !teacherName || !room) {
      return NextResponse.json(
        { error: 'classId, day, time, subject, teacher and room are required' },
        { status: 400 },
      );
    }

    const classGroup = await prisma.classGroup.findFirst({
      where: { name: classId },
    });
    if (!classGroup) {
      return NextResponse.json({ error: 'Class group not found' }, { status: 404 });
    }

    const periodSlot = await prisma.periodSlot.findFirst({
      where: {
        organizationId: classGroup.organizationId,
        dayOfWeek: Object.keys(DAY_NAMES).find((index) => DAY_NAMES[Number(index)] === day)
          ? Number(Object.keys(DAY_NAMES).find((index) => DAY_NAMES[Number(index)] === day))
          : undefined,
        startTime: time,
      },
    });
    if (!periodSlot) {
      return NextResponse.json({ error: 'Period slot not found' }, { status: 404 });
    }

    const teacher = await prisma.teacher.findFirst({
      where: {
        organizationId: classGroup.organizationId,
        name: teacherName,
      },
    });

    const subject = await prisma.subject.findFirst({
      where: {
        organizationId: classGroup.organizationId,
        name: subjectName,
      },
    });

    const updatedEntry = slotId
      ? await prisma.timetableEntry.updateMany({
          where: { id: slotId, classGroupId: classGroup.id },
          data: {
            teacherId: teacher?.id ?? undefined,
            subjectId: subject?.id ?? undefined,
            room,
          },
        })
      : await prisma.timetableEntry.create({
          data: {
            organizationId: classGroup.organizationId,
            classGroupId: classGroup.id,
            periodSlotId: periodSlot.id,
            teacherId: teacher?.id ?? undefined,
            subjectId: subject?.id ?? undefined,
            room,
          },
        });

    return NextResponse.json({ success: true, entry: updatedEntry });
  } catch (error) {
    console.error('Failed to update timetable:', error);
    return NextResponse.json({ error: 'Failed to update timetable' }, { status: 500 });
  }
}



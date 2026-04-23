import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

type InputSubject = {
  id: string;
  name: string;
  teacher: string;
  maxPeriods: number;
  priority: number;
  isLab: boolean;
  sequence: number;
};

type SectionConfig = {
  id: string;
  name: string;
  subjects: InputSubject[];
};

type ClassConfig = {
  id: string;
  number: string;
  sections: SectionConfig[];
};

type LegacySchoolPayload = Record<
  string,
  Record<
    string,
    Record<
      string,
      {
        teacher?: string;
        limit?: number;
        lab?: boolean;
      }
    >
  >
>;

type GeneratePayload = {
  classes?: ClassConfig[];
  school?: LegacySchoolPayload;
  week?: string;
};

type GeneratedSlot = {
  classNum: string;
  section: string;
  day: string;
  period: number;
  subject: string;
  teacher: string;
  room: string;
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIOD_TIMES = ["08:00", "09:00", "10:00", "11:35", "12:35", "13:35", "14:35", "15:35"];

function normalizeTeacherEmail(name: string) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `${base || "teacher"}@schooltime.local`;
}

function normalizeSubjectShortName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join("")
    .slice(0, 4) || name.slice(0, 4);
}

function fromLegacySchool(school: LegacySchoolPayload): ClassConfig[] {
  return Object.entries(school).map(([classKey, sections]) => {
    const [number] = classKey.split("-");
    return {
      id: classKey,
      number,
      sections: Object.entries(sections).map(([sectionName, subjects]) => ({
        id: `${classKey}-${sectionName}`,
        name: sectionName,
        subjects: Object.entries(subjects).map(([subjectName, details], index) => ({
          id: `${classKey}-${sectionName}-${subjectName}`,
          name: subjectName,
          teacher: details.teacher ?? "",
          maxPeriods: Math.max(1, details.limit ?? 1),
          priority: 3,
          isLab: Boolean(details.lab),
          sequence: index + 1,
        })),
      })),
    };
  });
}

function getHomeRoom(classNum: string, section: string) {
  let cCode = Number(classNum);
  if (isNaN(cCode)) cCode = 10;
  let sCode = section.charCodeAt(0) - 64; 
  if (sCode < 1) sCode = 1;
  return `Room ${cCode * 100 + sCode}`;
}

function getSubjectInstances(classes: ClassConfig[]) {
  return classes.flatMap((cls) =>
    cls.sections.flatMap((section) =>
      section.subjects
        .filter((sub) => sub.name.trim())
        .flatMap((sub) =>
          Array.from({ length: Math.max(1, sub.maxPeriods) }, () => ({
            classNum: cls.number,
            section: section.name,
            subject: sub.name.trim(),
            teacher: sub.teacher.trim() || "N/A",
            priority: Math.max(1, Math.min(5, sub.priority)),
            isLab: Boolean(sub.isLab),
            sequence: sub.sequence,
          })),
        ),
    ),
  );
}

import { spawn } from "child_process";
import path from "path";

async function buildSchedule(instances: any[], config: any) {
  return new Promise((resolve, reject) => {
    const pythonPath = process.platform === "win32" ? "python" : "python3";
    const scriptPath = path.join(process.cwd(), "generatingalgo", "genetic_scheduler.py");
    
    const payload = {
      classes: instances,
      config: {
        totalPeriodsPerDay: config.totalPeriodsPerDay,
        bellTimes: config.bellTimes,
        labs: config.labs
      }
    };

    const pyProcess = spawn(pythonPath, [scriptPath]);
    
    let result = "";
    let error = "";

    pyProcess.stdin.write(JSON.stringify(payload));
    pyProcess.stdin.end();

    pyProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pyProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pyProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python script failed with code ${code}: ${error}`));
        return;
      }
      try {
        const parsed = JSON.parse(result);
        if (parsed.error) {
          reject(new Error(parsed.error));
        } else {
          // Normalize the output to match the expected GeneratedSlot[]
          const assigned: GeneratedSlot[] = [];
          for (const clsNum in parsed) {
            for (const secName in parsed[clsNum]) {
              for (const slot of parsed[clsNum][secName]) {
                assigned.push({
                  classNum: clsNum,
                  section: secName,
                  day: slot.day,
                  period: slot.period,
                  subject: slot.subject,
                  teacher: slot.teacher,
                  room: slot.room
                });
              }
            }
          }
          resolve(assigned);
        }
      } catch (e) {
        reject(new Error(`Failed to parse Python output: ${result}`));
      }
    });
  });
}

async function getDefaultOrganization() {
  const existingOrganization = await prisma.organization.findFirst();
  if (existingOrganization) return existingOrganization;
  return prisma.organization.create({
    data: {
      name: "SchoolTime Default Organization",
      code: "schooltime-default",
      email: "support@schooltime.local",
    },
  });
}

async function getOrCreateTeacher(name: string, organizationId: string) {
  const value = name.trim();
  if (!value) return null;

  const existing = await prisma.teacher.findFirst({
    where: {
      organizationId,
      name: value,
    },
  });
  if (existing) return existing;

  let email = normalizeTeacherEmail(value);
  let suffix = 1;
  while (await prisma.teacher.findUnique({ where: { email } })) {
    email = normalizeTeacherEmail(`${value}${suffix}`);
    suffix += 1;
  }

  return prisma.teacher.create({
    data: {
      organizationId,
      name: value,
      email,
      department: "Timetable",
      maxPeriodsPerDay: 8,
    },
  });
}

async function getOrCreateSubject(name: string, organizationId: string) {
  const value = name.trim();
  if (!value) return null;

  const existing = await prisma.subject.findFirst({
    where: {
      organizationId,
      name: value,
    },
  });
  if (existing) return existing;

  return prisma.subject.create({
    data: {
      organizationId,
      name: value,
      shortName: normalizeSubjectShortName(value),
      weeklyHours: 5,
    },
  });
}

async function getOrCreateClassGroup(name: string, organizationId: string) {
  const value = name.trim();
  const existing = await prisma.classGroup.findFirst({
    where: {
      organizationId,
      name: value,
    },
  });
  if (existing) return existing;

  return prisma.classGroup.create({
    data: {
      organizationId,
      name: value,
    },
  });
}

async function ensurePeriodSlotIds(organizationId: string, bellTimes: any[]) {
  const map = new Map<string, string>();

  for (const [dayIndex, day] of DAYS.entries()) {
    const dayOfWeek = dayIndex + 1;
    for (const bt of bellTimes) {
      if (bt.isBreak) continue;
      
      const startTime = bt.startTime;
      const endTime = bt.endTime;
      const uniqueKey = `${day}-${startTime}`;
      
      const slot = await prisma.periodSlot.upsert({
        where: {
          organizationId_dayOfWeek_startTime: {
            organizationId,
            dayOfWeek,
            startTime,
          },
        },
        update: {
          endTime,
          isBreak: false,
        },
        create: {
          organizationId,
          dayOfWeek,
          startTime,
          endTime,
          isBreak: false,
        },
      });
      map.set(uniqueKey, slot.id);
    }
  }

  return map;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GeneratePayload;
    const classes = body.classes && body.classes.length > 0 ? body.classes : body.school ? fromLegacySchool(body.school) : [];

    if (!Array.isArray(classes) || classes.length === 0) {
      return NextResponse.json(
        {
          error: "No class configuration provided. Please submit classes, sections, subjects, teachers, weekly periods and priorities.",
        },
        { status: 400 },
      );
    }

    const validInstances = getSubjectInstances(classes);
    if (validInstances.length === 0) {
      return NextResponse.json(
        { error: "No valid subjects found in the submitted configuration." },
        { status: 400 },
      );
    }

    const schoolConfig = await prisma.schoolConfig.findFirst({
      include: { bellTimes: true, labs: true }
    });
    
    if (!schoolConfig) {
      return NextResponse.json({ error: "School configuration not found. Please set up bell times and labs first." }, { status: 400 });
    }

    const generatedSchedule = await buildSchedule(validInstances, schoolConfig) as GeneratedSlot[];
    const organization = await getDefaultOrganization();
    
    // Create a map of period index to start time based on DB config
    const dbPeriodTimes = schoolConfig.bellTimes
      .filter(bt => !bt.isBreak)
      .sort((a, b) => a.periodNumber - b.periodNumber)
      .map(bt => bt.startTime);

    const periodSlotIds = await ensurePeriodSlotIds(organization.id, schoolConfig.bellTimes);

    const classGroupMap = new Map<string, { id: string; name: string }>();
    const teacherMap = new Map<string, { id: string; name: string }>();
    const subjectMap = new Map<string, { id: string; name: string }>();

    for (const slot of generatedSchedule) {
      const classGroupName = `${slot.classNum}-${slot.section}`;
      if (!classGroupMap.has(classGroupName)) {
        const classGroup = await getOrCreateClassGroup(classGroupName, organization.id);
        classGroupMap.set(classGroupName, classGroup);
      }
      if (slot.teacher && slot.teacher !== "N/A" && !teacherMap.has(slot.teacher)) {
        const teacher = await getOrCreateTeacher(slot.teacher, organization.id);
        if (teacher) teacherMap.set(slot.teacher, teacher);
      }
      if (slot.subject && !subjectMap.has(slot.subject)) {
        const subject = await getOrCreateSubject(slot.subject, organization.id);
        if (subject) subjectMap.set(slot.subject, subject);
      }
    }

    const classGroupIds = Array.from(classGroupMap.values()).map((group) => group.id);
    await prisma.timetableEntry.deleteMany({
      where: {
        classGroupId: {
          in: classGroupIds,
        },
      },
    });

    const createData = generatedSchedule.map((slot) => {
      const classGroupName = `${slot.classNum}-${slot.section}`;
      // Find the startTime for this period index from schoolConfig
      const periodConfig = schoolConfig.bellTimes
        .filter(bt => !bt.isBreak)
        .sort((a, b) => a.periodNumber - b.periodNumber)[slot.period];
      
      const startTime = periodConfig?.startTime ?? "08:00";
      const periodSlotId = periodSlotIds.get(`${slot.day}-${startTime}`);
      
      return {
        id: `${slot.classNum}-${slot.section}-${slot.day}-${slot.period}`,
        organizationId: organization.id,
        classGroupId: classGroupMap.get(classGroupName)!.id,
        periodSlotId: periodSlotId ?? "",
        teacherId: teacherMap.get(slot.teacher)?.id ?? null,
        subjectId: subjectMap.get(slot.subject)?.id ?? null,
        room: slot.room,
      };
    });

    await prisma.timetableEntry.createMany({
      data: createData,
    });

    const responsePayload = generatedSchedule.reduce<Record<string, Record<string, GeneratedSlot[]>>>((acc, slot) => {
      acc[slot.classNum] = acc[slot.classNum] ?? {};
      acc[slot.classNum][slot.section] = acc[slot.classNum][slot.section] ?? [];
      acc[slot.classNum][slot.section].push(slot);
      return acc;
    }, {});

    return NextResponse.json({ timetable: responsePayload });
  } catch (error: any) {
    console.error("Generate timetable error:", error);
    return NextResponse.json({ error: error.message ?? "Failed to generate timetable" }, { status: 500 });
  }
}

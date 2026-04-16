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

function buildSchedule(instances: Array<{
  classNum: string;
  section: string;
  subject: string;
  teacher: string;
  priority: number;
  isLab: boolean;
  sequence: number;
}>, maxRetries = 100) {
  const allSlots = DAYS.flatMap((day) =>
    PERIOD_TIMES.map((time, period) => ({
      day,
      period,
      time,
      slotKey: `${day}-${period}`,
    })),
  );

  const LABS = ["Physics Lab", "Chemistry Lab", "Computer Lab 1", "Computer Lab 2", "Bio Lab"];

  const sortedInstances = [...instances].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    if (b.isLab !== a.isLab) return Number(b.isLab) - Number(a.isLab);
    if (a.classNum !== b.classNum) return a.classNum.localeCompare(b.classNum);
    if (a.section !== b.section) return a.section.localeCompare(b.section);
    return a.subject.localeCompare(b.subject);
  });

  let bestError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const teacherOccupancy = new Map<string, Set<string>>();
    const classOccupancy = new Map<string, Set<string>>();
    const roomOccupancy = new Map<string, Set<string>>();
    const assigned: GeneratedSlot[] = [];
    let success = true;

    for (const instance of sortedInstances) {
      const classKey = `${instance.classNum}-${instance.section}`;
      const teacherKey = instance.teacher && instance.teacher !== "N/A" ? instance.teacher : "";

      let slot = null;
      let assignedRoom = "";

      // Iterate through slots. Use a semi-random approach to avoid getting stuck in linear traps
      const shuffledSlots = [...allSlots].sort(() => Math.random() - 0.5);

      for (const possibleSlot of shuffledSlots) {
        if (classOccupancy.get(classKey)?.has(possibleSlot.slotKey)) continue;
        if (teacherKey && teacherOccupancy.get(teacherKey)?.has(possibleSlot.slotKey)) continue;

        if (instance.isLab) {
          const availableLab = LABS.find(lab => !roomOccupancy.get(lab)?.has(possibleSlot.slotKey));
          if (availableLab) {
            slot = possibleSlot;
            assignedRoom = availableLab;
            break;
          }
        } else {
          slot = possibleSlot;
          assignedRoom = getHomeRoom(instance.classNum, instance.section);
          break;
        }
      }

      if (!slot) {
        // If we cannot find a slot at all, record the error and break to retry the whole batch
        bestError = new Error(`Not enough timetable slots to schedule ${instance.subject} for Class ${instance.classNum}-${instance.section}. Teacher limit or Lab capacity exceeded.`);
        success = false;
        break;
      }

      assigned.push({
        classNum: instance.classNum,
        section: instance.section,
        day: slot.day,
        period: slot.period,
        subject: instance.subject,
        teacher: instance.teacher,
        room: assignedRoom,
      });

      const cSet = classOccupancy.get(classKey) ?? new Set<string>();
      cSet.add(slot.slotKey);
      classOccupancy.set(classKey, cSet);

      if (teacherKey) {
        const tSet = teacherOccupancy.get(teacherKey) ?? new Set<string>();
        tSet.add(slot.slotKey);
        teacherOccupancy.set(teacherKey, tSet);
      }
      
      if (instance.isLab) {
        const rSet = roomOccupancy.get(assignedRoom) ?? new Set<string>();
        rSet.add(slot.slotKey);
        roomOccupancy.set(assignedRoom, rSet);
      }
    }

    if (success) {
      return assigned;
    }
  }

  throw bestError || new Error("Failed to generate timetable due to unresolvable constraints.");
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

async function ensurePeriodSlotIds(organizationId: string) {
  const map = new Map<string, string>();

  for (const [dayIndex, day] of DAYS.entries()) {
    const dayOfWeek = dayIndex + 1;
    for (const [period, startTime] of PERIOD_TIMES.entries()) {
      const endTime =
        period === 0
          ? "08:50"
          : period === 1
          ? "09:50"
          : period === 2
          ? "10:50"
          : period === 3
          ? "12:25"
          : period === 4
          ? "13:25"
          : period === 5
          ? "14:25"
          : period === 6
          ? "15:25"
          : "16:25";
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

    const generatedSchedule = buildSchedule(validInstances);
    const organization = await getDefaultOrganization();
    const periodSlotIds = await ensurePeriodSlotIds(organization.id);

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
      const periodSlotId = periodSlotIds.get(`${slot.day}-${PERIOD_TIMES[slot.period]}`);
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

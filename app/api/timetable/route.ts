import { NextResponse } from 'next/server';

type WeekKey = 'current' | 'next' | 'previous';

export interface TimeSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

type ClassKey = '10-A' | '10-B' | '9-A' | '9-B' | '8-A';

type TimetableStore = Record<ClassKey, Record<WeekKey, TimeSlot[]>>;

const baseWeek: TimeSlot[] = [
  // Monday
  { id: '1', day: 'Monday', time: '08:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
  { id: '2', day: 'Monday', time: '09:00 AM', subject: 'English', teacher: 'Ms. Johnson', room: '102' },
  { id: '3', day: 'Monday', time: '10:00 AM', subject: 'Science', teacher: 'Dr. Brown', room: '103' },
  { id: '4', day: 'Monday', time: '11:00 AM', subject: 'History', teacher: 'Mr. Davis', room: '104' },
  { id: '5', day: 'Monday', time: '12:00 PM', subject: 'Physical Education', teacher: 'Mr. Wilson', room: 'Gym' },

  // Tuesday
  { id: '6', day: 'Tuesday', time: '08:00 AM', subject: 'English', teacher: 'Ms. Johnson', room: '102' },
  { id: '7', day: 'Tuesday', time: '09:00 AM', subject: 'Science', teacher: 'Dr. Brown', room: '103' },
  { id: '8', day: 'Tuesday', time: '10:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
  { id: '9', day: 'Tuesday', time: '11:00 AM', subject: 'Computer Science', teacher: 'Ms. Lee', room: '105' },
  { id: '10', day: 'Tuesday', time: '12:00 PM', subject: 'Art', teacher: 'Mrs. Garcia', room: '106' },

  // Wednesday
  { id: '11', day: 'Wednesday', time: '08:00 AM', subject: 'Science', teacher: 'Dr. Brown', room: '103' },
  { id: '12', day: 'Wednesday', time: '09:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
  { id: '13', day: 'Wednesday', time: '10:00 AM', subject: 'History', teacher: 'Mr. Davis', room: '104' },
  { id: '14', day: 'Wednesday', time: '11:00 AM', subject: 'Physical Education', teacher: 'Mr. Wilson', room: 'Gym' },
  { id: '15', day: 'Wednesday', time: '12:00 PM', subject: 'Music', teacher: 'Ms. Martinez', room: '107' },

  // Thursday
  { id: '16', day: 'Thursday', time: '08:00 AM', subject: 'Computer Science', teacher: 'Ms. Lee', room: '105' },
  { id: '17', day: 'Thursday', time: '09:00 AM', subject: 'English', teacher: 'Ms. Johnson', room: '102' },
  { id: '18', day: 'Thursday', time: '10:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith', room: '101' },
  { id: '19', day: 'Thursday', time: '11:00 AM', subject: 'Science', teacher: 'Dr. Brown', room: '103' },
  { id: '20', day: 'Thursday', time: '12:00 PM', subject: 'History', teacher: 'Mr. Davis', room: '104' },

  // Friday
  { id: '21', day: 'Friday', time: '08:00 AM', subject: 'Art', teacher: 'Mrs. Garcia', room: '106' },
  { id: '22', day: 'Friday', time: '09:00 AM', subject: 'Music', teacher: 'Ms. Martinez', room: '107' },
  { id: '23', day: 'Friday', time: '10:00 AM', subject: 'Physical Education', teacher: 'Mr. Wilson', room: 'Gym' },
  { id: '24', day: 'Friday', time: '11:00 AM', subject: 'Computer Science', teacher: 'Ms. Lee', room: '105' },
  { id: '25', day: 'Friday', time: '12:00 PM', subject: 'Assembly', teacher: 'Principal', room: 'Main Hall' },
];

let timetableStore: TimetableStore = {
  '10-A': {
    current: baseWeek,
    next: baseWeek.map((slot) => ({
      ...slot,
      id: `n-${slot.id}`,
      subject: slot.subject === 'Mathematics' ? 'Revision - Mathematics' : slot.subject,
    })),
    previous: baseWeek.map((slot) => ({
      ...slot,
      id: `p-${slot.id}`,
      subject: slot.subject === 'Mathematics' ? 'Term Test - Mathematics' : slot.subject,
    })),
  },
  '10-B': {
    current: baseWeek.map((slot) => ({
      ...slot,
      id: `10b-${slot.id}`,
      teacher: slot.teacher.replace('Mr. Smith', 'Mr. Kumar'),
    })),
    next: baseWeek.map((slot) => ({
      ...slot,
      id: `10b-n-${slot.id}`,
      teacher: slot.teacher.replace('Mr. Smith', 'Mr. Kumar'),
    })),
    previous: baseWeek.map((slot) => ({
      ...slot,
      id: `10b-p-${slot.id}`,
      teacher: slot.teacher.replace('Mr. Smith', 'Mr. Kumar'),
    })),
  },
  '9-A': {
    current: baseWeek.map((slot) => ({
      ...slot,
      id: `9a-${slot.id}`,
      subject: slot.subject === 'Science' ? 'General Science' : slot.subject,
    })),
    next: baseWeek.map((slot) => ({
      ...slot,
      id: `9a-n-${slot.id}`,
      subject: slot.subject === 'Science' ? 'General Science' : slot.subject,
    })),
    previous: baseWeek.map((slot) => ({
      ...slot,
      id: `9a-p-${slot.id}`,
      subject: slot.subject === 'Science' ? 'General Science' : slot.subject,
    })),
  },
  '9-B': {
    current: baseWeek.map((slot, idx) => ({
      ...slot,
      id: `9b-${slot.id}`,
      room: slot.room === '101' ? '201' : slot.room,
    })),
    next: baseWeek.map((slot, idx) => ({
      ...slot,
      id: `9b-n-${slot.id}`,
      room: slot.room === '101' ? '201' : slot.room,
    })),
    previous: baseWeek.map((slot, idx) => ({
      ...slot,
      id: `9b-p-${slot.id}`,
      room: slot.room === '101' ? '201' : slot.room,
    })),
  },
  '8-A': {
    current: baseWeek.map((slot) => ({
      ...slot,
      id: `8a-${slot.id}`,
      subject: slot.subject === 'Computer Science' ? 'Robotics' : slot.subject,
    })),
    next: baseWeek.map((slot) => ({
      ...slot,
      id: `8a-n-${slot.id}`,
      subject: slot.subject === 'Computer Science' ? 'Robotics' : slot.subject,
    })),
    previous: baseWeek.map((slot) => ({
      ...slot,
      id: `8a-p-${slot.id}`,
      subject: slot.subject === 'Computer Science' ? 'Robotics' : slot.subject,
    })),
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const classId = (searchParams.get('classId') ?? '10-A') as ClassKey;
  const week = (searchParams.get('week') ?? 'current') as WeekKey;

  const classTimetable = timetableStore[classId];

  if (!classTimetable) {
    return NextResponse.json(
      { error: 'Class not found' },
      { status: 404 },
    );
  }

  const weekTimetable = classTimetable[week];

  return NextResponse.json({
    classId,
    week,
    slots: weekTimetable,
  });
}

// PATCH /api/timetable
// Body: { classId, week, slotId?, day, time, subject, teacher, room }
// If slotId exists, update matching slot; otherwise create a new one.
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const classId = (body.classId ?? '10-A') as ClassKey;
    const week = (body.week ?? 'current') as WeekKey;

    if (!timetableStore[classId]) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    const { slotId, day, time, subject, teacher, room } = body as {
      slotId?: string;
      day: string;
      time: string;
      subject: string;
      teacher: string;
      room: string;
    };

    if (!day || !time || !subject || !teacher || !room) {
      return NextResponse.json(
        { error: 'day, time, subject, teacher and room are required' },
        { status: 400 },
      );
    }

    const currentSlots = timetableStore[classId][week] ?? [];
    let updatedSlots: TimeSlot[];

    if (slotId) {
      // Update existing
      updatedSlots = currentSlots.map((slot) =>
        slot.id === slotId
          ? { ...slot, day, time, subject, teacher, room }
          : slot,
      );
    } else {
      // Create new
      const newSlot: TimeSlot = {
        id: `custom-${Date.now()}`,
        day,
        time,
        subject,
        teacher,
        room,
      };
      updatedSlots = [...currentSlots, newSlot];
    }

    timetableStore = {
      ...timetableStore,
      [classId]: {
        ...timetableStore[classId],
        [week]: updatedSlots,
      },
    };

    return NextResponse.json(
      {
        classId,
        week,
        slots: updatedSlots,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update timetable' },
      { status: 500 },
    );
  }
}



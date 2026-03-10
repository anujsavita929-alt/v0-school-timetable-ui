import { NextResponse } from 'next/server';

// This is a simple in-memory search over demo data.
// In a production system, this would query the database.

const students = [
  {
    id: '1',
    name: 'Arun Kumar',
    studentId: 'STU001',
    class: '10-A',
    email: 'arun.kumar@school.com',
  },
  {
    id: '2',
    name: 'Priya Singh',
    studentId: 'STU002',
    class: '10-A',
    email: 'priya.singh@school.com',
  },
  {
    id: '3',
    name: 'Rahul Patel',
    studentId: 'STU003',
    class: '10-B',
    email: 'rahul.patel@school.com',
  },
];

const teachers = [
  {
    id: '1',
    name: 'Mr. Rajesh Smith',
    teacherId: 'TCH001',
    subject: 'Mathematics',
    email: 'rajesh.smith@school.com',
  },
  {
    id: '2',
    name: 'Ms. Priya Johnson',
    teacherId: 'TCH002',
    subject: 'English',
    email: 'priya.johnson@school.com',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') ?? '').toLowerCase().trim();

  if (!query) {
    return NextResponse.json({ students: [], teachers: [] });
  }

  const matchingStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(query) ||
      s.studentId.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query),
  );

  const matchingTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(query) ||
      t.teacherId.toLowerCase().includes(query) ||
      t.email.toLowerCase().includes(query),
  );

  return NextResponse.json({
    students: matchingStudents,
    teachers: matchingTeachers,
  });
}


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const teacherSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(3),
  email: z.string().email(),
  department: z.string().optional(),
  maxPeriodsPerDay: z.number().int().default(6),
});

// GET /api/teachers?organizationId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    const teachers = await prisma.teacher.findMany({
      where: organizationId ? { organizationId } : undefined,
      include: {
        subjects: true,
        organization: { select: { name: true } },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

// POST /api/teachers
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = teacherSchema.parse(body);

    const teacher = await prisma.teacher.create({
      data: validated,
      include: { subjects: true },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
  }
}
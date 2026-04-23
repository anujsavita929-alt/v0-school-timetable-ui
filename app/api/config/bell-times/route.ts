import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';
import { z } from 'zod';

const bellTimeSchema = z.object({
  periodNumber: z.number().int().min(1),
  label: z.string().min(1),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  isBreak: z.boolean().default(false),
  breakLabel: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (session?.user.role !== 'principal') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = bellTimeSchema.parse(body);

    const config = await prisma.schoolConfig.findFirst();
    if (!config) {
      return NextResponse.json({ error: 'School config not found' }, { status: 404 });
    }

    // Check if periodNumber already exists
    const existing = await prisma.bellTime.findUnique({
      where: {
        schoolConfigId_periodNumber: {
          schoolConfigId: config.id,
          periodNumber: validatedData.periodNumber,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Period number already exists' }, { status: 400 });
    }

    const bellTime = await prisma.bellTime.create({
      data: {
        ...validatedData,
        schoolConfigId: config.id,
      },
    });

    return NextResponse.json(bellTime);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to add bell time:', error);
    return NextResponse.json({ error: 'Failed to add bell time' }, { status: 500 });
  }
}

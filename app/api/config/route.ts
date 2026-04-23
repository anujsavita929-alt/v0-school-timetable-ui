import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';
import { z } from 'zod';

const configSchema = z.object({
  schoolName: z.string().min(1),
  totalPeriodsPerDay: z.number().int().min(1).max(12),
});

async function getSchoolConfig() {
  const config = await prisma.schoolConfig.findFirst({
    include: {
      bellTimes: {
        orderBy: { periodNumber: 'asc' },
      },
      labs: true,
    },
  });

  if (config) return config;

  // Upsert pattern: create default if not exists
  return prisma.schoolConfig.create({
    data: {
      schoolName: 'New School',
      totalPeriodsPerDay: 8,
    },
    include: {
      bellTimes: true,
      labs: true,
    },
  });
}

export async function GET() {
  try {
    const config = await getSchoolConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Failed to fetch config:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (session?.user.role !== 'principal') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = configSchema.parse(body);

    const config = await prisma.schoolConfig.findFirst();
    if (!config) {
       const newConfig = await prisma.schoolConfig.create({
         data: validatedData
       });
       return NextResponse.json(newConfig);
    }

    const updatedConfig = await prisma.schoolConfig.update({
      where: { id: config.id },
      data: validatedData,
    });

    return NextResponse.json(updatedConfig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to update config:', error);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}

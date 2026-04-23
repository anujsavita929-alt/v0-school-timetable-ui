import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';
import { z } from 'zod';

const labSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().min(1).optional(),
  labType: z.string().optional(),
  isAvailable: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (session?.user.role !== 'principal') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = labSchema.parse(body);

    const config = await prisma.schoolConfig.findFirst();
    if (!config) {
      return NextResponse.json({ error: 'School config not found' }, { status: 404 });
    }

    const lab = await prisma.lab.create({
      data: {
        ...validatedData,
        schoolConfigId: config.id,
      },
    });

    return NextResponse.json(lab);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to add lab:', error);
    return NextResponse.json({ error: 'Failed to add lab' }, { status: 500 });
  }
}

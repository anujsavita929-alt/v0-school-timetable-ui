import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';
import { z } from 'zod';

const bellTimeUpdateSchema = z.object({
  periodNumber: z.number().int().min(1).optional(),
  label: z.string().min(1).optional(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  isBreak: z.boolean().optional(),
  breakLabel: z.string().optional().nullable(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (session?.user.role !== 'principal') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const validatedData = bellTimeUpdateSchema.parse(body);

    const updatedBellTime = await prisma.bellTime.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedBellTime);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to update bell time:', error);
    return NextResponse.json({ error: 'Failed to update bell time' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (session?.user.role !== 'principal') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    await prisma.bellTime.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete bell time:', error);
    return NextResponse.json({ error: 'Failed to delete bell time' }, { status: 500 });
  }
}

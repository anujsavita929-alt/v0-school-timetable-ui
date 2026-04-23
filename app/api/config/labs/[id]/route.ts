import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';
import { z } from 'zod';

const labUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  capacity: z.number().int().min(1).optional(),
  labType: z.string().optional(),
  isAvailable: z.boolean().optional(),
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
    const validatedData = labUpdateSchema.parse(body);

    const updatedLab = await prisma.lab.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedLab);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to update lab:', error);
    return NextResponse.json({ error: 'Failed to update lab' }, { status: 500 });
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
    await prisma.lab.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete lab:', error);
    return NextResponse.json({ error: 'Failed to delete lab' }, { status: 500 });
  }
}

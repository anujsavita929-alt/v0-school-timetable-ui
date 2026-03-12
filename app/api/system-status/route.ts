import { NextResponse } from 'next/server';

// Mock system status - replace with actual Prisma implementation
export async function GET() {
  try {
    // Mock data for development
    const systemStatus = {
      teachers: 5,
      classes: 5,
      subjects: 8,
      canGenerate: true
    };

    // Check if system can generate timetable
    const canGenerate = systemStatus.teachers > 0 && systemStatus.classes > 0 && systemStatus.subjects > 0;
    
    return NextResponse.json({
      ...systemStatus,
      canGenerate
    });
  } catch (error) {
    console.error('Failed to fetch system status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system status' },
      { status: 500 }
    );
  }
}

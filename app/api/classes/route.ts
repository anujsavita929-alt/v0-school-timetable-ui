import { NextResponse } from 'next/server';

// Mock classes data - replace with actual Prisma implementation
export async function GET() {
  try {
    // Mock data for development
    const classes = [
      { id: 'class-1', name: '10-A' },
      { id: 'class-2', name: '10-B' },
      { id: 'class-3', name: '9-A' },
      { id: 'class-4', name: '9-B' },
      { id: 'class-5', name: '8-A' },
    ];

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Failed to fetch classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}
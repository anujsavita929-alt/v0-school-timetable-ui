import { NextResponse } from 'next/server';

type Organization = {
  id: string;
  name: string;
  code: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
};

// Simple in-memory store for demo purposes.
let organizations: Organization[] = [];

// GET /api/organizations
export async function GET() {
  return NextResponse.json(
    organizations.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );
}

// POST /api/organizations
export async function POST(request: Request) {
  const body = await request.json();
  const { name, code, email, phone, address } = body as {
    name?: string;
    code?: string;
    email?: string;
    phone?: string;
    address?: string;
  };

  if (!name || !code || !email) {
    return NextResponse.json(
      { error: 'name, code and email are required' },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const newOrg: Organization = {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `org-${Date.now()}`,
    name,
    code,
    email,
    phone: phone ?? null,
    address: address ?? null,
    createdAt: now,
  };

  organizations = [newOrg, ...organizations];

  return NextResponse.json(newOrg, { status: 201 });
}


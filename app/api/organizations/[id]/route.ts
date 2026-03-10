import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type Organization = {
  id: string;
  name: string;
  code: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
};

// Reuse the in-memory store from the main route file via module scoping.
// Note: In a real app, this would be Prisma-backed instead.
declare const organizations: Organization[];

interface RouteParams {
  params: {
    id: string;
  };
}

// PATCH /api/organizations/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const body = await request.json();
  const { name, code, email, phone, address } = body as Partial<Organization>;

  const index = organizations.findIndex((org) => org.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }

  const updated: Organization = {
    ...organizations[index],
    ...(name !== undefined ? { name } : {}),
    ...(code !== undefined ? { code } : {}),
    ...(email !== undefined ? { email } : {}),
    ...(phone !== undefined ? { phone } : {}),
    ...(address !== undefined ? { address } : {}),
  };

  organizations[index] = updated;

  return NextResponse.json(updated);
}

// DELETE /api/organizations/[id]
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const index = organizations.findIndex((org) => org.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }

  organizations.splice(index, 1);

  return NextResponse.json({ success: true });
}


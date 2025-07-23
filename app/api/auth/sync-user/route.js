import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();
  const { email, name, sub: auth0Id } = body.user; 

  if (!auth0Id || !email) {
    return NextResponse.json({ message: 'Missing auth0Id or email' }, { status: 400 });
  }

  const MANAGER_EMAIL = "vaishnavibhandari.128@gmail.com";

  const role = email === MANAGER_EMAIL ? 'MANAGER' : 'CARE_WORKER';

  const user = await prisma.user.upsert({
    where: { id: auth0Id },
    update: { name: name },
    create: {
      id: auth0Id,
      email: email,
      name: name,
      role: role,
    },
  });
  console.log(user)

  return NextResponse.json({ success: true, user });
}
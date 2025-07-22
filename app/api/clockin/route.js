import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();
  const { userId, lat, lng, note } = body;
  
  const now = new Date();
  const shift = await prisma.shift.create({
    data: {
      userId: userId,
      clockInTime: now,
      clockInLat: lat,
      clockInLng: lng,
      clockInNote: note || null,
    },
  });

  return NextResponse.json({ success: true, shift });
}
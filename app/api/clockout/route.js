import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();
  const { userId, lat, lng, note } = body;
  const now = new Date();

  // Find the last shift for this user that hasn't been clocked out yet
  const activeShift = await prisma.shift.findFirst({
    where: {
      userId: userId,
      clockOutTime: null,
    },
    orderBy: {
      clockInTime: 'desc',
    },
  });

  if (!activeShift) {
    return NextResponse.json({ success: false, message: 'No active shift found to clock out from.' }, { status: 400 });
  }

  const updatedShift = await prisma.shift.update({
    where: {
      id: activeShift.id,
    },
    data: {
      clockOutTime: now,
      clockOutLat: lat,
      clockOutLng: lng,
      clockOutNote: note || null,
    },
  });

  return NextResponse.json({ success: true, shift: updatedShift });
}
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();
  const { managerId, lat, lng, radiusKm } = body;

  if (!managerId) {
    return NextResponse.json({ success: false, message: 'Manager ID is required' }, { status: 401 });
  }
  if (!lat || !lng || !radiusKm) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }

  await prisma.locationPerimeter.upsert({
    where: { managerId: managerId },
    update: {
      centerLat: lat,
      centerLng: lng,
      radiusKm: radiusKm,
    },
    create: {
      managerId: managerId,
      centerLat: lat,
      centerLng: lng,
      radiusKm: radiusKm,
    },
  });

  return NextResponse.json({ success: true });
}
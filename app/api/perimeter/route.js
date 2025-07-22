import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  // Get the manager's ID from the request body
  const body = await request.json();
  const { managerId, lat, lng, radiusKm } = body;

  if (!managerId) {
    return NextResponse.json({ success: false, message: 'Manager ID is required' }, { status: 401 });
  }
  if (!lat || !lng || !radiusKm) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }

  // Use 'upsert' to create or update the perimeter
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
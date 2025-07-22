import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function POST(request) {
  const { lat, lng } = await request.json();

  if (!lat || !lng) {
    return NextResponse.json({ success: false, message: 'Missing location data' }, { status: 400 });
  }

  // Find the perimeter set by the manager
  const perimeter = await prisma.locationPerimeter.findFirst();
  console.log(perimeter)

  // If no perimeter is set, deny clock-in
  if (!perimeter) {
    return NextResponse.json({ success: false, allowed: false, message: 'No perimeter has been set by a manager.' });
  }

  const distance = calculateDistance(lat, lng, perimeter.centerLat, perimeter.centerLng);
  const isAllowed = distance <= perimeter.radiusKm;

  return NextResponse.json({ success: true, allowed: isAllowed });
}
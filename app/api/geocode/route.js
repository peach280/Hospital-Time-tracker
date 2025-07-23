import { NextResponse } from 'next/server';

export async function POST(request) {
  const { address } = await request.json();
  const apiKey = process.env.OPENCAGE_API_KEY;

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return NextResponse.json({ lat, lng });
    } else {
      return NextResponse.json({ error: 'Could not geocode address' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coordinates' }, { status: 500 });
  }
}
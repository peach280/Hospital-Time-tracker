import { NextResponse } from 'next/server';

export async function POST(request) {
  const { lat, lng } = await request.json();
  const apiKey = process.env.OPENCAGE_API_KEY;

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const address = data.results[0].formatted;
      return NextResponse.json({ address });
    } else {
      return NextResponse.json({ address: 'Address not found' });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}
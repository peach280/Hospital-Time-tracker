import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const allShifts = await prisma.shift.findMany({
      include: { user: true },
      orderBy: {
        clockInTime: 'desc',
      },
    });
    console.log(`API: Found ${allShifts.length} total shifts.`);

  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);

  // Fetch all shifts from the last week, including the user data
  // const shifts = await prisma.shift.findMany({
  //   include: { user: true },
  //   where: {
  //     clockInTime: {
  //       gte: oneWeekAgo,
  //     },
  //   },
  //   orderBy: {
  //     clockInTime: 'desc',
  //   },
  // });
  const shifts = allShifts.filter(shift => new Date(shift.clockInTime) >= oneWeekAgo);
  console.log(`API: Filtering down to ${shifts.length} shifts from the last week.`);

  // --- Calculate Analytics Data ---
  const totals = {}; // Total hours per staff
  const perDayCounts = {}; // Clock-ins per day
  let totalTime = 0;
  let totalShifts = 0;
  const perDayUniqueUsers = {};
  shifts.forEach((shift) => {
    const userName = shift.user.name;
    const userId = shift.userId;
    const day = new Date(shift.clockInTime).toISOString().split('T')[0]; 
    if (!perDayUniqueUsers[day]) 
    {
      perDayUniqueUsers[day] = new Set();
    }
    perDayUniqueUsers[day].add(userId);
    if (!totals[userName]) totals[userName] = 0;
    for (const day in perDayUniqueUsers) 
    {
      perDayCounts[day] = perDayUniqueUsers[day].size;
    }
    console.log(perDayCounts[new Date().toISOString().split('T')[0]])
    
    if (shift.clockOutTime) {
      const hours = (new Date(shift.clockOutTime) - new Date(shift.clockInTime)) / (1000 * 60 * 60);
      totals[userName] += hours;
      totalTime += hours;
      totalShifts++;
    }
  });

  const avgHours = totalShifts ? (totalTime / totalShifts) : 0;
  const currentlyClockedIn = shifts.filter(shift => !shift.clockOutTime);
  return NextResponse.json({
    shifts, // For the main history table
    currentlyClockedIn, // For the "currently clocked in" table
    analytics: {
        totals,
        perDayCounts,
        avgHours: avgHours.toFixed(2)
    }
  });
  
}
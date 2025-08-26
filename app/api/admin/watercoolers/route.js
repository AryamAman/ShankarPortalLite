import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import WaterCooler from '@/models/WaterCooler';

// Helper to verify admin status
async function verifyAdmin(request) {
  const token = await getToken({ req: request, secret: process.env.JWT_SECRET });
  return token && token.role === 'admin';
}

// API to UPDATE (or create) a water cooler's status
export async function POST(request) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  await dbConnect();

  try {
    const { name, tds } = await request.json();

    if (!name || !tds) {
      return NextResponse.json({ message: 'Name and TDS value are required.' }, { status: 400 });
    }

    // Find a cooler by name and update it, or create it if it doesn't exist.
    const updatedCooler = await WaterCooler.findOneAndUpdate(
      { name: name.trim() },
      { tds: tds.trim(), lastUpdated: new Date() },
      { 
        new: true, // Return the updated document
        upsert: true, // Create the document if it doesn't exist
        runValidators: true,
      }
    );

    return NextResponse.json({ success: true, data: updatedCooler });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
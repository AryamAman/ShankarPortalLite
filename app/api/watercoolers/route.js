import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import WaterCooler from '@/models/WaterCooler';

export async function GET() {
  await dbConnect();

  try {
    const coolers = await WaterCooler.find({}).sort({ name: 1 }); // Sort alphabetically by name
    return NextResponse.json({ success: true, data: coolers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Complaint from '@/models/Complaint';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await request.json();
    const { roomNumber, category, description } = body;

    if (!roomNumber || !category || !description) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const complaint = await Complaint.create({
      studentName: session.user.name,
      studentEmail: session.user.email,
      roomNumber,
      category,
      description,
    });

    return NextResponse.json({ success: true, data: complaint }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
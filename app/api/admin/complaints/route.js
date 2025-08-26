import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Complaint from '@/models/Complaint';

export async function GET(request) {
  // 1. Verify the JWT from the incoming request
  const token = await getToken({ req: request, secret: process.env.JWT_SECRET });

  // 2. Check if the token exists and if the user has the 'admin' role
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized: Access Denied' }, { status: 403 });
  }

  // 3. If authorized, proceed with the admin-only logic
  await dbConnect();
  try {
    // Example: Fetch all complaints (something only an admin should do)
    const allComplaints = await Complaint.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: allComplaints });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
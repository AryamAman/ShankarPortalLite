import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Complaint from '@/models/Complaint';

// Helper function to verify admin status
async function verifyAdmin(request) {
  const token = await getToken({ req: request, secret: process.env.JWT_SECRET });
  return token && token.role === 'admin';
}

// --- API to UPDATE a complaint's status ---
export async function PATCH(request, { params }) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  const { id } = params;
  const { status } = await request.json();

  if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
    return NextResponse.json({ message: 'Invalid status value' }, { status: 400 });
  }

  await dbConnect();

  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true } // This option returns the updated document
    );

    if (!updatedComplaint) {
      return NextResponse.json({ message: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedComplaint });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// --- API to DELETE a complaint ---
export async function DELETE(request, { params }) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  const { id } = params;
  await dbConnect();

  try {
    const deletedComplaint = await Complaint.findByIdAndDelete(id);

    if (!deletedComplaint) {
      return NextResponse.json({ message: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Complaint deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
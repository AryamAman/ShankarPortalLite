'use client';

import { useSession } from 'next-auth/react';
import { Loader2, LogIn } from 'lucide-react';
import ComplaintForm from '@/components/complaintForm'; // Ensure this path is correct

export default function HomePage() {
  const { data: session, status } = useSession();

  // Loading State
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    );
  }

  // Unauthenticated State (Enhanced UI)
  if (status === 'unauthenticated') {
    return (
      <div className="text-center h-[calc(100vh-200px)] flex flex-col justify-center items-center">
        <div className="bg-white p-8 sm:p-12 rounded-lg shadow-md border border-gray-200">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
            <LogIn className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Welcome to the Complaint Portal</h1>
          <p className="mt-2 text-black">Please sign in with your BITS Mail to continue.</p>
        </div>
      </div>
    );
  }

  // Authenticated State
  return (
    <div>
      <ComplaintForm />
    </div>
  );
}
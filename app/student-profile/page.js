'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { 
  Loader2, Inbox, Calendar, Hash, MessageSquare, 
  AlertCircle, Loader, CheckCircle 
} from 'lucide-react';

// Avatar component with fallback to the user's initial
const Avatar = ({ user }) => {
  if (user?.image) {
    return (
      <img
        src={user.image}
        alt="User Avatar"
        className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md"
      />
    );
  }
  
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';
  return (
    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center bg-gray-200 text-black font-bold text-4xl">
      {initial}
    </div>
  );
};

// StatusBadge component for consistent styling
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: { icon: AlertCircle, color: 'bg-yellow-200', label: 'Pending' },
    'In Progress': { icon: Loader, color: 'bg-blue-200', label: 'In Progress' },
    Resolved: { icon: CheckCircle, color: 'bg-green-200', label: 'Resolved' },
  };

  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full text-black ${config.color}`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
};

// Main Student Profile Page Component
export default function StudentProfilePage() {
  const { data: session, status: sessionStatus } = useSession();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (session) {
        setIsLoading(true);
        try {
          const res = await fetch('/api/complaints/me');
          const data = await res.json();
          if (data.success) {
            setComplaints(data.data);
          }
        } catch (error) {
          console.error("Failed to fetch complaints:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchComplaints();
  }, [session]);

  if (sessionStatus === 'loading' || isLoading) {
    return <div className="flex justify-center mt-16"><Loader2 className="w-10 h-10 animate-spin text-black" /></div>;
  }

  if (!session) {
    return <p className="text-center mt-16 text-black">You must be logged in to view this page.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto container px-4 py-8">
      {/* Profile Header Card */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-6 mb-8">
        <Avatar user={session.user} />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-black">{session.user.name}</h1>
          <p className="text-black mt-1">{session.user.email}</p>
        </div>
      </div>

      {/* Complaints List Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-black">My Submitted Complaints</h2>
        {complaints.length > 0 ? (
          <div className="space-y-6">
            {complaints.map((c) => (
              <div key={c._id} className="border border-gray-200 rounded-lg p-4 transition-shadow hover:shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                  <div>
                    <p className="text-lg font-bold text-black">{c.category}</p>
                    <p className="flex items-center gap-2 text-md text-black font-semibold mt-1">
                      <Hash className="w-4 h-4" />
                      Room {c.roomNumber}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <StatusBadge status={c.status} />
                  </div>
                </div>
                <p className="flex items-start gap-3 text-black mb-4">
                  <MessageSquare className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span className="break-words">{c.description}</span>
                </p>
                <div className="text-sm text-black flex items-center gap-2 border-t pt-3">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted on {new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Inbox className="mx-auto w-12 h-12 text-black" />
            <p className="mt-2 font-semibold text-black">You have not submitted any complaints yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
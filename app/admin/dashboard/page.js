'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, Fragment } from 'react';
import toast from 'react-hot-toast';
import { Menu, Transition } from '@headlessui/react';
import { 
  Loader2, ShieldX, Trash2, Inbox, MoreVertical, 
  User, Calendar, Hash, MessageSquare, 
  AlertCircle, Loader, CheckCircle 
} from 'lucide-react';

// Enhanced StatusBadge component
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

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all complaints
  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/complaints');
        if (!res.ok) throw new Error('You do not have permission to view this page.');
        const data = await res.json();
        setComplaints(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (sessionStatus === 'authenticated') fetchAdminData();
  }, [sessionStatus]);

  // API Integration Functions (handleUpdateStatus, handleDelete)
  const handleUpdateStatus = async (id, newStatus) => {
    const originalComplaints = [...complaints];
    setComplaints(complaints.map(c => c._id === id ? { ...c, status: newStatus } : c));
    const toastId = toast.loading('Updating status...');

    try {
      const res = await fetch(`/api/admin/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status.');
      toast.success('Status updated!', { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
      setComplaints(originalComplaints);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    const originalComplaints = [...complaints];
    setComplaints(complaints.filter(c => c._id !== id));
    const toastId = toast.loading('Deleting complaint...');

    try {
      const res = await fetch(`/api/admin/complaints/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete complaint.');
      toast.success('Complaint deleted!', { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
      setComplaints(originalComplaints);
    }
  };


  // --- Render Logic ---
  if (sessionStatus === 'loading' || isLoading) {
    return <div className="text-center mt-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-black" /></div>;
  }

  if (session?.user?.role !== 'admin') {
     return (
      <div className="text-center mt-10 text-black">
        <ShieldX className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black">Admin Dashboard</h1>
        <p className="text-black mt-2 md:mt-0">
          Total Complaints: <span className="font-bold text-black">{complaints.length}</span>
        </p>
      </div>

      {/* Complaints Grid */}
      {complaints.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {complaints.map((c) => (
            <div key={c._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-black">{c.category}</p>
                  <p className="flex items-center gap-2 text-md text-black font-semibold mt-1">
                    <Hash className="w-4 h-4" />
                    Room {c.roomNumber}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              
              <div className="p-6 flex-grow">
                <p className="flex items-start gap-3 text-black">
                  <MessageSquare className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span className="break-words">{c.description}</span>
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-b-lg flex justify-between items-center">
                <div className="text-sm text-black">
                  <p className="flex items-center gap-2 font-medium">
                    <User className="w-4 h-4" />
                    {c.studentName}
                  </p>
                  <p className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Actions Dropdown Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <MoreVertical className="w-5 h-5 text-black" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 bottom-full mb-2 w-48 origin-bottom-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="py-1">
                        <Menu.Item>
                          <button onClick={() => handleUpdateStatus(c._id, 'Pending')} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-100">
                            <AlertCircle className="w-4 h-4" /> Set to Pending
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button onClick={() => handleUpdateStatus(c._id, 'In Progress')} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-100">
                            <Loader className="w-4 h-4" /> Set to In Progress
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button onClick={() => handleUpdateStatus(c._id, 'Resolved')} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-100">
                            <CheckCircle className="w-4 h-4" /> Set to Resolved
                          </button>
                        </Menu.Item>
                         <div className="border-t my-1"></div>
                        <Menu.Item>
                          <button onClick={() => handleDelete(c._id)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-100">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <Inbox className="mx-auto w-16 h-16 text-black" />
          <p className="mt-4 text-lg font-semibold text-black">No complaints found</p>
          <p className="mt-1 text-black">When a student submits a complaint, it will appear here.</p>
        </div>
      )}
    </div>
  );
}
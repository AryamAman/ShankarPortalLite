'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader2, ShieldX, Droplets, Edit, Save } from 'lucide-react';

// --- MODIFIED LINE ---
// List of all water coolers on campus, now up to T20
const COOLER_NAMES = [
  'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10',
  'T11', 'T12', 'T13', 'T14', 'T15', 'T16', 'T17', 'T18', 'T19', 'T20'
];

export default function WaterCoolerAdminPage() {
  const { data: session, status } = useSession();
  const [coolerData, setCoolerData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(null); // Tracks which cooler is being edited
  const [currentTds, setCurrentTds] = useState('');

  // Fetch existing cooler data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/watercoolers');
        const data = await res.json();
        if (data.success) {
          // Convert array to a map for easy lookup
          const dataMap = data.data.reduce((acc, cooler) => {
            acc[cooler.name] = cooler;
            return acc;
          }, {});
          setCoolerData(dataMap);
        }
      } catch (err) {
        toast.error('Failed to fetch cooler data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (coolerName) => {
    setEditMode(coolerName);
    setCurrentTds(coolerData[coolerName]?.tds || '');
  };

  const handleSave = async (coolerName) => {
    if (!currentTds.trim()) {
      toast.error('TDS value cannot be empty.');
      return;
    }

    const toastId = toast.loading(`Updating ${coolerName}...`);
    try {
      const res = await fetch('/api/admin/watercoolers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: coolerName, tds: currentTds }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to update.');
      }

      // Update local state with the new data
      setCoolerData(prev => ({ ...prev, [coolerName]: result.data }));
      toast.success(`${coolerName} updated successfully!`, { id: toastId });
      setEditMode(null); // Exit edit mode
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  if (status === 'loading' || isLoading) {
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
    <div className="max-w-2xl mx-auto container px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-6">Manage Water Cooler Status</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          {COOLER_NAMES.map((name) => (
            <div key={name} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Droplets className="w-6 h-6 text-blue-500" />
                <span className="font-bold text-lg text-black">{name}</span>
              </div>
              
              {editMode === name ? (
                // Edit View
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentTds}
                    onChange={(e) => setCurrentTds(e.target.value)}
                    placeholder="e.g., 150 or Under Maintenance"
                    className="w-48 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-black"
                  />
                  <button onClick={() => handleSave(name)} className="p-2 bg-black text-white rounded-lg hover:bg-gray-800">
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                // Display View
                <div className="flex items-center gap-4">
                  <span className="text-black font-semibold">
                    {coolerData[name]?.tds || 'N/A'}
                  </span>
                  <button onClick={() => handleEdit(name)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <Edit className="w-5 h-5 text-black" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
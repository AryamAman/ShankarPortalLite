'use client';

import { useState, useEffect } from 'react';
import { Loader2, Droplets, CheckCircle, AlertTriangle, Wrench, Clock } from 'lucide-react';

// This helper function determines the status and style based on the TDS value
const getTdsStatus = (tds) => {
  const numericTds = parseInt(tds, 10);
  if (isNaN(numericTds)) {
    // Handle non-numeric strings like "Under Maintenance"
    return {
      label: 'Maintenance',
      Icon: Wrench,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    };
  }
  if (numericTds <= 150) {
    return {
      label: 'Good',
      Icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    };
  }
  return {
    label: 'High',
    Icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  };
};

// A component for each individual water cooler card
const CoolerStatusCard = ({ cooler }) => {
  const { label, Icon, color, bgColor } = getTdsStatus(cooler.tds);
  
  // Format the last updated time to be more readable
  const lastUpdated = new Date(cooler.lastUpdated).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            <Droplets className="w-7 h-7 text-blue-500" />
            {cooler.name}
          </h2>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${bgColor} ${color}`}>
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </div>
        </div>
        <p className="text-center text-5xl font-bold text-black mb-4">{cooler.tds}</p>
        <p className="text-center text-black text-sm mb-4">Total Dissolved Solids (TDS)</p>
      </div>
      <div className="text-center text-xs text-black border-t pt-3 mt-4 flex items-center justify-center gap-2">
        <Clock className="w-3 h-3" />
        <span>Last Updated: {lastUpdated}</span>
      </div>
    </div>
  );
};

// The main page component
export default function WaterCoolersPage() {
  const [coolers, setCoolers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/watercoolers');
        if (!res.ok) throw new Error('Failed to fetch data.');
        const data = await res.json();
        if (data.success) {
          setCoolers(data.data);
        } else {
          throw new Error(data.error || 'An unknown error occurred.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-10"><Loader2 className="w-10 h-10 animate-spin mx-auto text-black" /></div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600"><p>Error: {error}</p></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-black">Water Cooler Status</h1>
        <p className="mt-2 text-black">Live TDS levels for all water coolers on campus.</p>
      </div>
      {coolers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coolers.map(cooler => (
            <CoolerStatusCard key={cooler._id} cooler={cooler} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <p className="text-black">No water cooler data is available at the moment.</p>
        </div>
      )}
    </div>
  );
}
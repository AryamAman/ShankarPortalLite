'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  Loader2, Bath, Refrigerator, BedDouble, Zap, 
  Utensils, Wifi, SprayCan, Sofa, AlertTriangle 
} from 'lucide-react';

const complaintCategories = [
    { name: 'Bathroom', icon: Bath },
    { name: 'Water Cooler', icon: Refrigerator },
    { name: 'Room', icon: BedDouble },
    { name: 'Electricity', icon: Zap },
    { name: 'Mess/Food', icon: Utensils },
    { name: 'Internet/Wi-Fi', icon: Wifi },
    { name: 'Hygiene', icon: SprayCan },
    { name: 'Furniture', icon: Sofa },
    { name: 'Other', icon: AlertTriangle },
];

const CategoryCard = ({ category, selectedCategory, onSelect }) => {
    const isSelected = category.name === selectedCategory;
    return (
      <button
        type="button"
        onClick={() => onSelect(category.name)}
        className={`flex flex-col items-center justify-center p-4 md:p-6 border-2 rounded-lg transition-all duration-200 ${
          isSelected 
            ? 'border-black bg-gray-100 scale-105 shadow-lg' 
            : 'border-gray-200 bg-white hover:shadow-md'
        }`}
      >
        <category.icon 
          className={`w-10 h-10 md:w-12 md:h-12 mb-2 text-black`} 
        />
        <span className={`font-semibold text-center text-sm md:text-base text-black`}>
          {category.name}
        </span>
      </button>
    );
};

export default function ComplaintForm() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !roomNumber.trim() || !description.trim()) {
      toast.error('Please fill out all fields.');
      return;
    }
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Submitting your complaint...');

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          category: selectedCategory, 
          roomNumber, 
          description 
        }),
      });

      if (res.ok) {
        toast.success('Complaint registered successfully!', { id: loadingToast });
        setSelectedCategory('');
        setRoomNumber('');
        setDescription('');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit complaint.');
      }
    } catch (error) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-black mb-8 text-center md:text-left">
        Register a New Complaint
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-xl font-semibold text-black mb-4">
            1. Select Complaint Category
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {complaintCategories.map((cat) => (
              <CategoryCard 
                key={cat.name} 
                category={cat} 
                selectedCategory={selectedCategory} 
                onSelect={setSelectedCategory} 
              />
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="roomNumber" className="block text-xl font-semibold text-black mb-2">
            2. Your Room Number
          </label>
          <input 
            type="text" 
            id="roomNumber" 
            value={roomNumber} 
            onChange={(e) => setRoomNumber(e.target.value)} 
            placeholder="e.g., VK-234, Malviya-B3-101" 
            className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-black"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-xl font-semibold text-black mb-2">
            3. Describe the Issue
          </label>
          <textarea 
            id="description" 
            rows="5" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Please provide details..." 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none text-black"
          ></textarea>
        </div>
        <div>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full md:w-auto flex items-center justify-center px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
}
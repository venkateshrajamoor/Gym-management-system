import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const [gymInfo, setGymInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchGymInfo = async () => {
      try {
        const gymInfoRef = collection(db, 'gymInfo');
        const snapshot = await getDocs(gymInfoRef);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setGymInfo(doc.data());
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gym information:', error);
        toast.error('Failed to load gym information');
        setLoading(false);
      }
    };

    fetchGymInfo();
  }, []);

  const navigateToDetails = () => {
    navigate('/user/details');
  };

  const navigateToSearch = () => {
    navigate('/user/search');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {auth.currentUser?.displayName || 'User'}
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {gymInfo.name || 'Fitness Hub'}
        </h2>
        <p className="text-gray-600 mb-4">
          {gymInfo.description || 'Welcome to our gym management system!'}
        </p>
        {gymInfo.announcement && (
          <div className="bg-blue-50 text-blue-700 p-4 rounded mb-4">
            <h3 className="font-semibold mb-1">Announcement</h3>
            <p>{gymInfo.announcement}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold ml-2">View Details</h3>
          </div>
          <p className="text-gray-600 mb-4">Access information about gym facilities, programs, and schedules.</p>
          <button 
            onClick={navigateToDetails}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
          >
            View Details
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-semibold ml-2">Search Records</h3>
          </div>
          <p className="text-gray-600 mb-4">Search through gym records and available information.</p>
          <button 
            onClick={navigateToSearch}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition-colors"
          >
            Search Records
          </button>
        </div>
      </div>

      {gymInfo.hours && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-2">Operating Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(gymInfo.hours).map(([day, hours]) => (
              <div key={day} className="flex justify-between border-b pb-2">
                <span className="font-medium">{day}</span>
                <span>{hours}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 💪 Diet Plans Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Recommended Diet Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Veg Diets */}
          <div>
            <h3 className="text-lg font-bold text-green-700 mb-2">Vegetarian 🥦</h3>
            <div className="space-y-4">
              {[
                {
                  name: 'Weight Loss Veg Plan',
                  items: [
                    'Breakfast: Oats with almond milk and fruits',
                    'Lunch: Quinoa salad with chickpeas and veggies',
                    'Dinner: Grilled paneer with mixed greens'
                  ],
                },
                {
                  name: 'Muscle Gain Veg Plan',
                  items: [
                    'Breakfast: Peanut butter toast with banana',
                    'Lunch: Brown rice, dal, and tofu stir-fry',
                    'Dinner: Soya chunks curry with chapati'
                  ],
                },
                {
                  name: 'Balanced Veg Plan',
                  items: [
                    'Breakfast: Smoothie bowl with seeds and nuts',
                    'Lunch: Veg pulao with curd',
                    'Dinner: Palak paneer with millet roti'
                  ],
                },
              ].map((plan, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded border">
                  <p className="font-semibold text-blue-600 mb-2">{plan.name}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {plan.items.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Non-Veg Diets */}
          <div>
            <h3 className="text-lg font-bold text-red-700 mb-2">Non-Vegetarian 🍗</h3>
            <div className="space-y-4">
              {[
                {
                  name: 'Weight Loss Non-Veg Plan',
                  items: [
                    'Breakfast: Boiled eggs and black coffee',
                    'Lunch: Grilled chicken salad',
                    'Dinner: Fish curry with steamed veggies'
                  ],
                },
                {
                  name: 'Muscle Gain Non-Veg Plan',
                  items: [
                    'Breakfast: Omelette and whole wheat toast',
                    'Lunch: Chicken breast with brown rice',
                    'Dinner: Boiled eggs and sweet potato'
                  ],
                },
                {
                  name: 'Balanced Non-Veg Plan',
                  items: [
                    'Breakfast: Greek yogurt and berries',
                    'Lunch: Egg curry with rice',
                    'Dinner: Grilled fish and soup'
                  ],
                },
              ].map((plan, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded border">
                  <p className="font-semibold text-blue-600 mb-2">{plan.name}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {plan.items.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

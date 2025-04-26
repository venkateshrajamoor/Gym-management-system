import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';

const GymInfoManager = () => {
  const [gymInfo, setGymInfo] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    announcement: '',
    hours: {
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: ''
    },
    workingDays: '',
    nonWorkingDays: '',
    features: []
  });
  
  const [plans, setPlans] = useState([
    { name: '', description: '', price: '', duration: '' }
  ]);
  
  const [feature, setFeature] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchGymInfo = async () => {
      try {
        const gymInfoRef = collection(db, 'gymInfo');
        const snapshot = await getDocs(gymInfoRef);
        
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data();
          setGymInfo({
            ...data,
            hours: data.hours || {
              Monday: '',
              Tuesday: '',
              Wednesday: '',
              Thursday: '',
              Friday: '',
              Saturday: '',
              Sunday: ''
            },
            features: data.features || []
          });
          
          if (data.plans && data.plans.length > 0) {
            setPlans(data.plans);
          }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGymInfo({ ...gymInfo, [name]: value });
  };

  const handleHoursChange = (day, value) => {
    setGymInfo({
      ...gymInfo,
      hours: {
        ...gymInfo.hours,
        [day]: value
      }
    });
  };

  const handlePlanChange = (index, field, value) => {
    const newPlans = [...plans];
    newPlans[index][field] = field === 'price' ? parseFloat(value) || 0 : value;
    setPlans(newPlans);
  };

  const addPlan = () => {
    setPlans([...plans, { name: '', description: '', price: '', duration: '' }]);
  };

  const removePlan = (index) => {
    const newPlans = [...plans];
    newPlans.splice(index, 1);
    setPlans(newPlans);
  };

  const addFeature = () => {
    if (feature.trim() !== '') {
      setGymInfo({
        ...gymInfo,
        features: [...gymInfo.features, feature.trim()]
      });
      setFeature('');
    }
  };

  const removeFeature = (index) => {
    const newFeatures = [...gymInfo.features];
    newFeatures.splice(index, 1);
    setGymInfo({ ...gymInfo, features: newFeatures });
  };

  const saveGymInfo = async () => {
    if (!gymInfo.name || !gymInfo.description) {
      toast.error('Gym name and description are required');
      return;
    }
    
    setSaving(true);
    
    try {
      const gymInfoWithPlans = {
        ...gymInfo,
        plans
      };
      
      // Check if gymInfo already exists
      const gymInfoRef = collection(db, 'gymInfo');
      const snapshot = await getDocs(gymInfoRef);
      
      if (snapshot.empty) {
        // Create new document
        await setDoc(doc(gymInfoRef), gymInfoWithPlans);
      } else {
        // Update existing document
        await setDoc(doc(db, 'gymInfo', snapshot.docs[0].id), gymInfoWithPlans);
      }
      
      toast.success('Gym information saved successfully');
    } catch (error) {
      console.error('Error saving gym information:', error);
      toast.error('Failed to save gym information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold">Loading gym information...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Gym Information</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Gym Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={gymInfo.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            value={gymInfo.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={gymInfo.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={gymInfo.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={gymInfo.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="announcement" className="block text-gray-700 font-medium mb-2">
            Announcement
          </label>
          <textarea
            id="announcement"
            name="announcement"
            value={gymInfo.announcement}
            onChange={handleInputChange}
            rows="2"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
        
        {Object.keys(gymInfo.hours).map((day) => (
          <div key={day} className="mb-4 grid grid-cols-3 gap-4 items-center">
            <label className="text-gray-700 font-medium">{day}</label>
            <input
              type="text"
              value={gymInfo.hours[day]}
              onChange={(e) => handleHoursChange(day, e.target.value)}
              placeholder="e.g. 5:00 AM - 11:00 PM"
              className="col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="workingDays" className="block text-gray-700 font-medium mb-2">
              Working Days
            </label>
            <input
              type="text"
              id="workingDays"
              name="workingDays"
              value={gymInfo.workingDays}
              onChange={handleInputChange}
              placeholder="e.g. Monday to Sunday"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="nonWorkingDays" className="block text-gray-700 font-medium mb-2">
              Non-Working Days
            </label>
            <input
              type="text"
              id="nonWorkingDays"
              name="nonWorkingDays"
              value={gymInfo.nonWorkingDays}
              onChange={handleInputChange}
              placeholder="e.g. National Holidays"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Membership Plans</h2>
        
        {plans.map((plan, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Plan #{index + 1}</h3>
              <button
                type="button"
                onClick={() => removePlan(index)}
                className="text-red-500 hover:text-red-700"
                disabled={plans.length === 1}
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => handlePlanChange(index, 'name', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={plan.price}
                  onChange={(e) => handlePlanChange(index, 'price', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={plan.duration}
                  onChange={(e) => handlePlanChange(index, 'duration', e.target.value)}
                  placeholder="e.g. Monthly, Annual"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={plan.description}
                  onChange={(e) => handlePlanChange(index, 'description', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addPlan}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors mb-4"
        >
          Add Plan
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Gym Features</h2>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            placeholder="Enter feature"
            className="flex-1 px-4 py-2 border rounded-lg rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addFeature}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg rounded-l-none transition-colors"
          >
            Add
          </button>
        </div>
        
        {gymInfo.features.length > 0 ? (
          <div className="space-y-2">
            {gymInfo.features.map((feat, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span>{feat}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-2">No features added</p>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={saveGymInfo}
          disabled={saving}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors"
        >
          {saving ? 'Saving...' : 'Save Gym Information'}
        </button>
      </div>
    </div>
  );
};

export default GymInfoManager;
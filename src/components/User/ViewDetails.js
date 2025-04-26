import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';

const ViewDetails = () => {
  const [gymDetails, setGymDetails] = useState({});
  const [trainers, setTrainers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGymDetails = async () => {
      try {
        // Fetch gym details
        const gymInfoRef = collection(db, 'gymInfo');
        const gymSnapshot = await getDocs(gymInfoRef);
        
        if (!gymSnapshot.empty) {
          setGymDetails(gymSnapshot.docs[0].data());
        }
        
        // Fetch trainers
        const trainersRef = collection(db, 'trainers');
        const trainersSnapshot = await getDocs(trainersRef);
        
        const trainersData = trainersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTrainers(trainersData);
        
        // Fetch facilities
        const facilitiesRef = collection(db, 'facilities');
        const facilitiesSnapshot = await getDocs(facilitiesRef);
        
        const facilitiesData = facilitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFacilities(facilitiesData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gym details:', error);
        toast.error('Failed to load gym details');
        setLoading(false);
      }
    };

    fetchGymDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold">Loading gym details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gym Details</h1>
      
      {/* Gym Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{gymDetails.name || 'Fitness Hub'}</h2>
        <p className="text-gray-600 mb-4">{gymDetails.description || 'Welcome to our state-of-the-art fitness facility.'}</p>
        
        {gymDetails.address && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700">Address</h3>
            <p className="text-gray-600">{gymDetails.address}</p>
          </div>
        )}
        
        {gymDetails.phone && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700">Contact</h3>
            <p className="text-gray-600">{gymDetails.phone}</p>
          </div>
        )}
        
        {gymDetails.email && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700">Email</h3>
            <p className="text-gray-600">{gymDetails.email}</p>
          </div>
        )}
      </div>
      
      {/* Membership Plans */}
      {gymDetails.plans && gymDetails.plans.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Membership Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gymDetails.plans.map((plan, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-2">{plan.description}</p>
                <p className="font-medium text-lg">₹{plan.price}</p>
                <p className="text-sm text-gray-500">{plan.duration}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Trainers */}
      {trainers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Our Trainers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainers.map(trainer => (
              <div key={trainer.id} className="border rounded-lg p-4 flex">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  {trainer.profileImage ? (
                    <img 
                      src={trainer.profileImage} 
                      alt={trainer.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{trainer.name}</h3>
                  <p className="text-sm text-gray-600">{trainer.specialization}</p>
                  {trainer.experience && (
                    <p className="text-sm text-gray-500">{trainer.experience} years experience</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Facilities */}
      {facilities.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Our Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {facilities.map(facility => (
              <div key={facility.id} className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="font-semibold">{facility.name}</h3>
                </div>
                {facility.description && <p className="text-sm text-gray-600">{facility.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Operating Hours */}
      {gymDetails.hours && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(gymDetails.hours).map(([day, hours]) => (
              <div key={day} className="flex justify-between border-b pb-2">
                <span className="font-medium">{day}</span>
                <span>{hours}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDetails;
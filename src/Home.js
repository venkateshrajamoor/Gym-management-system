import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (auth.currentUser) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'member') navigate('/member');
      else if (role === 'user') navigate('/user');
    }
  }, [navigate]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center text-white relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1571019613914-85f342c79a5c?auto=format&fit=crop&w=1400&q=80')"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">King's Gym 👑</h1>
        <p className="text-lg md:text-xl mb-6">
          Train like a King. Rule your goals. Push your limits every single day.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded shadow"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-white hover:bg-gray-200 text-black font-semibold py-2 px-6 rounded shadow"
          >
            Register
          </button>
        </div>

        {/* Features section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm md:text-base">
          <div className="bg-white bg-opacity-10 p-4 rounded">
            🕐 <strong>Open 24/7</strong><br /> Anytime access for your routine
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded">
            🏋️‍♂️ <strong>Elite Equipment</strong><br /> Premium strength & cardio gear
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded">
            🧑‍🏫 <strong>Expert Trainers</strong><br /> Personal training and classes
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

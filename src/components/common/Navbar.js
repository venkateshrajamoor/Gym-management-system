import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const userRole = localStorage.getItem('userRole');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userRole');
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error.message);
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">King's Gym</Link>

        {user ? (
          <div className="flex space-x-4 items-center">
            {/* Admin Navigation */}
            {userRole === 'admin' && (
              <>
                <Link to="/admin" className="hover:text-blue-200">Dashboard</Link>
                <Link to="/admin/members" className="hover:text-blue-200">Members</Link>
                <Link to="/admin/add-member" className="hover:text-blue-200">Add Member</Link>
                <Link to="/admin/create-bill" className="hover:text-blue-200">Create Bill</Link>
                <Link to="/admin/info" className="hover:text-blue-200">Info</Link>
                <Link to="/admin/reports" className="hover:text-blue-200">Reports</Link> {/* ✅ NEW */}
              </>
            )}

            {/* Member Navigation */}
            {userRole === 'member' && (
              <>
                <Link to="/member" className="hover:text-blue-200">Dashboard</Link>
                <Link to="/member/bills" className="hover:text-blue-200">View Bills</Link>
              </>
            )}

            {/* User Navigation */}
            {userRole === 'user' && (
              <>
                <Link to="/user" className="hover:text-blue-200">Dashboard</Link>
                <Link to="/user/details" className="hover:text-blue-200">View Details</Link>
                <Link to="/user/search" className="hover:text-blue-200">Search Records</Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="hover:text-blue-200 border-l border-blue-400 pl-4 ml-4"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login" className="hover:text-blue-200">Login</Link>
            <Link to="/register" className="hover:text-blue-200">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

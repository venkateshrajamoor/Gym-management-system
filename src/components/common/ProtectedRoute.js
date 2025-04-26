// src/components/common/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ userRole, children }) => {
  const { currentUser, userRole: userCurrentRole, loading } = useAuth();

  // Show loading indicator while checking auth state
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  // Not logged in - redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Logged in but wrong role - redirect to appropriate dashboard
  if (userRole && userCurrentRole !== userRole) {
    if (userCurrentRole === 'admin') {
      return <Navigate to="/admin" />;
    } else if (userCurrentRole === 'member') {
      return <Navigate to="/member" />;
    } else if (userCurrentRole === 'user') {
      return <Navigate to="/user" />;
    } else {
      // If role doesn't match any known type
      return <Navigate to="/login" />;
    }
  }

  // If everything is fine, render the protected component
  return children;
};

export default ProtectedRoute;
// In a file like src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children, requiredRole = null }) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If a specific role is required, check for it
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on role
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else if (userRole === 'member') {
      return <Navigate to="/member/dashboard" />;
    } else if (userRole === 'user') {
      return <Navigate to="/user/dashboard" />;
    } else {
      return <Navigate to="/unauthorized" />;
    }
  }

  return children;
}
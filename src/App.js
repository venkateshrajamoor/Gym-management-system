import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import Home from './Home'; // ✅ Imported Home

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import AddMember from './components/admin/AddMember';
import MemberList from './components/admin/MemberList';
import CreateBill from './components/admin/CreateBill';
import GymInfoManager from './components/admin/GymInfoManager';
import Reports from './components/admin/Report'; // ✅

/* Member Components */
import MemberDashboard from './components/member/Dashboard';
import ViewBills from './components/member/ViewBills';

/* User Components */
import UserDashboard from './components/User/Dashboard';
import ViewDetails from './components/User/ViewDetails';
import SearchRecords from './components/User/SearchRecords';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute userRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/add-member" element={
              <ProtectedRoute userRole="admin">
                <AddMember />
              </ProtectedRoute>
            } />
            <Route path="/admin/members" element={
              <ProtectedRoute userRole="admin">
                <MemberList />
              </ProtectedRoute>
            } />
            <Route path="/admin/create-bill" element={
              <ProtectedRoute userRole="admin">
                <CreateBill />
              </ProtectedRoute>
            } />
            <Route path="/admin/info" element={
              <ProtectedRoute userRole="admin">
                <GymInfoManager />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute userRole="admin">
                <Reports />
              </ProtectedRoute>
            } />

            {/* Member Routes */}
            <Route path="/member" element={
              <ProtectedRoute userRole="member">
                <MemberDashboard />
              </ProtectedRoute>
            } />
            <Route path="/member/bills" element={
              <ProtectedRoute userRole="member">
                <ViewBills />
              </ProtectedRoute>
            } />

            {/* User Routes */}
            <Route path="/user" element={
              <ProtectedRoute userRole="user">
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/user/details" element={
              <ProtectedRoute userRole="user">
                <ViewDetails />
              </ProtectedRoute>
            } />
            <Route path="/user/search" element={
              <ProtectedRoute userRole="user">
                <SearchRecords />
              </ProtectedRoute>
            } />

            {/* Public Home */}
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AuthProvider>
  );
}

export default App;

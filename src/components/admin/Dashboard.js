import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    pendingPayments: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get members count
        const membersQuery = query(collection(db, 'users'), where('role', '==', 'member'));
        const membersSnapshot = await getDocs(membersQuery);
        const totalMembers = membersSnapshot.size;
        
        // Get bills data
        const billsSnapshot = await getDocs(collection(db, 'bills'));
        let totalRevenue = 0;
        let pendingPayments = 0;
        
        billsSnapshot.forEach(doc => {
          const bill = doc.data();
          if (bill.status === 'paid') {
            totalRevenue += parseFloat(bill.amount);
          } else {
            pendingPayments++;
          }
        });
        
        // Set stats
        setStats({
          totalMembers,
          activeMembers: totalMembers, // Assuming all members are active for simplicity
          pendingPayments,
          totalRevenue
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading stats...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold text-gray-700">Total Members</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalMembers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-lg font-semibold text-gray-700">Active Members</h2>
          <p className="text-3xl font-bold text-green-600">{stats.activeMembers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h2 className="text-lg font-semibold text-gray-700">Pending Payments</h2>
          <p className="text-3xl font-bold text-red-600">{stats.pendingPayments}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
          <p className="text-3xl font-bold text-purple-600">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/admin/add-member" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add New Member
          </a>
          <a href="/admin/create-bill" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            Create Bill
          </a>
          <a href="/admin/members" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
            View Members
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
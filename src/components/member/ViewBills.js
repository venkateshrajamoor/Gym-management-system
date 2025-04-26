import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { toast } from 'react-toastify';

const ViewBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        
        // Get user document
        const userQuery = query(collection(db, 'users'), where('email', '==', user.email));
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userId = userSnapshot.docs[0].id;
          
          // Get bills
          const billsQuery = query(
            collection(db, 'bills'), 
            where('userId', '==', userId)
          );
          const billsSnapshot = await getDocs(billsQuery);
          
          const billsData = billsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Sort by due date (most recent first)
          billsData.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
          
          setBills(billsData);
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
        toast.error("Failed to load bills");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBills();
  }, []);

  const handlePayBill = async (billId) => {
    try {
      await updateDoc(doc(db, 'bills', billId), {
        status: 'paid'
      });
      
      // Update local state
      setBills(bills.map(bill => 
        bill.id === billId ? { ...bill, status: 'paid' } : bill
      ));
      
      toast.success('Bill marked as paid!');
    } catch (error) {
      console.error("Error updating bill:", error);
      toast.error("Failed to update bill status");
    }
  };

  const filteredBills = filter === 'all' 
    ? bills 
    : bills.filter(bill => bill.status === filter);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading bills...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Bills</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4 flex space-x-2">
          <button 
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`px-4 py-2 rounded ${filter === 'paid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('paid')}
          >
            Paid
          </button>
        </div>
        
        {filteredBills.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No {filter !== 'all' ? filter : ''} bills found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Due Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map(bill => (
                  <tr key={bill.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{bill.description}</td>
                    <td className="px-6 py-4">${bill.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">{new Date(bill.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        bill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {bill.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {bill.status === 'pending' && (
                        <button
                          onClick={() => handlePayBill(bill.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Mark as Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBills;
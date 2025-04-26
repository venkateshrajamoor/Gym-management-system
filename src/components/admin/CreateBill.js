import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';

const CreateBill = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    memberId: '',
    description: '',
    amount: '',
    dueDate: '',
    status: 'pending'
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersQuery = query(collection(db, 'users'), where('role', '==', 'member'));
        const membersSnapshot = await getDocs(membersQuery);
        
        const membersData = membersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setMembers(membersData);
      } catch (error) {
        console.error("Error fetching members:", error);
        toast.error("Failed to load members");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get selected member data
      const selectedMember = members.find(member => member.id === formData.memberId);
      
      // Create bill in Firestore
      await addDoc(collection(db, 'bills'), {
        userId: formData.memberId,
        userName: selectedMember.name,
        userEmail: selectedMember.email,
        description: formData.description,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        status: formData.status,
        createdAt: new Date().toISOString()
      });
      
      toast.success('Bill created successfully!');
      
      // Reset form
      setFormData({
        memberId: '',
        description: '',
        amount: '',
        dueDate: '',
        status: 'pending'
      });
    } catch (error) {
      console.error("Error creating bill:", error.message);
      toast.error(`Failed to create bill: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && members.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Bill</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="memberId">
              Select Member
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="memberId"
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a Member --</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>{member.name} ({member.email})</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              type="text"
              placeholder="Description (e.g. Monthly Fee, Personal Training)"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount ($)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
              Due Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating Bill...' : 'Create Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBill;

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
    membershipType: '',
    membershipFee: ''
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersQuery = query(collection(db, 'users'), where('role', '==', 'member'));
        const membersSnapshot = await getDocs(membersQuery);
        
        const membersData = [];
        
        for (const memberDoc of membersSnapshot.docs) {
            const memberData = memberDoc.data();
          
          // Get membership details
          const membershipQuery = query(
            collection(db, 'memberships'), 
            where('userId', '==', memberDoc.id)
          );
          const membershipSnapshot = await getDocs(membershipQuery);
          
          let membershipData = null;
          if (!membershipSnapshot.empty) {
            membershipData = membershipSnapshot.docs[0].data();
          }
          
          membersData.push({
            id: memberDoc.id,
            ...memberData,
            membership: membershipData
          });
        }
        
        setMembers(membersData);
      } catch (error) {
        console.error("Error fetching members:", error);
        toast.error("Failed to load members list");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, []);

  const handleDelete = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteDoc(doc(db, 'users', memberId));
        
        // Also delete their membership record
        const membershipQuery = query(
          collection(db, 'memberships'), 
          where('userId', '==', memberId)
        );
        const membershipSnapshot = await getDocs(membershipQuery);
        
        if (!membershipSnapshot.empty) {
          await deleteDoc(doc(db, 'memberships', membershipSnapshot.docs[0].id));
        }
        
        // Update the local state
        setMembers(members.filter(member => member.id !== memberId));
        toast.success("Member deleted successfully");
      } catch (error) {
        console.error("Error deleting member:", error);
        toast.error("Failed to delete member");
      }
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member.id);
    setEditForm({
      name: member.name,
      phone: member.phone,
      address: member.address,
      membershipType: member.membership?.membershipType || 'monthly',
      membershipFee: member.membership?.fee || 0
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      // Update user document
      await updateDoc(doc(db, 'users', editingMember), {
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address
      });
      
      // Update membership
      const membershipQuery = query(
        collection(db, 'memberships'), 
        where('userId', '==', editingMember)
      );
      const membershipSnapshot = await getDocs(membershipQuery);
      
      if (!membershipSnapshot.empty) {
        await updateDoc(doc(db, 'memberships', membershipSnapshot.docs[0].id), {
          membershipType: editForm.membershipType,
          fee: parseFloat(editForm.membershipFee)
        });
      }
      
      // Update local state
      setMembers(members.map(member => {
        if (member.id === editingMember) {
          return {
            ...member,
            name: editForm.name,
            phone: editForm.phone,
            address: editForm.address,
            membership: {
              ...member.membership,
              membershipType: editForm.membershipType,
              fee: parseFloat(editForm.membershipFee)
            }
          };
        }
        return member;
      }));
      
      setEditingMember(null);
      toast.success("Member updated successfully");
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Failed to update member");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading members...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Members List</h1>
      
      {members.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p>No members found. <a href="/admin/add-member" className="text-blue-500 hover:underline">Add a new member</a>.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-50">
                  {editingMember === member.id ? (
                    <td colSpan="6" className="px-6 py-4">
                      <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                              type="text"
                              name="name"
                              value={editForm.name}
                              onChange={handleEditFormChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                              type="text"
                              name="phone"
                              value={editForm.phone}
                              onChange={handleEditFormChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                              type="text"
                              name="address"
                              value={editForm.address}
                              onChange={handleEditFormChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Membership Type</label>
                            <select
                              name="membershipType"
                              value={editForm.membershipType}
                              onChange={handleEditFormChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Fee ($)</label>
                            <input
                              type="number"
                              name="membershipFee"
                              value={editForm.membershipFee}
                              onChange={handleEditFormChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingMember(null)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize">{member.membership?.membershipType || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${member.membership?.fee.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(member)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MemberList;
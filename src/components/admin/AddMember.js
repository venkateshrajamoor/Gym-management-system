import React, { useState } from 'react';
import { sendPasswordResetEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { db, auth } from '../../firebase';
import { secondaryAuth } from '../../firebase'; // ✅ use secondary auth

const AddMember = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    joinDate: new Date().toISOString().split('T')[0],
    membershipType: 'monthly',
    membershipFee: '50'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tempPassword = Math.random().toString(36).slice(-8);

      // ✅ Use secondary auth instance to create user
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, tempPassword);
      const memberUser = userCredential.user;

      // Save to Firestore
      await setDoc(doc(db, 'users', memberUser.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        joinDate: formData.joinDate,
        role: 'member',
        createdAt: new Date().toISOString()
      });

      await addDoc(collection(db, 'memberships'), {
        userId: memberUser.uid,
        membershipType: formData.membershipType,
        fee: parseFloat(formData.membershipFee),
        startDate: formData.joinDate,
        status: 'active',
        createdAt: new Date().toISOString()
      });

      // Send reset password email
      await sendPasswordResetEmail(auth, formData.email);

      toast.success("✅ Member added successfully. Password reset email sent!");

      // Reset the form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        joinDate: new Date().toISOString().split('T')[0],
        membershipType: 'monthly',
        membershipFee: '50'
      });

    } catch (error) {
      console.error("Error adding member:", error.message);
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Member</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: 'name', label: 'Full Name', type: 'text' },
              { id: 'email', label: 'Email', type: 'email' },
              { id: 'phone', label: 'Phone Number', type: 'tel' },
              { id: 'address', label: 'Address', type: 'text' },
              { id: 'joinDate', label: 'Join Date', type: 'date' },
              { id: 'membershipFee', label: 'Membership Fee ($)', type: 'number' }
            ].map(({ id, label, type }) => (
              <div key={id}>
                <label className="block text-sm font-semibold mb-1">{label}</label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  className="w-full border p-2 rounded"
                  value={formData[id]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold mb-1">Membership Type</label>
              <select
                id="membershipType"
                name="membershipType"
                className="w-full border p-2 rounded"
                value={formData.membershipType}
                onChange={handleChange}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'Adding Member...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-sm text-yellow-800">
          📩 A password reset email will be sent. The new member must use it to set their own password.
        </p>
      </div>
    </div>
  );
};

export default AddMember;

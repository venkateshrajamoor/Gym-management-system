import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function SearchRecords() {
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Get current user's role
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userSnap = await getDocs(query(
        collection(db, 'users'),
        where('email', '==', currentUser.email)
      ));
      if (!userSnap.empty) {
        const userData = userSnap.docs[0].data();
        setRole(userData.role);
      }

      // Fetch all records
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs.map(doc => doc.data());
      setRecords(data);
    };

    fetchData();
  }, []);

  const filtered = records.filter((record) =>
    record.name?.toLowerCase().includes(search.toLowerCase()) ||
    record.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">🔍 Search Gym Records</h1>
      <input
        type="text"
        placeholder="Search by name or email"
        className="w-full border border-gray-300 rounded-md p-2 mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-4">
        {filtered.map((rec, index) => (
          <div key={index} className="bg-white shadow rounded p-4">
            <p><strong>Name:</strong> {rec.name}</p>

            {(role === 'user' || role === 'member') && (
              <p><strong>Email:</strong> {rec.email}</p>
            )}

            {role === 'member' && (
              <p><strong>Mobile:</strong> {rec.phone || 'N/A'}</p>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-gray-500">No matching records found.</p>}
      </div>
    </div>
  );
}

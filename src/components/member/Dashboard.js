import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { toast } from 'react-toastify';

const MemberDashboard = () => {
  const [memberData, setMemberData] = useState(null);
  const [membershipData, setMembershipData] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const memberDoc = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));
        if (!memberDoc.empty) {
          setMemberData(memberDoc.docs[0].data());

          const membershipQuery = query(
            collection(db, 'memberships'),
            where('userId', '==', memberDoc.docs[0].id)
          );
          const membershipSnapshot = await getDocs(membershipQuery);

          if (!membershipSnapshot.empty) {
            setMembershipData(membershipSnapshot.docs[0].data());
          }

          const billsQuery = query(
            collection(db, 'bills'),
            where('userId', '==', memberDoc.docs[0].id)
          );
          const billsSnapshot = await getDocs(billsQuery);

          const billsData = billsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setBills(billsData);
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading data...</div>;
  }

  if (!memberData) {
    return <div className="text-center">Member data not found.</div>;
  }

  const pendingBills = bills.filter(bill => bill.status === 'pending');
  const totalDue = pendingBills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Member Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Name:</span> {memberData.name}</p>
            <p><span className="font-semibold">Email:</span> {memberData.email}</p>
            <p><span className="font-semibold">Phone:</span> {memberData.phone}</p>
            <p><span className="font-semibold">Join Date:</span> {new Date(memberData.joinDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Membership Details</h2>
          {membershipData ? (
            <div className="space-y-2">
              <p><span className="font-semibold">Type:</span> <span className="capitalize">{membershipData.membershipType}</span></p>
              <p><span className="font-semibold">Fee:</span> ${membershipData.fee.toFixed(2)}</p>
              <p><span className="font-semibold">Start Date:</span> {new Date(membershipData.startDate).toLocaleDateString()}</p>
              <p><span className="font-semibold">Status:</span> <span className="capitalize">{membershipData.status}</span></p>
            </div>
          ) : (
            <p>No membership details found.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Bills</h2>
        {bills.length > 0 ? (
          <div>
            <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <h3 className="text-lg font-medium text-yellow-800">Payment Due</h3>
              <p className="text-yellow-700">You have <span className="font-bold">{pendingBills.length}</span> pending bill(s) with a total amount of <span className="font-bold">${totalDue.toFixed(2)}</span>.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Due Date</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.slice(0, 5).map(bill => (
                    <tr key={bill.id} className="border-b">
                      <td className="px-4 py-2">{bill.description}</td>
                      <td className="px-4 py-2">${bill.amount.toFixed(2)}</td>
                      <td className="px-4 py-2">{new Date(bill.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          bill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {bill.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {bills.length > 5 && (
              <div className="mt-4 text-right">
                <a href="/member/bills" className="text-blue-500 hover:underline">View all bills</a>
              </div>
            )}
          </div>
        ) : (
          <p>No bills found.</p>
        )}
      </div>

      {/* 🍎 Diet Plans Section */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recommended Diet Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Veg Plans */}
          <div>
            <h3 className="text-lg font-bold text-green-700 mb-2">Vegetarian 🥦</h3>
            <div className="space-y-4">
              {[
                {
                  name: 'Weight Loss Veg Plan',
                  items: ['Breakfast: Oats with fruits', 'Lunch: Quinoa salad with chickpeas', 'Dinner: Grilled paneer with veggies']
                },
                {
                  name: 'Muscle Gain Veg Plan',
                  items: ['Breakfast: Peanut butter toast', 'Lunch: Dal, brown rice, tofu', 'Dinner: Soya curry with roti']
                },
                {
                  name: 'Balanced Veg Plan',
                  items: ['Breakfast: Smoothie with seeds', 'Lunch: Veg pulao + curd', 'Dinner: Palak paneer with millet roti']
                }
              ].map((plan, i) => (
                <div key={i} className="border rounded p-4 bg-gray-50">
                  <p className="font-semibold text-blue-600 mb-1">{plan.name}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {plan.items.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Non-Veg Plans */}
          <div>
            <h3 className="text-lg font-bold text-red-700 mb-2">Non-Vegetarian 🍗</h3>
            <div className="space-y-4">
              {[
                {
                  name: 'Weight Loss Non-Veg Plan',
                  items: ['Breakfast: Boiled eggs + black coffee', 'Lunch: Grilled chicken salad', 'Dinner: Fish curry + veggies']
                },
                {
                  name: 'Muscle Gain Non-Veg Plan',
                  items: ['Breakfast: Omelette + toast', 'Lunch: Chicken breast + brown rice', 'Dinner: Eggs + sweet potato']
                },
                {
                  name: 'Balanced Non-Veg Plan',
                  items: ['Breakfast: Greek yogurt + berries', 'Lunch: Egg curry + rice', 'Dinner: Grilled fish + soup']
                }
              ].map((plan, i) => (
                <div key={i} className="border rounded p-4 bg-gray-50">
                  <p className="font-semibold text-blue-600 mb-1">{plan.name}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {plan.items.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;

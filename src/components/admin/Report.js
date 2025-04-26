import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function Reports() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      const snap = await getDocs(collection(db, 'bills'));
      const data = snap.docs.map(doc => doc.data());
      setBills(data);
    };
    fetchBills();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(bills);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bills');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'Bill_Report.xlsx');
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">🧾 Export Bill Reports</h1>
      <button
        onClick={exportToExcel}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Export to Excel
      </button>

      {bills.length ? (
        <div className="bg-white shadow-md rounded p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-100 text-left">
                <th className="p-2">Email</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{bill.userEmail}</td>
                  <td className="p-2">₹{bill.amount}</td>
                  <td className="p-2">{bill.dueDate}</td>
                  <td className="p-2 capitalize">{bill.status || 'pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No bill records found.</p>
      )}
    </div>
  );
}

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  X, 
  Calendar, 
  User, 
  IndianRupee,
  CheckCircle2,
  Clock
} from 'lucide-react';

const ManageBills = () => {
  const { user } = useContext(AuthContext);

  // Current Date Logic
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const [bills, setBills] = useState([]);
  const [residents, setResidents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    residentId: '',
    amount: '',
    month: currentMonth,
    year: currentYear,
    dueDate: '',
    description: 'Monthly Maintenance'
  });

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchBills(), fetchResidents()]);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchBills = async () => {
    const { data } = await axios.get('http://localhost:5000/api/admin/bills', config);
    setBills(data);
  };

  const fetchResidents = async () => {
    const { data } = await axios.get('http://localhost:5000/api/admin/residents', config);
    setResidents(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/bills', formData, config);
      setShowModal(false);
      fetchBills();
      // Reset form but keep month/year
      setFormData(prev => ({...prev, residentId: '', amount: '', dueDate: ''}));
    } catch (error) {
      console.error(error);
      alert("Failed to create bill");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Bills</h2>
            <p className="text-gray-500 mt-1">Create and track maintenance requests</p>
          </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 font-medium active:scale-95"
            >
              <PlusCircle size={20} /> 
              <span>Create Bill</span>
            </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resident</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Flat No</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {bills.length > 0 ? (
                  bills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200">
                            {bill.residentId?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                            {bill.residentId?.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                          {bill.residentId?.flatNumber}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                         <div className="flex items-center text-gray-900 font-bold">
                            <span className="text-gray-400 mr-1">₹</span>
                            {bill.amount.toLocaleString()}
                         </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                           <Calendar size={14} className="text-gray-400" />
                           {bill.month} {bill.year}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : '-'}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          bill.status === "Paid"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {bill.status === "Paid" ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                          {bill.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                            <Filter className="text-gray-400" size={24}/>
                        </div>
                        <p>No bills found. Create one to get started.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Overlay */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all scale-100">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">Generate New Bill</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                
                {/* Resident Select */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User size={16} className="text-blue-500"/> Select Resident
                  </label>
                  <select
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.residentId}
                    onChange={(e) => setFormData({ ...formData, residentId: e.target.value })}
                  >
                    <option value="">Choose a resident...</option>
                    {residents.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name} — Flat {r.flatNumber}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <IndianRupee size={16} className="text-blue-500"/> Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>

                {/* Month & Year Grid */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Month</label>
                    <select
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    >
                      {[
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                      ].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                   </div>
                   <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Year</label>
                    <input
                      type="number"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    />
                   </div>
                </div>

                {/* Due Date */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock size={16} className="text-blue-500"/> Due Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-lg shadow-blue-600/20 transition-all"
                  >
                    Generate Bill
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBills;
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  IndianRupee, 
  Home, 
  User,
  Loader2,
  Receipt,
  History,
  AlertCircle,
  Wallet
} from 'lucide-react';

const ResidentDashboard = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'
  
  const { user } = useContext(AuthContext);
  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/resident/bills', config);
      setBills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (billId) => {
    if (!window.confirm('Confirm payment transaction?')) return;
    
    setPaymentLoading(billId);
    try {
      await axios.post('http://localhost:5000/api/resident/pay', { billId }, config);
      alert('Payment Successful!'); 
      fetchBills(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaymentLoading(null);
    }
  };

  // Derived Data for Stats
  const pendingBills = bills.filter(b => b.status === 'Unpaid');
  const paidBills = bills.filter(b => b.status === 'Paid');
  const totalDue = pendingBills.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = paidBills.reduce((acc, curr) => acc + curr.amount, 0);

  // Filtered List based on Tab
  const displayBills = activeTab === 'pending' ? pendingBills : paidBills;



  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hello, {user.name.split(' ')[0]} 👋</h2>
              <p className="text-gray-500 text-sm mt-1">Flat {user.flatNumber} Resident</p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-400 bg-gray-50 w-fit px-3 py-1.5 rounded-full">
               <User size={14} /> Account Verified
            </div>
          </div>

          {/* Stats: Total Due */}
          <div className="bg-rose-50 to-white p-6 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <AlertCircle size={80} className="text-red-500" />
            </div>
            <p className="text-red-600 font-medium text-sm flex items-center gap-2">
              <Clock size={16} /> Outstanding Dues
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              ₹{totalDue.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-500 mt-2">
              {pendingBills.length} bills pending
            </p>
          </div>

          {/* Stats: Total Paid */}
          <div className="bg-emerald-50 to-white p-6 rounded-2xl shadow-sm border border-green-100 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Wallet size={80} className="text-green-500" />
            </div>
            <p className="text-green-600 font-medium text-sm flex items-center gap-2">
              <CheckCircle2 size={16} /> Total Paid
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              ₹{totalPaid.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-500 mt-2">
              Lifetime contribution
            </p>
          </div>
        </div>

        {/* Tabs & List Section */}
        <div>
          {/* Custom Tabs */}
          <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`pb-3 px-1 text-sm font-medium transition-all relative ${
                activeTab === 'pending' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Bills
              {pendingBills.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full">
                  {pendingBills.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 px-1 text-sm font-medium transition-all relative ${
                activeTab === 'history' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Payment History
            </button>
          </div>

          {/* Bills List */}
          <div className="space-y-4 min-h-72">
            {displayBills.length > 0 ? (
              displayBills.map(bill => (
                <div 
                  key={bill._id} 
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    
                    {/* Left Info */}
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl shrink-0 ${
                        bill.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {bill.status === 'Paid' ? <Receipt size={24} /> : <AlertCircle size={24} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                          {bill.month} {bill.year}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <IndianRupee size={14} /> {bill.amount.toLocaleString()}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} /> Due: {new Date(bill.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Action */}
                    <div className="w-full sm:w-auto">
                      {bill.status === 'Unpaid' ? (
                        <button 
                          disabled={paymentLoading === bill._id}
                          onClick={() => handlePay(bill._id)}
                          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                        >
                          {paymentLoading === bill._id ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                          Pay Now
                        </button>
                      ) : (
                        <div className="flex flex-col items-end">
                           <span className="flex items-center gap-1.5 text-green-700 font-bold px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg text-sm">
                              <CheckCircle2 size={14} /> Paid
                           </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${activeTab === 'pending' ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400'}`}>
                   {activeTab === 'pending' ? <CheckCircle2 size={32} /> : <History size={32} />}
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {activeTab === 'pending' ? 'All Caught Up!' : 'No History Found'}
                </h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-1">
                  {activeTab === 'pending' 
                    ? "You have no pending maintenance bills. Great job!" 
                    : "You haven't made any payments yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;
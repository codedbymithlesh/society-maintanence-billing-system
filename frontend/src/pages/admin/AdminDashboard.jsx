import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { 
  Users, 
  CreditCard, 
  AlertCircle, 
  Activity, 
  Search, 
  ArrowUpRight,
  Wallet,
  TrendingUp,
  CheckCircle2,
  IndianRupee,
  Clock
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalReceived: 0,
    pendingAmount: 0,
    totalResidents: 0,
    recentPayments: [],
  });
  

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/stats",
          config
        );
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
   
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Dashboard Overview
            </h2>
            <p className="text-gray-500 mt-1">Welcome back, {user.name} 👋</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-600">System Live</span>
          </div>
        </div>

  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Total Received (Green Theme) */}
          <div className="bg-emerald-50 to-white p-6 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Wallet size={100} className="text-emerald-600" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 text-emerald-700 font-medium mb-2">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <TrendingUp size={18} />
                    </div>
                    <span>Total Revenue</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-1">
                  <IndianRupee size={24} className="mt-1"/>
                  {stats.totalReceived.toLocaleString()}
                </h3>
                <p className="text-xs text-emerald-600 mt-2 font-medium bg-emerald-100 w-fit px-2 py-1 rounded-full flex items-center gap-1">
                   <ArrowUpRight size={12} /> Verified Payments
                </p>
            </div>
          </div>

          {/* Card 2: Pending Dues (Red Theme) */}
          <div className="bg-rose-50 to-white p-6 rounded-2xl shadow-sm border border-rose-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <AlertCircle size={100} className="text-rose-600" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 text-rose-700 font-medium mb-2">
                    <div className="p-2 bg-rose-100 rounded-lg">
                        <Activity size={18} />
                    </div>
                    <span>Pending Dues</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-1">
                  <IndianRupee size={24} className="mt-1"/>
                  {stats.pendingAmount.toLocaleString()}
                </h3>
                <p className="text-xs text-rose-600 mt-2 font-medium bg-rose-100 w-fit px-2 py-1 rounded-full flex items-center gap-1">
                   <Clock size={12} /> Action Required
                </p>
            </div>
          </div>

          {/* Card 3: Total Residents (Blue Theme) */}
          <div className="bg-blue-50 to-white p-6 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden group hover:shadow-md transition-all">
             <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Users size={100} className="text-blue-600" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Users size={18} />
                    </div>
                    <span>Total Residents</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {stats.totalResidents}
                </h3>
                <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-100 w-fit px-2 py-1 rounded-full flex items-center gap-1">
                   <CheckCircle2 size={12} /> Active Members
                </p>
            </div>
          </div>
        </div>

        {/* Recent Payments Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h4 className="font-bold text-xl text-gray-800 flex items-center gap-2">
              Recent Transactions
            </h4>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resident</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {stats.recentPayments.length > 0 ? (
                  stats.recentPayments.map((pay) => (
                    <tr 
                      key={pay._id} 
                      className="hover:bg-gray-50/80 transition-colors duration-150 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200">
                            {pay.residentId?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 block">
                              {pay.residentId?.name || "Unknown"}
                            </span>
                            <span className="text-xs text-gray-500">
                               Flat: {pay.residentId?.flatNumber || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center font-bold text-gray-900">
                           <IndianRupee size={14} className="mr-1 text-gray-400"/>
                           {pay.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(pay.paymentDate).toLocaleDateString("en-IN", {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                          <CheckCircle2 size={12} /> Paid
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="bg-gray-50 p-4 rounded-full mb-3">
                           <Activity size={32} className="opacity-40" />
                        </div>
                        <p>No recent transactions recorded</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
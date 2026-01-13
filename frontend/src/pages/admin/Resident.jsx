import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { 
  PlusCircle, 
  X, 
  Search, 
  User, 
  Mail, 
  Phone, 
  Home, 
  Lock, 
  Users 
} from "lucide-react";

const Resident = () => {
  const { user } = useContext(AuthContext);

  const [residents, setResidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "" || "Resident@123",
    role: "resident",
    flatNumber: "",
    contact: "",
  });

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const fetchResidents = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/residents",
        config
      );
      setResidents(data);
    } catch (error) {
      console.error("Failed to fetch residents", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      
      // Native Alert as requested
      alert("Resident added successfully!");

      setShowModal(false);
      fetchResidents();

      setFormData({
        name: "",
        email: "",
        contact: "",
        role: "resident",
        flatNumber: "",
        password: "",
      });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };



  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Residents</h2>
            <p className="text-gray-500 mt-1">Manage all society members and their details</p>
          </div>
          
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 font-medium active:scale-95"
            >
              <PlusCircle size={20} /> 
              <span>Add Resident</span>
            </button>
          
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Member Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Flat Number</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {residents.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200">
                            {r.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{r.name}</p>
                            <p className="text-xs text-gray-500">{r.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm">
                        <Home size={14} className="text-gray-400"/>
                        {r.flatNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                         <Phone size={14} className="text-gray-400"/>
                         {r.contact || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                        {r.role}
                      </span>
                    </td>
                  </tr>
                ))}
                {residents.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <Users size={48} className="mb-2 opacity-20" />
                        <p>No residents found. Add one to get started.</p>
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all scale-100 overflow-hidden">
              
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-800">Add New Resident</h3>
                <button 
                  onClick={() => { setShowModal(false); setError(""); }}
                  className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                   {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                
                {/* Name */}
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    name="name"
                    placeholder="Full Name"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    onChange={handleChange}
                    value={formData.name}
                  />
                </div>

                {/* Email & Contact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all lowercase"
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            type="number"
                            name="contact"
                            placeholder="Mobile Number"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            onChange={handleChange}
                            value={formData.contact}
                        />
                    </div>
                </div>

                {/* Flat & Password Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Home className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            name="flatNumber"
                            required
                            placeholder="Flat (e.g. A-101)"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            onChange={handleChange}
                            value={formData.flatNumber}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="Admin@123"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            onChange={handleChange}
                            value={formData.password}
                        />
                    </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                  >
                    Register Resident
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

export default Resident;
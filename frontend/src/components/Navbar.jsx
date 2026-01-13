import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LogOut, 
  Home, 
  FileText, 
  Users, 
  Menu, 
  X,  
  ChevronRight 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); 
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => {
    return location.pathname === path 
      ? "bg-blue-50 text-blue-600" 
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
         
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-xl font-bold text-gray-800 tracking-tight">
                SnehSagar<span className="text-blue-600"> Society</span>
              </span>
            </Link>
          </div>

         
          <div className="hidden md:flex items-center space-x-2">
            {user.role === 'admin' && (
              <>
                <NavLink to="/admin" icon={<Home size={18} />} label="Dashboard" isActive={isActive('/admin')} />
                <NavLink to="/admin/bills" icon={<FileText size={18} />} label="Manage Bills" isActive={isActive('/admin/bills')} />
                <NavLink to="/admin/residents" icon={<Users size={18} />} label="Residents" isActive={isActive('/admin/residents')} />
              </>
            )}
          </div>

          
          <div className="hidden md:flex items-center gap-4 border-l border-gray-200 pl-6 ml-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700 leading-tight">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {user.role}
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-md hover:bg-gray-100"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

   
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 z-40">
          <div className="px-4 py-3 space-y-2">
            {/* ✅ Mobile me bhi sirf Admin ke liye links */}
            {user.role === 'admin' && (
              <>
                <MobileLink to="/admin" icon={<Home size={18}/>} label="Dashboard" setOpen={setOpen} isActive={location.pathname === '/admin'} />
                <MobileLink to="/admin/bills" icon={<FileText size={18}/>} label="Manage Bills" setOpen={setOpen} isActive={location.pathname === '/admin/bills'} />
                <MobileLink to="/admin/residents" icon={<Users size={18}/>} label="Residents" setOpen={setOpen} isActive={location.pathname === '/admin/residents'} />
              </>
            )}
          </div>
          
          <div className="border-t border-gray-100 px-4 py-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-sm font-medium"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};


const NavLink = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive}`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const MobileLink = ({ to, icon, label, setOpen, isActive }) => (
  <Link
    to={to}
    onClick={() => setOpen(false)}
    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    <ChevronRight size={16} className={`opacity-50 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
  </Link>
);

export default Navbar;
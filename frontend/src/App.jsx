import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBills from './pages/admin/ManageBills';
import ResidentDashboard from './pages/client/ResidentDashboard';
import Resident from './pages/admin/Resident';
import NotFound from './pages/NotFound';



const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/api/auth/admin/signup" element={<AdminRegister />} />
        <Route path="*" element={<NotFound />} />
        
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/bills" element={
          <ProtectedRoute role="admin">
            <ManageBills />
          </ProtectedRoute>
        } />

        <Route path="/admin/residents" element={
          <ProtectedRoute role="admin">
            <Resident />
          </ProtectedRoute>
        } />


        <Route path="/resident" element={
          <ProtectedRoute role="resident">
            <ResidentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/" element={
          user ? (
            <Navigate to={user.role === 'admin' ? "/admin" : "/resident"} />
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;

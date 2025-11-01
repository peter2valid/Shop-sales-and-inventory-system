import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const admin = localStorage.getItem('admin');
    if (admin) {
      try {
        const adminData = JSON.parse(admin);
        setIsAuthenticated(adminData.loggedIn === true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Login Route - Full page */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/admin" replace /> : <Login />
        } />
        
        {/* Admin Panel - Protected */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <div className="flex min-h-screen bg-cream">
              <AdminPanel />
            </div>
          </ProtectedRoute>
        } />

        {/* Main Dashboard Routes - With Sidebar */}
        <Route path="/" element={
          <div className="flex min-h-screen bg-cream">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar title="Dashboard" />
              <Dashboard />
            </div>
          </div>
        } />
        
        <Route path="/products" element={
          <div className="flex min-h-screen bg-cream">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar title="Products" />
              <Products />
            </div>
          </div>
        } />
        
        <Route path="/sales" element={
          <div className="flex min-h-screen bg-cream">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar title="Sales" />
              <Sales />
            </div>
          </div>
        } />
        
        <Route path="/reports" element={
          <div className="flex min-h-screen bg-cream">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar title="Reports" />
              <Reports />
            </div>
          </div>
        } />
        
        <Route path="/payments" element={
          <div className="flex min-h-screen bg-cream">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar title="Payments" />
              <Payments />
            </div>
          </div>
        } />
        
        <Route path="/settings" element={
          <div className="flex min-h-screen bg-cream">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar title="Settings" />
              <Settings />
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUserUpdate = (updatedUserData: any) => {
    console.log('🔄 App.tsx received user update:', updatedUserData);
    setUser(updatedUserData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'super-admin':
      return <SuperAdminDashboard user={user} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />;
    case 'edition-admin':
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Edition Admin Dashboard</h1>
            <p className="text-gray-600 mb-4">Edition admin dashboard coming soon...</p>
            <button 
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        </div>
      );
    case 'company-admin':
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Company Admin Dashboard</h1>
            <p className="text-gray-600 mb-4">Company admin dashboard coming soon...</p>
            <button 
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        </div>
      );
    default:
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">User Dashboard</h1>
            <p className="text-gray-600 mb-4">User dashboard coming soon...</p>
            <button 
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        </div>
      );
  }
}
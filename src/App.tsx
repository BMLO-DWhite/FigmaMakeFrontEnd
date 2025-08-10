import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/auth/LoginPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { SuperAdminDashboard } from './pages/admin/SuperAdminDashboard';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/super-admin/*" 
            element={
              <ProtectedRoute roles={['super-admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edition-admin/*" 
            element={
              <ProtectedRoute roles={['edition-admin']}>
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Edition Admin Dashboard</h1>
                    <p className="text-gray-600">Coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company-admin/*" 
            element={
              <ProtectedRoute roles={['company-admin']}>
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Company Admin Dashboard</h1>
                    <p className="text-gray-600">Coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute roles={['user']}>
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">User Dashboard</h1>
                    <p className="text-gray-600">Coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
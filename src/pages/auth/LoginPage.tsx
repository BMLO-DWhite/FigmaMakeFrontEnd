import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { TestCredentialsDialog } from '../../components/auth/TestCredentialsDialog';
import { Shield, Lock, Users, Activity } from 'lucide-react';
import loginImage from 'figma:asset/d9ba2c6d161d85ab050cc0dc81f4f91d8e70e022.png';

// Your actual backend-dev URL from endpoint_documentation.md
const BACKEND_URL = 'https://sgjirakmlikaskkesjic.supabase.co/functions/v1/backend-dev';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnamlyYWttbGlrYXNra2VzamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjUxOTAsImV4cCI6MjA2OTA0MTE5MH0.kiQmzzUepA4YRaWhwsIf3CzrzWpV5SC40Y82slzjVOY';

export function LoginPage() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('daniel@scanid365.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [showTestCredentials, setShowTestCredentials] = useState(false);

  // If already logged in, redirect to appropriate dashboard
  if (user) {
    switch (user.role) {
      case 'super-admin':
        return <Navigate to="/super-admin" replace />;
      case 'edition-admin':
        return <Navigate to="/edition-admin" replace />;
      case 'company-admin':
        return <Navigate to="/company-admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login to:', `${BACKEND_URL}/auth/login`);
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (response.ok && data.success) {
        const userData = data.user || data.data;
        const token = data.token || AUTH_TOKEN;
        
        if (userData) {
          login(userData, token);
        } else {
          setError('Invalid response from server');
        }
      } else {
        console.error('Login failed:', data);
        setError(data.message || data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login network error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSelect = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setShowTestCredentials(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Blue Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 login-left-panel flex-col justify-center items-center p-12" style={{ backgroundColor: '#294199' }}>
        <div className="text-center text-white max-w-md">
          {/* Logo */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 mx-auto">
            <div className="text-blue-600 font-bold text-lg" style={{ color: '#294199' }}>365</div>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold mb-2">Scan ID 365 Family</h1>
          <h2 className="text-xl font-medium mb-8">Super Admin Portal</h2>
          
          {/* Feature Icons */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2 mx-auto">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm">Secure Access</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2 mx-auto">
                <Users className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm">Admin Control</p>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-sm text-blue-100 leading-relaxed">
            Manage system configurations, user access, and monitor all platform activities from your centralized administrative dashboard.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 login-right-panel flex items-center justify-center p-8" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="login-card w-full max-w-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 mr-2" style={{ color: '#294199' }} />
              <span className="text-sm" style={{ color: '#294199' }}>Super Admin Access</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-sm text-gray-600">
              Sign in to your administrative dashboard<br />
              Secure access for authorized administrators only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Admin Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="daniel@scanid365.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                placeholder="••••••"
                required
              />
            </div>

            {/* Keep Signed In */}
            <div className="flex items-center">
              <input
                id="keep-signed-in"
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
                style={{ accentColor: '#294199' }}
              />
              <Label htmlFor="keep-signed-in" className="ml-2 text-sm text-gray-600">
                Keep me signed in on this device
              </Label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-medium py-3 px-4 rounded-md transition-colors"
              style={{ backgroundColor: '#FF9E1E' }}
            >
              {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
            </Button>

            {/* Show Test Credentials Button */}
            <TestCredentialsDialog
              open={showTestCredentials}
              onOpenChange={setShowTestCredentials}
              onEmailSelect={handleEmailSelect}
            />
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <a href="#" className="text-sm hover:underline" style={{ color: '#294199' }}>
              Need help accessing your account? Contact IT Support
            </a>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start">
              <Shield className="h-4 w-4 mt-0.5 mr-2" style={{ color: '#294199' }} />
              <div className="text-xs text-gray-600">
                <span className="font-medium text-gray-900">Security Notice</span><br />
                This is a restricted access portal. All login attempts are monitored and logged. Only authorized super administrators are permitted to use this system.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
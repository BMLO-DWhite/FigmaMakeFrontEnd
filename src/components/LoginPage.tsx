import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { TestCredentialsDialog } from './TestCredentialsDialog';
import { Shield, Lock, Users, Eye, EyeOff, AlertCircle } from 'lucide-react';

// Environment variables for security
const BACKEND_URL = import.meta.env?.VITE_BACKEND_URL || 'https://sgjirakmlikaskkesjic.supabase.co/functions/v1/backend-dev';
const AUTH_TOKEN = import.meta.env?.VITE_AUTH_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnamlyYWttbGlrYXNra2VzamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjUxOTAsImV4cCI6MjA2OTA0MTE5MH0.kiQmzzUepA4YRaWhwsIf3CzrzWpV5SC40Y82slzjVOY';

interface LoginPageProps {
  onLoginSuccess: (userData: any) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('daniel@scanid365.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [showTestCredentials, setShowTestCredentials] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDebugInfo('');

    try {
      const loginUrl = `${BACKEND_URL}/auth/login`;
      console.log('🔐 Attempting login to:', loginUrl);
      console.log('📧 Email:', email);
      console.log('🔑 Password length:', password.length);

      setDebugInfo(`Connecting to: ${loginUrl}`);

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      console.log('🌐 Login response status:', response.status);
      console.log('🌐 Login response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('📦 Raw response:', responseText);

      if (!response.ok) {
        console.error('❌ Login failed with status:', response.status);
        setError(`HTTP ${response.status}: ${response.statusText}`);
        setDebugInfo(`Server returned: ${response.status} ${response.statusText}\nResponse: ${responseText.substring(0, 200)}`);
        return;
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📦 Parsed login response:', data);
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        setError('Invalid response format from server');
        setDebugInfo(`Response was not valid JSON: ${responseText.substring(0, 200)}`);
        return;
      }

      // FIX: Handle the correct response structure from your backend
      // Your backend returns: { success: true, data: { user: {...}, token: "..." } }
      if (data.success && data.data && data.data.user && data.data.token) {
        console.log('✅ Login successful for user:', data.data.user.email);
        
        // Store the JWT token and user data
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        setDebugInfo('Login successful! Redirecting to dashboard...');
        
        // Call the success callback with the user data
        onLoginSuccess(data.data.user);
        
      } else {
        console.error('❌ Login response missing required fields:', data);
        setError('Login failed - missing user data or token in response');
        setDebugInfo(`Response structure: ${JSON.stringify(data, null, 2)}`);
      }

    } catch (err) {
      console.error('💥 Login network error:', err);
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setDebugInfo(`Network error details: ${err instanceof Error ? err.stack : 'Unknown'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSelect = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setShowTestCredentials(false);
  };

  const testBackendConnection = async () => {
    try {
      setDebugInfo('Testing backend connection...');
      const response = await fetch(`${BACKEND_URL}/health`);
      const data = await response.json();
      setDebugInfo(`Backend Health: ${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      setDebugInfo(`Backend connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen flex font-montserrat">
      {/* Left Panel - Blue Brand Section */}
      <div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 login-left-panel"
        style={{ backgroundColor: '#294199' }}
      >
        <div className="text-center text-white max-w-md">
          {/* Logo */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 mx-auto">
            <div className="font-bold text-lg" style={{ color: '#294199' }}>365</div>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold mb-2 font-montserrat">Scan ID 365 Family</h1>
          <h2 className="text-xl font-medium mb-8 font-montserrat">Super Admin Portal</h2>
          
          {/* Feature Icons */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2 mx-auto">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-montserrat">Secure Access</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2 mx-auto">
                <Users className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-montserrat">Admin Control</p>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-sm text-blue-100 leading-relaxed font-montserrat">
            Manage system configurations, user access, and monitor all platform activities from your centralized administrative dashboard.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div 
        className="w-full lg:w-1/2 flex items-center justify-center p-8 login-right-panel"
        style={{ backgroundColor: '#f8f9fa' }}
      >
        <div className="w-full max-w-md p-8 login-card bg-white rounded-lg shadow-lg border">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 mr-2" style={{ color: '#294199' }} />
              <span className="text-sm font-medium font-montserrat" style={{ color: '#294199' }}>Super Admin Access</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2 font-montserrat">Welcome Back</h1>
            <p className="text-sm text-gray-600 font-montserrat">
              Sign in to your administrative dashboard<br />
              Secure access for authorized administrators only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 font-montserrat">
                Admin Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent font-montserrat"
                style={{ 
                  focusRingColor: '#294199',
                  backgroundColor: '#ffffff'
                }}
                placeholder="daniel@scanid365.com"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 font-montserrat">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent font-montserrat"
                  style={{ 
                    focusRingColor: '#294199',
                    backgroundColor: '#ffffff'
                  }}
                  placeholder="••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
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
                disabled={isLoading}
              />
              <Label htmlFor="keep-signed-in" className="ml-2 text-sm text-gray-600 font-montserrat">
                Keep me signed in on this device
              </Label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3 font-montserrat">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <strong>Authentication Error:</strong><br />
                    {error}
                  </div>
                </div>
              </div>
            )}

            {/* Debug Info */}
            {debugInfo && (
              <div className="text-blue-600 text-xs bg-blue-50 border border-blue-200 rounded-md p-3 font-mono">
                <strong>Debug Info:</strong><br />
                <pre className="whitespace-pre-wrap">{debugInfo}</pre>
              </div>
            )}

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-medium py-3 px-4 rounded-md transition-colors font-montserrat"
              style={{ backgroundColor: '#FF9E1E' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>

            {/* Show Test Credentials Button */}
            <TestCredentialsDialog
              open={showTestCredentials}
              onOpenChange={setShowTestCredentials}
              onEmailSelect={handleEmailSelect}
            />

            {/* Debug Button */}
            <Button
              type="button"
              variant="outline"
              onClick={testBackendConnection}
              className="w-full text-sm font-montserrat"
              disabled={isLoading}
            >
              Test Backend Connection
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <a href="#" className="text-sm hover:underline font-montserrat" style={{ color: '#294199' }}>
              Need help accessing your account? Contact IT Support
            </a>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start">
              <Shield className="h-4 w-4 mt-0.5 mr-2" style={{ color: '#294199' }} />
              <div className="text-xs text-gray-600 font-montserrat">
                <span className="font-medium text-gray-900 font-montserrat">Security Notice</span><br />
                This is a restricted access portal. All login attempts are monitored and logged. Only authorized super administrators are permitted to use this system.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UsersManagement } from './UsersManagement';
import { EditionsManagement } from './EditionsManagement';
import { 
  Home, Users, Building2, Shield, Store, UserCheck, Tag, 
  Package, CreditCard, DollarSign, FileText, Scroll, 
  Award, Settings, Bell, BarChart3, Database, User,
  Globe, Upload, Save, Plus, Search, Filter
} from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Environment variables for security
const BACKEND_URL = import.meta.env?.VITE_BACKEND_URL || 'https://sgjirakmlikaskkesjic.supabase.co/functions/v1/backend-dev';
const AUTH_TOKEN = import.meta.env?.VITE_AUTH_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnamlyYWttbGlrYXNra2VzamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjUxOTAsImV4cCI6MjA2OTA0MTE5MH0.kiQmzzUepA4YRaWhwsIf3CzrzWpV5SC40Y82slzjVOY';

interface SuperAdminDashboardProps {
  user: any;
  onLogout: () => void;
  onUserUpdate?: (updatedUser: any) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export function SuperAdminDashboard({ user, onLogout, onUserUpdate }: SuperAdminDashboardProps) {
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');
  const [systemSettings, setSystemSettings] = useState({
    logoUrl: 'https://admin.scanid365.com/assets/Logo-DAiMxAd8.svg',
    welcomeMessage: 'Welcome to the Scan ID 365 Family!'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalEditions: 0,
    totalUsers: 0,
    totalCompanies: 0,
    totalSuperAdmins: 0
  });
  const [systemHealth, setSystemHealth] = useState({
    status: 'checking',
    uptime: 'Unknown',
    responseTime: 'Unknown'
  });
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  
  // Profile editing states
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || user?.firstName || '',
    last_name: user?.last_name || user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'super-admin',
    status: user?.status || 'active'
  });
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { id: 'user-management', label: 'User Management', icon: <Users className="h-4 w-4" /> },
    { id: 'edition-management', label: 'Edition Management', icon: <Building2 className="h-4 w-4" /> },
    { id: 'safety-id-management', label: 'Safety ID Management', icon: <Tag className="h-4 w-4" /> },
    { id: 'fulfillment-management', label: 'Fulfillment Management', icon: <Package className="h-4 w-4" /> },
    { id: 'transaction-management', label: 'Transaction Management', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'payment-collection', label: 'Payment Collection', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'document-management', label: 'Document Management', icon: <FileText className="h-4 w-4" /> },
    { id: 'notes-management', label: 'Notes Management', icon: <Scroll className="h-4 w-4" /> },
    { id: 'certificate-management', label: 'Certificate Management', icon: <Award className="h-4 w-4" /> },
    { id: 'pricing-payouts', label: 'Pricing & Payouts', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'system-branding', label: 'System Branding', icon: <Globe className="h-4 w-4" /> },
    { id: 'notification-center', label: 'Notification Center', icon: <Bell className="h-4 w-4" /> },
    { id: 'audit-compliance', label: 'Audit & Compliance', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'database-management', label: 'Database Management', icon: <Database className="h-4 w-4" /> },
    { id: 'my-profile', label: 'My Profile', icon: <User className="h-4 w-4" /> }
  ];

  const selectMenuItem = (itemId: string) => {
    setSelectedMenuItem(itemId);
  };

  // Fetch dashboard metrics on component mount
  useEffect(() => {
    fetchDashboardMetrics();
    checkSystemHealth();
  }, []);

  // Update profile data when user changes
  useEffect(() => {
    const userData = currentUser || user;
    setProfileData({
      first_name: userData?.first_name || userData?.firstName || '',
      last_name: userData?.last_name || userData?.lastName || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      role: userData?.role || 'super-admin',
      status: userData?.status || 'active'
    });
  }, [user, currentUser]);

  const fetchDashboardMetrics = async () => {
    try {
      console.log('🔍 Fetching dashboard metrics from:', `${BACKEND_URL}/dashboard-metrics`);
      
      const response = await fetch(`${BACKEND_URL}/dashboard-metrics`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      console.log('📊 Dashboard metrics response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Dashboard metrics response:', data);
        
        if (data.success && data.data) {
          setDashboardMetrics({
            totalEditions: data.data.totalEditions || 0,
            totalUsers: data.data.totalUsers || 0,
            totalCompanies: data.data.totalCompanies || 0,
            totalSuperAdmins: data.data.totalSuperAdmins || 0
          });
          console.log('✅ Dashboard metrics loaded successfully');
        } else {
          console.warn('⚠️ Dashboard metrics returned success but no data:', data);
        }
      } else {
        console.error('❌ Failed to fetch dashboard metrics:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('�� Error fetching dashboard metrics:', error);
    } finally {
      setIsDashboardLoading(false);
    }
  };

  const checkSystemHealth = async () => {
    const startTime = Date.now();
    try {
      console.log('🔍 Checking system health from:', `${BACKEND_URL}/health`);
      
      const response = await fetch(`${BACKEND_URL}/health`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.log('🔍 System health response status:', response.status, 'Response time:', responseTime + 'ms');
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 System health response:', data);
        
        setSystemHealth({
          status: 'online',
          uptime: data.uptime || 'Available',
          responseTime: responseTime + 'ms'
        });
        console.log('✅ System health check successful');
      } else {
        console.error('❌ System health check failed:', response.status);
        setSystemHealth({
          status: 'error',
          uptime: 'Unknown',
          responseTime: responseTime + 'ms'
        });
      }
    } catch (error) {
      console.error('���� Error checking system health:', error);
      setSystemHealth({
        status: 'offline',
        uptime: 'Unknown',
        responseTime: 'Timeout'
      });
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out via:', `${BACKEND_URL}/auth/logout`);
      
      const response = await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      console.log('Logout response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Logout response data:', data);
      } else {
        console.error('Logout request failed:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and logout regardless of server response
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      onLogout();
    }
  };

  const handleUpdateProfile = async () => {
    setIsProfileLoading(true);
    try {
      console.log('🔍 Updating logged-in user profile via /profile endpoint');
      console.log('📝 Profile data to update:', profileData);
      console.log('🔗 Backend URL:', `${BACKEND_URL}/profile`);
      console.log('🔑 Using AUTH_TOKEN:', AUTH_TOKEN.substring(0, 50) + '...');

      const response = await fetch(`${BACKEND_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          email: profileData.email,
          phone: profileData.phone
        }),
      });

      console.log('📡 Profile update response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Profile update response:', data);
        console.log('📊 Response data structure:', JSON.stringify(data, null, 2));

        if (data.success) {
          // Update the current user state
          const updatedUser = {
            ...currentUser,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            firstName: profileData.first_name, // Support both formats
            lastName: profileData.last_name,
            email: profileData.email,
            phone: profileData.phone,
            role: profileData.role,
            status: profileData.status
          };
          
          setCurrentUser(updatedUser);
          
          // Update localStorage so changes persist
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Notify parent component of user update
          if (onUserUpdate) {
            onUserUpdate(updatedUser);
          }
          
          toast.success('Profile updated successfully');
        } else {
          toast.error(data.error || 'Failed to update profile');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Profile update failed:', response.status, response.statusText);
        console.error('❌ Error response body:', errorData);
        console.error('❌ Full response headers:', response.headers);
        toast.error(errorData.error || `Failed to update profile (${response.status})`);
      }
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      toast.error('Failed to update profile');
    } finally {
      setIsProfileLoading(false);
    }
  };

  const getBreadcrumb = () => {
    const menuItem = menuItems.find(item => item.id === selectedMenuItem);
    return `Super Admin Dashboard > ${menuItem?.label || 'Unknown'}`;
  };

  const renderMainContent = () => {
    switch (selectedMenuItem) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="text-sm text-gray-600 font-montserrat">
              {getBreadcrumb()}
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-900 font-montserrat">System Overview</h1>
            
            {isDashboardLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="w-12 h-8 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-montserrat">Total Editions</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-montserrat">{dashboardMetrics.totalEditions}</div>
                    <p className="text-xs text-muted-foreground font-montserrat">Active system editions</p>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-montserrat">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-montserrat">{dashboardMetrics.totalUsers}</div>
                    <p className="text-xs text-muted-foreground font-montserrat">System-wide users</p>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-montserrat">Total Companies</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-montserrat">{dashboardMetrics.totalCompanies}</div>
                    <p className="text-xs text-muted-foreground font-montserrat">Across all editions</p>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-montserrat">System Health</CardTitle>
                    <BarChart3 className={`h-4 w-4 ${
                      systemHealth.status === 'online' ? 'text-green-500' : 
                      systemHealth.status === 'error' ? 'text-orange-500' : 'text-red-500'
                    }`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold font-montserrat ${
                      systemHealth.status === 'online' ? 'text-green-600' : 
                      systemHealth.status === 'error' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {systemHealth.status === 'online' ? 'Online' : 
                       systemHealth.status === 'error' ? 'Warning' : 'Offline'}
                    </div>
                    <p className="text-xs text-muted-foreground font-montserrat">
                      Response: {systemHealth.responseTime}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="font-montserrat">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start font-montserrat" 
                    variant="outline"
                    onClick={() => selectMenuItem('user-management')}
                    style={{ borderColor: '#294199', color: '#294199' }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button 
                    className="w-full justify-start font-montserrat" 
                    variant="outline"
                    onClick={() => selectMenuItem('edition-management')}
                    style={{ borderColor: '#294199', color: '#294199' }}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Manage Editions
                  </Button>
                  <Button 
                    className="w-full justify-start font-montserrat" 
                    variant="outline"
                    onClick={() => selectMenuItem('system-branding')}
                    style={{ borderColor: '#294199', color: '#294199' }}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    System Branding
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="font-montserrat">System Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium font-montserrat">Super Admins</span>
                      <Badge variant="secondary" className="font-montserrat">
                        {isDashboardLoading ? '...' : dashboardMetrics.totalSuperAdmins}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium font-montserrat">System Status</span>
                      <Badge 
                        variant={systemHealth.status === 'online' ? 'default' : 'destructive'}
                        className={`font-montserrat ${
                          systemHealth.status === 'online' ? 'bg-green-100 text-green-800' : ''
                        }`}
                      >
                        {systemHealth.status === 'online' ? 'Operational' : 
                         systemHealth.status === 'error' ? 'Issues' : 'Down'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium font-montserrat">Response Time</span>
                      <span className="text-sm text-gray-600 font-montserrat">{systemHealth.responseTime}</span>
                    </div>
                    <div className="pt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          fetchDashboardMetrics();
                          checkSystemHealth();
                        }}
                        className="w-full font-montserrat"
                      >
                        Refresh Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'system-branding':
        return (
          <div className="space-y-6">
            <div className="text-sm text-gray-600 font-montserrat">
              {getBreadcrumb()}
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-900 font-montserrat">System Branding</h1>
            
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-montserrat">
                  <Globe className="h-5 w-5 mr-2" />
                  Global Branding Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-900 font-montserrat">System Logo</Label>
                  <p className="text-sm text-gray-600 mb-4 font-montserrat">
                    This logo appears in the top-left corner of the application
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Label className="text-sm font-medium text-gray-700 font-montserrat">Current Logo</Label>
                      <div className="mt-2 flex justify-center">
                        <img 
                          src={systemSettings.logoUrl} 
                          alt="Current Logo" 
                          className="max-h-16 w-auto"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <Label className="text-sm font-medium text-gray-700 font-montserrat">Drop new logo here or click to browse</Label>
                      <p className="text-xs text-gray-500 mt-1 font-montserrat">
                        Recommended: PNG/SVG, max 200KB
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="welcome-message" className="text-sm font-medium text-gray-900 font-montserrat">
                    Welcome Message
                  </Label>
                  <p className="text-sm text-gray-600 mb-2 font-montserrat">
                    This message appears in the header of the application
                  </p>
                  <Input
                    id="welcome-message"
                    value={systemSettings.welcomeMessage}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                    className="font-montserrat"
                    placeholder="Enter welcome message"
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="font-montserrat"
                    style={{ backgroundColor: '#294199' }}
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Branding Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'user-management':
        return <UsersManagement />;

      case 'edition-management':
        return <EditionsManagement />;
      
      case 'my-profile':
        return (
          <div className="space-y-6">
            <div className="text-sm text-gray-600 font-montserrat">
              {getBreadcrumb()}
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-900 font-montserrat">My Profile</h1>
            
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-montserrat">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="profile_first_name" className="text-sm font-semibold text-gray-700 mb-1">
                      First Name
                    </Label>
                    <Input
                      id="profile_first_name"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                      className="bg-white border border-gray-300 focus:border-scan-primary-blue focus:ring-1 focus:ring-scan-primary-blue"
                    />
                  </div>
                  <div>
                    <Label htmlFor="profile_last_name" className="text-sm font-semibold text-gray-700 mb-1">
                      Last Name
                    </Label>
                    <Input
                      id="profile_last_name"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                      className="bg-white border border-gray-300 focus:border-scan-primary-blue focus:ring-1 focus:ring-scan-primary-blue"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="profile_email" className="text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </Label>
                  <Input
                    id="profile_email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="bg-white border border-gray-300 focus:border-scan-primary-blue focus:ring-1 focus:ring-scan-primary-blue"
                  />
                </div>

                <div>
                  <Label htmlFor="profile_phone" className="text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </Label>
                  <Input
                    id="profile_phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                    className="bg-white border border-gray-300 focus:border-scan-primary-blue focus:ring-1 focus:ring-scan-primary-blue"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-1">Role</Label>
                    <div className="p-2 bg-gray-50 rounded border">
                      <Badge className="bg-purple-100 text-purple-800">
                        {profileData.role.replace('-', ' ')}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-1">Status</Label>
                    <div className="p-2 bg-gray-50 rounded border">
                      <Badge className="bg-green-100 text-green-800">
                        {profileData.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">Status managed by system</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    onClick={handleUpdateProfile}
                    className="bg-scan-primary-blue hover:bg-scan-primary-blue/90 font-montserrat"
                    disabled={isProfileLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isProfileLoading ? 'Saving...' : 'Save Profile Changes'}
                  </Button>
                </div>

                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>User ID:</span>
                    <span className="font-mono">{currentUser?.id || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Created:</span>
                    <span>{currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'Not available'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span>{currentUser?.updated_at ? new Date(currentUser.updated_at).toLocaleDateString() : 'Not available'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            <div className="text-sm text-gray-600 font-montserrat">
              {getBreadcrumb()}
            </div>
            
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Settings className="h-16 w-16 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">Feature Coming Soon</h2>
              <p className="text-gray-600 font-montserrat">
                This feature is currently under development and will be available soon.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-scan-light-gray font-montserrat">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-scan-primary-blue rounded flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">SI</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 font-montserrat">
                  Welcome to the Scan ID 365 Family!
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 font-montserrat">
                  {currentUser?.first_name || currentUser?.firstName || 'Daniel'} {currentUser?.last_name || currentUser?.lastName || 'SuperWhite'}
                </p>
                <p className="text-xs text-gray-500 font-montserrat">{currentUser?.role || 'super-admin'}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="font-montserrat"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4 font-montserrat">
              SUPER ADMIN SETTINGS
            </div>
            <div className="space-y-1">
              {menuItems.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center px-3 py-2 text-sm cursor-pointer rounded-md font-montserrat ${
                    selectedMenuItem === item.id 
                      ? 'bg-scan-primary-blue text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => selectMenuItem(item.id)}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span className="flex-1 truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}
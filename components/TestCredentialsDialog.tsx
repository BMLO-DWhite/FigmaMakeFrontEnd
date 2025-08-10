import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Copy, Users, Building, Shield, User, Search, Filter, Eye, EyeOff, X, Globe } from 'lucide-react';

// Your actual backend-dev URL from endpoint_documentation.md
const BACKEND_URL = 'https://sgjirakmlikaskkesjic.supabase.co/functions/v1/backend-dev';
// Use the proper authentication token from your endpoint documentation
const API_AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnamlyYWttbGlrYXNra2VzamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjUxOTAsImV4cCI6MjA2OTA0MTE5MH0.kiQmzzUepA4YRaWhwsIf3CzrzWpV5SC40Y82slzjVOY';

// Use your credentials to authenticate and fetch real users
const ADMIN_EMAIL = 'daniel@scanid365.com';
const ADMIN_PASSWORD = '123456';
const DEFAULT_PASSWORD = '123456';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  created_at?: string;
  last_login?: string;
  status: string;
  // Additional fields from database schema
  editionId?: string;
  companyId?: string;
  channelId?: string;
  phone?: string;
  profileImageUrl?: string;
  // Populated fields from joins
  editionName?: string;
  companyName?: string;
  channelName?: string;
}

interface TestCredentialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailSelect: (email: string) => void;
}

export function TestCredentialsDialog({ open, onOpenChange, onEmailSelect }: TestCredentialsDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authToken, setAuthToken] = useState('');
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedEdition, setSelectedEdition] = useState('all');
  const [activeTab, setActiveTab] = useState('role');
  const [showPassword, setShowPassword] = useState(false);

  const fetchRealUsers = async () => {
    setIsLoading(true);
    setError('');
    setUsers([]);

    try {
      console.log('🔐 Authenticating with your credentials to verify access...');
      
      // Step 1: First verify credentials with login endpoint
      const loginResponse = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        }),
      });

      console.log('🔐 Login verification status:', loginResponse.status);
      
      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        console.error('❌ Authentication verification failed:', loginResponse.status, errorText);
        setError(`Failed to verify credentials: ${loginResponse.status} ${loginResponse.statusText}`);
        return;
      }

      const loginData = await loginResponse.json();
      console.log('✅ Authentication verified successfully');

      // Verify we have the correct response structure
      if (!loginData.success || !loginData.data) {
        console.error('❌ Login response invalid structure:', loginData);
        setError(`Authentication failed - invalid response structure`);
        return;
      }

      // Step 2: Use the API auth token (from endpoint documentation) to fetch users
      console.log('👥 Fetching real users from database using API auth token...');
      const usersResponse = await fetch(`${BACKEND_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${API_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 Users response status:', usersResponse.status);
      console.log('📊 Users response headers:', Object.fromEntries(usersResponse.headers.entries()));
      
      if (!usersResponse.ok) {
        const errorText = await usersResponse.text();
        console.error('❌ Failed to fetch users:', usersResponse.status, errorText);
        setError(`Failed to load users: ${usersResponse.status} ${usersResponse.statusText}\nError: ${errorText}\nUsing API token: ${API_AUTH_TOKEN.substring(0, 20)}...`);
        return;
      }

      const usersData = await usersResponse.json();
      console.log('👤 Real users response structure:', JSON.stringify(usersData, null, 2));
      
      // Handle the response structure for users endpoint
      // Backend returns { success: true, data: { users: [...] } }
      if (usersData.success && usersData.data && usersData.data.users) {
        // Users already come in camelCase format from the backend
        const users = usersData.data.users.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          created_at: user.createdAt,
          last_login: user.lastLogin,
          status: user.status,
          // Include additional fields if available
          editionId: user.editionId,
          companyId: user.companyId,
          phone: user.phone,
          profileImageUrl: user.profileImageUrl,
          editionName: user.edition?.name,
          companyName: user.company?.name
        }));
        setUsers(users);
        setFilteredUsers(users);
        setAuthToken(API_AUTH_TOKEN);
        console.log('✅ Loaded', users.length, 'real users from database');
      } else {
        console.warn('⚠️ Users response missing data. Full response:', usersData);
        setError(`No user data available. Response structure: ${JSON.stringify(usersData, null, 2)}`);
      }

    } catch (err) {
      console.error('💥 Error fetching real users:', err);
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}\nStack: ${err instanceof Error ? err.stack : 'No stack'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch users when dialog opens
  useEffect(() => {
    if (open && users.length === 0 && !isLoading) {
      fetchRealUsers();
    }
  }, [open]);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Apply role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Apply edition filter
    if (selectedEdition !== 'all') {
      filtered = filtered.filter(user => user.editionName === selectedEdition || user.editionId === selectedEdition);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName?.toLowerCase().includes(query) ||
        user.lastName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query) ||
        user.companyName?.toLowerCase().includes(query) ||
        user.editionName?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, selectedRole, selectedEdition]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super-admin':
        return <Shield className="h-4 w-4" />;
      case 'edition-admin':
        return <Users className="h-4 w-4" />;
      case 'company-admin':
        return <Building className="h-4 w-4" />;
      case 'channel-admin':
        return <Globe className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'destructive';
      case 'edition-admin':
        return 'default';
      case 'company-admin':
        return 'secondary';
      case 'channel-admin':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('📋 Copied to clipboard:', text);
    } catch (err) {
      console.error('❌ Failed to copy:', err);
    }
  };

  const getRoleDisplayName = (role: string) => {
    return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const groupUsersByRole = () => {
    const grouped: { [key: string]: User[] } = {};
    filteredUsers.forEach(user => {
      if (!grouped[user.role]) {
        grouped[user.role] = [];
      }
      grouped[user.role].push(user);
    });
    return grouped;
  };

  const getAllRoles = () => {
    const roles = Array.from(new Set(users.map(user => user.role)));
    return roles.sort();
  };

  const getAllEditions = () => {
    const editions = Array.from(new Set(users.map(user => user.editionName || 'No Edition').filter(Boolean)));
    return editions.sort();
  };

  const groupedUsers = groupUsersByRole();

  const renderUsersByTab = () => {
    switch (activeTab) {
      case 'role':
        return (
          <div className="space-y-4">
            {Object.entries(groupedUsers).map(([role, roleUsers]) => (
              <div key={role} className="space-y-3">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 font-montserrat">
                  {getRoleIcon(role)}
                  <span>{getRoleDisplayName(role)}</span>
                  <span className="text-gray-400">({roleUsers.length} users)</span>
                </div>
                
                <div className="space-y-2">
                  {roleUsers.map((user) => (
                    <UserCard key={user.id} user={user} onEmailSelect={onEmailSelect} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'name':
        const sortedByName = [...filteredUsers].sort((a, b) => 
          `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        );
        return (
          <div className="space-y-2">
            {sortedByName.map((user) => (
              <UserCard key={user.id} user={user} onEmailSelect={onEmailSelect} />
            ))}
          </div>
        );
      
      case 'company':
        const groupedByCompany: { [key: string]: User[] } = {};
        filteredUsers.forEach(user => {
          const company = user.companyName || 'No Company';
          if (!groupedByCompany[company]) {
            groupedByCompany[company] = [];
          }
          groupedByCompany[company].push(user);
        });
        
        return (
          <div className="space-y-4">
            {Object.entries(groupedByCompany).map(([company, companyUsers]) => (
              <div key={company} className="space-y-3">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 font-montserrat">
                  <Building className="h-4 w-4" />
                  <span>{company}</span>
                  <span className="text-gray-400">({companyUsers.length} users)</span>
                </div>
                
                <div className="space-y-2">
                  {companyUsers.map((user) => (
                    <UserCard key={user.id} user={user} onEmailSelect={onEmailSelect} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'edition':
        const groupedByEdition: { [key: string]: User[] } = {};
        filteredUsers.forEach(user => {
          const edition = user.editionName || 'No Edition';
          if (!groupedByEdition[edition]) {
            groupedByEdition[edition] = [];
          }
          groupedByEdition[edition].push(user);
        });
        
        return (
          <div className="space-y-4">
            {Object.entries(groupedByEdition).map(([edition, editionUsers]) => (
              <div key={edition} className="space-y-3">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 font-montserrat">
                  <Globe className="h-4 w-4" />
                  <span>{edition}</span>
                  <span className="text-gray-400">({editionUsers.length} users)</span>
                </div>
                
                <div className="space-y-2">
                  {editionUsers.map((user) => (
                    <UserCard key={user.id} user={user} onEmailSelect={onEmailSelect} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-center font-medium font-montserrat"
          style={{ borderColor: '#294199', color: '#294199' }}
        >
          <Users className="h-4 w-4 mr-2" />
          Show Test Credentials
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-4xl max-h-[90vh] overflow-hidden bg-white font-montserrat" 
        description="View and select real user credentials from your database for development and testing purposes"
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold font-montserrat">
            Test Credentials - All Users
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-600 font-montserrat">
            Use these credentials to test different user roles across all editions and companies. All accounts use the password "123456".
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, role, company, or edition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-montserrat"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 font-montserrat">
              <TabsTrigger value="role" className="font-montserrat">Role</TabsTrigger>
              <TabsTrigger value="name" className="font-montserrat">Name</TabsTrigger>
              <TabsTrigger value="company" className="font-montserrat">Company</TabsTrigger>
              <TabsTrigger value="edition" className="font-montserrat">Edition</TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="flex items-center space-x-4 py-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600 font-montserrat">Filters:</span>
              </div>
              
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-40 font-montserrat">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-montserrat">All Roles</SelectItem>
                  {getAllRoles().map(role => (
                    <SelectItem key={role} value={role} className="font-montserrat">
                      {getRoleDisplayName(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedEdition} onValueChange={setSelectedEdition}>
                <SelectTrigger className="w-40 font-montserrat">
                  <SelectValue placeholder="All Editions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-montserrat">All Editions</SelectItem>
                  {getAllEditions().map(edition => (
                    <SelectItem key={edition} value={edition} className="font-montserrat">
                      {edition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Default Password Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 font-montserrat">Default Password</h4>
                  <p className="text-sm text-gray-600 font-montserrat">Used for all test accounts</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={DEFAULT_PASSWORD}
                      readOnly
                      className="pr-16 w-32 font-mono font-montserrat"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-6 w-6 p-0"
                      >
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(DEFAULT_PASSWORD)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: '#294199' }}></div>
                  <p className="text-gray-600 font-montserrat">Authenticating and loading real users from database...</p>
                  <p className="text-xs text-gray-500 font-montserrat mt-2">
                    Verifying credentials: {ADMIN_EMAIL}
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-4 font-montserrat bg-red-50 border border-red-200 rounded-md p-3 text-left">
                    <strong>Database Error:</strong><br />
                    <pre className="whitespace-pre-wrap text-xs mt-2">{error}</pre>
                  </div>
                  <Button onClick={fetchRealUsers} variant="outline" className="font-montserrat">
                    Retry Loading Real Users
                  </Button>
                </div>
              ) : filteredUsers.length > 0 ? (
                <TabsContent value={activeTab} className="mt-0">
                  {renderUsersByTab()}
                </TabsContent>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-montserrat">No users found matching your filters</p>
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRole('all');
                      setSelectedEdition('all');
                    }} 
                    variant="outline" 
                    className="mt-4 font-montserrat"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </Tabs>

          {/* Debug Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
            <div className="text-xs text-gray-600 font-montserrat">
              <span className="font-medium text-gray-900 font-montserrat">Real Database Integration:</span><br />
              • Authentication: JWT-based API token from endpoint documentation<br />
              • Verification: Using {ADMIN_EMAIL} credentials<br />
              • Backend: {BACKEND_URL}<br />
              • Endpoints: /auth/login (verify) → /users (fetch)<br />
              • Users loaded: {users.length} from database<br />
              • Filtered results: {filteredUsers.length} users<br />
              • API token: {authToken ? authToken.substring(0, 20) + '...' : 'None'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// User Card Component
interface UserCardProps {
  user: User;
  onEmailSelect: (email: string) => void;
}

function UserCard({ user, onEmailSelect }: UserCardProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super-admin':
        return <Shield className="h-4 w-4" />;
      case 'edition-admin':
        return <Users className="h-4 w-4" />;
      case 'company-admin':
        return <Building className="h-4 w-4" />;
      case 'channel-admin':
        return <Globe className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'destructive';
      case 'edition-admin':
        return 'default';
      case 'company-admin':
        return 'secondary';
      case 'channel-admin':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleDisplayName = (role: string) => {
    return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('📋 Copied to clipboard:', text);
    } catch (err) {
      console.error('❌ Failed to copy:', err);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-2">
              {getRoleIcon(user.role)}
              <h3 className="font-medium text-gray-900 font-montserrat">
                {user.firstName} {user.lastName}
              </h3>
            </div>
            <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs font-montserrat">
              {getRoleDisplayName(user.role)}
            </Badge>
          </div>
          
          <div className="space-y-1">
            {user.companyName && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Building className="h-3 w-3" />
                <span className="font-montserrat">{user.companyName}</span>
              </div>
            )}
            
            {user.editionName && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Globe className="h-3 w-3" />
                <span className="font-montserrat">{user.editionName}</span>
              </div>
            )}
            
            <div className="text-sm text-blue-600 font-montserrat">
              {user.email}
            </div>
            
            {user.last_login && (
              <p className="text-xs text-gray-500 font-montserrat">
                Last login: {new Date(user.last_login).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(user.email)}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            onClick={() => onEmailSelect(user.email)}
            className="text-white font-montserrat"
            style={{ backgroundColor: '#294199' }}
          >
            Use This User
          </Button>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Copy, Users, Building, Shield, User } from 'lucide-react';

// Your actual backend-dev URL from endpoint_documentation.md
const BACKEND_URL = 'https://sgjirakmlikaskkesjic.supabase.co/functions/v1/backend-dev';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnamlyYWttbGlrYXNra2VzamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjUxOTAsImV4cCI6MjA2OTA0MTE5MH0.kiQmzzUepA4YRaWhwsIf3CzrzWpV5SC40Y82slzjVOY';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'super-admin' | 'edition-admin' | 'company-admin' | 'channel-admin' | 'user';
  edition_id?: string;
  company_id?: string;
  status: string;
}

interface TestCredentialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailSelect: (email: string) => void;
}

export function TestCredentialsDialog({ open, onOpenChange, onEmailSelect }: TestCredentialsDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && users.length === 0) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');

    try {
      console.log('Fetching users from:', `${BACKEND_URL}/users`);
      const response = await fetch(`${BACKEND_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Users response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Users response data:', data);
        
        if (data.success && data.data) {
          setUsers(data.data);
        } else {
          console.warn('Users returned success but no data:', data);
          setError('No user data available');
        }
      } else {
        console.error('Failed to fetch users:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error details:', errorData);
        setError('Failed to load user data');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Network error while loading users');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super-admin':
        return <Shield className="h-4 w-4" />;
      case 'edition-admin':
        return <Users className="h-4 w-4" />;
      case 'company-admin':
        return <Building className="h-4 w-4" />;
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
      default:
        return 'outline';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-center font-medium"
          style={{ borderColor: '#294199', color: '#294199' }}
        >
          <Users className="h-4 w-4 mr-2" />
          Show Test Credentials
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-2xl max-h-[80vh] overflow-y-auto" 
        description="View and select test user credentials from the database for development and testing purposes"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Test User Credentials
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users from database...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">
                {error}
              </div>
              <Button onClick={fetchUsers} variant="outline">
                Retry
              </Button>
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-600 mb-4">
                Select a user to copy their email and login with their credentials. All passwords are "123456" for testing.
              </div>
              
              {users.map((user) => (
                <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getRoleIcon(user.role)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.first_name} {user.last_name}
                          </p>
                          <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                            {user.role.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate">
                          {user.email}
                        </p>
                        
                        {user.status && (
                          <p className="text-xs text-gray-500">
                            Status: {user.status}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(user.email)}
                        className="flex items-center"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onEmailSelect(user.email)}
                        style={{ backgroundColor: '#294199' }}
                        className="text-white"
                      >
                        Use This User
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No users found in database</p>
              <Button onClick={fetchUsers} variant="outline" className="mt-4">
                Refresh
              </Button>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
            <div className="text-xs text-gray-600">
              <span className="font-medium text-gray-900">Testing Information:</span><br />
              • All test passwords are "123456"<br />
              • Users are fetched from your actual database<br />
              • Select any user to test different role access levels
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Archive, 
  MoreHorizontal, 
  ArrowUpDown,
  ArrowLeftRight,
  AlertCircle,
  Users as UsersIcon,
  Mail,
  Phone,
  Building,
  Calendar,
  Trash,
  X
} from 'lucide-react';
import { toast } from 'sonner';

// Environment variables for security
const BACKEND_URL = import.meta.env?.VITE_BACKEND_URL || 'https://sgjirakmlikaskkesjic.supabase.co/functions/v1/backend-dev';
const AUTH_TOKEN = import.meta.env?.VITE_AUTH_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnamlyYWttbGlrYXNra2VzamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjUxOTAsImV4cCI6MjA2OTA0MTE5MH0.kiQmzzUepA4YRaWhwsIf3CzrzWpV5SC40Y82slzjVOY';

interface UserCompanyRole {
  company_id: string;
  company_name: string;
  role: 'company-admin' | 'channel-admin' | 'user';
  channel_id?: string;
  channel_name?: string;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'super-admin' | 'edition-admin' | 'company-admin' | 'channel-admin' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  edition_id?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
  edition_name?: string;
  user_companies: UserCompanyRole[];
  company_id?: string;
  company_name?: string;
  channel_id?: string;
  channel_name?: string;
}

interface Company {
  id: string;
  name: string;
  edition_id: string;
  edition_name?: string;
  is_channel_partner?: boolean;
  parent_company_id?: string;
  channel_id?: string;
}

interface Channel {
  id: string;
  name: string;
  edition_id: string;
  edition_name?: string;
  is_channel_partner: boolean;
}

interface Edition {
  id: string;
  name: string;
  slug: string;
}

interface RoleAssignment {
  id: string;
  edition_id: string;
  edition_name?: string;
  channel_id: string;
  channel_name?: string;
  company_id: string;
  company_name?: string;
  role: 'super-admin' | 'edition-admin' | 'channel-admin' | 'company-admin' | 'user';
  status: 'active' | 'inactive';
}

interface UsersManagementProps {
  filterByEdition?: string;
  filterByCompany?: string;
  filterByChannel?: string;
  userRole?: 'super-admin' | 'edition-admin' | 'company-admin' | 'channel-admin';
  title?: string;
}

export function UsersManagement({ 
  filterByEdition,
  filterByCompany, 
  filterByChannel,
  userRole = 'super-admin',
  title = 'Users Management'
}: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editionFilter, setEditionFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  
  // Sort states
  const [sortField, setSortField] = useState<keyof User>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Modal states
  const [showAddUser, setShowAddUser] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    status: 'active' as 'active' | 'inactive' | 'suspended'
  });

  // Role assignments management
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Modal 2: Add Company Relationship states
  const [editingRelationshipId, setEditingRelationshipId] = useState<string | null>(null);
  const [relationshipFormData, setRelationshipFormData] = useState({
    edition_id: 'not-selected',
    channel_id: 'none',
    company_id: 'not-selected',
    role: 'user' as 'edition-admin' | 'channel-admin' | 'company-admin' | 'user'
  });

  // Companies data for current edition selection
  const [editionCompanies, setEditionCompanies] = useState<Company[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
    fetchCompanies();
    fetchEditions();
    fetchChannels();
  }, []);

  // Apply search and filters when data or filters change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [users, searchTerm, roleFilter, statusFilter, editionFilter, companyFilter, sortField, sortDirection]);

  const fetchUsers = async () => {
    try {
      console.log('🔍 Fetching users...');
      const response = await fetch(`${BACKEND_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const usersData = await response.json();
      if (usersData.success && usersData.data && usersData.data.users) {
        const users = usersData.data.users.map(user => ({
          id: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: user.role,
          status: user.status,
          edition_id: user.editionId,
          last_login: user.lastLogin,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
          edition_name: user.edition?.name,
          user_companies: user.userCompanies?.map(uc => ({
            company_id: uc.companyId,
            company_name: uc.company?.name || 'Unknown Company',
            role: uc.role,
            channel_id: uc.company?.channelId,
            channel_name: uc.company?.channel?.name
          })) || [],
          company_id: user.userCompanies?.[0]?.companyId || user.companyId,
          company_name: user.userCompanies?.[0]?.company?.name || user.company?.name,
          channel_id: user.userCompanies?.[0]?.company?.channelId || user.channelId,
          channel_name: user.userCompanies?.[0]?.company?.channel?.name || user.channel?.name
        }));
        
        setUsers(users);
        setError('');
        console.log('✅ Successfully loaded', users.length, 'users');
      } else {
        setUsers([]);
        setError('No user data available');
      }
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      setUsers([]);
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/companies`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const mappedCompanies = data.data.map(company => ({
            id: company.id,
            name: company.name,
            edition_id: company.editionId || company.edition_id,
            edition_name: company.edition?.name || company.edition_name,
            is_channel_partner: company.isChannelPartner || company.is_channel_partner,
            parent_company_id: company.parentCompanyId || company.parent_company_id,
            channel_id: company.channelId || company.channel_id
          }));
          
          setCompanies(mappedCompanies);
        }
      }
    } catch (err) {
      console.error('❌ Error fetching companies:', err);
    }
  };

  const fetchEditions = async () => {
    try {
      console.log('🔍 [EDITIONS API] Fetching editions from:', `${BACKEND_URL}/editions`);
      
      const response = await fetch(`${BACKEND_URL}/editions`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      console.log('📡 [EDITIONS API] Response status:', response.status);
      console.log('📡 [EDITIONS API] Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('📄 [EDITIONS API] Full raw response:', JSON.stringify(data, null, 2));
        
        if (data.success && data.data && Array.isArray(data.data)) {
          console.log('✅ [EDITIONS API] Valid response structure detected');
          console.log('📊 [EDITIONS API] Number of editions returned:', data.data.length);
          console.log('📊 [EDITIONS API] Expected: 5 editions');
          
          // Log each edition in detail
          data.data.forEach((edition, index) => {
            console.log(`📑 [EDITION ${index + 1}]`, {
              id: edition.id,
              name: edition.name,
              slug: edition.slug,
              fullObject: edition
            });
          });
          
          setEditions(data.data);
          console.log('✅ [EDITIONS STATE] Successfully set', data.data.length, 'editions in state');
          
          // Verify state update
          setTimeout(() => {
            console.log('🔍 [EDITIONS STATE] State verification after 100ms');
          }, 100);
          
        } else {
          console.error('❌ [EDITIONS API] Invalid response structure:');
          console.error('   - data.success:', data.success);
          console.error('   - data.data exists:', !!data.data);
          console.error('   - data.data is array:', Array.isArray(data.data));
          console.error('   - Full response:', data);
          setEditions([]);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ [EDITIONS API] HTTP Error:', response.status, response.statusText);
        console.error('❌ [EDITIONS API] Error body:', errorText);
        setEditions([]);
      }
    } catch (err) {
      console.error('����� [EDITIONS API] Network/Parse Error:', err);
      console.error('❌ [EDITIONS API] Error details:', {
        message: err.message,
        stack: err.stack,
        url: `${BACKEND_URL}/editions`
      });
      setEditions([]);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/companies`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const mappedChannels = data.data
            .filter(company => {
              const isChannelPartner = company.type?.isChannelPartner || company.isChannelPartner || company.is_channel_partner;
              console.log(`🔍 [CHANNEL FILTER] ${company.name}: isChannelPartner =`, isChannelPartner);
              return isChannelPartner === true;
            })
            .map(company => ({
              id: company.id,
              name: company.name,
              edition_id: company.editionId || company.edition_id,
              edition_name: company.edition?.name || company.edition_name,
              is_channel_partner: true
            }));
          
          setChannels(mappedChannels);
        }
      }
    } catch (err) {
      console.error('❌ Error fetching channels:', err);
    }
  };

  const applyFiltersAndSearch = () => {
    if (!Array.isArray(users)) {
      setFilteredUsers([]);
      return;
    }
    
    let filtered = [...users];

    // Apply role-based filtering first
    if (filterByEdition) {
      filtered = filtered.filter(user => user.edition_id === filterByEdition);
    }

    if (filterByCompany) {
      filtered = filtered.filter(user => user.company_id === filterByCompany);
    }

    if (filterByChannel) {
      filtered = filtered.filter(user => user.channel_id === filterByChannel);
    }

    // Search functionality
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.first_name.toLowerCase().includes(searchLower) ||
        user.last_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.phone && user.phone.toLowerCase().includes(searchLower)) ||
        (user.edition_name && user.edition_name.toLowerCase().includes(searchLower)) ||
        user.user_companies.some(uc => 
          uc.company_name.toLowerCase().includes(searchLower) ||
          (uc.channel_name && uc.channel_name.toLowerCase().includes(searchLower)) ||
          uc.role.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply UI filters
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    if (editionFilter !== 'all') {
      filtered = filtered.filter(user => user.edition_id === editionFilter);
    }

    if (companyFilter !== 'all') {
      filtered = filtered.filter(user => 
        user.user_companies.some(uc => uc.company_id === companyFilter)
      );
    }

    if (channelFilter !== 'all') {
      filtered = filtered.filter(user => 
        user.user_companies.some(uc => uc.channel_id === channelFilter)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Complete form reset for "New User" functionality
  const resetFormForNewUser = () => {
    console.log('🔄 Resetting form for new user...');
    
    // Clear form data
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      status: 'active'
    });
    
    // Clear role assignments
    setRoleAssignments([]);
    
    // Clear super admin state
    setIsSuperAdmin(false);
    
    // Clear relationship form
    setRelationshipFormData({
      edition_id: 'not-selected',
      channel_id: 'none',
      company_id: 'not-selected',
      role: 'user'
    });
    
    // Clear editing states
    setEditingUser(null);
    setEditingRelationshipId(null);
    setEditionCompanies([]);
    
    console.log('✅ Form completely reset for new user');
  };

  // Generate unique ID for role assignments
  const generateId = () => `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Super Admin checkbox handler with two-way synchronization
  const handleSuperAdminToggle = (checked: boolean) => {
    setIsSuperAdmin(checked);
    
    if (checked) {
      // Add Super Admin role if not already present
      const existingSuper = roleAssignments.find(r => r.role === 'super-admin');
      if (!existingSuper) {
        const superAdminRole: RoleAssignment = {
          id: generateId(),
          edition_id: 'global',
          edition_name: 'Global',
          channel_id: 'none',
          channel_name: '',
          company_id: 'none',
          company_name: '',
          role: 'super-admin',
          status: 'active'
        };
        setRoleAssignments(prev => [...prev, superAdminRole]);
        console.log('➕ Added super admin role');
      }
    } else {
      // Remove Super Admin role
      setRoleAssignments(prev => prev.filter(r => r.role !== 'super-admin'));
      console.log('➖ Removed super admin role');
    }
  };

  // Role assignment management
  const addToRoleAssignments = (relationship: Omit<RoleAssignment, 'id'>) => {
    const newAssignment: RoleAssignment = {
      ...relationship,
      id: generateId()
    };
    
    setRoleAssignments(prev => [...prev, newAssignment]);
    console.log('➕ Added role assignment:', newAssignment);
  };

  const removeFromRoleAssignments = (id: string) => {
    const removedRole = roleAssignments.find(r => r.id === id);
    
    // If removing Super Admin role, uncheck the checkbox
    if (removedRole && removedRole.role === 'super-admin') {
      setIsSuperAdmin(false);
      console.log('🔄 Unchecked super admin checkbox');
    }
    
    setRoleAssignments(prev => prev.filter(r => r.id !== id));
    console.log('➖ Removed role assignment:', id);
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Build hierarchy display with generic terms
  const buildHierarchyDisplay = (relationship: RoleAssignment) => {
    if (relationship.role === 'super-admin') {
      return 'Global → All Systems';
    } else if (relationship.role === 'edition-admin') {
      return 'Edition → All Channels and Companies';
    } else if (relationship.role === 'channel-admin') {
      return 'Edition → Channel → All Companies';
    } else if (relationship.role === 'company-admin') {
      if (relationship.channel_name && relationship.channel_id !== 'none') {
        return 'Edition → Channel → Company → All Users';
      } else {
        return 'Edition → Company → All Users';
      }
    } else if (relationship.role === 'user') {
      if (relationship.channel_name && relationship.channel_id !== 'none') {
        return 'Edition → Channel → Company → Your Profile';
      } else {
        return 'Edition → Company → Your Profile';
      }
    }
    return '';
  };

  // Display role assignment row exactly as specified
  const displayRoleRow = (relationship: RoleAssignment) => {
    const isSuper = relationship.role === 'super-admin';
    const hierarchy = buildHierarchyDisplay(relationship);
    
    // Determine display text for main line
    const displayText = isSuper 
      ? 'Global Access' 
      : relationship.company_name && relationship.company_id !== 'none'
        ? relationship.company_name
        : relationship.channel_name && relationship.channel_id !== 'none'
          ? relationship.channel_name
          : relationship.edition_name || 'Global Access';
    
    return (
      <div key={relationship.id} className="role-row" data-id={relationship.id}>
        <span className={`role-badge ${relationship.role}`}>
          {formatRole(relationship.role)}
        </span>
        <div className="role-details">
          <span className="edition">{displayText}</span>
          <span className="hierarchy">{hierarchy}</span>
        </div>
        {!isSuper && (
          <button onClick={() => openEditRelationship(relationship.id)}>Edit</button>
        )}
        <button onClick={() => removeFromRoleAssignments(relationship.id)}>Remove</button>
      </div>
    );
  };

  // Modal 2: Company Relationship functions
  const openAddRelationship = () => {
    console.log('🆕 [MODAL] Opening Add Company Relationship modal...');
    setEditingRelationshipId(null);
    setRelationshipFormData({
      edition_id: 'not-selected',
      channel_id: 'none',
      company_id: 'not-selected',
      role: 'user'
    });
    
    // Open modal first, then fetch editions
    setShowRelationshipModal(true);
    
    // Fetch fresh editions data
    console.log('📡 [MODAL] Fetching editions for modal...');
    fetchEditions().then(() => {
      console.log('✅ [MODAL] Editions fetch completed');
    }).catch((error) => {
      console.error('❌ [MODAL] Error fetching editions:', error);
    });
  };

  const openEditRelationship = (id: string) => {
    const assignment = roleAssignments.find(r => r.id === id);
    if (assignment) {
      setEditingRelationshipId(id);
      setRelationshipFormData({
        edition_id: assignment.edition_id,
        channel_id: assignment.channel_id,
        company_id: assignment.company_id,
        role: assignment.role as 'edition-admin' | 'channel-admin' | 'company-admin' | 'user'
      });
      
      // Load companies for the edition
      if (assignment.edition_id && assignment.edition_id !== 'global') {
        fetchCompaniesForEdition(assignment.edition_id);
      }
      
      setShowRelationshipModal(true);
    }
  };

  const closeRelationshipModal = () => {
    setShowRelationshipModal(false);
    setEditingRelationshipId(null);
    setRelationshipFormData({
      edition_id: 'not-selected',
      channel_id: 'none',
      company_id: 'not-selected',
      role: 'user'
    });
    setEditionCompanies([]);
  };

  // Cascading dropdown logic - exactly as specified
  const fetchCompaniesForEdition = async (editionId: string) => {
    if (!editionId || editionId === 'not-selected') {
      setEditionCompanies([]);
      return;
    }
    
    try {
      console.log('🔍 Fetching companies for edition:', editionId);
      const response = await fetch(`${BACKEND_URL}/companies/edition/${editionId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      console.log('📡 Companies for edition response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📄 Companies for edition response data:', data);
        console.log('🔍 [API DEBUG] First company full structure:', JSON.stringify(data.data[0], null, 2));
        if (data.success && data.data) {
          const mappedCompanies = data.data.map(company => {
            // Read isChannelPartner from the correct location
            const isChannelPartner = company.type?.isChannelPartner || company.isChannelPartner || company.is_channel_partner || false;
            
            console.log(`🏭 [COMPANY MAPPING] ${company.name}:`, {
              id: company.id,
              rawType: company.type,
              isChannelPartner: isChannelPartner,
              parentCompanyId: company.parentCompanyId,
              parent_company_id: company.parent_company_id,
              channelId: company.channelId,
              channel_id: company.channel_id,
              allFields: Object.keys(company),
              fullCompany: company
            });
            
            // Try multiple possible field names for parent company relationship
            const parentCompanyId = company.parentCompanyId || 
                                  company.parent_company_id || 
                                  company.parent_id ||
                                  company.parentId ||
                                  company.channel_parent_id ||
                                  company.channelParentId ||
                                  null;
            
            return {
              id: company.id,
              name: company.name,
              edition_id: company.editionId || company.edition_id,
              edition_name: company.edition?.name || company.edition_name,
              is_channel_partner: isChannelPartner,
              parent_company_id: parentCompanyId,
              channel_id: company.channelId || company.channel_id
            };
          });
          
          setEditionCompanies(mappedCompanies);
          console.log('✅ Successfully loaded', mappedCompanies.length, 'companies for edition');
          
          // Log channels and companies for debugging
          const channelsInEdition = mappedCompanies.filter(c => c.is_channel_partner === true);
          const regularCompanies = mappedCompanies.filter(c => c.is_channel_partner === false);
          console.log('🏢 Channels found:', channelsInEdition.length, channelsInEdition);
          console.log('🏬 Regular companies found:', regularCompanies.length, regularCompanies);
        } else {
          console.log('⚠️ Companies response missing success or data:', data);
          setEditionCompanies([]);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        setEditionCompanies([]);
      }
    } catch (err) {
      console.error('❌ Error fetching companies for edition:', err);
      setEditionCompanies([]);
    }
  };

  const handleEditionChange = (editionId: string) => {
    console.log('🔄 [EDITION CHANGE] Edition changed to:', editionId);
    
    // Find the edition name for logging
    const selectedEdition = editions.find(e => e.id === editionId);
    if (selectedEdition) {
      console.log('✅ [EDITION CHANGE] Selected edition:', selectedEdition.name, '(ID:', editionId, ')');
    }
    
    setRelationshipFormData(prev => ({
      ...prev,
      edition_id: editionId,
      channel_id: 'none',
      company_id: 'not-selected',
      role: 'user'
    }));

    if (editionId !== 'not-selected') {
      console.log('📡 [COMPANIES API] Fetching companies for edition:', editionId);
      fetchCompaniesForEdition(editionId);
    } else {
      console.log('🔄 [COMPANIES] Clearing edition companies (no edition selected)');
      setEditionCompanies([]);
    }
  };

  const handleChannelChange = (channelId: string) => {
    console.log('🔄 [CHANNEL CHANGE] Channel changed to:', channelId);
    
    // Find the channel name for logging
    if (channelId !== 'none') {
      const selectedChannel = getChannelsForEdition(relationshipFormData.edition_id).find(c => c.id === channelId);
      if (selectedChannel) {
        console.log('✅ [CHANNEL CHANGE] Selected channel:', selectedChannel.name, '(ID:', channelId, ')');
      }
    } else {
      console.log('✅ [CHANNEL CHANGE] No channel selected (edition-only companies)');
    }
    
    setRelationshipFormData(prev => ({
      ...prev,
      channel_id: channelId,
      company_id: 'not-selected',
      role: 'user'
    }));
    
    // Log the companies that will be available
    setTimeout(() => {
      const availableCompanies = getCompaniesForChannel(channelId);
      console.log('🏢 [CHANNEL CHANGE] Companies now available:', availableCompanies.length);
    }, 100);
  };

  const handleCompanyChange = (companyId: string) => {
    console.log('🔄 [COMPANY CHANGE] Company changed to:', companyId);
    
    // Find the company name for logging
    if (companyId !== 'not-selected') {
      const selectedCompany = getCompaniesForChannel(relationshipFormData.channel_id).find(c => c.id === companyId);
      if (selectedCompany) {
        console.log('✅ [COMPANY CHANGE] Selected company:', selectedCompany.name, '(ID:', companyId, ')');
      }
    } else {
      console.log('✅ [COMPANY CHANGE] No company selected');
    }
    
    setRelationshipFormData(prev => ({
      ...prev,
      company_id: companyId,
      role: 'user'  // Reset to user, but roles will update to include Company Admin + User
    }));
    
    // Log the roles that will be available
    setTimeout(() => {
      console.log('🎭 [COMPANY CHANGE] Triggering role recalculation...');
    }, 100);
  };

  const handleRoleChange = (role: string) => {
    console.log('🔄 Role changed to:', role);
    setRelationshipFormData(prev => ({
      ...prev,
      role: role as 'edition-admin' | 'channel-admin' | 'company-admin' | 'user'
    }));
  };

  // Get available data for dropdowns - exactly as specified
  const getChannelsForEdition = (editionId: string): Channel[] => {
    const editionChannels = channels.filter(channel => channel.edition_id === editionId);
    console.log('🏢 [CHANNELS] Available channels for edition:', editionId, editionChannels.length);
    editionChannels.forEach((channel, index) => {
      console.log(`🏢 [CHANNEL ${index + 1}]`, channel.name, channel.id);
    });
    return editionChannels;
  };

  const getCompaniesForChannel = (channelId: string): Company[] => {
    console.log('🏢 [COMPANY FILTER] Getting companies for channel:', channelId);
    console.log('🏢 [COMPANY FILTER] Available edition companies:', editionCompanies.length);
    
    // Log all companies with their channel relationships
    editionCompanies.forEach((company, index) => {
      console.log(`🏢 [COMPANY ${index + 1}]`, {
        name: company.name,
        id: company.id,
        is_channel_partner: company.is_channel_partner,
        parent_company_id: company.parent_company_id,
        channel_id: company.channel_id
      });
    });

    let filteredCompanies: Company[];

    if (channelId === 'none') {
      // Show edition-only companies (NOT under any channel)
      filteredCompanies = editionCompanies.filter(company => {
        const isNotChannel = company.is_channel_partner === false;
        const hasNoParent = !company.parent_company_id || company.parent_company_id === null || company.parent_company_id === '';
        
        console.log(`🏢 [FILTER CHECK] ${company.name}:`, {
          isNotChannel,
          hasNoParent,
          parent_company_id: company.parent_company_id,
          included: isNotChannel && hasNoParent
        });
        
        return isNotChannel && hasNoParent;
      });
      
      console.log('🏢 [FILTER RESULT] Edition-only companies:', filteredCompanies.length);
    } else {
      // Show companies under the selected channel
      filteredCompanies = editionCompanies.filter(company => {
        const isNotChannel = company.is_channel_partner === false;
        const isUnderChannel = company.parent_company_id === channelId;
        
        console.log(`🏢 [FILTER CHECK] ${company.name}:`, {
          isNotChannel,
          isUnderChannel,
          parent_company_id: company.parent_company_id,
          channelId,
          included: isNotChannel && isUnderChannel
        });
        
        return isNotChannel && isUnderChannel;
      });
      
      console.log('🏢 [FILTER RESULT] Companies under channel:', filteredCompanies.length);
    }
    
    // Log final result
    filteredCompanies.forEach((company, index) => {
      console.log(`✅ [FINAL COMPANY ${index + 1}]`, company.name, company.id);
    });
    
    return filteredCompanies;
  };

  const getAvailableRoles = (): Array<{value: string, label: string}> => {
    const roles: Array<{value: string, label: string}> = [];
    
    console.log('🎭 [ROLES] Calculating available roles for:', {
      edition_id: relationshipFormData.edition_id,
      channel_id: relationshipFormData.channel_id,
      company_id: relationshipFormData.company_id
    });
    
    if (relationshipFormData.edition_id !== 'not-selected') {
      roles.push({ value: 'edition-admin', label: 'Edition Admin' });
      console.log('🎭 [ROLES] Added: Edition Admin');
    }
    
    if (relationshipFormData.channel_id && relationshipFormData.channel_id !== 'none') {
      roles.push({ value: 'channel-admin', label: 'Channel Admin' });
      console.log('🎭 [ROLES] Added: Channel Admin');
    }
    
    if (relationshipFormData.company_id && relationshipFormData.company_id !== 'not-selected') {
      roles.push({ value: 'company-admin', label: 'Company Admin' });
      roles.push({ value: 'user', label: 'User' });
      console.log('🎭 [ROLES] Added: Company Admin and User');
    }
    
    console.log('🎭 [ROLES] Final available roles:', roles.length, roles.map(r => r.label));
    return roles;
  };

  const addRelationship = () => {
    if (relationshipFormData.edition_id === 'not-selected' || !relationshipFormData.role) {
      toast.error('Please select an edition and role');
      return;
    }

    // Get display names
    const edition = editions.find(e => e.id === relationshipFormData.edition_id);
    const channel = relationshipFormData.channel_id !== 'none' 
      ? getChannelsForEdition(relationshipFormData.edition_id).find(c => c.id === relationshipFormData.channel_id)
      : null;
    const company = relationshipFormData.company_id !== 'not-selected'
      ? getCompaniesForChannel(relationshipFormData.channel_id).find(c => c.id === relationshipFormData.company_id)
      : null;

    const newAssignment: Omit<RoleAssignment, 'id'> = {
      edition_id: relationshipFormData.edition_id,
      edition_name: edition?.name || '',
      channel_id: relationshipFormData.channel_id,
      channel_name: channel?.name || '',
      company_id: relationshipFormData.company_id,
      company_name: company?.name || '',
      role: relationshipFormData.role,
      status: 'active'
    };

    if (editingRelationshipId) {
      // Edit existing assignment
      setRoleAssignments(prev => prev.map(r => 
        r.id === editingRelationshipId 
          ? { ...newAssignment, id: r.id }
          : r
      ));
      toast.success('Assignment updated successfully');
    } else {
      // Add new assignment
      addToRoleAssignments(newAssignment);
      toast.success('Assignment added successfully');
    }

    closeRelationshipModal();
  };

  // UPDATED USER CREATION WITH TWO-STEP PROCESS
  const handleCreateUser = async () => {
    try {
      console.log('💾 [USER CREATION] Starting two-step user creation process...');
      console.log('📊 [USER CREATION] Form data:', formData);
      console.log('📊 [USER CREATION] Role assignments:', roleAssignments);

      // Basic form validation with detailed logging
      console.log('🔍 [VALIDATION] Checking required fields...');
      console.log('🔍 [VALIDATION] firstName:', formData.firstName, 'length:', formData.firstName.length);
      console.log('🔍 [VALIDATION] lastName:', formData.lastName, 'length:', formData.lastName.length);
      console.log('🔍 [VALIDATION] email:', formData.email, 'length:', formData.email.length);
      console.log('🔍 [VALIDATION] password:', formData.password, 'length:', formData.password.length);
      
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        console.error('❌ [VALIDATION] Missing required fields!');
        console.error('❌ [VALIDATION] firstName valid:', !!formData.firstName);
        console.error('❌ [VALIDATION] lastName valid:', !!formData.lastName);
        console.error('❌ [VALIDATION] email valid:', !!formData.email);
        console.error('❌ [VALIDATION] password valid:', !!formData.password);
        toast.error('Please fill in all required fields: First Name, Last Name, Email, and Password');
        return;
      }
      
      console.log('✅ [VALIDATION] All required fields validated successfully');

      // Email validation  
      console.log('🔍 [EMAIL VALIDATION] Testing email format...');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        console.error('❌ [EMAIL VALIDATION] Invalid email format:', formData.email);
        toast.error('Please enter a valid email address');
        return;
      }
      console.log('✅ [EMAIL VALIDATION] Email format is valid');

      // Validate role assignments
      if (roleAssignments.length === 0) {
        toast.error('At least one role assignment is required');
        return;
      }

      console.log('✅ [USER CREATION] Validation passed, proceeding with two-step creation...');

      // STEP 1: Create the user
      console.log('🚀 [STEP 1] Creating user...');
      const userPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        password: formData.password,
        status: formData.status
      };
      
      console.log('📤 [STEP 1] User payload:', userPayload);
      
      const userResponse = await fetch(`${BACKEND_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(userPayload),
      });

      console.log('📡 [STEP 1] User creation response status:', userResponse.status);
      
      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error('❌ [STEP 1] User creation failed:', errorText);
        throw new Error(`Failed to create user: ${errorText}`);
      }

      const userResult = await userResponse.json();
      console.log('✅ [STEP 1] User created successfully:', userResult);
      
      if (!userResult.success || !userResult.data || !userResult.data.id) {
        throw new Error('Invalid user creation response');
      }

      const userId = userResult.data.id;
      console.log('🆔 [STEP 1] New user ID:', userId);

      // STEP 2: Create user-company relationships
      console.log('🚀 [STEP 2] Creating user-company relationships...');
      
      const relationshipPromises = roleAssignments.map(async (assignment, index) => {
        console.log(`📤 [STEP 2.${index + 1}] Processing relationship:`, assignment);
        
        // Build relationship payload
        let relationshipPayload: any = {
          userId: userId,
          editionId: assignment.edition_id === 'global' ? null : assignment.edition_id,
          role: assignment.role,
          status: 'active'
        };

        // Add companyId only if it's not a super-admin or edition-admin role and company is selected
        if (assignment.role !== 'super-admin' && assignment.role !== 'edition-admin') {
          if (assignment.company_id && assignment.company_id !== 'none' && assignment.company_id !== 'not-selected') {
            relationshipPayload.companyId = assignment.company_id;
          }
        }
        
        console.log(`📤 [STEP 2.${index + 1}] Relationship payload:`, relationshipPayload);
        
        const relationshipResponse = await fetch(`${BACKEND_URL}/user-companies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AUTH_TOKEN}`,
          },
          body: JSON.stringify(relationshipPayload),
        });

        console.log(`📡 [STEP 2.${index + 1}] Relationship response status:`, relationshipResponse.status);
        
        if (!relationshipResponse.ok) {
          const errorText = await relationshipResponse.text();
          console.error(`❌ [STEP 2.${index + 1}] Relationship creation failed:`, errorText);
          throw new Error(`Failed to create relationship ${index + 1}: ${errorText}`);
        }

        const relationshipResult = await relationshipResponse.json();
        console.log(`✅ [STEP 2.${index + 1}] Relationship created successfully:`, relationshipResult);
        return relationshipResult;
      });

      // Wait for all relationships to be created
      const relationshipResults = await Promise.all(relationshipPromises);
      console.log('✅ [STEP 2] All relationships created successfully:', relationshipResults);

      // Success!
      console.log('🎉 [USER CREATION] Complete two-step user creation successful!');
      toast.success('User created successfully with all relationships');
      
      // Reset form and close modal
      resetFormForNewUser();
      setShowAddUser(false);
      
      // Refresh users list
      await fetchUsers();

    } catch (error) {
      console.error('❌ Error creating user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
    }
  };

  const handleArchiveUser = async (userId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('User archived successfully');
        fetchUsers();
      } else {
        toast.error('Failed to archive user');
      }
    } catch (error) {
      console.error('Error archiving user:', error);
      toast.error('Error archiving user');
    }
  };

  const handleEmulateUser = (user: User) => {
    console.log('🎭 Emulating user:', user);
    toast.success(`Now emulating ${user.first_name} ${user.last_name}`);
  };

  const handleOpenAddUser = () => {
    console.log('🆕 Opening "New User" form...');
    resetFormForNewUser();
    setShowAddUser(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UsersIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600">
              Manage system users, roles, and permissions
            </p>
          </div>
        </div>
        <Button 
          onClick={handleOpenAddUser}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New User
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, phone, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                  <SelectItem value="edition-admin">Edition Admin</SelectItem>
                  <SelectItem value="company-admin">Company Admin</SelectItem>
                  <SelectItem value="channel-admin">Channel Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={editionFilter} onValueChange={setEditionFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Edition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Editions</SelectItem>
                  {editions.map((edition) => (
                    <SelectItem key={edition.id} value={edition.id}>
                      {edition.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-red-600">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <p className="font-medium">Error Loading Users</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('first_name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>Phone</span>
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Primary Role</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-1">
                        <Building className="w-4 h-4" />
                        <span>Companies</span>
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Created</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No users found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <TableRow 
                        key={user.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setShowUserDetails(user)}
                      >
                        <TableCell className="font-medium text-gray-500">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {user.first_name?.[0]}{user.last_name?.[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-900">{user.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-600">
                            {user.phone || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              user.role === 'super-admin' ? 'destructive' :
                              user.role === 'edition-admin' ? 'default' :
                              user.role === 'company-admin' ? 'secondary' :
                              'outline'
                            }
                            className="capitalize"
                          >
                            {user.role.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {user.user_companies.length === 0 ? (
                              <span className="text-gray-500 text-sm">No companies</span>
                            ) : (
                              user.user_companies.slice(0, 2).map((uc, idx) => (
                                <div key={idx} className="text-sm">
                                  <span className="font-medium">{uc.company_name}</span>
                                  {uc.channel_name && (
                                    <span className="text-gray-500"> via {uc.channel_name}</span>
                                  )}
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {uc.role.replace('-', ' ')}
                                  </Badge>
                                </div>
                              ))
                            )}
                            {user.user_companies.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{user.user_companies.length - 2} more
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              user.status === 'active' ? 'default' :
                              user.status === 'inactive' ? 'secondary' :
                              'destructive'
                            }
                            className="capitalize"
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEmulateUser(user)}
                              className="h-8 w-8 p-0 text-blue-600"
                            >
                              <ArrowLeftRight className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleArchiveUser(user.id)}
                              className="h-8 w-8 p-0 text-red-600"
                            >
                              <Archive className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal 1: Add New User - EXACTLY AS SPECIFIED */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent 
          className="modal-container add-user-modal"
          style={{ width: '800px', maxWidth: '800px', minWidth: '800px', maxHeight: '70vh', height: '600px' }}
          description="Create a new user account with personal information and role assignments"
        >
          <DialogHeader className="modal-header">
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>

          <div className="modal-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '20px' }}>
            {/* Personal Info Section (Fixed) */}
            <div className="personal-info-section" style={{ flexShrink: 0, marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
              <div className="input-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                <div className="field-group inline" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label htmlFor="firstName" style={{ display: 'inline-block', minWidth: '120px', marginBottom: 0, fontWeight: 600, color: '#333', fontSize: '14px' }}>First Name:</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    placeholder="Enter first name" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                    style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' }}
                  />
                </div>
                <div className="field-group inline" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label htmlFor="lastName" style={{ display: 'inline-block', minWidth: '120px', marginBottom: 0, fontWeight: 600, color: '#333', fontSize: '14px' }}>Last Name:</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    placeholder="Enter last name" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                    style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' }}
                  />
                </div>
              </div>
              
              <div className="field-group inline" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <label htmlFor="email" style={{ display: 'inline-block', minWidth: '120px', marginBottom: 0, fontWeight: 600, color: '#333', fontSize: '14px' }}>Email Address:</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter email address" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' }}
                />
              </div>
              
              <div className="input-row" style={{ display: 'flex', gap: '20px' }}>
                <div className="field-group inline" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label htmlFor="phone" style={{ display: 'inline-block', minWidth: '120px', marginBottom: 0, fontWeight: 600, color: '#333', fontSize: '14px' }}>Phone Number:</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' }}
                  />
                </div>
                <div className="field-group inline" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label htmlFor="password" style={{ display: 'inline-block', minWidth: '120px', marginBottom: 0, fontWeight: 600, color: '#333', fontSize: '14px' }}>Password:</label>
                  <input 
                    type="password" 
                    id="password" 
                    placeholder="Enter password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div className="checkbox-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: '#f8f9fa', borderRadius: '4px', marginTop: '15px' }}>
                <input 
                  type="checkbox" 
                  id="superAdminRole" 
                  checked={isSuperAdmin}
                  onChange={(e) => handleSuperAdminToggle(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <label htmlFor="superAdminRole" style={{ margin: 0, fontWeight: 500, color: '#495057' }}>Add Super Admin Role</label>
              </div>
            </div>
            
            {/* Role Assignments Section (Scrollable) */}
            <div className="role-assignments-section" style={{ flex: 1, minHeight: 0 }}>
              <div className="role-assignments-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
                <h3 style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: 600 }}>Role Assignments</h3>
                <button 
                  className="add-relationship-btn" 
                  onClick={openAddRelationship}
                  style={{ padding: '8px 16px', background: '#007cba', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                >
                  + Add Company Relationship
                </button>
              </div>
              <div 
                className="role-assignments-list" 
                id="roleAssignmentsList"
                style={{ 
                  maxHeight: '200px', 
                  overflowY: 'auto', 
                  border: '1px solid #dee2e6', 
                  borderRadius: '6px', 
                  padding: '15px', 
                  marginBottom: '15px', 
                  minHeight: '120px', 
                  background: '#ffffff' 
                }}
              >
                {roleAssignments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#6c757d' }}>
                    <UsersIcon style={{ width: '48px', height: '48px', margin: '0 auto 8px', color: '#dee2e6' }} />
                    <p>No role assignments yet</p>
                    <p style={{ fontSize: '12px' }}>Click "Add Company Relationship" to get started</p>
                  </div>
                ) : (
                  roleAssignments.map(displayRoleRow)
                )}
              </div>
            </div>
          </div>
          
          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '20px', borderTop: '1px solid #eee' }}>
            <button 
              onClick={() => {
                setShowAddUser(false);
                resetFormForNewUser();
              }}
              style={{ padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ [CREATE USER] Button clicked - starting user creation...');
                handleCreateUser();
              }}
              className="primary-btn"
              style={{ padding: '8px 16px', background: '#007cba', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
            >
              Create User
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Add Company Relationship - CLEAN VERSION */}
      <Dialog open={showRelationshipModal} onOpenChange={closeRelationshipModal}>
        <DialogContent 
          className="modal-container add-relationship-modal secondary-modal"
          style={{ width: '500px', maxHeight: '60vh', zIndex: 1001 }}
          description="Configure role assignment with edition, channel, company, and role selections"
        >
          <DialogHeader className="modal-header">
            <DialogTitle>
              {editingRelationshipId ? 'Edit Company Relationship' : 'Add Company Relationship'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="modal-body" style={{ padding: '20px' }}>
            <div className="dropdown-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Edition:</label>
              <Select 
                value={relationshipFormData.edition_id} 
                onValueChange={(value) => {
                  console.log('🔄 [EDITION SELECT] Value changed to:', value);
                  handleEditionChange(value);
                }}
                onOpenChange={(open) => {
                  console.log('🔽 [EDITION SELECT] Dropdown state changed to:', open);
                  console.log('📊 [EDITION SELECT] Available editions:', editions.length);
                  console.log('📊 [EDITION SELECT] Editions list:', editions);
                  console.log('📊 [EDITION SELECT] Current value:', relationshipFormData.edition_id);
                  
                  if (open && editions.length === 0) {
                    console.warn('⚠️ [EDITION SELECT] Dropdown opened but no editions available!');
                    console.log('🔄 [EDITION SELECT] Attempting to refetch editions...');
                    fetchEditions();
                  }
                }}
                disabled={editions.length === 0}
              >
                <SelectTrigger 
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    backgroundColor: editions.length === 0 ? '#f5f5f5' : '#ffffff',
                    cursor: editions.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <SelectValue placeholder={editions.length === 0 ? "Loading editions..." : "Select Edition"} />
                </SelectTrigger>
                <SelectContent 
                  style={{ zIndex: 9999 }}
                  onCloseAutoFocus={(e) => {
                    console.log('🔽 [EDITION SELECT] Content closed');
                  }}
                  onEscapeKeyDown={(e) => {
                    console.log('🔽 [EDITION SELECT] Escaped');
                  }}
                >
                  <SelectItem value="not-selected">Select Edition</SelectItem>
                  {editions.length === 0 ? (
                    <SelectItem value="no-editions" disabled>
                      {showRelationshipModal ? "Loading editions..." : "No editions available"}
                    </SelectItem>
                  ) : (
                    editions.map((edition, index) => {
                      console.log(`🏗️ [EDITION RENDER] ${index + 1}/${editions.length}:`, edition.id, edition.name);
                      return (
                        <SelectItem 
                          key={edition.id} 
                          value={edition.id}
                          onSelect={() => {
                            console.log('✅ [EDITION SELECT] User selected:', edition.id, edition.name);
                          }}
                        >
                          {edition.name}
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {relationshipFormData.edition_id !== 'not-selected' && getChannelsForEdition(relationshipFormData.edition_id).length > 0 && (
              <div className="dropdown-group" id="channelGroup" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Channel:</label>
                <Select 
                  value={relationshipFormData.channel_id} 
                  onValueChange={handleChannelChange}
                >
                  <SelectTrigger style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <SelectValue placeholder="Select Channel" />
                  </SelectTrigger>
                  <SelectContent style={{ zIndex: 9999 }}>
                    <SelectItem value="none">None</SelectItem>
                    {getChannelsForEdition(relationshipFormData.edition_id).map((channel) => (
                      <SelectItem key={channel.id} value={channel.id}>
                        {channel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {relationshipFormData.edition_id !== 'not-selected' && (
              <div className="dropdown-group" id="companyGroup" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Company:</label>
                <Select 
                  value={relationshipFormData.company_id} 
                  onValueChange={handleCompanyChange}
                >
                  <SelectTrigger style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent style={{ zIndex: 9999 }}>
                    <SelectItem value="not-selected">Select Company</SelectItem>
                    {getCompaniesForChannel(relationshipFormData.channel_id).length === 0 ? (
                      <SelectItem value="no-companies" disabled>No companies available</SelectItem>
                    ) : (
                      getCompaniesForChannel(relationshipFormData.channel_id).map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="dropdown-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Role:</label>
              <Select 
                value={relationshipFormData.role} 
                onValueChange={handleRoleChange}
              >
                <SelectTrigger style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent style={{ zIndex: 9999 }}>
                  {getAvailableRoles().length === 0 ? (
                    <SelectItem value="no-roles" disabled>No roles available - select edition/company first</SelectItem>
                  ) : (
                    getAvailableRoles().map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '20px', borderTop: '1px solid #eee' }}>
            <button 
              onClick={closeRelationshipModal}
              style={{ padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              onClick={addRelationship} 
              className="primary-btn"
              style={{ padding: '8px 16px', background: '#007cba', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
            >
              {editingRelationshipId ? 'Update Relationship' : 'Add Relationship'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Details Modal */}
      {showUserDetails && (
        <Dialog open={!!showUserDetails} onOpenChange={() => setShowUserDetails(null)}>
          <DialogContent 
            className="max-w-2xl"
            description="Detailed view of user information, role assignments, and company relationships"
          >
            <DialogHeader>
              <DialogTitle>
                User Details: {showUserDetails.first_name} {showUserDetails.last_name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-sm font-medium">{showUserDetails.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <p className="text-sm font-medium">{showUserDetails.phone || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Primary Role</Label>
                  <Badge variant="outline" className="capitalize">
                    {showUserDetails.role.replace('-', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge 
                    variant={showUserDetails.status === 'active' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {showUserDetails.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <p className="text-sm font-medium">
                    {new Date(showUserDetails.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                  <p className="text-sm font-medium">
                    {new Date(showUserDetails.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Company Relationships */}
              <div>
                <Label className="text-sm font-medium text-gray-500 mb-3 block">
                  Company Relationships ({showUserDetails.user_companies.length})
                </Label>
                {showUserDetails.user_companies.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No company relationships</p>
                ) : (
                  <div className="space-y-2">
                    {showUserDetails.user_companies.map((uc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{uc.company_name}</p>
                          {uc.channel_name && (
                            <p className="text-sm text-gray-500">via {uc.channel_name}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {uc.role.replace('-', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleEmulateUser(showUserDetails)}
                  className="text-blue-600"
                >
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                  Emulate User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <style jsx>{`
        .role-badge {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          min-width: 90px;
          text-align: center;
        }

        .role-badge.super-admin {
          background: #dc3545;
        }

        .role-badge.edition-admin {
          background: #ffc107;
          color: #000;
        }

        .role-badge.company-admin {
          background: #28a745;
        }

        .role-badge.user {
          background: #007bff;
        }

        .role-badge.channel-admin {
          background: #6f42c1;
        }

        .role-row {
          display: flex;
          align-items: center;
          padding: 12px;
          gap: 15px;
          background: #f8f9fa;
          margin-bottom: 8px;
          border-radius: 6px;
          border: 1px solid #dee2e6;
        }

        .role-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .edition {
          font-weight: 500;
          color: #495057;
        }

        .hierarchy {
          font-size: 11px;
          color: #6c757d;
          font-style: italic;
        }

        .role-row button {
          padding: 6px 12px;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          background: white;
          color: #495057;
        }

        .role-row button:hover {
          background: #e9ecef;
        }
      `}</style>
    </div>
  );
}
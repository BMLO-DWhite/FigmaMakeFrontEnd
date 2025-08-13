# Figma Import Transformation Report with Generated Code

## Summary

- **Total Components**: 3
- **Transformed Files**: 6
- **Features Identified**: 2

## Edition-management Feature

### App.tsx → src/components/admin/super-admin/AppComponent.tsx

**Role Level:** super-admin

**Automated Transformations:**
- Move file from App.tsx to src/components/admin/super-admin/AppComponent.tsx
- Add role-based permission checking
- Add scope validation for user data access
- Update all import statements to new file locations
- Add proper TypeScript interfaces for props and state
- Implement consistent error handling patterns
- Generate component-specific CSS module following CSS Organization Guide
- Add CSS module imports and className usage
- Include theme-aware styling and responsive design patterns

**Required Manual Changes:**
- Implement super-admin permission validation
- Add global scope data filtering
- Test component with different user roles
- Verify component follows 500-line file size limit
- Ensure component uses shared UI patterns where applicable

**Generated Transformed Code:**
```typescript

import React from 'react';
import React from 'react';
import styles from './appcomponent.module.css';
import { useAuth } from '../../../context/AuthContext';
import { hasPermission } from '../../../utils/permissions';



export default function AppComponent(props: AppProps) {

  // Role-based permission checking
  const { user } = useAuth();
  const hasRequiredPermission = hasPermission(user, 'super-admin', 'global');
  
  if (!hasRequiredPermission) {
    return <div className="text-red-600">Access denied. Required role: super-admin</div>;
  }



  // Original component logic with enhancements
  // Component state
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Component effects
  
  // Event handlers
  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
  const handleLogout = () => {
    setUser(null);
  const handleUserUpdate = (updatedUserData: any) => {
    console.log('🔄 App.tsx received user update:', updatedUserData);
  
  return (
    <div className={styles.container}>
      
      
      {/* Original component JSX with improvements */}
      {hasPermission(user, 'super-admin', 'global') && (
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
      )}
    </div>
  );
}

```

---

## User-management Feature

### components/UsersManagement.tsx → src/components/admin/super-admin/UsersmanagementManagement.tsx

**Role Level:** super-admin

**Automated Transformations:**
- Move file from components/UsersManagement.tsx to src/components/admin/super-admin/UsersmanagementManagement.tsx
- Add role-based permission checking
- Add scope validation for user data access
- Add blue ⇄ emulation button with proper styling
- Split component into smaller, reusable components
- Update all import statements to new file locations
- Add proper TypeScript interfaces for props and state
- Implement consistent error handling patterns
- Generate component-specific CSS module following CSS Organization Guide
- Add CSS module imports and className usage
- Include theme-aware styling and responsive design patterns

**Required Manual Changes:**
- Implement super-admin permission validation
- Add global scope data filtering
- Integrate with standardized API endpoints
- Add proper loading and error states
- Implement user emulation context management
- Add emulation audit trail logging
- Test component with different user roles
- Verify component follows 500-line file size limit
- Ensure component uses shared UI patterns where applicable

**Generated Transformed Code:**
```typescript

import React from 'react';
import React from 'react';
import styles from './components/usersmanagementmanagement.module.css';
import { useAuth } from '../../../context/AuthContext';
import { hasPermission } from '../../../utils/permissions';
import { useEmulation } from '../../../context/EmulationContext';
import { EmulationButton } from '../../shared/ui/EmulationButton';


interface UsersManagementProps {
  userRole: string;
  scope: string;
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onEmulate?: (user: any) => void;
}


export default function Components/usersmanagementManagement(props: UsersManagementProps) {

  // Role-based permission checking
  const { user } = useAuth();
  const hasRequiredPermission = hasPermission(user, 'super-admin', 'global');
  
  if (!hasRequiredPermission) {
    return <div className="text-red-600">Access denied. Required role: super-admin</div>;
  }


  // User emulation context
  const { isEmulating, emulatedUser, exitEmulation } = useEmulation();


  // Original component logic with enhancements
  // Component state
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editionFilter, setEditionFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [availableChannelsForFilter, setAvailableChannelsForFilter] = useState<Channel[]>([]);
  const [availableCompaniesForFilter, setAvailableCompaniesForFilter] = useState<Company[]>([]);
  const [sortField, setSortField] = useState<keyof User>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState<User | null>(null);
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [editingRelationshipId, setEditingRelationshipId] = useState<string | null>(null);
  const [editionCompanies, setEditionCompanies] = useState<Company[]>([]);
  
  // Component effects
  
  // Event handlers
  const handleEditionFilterChange = (value: string) => {
    setEditionFilter(value);
  const handleChannelFilterChange = (value: string) => {
    setChannelFilter(value);
  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  const handleSuperAdminToggle = (checked: boolean) => {
    setIsSuperAdmin(checked);
  const handleEditionChange = (editionId: string) => {
    console.log('🔄 [EDITION CHANGE] Edition changed to:', editionId);
  const handleChannelChange = (channelId: string) => {
    console.log('🔄 [CHANNEL CHANGE] Channel changed to:', channelId);
  const handleCompanyChange = (companyId: string) => {
    console.log('🔄 [COMPANY CHANGE] Company changed to:', companyId);
  const handleRoleChange = (role: string) => {
    console.log('🔄 Role changed to:', role);
  const handleCreateUser = async () => {
    try {
      console.log('💾 [USER CREATION] Starting two-step user creation process...');
  const handleArchiveUser = async (userId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
  const handleUserClick = async (user: User) => {
    try {
      console.log('👤 [USER CLICK] Fetching details for user:', user.email);
  const handleEmulateUser = (user: User) => {
    console.log('🎭 Emulating user:', user);
  const handleOpenAddUser = () => {
    console.log('🆕 Opening "New User" form...');
  
  return (
    <div className={styles.container}>
      
      {isEmulating && (
        <div className={styles.emulationBanner}>
          <span>Emulating: {emulatedUser?.name} ({emulatedUser?.role})</span>
          <button onClick={exitEmulation} className={styles.exitEmulation}>
            Exit Emulation
          </button>
        </div>
      )}
      
      
      {/* Original component JSX with improvements */}
      {hasPermission(user, 'super-admin', 'global') && (
        
      <div key={relationship.id} className="role-row" data-id={relationship.id}>
        <span className={`role-badge ${relationship.role}`}>
          {formatRole(relationship.role)}
        </span>
        <div className="role-details">
          <span className="edition">{displayText}</span>
          <span className="hierarchy">{hierarchy}</span>
        </div>
        {!isSuper && (
          <EmulationButton onEmulate={props.onEmulate} />
      <button onClick={() => openEditRelationship(relationship.id)}>Edit</button>
        )}
        <EmulationButton onEmulate={props.onEmulate} />
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
      console.log('�� [VALIDATION] Checking required fields...');
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
      
      if (!userResult.success || !userResult.data || !userResult.data.user || !userResult.data.user.id) {
        throw new Error('Invalid user creation response');
      }

      const userId = userResult.data.user.id;
      console.log('🆔 [STEP 1] New user ID:', userId);

      // STEP 2: Create user-company relationships
      console.log('🚀 [STEP 2] Creating user-company relationships...');
      
      const relationshipPromises = roleAssignments.map(async (assignment, index) => {
        console.log(`📤 [STEP 2.${index + 1}] Processing relationship:`, assignment);
        
        // Build relationship payload
        let relationshipPayload: any = {
          userId: userId,
          role: assignment.role,
          status: 'active'
        };

        // Handle editionId based on role type
        if (assignment.role === 'super-admin') {
          // Super admin roles don't need editionId - omit it entirely
          console.log(`📤 [STEP 2.${index + 1}] Super admin role - omitting editionId`);
        } else {
          // All other roles need editionId
          relationshipPayload.editionId = assignment.edition_id;
          console.log(`📤 [STEP 2.${index + 1}] Setting editionId: ${assignment.edition_id}`);
        }

        // Handle companyId based on role type and selection
        if (assignment.role === 'super-admin' || assignment.role === 'edition-admin') {
          // Super admin and edition admin don't need companyId
          console.log(`📤 [STEP 2.${index + 1}] ${assignment.role} role - omitting companyId`);
        } else if (assignment.role === 'channel-admin') {
          // Channel admin roles typically don't need companyId, but check constraint requirements
          if (assignment.company_id && assignment.company_id !== 'none' && assignment.company_id !== 'not-selected') {
            relationshipPayload.companyId = assignment.company_id;
            console.log(`📤 [STEP 2.${index + 1}] Channel admin with company: ${assignment.company_id}`);
          } else {
            console.log(`📤 [STEP 2.${index + 1}] Channel admin without specific company`);
          }
        } else {
          // Company admin and user roles need companyId
          if (assignment.company_id && assignment.company_id !== 'none' && assignment.company_id !== 'not-selected') {
            relationshipPayload.companyId = assignment.company_id;
            console.log(`📤 [STEP 2.${index + 1}] ${assignment.role} with company: ${assignment.company_id}`);
          } else {
            console.error(`❌ [STEP 2.${index + 1}] ${assignment.role} role requires companyId but none selected`);
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

  // Fetch individual user details with complete company relationships
  const fetchUserDetails = async (userId: string) => {
    try {
      console.log('🔍 Fetching user details for ID:', userId);
      const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const userData = await response.json();
      console.log('📄 [USER DETAILS] Raw API response:', userData);
      
      if (userData.success && userData.data) {
        const user = userData.data;
        console.log('📋 [USER DETAILS] Company assignments:', user.companyAssignments?.length || 0);
        
        // Map the backend response to the frontend User interface
        const mappedUser: User = {
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
          // Map companyAssignments to user_companies format
          user_companies: user.companyAssignments?.map(assignment => ({
            company_id: assignment.companyId || 'none',
            company_name: assignment.company?.name || (assignment.role === 'super-admin' ? 'Global Access' : assignment.edition?.name || 'Unknown'),
            role: assignment.role,
            channel_id: assignment.company?.channelId || 'none',
            channel_name: assignment.company?.channel?.name
          })) || [],
          company_id: user.companyAssignments?.[0]?.companyId,
          company_name: user.companyAssignments?.[0]?.company?.name,
          channel_id: user.companyAssignments?.[0]?.company?.channelId,
          channel_name: user.companyAssignments?.[0]?.company?.channel?.name
        };

        console.log('✅ [USER DETAILS] Mapped user with', mappedUser.user_companies.length, 'company relationships');
        return mappedUser;
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.error('❌ Error fetching user details:', err);
      throw err;
    }
  };

  // Handle user row click with detailed data fetching
  const handleUserClick = async (user: User) => {
    try {
      console.log('👤 [USER CLICK] Fetching details for user:', user.email);
      const detailedUser = await fetchUserDetails(user.id);
      setShowUserDetails(detailedUser);
    } catch (err) {
      console.error('❌ [USER CLICK] Error fetching user details:', err);
      toast.error('Failed to load user details');
      // Fallback to using the cached user data
      setShowUserDetails(user);
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

      {/* Search and Filter Controls - Two Row Layout with Hierarchical Filtering */}
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          {/* Row 1: Hierarchical Filters */}
          <div className="flex items-center gap-3 mb-4">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger 
                className="w-36 h-9 border border-gray-300 bg-white"
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff'
                }}
              >
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super-admin">Super Admin</SelectItem>
                <SelectItem value="edition-admin">Edition Admin</SelectItem>
                <SelectItem value="channel-admin">Channel Admin</SelectItem>
                <SelectItem value="company-admin">Company Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger 
                className="w-32 h-9 border border-gray-300 bg-white"
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff'
                }}
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            {/* Hierarchical Edition Filter */}
            <Select value={editionFilter} onValueChange={handleEditionFilterChange}>
              <SelectTrigger 
                className="w-36 h-9 border border-gray-300 bg-white"
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff'
                }}
              >
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

            {/* Hierarchical Channel Filter - Shows only channels for selected edition */}
            <Select value={channelFilter} onValueChange={handleChannelFilterChange}>
              <SelectTrigger 
                className="w-36 h-9 border border-gray-300 bg-white"
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff'
                }}
              >
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {editionFilter === 'all' ? 'All Channels' : 'No Channel Filter'}
                </SelectItem>
                {availableChannelsForFilter.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    {channel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Hierarchical Company Filter - Shows only companies for selected edition/channel */}
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger 
                className="w-36 h-9 border border-gray-300 bg-white"
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff'
                }}
              >
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {availableCompaniesForFilter.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 2: Search and Results Summary */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, phone, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border border-gray-300 bg-white h-9"
                  style={{
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>
            
            {/* Results Summary and Pagination */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                Showing {totalResults === 0 ? 0 : startIndex + 1}-{endIndex} of {totalResults} users
              </span>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="h-8 px-3"
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-gray-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="h-8 px-3"
                  >
                    Next
                  </Button>
                </div>
              )}
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
                  {currentPageUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        {totalResults === 0 ? 'No users found matching your criteria' : 'No users to display'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPageUsers.map((user, index) => (
                      <TableRow 
                        key={user.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleUserClick(user)}
                      >
                        <TableCell className="font-medium text-gray-500">
                          {startIndex + index + 1}
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
              <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
                Default password: 123456 (can be overridden by typing a different password)
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
                <EmulationButton onEmulate={props.onEmulate} />
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
            <EmulationButton onEmulate={props.onEmulate} />
      <button 
              onClick={() => {
                setShowAddUser(false);
                resetFormForNewUser();
              }}
              style={{ padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <EmulationButton onEmulate={props.onEmulate} />
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
            <EmulationButton onEmulate={props.onEmulate} />
      <button 
              onClick={closeRelationshipModal}
              style={{ padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <EmulationButton onEmulate={props.onEmulate} />
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

      {/* View User Modal - EXACTLY MODELED AFTER ADD NEW USER */}
      {showUserDetails && (
        <Dialog open={!!showUserDetails} onOpenChange={() => setShowUserDetails(null)}>
          <DialogContent 
            className="modal-container view-user-modal"
            style={{ width: '800px', maxWidth: '800px', minWidth: '800px', maxHeight: '70vh', height: '600px' }}
            description="View user account information and role assignments"
          >
            <DialogHeader className="modal-header">
              <DialogTitle>View User: {showUserDetails.first_name} {showUserDetails.last_name}</DialogTitle>
            </DialogHeader>

            <div className="modal-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '20px' }}>
              {/* Personal Info Section (Read-only) */}
              <div className="personal-info-section" style={{ flexShrink: 0, marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                <div className="input-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                  <div className="field-group inline" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ display: 'inline-block', minWidth: '120px', marginBottom: 0, fontWeight: 600, color: '#333', fontSize: '14px' }}>First Name:</label>
                    <input 
                      type="text" 
                      value={showUserDetails.first_name}
                      readOnly
                      style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px', backgroundColor: '#f8f9fa', color: '#495057' }}
                    />
                  </div>
                  <div className="field-group inline" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ display: 'inline-block', minWidth: '120px', marginBottom: 0, fontWeight: 600, color: '#333', fontSize: '14px' }}>Last Name:</label>
                    <input 
                      type="text" 
                      value={showUserDetails.last_name}
                      readOnly
                      style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px', backgroundColor: '#f8f9fa', color: '#495057' }}
                    />
                  </div>
                </div>
                
                <div className="field-group inline" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <label style={{ display: 'inline-block', minWidth: '120px', marginBottom: 0, fontWeight: 600, color: '#333', fontSize: '14px' }}>Email Address:</label>
                  <input 
                    type="email" 
                    value={showUserDetails.email}
                    readOnly
                    style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px', backgroundColor: '#f8f9fa', color: '#495057' }}
                  />
                </div>
                
                <div className="input-row" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                  <div className="field-group inline" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ display: 'inline-block', minWidth: '120px', marginBottom: 0, fontWeight: 600, color: '#333', fontSize: '14px' }}>Phone Number:</label>
                    <input 
                      type="tel" 
                      value={showUserDetails.phone || ''}
                      readOnly
                      style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px', backgroundColor: '#f8f9fa', color: '#495057' }}
                    />
                  </div>
                  <div className="field-group inline" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ display: 'inline-block', minWidth: '120px', marginBottom: 0, fontWeight: 600, color: '#333', fontSize: '14px' }}>Status:</label>
                    <input 
                      type="text" 
                      value={showUserDetails.status.charAt(0).toUpperCase() + showUserDetails.status.slice(1)}
                      readOnly
                      style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px', backgroundColor: '#f8f9fa', color: '#495057' }}
                    />
                  </div>
                </div>

                <div className="input-row" style={{ display: 'flex', gap: '20px' }}>
                  <div className="field-group inline" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ display: 'inline-block', minWidth: '120px', marginBottom: 0, fontWeight: 600, color: '#333', fontSize: '14px' }}>Created:</label>
                    <input 
                      type="text" 
                      value={new Date(showUserDetails.created_at).toLocaleDateString()}
                      readOnly
                      style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px', backgroundColor: '#f8f9fa', color: '#495057' }}
                    />
                  </div>
                  <div className="field-group inline" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ display: 'inline-block', minWidth: '120px', marginBottom: 0, fontWeight: 600, color: '#333', fontSize: '14px' }}>Last Updated:</label>
                    <input 
                      type="text" 
                      value={new Date(showUserDetails.updated_at).toLocaleDateString()}
                      readOnly
                      style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px', backgroundColor: '#f8f9fa', color: '#495057' }}
                    />
                  </div>
                </div>

                <div className="checkbox-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: '#f8f9fa', borderRadius: '4px', marginTop: '15px' }}>
                  <input 
                    type="checkbox" 
                    checked={showUserDetails.role === 'super-admin'}
                    readOnly
                    disabled
                    style={{ width: 'auto' }}
                  />
                  <label style={{ margin: 0, fontWeight: 500, color: '#495057' }}>Has Super Admin Role</label>
                </div>
              </div>
              
              {/* Role Assignments Section (Read-only) */}
              <div className="role-assignments-section" style={{ flex: 1, minHeight: 0 }}>
                <div className="role-assignments-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: 600 }}>Role Assignments</h3>
                </div>
                <div 
                  className="role-assignments-list" 
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
                  {(() => {
                    console.log('🔍 [VIEW MODAL] Building role assignments for user:', showUserDetails.first_name, showUserDetails.last_name);
                    console.log('🔍 [VIEW MODAL] User role:', showUserDetails.role);
                    console.log('🔍 [VIEW MODAL] User companies array:', showUserDetails.user_companies);
                    console.log('🔍 [VIEW MODAL] User companies length:', showUserDetails.user_companies?.length || 0);
                    
                    // Build role assignments from user data
                    const userRoleAssignments = [];
                    
                    // Add super admin role if user has it
                    if (showUserDetails.role === 'super-admin') {
                      console.log('➕ [VIEW MODAL] Adding super admin role');
                      userRoleAssignments.push({
                        id: 'super-admin',
                        edition_id: 'global',
                        edition_name: 'Global',
                        channel_id: 'none',
                        channel_name: '',
                        company_id: 'none',
                        company_name: '',
                        role: 'super-admin',
                        status: 'active'
                      });
                    }
                    
                    // Add company relationships - with better logging
                    if (showUserDetails.user_companies && Array.isArray(showUserDetails.user_companies)) {
                      console.log('📋 [VIEW MODAL] Processing', showUserDetails.user_companies.length, 'company relationships');
                      
                      showUserDetails.user_companies.forEach((uc, index) => {
                        console.log(`📋 [VIEW MODAL] Company relationship ${index + 1}:`, uc);
                        
                        const roleAssignment = {
                          id: `company-${index}`,
                          edition_id: showUserDetails.edition_id || '',
                          edition_name: showUserDetails.edition_name || '',
                          channel_id: uc.channel_id || 'none',
                          channel_name: uc.channel_name || '',
                          company_id: uc.company_id,
                          company_name: uc.company_name,
                          role: uc.role,
                          status: 'active'
                        };
                        
                        console.log(`➕ [VIEW MODAL] Adding company relationship ${index + 1}:`, roleAssignment);
                        userRoleAssignments.push(roleAssignment);
                      });
                    } else {
                      console.warn('⚠️ [VIEW MODAL] user_companies is not a valid array:', showUserDetails.user_companies);
                    }
                    
                    console.log('✅ [VIEW MODAL] Final role assignments:', userRoleAssignments.length, userRoleAssignments);
                    
                    if (userRoleAssignments.length === 0) {
                      console.log('❌ [VIEW MODAL] No role assignments to display');
                      return (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#6c757d' }}>
                          <UsersIcon style={{ width: '48px', height: '48px', margin: '0 auto 8px', color: '#dee2e6' }} />
                          <p>No role assignments found</p>
                          <p style={{ fontSize: '12px' }}>Debug: user_companies length = {showUserDetails.user_companies?.length || 0}</p>
                        </div>
                      );
                    }
                    
                    return userRoleAssignments.map((assignment) => {
                      const isSuper = assignment.role === 'super-admin';
                      const hierarchy = (() => {
                        if (assignment.role === 'super-admin') {
                          return 'Global → All Systems';
                        } else if (assignment.role === 'edition-admin') {
                          return 'Edition → All Channels and Companies';
                        } else if (assignment.role === 'channel-admin') {
                          return 'Edition → Channel → All Companies';
                        } else if (assignment.role === 'company-admin') {
                          if (assignment.channel_name && assignment.channel_id !== 'none') {
                            return 'Edition → Channel → Company → All Users';
                          } else {
                            return 'Edition → Company → All Users';
                          }
                        } else if (assignment.role === 'user') {
                          if (assignment.channel_name && assignment.channel_id !== 'none') {
                            return 'Edition → Channel → Company → Your Profile';
                          } else {
                            return 'Edition → Company → Your Profile';
                          }
                        }
                        return '';
                      })();
                      
                      const displayText = isSuper 
                        ? 'Global Access' 
                        : assignment.company_name && assignment.company_id !== 'none'
                          ? assignment.company_name
                          : assignment.channel_name && assignment.channel_id !== 'none'
                            ? assignment.channel_name
                            : assignment.edition_name || 'Global Access';
                      
                      console.log(`🎨 [VIEW MODAL] Rendering role ${assignment.id}:`, {
                        role: assignment.role,
                        displayText,
                        hierarchy
                      });
                      
                      return (
                        <div key={assignment.id} className="role-row" data-id={assignment.id}>
                          <span className={`role-badge ${assignment.role}`}>
                            {formatRole(assignment.role)}
                          </span>
                          <div className="role-details">
                            <span className="edition">{displayText}</span>
                            <span className="hierarchy">{hierarchy}</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
            
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '20px', borderTop: '1px solid #eee' }}>
              <Button
                variant="outline"
                onClick={() => handleEmulateUser(showUserDetails)}
                className="text-blue-600"
                style={{ padding: '8px 16px', background: 'white', border: '1px solid #007cba', borderRadius: '4px', cursor: 'pointer', color: '#007cba' }}
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Emulate User
              </Button>
              <EmulationButton onEmulate={props.onEmulate} />
      <button 
                onClick={() => setShowUserDetails(null)}
                style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Close
              </button>
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
  
      )}
    </div>
  );
}

```

---

### supabase/functions/server/auth-handlers.ts → src/components/features/user-management/AuthHandlersForm.tsx

**Role Level:** user

**Automated Transformations:**
- Move file from supabase/functions/server/auth-handlers.ts to src/components/features/user-management/AuthHandlersForm.tsx
- Split component into smaller, reusable components
- Update all import statements to new file locations
- Add proper TypeScript interfaces for props and state
- Implement consistent error handling patterns
- Generate component-specific CSS module following CSS Organization Guide
- Add CSS module imports and className usage
- Include theme-aware styling and responsive design patterns

**Required Manual Changes:**
- Integrate with standardized API endpoints
- Add proper loading and error states
- Test component with different user roles
- Verify component follows 500-line file size limit
- Ensure component uses shared UI patterns where applicable

**Generated Transformed Code:**
```typescript

import React from 'react';
import React from 'react';
import styles from './supabase/functions/server/authhandlersform.module.css';


interface AuthHandlersProps {
  
  scope: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}


export default function Supabase/functions/server/authHandlersForm(props: AuthHandlersProps) {



  // Original component logic with enhancements
  // Component state
  
  // Component effects
  
  // Event handlers
  
  return (
    <div className={styles.container}>
      
      
      {/* Original component JSX with improvements */}
      // Backend-Dev Authentication Handlers
// Created: July 29, 2025 - 11:00 PM EST
// Updated: 7/30/25
import { jsonResponse, parseBody, formatUserResponse, supabase } from './helpers.ts';
// Authentication endpoints - Added: July 29, 2025 11:00 PM EST
export async function handleLogin(request) {
  try {
    const body = await parseBody(request);
    const { email, password } = body || {};
    // Validate inputs
    if (!email || !password) {
      return jsonResponse({
        success: false,
        error: 'Email and password are required'
      }, 400);
    }
    // Simple password check for development (password is "123456" for all users)
    if (password !== '123456') {
      return jsonResponse({
        success: false,
        error: 'Invalid email or password'
      }, 401);
    }
    // Use the same query pattern as handleTestCredentials (which works!)
    const { data: users, error } = await supabase.from('users').select(`
        *,
        companies:company_id (
          id,
          name
        ),
        editions:edition_id (
          id,
          name
        )
      `).eq('email', email.toLowerCase()).eq('status', 'active');
    if (error) {
      console.error('❌ Error fetching user:', error);
      return jsonResponse({
        success: false,
        error: 'Invalid email or password'
      }, 401);
    }
    if (!users || users.length === 0) {
      return jsonResponse({
        success: false,
        error: 'Invalid email or password'
      }, 401);
    }
    const user = users[0]; // Get the first (and should be only) user
    // Update last login time
    await supabase.from('users').update({
      last_login: new Date().toISOString(),
      is_current: true
    }).eq('id', user.id);
    // Clear is_current flag for other users of the same role
    await supabase.from('users').update({
      is_current: false
    }).neq('id', user.id).eq('role', user.role);
    const loginResponse = {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        profileImageUrl: user.profile_image_url,
        role: user.role,
        editionId: user.edition_id,
        editionName: user.editions?.name || null,
        companyId: user.company_id,
        channelId: user.channel_id,
        lastLogin: user.last_login,
        createdAt: user.created_at,
        status: user.status,
        isCurrent: true,
        company: user.companies ? {
          id: user.companies.id,
          name: user.companies.name
        } : null,
        edition: user.editions ? {
          id: user.editions.id,
          name: user.editions.name
        } : null
      },
      token: 'dev-token-' + user.id
    };
    return jsonResponse({
      success: true,
      data: loginResponse
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return jsonResponse({
      success: false,
      error: 'Login failed: ' + error.message
    }, 500);
  }
}
export async function handleLogout() {
  try {
    // Clear is_current flag for current user
    await supabase.from('users').update({
      is_current: false
    }).eq('is_current', true);
    return jsonResponse({
      success: true
    });
  } catch (error) {
    console.error('❌ Logout error:', error);
    return jsonResponse({
      success: false,
      error: 'Logout failed'
    }, 500);
  }
}
// Profile endpoints - Added: July 29, 2025 11:00 PM EST
export async function handleGetProfile() {
  try {
    console.log('🔍 Checking for current user profile...');
    // First check if users table exists and has any data
    const { data: allUsers, error: allUsersError } = await supabase.from('users').select('id, email, is_current').limit(1);
    if (allUsersError) {
      console.error('❌ Database connection or table error:', allUsersError);
      return jsonResponse({
        success: false,
        error: 'Database not initialized. Please run the SQL setup scripts.'
      }, 503);
    }
    if (!allUsers || allUsers.length === 0) {
      console.log('📝 No users found in database');
      return jsonResponse({
        success: false,
        error: 'No users found. Please run the database seed scripts.'
      }, 404);
    }
    // Get current user (the one with is_current = true)
    const { data: user, error: userError } = await supabase.from('users').select('*').eq('is_current', true).single();
    if (userError || !user) {
      console.log('👤 No current user found, user should login');
      return jsonResponse({
        success: false,
        error: 'No active session found'
      }, 401);
    }
    console.log('✅ Current user found:', {
      id: user.id,
      email: user.email,
      role: user.role
    });
    const userProfile = formatUserResponse(user);
    return jsonResponse({
      success: true,
      data: userProfile
    });
  } catch (error) {
    console.error('❌ Error getting user profile:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to get user profile: ' + error.message
    }, 500);
  }
}
export async function handleUpdateProfile(request) {
  try {
    const body = await parseBody(request);
    const { firstName, lastName, email, phone } = body || {};
    if (!firstName || !lastName || !email) {
      return jsonResponse({
        success: false,
        error: 'First name, last name, and email are required'
      }, 400);
    }
    // Get current user (the one with is_current = true)
    const { data: currentUser, error: currentUserError } = await supabase.from('users').select('id').eq('is_current', true).single();
    if (currentUserError || !currentUser) {
      return jsonResponse({
        success: false,
        error: 'No active session found'
      }, 401);
    }
    // Update the current user
    const { data: user, error } = await supabase.from('users').update({
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase(),
      phone: phone || null,
      updated_at: new Date().toISOString()
    }).eq('id', currentUser.id).select().single();
    if (error) {
      console.error('❌ Error updating user profile:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    const userProfile = formatUserResponse(user);
    return jsonResponse({
      success: true,
      data: userProfile
    });
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to update user profile: ' + error.message
    }, 500);
  }
}
// Test credentials endpoint - Added: July 29, 2025 11:00 PM EST
export async function handleTestCredentials(request) {
  try {
    const body = await parseBody(request);
    const { email, password } = body || {};
    // Simple auth check - must be daniel@scanid365.com with password 123456
    if (email !== 'daniel@scanid365.com' || password !== '123456') {
      return jsonResponse({
        success: false,
        error: 'Unauthorized access to test credentials'
      }, 401);
    }
    // Get all users with their associated company and edition information
    const { data: users, error } = await supabase.from('users').select(`
        *,
        companies:company_id (
          id,
          name
        ),
        editions:edition_id (
          id,
          name
        )
      `).eq('status', 'active').order('role').order('first_name');
    if (error) {
      console.error('❌ Error fetching test credentials:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    // Format credentials for the frontend
    const credentials = (users || []).map((user)=>({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        editionId: user.edition_id,
        companyId: user.company_id,
        lastLogin: user.last_login,
        company: user.companies ? {
          id: user.companies.id,
          name: user.companies.name
        } : null,
        edition: user.editions ? {
          id: user.editions.id,
          name: user.editions.name
        } : null
      }));
    return jsonResponse({
      success: true,
      data: {
        credentials
      }
    });
  } catch (error) {
    console.error('❌ Error in test credentials endpoint:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to fetch test credentials'
    }, 500);
  }
}
// ============================================================================
// USER MANAGEMENT CRUD OPERATIONS - Added: July 31, 2025
// ============================================================================
// Helper function to validate development token
function validateDevToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      valid: false,
      error: 'Missing or invalid authorization header'
    };
  }
  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  // For development: accept dev-token format
  if (token.startsWith('dev-token-')) {
    const userId = token.replace('dev-token-', '');
    return {
      valid: true,
      userId
    };
  }
  // Also accept the anon key for testing
  if (token === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnamlyYWttbGlrYXNra2VzamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjUxOTAsImV4cCI6MjA2OTA0MTE5MH0.kiQmzzUepA4YRaWhwsIf3CzrzWpV5SC40Y82slzjVOY') {
    return {
      valid: true,
      userId: 'anon'
    };
  }
  return {
    valid: false,
    error: 'Invalid token format'
  };
}
// GET /users - List all users with filtering and pagination
export async function handleGetUsers(request) {
  try {
    console.log('🔍 Getting all users with company relationships...');
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    console.log('🔍 Getting users with search params:', searchParams);
    
    // First get users with basic info and edition/company references
    const { data: users, error } = await supabase.from('users').select(`
        id, first_name, last_name, email, role, status, edition_id, company_id, phone, last_login, created_at, updated_at,
        editions:edition_id (
          id,
          name
        )
      `).eq('status', 'active').order('role').order('first_name');
    
    if (error) {
      console.error('❌ Error fetching users:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }

    // Get user company relationships for all users
    const userIds = (users || []).map(user => user.id);
    let userCompaniesData = [];
    
    if (userIds.length > 0) {
      const { data: userCompanies, error: userCompaniesError } = await supabase
        .from('user_companies')
        .select(`
          user_id,
          company_id,
          role,
          companies (
            id,
            name,
            channel_id,
            channels:channel_id (
              id,
              name
            )
          )
        `)
        .in('user_id', userIds);

      if (userCompaniesError) {
        console.warn('⚠️ Error fetching user companies:', userCompaniesError);
      } else {
        userCompaniesData = userCompanies || [];
        console.log(`✅ Fetched ${userCompaniesData.length} user company relationships`);
      }
    }

    // Format users for frontend with company relationships
    const formattedUsers = (users || []).map((user) => {
      // Find all company relationships for this user
      const userCompanies = userCompaniesData
        .filter(uc => uc.user_id === user.id)
        .map(uc => ({
          companyId: uc.company_id,
          company: uc.companies ? {
            id: uc.companies.id,
            name: uc.companies.name
          } : null,
          role: uc.role,
          channelId: uc.companies?.channel_id || null,
          channel: uc.companies?.channels ? {
            id: uc.companies.channels.id,
            name: uc.companies.channels.name
          } : null
        }));

      console.log(`👤 User ${user.email} has ${userCompanies.length} company relationships`);

      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        status: user.status,
        editionId: user.edition_id,
        companyId: user.company_id,
        phone: user.phone,
        lastLogin: user.last_login,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        edition: user.editions ? {
          id: user.editions.id,
          name: user.editions.name
        } : null,
        userCompanies: userCompanies,
        // Keep legacy company field for backward compatibility
        company: userCompanies.length > 0 ? userCompanies[0].company : null
      };
    });
    
    console.log(`✅ Successfully fetched ${formattedUsers.length} users with company relationships`);
    return jsonResponse({
      success: true,
      data: {
        users: formattedUsers,
        pagination: {
          page: 1,
          limit: 50,
          total: formattedUsers.length
        }
      }
    });
  } catch (error) {
    console.error('❌ Error in handleGetUsers:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to fetch users'
    }, 500);
  }
}
// POST /users - Create a new user
export async function handleCreateUser(request) {
  try {
    console.log('➕ Creating new user...');
    console.log('🔍 Creating new user');
    const userData = await request.json();
    console.log('📝 User data received:', userData);
    // Validate required fields
    if (!userData.email || !userData.firstName || !userData.lastName) {
      return jsonResponse({
        success: false,
        error: 'Missing required fields: email, firstName, lastName'
      }, 400);
    }
    // Check if user already exists
    const { data: existingUser } = await supabase.from('users').select('id, email').eq('email', userData.email.toLowerCase()).single();
    if (existingUser) {
      return jsonResponse({
        success: false,
        error: 'User with this email already exists'
      }, 409);
    }
    // Prepare user data for database
    const newUser = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email.toLowerCase(),
      role: userData.role || 'user',
      status: userData.status || 'active',
      edition_id: userData.editionId || null,
      company_id: userData.companyId || null,
      phone: userData.phone || null,
      created_at: new Date().toISOString()
    };
    const { data: createdUser, error } = await supabase.from('users').insert([
      newUser
    ]).select(`
      id, first_name, last_name, email, role, status, edition_id, company_id, phone, created_at, updated_at
    `).single();
    if (error) {
      console.error('❌ Error creating user:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }

    let companyAssignments: any[] = [];
    if (userData.company_assignments && Array.isArray(userData.company_assignments)) {
      console.log('📋 Processing company assignments:', userData.company_assignments.length);
      
      for (const assignment of userData.company_assignments) {
        const { company_id, edition_id, role, department, job_title, permissions, notes } = assignment;
        
        if (!company_id || !edition_id || !role) {
          console.warn('⚠️ Skipping invalid assignment - missing required fields:', assignment);
          continue;
        }

        const { data: existing, error: checkError } = await supabase
          .from('user_companies')
          .select('id')
          .eq('user_id', createdUser.id)
          .eq('company_id', company_id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('❌ Error checking existing relationship:', checkError);
          continue;
        }

        if (existing) {
          console.warn('⚠️ Skipping duplicate assignment for company:', company_id);
          continue;
        }

        const { data: assignmentData, error: assignmentError } = await supabase
          .from('user_companies')
          .insert({
            user_id: createdUser.id,
            company_id,
            edition_id,
            role,
            department,
            job_title,
            start_date: new Date().toISOString(),
            permissions: permissions || {},
            status: 'active',
            notes
          })
          .select(`id, user_id, company_id, edition_id, role, department, job_title, start_date, permissions, status, notes`)
          .single();

        if (assignmentError) {
          console.error('❌ Error creating company assignment:', assignmentError);
          continue;
        }

        companyAssignments.push(assignmentData);
      }
      
      console.log('✅ Successfully created', companyAssignments.length, 'company assignments');
    }
    // Format response
    const formattedUser = {
      id: createdUser.id,
      firstName: createdUser.first_name,
      lastName: createdUser.last_name,
      email: createdUser.email,
      role: createdUser.role,
      status: createdUser.status,
      editionId: createdUser.edition_id,
      companyId: createdUser.company_id,
      phone: createdUser.phone,
      createdAt: createdUser.created_at,
      updatedAt: createdUser.updated_at,
      company: null,
      edition: null,
      companyAssignments: companyAssignments.map(assignment => ({
        id: assignment.id,
        companyId: assignment.company_id,
        editionId: assignment.edition_id,
        role: assignment.role,
        department: assignment.department,
        jobTitle: assignment.job_title,
        startDate: assignment.start_date,
        permissions: assignment.permissions,
        status: assignment.status,
        notes: assignment.notes,
        company: null,
        edition: null
      }))
    };
    console.log('✅ Successfully created user:', formattedUser.id);
    return jsonResponse({
      success: true,
      data: {
        user: formattedUser
      }
    }, 201);
  } catch (error) {
    console.error('❌ Error in handleCreateUser:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to create user'
    }, 500);
  }
}
// PUT /users/:id - Update an existing user
export async function handleUpdateUser(userId, request) {
  try {
    console.log('🔍 Updating user:', userId);
    const userData = await request.json();
    console.log('📝 User update data:', userData);
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase.from('users').select('id, email').eq('id', userId).single();
    if (fetchError || !existingUser) {
      return jsonResponse({
        success: false,
        error: 'User not found'
      }, 404);
    }
    // If email is being changed, check for conflicts
    if (userData.email && userData.email.toLowerCase() !== existingUser.email) {
      const { data: emailConflict } = await supabase.from('users').select('id').eq('email', userData.email.toLowerCase()).neq('id', userId).single();
      if (emailConflict) {
        return jsonResponse({
          success: false,
          error: 'Email already in use by another user'
        }, 409);
      }
    }
    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    if (userData.firstName) updateData.first_name = userData.firstName;
    if (userData.lastName) updateData.last_name = userData.lastName;
    if (userData.email) updateData.email = userData.email.toLowerCase();
    if (userData.role) updateData.role = userData.role;
    if (userData.status) updateData.status = userData.status;
    if (userData.editionId !== undefined) updateData.edition_id = userData.editionId;
    if (userData.companyId !== undefined) updateData.company_id = userData.companyId;
    if (userData.phone !== undefined) updateData.phone = userData.phone;
    const { data: updatedUser, error } = await supabase.from('users').update(updateData).eq('id', userId).select(`
      id, first_name, last_name, email, role, status, edition_id, company_id, phone, created_at, updated_at
    `).single();
    if (error) {
      console.error('❌ Error updating user:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }

    let companyAssignments: any[] = [];
    if (userData.company_assignments && Array.isArray(userData.company_assignments)) {
      console.log('📋 Processing company assignments update:', userData.company_assignments.length);
      
      
      for (const assignment of userData.company_assignments) {
        const { company_id, edition_id, role, department, job_title, permissions, notes } = assignment;
        
        if (!company_id || !edition_id || !role) {
          console.warn('⚠️ Skipping invalid assignment - missing required fields:', assignment);
          continue;
        }

        const { data: existing, error: checkError } = await supabase
          .from('user_companies')
          .select('id')
          .eq('user_id', userId)
          .eq('company_id', company_id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('❌ Error checking existing relationship:', checkError);
          continue;
        }

        if (existing) {
          console.warn('⚠️ Skipping duplicate assignment for company:', company_id);
          continue;
        }

        const { data: assignmentData, error: assignmentError } = await supabase
          .from('user_companies')
          .insert({
            user_id: userId,
            company_id,
            edition_id,
            role,
            department,
            job_title,
            start_date: new Date().toISOString(),
            permissions: permissions || {},
            status: 'active',
            notes
          })
          .select(`id, user_id, company_id, edition_id, role, department, job_title, start_date, permissions, status, notes`)
          .single();

        if (assignmentError) {
          console.error('❌ Error creating company assignment:', assignmentError);
          continue;
        }

        companyAssignments.push(assignmentData);
      }
      
      console.log('✅ Successfully processed', companyAssignments.length, 'new company assignments');
    }
    // Format response
    const formattedUser = {
      id: updatedUser.id,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      editionId: updatedUser.edition_id,
      companyId: updatedUser.company_id,
      phone: updatedUser.phone,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
      company: null,
      edition: null,
      newCompanyAssignments: companyAssignments.map(assignment => ({
        id: assignment.id,
        companyId: assignment.company_id,
        editionId: assignment.edition_id,
        role: assignment.role,
        department: assignment.department,
        jobTitle: assignment.job_title,
        startDate: assignment.start_date,
        permissions: assignment.permissions,
        status: assignment.status,
        notes: assignment.notes,
        company: null,
        edition: null
      }))
    };
    console.log('✅ Successfully updated user:', userId);
    return jsonResponse({
      success: true,
      data: {
        user: formattedUser
      }
    });
  } catch (error) {
    console.error('❌ Error in handleUpdateUser:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to update user'
    }, 500);
  }
}
// DELETE /users/:id - Delete a user (soft delete by setting status to 'deleted')
export async function handleDeleteUser(userId, request) {
  try {
    console.log('🔍 Deleting user:', userId);
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase.from('users').select('id, email, status').eq('id', userId).single();
    if (fetchError || !existingUser) {
      return jsonResponse({
        success: false,
        error: 'User not found'
      }, 404);
    }
    if (existingUser.status === 'deleted') {
      return jsonResponse({
        success: false,
        error: 'User is already deleted'
      }, 400);
    }
    // Soft delete: set status to 'deleted' and update timestamp
    const { data: deletedUser, error } = await supabase.from('users').update({
      status: 'deleted',
      updated_at: new Date().toISOString()
    }).eq('id', userId).select('id, email, status, updated_at').single();
    if (error) {
      console.error('❌ Error deleting user:', error);
      return jsonResponse({
        success: false,
        error: error.message
      }, 500);
    }
    console.log('✅ Successfully deleted user:', userId);
    return jsonResponse({
      success: true,
      data: {
        message: 'User deleted successfully',
        user: {
          id: deletedUser.id,
          email: deletedUser.email,
          status: deletedUser.status,
          deletedAt: deletedUser.updated_at
        }
      }
    });
  } catch (error) {
    console.error('❌ Error in handleDeleteUser:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to delete user'
    }, 500);
  }
}

    </div>
  );
}

```

---


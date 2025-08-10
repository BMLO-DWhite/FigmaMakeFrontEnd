import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { 
  Search, Plus, Eye, Edit, Trash2, Globe, 
  Filter, RefreshCw, RotateCcw, Undo2, Skull
} from 'lucide-react';
import { toast } from 'sonner';

// Environment variables for security
const BACKEND_URL = import.meta.env?.VITE_BACKEND_URL || 'https://sgjirakmlikaskkesjic.supabase.co/functions/v1/backend-dev';
const AUTH_TOKEN = import.meta.env?.VITE_AUTH_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnamlyYWttbGlrYXNra2VzamljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjUxOTAsImV4cCI6MjA2OTA0MTE5MH0.kiQmzzUepA4YRaWhwsIf3CzrzWpV5SC40Y82slzjVOY';

interface Edition {
  id: string;
  name: string;
  status: 'active' | 'deleted';
  features: {
    coBranding: boolean;
    customFields: boolean;
    documentManagement: boolean;
    emsResponseReport: boolean;
    notesModule: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface EditionFormData {
  name: string;
  features: {
    coBranding: boolean;
    customFields: boolean;
    documentManagement: boolean;
    emsResponseReport: boolean;
    notesModule: boolean;
  };
}

export function EditionsManagement() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState<Edition | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<EditionFormData>({
    name: '',
    features: {
      coBranding: false,
      customFields: false,
      documentManagement: false,
      emsResponseReport: false,
      notesModule: false
    }
  });

  useEffect(() => {
    fetchEditions();
  }, []);

  const fetchEditions = async () => {
    try {
      console.log('🔍 Fetching editions from:', `${BACKEND_URL}/editions/all`);
      
      const response = await fetch(`${BACKEND_URL}/editions/all`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      console.log('📊 Editions response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Editions data received:', data);
        
        if (data.success && data.data && Array.isArray(data.data)) {
          // Map backend field names to frontend expected format
          const mappedEditions = data.data.map((edition: any) => {
            console.log('🔍 Raw edition from backend:', edition);
            
            // Handle status mapping - backend may return either 'status' field or 'is_active' field
            let status: 'active' | 'deleted';
            if (edition.status) {
              status = edition.status === 'active' ? 'active' : 'deleted';
            } else if (typeof edition.is_active === 'boolean') {
              status = edition.is_active ? 'active' : 'deleted';
            } else {
              console.warn('⚠️ Edition missing both status and is_active fields:', edition);
              status = 'active'; // Default to active if unclear
            }
            
            console.log(`📊 Edition "${edition.name}" mapped status: ${status} (from backend field: ${edition.status || edition.is_active})`);
            
            return {
              id: edition.id,
              name: edition.name,
              status: status,
              createdAt: edition.dateCreated,
              updatedAt: edition.lastUpdate,
              features: {
                coBranding: edition.features?.co_branding || false,
                customFields: edition.features?.custom_fields || false,
                documentManagement: edition.features?.documents || false,
                emsResponseReport: edition.features?.ems_response || false,
                notesModule: edition.features?.notes || false
              }
            };
          });
          setEditions(mappedEditions);
          console.log('✅ Mapped editions:', mappedEditions);
        } else {
          console.warn('⚠️ Editions returned success but no data array:', data);
          setEditions([]);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to fetch editions:', response.status, errorData);
        toast.error('Failed to load editions');
        setEditions([]);
      }
    } catch (error) {
      console.error('❌ Error fetching editions:', error);
      toast.error('Failed to load editions');
      setEditions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEditions = editions.filter(edition => {
    const matchesSearch = edition.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showDeleted ? true : edition.status === 'active';
    const shouldShow = matchesSearch && matchesStatus;
    console.log(`🔍 Filtering "${edition.name}": status=${edition.status}, showDeleted=${showDeleted}, matchesStatus=${matchesStatus}, shouldShow=${shouldShow}`);
    return shouldShow;
  });

  const activeEditions = editions.filter(edition => edition.status === 'active');
  const deletedEditions = editions.filter(edition => edition.status === 'deleted');
  
  console.log(`📊 Edition counts: Total=${editions.length}, Active=${activeEditions.length}, Deleted=${deletedEditions.length}, Filtered=${filteredEditions.length}`);

  const handleNewEdition = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedEdition(null);
    setFormData({
      name: '',
      features: {
        coBranding: false,
        customFields: false,
        documentManagement: false,
        emsResponseReport: false,
        notesModule: false
      }
    });
  };

  const handleEditEdition = (edition: Edition) => {
    setIsEditing(true);
    setIsCreating(false);
    setSelectedEdition(edition);
    setFormData({
      name: edition.name,
      features: edition.features
    });
  };

  const handleViewEdition = (edition: Edition) => {
    // TODO: Navigate to Edition Feature Configuration screen
    console.log('🔍 View edition feature configuration for:', edition.name);
    toast.info('Edition Feature Configuration screen coming soon');
  };

  const handleDeleteEdition = async (edition: Edition) => {
    if (!confirm(`Are you sure you want to delete "${edition.name}"? This will soft delete the edition.`)) {
      return;
    }

    try {
      console.log('🗑️ Soft deleting edition:', edition.id);
      
      const response = await fetch(`${BACKEND_URL}/editions/${edition.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      console.log('📡 Delete edition response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Edition deleted successfully:', data);
        
        if (data.success) {
          toast.success('Edition deleted successfully');
          await fetchEditions(); // Refresh the list
        } else {
          toast.error(data.error || 'Failed to delete edition');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Delete edition failed:', response.status, errorData);
        toast.error(errorData.error || 'Failed to delete edition');
      }
    } catch (error) {
      console.error('❌ Error deleting edition:', error);
      toast.error('Failed to delete edition');
    }
  };

  const handleRestoreEdition = async (edition: Edition) => {
    if (!confirm(`Are you sure you want to restore "${edition.name}"? This will reactivate the edition.`)) {
      return;
    }

    try {
      console.log('🔄 Restoring edition:', edition.id);
      
      const response = await fetch(`${BACKEND_URL}/editions/${edition.id}/restore`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      console.log('📡 Restore edition response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Edition restored successfully:', data);
        
        if (data.success) {
          toast.success('Edition restored successfully');
          await fetchEditions(); // Refresh the list
        } else {
          toast.error(data.error || 'Failed to restore edition');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Restore edition failed:', response.status, errorData);
        toast.error(errorData.error || 'Failed to restore edition');
      }
    } catch (error) {
      console.error('❌ Error restoring edition:', error);
      toast.error('Failed to restore edition');
    }
  };

  const handlePermanentDeleteEdition = async (edition: Edition) => {
    const confirmMessage = `⚠️ PERMANENT DELETE WARNING ⚠️\n\nAre you absolutely sure you want to PERMANENTLY delete "${edition.name}"?\n\nThis action:\n• CANNOT be undone\n• Will remove ALL data associated with this edition\n• Requires Super Admin privileges\n\nType "DELETE" to confirm:`;
    
    const userInput = prompt(confirmMessage);
    if (userInput !== 'DELETE') {
      toast.error('Permanent delete cancelled - confirmation not provided');
      return;
    }

    try {
      console.log('💀 PERMANENTLY deleting edition:', edition.id);
      
      const response = await fetch(`${BACKEND_URL}/editions/${edition.id}/permanent`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          email: 'daniel@scanid365.com',
          role: 'super-admin'
        }),
      });

      console.log('📡 Permanent delete edition response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Edition permanently deleted:', data);
        
        if (data.success) {
          toast.success('Edition permanently deleted');
          await fetchEditions(); // Refresh the list
        } else {
          toast.error(data.error || 'Failed to permanently delete edition');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Permanent delete edition failed:', response.status, errorData);
        toast.error(errorData.error || 'Failed to permanently delete edition');
      }
    } catch (error) {
      console.error('❌ Error permanently deleting edition:', error);
      toast.error('Failed to permanently delete edition');
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Edition name is required');
      return;
    }

    setSaving(true);
    try {
      const isUpdate = isEditing && selectedEdition;
      const url = isUpdate ? `${BACKEND_URL}/editions/${selectedEdition.id}` : `${BACKEND_URL}/editions`;
      const method = isUpdate ? 'PUT' : 'POST';
      
      console.log(`🔍 ${isUpdate ? 'Updating' : 'Creating'} edition:`, formData);
      console.log(`🔗 Using URL: ${url}`);
      
      // Generate a slug from the edition name (client-side only - cannot guarantee uniqueness)
      const generateSlug = (name: string) => {
        return name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      };

      const requestBody = {
        name: formData.name.trim(),
        slug: generateSlug(formData.name.trim()),
        features: {
          co_branding: formData.features.coBranding,
          custom_fields: formData.features.customFields,
          documents: formData.features.documentManagement,
          ems_response: formData.features.emsResponseReport,
          notes: formData.features.notesModule
        }
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`📡 ${isUpdate ? 'Update' : 'Create'} edition response status:`, response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Edition ${isUpdate ? 'updated' : 'created'} successfully:`, data);
        
        if (data.success) {
          toast.success(`Edition ${isUpdate ? 'updated' : 'created'} successfully`);
          await fetchEditions(); // Refresh the list
          handleCancel(); // Close the form
        } else {
          toast.error(data.error || `Failed to ${isUpdate ? 'update' : 'create'} edition`);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ ${isUpdate ? 'Update' : 'Create'} edition failed:`, response.status, errorData);
        toast.error(errorData.error || `Failed to ${isUpdate ? 'update' : 'create'} edition`);
      }
    } catch (error) {
      console.error(`❌ Error ${isEditing ? 'updating' : 'creating'} edition:`, error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} edition`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedEdition(null);
    setFormData({
      name: '',
      features: {
        coBranding: false,
        customFields: false,
        documentManagement: false,
        emsResponseReport: false,
        notesModule: false
      }
    });
  };

  const handleFeatureChange = (feature: keyof EditionFormData['features'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: checked
      }
    }));
  };

  const showRightPanel = isCreating || isEditing;

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 font-montserrat">
        Super Admin Dashboard &gt; Edition Management
      </div>
      
      <h1 className="text-2xl font-semibold text-gray-900 font-montserrat">Edition Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className={showRightPanel ? "lg:col-span-1" : "lg:col-span-3"}>
          <div className="space-y-6">
            {/* Total Editions Card */}
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-montserrat">Total Editions</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-montserrat">{activeEditions.length}</div>
                <p className="text-xs text-muted-foreground font-montserrat">
                  {activeEditions.length} active
                  {deletedEditions.length > 0 && `, ${deletedEditions.length} deleted`}
                </p>
              </CardContent>
            </Card>

            {/* Edition List */}
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-montserrat">Edition List</CardTitle>
                <Button 
                  onClick={handleNewEdition}
                  style={{ backgroundColor: '#294199' }}
                  className="font-montserrat"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Edition
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search editions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-montserrat"
                  />
                </div>

                {/* Filter Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-deleted"
                      checked={showDeleted}
                      onCheckedChange={setShowDeleted}
                    />
                    <Label htmlFor="show-deleted" className="text-sm font-montserrat">
                      Show deleted editions
                    </Label>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchEditions}
                    disabled={isLoading}
                    className="font-montserrat"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                {/* Editions Table */}
                <div className="border rounded-lg">
                  <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 border-b font-semibold font-montserrat text-sm">
                    <div>Edition Name</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600 font-montserrat">Loading editions...</p>
                    </div>
                  ) : filteredEditions.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-600 font-montserrat">
                        {searchTerm ? 'No editions found matching your search.' : 'No editions found.'}
                      </p>
                    </div>
                  ) : (
                    filteredEditions.map((edition) => {
                      console.log(`🔍 Rendering edition "${edition.name}" with status: ${edition.status}`);
                      return (
                      <div key={edition.id} className="grid grid-cols-3 gap-4 p-3 border-b last:border-b-0 hover:bg-gray-50">
                        <div className="flex items-center">
                          <span className="font-montserrat">{edition.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Badge 
                            variant={edition.status === 'active' ? 'default' : 'destructive'} 
                            className="text-xs"
                          >
                            {edition.status === 'active' ? 'Active' : 'Deleted'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewEdition(edition)}
                            className="h-8 w-8 p-0"
                            title="View Edition Configuration"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          
                          {edition.status === 'active' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditEdition(edition)}
                                className="h-8 w-8 p-0"
                                title="Edit Edition"
                              >
                                <Edit className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteEdition(edition)}
                                className="h-8 w-8 p-0"
                                title="Soft Delete Edition"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          
                          {edition.status === 'deleted' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRestoreEdition(edition)}
                                className="h-8 w-8 p-0"
                                title="Restore Edition"
                              >
                                <Undo2 className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePermanentDeleteEdition(edition)}
                                className="h-8 w-8 p-0"
                                title="Permanently Delete Edition (WARNING: Cannot be undone)"
                              >
                                <Skull className="h-4 w-4 text-red-800" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Panel - Edition Configuration */}
        {showRightPanel && (
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-montserrat">
                  Editions & Feature Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold font-montserrat mb-4">
                    {isCreating ? 'New Edition' : 'Edit Edition'}
                  </h3>
                  
                  {/* Edition Name */}
                  <div className="space-y-2">
                    <Label htmlFor="edition-name" className="text-sm font-semibold text-gray-700">
                      Edition Name
                    </Label>
                    <Input
                      id="edition-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter edition name"
                      className="bg-white border border-gray-300 focus:border-scan-primary-blue focus:ring-1 focus:ring-scan-primary-blue font-montserrat"
                    />
                  </div>
                </div>

                {/* Edition Configuration */}
                <div>
                  <h4 className="text-base font-semibold font-montserrat mb-4">
                    Edition Configuration
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="co-branding"
                        checked={formData.features.coBranding}
                        onCheckedChange={(checked) => handleFeatureChange('coBranding', checked as boolean)}
                      />
                      <Label htmlFor="co-branding" className="font-montserrat">
                        Co-Branding
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="custom-fields"
                        checked={formData.features.customFields}
                        onCheckedChange={(checked) => handleFeatureChange('customFields', checked as boolean)}
                      />
                      <Label htmlFor="custom-fields" className="font-montserrat">
                        Custom Fields
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="document-management"
                        checked={formData.features.documentManagement}
                        onCheckedChange={(checked) => handleFeatureChange('documentManagement', checked as boolean)}
                      />
                      <Label htmlFor="document-management" className="font-montserrat">
                        Document management
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ems-response-report"
                        checked={formData.features.emsResponseReport}
                        onCheckedChange={(checked) => handleFeatureChange('emsResponseReport', checked as boolean)}
                      />
                      <Label htmlFor="ems-response-report" className="font-montserrat">
                        EMS Response Report
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notes-module"
                        checked={formData.features.notesModule}
                        onCheckedChange={(checked) => handleFeatureChange('notesModule', checked as boolean)}
                      />
                      <Label htmlFor="notes-module" className="font-montserrat">
                        Notes Module
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{ backgroundColor: '#294199' }}
                    className="font-montserrat"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="font-montserrat"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
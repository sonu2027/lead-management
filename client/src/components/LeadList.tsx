import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditLeadModal from './EditLeadModal';
import SearchAndFilter from './SearchAndFilter';
import Pagination from './Pagination';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalLeads: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

const LeadList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalLeads: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 5
  });

  const fetchLeads = async (page = currentPage, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '5'
      });
      
      if (search) params.append('search', search);
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/leads?${params}`);
      
      if (response.data.success) {
        setLeads(response.data.data);
        setPagination(response.data.pagination);
        setCurrentPage(page);
      }
    } catch (error: any) {
      setError('Failed to fetch leads. Please try again.');
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '' ) {
        setCurrentPage(1);
        fetchLeads(1, searchTerm);
      } else {
        fetchLeads(1, '');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}`);
      
      if (response.data.success) {
        setLeads(leads.filter(lead => lead._id !== leadId));
      }
    } catch (error: any) {
      alert('Failed to delete lead. Please try again.');
      console.error('Error deleting lead:', error);
    }
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsEditModalOpen(true);
  };

  const handleLeadUpdated = () => {
    fetchLeads(currentPage, searchTerm); 
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchLeads(1, '');
  };

  const handlePageChange = (page: number) => {
    fetchLeads(page, searchTerm);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Lead List</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading leads...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Lead List</h2>
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => fetchLeads()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClearFilters={handleClearFilters}
      />

      {/* Lead List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Lead List</h2>
            <span className="text-sm text-gray-600">
              {pagination.totalLeads} lead{pagination.totalLeads !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>
              {searchTerm 
                ? 'No leads found matching your search criteria.' 
                : 'No leads found. Add your first lead above!'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditLead(lead)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalLeads={pagination.totalLeads}
          limit={pagination.limit}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={handlePageChange}
        />
      </div>

      <EditLeadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lead={editingLead}
        onLeadUpdated={handleLeadUpdated}
      />
    </div>
  );
};

export default LeadList;

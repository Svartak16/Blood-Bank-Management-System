import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Plus, Edit, Trash, Clock, Search, Eye } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminDashboardLayout';

const CampaignManagement = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [itemsPerPage] = useState(10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState(null);

    

    const getFilteredCampaigns = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        return campaigns.filter(campaign => {
          // Check if campaign has any sessions
        if (!campaign.sessions || campaign.sessions.length === 0) return false;
    
          // Get the latest session date for this campaign
        const latestSession = new Date(Math.max(...campaign.sessions.map(
            session => new Date(session.date)
        )));
    
        if (activeTab === 'upcoming') {
            return latestSession >= today;
        } else {
            return latestSession < today;
        }
        });
    };

    const DeleteConfirmationModal = ({ campaign, onConfirm, onCancel }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="text-center">
                <Trash className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Delete Campaign
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete campaign "{campaign.location}"? This action cannot be undone.
                </p>
                
                <div className="flex justify-end space-x-3">
                    <button
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                    Cancel
                    </button>
                    <button
                    onClick={onConfirm}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                    Delete
                    </button>
                </div>
                </div>
            </div>
    </div>
    );

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/campaigns', {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            setCampaigns(data.data);
        } else {
            setError('Failed to fetch campaigns');
        }
        } catch (error) {
        setError('Failed to fetch campaigns');
        } finally {
        setLoading(false);
        }
    };

    const CampaignModal = ({ onClose }) => {
        const validateCoordinates = () => {
            const lat = parseFloat(formData.latitude);
            const lng = parseFloat(formData.longitude);
            
            if (isNaN(lat) || isNaN(lng)) {
                setError('Please enter numeric values for coordinates');
                return false;
            }
            
            if (lat < -90 || lat > 90) {
                setError('Latitude must be between -90 and 90 degrees');
                return false;
            }
        
            if (lng < -180 || lng > 180) {
                setError('Longitude must be between -180 and 180 degrees');
                return false;
            }
            
            return true;
        };

        const [formData, setFormData] = useState(
            selectedCampaign ? {
                ...selectedCampaign,
                sessions: selectedCampaign.sessions.map(session => ({
                ...session,
                date: formatDateForInput(session.date)
            }))
            } : {
                location: '',
                organizer: '',
                address: '',
                latitude: '',
                longitude: '',
                sessions: [{
                date: '',
                start_time: '',
                end_time: ''
            }]
            }
        );

        const addSession = () => {
        setFormData({
            ...formData,
            sessions: [
            ...formData.sessions,
            { date: '', start_time: '', end_time: '' }
            ]
        });
        };

        const removeSession = (index) => {
        const newSessions = formData.sessions.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            sessions: newSessions
        });
        };

        const handleSessionChange = (index, field, value) => {
        const newSessions = [...formData.sessions];
        newSessions[index] = {
            ...newSessions[index], 
            [field]: value
        };
        setFormData({
            ...formData,
            sessions: newSessions
        });
        };

        const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateCoordinates()) {
            setError('Please enter valid coordinates');
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            const url = modalMode === 'add' 
            ? 'http://localhost:5000/api/admin/campaigns'
            : `http://localhost:5000/api/admin/campaigns/${selectedCampaign.id}`;
            
            const response = await fetch(url, {
            method: modalMode === 'add' ? 'POST' : 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
            });

            if (response.ok) {
            fetchCampaigns();
            onClose();
            } else {
            setError('Failed to save campaign');
            }
        } catch (error) {
            setError('Failed to save campaign');
        }
        };

        return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-semibold mb-4">
                {modalMode === 'view' ? 'Campaign Details' : 
                modalMode === 'add' ? 'Add New Campaign' : 'Edit Campaign'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.location}
                        readOnly={modalMode === 'view'}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="e.g., JOHOR BAHRU - AEON TERBAU CITY"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organizer
                    </label>
                    <input
                    type="text"
                    required
                    value={formData.organizer}
                    readOnly={modalMode === 'view'}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Organization Name"
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                </label>
                <textarea
                    required
                    value={formData.address}
                    readOnly={modalMode === 'view'}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="2"
                    placeholder="Full address of the campaign location"
                />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                    </label>
                    <input
                        type="number"
                        step="any"
                        required
                        value={formData.latitude}
                        readOnly={modalMode === 'view'}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md ${
                            error && error.includes('Latitude') ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 1.5489000"
                    />
                    <p className="mt-1 text-xs text-gray-500">Valid range: -90 to 90</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                    </label>
                    <input
                        type="number"
                        step="any"
                        required
                        value={formData.longitude}
                        readOnly={modalMode === 'view'}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md ${
                            error && error.includes('Longitude') ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 103.7956000"
                    />
                    <p className="mt-1 text-xs text-gray-500">Valid range: -180 to 180</p>
                </div>

                <div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Sessions
                </label>
                {modalMode !== 'view' ? (
                    // Editable sessions form
                    <div className="space-y-4">
                    {formData.sessions.map((session, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                            <label className="text-sm text-gray-600">Date</label>
                            <input
                                type="date"
                                required
                                value={session.date}
                                onChange={(e) => handleSessionChange(index, 'date', e.target.value)}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            </div>
                            <div>
                            <label className="text-sm text-gray-600">Start Time</label>
                            <input
                                type="time"
                                required
                                value={session.start_time}
                                onChange={(e) => handleSessionChange(index, 'start_time', e.target.value)}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            </div>
                            <div>
                            <label className="text-sm text-gray-600">End Time</label>
                            <input
                                type="time"
                                required
                                value={session.end_time}
                                onChange={(e) => handleSessionChange(index, 'end_time', e.target.value)}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            </div>
                        </div>
                        {formData.sessions.length > 1 && (
                            <button
                            type="button"
                            onClick={() => removeSession(index)}
                            className="mt-2 text-red-600 hover:text-red-800 text-sm"
                            >
                            Remove Session
                            </button>
                        )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addSession}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                        + Add Another Session
                    </button>
                    </div>
                ) : (
                    // Read-only sessions view (for view mode)
                    <div className="space-y-4">
                    {formData.sessions.map((session, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="font-medium">{formatDate(session.date)}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600">Start Time</p>
                            <p className="font-medium">{session.start_time}</p>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600">End Time</p>
                            <p className="font-medium">{session.end_time}</p>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
                </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                    <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                    Close
                    </button>
                    {modalMode !== 'view' && (
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        {modalMode === 'add' ? 'Add Campaign' : 'Save Changes'}
                    </button>
                    )}
                </div>
                </form>
            </div>
            </div>
        );
    };

    const handleDelete = async (campaignId) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/campaigns/${campaignId}`, {
                method: 'DELETE',
                headers: {
                'Authorization': `Bearer ${token}`
                }
            });
        
            if (response.ok) {
                fetchCampaigns();
                setShowDeleteModal(false);
                setCampaignToDelete(null);
            } else {
                setError('Failed to delete campaign');
            }
            } catch (error) {
            setError('Failed to delete campaign');
        }
    };

    const filteredCampaigns = getFilteredCampaigns().filter(campaign => 
        campaign.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCampaigns.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };
  
    const formatTime = (time) => {
      return time.slice(0, 5);
    };

    const CampaignTable = ({ campaigns, activeTab, onEdit, onDelete, onView }) => {
    
      return (
        <div className="overflow-hidden rounded-lg bg-white border border-gray-200">
          {/* Table Header */}
          <div className="border-b border-gray-200 bg-white">
            <div className="grid grid-cols-12 divide-x divide-gray-200">
              <div className="col-span-5 px-6 py-4">
                <span className="text-sm font-medium text-gray-500 uppercase">
                  Campaign Details
                </span>
              </div>
              <div className="col-span-4 px-6 py-4">
                <span className="text-sm font-medium text-gray-500 uppercase">
                  Sessions
                </span>
              </div>
              <div className="col-span-3 px-6 py-4">
                <span className="text-sm font-medium text-gray-500 uppercase">
                  Actions
                </span>
              </div>
            </div>
          </div>
    
          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {campaigns.map((campaign, index) => (
              <div key={campaign.id} className="hover:bg-gray-50 transition-colors duration-150">
                <div className="grid grid-cols-12 divide-x divide-gray-200">
                  {/* Campaign Details */}
                  <div className="col-span-5 p-6">
                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {campaign.location}
                        </span>
                        <span className="text-sm text-gray-500">
                          {campaign.organizer}
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-500 break-words">
                          {campaign.address}
                        </span>
                      </div>
                    </div>
                  </div>
    
                  {/* Sessions */}
                  <div className="col-span-4 p-6">
                    <div className="space-y-3">
                      {campaign.sessions.map((session, idx) => (
                        <div key={idx} className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {formatDate(session.date)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 ml-6">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {formatTime(session.start_time)} - {formatTime(session.end_time)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
    
                  {/* Actions */}
                  <div className="col-span-3 p-6">
                    <div className="flex space-x-4">
                      {activeTab === 'upcoming' ? (
                        <>
                          <button
                            onClick={() => onEdit(campaign)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => onDelete(campaign)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onView(campaign)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
    
          {/* Empty State */}
          {campaigns.length === 0 && (
            <div className="text-center py-12 border-t border-gray-200">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'upcoming' 
                  ? 'No upcoming campaigns scheduled' 
                  : 'No recent campaigns found'}
              </p>
            </div>
          )}
        </div>
      );
    };

    return (
        <AdminLayout>
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
                </div>

                <button
                onClick={() => {
                    setModalMode('add');
                    setSelectedCampaign(null);
                    setShowModal(true);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center 
                    hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
                >
                <Plus className="h-5 w-5 mr-2" />
                Add Campaign
                </button>
            </div>
            </div>

            <div className="border-b border-gray-200">
                <nav className="flex -mb-px px-6">
                    <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`py-4 px-6 inline-flex items-center border-b-2 font-medium text-sm
                        ${activeTab === 'upcoming' 
                        ? 'border-red-500 text-red-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                    Upcoming Campaigns
                    </button>
                    <button
                    onClick={() => setActiveTab('recent')}
                    className={`py-4 px-6 inline-flex items-center border-b-2 font-medium text-sm
                        ${activeTab === 'recent' 
                        ? 'border-red-500 text-red-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                    Recent Campaigns
                    </button>
                </nav>
                </div>

                <div className="p-6">
                {/* Search */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="max-w-2xl">
                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search campaigns by location or organizer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                        focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    />
                    </div>
                </div>
            </div>

            {/* Campaigns Table */}
            <CampaignTable
                campaigns={currentItems}
                activeTab={activeTab}
                onEdit={(campaign) => {
                    setSelectedCampaign(campaign);
                    setModalMode('edit');
                    setShowModal(true);
                }}
                onDelete={(campaign) => {
                    setCampaignToDelete(campaign);
                    setShowDeleteModal(true);
                }}
                onView={(campaign) => {
                    setSelectedCampaign(campaign);
                    setModalMode('view');
                    setShowModal(true);
                }}
            />

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <div>
                <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredCampaigns.length)}
                </span>{' '}
                of <span className="font-medium">{filteredCampaigns.length}</span> campaigns
                </p>
            </div>
            <div className="flex space-x-2">
                <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                >
                Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                    currentPage === i + 1 ? 'bg-red-600 text-white' : ''
                    }`}
                >
                    {i + 1}
                </button>
                ))}
                <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                >
                Next
                </button>
            </div>
            </div>
        </div>

        {showModal && (
        <CampaignModal
            onClose={() => {
            setShowModal(false);
            setSelectedCampaign(null);
            }}
        />
        )}

        {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
            {error}
        </div>
        )}

        {showDeleteModal && campaignToDelete && (
        <DeleteConfirmationModal
            campaign={campaignToDelete}
            onConfirm={() => handleDelete(campaignToDelete.id)}
            onCancel={() => {
            setShowDeleteModal(false);
            setCampaignToDelete(null);
            }}
        />
        )}
    </AdminLayout>
    );
};

export default CampaignManagement;
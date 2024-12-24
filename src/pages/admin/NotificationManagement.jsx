import React, { useState, useEffect } from 'react';
import { Bell, Send, Filter, X } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminDashboardLayout';
import NotificationList from './NotificationList';

    const NotificationManagement = () => {
    const [filters, setFilters] = useState({
        bloodType: '',
        area: '',
    });
    const [notification, setNotification] = useState({
        title: '',
        message: '',
        type: 'info'
    });
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [response, setResponse] = useState({ message: '', type: '' });
    const [recipientCount, setRecipientCount] = useState(0);
    const [hasRecipients, setHasRecipients] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [activeTab, setActiveTab] = useState('push');
    const [successDetails, setSuccessDetails] = useState({
    recipientCount: 0,
    message: ''
    });

    const checkRecipients = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/notifications/check-recipients', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({ filters }),
            });
        
            const data = await response.json();
            setRecipientCount(data.recipientCount);
            setHasRecipients(data.recipientCount > 0);
            } catch (error) {
            console.error('Error checking recipients:', error);
        }
    };

    // Check recipients when filters change
    useEffect(() => {
        checkRecipients();
    }, [filters.bloodType, filters.area]);

    const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const AREAS = [
      "Johor Bahru", "Muar", "Batu Pahat", "Kluang", "Pontian", 
      "Segamat", "Kota Tinggi", "Mersing", "Kulai", "Tangkak"
    ];

    const FilterSection = ({ filters, setFilters, recipientCount }) => {
       
      
        return (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-red-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Target Audience</h2>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-gray-600">
                  {recipientCount} potential recipient{recipientCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
      
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Blood Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Type
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, bloodType: '' }))}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                      ${!filters.bloodType 
                        ? 'bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-2'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    All
                  </button>
                  {BLOOD_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setFilters(prev => ({ ...prev, bloodType: type }))}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                        ${filters.bloodType === type
                          ? 'bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-2'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
      
              {/* Area Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area
                </label>
                <select
                  value={filters.area}
                  onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">All Areas</option>
                  {AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      };

    const handleSendNotification = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/admin/notifications/send', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({
                ...notification,
                filters
                }),
            });
        
            const data = await response.json();
            
            if (data.success) {
                setSuccessDetails({
                recipientCount: data.recipientCount,
                message: data.message
                });
                setShowSuccessModal(true);
                // Clear form
                setNotification({ title: '', message: '', type: 'info' });
                setFilters({ bloodType: '', area: '' });
            } else {
                throw new Error(data.message || 'Failed to send notification');
            }
            } catch (error) {
            setResponse({ message: error.message, type: 'error' });
            } finally {
            setLoading(false);
            }
    };

        const SuccessModal = () => (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6 animate-scale-fade-in">
                    <div className="text-center">
                    {/* Success Icon */}
                    <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <svg 
                        className="h-8 w-8 text-green-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7" 
                        />
                        </svg>
                    </div>
            
                    {/* Title */}
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Notification Sent Successfully
                    </h3>
            
                    {/* Details */}
                    <p className="text-sm text-gray-600 mb-6">
                        Your notification has been sent to {successDetails.recipientCount} recipient{successDetails.recipientCount !== 1 ? 's' : ''}.
                    </p>
            
                    {/* Close Button */}
                    <button
                        onClick={() => setShowSuccessModal(false)}
                        className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Close
                    </button>
                    </div>
                </div>
            </div>
        );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
                <div className="flex items-center space-x-3">
                    <Bell className="h-6 w-6 text-red-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Notification Management</h1>
                </div>
                </div>
            </div>

            {/* Enhanced Tab Navigation */}
            <div className="mb-6">
                <nav className="flex space-x-8">
                <button
                    onClick={() => setActiveTab('push')}
                    className={`flex items-center px-1 pb-4 border-b-2 transition-colors ${
                    activeTab === 'push'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Send className="h-5 w-5 mr-2" />
                    Push Notification
                </button>
                <button
                    onClick={() => setActiveTab('list')}
                    className={`flex items-center px-1 pb-4 border-b-2 transition-colors ${
                    activeTab === 'list'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Bell className="h-5 w-5 mr-2" />
                    Notification List
                </button>
                </nav>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'push' ? (
            <div className="space-y-6">
            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div className="flex items-center">
                    <Filter className="h-5 w-5 text-red-500 mr-2" />
                    <h2 className="text-lg font-semibold">Target Audience</h2>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium text-gray-600">
                    {recipientCount} potential recipient{recipientCount !== 1 ? 's' : ''}
                    </span>
                </div>
                </div>

                {/* Enhanced Filters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Blood Type Filter */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                    <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilters(prev => ({ ...prev, bloodType: '' }))}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                        ${!filters.bloodType 
                            ? 'bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-2'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        All
                    </button>
                    {BLOOD_TYPES.map(type => (
                        <button
                        key={type}
                        onClick={() => setFilters(prev => ({ ...prev, bloodType: type }))}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                            ${filters.bloodType === type
                            ? 'bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-2'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                        {type}
                        </button>
                    ))}
                    </div>
                </div>

                {/* Area Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                    <select
                    value={filters.area}
                    onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                    <option value="">All Areas</option>
                    {AREAS.map(area => (
                        <option key={area} value={area}>{area}</option>
                    ))}
                    </select>
                </div>
                </div>
            </div>

            {/* Notification Content Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6 pb-4 border-b">
                <Bell className="h-5 w-5 text-red-500 mr-2" />
                <h2 className="text-lg font-semibold">Notification Content</h2>
                </div>

                <div className="space-y-4">
                {/* Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                    value={notification.type}
                    onChange={(e) => setNotification(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                    <option value="info">Information</option>
                    <option value="alert">Alert</option>
                    <option value="success">Success</option>
                    </select>
                </div>

                {/* Title Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                    type="text"
                    value={notification.title}
                    onChange={(e) => setNotification(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter notification title"
                    />
                </div>

                {/* Message Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                    value={notification.message}
                    onChange={(e) => setNotification(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter notification message"
                    />
                </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
                <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                Preview
                </button>
                <button
                onClick={handleSendNotification}
                disabled={loading || !notification.title || !notification.message || !hasRecipients}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Sending...' : hasRecipients ? 'Send Notification' : 'No Recipients Available'}
                </button>
            </div>
            </div>
        ) : (
            <NotificationList />
        )}

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6">
                    <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Preview Notification</h3>
                    <button
                        onClick={() => setShowPreview(false)}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    </div>

                    <div className="border rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                        notification.type === 'alert' ? 'bg-red-100 text-red-800' :
                        notification.type === 'success' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                        }`}>
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                    </div>
                    <h4 className="font-medium text-gray-900">{notification.title || 'No title'}</h4>
                    <p className="mt-1 text-gray-600">{notification.message || 'No message'}</p>
                    </div>

                    <div className="text-sm text-gray-500">
                    <p>Target audience:</p>
                    <ul className="mt-1 list-disc list-inside">
                        <li>Blood Type: {filters.bloodType || 'All blood types'}</li>
                        <li>Area: {filters.area || 'All areas'}</li>
                        <li className="font-medium text-gray-700 mt-2">
                        Recipients: {recipientCount} user{recipientCount !== 1 ? 's' : ''}
                        </li>
                    </ul>
                    </div>
                </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && <SuccessModal />}
            </div>
        </AdminLayout>
        );
};

export default NotificationManagement;
import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [typeFilter, setTypeFilter] = useState('all');

        useEffect(() => {
            fetchNotifications();
        }, []);
    
        const getFilteredNotifications = () => {
            return notifications.filter(notification => 
            typeFilter === 'all' || notification.type === typeFilter
            );
        };

        const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/notifications/all', {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
            });
    
            const data = await response.json();
            if (data.success) {
            setNotifications(data.data);
            } else {
            throw new Error(data.message || 'Failed to fetch notifications');
            }
        } catch (error) {
            setError('Failed to load notifications');
            console.error(error);
        } finally {
            setLoading(false);
        }
        };
    
        const getTypeStyle = (type) => {
          switch (type) {
            case 'alert':
              return 'bg-red-100 text-red-800';
            case 'success':
              return 'bg-green-100 text-green-800';
            default:
              return 'bg-blue-100 text-blue-800';
          }
        };

        const FilterSection = ({ typeFilter, setTypeFilter, entriesPerPage, setEntriesPerPage, notifications }) => {
            const filterTypes = [
              { value: 'all', label: 'All Types', color: 'bg-gray-100 text-gray-700' },
              { value: 'info', label: 'Information', color: 'bg-blue-50 text-blue-700' },
              { value: 'alert', label: 'Alert', color: 'bg-red-50 text-red-700' },
              { value: 'success', label: 'Success', color: 'bg-green-50 text-green-700' }
            ];
          
            return (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  {/* Filter Pills */}
                  <div className="flex flex-wrap gap-2">
                    {filterTypes.map(({ value, label, color }) => (
                      <button
                        key={value}
                        onClick={() => setTypeFilter(value)}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 
                          ${typeFilter === value 
                            ? 'ring-2 ring-red-500 ring-offset-2 shadow-sm' 
                            : ''
                          }
                          ${color}
                        `}
                      >
                        <span className="font-medium">{label}</span>
                        <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-sm">
                          {notifications.filter(n => 
                            value === 'all' ? true : n.type === value
                          ).length}
                        </span>
                      </button>
                    ))}
                  </div>
          
                  {/* Entries per page */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show</span>
                    <select
                      value={entriesPerPage}
                      onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-600">entries</span>
                  </div>
                </div>
              </div>
            );
          };
    
        // Pagination
        const filteredNotifications = getFilteredNotifications();
        const indexOfLastEntry = currentPage * entriesPerPage;
        const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
        const currentEntries = filteredNotifications.slice(indexOfFirstEntry, indexOfLastEntry);
        const totalPages = Math.ceil(filteredNotifications.length / entriesPerPage);

        if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
        }
    
        return (
          <div className="space-y-6">
            {/* Enhanced Filter Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All Types', color: 'bg-gray-100 text-gray-700' },
                    { value: 'info', label: 'Information', color: 'bg-blue-50 text-blue-700' },
                    { value: 'alert', label: 'Alert', color: 'bg-red-50 text-red-700' },
                    { value: 'success', label: 'Success', color: 'bg-green-50 text-green-700' }
                  ].map(({ value, label, color }) => (
                    <button
                      key={value}
                      onClick={() => setTypeFilter(value)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        typeFilter === value 
                          ? 'ring-2 ring-red-500 ring-offset-2 shadow-sm' 
                          : ''
                      } ${color}`}
                    >
                      <span className="font-medium">{label}</span>
                      <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-sm">
                        {notifications.filter(n => value === 'all' ? true : n.type === value).length}
                      </span>
                    </button>
                  ))}
                </div>
      
                {/* Entries per page */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show</span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                    className="border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {[10, 25, 50].map(value => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-600">entries</span>
                </div>
              </div>
            </div>
      
            {/* Enhanced Table Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Type", "Title", "Message", "Recipient", "Status", "Date"].map((header) => (
                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentEntries.map((notification) => (
                      <tr key={notification.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeStyle(notification.type)}`}>
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-md truncate">{notification.message}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{notification.user_name}</div>
                          <div className="text-sm text-gray-500">
                            {notification.blood_type} • {notification.area || 'No area'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            notification.is_read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {notification.is_read ? 'Read' : 'Unread'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
      
              {/* Enhanced Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredNotifications.length)} of {filteredNotifications.length} entries
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                        currentPage === index + 1 
                          ? 'bg-red-600 text-white' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      };
      
export default NotificationList;
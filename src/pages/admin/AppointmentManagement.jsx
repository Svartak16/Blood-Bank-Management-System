import React, { useState, useEffect } from 'react';
import { Search, Check, X, Eye, Calendar, MapPin, Clock, CalendarHeart } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminDashboardLayout';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/appointment', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setAppointments(data.data);
      } else {
        setError('Failed to fetch appointments');
      }
    } catch (error) {
      setError('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const token = sessionStorage.getItem('token');
      console.log('Sending request with data:', { appointmentId, newStatus });
  
      const response = await fetch(`http://localhost:5000/api/appointment/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus,
          action: newStatus // Add this line
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response:', errorData);
        setError(errorData.message || 'Failed to update appointment status');
        return;
      }
  
      const data = await response.json();
      console.log('Success response:', data);
      fetchAppointments();
      setShowDetailsModal(false); // Close modal after successful update
      
    } catch (error) {
      console.error('Status update error:', error);
      setError('Failed to update appointment status');
    }
  };

  const handleCompleteDonation = async (appointmentId) => {
    try {
      // Check if donation is already completed
      const appointment = appointments.find(a => a.id === appointmentId);
      if (appointment?.donation_completed) {
        setError('This donation has already been marked as complete');
        return;
      }
  
      const token = sessionStorage.getItem('token');
      const completionDate = new Date().toISOString().split('T')[0];
      const nextEligibleDate = new Date();
      nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 3);
  
      const response = await fetch(`http://localhost:5000/api/appointment/${appointmentId}/complete-donation`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          donation_completed: true,
          donation_completed_date: completionDate,
          next_eligible_date: nextEligibleDate.toISOString().split('T')[0]
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to complete donation');
      }
  
      await fetchAppointments();
      setShowDetailsModal(false);
    } catch (error) {
      setError('Failed to mark donation as complete');
    }
  };

  const AppointmentDetailsModal = ({ appointment, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Appointment Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Donor Information</h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm">{appointment.name}</p>
              <p className="text-sm text-gray-500">{appointment.email}</p>
              <p className="text-sm text-gray-500">{appointment.phone}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Campaign Details</h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {appointment.campaign_location}
              </p>
              <p className="text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(appointment.session_date).toLocaleDateString()}
              </p>
              <p className="text-sm flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {appointment.preferred_time}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Blood Information</h3>
            <div className="mt-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                {appointment.blood_type}
              </span>
            </div>
          </div>

          {/* Status Management Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700">Status Management</h3>
            <div className="mt-2">
              {/* Show Pending Actions */}
              {appointment.status === 'pending' && !appointment.donation_completed && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                    className="px-3 py-1 rounded-md text-sm border border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                    className="px-3 py-1 rounded-md text-sm border border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Show Complete Donation option ONLY if status is confirmed AND donation is not completed */}
              {appointment.status === 'confirmed' && !appointment.donation_completed && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mark donation as completed?</span>
                  <button
                    onClick={() => handleCompleteDonation(appointment.id)}
                    className="px-3 py-1 rounded-md text-sm bg-green-600 text-white hover:bg-green-700"
                  >
                    Complete Donation
                  </button>
                </div>
              )}

              {/* Always show completed status if donation is completed */}
              {appointment.donation_completed && (
                <div className="space-y-2">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Donation Completed</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Completed on: {new Date(appointment.donation_completed_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Next eligible date: {new Date(appointment.next_eligible_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Show cancelled status */}
              {appointment.status === 'cancelled' && !appointment.donation_completed && (
                <div className="flex items-center text-red-600">
                  <X className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Appointment Cancelled</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};  

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.campaign_location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const getStatusStyle = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <AdminLayout>
      {/* Enhanced Header Section */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
          <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-lg">
                    <CalendarHeart className="h-6 w-6 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Donation Management</h1>
                </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Enhanced Table Section */}
      <div className="bg-white rounded-lg border">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Donor", "Campaign", "Date & Time", "Blood Type", "Status", "Actions"].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{appointment.name}</span>
                        <span className="text-sm text-gray-500">{appointment.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{appointment.campaign_location}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">
                          {new Date(appointment.session_date).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500">{appointment.preferred_time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {appointment.blood_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        {appointment.donation_completed && (
                          <div className="flex items-center text-blue-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Completed</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowDetailsModal(true);
                          }}
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {appointment.status === 'pending' && !appointment.donation_completed && (
                          <>
                            <button
                              onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                              className="text-gray-600 hover:text-green-600 transition-colors"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                              className="text-gray-600 hover:text-red-600 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Enhanced Pagination */}
        <div className="p-4 flex items-center justify-between border-t border-gray-200">
          <span className="text-sm text-gray-700">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAppointments.length)} of {filteredAppointments.length} results
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border rounded-md text-sm ${
                  currentPage === index + 1 ? 'bg-red-600 text-white' : 'hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Keep existing modals */}
      {showDetailsModal && selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAppointment(null);
          }}
        />
      )}

      {/* Enhanced Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <X className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AppointmentManagement;
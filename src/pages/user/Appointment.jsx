// src/pages/Appointments.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, Clock, MapPin, AlertCircle, X, 
  CheckCircle2, Clock4, XCircle, LayoutGrid,
  Info
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AppointmentTimeEdit from '../../components/layout/AppointmentTimeEdit';
import apiClient from '../../api/client';

const AppointmentCard = ({ appointment, onCancel, onTimeChange }) => {
  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return {
          container: 'bg-green-50 border-green-100',
          badge: 'bg-green-100 text-green-800',
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />
        };
      case 'cancelled':
        return {
          container: 'bg-red-50 border-red-100',
          badge: 'bg-red-100 text-red-800',
          icon: <XCircle className="h-5 w-5 text-red-600" />
        };
      default:
        return {
          container: 'bg-yellow-50 border-yellow-100',
          badge: 'bg-yellow-100 text-yellow-800',
          icon: <Clock4 className="h-5 w-5 text-yellow-600" />
        };
    }
  };

  const styles = getStatusStyles(appointment.status);

  return (
    <div className={`rounded-xl border p-6 transition-all ${styles.container}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {styles.icon}
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {appointment.campaign_name}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${styles.badge}`}>
              {appointment.status}
            </span>
          </div>
        </div>
        
        {appointment.status.toLowerCase() === 'pending' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onTimeChange(appointment)}
              className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center"
            >
              <Clock className="h-4 w-4 mr-1" />
              Change Time
            </button>
            <button
              onClick={() => onCancel(appointment.id)}
              className="text-sm font-medium text-gray-600 hover:text-gray-700 flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{new Date(appointment.session_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{appointment.preferred_time}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
          <span className="truncate">{appointment.location}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <Info className="h-4 w-4 mr-2" />
          Booked on {new Date(appointment.created_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

const FilterButton = ({ active, label, icon: Icon, count, onClick, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2.5 rounded-lg transition-all
      ${active 
        ? `${color} ring-2 ring-offset-2 ring-red-500 shadow-sm` 
        : 'bg-white text-gray-600 hover:bg-gray-50'
      }`}
  >
    <Icon className="w-5 h-5 mr-2" />
    <span className="font-medium">{label}</span>
    <span className={`ml-2 px-2 py-0.5 bg-white rounded-full text-sm
      ${active ? 'text-red-600' : 'text-gray-500'}`}>
      {count}
    </span>
  </button>
);

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusCount = (status) => {
    if (status === 'all') return appointments.length;
    return appointments.filter(app => app.status.toLowerCase() === status.toLowerCase()).length;
  };

  const handlePageChange = (newPage) => {
    setScrollPosition(window.scrollY);
    setCurrentPage(newPage);
  };
  
  const getFilteredAppointments = () => {
    return appointments.filter(appointment => 
      statusFilter === 'all' || appointment.status.toLowerCase() === statusFilter
    );
  };

  // Use useEffect to restore scroll position after render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await apiClient.put(`/user/appointments/${appointmentId}/cancel`);
      
      if (response.data.success) {
        // Update the appointments list by changing the status of the cancelled appointment
        setAppointments(appointments.map(app => 
          app.id === appointmentId 
            ? { ...app, status: 'cancelled' }
            : app
        ));
      } else {
        throw new Error(response.data.message || 'Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError('Failed to cancel appointment. Please try again.');
    }
  };

  const handleTimeUpdate = (appointmentId, newTime) => {
    setAppointments(appointments.map(app => 
      app.id === appointmentId 
        ? { ...app, preferred_time: newTime }
        : app
    ));
  };

  const getPaginatedData = (data, page, perPage) => {
    const startIndex = (page - 1) * perPage;
    return data.slice(startIndex, startIndex + perPage);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await apiClient.get('/user/reservation');
      
      if (response.data.success) {
        // Sort the appointments before setting state
        const sortedData = response.data.data.sort((a, b) => {
          const dateA = new Date(`${a.session_date} ${a.preferred_time}`);
          const dateB = new Date(`${b.session_date} ${b.preferred_time}`);
          return dateB - dateA;  // Most recent first
        });
        setAppointments(sortedData);
      } else {
        setError('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (error.response?.status === 401) {
        setError('Please login to view appointments');
      } else {
        setError('Error loading appointments');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-red-500 focus:border-red-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { value: 'all', label: 'All', icon: LayoutGrid, color: 'bg-gray-100' },
                { value: 'pending', label: 'Pending', icon: Clock4, color: 'bg-yellow-50' },
                { value: 'confirmed', label: 'Confirmed', icon: CheckCircle2, color: 'bg-green-50' },
                { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-50' }
              ].map(filter => (
                <FilterButton
                  key={filter.value}
                  active={statusFilter === filter.value}
                  label={filter.label}
                  icon={filter.icon}
                  count={getStatusCount(filter.value)}
                  onClick={() => {
                    setStatusFilter(filter.value);
                    setCurrentPage(1);
                  }}
                  color={filter.color}
                />
              ))}
            </div>
          </div>
        </div>
  
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
  
      {/* Appointments List */}
      <div className="space-y-4">
          {getFilteredAppointments().length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {statusFilter !== 'all' ? statusFilter : ''} appointments found
              </h3>
              <p className="text-gray-500">
                {statusFilter === 'all' 
                  ? 'Schedule your first blood donation appointment today!'
                  : `You don't have any ${statusFilter} appointments at the moment.`}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {getPaginatedData(getFilteredAppointments(), currentPage, entriesPerPage)
                  .map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onCancel={(id) => {
                        setAppointmentToCancel(id);
                        setShowCancelModal(true);
                      }}
                      onTimeChange={(appointment) => setEditingAppointment(appointment)}
                    />
                  ))}
              </div>
  
          {/* Pagination */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * entriesPerPage) + 1} to {
                      Math.min(currentPage * entriesPerPage, getFilteredAppointments().length)
                    } of {getFilteredAppointments().length} entries
                    {statusFilter !== 'all' && ` (filtered from ${appointments.length} total entries)`}
                  </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ 
                length: Math.ceil(getFilteredAppointments().length / entriesPerPage) 
              }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`px-3 py-1 border rounded text-sm ${
                    currentPage === idx + 1 ? 'bg-red-600 text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(
                  Math.min(currentPage + 1, Math.ceil(getFilteredAppointments().length / entriesPerPage))
                )}
                disabled={currentPage === Math.ceil(getFilteredAppointments().length / entriesPerPage)}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
          </div>
        </>
      )}
    </div>
  
      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => {
              setShowCancelModal(false);
              setAppointmentToCancel(null);
            }}
          />
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 animate-scale-fade-in">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cancel Appointment
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setAppointmentToCancel(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                No, Keep It
              </button>
              <button
                onClick={() => {
                  if (appointmentToCancel) {
                    handleCancelAppointment(appointmentToCancel);
                    setShowCancelModal(false);
                    setAppointmentToCancel(null);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Yes, Cancel It
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Time Edit Modal */}
      {editingAppointment && (
        <AppointmentTimeEdit
          appointment={{
            ...editingAppointment,
            campaign_location: editingAppointment.campaign_location
          }}
          onUpdate={(newTime) => {
            handleTimeUpdate(editingAppointment.id, newTime);
            setEditingAppointment(null);
          }}
          onClose={() => setEditingAppointment(null)}
        />
      )}
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
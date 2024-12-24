import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, Droplet, MapPin, User, Mail, Phone, Edit, Plus, X } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminDashboardLayout';

const DonationManagement = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedBloodType, setSelectedBloodType] = useState('all');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showAddModal, setShowAddModal] = useState(false);

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const statuses = ['Pending', 'Completed', 'Rejected'];

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/donations', {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            setDonations(data.data);
        } else {
            setError('Failed to fetch donations');
        }
        } catch (error) {
        setError('Failed to fetch donations');
        } finally {
        setLoading(false);
        }
    };

        const AddDonationModal = ({ onClose }) => {
            const [searchTerm, setSearchTerm] = useState('');
            const [isDropdownOpen, setIsDropdownOpen] = useState(false);
            const [formData, setFormData] = useState({
                donor_id: '',
                blood_bank_id: '',
                donation_date: '',
                blood_type: '',
                quantity_ml: 450,
                status: 'Pending',
                health_screening_notes: ''
            });
            const [donors, setDonors] = useState([]);
            const [bloodBanks, setBloodBanks] = useState([]);
            const [error, setError] = useState('');
            const filteredDonors = donors.filter(donor => 
                donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donor.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const dropdownRef = useRef(null);

            useEffect(() => {
                const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsDropdownOpen(false);
                }
                };
            
                document.addEventListener('mousedown', handleClickOutside);
                return () => document.removeEventListener('mousedown', handleClickOutside);
            }, []);
            
            useEffect(() => {
                const fetchInitialData = async () => {
                    setLoading(true);
                    try {
                        await Promise.all([fetchDonors(), fetchBloodBanks()]);
                    } catch (error) {
                        console.error('Error fetching initial data:', error);
                        setError('Failed to load required data');
                    } finally {
                        setLoading(false);
                    }
                };
        
                fetchInitialData();
            }, []);
        
            const fetchDonors = async () => {
                try {
                    const token = sessionStorage.getItem('token');
                    const response = await fetch('http://localhost:5000/api/admin/donations/users/donors', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
            
                    if (!response.ok) {
                        throw new Error('Failed to fetch donors');
                    }
            
                    const data = await response.json();
                    if (data.success) {
                        // Ensure all required fields are present with proper null handling
                        const donorsWithFullProfile = data.data.map(donor => ({
                            ...donor,
                            name: donor.name,
                            phone: donor.phone || null,
                            blood_type: donor.blood_type || 'UNKNOWN',
                            date_of_birth: donor.date_of_birth || null,
                            gender: donor.gender || null,  // Handle ENUM properly
                            area: donor.area || null
                        }));
                        setDonors(donorsWithFullProfile);
                    } else {
                        throw new Error(data.message || 'Failed to fetch donors');
                    }
                } catch (error) {
                    console.error('Error fetching donors:', error);
                    setError('Failed to fetch donors list');
                    throw error;
                }
            };
        
            const fetchBloodBanks = async () => {
                try {
                    const token = sessionStorage.getItem('token');
                    const response = await fetch('http://localhost:5000/api/blood-banks/all', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
        
                    if (!response.ok) {
                        throw new Error('Failed to fetch blood banks');
                    }
        
                    const data = await response.json();
                    if (data.success) {
                        setBloodBanks(data.data);
                    } else {
                        throw new Error(data.message || 'Failed to fetch blood banks');
                    }
                } catch (error) {
                    console.error('Error fetching blood banks:', error);
                    setError('Failed to fetch blood banks list');
                    throw error;
                }
            };
        
            // Handle donor selection and auto-fill blood type
            const handleDonorChange = (donorId) => {
                const selectedDonor = donors.find(donor => donor.id.toString() === donorId);
                setFormData(prev => ({
                    ...prev,
                    donor_id: donorId,
                    blood_type: selectedDonor?.blood_type || '' // Auto-fill blood type if available
                }));
            };
        
            // Modified submit handler to update user profile if needed
            const handleSubmit = async (e) => {
                e.preventDefault();
                try {
                    const token = sessionStorage.getItem('token');
                    
                    // First add the donation
                    const donationResponse = await fetch('http://localhost:5000/api/admin/donations', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });
            
                    if (!donationResponse.ok) {
                        throw new Error('Failed to add donation');
                    }
            
                    // If donation is added successfully and donor had unknown blood type, update their profile
                    const selectedDonor = donors.find(donor => donor.id.toString() === formData.donor_id);
                    if (selectedDonor && (!selectedDonor.blood_type || selectedDonor.blood_type === 'UNKNOWN')) {
                        // Use the new endpoint to update blood type
                        const updateBloodTypeResponse = await fetch(
                            `http://localhost:5000/api/user/update-blood-type/${formData.donor_id}`, 
                            {
                                method: 'PUT',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    bloodType: formData.blood_type
                                })
                            }
                        );
            
                        if (!updateBloodTypeResponse.ok) {
                            console.error('Failed to update user blood type');
                            const errorData = await updateBloodTypeResponse.json();
                            console.error('Blood type update error:', errorData);
                        } else {
                            // If blood type update was successful, update the local donors state
                            setDonors(prevDonors => 
                                prevDonors.map(donor => 
                                    donor.id.toString() === formData.donor_id
                                        ? { ...donor, blood_type: formData.blood_type }
                                        : donor
                                )
                            );
                        }
                    }
            
                    onClose();
                } catch (error) {
                    setError('Failed to add donation');
                    console.error('Error:', error);
                }
            };

            const DonorSelect = () => (
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donor <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder="Search donor by name or email..."
                      className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          setFormData(prev => ({ ...prev, donor_id: '' }));
                        }}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
              
                    {/* Selected Donor Display */}
                    {formData.donor_id && !isDropdownOpen && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-md">
                        {(() => {
                          const selectedDonor = donors.find(d => d.id.toString() === formData.donor_id);
                          return selectedDonor ? (
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-gray-900">{selectedDonor.name}</p>
                                <p className="text-sm text-gray-500">{selectedDonor.email}</p>
                              </div>
                              <div className="text-sm">
                                <span className={`px-2 py-1 rounded-full ${
                                  selectedDonor.blood_type && selectedDonor.blood_type !== 'UNKNOWN'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {selectedDonor.blood_type || 'Unknown Blood Type'}
                                </span>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
              
                    {/* Dropdown list */}
                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                        {filteredDonors.length > 0 ? (
                          filteredDonors.map((donor) => (
                            <button
                              key={donor.id}
                              type="button"
                              onClick={() => {
                                handleDonorChange(donor.id.toString());
                                setSearchTerm(donor.name);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium text-gray-900">{donor.name}</p>
                                <p className="text-sm text-gray-500">{donor.email}</p>
                              </div>
                              <span className={`text-sm px-2 py-1 rounded-full ${
                                donor.blood_type && donor.blood_type !== 'UNKNOWN'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {donor.blood_type || 'Unknown Blood Type'}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            No donors found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add New Donation</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                    </button>
                </div>
        
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                    {error}
                    </div>
                )}
        
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="donor-select">
                    <DonorSelect />
                </div>
        
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Destination
                    </label>
                    <select
                        required
                        value={formData.blood_bank_id}
                        onChange={(e) => setFormData({ ...formData, blood_bank_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Select Blood Bank</option>
                        {bloodBanks.map(bank => (
                        <option key={bank.id} value={bank.id}>
                            {bank.name}
                        </option>
                        ))}
                    </select>
                    </div>
        
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Blood Type
                        </label>
                        <select
                            required
                            value={formData.blood_type}
                            onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select Blood Type</option>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {formData.donor_id && !donors.find(d => d.id.toString() === formData.donor_id)?.blood_type && (
                            <p className="mt-1 text-sm text-gray-500 italic">
                                Donor's blood type will be updated with this selection
                            </p>
                        )}
                    </div>
        
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Donation Date
                    </label>
                    <input
                        type="date"
                        required
                        value={formData.donation_date}
                        onChange={(e) => setFormData({ ...formData, donation_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    </div>
        
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity (ml)
                    </label>
                    <input
                        type="number"
                        required
                        value={formData.quantity_ml}
                        onChange={(e) => setFormData({ ...formData, quantity_ml: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="0"
                        step="1"
                    />
                    </div>
        
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Health Screening Notes
                    </label>
                    <textarea
                        value={formData.health_screening_notes}
                        onChange={(e) => setFormData({ ...formData, health_screening_notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows="3"
                    />
                    </div>
        
                    <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Add Donation
                    </button>
                    </div>
                </form>
                </div>
            </div>
        );
    };

    const DonationDetailsModal = ({ donation, onClose }) => {
        const [status, setStatus] = useState(donation.status);
        const [healthNotes, setHealthNotes] = useState(donation.health_screening_notes || '');

        const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/donations/${donation.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status,
                health_screening_notes: healthNotes
            })
            });

            if (response.ok) {
            fetchDonations();
            onClose();
            } else {
            setError('Failed to update donation');
            }
        } catch (error) {
            setError('Failed to update donation');
        }
        };

        return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Donation Details</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                <h3 className="font-medium text-gray-700">Donor Information</h3>
                <div className="mt-2 space-y-2">
                    <p className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2" />
                    {donation.donor_name}
                    </p>
                    <p className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2" />
                    {donation.donor_email}
                    </p>
                    <p className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2" />
                    {donation.donor_phone}
                    </p>
                </div>
                </div>

                <div>
                <h3 className="font-medium text-gray-700">Donation Details</h3>
                <div className="mt-2 space-y-2">
                    <p className="flex items-center text-sm">
                    <Droplet className="h-4 w-4 mr-2" />
                    Blood Type: {donation.blood_type}
                    </p>
                    <p className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date: {new Date(donation.donation_date).toLocaleDateString()}
                    </p>
                    <p className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location: {donation.blood_bank_name}
                    </p>
                </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                </label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                    {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Health Screening Notes
                </label>
                <textarea
                    value={healthNotes}
                    onChange={(e) => setHealthNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="4"
                    placeholder="Enter health screening notes..."
                />
                </div>

                <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Save Changes
                </button>
                </div>
            </form>
            </div>
        </div>
        );
    };

    // Filter donations
    const filteredDonations = donations.filter(donation => {
        const matchesSearch = 
        donation.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.blood_bank_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || donation.status === selectedStatus;
        const matchesBloodType = selectedBloodType === 'all' || donation.blood_type === selectedBloodType;
        
        return matchesSearch && matchesStatus && matchesBloodType;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDonations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

    const getStatusStyle = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
        switch(status) {
          case 'Completed':
            return `${baseClasses} bg-green-100 text-green-800`;
          case 'Pending':
            return `${baseClasses} bg-yellow-100 text-yellow-800`;
          default:
            return `${baseClasses} bg-red-100 text-red-800`;
        }
      };

      return (
        <AdminLayout>
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
          <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-lg">
                    <Droplet className="h-6 w-6 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Donation Management</h1>
                </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center 
                    hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Donation
          </button>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search donations..."
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
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          value={selectedBloodType}
          onChange={(e) => setSelectedBloodType(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="all">All Blood Types</option>
          {bloodTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Donor Details", "Blood Type", "Blood Destination", "Date", "Status", "Actions"].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((donation) => (
              <tr key={donation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{donation.donor_name}</span>
                    <span className="text-sm text-gray-500">{donation.donor_email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {donation.blood_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{donation.blood_bank_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(donation.donation_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(donation.status)}`}>
                    {donation.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setSelectedDonation(donation);
                      setShowDetailsModal(true);
                    }}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-700">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDonations.length)} of {filteredDonations.length} entries
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

      {/* Keeping existing modals */}
      {showDetailsModal && selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedDonation(null);
          }}
        />
      )}

      {showAddModal && (
        <AddDonationModal
          onClose={() => {
            setShowAddModal(false);
            fetchDonations();
          }}
        />
      )}
    </AdminLayout>
  );
};

export default DonationManagement;
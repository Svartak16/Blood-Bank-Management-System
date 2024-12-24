import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Search, MapPin, Phone, Clock, Building2 } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminDashboardLayout';

const BloodBanksManagement = () => {
const [bloodBanks, setBloodBanks] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
const [showModal, setShowModal] = useState(false);
const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
const [selectedBank, setSelectedBank] = useState(null);
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [bankToDelete, setBankToDelete] = useState(null);

    const TableHeader = ({ children }) => (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
        {children}
        </th>
    );

    const StatusBadge = ({ area }) => (
        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
        {area}
        </span>
    );

    const ActionButton = ({ onClick, icon: Icon, color, label }) => (
        <button
        onClick={onClick}
        className={`p-2 rounded-full hover:bg-${color}-50 text-${color}-600 
            hover:text-${color}-700 transition-all duration-200 group relative`}
        title={label}
        >
        <Icon className="h-5 w-5" />
        <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
            bg-gray-800 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 
            pointer-events-none transition-opacity duration-200 whitespace-nowrap">
            {label}
        </span>
        </button>
    );

const DeleteConfirmationModal = ({ bank, onConfirm, onCancel }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center">
            <Trash className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Blood Bank
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete "{bank.name}"? This action cannot be undone.
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

    const JOHOR_AREAS = [
        "Johor Bahru",
        "Muar",
        "Batu Pahat",
        "Kluang",
        "Pontian",
        "Segamat",
        "Kota Tinggi",
        "Mersing",
        "Kulai",
        "Tangkak"
    ];

    // Fetch blood banks
    useEffect(() => {
        fetchBloodBanks();
    }, []);

    const fetchBloodBanks = async () => {
        try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/blood-banks/all', {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            setBloodBanks(data.data);
        } else {
            setError('Failed to fetch blood banks');
        }
        } catch (error) {
        setError('Failed to fetch blood banks');
        } finally {
        setLoading(false);
        }
    };

    // Blood Bank Form Modal
    const BloodBankModal = ({ onClose }) => {
        const [formData, setFormData] = useState(
        selectedBank || {
            name: '',
            address: '',
            area: '',
            contact: '',
            operating_hours: ''
        }
        );

        const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            const url = modalMode === 'add' 
            ? 'http://localhost:5000/api/blood-banks'
            : `http://localhost:5000/api/blood-banks/${selectedBank.id}`;
            
            const response = await fetch(url, {
            method: modalMode === 'add' ? 'POST' : 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
            });

            if (response.ok) {
            fetchBloodBanks();
            onClose();
            } else {
            setError('Failed to save blood bank');
            }
        } catch (error) {
            setError('Failed to save blood bank');
        }
        };

        return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
                {modalMode === 'add' ? 'Add New Blood Bank' : 'Edit Blood Bank'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                </label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                </label>
                <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="3"
                />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area
                    </label>
                    <select
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                    <option value="">Select Area</option>
                    {JOHOR_AREAS.map((area) => (
                        <option key={area} value={area}>
                        {area}
                        </option>
                    ))}
                    </select>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                </label>
                <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Operating Hours
                </label>
                <input
                    type="text"
                    required
                    value={formData.operating_hours}
                    onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Mon-Sun: 9:00 AM - 5:00 PM"
                />
                </div>

                <div className="flex justify-end space-x-2 mt-6">
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
                    {modalMode === 'add' ? 'Add Blood Bank' : 'Save Changes'}
                </button>
                </div>
            </form>
            </div>
        </div>
        );
    };

    // Handle delete blood bank
    const handleDelete = async (bankId) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/blood-banks/${bankId}`, {
                method: 'DELETE',
                headers: {
                'Authorization': `Bearer ${token}`
                }
            });
        
            if (response.ok) {
                fetchBloodBanks();
                setShowDeleteModal(false);
                setBankToDelete(null);
            } else {
                setError('Failed to delete blood bank');
            }
            } catch (error) {
            setError('Failed to delete blood bank');
        }
    };

    // Filter and pagination
    const filteredBanks = bloodBanks.filter(bank => 
        bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.area.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBanks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBanks.length / itemsPerPage);

    
    return (
        <AdminLayout>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Enhanced Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Blood Banks Management</h1>
                </div>

                <button
                onClick={() => {
                    setModalMode('add');
                    setSelectedBank(null);
                    setShowModal(true);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center 
                    hover:bg-red-700 transition-colors duration-200 transform hover:scale-105 
                    shadow-sm hover:shadow"
                >
                <Plus className="h-5 w-5 mr-2" />
                Add Blood Bank
                </button>
            </div>
            </div>

            {/* Enhanced Search */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="max-w-md">
                <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name or area..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                    focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
                </div>
            </div>
            </div>

            {/* Enhanced Table */}
            <div className="bg-white rounded-lg">
            {loading ? (
                <div className="flex justify-center items-center py-12">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200"></div>
                    <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-red-600 border-t-transparent"></div>
                </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                    <thead>
                    <tr className="border-b border-gray-200">
                        <th className="px-6 py-4 bg-white text-left text-sm font-medium text-gray-500 border-r border-gray-200">
                        Name & Address
                        </th>
                        <th className="px-6 py-4 bg-white text-left text-sm font-medium text-gray-500 border-r border-gray-200">
                        Area
                        </th>
                        <th className="px-6 py-4 bg-white text-left text-sm font-medium text-gray-500 border-r border-gray-200">
                        Contact
                        </th>
                        <th className="px-6 py-4 bg-white text-left text-sm font-medium text-gray-500 border-r border-gray-200">
                        Operating Hours
                        </th>
                        <th className="px-6 py-4 bg-white text-left text-sm font-medium text-gray-500">
                        Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((bank, index) => (
                        <tr key={bank.id} 
                            className={`hover:bg-gray-50 transition-colors 
                                    ${index !== currentItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                        <td className="px-6 py-4 border-r border-gray-200">
                            <div>
                            <div className="text-sm font-semibold text-gray-900 mb-1">{bank.name}</div>
                            <div className="text-sm text-gray-500 flex items-start">
                                <MapPin className="h-4 w-4 mr-1 mt-1 flex-shrink-0 text-gray-400" />
                                <span className="break-words">{bank.address}</span>
                            </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                            <StatusBadge area={bank.area} />
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                            <div className="text-sm text-gray-900 flex items-center">
                            <Phone className="h-4 w-4 mr-1 text-gray-400" />
                            {bank.contact}
                            </div>
                        </td>
                        <td className="px-6 py-4 border-r border-gray-200">
                            <div className="text-sm text-gray-900 flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {bank.operating_hours}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex space-x-2">
                            <ActionButton
                                onClick={() => {
                                setSelectedBank(bank);
                                setModalMode('edit');
                                setShowModal(true);
                                }}
                                icon={Edit}
                                color="blue"
                                label="Edit"
                            />
                            <ActionButton
                                onClick={() => {
                                setBankToDelete(bank);
                                setShowDeleteModal(true);
                                }}
                                icon={Trash}
                                color="red"
                                label="Delete"
                            />
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}


            {/* Enhanced Pagination */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <div>
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredBanks.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredBanks.length}</span> results
                </p>
                </div>
                <div className="flex space-x-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 
                    hover:bg-gray-50 transition-colors"
                >
                    Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded-lg text-sm transition-colors
                        ${currentPage === i + 1 
                        ? 'bg-red-600 text-white border-red-600' 
                        : 'hover:bg-gray-50'}`}
                    >
                    {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 
                    hover:bg-gray-50 transition-colors"
                >
                    Next
                </button>
                </div>
            </div>
            </div>
        </div>

        {showModal && (
            <BloodBankModal
            onClose={() => {
                setShowModal(false);
                setSelectedBank(null);
            }}
            />
        )}

        {error && (
            <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
            {error}
            </div>
        )}
        
        {showDeleteModal && bankToDelete && (
        <DeleteConfirmationModal
            bank={bankToDelete}
            onConfirm={() => handleDelete(bankToDelete.id)}
            onCancel={() => {
            setShowDeleteModal(false);
            setBankToDelete(null);
            }}
        />
        )}
        </AdminLayout>
    );
};

export default BloodBanksManagement;
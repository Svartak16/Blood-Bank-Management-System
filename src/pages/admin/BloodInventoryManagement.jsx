import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, X, RefreshCw, ChevronDown, AlertTriangle, Droplet, Search, Scale, Calendar } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminDashboardLayout';

const InventoryCard = ({ data, criticalLevel }) => {
  const isCritical = data.units_available <= criticalLevel;
  const lastUpdated = new Date(data.last_updated);
  const timeDiff = Date.now() - lastUpdated.getTime();
  const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));

  const getStockLevel = () => {
    if (data.units_available <= criticalLevel) return 'Critical';
    if (data.units_available <= criticalLevel * 2) return 'Low';
    return 'Normal';
  };

  const getStockStyles = () => {
    const level = getStockLevel();
    return {
      Critical: 'bg-red-50 border-red-200 shadow-red-100',
      Low: 'bg-yellow-50 border-yellow-200 shadow-yellow-100',
      Normal: 'bg-green-50 border-green-200 shadow-green-100'
    }[level];
  };

  return (
    <div className={`p-6 rounded-xl border ${getStockStyles()} 
      transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Droplet className={`h-8 w-8 mr-3 ${
            isCritical ? 'text-red-500' : 'text-red-600'
          }`} />
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{data.blood_type}</h3>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              isCritical 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {getStockLevel()} Stock
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Scale className="h-5 w-5 mr-2" />
          <span className="font-medium">{data.units_available} units available</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="h-4 w-4 mr-2" />
          <span>
            Updated in {hoursAgo < 24 
              ? `${hoursAgo} hours ago` 
              : lastUpdated.toLocaleDateString()}
          </span>
        </div>

        {isCritical && (
          <div className="flex items-center text-red-600 text-sm font-medium mt-2">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Critical Level Alert
          </div>
        )}
      </div>
    </div>
  );
};

const BloodInventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBank, setSelectedBank] = useState('');
  const [bloodBanks, setBloodBanks] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [bloodBankSearchTerm, setBloodBankSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [updateData, setUpdateData] = useState({
    bloodType: '',
    operation: 'add',
    units: 0,
    bankId: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = inventory.filter(item =>
    searchTerm ? item.blood_type === searchTerm : true
  );

  const filteredBloodBanks = bloodBanks.filter(bank => 
    bank.name.toLowerCase().includes(bloodBankSearchTerm.toLowerCase())
  );
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const criticalLevel = 100; // Units below this are considered critical
  

  useEffect(() => {
    fetchBloodBanks();
  }, []);

  useEffect(() => {
    if (selectedBank) {
      fetchInventory(selectedBank);
    }
  }, [selectedBank]);

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
        if (data.data.length > 0) {
          setSelectedBank(data.data[0].id);
        }
      }
    } catch (error) {
      setError('Failed to fetch blood banks');
    }
  };
  
  const fetchInventory = async (bankId) => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/blood-banks/${bankId}/inventory`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setInventory(data.data);
      }
    } catch (error) {
      setError('Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/inventory/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bankId: selectedBank,
          bloodType: updateData.bloodType,
          operation: updateData.operation,
          units: parseInt(updateData.units)
        })
      });

      if (response.ok) {
        fetchInventory(selectedBank);
        setShowUpdateModal(false);
        setUpdateData({ bloodType: '', operation: 'add', units: 0, bankId: '' });
      }
    } catch (error) {
      setError('Failed to update inventory');
    }
  };

  const StockUpdateModal = ({ onClose }) => {
    const [currentUnits, setCurrentUnits] = useState(0);
  
    // Update current units when blood type is selected
    useEffect(() => {
      if (updateData.bloodType) {
        const selectedInventory = inventory.find(item => item.blood_type === updateData.bloodType);
        setCurrentUnits(selectedInventory ? selectedInventory.units_available : 0);
      }
    }, [updateData.bloodType]);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Update Blood Inventory</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
  
          <div className="space-y-6">
            {/* Blood Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Type
              </label>
              <select
                value={updateData.bloodType}
                onChange={(e) => setUpdateData({ ...updateData, bloodType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                <option value="">Select Blood Type</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
  
            {/* Current Stock Info */}
            {updateData.bloodType && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">
                  Current Stock: <span className="font-semibold text-gray-900">{currentUnits} units</span>
                </div>
                {currentUnits <= criticalLevel && (
                  <div className="mt-2 flex items-center text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                    Critical Level
                  </div>
                )}
              </div>
            )}
  
            {/* Operation Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operation
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="add"
                    checked={updateData.operation === 'add'}
                    onChange={(e) => setUpdateData({ ...updateData, operation: e.target.value })}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span>Add Units</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="remove"
                    checked={updateData.operation === 'remove'}
                    onChange={(e) => setUpdateData({ ...updateData, operation: e.target.value })}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span>Remove Units</span>
                </label>
              </div>
            </div>
  
            {/* Units Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Units
              </label>
              <input
                type="number"
                min="1"
                max={updateData.operation === 'remove' ? currentUnits : undefined}
                value={updateData.units}
                onChange={(e) => setUpdateData({ ...updateData, units: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              {updateData.operation === 'remove' && (
                <p className="mt-1 text-sm text-gray-500">
                  Maximum: {currentUnits} units available
                </p>
              )}
            </div>
  
            {/* Preview Changes */}
            {updateData.bloodType && updateData.units > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">
                  After Update: {' '}
                  <span className="font-semibold text-gray-900">
                    {updateData.operation === 'add' 
                      ? currentUnits + parseInt(updateData.units)
                      : currentUnits - parseInt(updateData.units)
                    } units
                  </span>
                </div>
              </div>
            )}
  
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={
                  !updateData.bloodType || 
                  updateData.units <= 0 || 
                  (updateData.operation === 'remove' && updateData.units > currentUnits)
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                  disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Update Inventory
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Enhanced header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Droplet className="h-6 w-6 text-red-600" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">Blood Inventory Management</h1>
            </div>

            <button
              onClick={() => setShowUpdateModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center 
                hover:bg-red-700 transition-colors duration-200 transform hover:scale-105"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Update Stock
            </button>
          </div>
        </div>

        {/* Controls section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Blood Bank Selection */}
          <div className="relative w-72" ref={dropdownRef}>
            <div className="relative">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={bloodBankSearchTerm}
                  onChange={(e) => {
                    setBloodBankSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Search blood bank..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"
                  autoComplete="off"
                />
                {bloodBankSearchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setBloodBankSearchTerm('');
                      setIsDropdownOpen(true);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Selected Blood Bank Display */}
              {selectedBank && !isDropdownOpen && (
                <div className="mt-2">
                  {(() => {
                    const selected = bloodBanks.find(bank => bank.id.toString() === selectedBank.toString());
                    if (selected) {
                      return (
                        <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
                          <p className="font-medium text-gray-900">{selected.name}</p>
                          <p className="text-sm text-gray-500">{selected.area}</p>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}

              {/* Dropdown List */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50">
                  {filteredBloodBanks.length > 0 ? (
                    filteredBloodBanks.map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => {
                          setSelectedBank(bank.id);
                          setBloodBankSearchTerm('');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50"
                      >
                        <p className="font-medium text-gray-900">{bank.name}</p>
                        <p className="text-sm text-gray-500">{bank.area}</p>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No blood banks found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <select
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg 
                appearance-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                transition-all duration-200"
            >
              <option value="">All Blood Types</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchInventory(selectedBank)}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center 
              justify-center text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

        {/* Inventory Grid */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="relative">
                <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200"></div>
                <div className="w-12 h-12 rounded-full animate-spin absolute
                  border-4 border-red-600 border-t-transparent"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredInventory.map(item => (
                <InventoryCard 
                  key={item.blood_type}
                  data={item}
                  criticalLevel={criticalLevel}
                />
              ))}
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stock Update Modal */}
      {showUpdateModal && (
        <StockUpdateModal
          show={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          inventory={inventory}
          bloodTypes={bloodTypes}
          criticalLevel={criticalLevel}
          onUpdate={handleUpdate}
        />
      )}
    </AdminLayout>
  );
};

export default BloodInventoryManagement;
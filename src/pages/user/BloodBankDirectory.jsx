import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Search, ChevronLeft, ChevronRight, Building2, ExternalLink, AlertCircle, Filter } from 'lucide-react';

const BloodBankDirectory = () => {
const [bloodBanks, setBloodBanks] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [searchTerm, setSearchTerm] = useState('');
const [selectedArea, setSelectedArea] = useState('');
const [areas, setAreas] = useState([]);
const [entriesPerPage, setEntriesPerPage] = useState(5);
const [currentPage, setCurrentPage] = useState(1);
const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBloodBanks();
    fetchAreas();
  }, []);

  useEffect(() => {
    // Reset to first page when changing entries per page
    setCurrentPage(1);
  }, [entriesPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchBloodBanks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blood-banks/all');
      const data = await response.json();
      if (data.success) {
        setBloodBanks(data.data);
      } else {
        setError('Failed to fetch blood banks');
      }
    } catch (error) {
      setError('Failed to load blood banks');
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blood-banks/areas');
      const data = await response.json();
      if (data.success) {
        setAreas(data.data);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const filteredBloodBanks = bloodBanks.filter(bank => {
    const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        bank.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        bank.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = !selectedArea || bank.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const totalPages = Math.ceil(filteredBloodBanks.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentEntries = filteredBloodBanks.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-900">Blood Bank Directory</h1>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Find blood banks near you and check real-time blood availability. Our directory includes 
          operating hours, contact information, and current stock levels.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Entries per page */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 transition-shadow"
            >
              {[5, 10, 20].map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, phone or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 transition-shadow"
              />
            </div>
          </div>

          {/* Area Filter */}
          <div className="lg:w-72">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedArea}
                onChange={(e) => {
                  setSelectedArea(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 appearance-none bg-white transition-shadow"
              >
                <option value="">All Districts</option>
                {areas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredBloodBanks.length)} of {filteredBloodBanks.length} blood banks
        </div>
      </div>

      {/* Blood Banks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentEntries.map((bank) => (
          <div 
            key={bank.id} 
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 min-h-[3.5rem]">
                  {bank.name}
                </h3>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(bank.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                </a>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{bank.address}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <a 
                    href={`tel:${bank.contact}`}
                    className="text-gray-600 text-sm hover:text-red-600 transition-colors"
                  >
                    {bank.contact}
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{bank.operating_hours}</span>
                </div>
              </div>

              <button
                onClick={() => window.location.href = `/specifyavailability?bank=${bank.id}`}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors group-hover:shadow-md"
              >
                Check Availability
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBloodBanks.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Blood Banks Found</h3>
          <p className="text-gray-600">
            No blood banks match your search criteria. Try adjusting your filters or search terms.
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredBloodBanks.length > entriesPerPage && (
        <div className="flex justify-between items-center mt-8">
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`min-w-[40px] px-4 py-2 border rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-red-600 text-white border-red-600'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-8 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
    </div>
  );
};

export default BloodBankDirectory;
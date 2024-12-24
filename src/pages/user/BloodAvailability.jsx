import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Droplet, 
  Clock, 
  Phone, 
  Info, 
  ExternalLink, 
  AlertCircle 
} from 'lucide-react';

const BloodSearch = () => {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blood-banks/areas');
      const data = await response.json();
      
      if (data.success) {
        setAreas(data.data);
      } else {
        setError('Failed to fetch areas');
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
      setError('Failed to fetch areas');
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/blood-banks/availability?area=${encodeURIComponent(selectedArea)}${
          selectedBloodType ? `&bloodType=${encodeURIComponent(selectedBloodType)}` : ''
        }`
      );
      
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data);
      } else {
        setError(data.message || 'Failed to fetch results');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUnitStatusColor = (units) => {
    if (units <= 10) return 'bg-red-100 text-red-800 border-red-200';
    if (units <= 30) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Blood Availability Search
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search for blood availability across blood banks in your area. 
            Select a district and optionally specify a blood type to find current stock levels.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 flex items-center gap-2 rounded-r-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select District
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
              >
                <option value="">Select District in Johor Bahru</option>
                {areas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Blood Type (Optional)
            </label>
            <div className="relative">
              <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedBloodType}
                onChange={(e) => setSelectedBloodType(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
              >
                <option value="">All Blood Types</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={!selectedArea || loading}
          className={`w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 ${
            loading || !selectedArea ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Searching...</span>
            </div>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Search Availability
            </>
          )}
        </button>

        {/* Search Results */}
        {searchResults && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Search Results
              </h3>
              {searchResults.length > 0 && (
                <span className="text-sm text-gray-500">
                  Found {searchResults.length} blood bank{searchResults.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-6">
                {searchResults.map((bank) => (
                  <div
                    key={bank.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">
                            {bank.name}
                          </h4>
                          <div className="flex flex-col gap-2 mt-3">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-sm">{bank.address}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-sm">{bank.contact}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-sm">{bank.operatingHours}</span>
                            </div>
                          </div>
                        </div>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(bank.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                        >
                          View on Maps
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>

                      {/* Blood Types */}
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Info className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Current blood type availability:
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {Object.entries(bank.inventory).map(([type, info]) => (
                            <div
                              key={type}
                              className={`p-4 rounded-lg border ${
                                selectedBloodType === type 
                                  ? 'ring-2 ring-red-500 ring-opacity-50' 
                                  : ''
                              } ${getUnitStatusColor(info.unitsAvailable)}`}
                            >
                              <div className="text-lg font-bold mb-1">{type}</div>
                              <div className="text-sm font-medium">
                                {info.unitsAvailable} units
                              </div>
                              <div className="text-xs mt-1 text-gray-600">
                                Updated: {formatDate(info.lastUpdated)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Droplet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No blood banks found in the selected area
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodSearch;
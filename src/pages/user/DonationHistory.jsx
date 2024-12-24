import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Activity, MapPin, BarChart2, User, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import apiClient from '../../api/client';

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [chartData, setChartData] = useState([]);

  const getPaginatedData = (data, page, perPage) => {
    const startIndex = (page - 1) * perPage;
    return data.slice(startIndex, startIndex + perPage);
  };

  useEffect(() => {
    fetchDonationHistory();
  }, []);

  useEffect(() => {
    if (donations.length > 0) {
      processChartData();
    }
  }, [donations]);

  const processChartData = () => {
    const monthlyData = donations.reduce((acc, donation) => {
      const month = new Date(donation.donation_date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(monthlyData).map(([month, count]) => ({
      month,
      donations: count
    }));

    setChartData(chartData);
  };

  const fetchDonationHistory = async () => {
    try {
      const response = await apiClient.get('/user/donations');
      
      if (response.data.success) {
        const sortedDonations = response.data.data.sort((a, b) => 
          new Date(b.donation_date) - new Date(a.donation_date)
        );
        setDonations(sortedDonations);
      } else {
        setError('Failed to fetch donation history');
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      setError('Failed to load donation history');
    } finally {
      setLoading(false);
    }
  };

  const totalDonations = donations.length;
  const totalVolume = donations.reduce((sum, donation) => sum + donation.quantity_ml, 0);
  const completedDonations = donations.filter(d => d.status === 'Completed').length;

  const stats = [
    {
      icon: <Activity className="h-12 w-12 p-2.5 bg-red-100 rounded-full text-red-600" />,
      label: 'Total Donations',
      value: totalDonations,
      description: 'All-time donation count'
    },
    {
      icon: <TrendingUp className="h-12 w-12 p-2.5 bg-green-100 rounded-full text-green-600" />,
      label: 'Volume Donated',
      value: `${totalVolume} ml`,
      description: 'Total blood volume donated'
    },
    {
      icon: <BarChart2 className="h-12 w-12 p-2.5 bg-blue-100 rounded-full text-blue-600" />,
      label: 'Success Rate',
      value: `${totalDonations ? Math.round((completedDonations / totalDonations) * 100) : 0}%`,
      description: 'Completed donations ratio'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
              <div className="flex items-start space-x-4">
                {stat.icon}
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-900">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Donation History List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Donation Records</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
          </div>

          {error ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <Activity className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : donations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No donation records found</p>
              <p className="text-sm text-gray-500 mt-2">Start your donation journey today!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getPaginatedData(donations, currentPage, entriesPerPage).map((donation) => (
                <div key={donation.id} className="p-6 transition-colors hover:bg-gray-50 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-semibold text-gray-900">
                          Donation #{donation.id}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                          ${donation.status === 'Completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'}`
                        }>
                          {donation.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="h-5 w-5" />
                          <span>{new Date(donation.donation_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="h-5 w-5" />
                          <span>{donation.quantity_ml} ml</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Activity className="h-5 w-5" />
                          <span>{donation.blood_type}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="h-5 w-5" />
                          <span>{donation.blood_bank_name}</span>
                        </div>
                      </div>

                      {donation.health_screening_notes && (
                        <div className="text-sm bg-gray-50 p-3 rounded-md">
                          <span className="font-medium text-gray-700">Notes: </span>
                          <span className="text-gray-600">{donation.health_screening_notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="px-6 py-4 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * entriesPerPage) + 1} to {Math.min(currentPage * entriesPerPage, donations.length)} of {donations.length} entries
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.ceil(donations.length / entriesPerPage) }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`px-4 py-2 text-sm border rounded-md transition-colors
                          ${currentPage === idx + 1 
                            ? 'bg-red-600 text-white border-red-600' 
                            : 'hover:bg-white'}`
                        }
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(donations.length / entriesPerPage)))}
                      disabled={currentPage === Math.ceil(donations.length / entriesPerPage)}
                      className="px-4 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DonationHistory;
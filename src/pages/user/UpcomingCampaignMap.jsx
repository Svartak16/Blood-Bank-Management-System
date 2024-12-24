import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Clock, Building, Navigation, Calendar, Users, ChevronRight, AlertCircle } from 'lucide-react';
import L from 'leaflet';
import { useAuth } from '../../context/AuthContext';
import CampaignReservationModal from '../../components/modules/campaign/CampaignReservation';
import 'leaflet/dist/leaflet.css';

// Custom marker icons configuration
const createCustomIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const userIcon = createCustomIcon('red');
const campaignIcon = createCustomIcon('blue');

function MapFocus({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 2 });
  }, [position, map]);
  return null;
}

const CampaignMap = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([3.1390, 101.6869]);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    initializeLocation();
    fetchCampaigns();
  }, []);

  const initializeLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error("Location error:", error);
          setError("Unable to get your location. Using default location.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/campaigns/upcoming');
      const data = await response.json();
      if (data.success) {
        setCampaigns(data.data.filter(c => c.latitude && c.longitude));
      } else {
        throw new Error(data.message || 'Failed to fetch campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to load campaigns. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleReservationClick = (campaign) => {
    setSelectedCampaign(campaign);
    setIsReservationModalOpen(true);
  };

  const CampaignSessionCard = ({ session }) => (
    <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
      <div className="flex items-center">
        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
        <span className="text-sm">{session.date}</span>
      </div>
      <span className="text-sm font-medium text-gray-700">{session.time}</span>
    </div>
  );

  const CampaignCard = ({ campaign, isSelected, onSelect }) => {
    const sessionCount = campaign.sessions?.length || 0;
    
    return (
      <div
        className={`p-4 rounded-lg transition-all duration-300 cursor-pointer ${
          isSelected 
            ? 'bg-red-50 border-2 border-red-500 shadow-lg' 
            : 'bg-white border border-gray-200 hover:border-red-300 hover:shadow'
        }`}
        onClick={() => onSelect(campaign)}
      >
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">{campaign.location}</h3>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              {sessionCount} {sessionCount === 1 ? 'Session' : 'Sessions'}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Building className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium">{campaign.organizer}</span>
          </div>

          <div className="flex items-start text-gray-600">
            <MapPin className="w-4 h-4 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm">{campaign.address}</span>
          </div>

          {campaign.sessions?.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium text-gray-700">Next Available Sessions:</div>
              <div className="space-y-2">
                {campaign.sessions.slice(0, 3).map((session, idx) => (
                  <CampaignSessionCard key={idx} session={session} />
                ))}
                {campaign.sessions.length > 3 && (
                  <div className="text-sm text-gray-500 text-center">
                    +{campaign.sessions.length - 3} more sessions
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReservationClick(campaign);
            }}
            className="mt-4 w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Make Reservation</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Set explicit z-index for modals */}
      {isReservationModalOpen && selectedCampaign && (
        <div className="fixed inset-0" style={{ zIndex: 9999 }}>
          <CampaignReservationModal
            campaign={selectedCampaign}
            isOpen={isReservationModalOpen}
            onClose={() => {
              setIsReservationModalOpen(false);
              setSelectedDate(null);
            }}
          />
        </div>
      )}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Campaign Locations</h2>
            <button
              onClick={initializeLocation}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Navigation className="w-4 h-4 mr-2" />
              <span>Update Location</span>
            </button>
          </div>

          <div className="h-[calc(100vh-200px)]">
            <MapContainer
              center={mapCenter}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {userLocation && (
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>Your Location</Popup>
                </Marker>
              )}
              {campaigns.map((campaign) => (
                <Marker
                  key={campaign.id}
                  position={[campaign.latitude, campaign.longitude]}
                  icon={campaignIcon}
                  eventHandlers={{
                    click: () => setSelectedCampaign(campaign),
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-semibold text-gray-900">{campaign.location}</h3>
                      <p className="text-sm text-gray-600 mt-1">{campaign.address}</p>
                      {campaign.sessions?.[0] && (
                        <div className="mt-2 text-sm border-t pt-2">
                          <p className="font-medium text-gray-700">Next session:</p>
                          <p>{campaign.sessions[0].date}</p>
                          <p>{campaign.sessions[0].time}</p>
                        </div>
                      )}
                      <button
                        onClick={() => handleReservationClick(campaign)}
                        className="mt-2 w-full px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Make Reservation
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <MapFocus position={selectedCampaign ? [selectedCampaign.latitude, selectedCampaign.longitude] : null} />
            </MapContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Campaigns</h2>
              <div className="text-sm text-gray-600">
                <p>Total: {campaigns.length} campaigns</p>
              </div>
            </div>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100vh-200px)] space-y-4">
            {campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Active Campaigns
                </h3>
                <p className="text-gray-600">
                  There are currently no blood donation campaigns scheduled in your area.
                </p>
              </div>
            ) : (
              campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  isSelected={selectedCampaign?.id === campaign.id}
                  onSelect={setSelectedCampaign}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignMap;
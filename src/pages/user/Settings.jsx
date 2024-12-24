// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  MapPin, Phone, User, Lock, Save, AlertCircle, 
  Calendar, Info, Droplet, Bell, Settings as SettingsIcon,
  Check, X, ChevronRight
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import apiClient from '../../api/client';

const InputGroup = ({ label, icon: Icon, type = "text", name, value, onChange, className = "", required = false, ...props }) => (
  <div className="space-y-1.5">
    <label className="flex items-center text-sm font-medium text-gray-700">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
    <div className="relative rounded-lg shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-3 py-2 text-base border border-gray-300 
          rounded-lg transition duration-150 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 
          hover:border-gray-400 
          ${className}`}
        {...props}
      />
    </div>
  </div>
);

const SelectGroup = ({ label, icon: Icon, name, value, onChange, options, className = "", required = false }) => (
  <div className="space-y-1.5">
    <label className="flex items-center text-sm font-medium text-gray-700">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
    <div className="relative rounded-lg shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-10 py-2 text-base border border-gray-300 
          rounded-lg transition duration-150 ease-in-out appearance-none bg-white
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 
          hover:border-gray-400
          ${className}`}
      >
        {options}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronRight className="h-5 w-5 text-gray-400 transform rotate-90" />
      </div>
    </div>
  </div>
);
const MessageAlert = ({ message, type = 'error' }) => {
  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-800',
      icon: <Check className="h-5 w-5 text-green-500" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      text: 'text-red-800',
      icon: <AlertCircle className="h-5 w-5 text-red-500" />
    }
  };

  const style = styles[type];

  return (
    <div className={`flex items-center p-4 rounded-lg ${style.bg} ${style.border}`}>
      <div className="flex-shrink-0">
        {style.icon}
      </div>
      <div className={`ml-3 ${style.text}`}>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 
      ${active 
        ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' 
        : 'text-gray-600 hover:bg-gray-50'}`}
  >
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const SettingsCard = ({ title, description, children, message, messageType }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
    
    {message && (
      <MessageAlert message={message} type={messageType} />
    )}

    <div className="p-6">{children}</div>
  </div>
);

const NotificationPreferenceCard = ({ title, description, checked, onChange }) => (
  <div className={`relative flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer
    ${checked 
      ? 'border-red-500 bg-red-50' 
      : 'border-gray-200 hover:border-gray-300'}`}
  >
    <div className="min-w-0 flex-1">
      <div className="text-sm font-medium text-gray-900">{title}</div>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
    <div className="ml-3 flex items-center">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
      />
    </div>
  </div>
);


const Settings = () => {
const { user, updateUserProfile  } = useAuth();
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState('');
const [error, setError] = useState('');
const [activeTab, setActiveTab] = useState('profile');
const [notificationPreferences, setNotificationPreferences] = useState({
  receiveAll: true,
  receiveAreaOnly: false,
  receiveNone: false
});
const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
const JOHOR_AREAS = [
  "Johor Bahru", "Muar", "Batu Pahat", "Kluang", "Pontian", 
  "Segamat", "Kota Tinggi", "Mersing", "Kulai", "Tangkak"
];

const TabGroup = () => (
  <div className="mb-6 border-b border-gray-200">
    <nav className="flex space-x-8">
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex items-center pb-4 px-1 ${
          activeTab === 'profile'
            ? 'border-b-2 border-red-500 text-red-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <SettingsIcon className="h-5 w-5 mr-2" />
        Profile Settings
      </button>
      <button
        onClick={() => setActiveTab('notifications')}
        className={`flex items-center pb-4 px-1 ${
          activeTab === 'notifications'
            ? 'border-b-2 border-red-500 text-red-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Bell className="h-5 w-5 mr-2" />
        Notification Settings
      </button>
    </nav>
  </div>
);

const handlePreferenceChange = async (preference) => {
  try {
    const response = await apiClient.put('/user/notification-preferences', {
      preference
    });

    if (response.data.success) {
      setNotificationPreferences(prev => {
        const newPrefs = {
          receiveAll: false,
          receiveAreaOnly: false,
          receiveNone: false
        };
        newPrefs[preference] = true;
        return newPrefs;
      });
      setProfileMessage({
        text: 'Notification preferences updated successfully',
        type: 'success'
      });
    }
  } catch (error) {
    setProfileMessage({
      text: 'Failed to update notification preferences',
      type: 'error'
    });
  }

  return (
    <SettingsCard
      title="Notification Preferences"
      description="Manage how you receive notifications"
      message={profileMessage.text}
      messageType={profileMessage.type}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="receiveAll"
            name="notificationPreference"
            checked={notificationPreferences.receiveAll}
            onChange={() => handlePreferenceChange('receiveAll')}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
          />
          <label htmlFor="receiveAll" className="text-gray-700">
            Receive all notifications
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="receiveAreaOnly"
            name="notificationPreference"
            checked={notificationPreferences.receiveAreaOnly}
            onChange={() => handlePreferenceChange('receiveAreaOnly')}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
          />
          <label htmlFor="receiveAreaOnly" className="text-gray-700">
            Receive notifications only from my area ({formData.area})
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="receiveNone"
            name="notificationPreference"
            checked={notificationPreferences.receiveNone}
            onChange={() => handlePreferenceChange('receiveNone')}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
          />
          <label htmlFor="receiveNone" className="text-gray-700">
            Don't receive notifications
          </label>
        </div>
      </div>
    </SettingsCard>
  );
};

const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    bloodType: '',
    dateOfBirth: '',
    gender: '',
    area: ''
});

const formatDateForSubmission = (date) => {
  if (!date) return null;
  
  // Handle if date is already in correct format
  if (date.includes('T')) {
    return date.split('T')[0];
  }
  
  try {
    // Create a new Date object and format it as YYYY-MM-DD
    const d = new Date(date);
    if (isNaN(d.getTime())) return null; // Return null if invalid date
    
    return d.toISOString().split('T')[0];
  } catch (error) {
    console.error('Date formatting error:', error);
    return null;
  }
};

useEffect(() => {
  const fetchLatestUserData = async () => {
    try {
      const response = await apiClient.get('/user/profile');
      
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          name: response.data.data.name || '',
          phone: response.data.data.phone || '',
          bloodType: response.data.data.blood_type || '',
          dateOfBirth: response.data.data.date_of_birth ? response.data.data.date_of_birth.split('T')[0] : '',
          gender: response.data.data.gender || '',
          area: response.data.data.area || '' // Add this
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError('Failed to load user data');
      }
    }
  };

  fetchLatestUserData();
}, [user]);

const handleChange = (e) => {
    const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
    }));
    // Clear messages when user starts typing
    setError('');
    setSuccess('');
};

const handleProfileUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);
  setProfileMessage({ text: '', type: '' });

  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await apiClient.put('/user/profile', {
      name: formData.name,
      phone: formData.phone,
      bloodType: formData.bloodType,
      dateOfBirth: formatDateForSubmission(formData.dateOfBirth),
      gender: formData.gender,
      area: formData.area 
    });

    if (response.data.success) {
      updateUserProfile({
        name: formData.name,
        phone: formData.phone,
        bloodType: formData.bloodType,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender
      });
      setProfileMessage({ text: 'Profile updated successfully', type: 'success' });
    } else {
      setProfileMessage({ 
        text: response.data.message || 'Failed to update profile', 
        type: 'error' 
      });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.response?.status === 401) {
      setProfileMessage({ 
        text: 'Session expired. Please login again.', 
        type: 'error' 
      });
    } else {
      setProfileMessage({ 
        text: 'An error occurred while updating profile', 
        type: 'error' 
      });
    }
  } finally {
    setLoading(false);
  }
};

const handlePasswordChange = async (e) => {
  e.preventDefault();
  setLoading(true);
  setPasswordMessage({ text: '', type: '' });

  // Client-side validation
  if (formData.newPassword !== formData.confirmPassword) {
    setPasswordMessage({ text: 'Passwords do not match', type: 'error' });
    setLoading(false);
    return;
  }

  // Password strength validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;
  if (!passwordRegex.test(formData.newPassword)) {
    setPasswordMessage({ 
      text: 'Password must be 8-20 characters and include lowercase, uppercase, and numbers', 
      type: 'error' 
    });
    setLoading(false);
    return;
  }

  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await apiClient.put('/user/change-password', {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });

    if (response.data.success) {
      setPasswordMessage({ text: 'Password updated successfully', type: 'success' });
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } else {
      setPasswordMessage({ 
        text: response.data.message || 'Failed to update password', 
        type: 'error' 
      });
    }
  } catch (error) {
    console.error('Password update error:', error);
    if (error.response?.status === 401) {
      setPasswordMessage({ 
        text: 'Session expired. Please login again.', 
        type: 'error' 
      });
    } else if (error.response?.status === 400) {
      setPasswordMessage({ 
        text: error.response.data.message || 'Current password is incorrect', 
        type: 'error' 
      });
    } else {
      setPasswordMessage({ 
        text: 'An error occurred while updating password', 
        type: 'error' 
      });
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account settings and preferences
              </p>
            </div>
            <div className="flex space-x-4">
              <TabButton
                active={activeTab === 'profile'}
                icon={SettingsIcon}
                label="Profile"
                onClick={() => setActiveTab('profile')}
              />
              <TabButton
                active={activeTab === 'notifications'}
                icon={Bell}
                label="Notifications"
                onClick={() => setActiveTab('notifications')}
              />
            </div>
          </div>
        </div>

        {activeTab === 'profile' ? (
          <>
            {/* Profile Settings Card */}
            <SettingsCard
              title="Personal Information"
              description="Update your personal details and contact information"
              message={profileMessage.text}
              messageType={profileMessage.type}
            >
              <form onSubmit={handleProfileUpdate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup
                    label="Full Name"
                    icon={User}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />

                  <InputGroup
                    label="Phone Number"
                    icon={Phone}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />

                  <SelectGroup
                    label="Blood Type"
                    icon={Droplet}
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    required
                    options={
                      <>
                        <option value="">Select Blood Type</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </>
                    }
                  />

                  <SelectGroup
                    label="Gender"
                    icon={Info}
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    options={
                      <>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </>
                    }
                  />

                  <InputGroup
                    label="Date of Birth"
                    icon={Calendar}
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />

                  <SelectGroup
                    label="Area"
                    icon={MapPin}
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    options={
                      <>
                        <option value="">Select Area</option>
                        {JOHOR_AREAS.map(area => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </>
                    }
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-2.5 bg-red-600 text-white rounded-lg
                      hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors shadow-sm font-medium"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </SettingsCard>

            {/* Password Change Card */}
            <SettingsCard
              title="Security Settings"
              description="Update your password to keep your account secure"
              message={passwordMessage.text}
              messageType={passwordMessage.type}
            >
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <InputGroup
                  label="Current Password"
                  icon={Lock}
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  required
                />

                <InputGroup
                  label="New Password"
                  icon={Lock}
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="8-20 characters, include numbers, uppercase and lowercase"
                  required
                />

                <InputGroup
                  label="Confirm New Password"
                  icon={Lock}
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your new password"
                  required
                />

                <div className="flex items-center justify-between pt-4">
                  <Link 
                    to="/reset-password"
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Forgot your password?
                  </Link>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-2.5 bg-red-600 text-white rounded-lg
                      hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors shadow-sm font-medium"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </SettingsCard>
          </>
        ) : (
          <SettingsCard
            title="Notification Preferences"
            description="Choose how you want to receive updates and alerts"
            message={profileMessage.text}
            messageType={profileMessage.type}
          >
            <div className="space-y-4">
              <NotificationPreferenceCard
                title="All Notifications"
                description="Receive updates about donations, campaigns, and blood availability from all areas"
                checked={notificationPreferences.receiveAll}
                onChange={() => handlePreferenceChange('receiveAll')}
              />
  
              <NotificationPreferenceCard
                title="Area-Specific Notifications"
                description={`Only receive notifications about events and campaigns in ${formData.area || 'your area'}`}
                checked={notificationPreferences.receiveAreaOnly}
                onChange={() => handlePreferenceChange('receiveAreaOnly')}
              />
  
              <NotificationPreferenceCard
                title="Disable All Notifications"
                description="Turn off all notifications from LifeLink Blood Bank"
                checked={notificationPreferences.receiveNone}
                onChange={() => handlePreferenceChange('receiveNone')}
              />
            </div>
          </SettingsCard>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
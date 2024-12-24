import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Database,
  Building2,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Droplet,
  ClipboardList,
  ChevronDown,
  ShieldCheck,
  UserCircle
} from 'lucide-react';

const SidebarLink = ({ icon: Icon, title, path, isActive }) => (
  <Link
    to={path}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
      ${isActive 
        ? 'bg-red-50 text-red-600 shadow-sm' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
  >
    <div className={`p-1.5 rounded-md transition-colors duration-200
      ${isActive ? 'bg-red-100' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="font-medium">{title}</span>
    {isActive && (
      <div className="w-1.5 h-1.5 rounded-full bg-red-500 ml-auto" />
    )}
  </Link>
);

const AdminDashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [permissions, setPermissions] = useState(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add('admin-layout');
    return () => {
      document.body.classList.remove('admin-layout');
    };
  }, []);

  // Fetch permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/users/permissions', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setPermissions(data.permissions);
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
  }, []);

  const getNavigationItems = () => {
    const baseItems = [
      { title: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' }
    ];
  
    const permissionBasedItems = [
      {
        title: 'Users',
        icon: Users,
        path: '/admin/users',
        requiredPermission: 'can_manage_users',
        superAdminOnly: true
      },
      {
        title: 'Blood Inventory',
        icon: Database,
        path: '/admin/inventory',
        requiredPermission: 'can_manage_inventory'
      },
      {
        title: 'Blood Banks',
        icon: Building2,
        path: '/admin/blood-banks',
        requiredPermission: 'can_manage_blood_banks'
      },
      {
        title: 'Campaign',
        icon: Calendar,
        path: '/admin/campaigns',
        requiredPermission: 'can_manage_campaigns'
      },
      {
        title: 'Donations',
        icon: Droplet,
        path: '/admin/donations',
        requiredPermission: 'can_manage_donations'
      },
      {
        title: 'Appointments',
        icon: ClipboardList,
        path: '/admin/appointments',
        requiredPermission: 'can_manage_appointments'
      }
    ];
  
    const filteredItems = permissionBasedItems.filter(item => {
      if (!permissions) return false;
      if (user?.role === 'superadmin') return true;
      if (item.superAdminOnly && user?.role !== 'superadmin') return false;
      return permissions[item.requiredPermission];
    });
  
    const commonItems = [
      { title: 'Notifications', icon: Bell, path: '/admin/notifications' }
    ];
  
    const superAdminItems = user?.role === 'superadmin' ? [
      { title: 'Settings', icon: Settings, path: '/admin/settings' }
    ] : [];
  
    return [...baseItems, ...filteredItems, ...commonItems, ...superAdminItems];
  };  

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!permissions) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-16 h-16 relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-16 w-16 border-t-4 border-red-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">LifeLink</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="h-[calc(100vh-4rem)] flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <nav className="space-y-2">
              {getNavigationItems().map((item) => (
                <SidebarLink
                  key={item.path}
                  icon={item.icon}
                  title={item.title}
                  path={item.path}
                  isActive={location.pathname === item.path}
                />
              ))}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 bg-white border-b z-30">
          <div className="h-16 px-4 flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Role Badge */}
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                user?.role === 'superadmin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
              </span>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-700">{user?.name}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 mt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 text-center text-sm text-gray-500 border-t bg-white">
          © {new Date().getFullYear()} LifeLink Blood Bank. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
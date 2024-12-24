import React from 'react';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Calendar,
  Ban,
  Settings
} from 'lucide-react';

const NotificationDisplay = ({ notification }) => {
  const getNotificationIcon = () => {
    switch (notification.type.toLowerCase()) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />;
      default:  
        return <Bell className="h-5 w-5 text-gray-500 flex-shrink-0" />;
    }
  };

  const getNotificationBackground = () => {
    if (!notification.is_read) {
      switch (notification.type.toLowerCase()) {
        case 'success':
          return 'bg-green-50';
        case 'alert':
          return 'bg-red-50';
        case 'info':
          return 'bg-blue-50';
        default:
          return 'bg-gray-50';
      }
    }
    return 'bg-white';
  };

  const getNotificationBorder = () => {
    if (!notification.is_read) {
      switch (notification.type.toLowerCase()) {
        case 'success':
          return 'border-l-4 border-green-500';
        case 'alert':
          return 'border-l-4 border-red-500';
        case 'info':
          return 'border-l-4 border-blue-500';
        default:
          return 'border-l-4 border-gray-500';
      }
    }
    return '';
  };

  return (
    <div className={`rounded-lg shadow p-4 ${getNotificationBackground()} ${getNotificationBorder()} transition-all duration-200 hover:shadow-md`}>
      <div className="flex gap-3">
        {getNotificationIcon()}
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{notification.title}</h4>
          <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(notification.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationDisplay;
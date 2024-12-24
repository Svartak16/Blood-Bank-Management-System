import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldX, 
  ArrowLeft,
  Settings,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';

const AccessDenied = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col justify-center items-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-red-50 p-6 flex flex-col items-center border-b border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ShieldX className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium mb-1">Permission Required</p>
                <p className="text-red-600 text-sm">
                  You don't have the necessary permissions to access this section.
                  {user?.role === 'admin' && " Please contact your administrator for access."}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-6">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <HelpCircle className="w-4 h-4" />
              Need help?
            </button>

            {showHelp && (
              <div className="mt-3 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
                <p className="font-medium mb-2">What can I do?</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Go back to the previous page</li>
                  <li>Contact your administrator for access</li>
                  <li>Return to the dashboard</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Eye, 
  Share2, 
  Lock, 
  Bell, 
  Phone,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle
} from 'lucide-react';

const PolicySection = ({ icon: Icon, title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <Icon className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      <div className={`px-6 pb-6 transition-all duration-200 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pl-10">
          {children}
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, children, type = 'info' }) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    success: 'bg-green-50 border-green-200 text-green-700'
  };

  return (
    <div className={`p-4 rounded-lg border ${styles[type]} mb-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-5 h-5" />
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="ml-7">
        {children}
      </div>
    </div>
  );
};

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: November 6, 2024</p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
            <Lock className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-600">
              Your privacy is our top priority
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <PolicySection icon={Shield} title="Introduction" defaultOpen={true}>
            <div className="prose prose-red max-w-none text-gray-600">
              <p className="leading-relaxed">
                At LifeLink Blood Bank, we take your privacy seriously. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you use our services.
              </p>
              <InfoCard title="Important Notice">
                Please read this policy carefully to understand how we handle your personal information.
              </InfoCard>
            </div>
          </PolicySection>

          <PolicySection icon={FileText} title="Information We Collect">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Personal Information</h3>
                  <ul className="space-y-2 text-gray-600">
                    {[
                      'Name and contact details',
                      'Date of birth',
                      'Government ID details',
                      'Medical history',
                      'Blood type',
                      'Previous donations'
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Technical Information</h3>
                  <ul className="space-y-2 text-gray-600">
                    {[
                      'Device information',
                      'Browser details',
                      'IP address',
                      'Location data',
                      'Usage statistics',
                      'Preferences'
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </PolicySection>

          <PolicySection icon={Eye} title="How We Use Your Information">
            <div className="space-y-4">
              <div className="grid gap-4">
                {[
                  {
                    title: 'Donation Management',
                    description: 'Process and manage blood donations efficiently',
                    icon: <FileText className="w-5 h-5 text-purple-500" />
                  },
                  {
                    title: 'Communication',
                    description: 'Send appointment reminders and campaign updates',
                    icon: <Bell className="w-5 h-5 text-blue-500" />
                  },
                  {
                    title: 'Safety',
                    description: 'Ensure blood safety and maintain traceability',
                    icon: <Shield className="w-5 h-5 text-green-500" />
                  },
                  {
                    title: 'Service Improvement',
                    description: 'Enhance our services based on user feedback',
                    icon: <Eye className="w-5 h-5 text-yellow-500" />
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    {item.icon}
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PolicySection>

          <PolicySection icon={Share2} title="Information Sharing">
            <div className="space-y-4">
              <InfoCard title="Important Notice" type="warning">
                We never sell or rent your personal information to third parties.
              </InfoCard>
              <div className="grid gap-4">
                {[
                  'Healthcare providers and hospitals',
                  'Blood banks and medical facilities',
                  'Regulatory authorities when required',
                  'Service providers who assist our operations'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Share2 className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </PolicySection>

          <PolicySection icon={Lock} title="Data Security">
            <div className="space-y-4">
              <div className="grid gap-4">
                {[
                  {
                    title: 'Encryption',
                    description: 'All sensitive data is encrypted during transmission and storage'
                  },
                  {
                    title: 'Secure Infrastructure',
                    description: 'We use secure servers and maintain strict database security'
                  },
                  {
                    title: 'Regular Audits',
                    description: 'We conduct regular security audits and assessments'
                  },
                  {
                    title: 'Access Control',
                    description: 'Strict access controls and monitoring of data access'
                  }
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </PolicySection>

          <PolicySection icon={Bell} title="Your Rights">
            <div className="space-y-4">
              <div className="grid gap-4">
                {[
                  {
                    right: 'Access Your Data',
                    description: 'Request a copy of your personal information'
                  },
                  {
                    right: 'Data Correction',
                    description: 'Request corrections to inaccurate information'
                  },
                  {
                    right: 'Withdraw Consent',
                    description: 'Opt-out of non-essential communications'
                  },
                  {
                    right: 'File Complaints',
                    description: 'Raise concerns about data handling'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.right}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PolicySection>

          <PolicySection icon={Phone} title="Contact Us">
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                For privacy-related inquiries or concerns, please contact us:
              </p>
              <div className="grid gap-4">
                {[
                  {
                    label: 'Email',
                    value: 'intech@lifelinkbloodbank.com',
                    bg: 'bg-blue-50'
                  },
                  {
                    label: 'Phone',
                    value: '07-123 4567',
                    bg: 'bg-green-50'
                  },
                  {
                    label: 'Address',
                    value: '12, 11/5 Jalan Johor, 79100 Johor Bahru, Johor, Malaysia',
                    bg: 'bg-purple-50'
                  }
                ].map((contact, index) => (
                  <div key={index} className={`p-4 rounded-lg ${contact.bg}`}>
                    <p className="font-medium mb-1">{contact.label}</p>
                    <p className="text-gray-600">{contact.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </PolicySection>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© 2024 LifeLink Blood Bank. All rights reserved.</p>
          <p className="mt-2">
            This privacy policy is effective as of November 6, 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
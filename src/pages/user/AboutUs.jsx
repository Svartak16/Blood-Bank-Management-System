import React from 'react';
import { 
  Heart, Users, MapPin, Phone, Clock, Mail, Globe,
  Activity, Shield, Award, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-6 py-24 text-center">
          <div className="animate-fade-in">
            <div className="bg-red-500 bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-10 h-10 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to LifeLink Blood Bank</h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              Connecting donors to save lives across Johor
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors">
                <Link to='/register'>
                Become a Donor
                </Link>
              </button>
              <button className="bg-red-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-400 transition-colors">
                <Link to ='/'>
                Learn More
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To ensure a safe and adequate blood supply for the community while providing excellent service to donors,
              patients, and healthcare partners through continuous dedication and improvement.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To be the leading blood bank service in Johor, recognized for excellence in blood collection,
              testing, and distribution while maintaining the highest standards of safety and quality.
            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Heart,
                title: "Blood Collection",
                description: "Safe and efficient blood collection from voluntary donors across multiple locations."
              },
              {
                icon: Users,
                title: "Donor Management",
                description: "Comprehensive donor registration and management system to ensure smooth donation process."
              },
              {
                icon: Globe,
                title: "Distribution Network",
                description: "Efficient distribution of blood units to hospitals and healthcare facilities."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-red-50 p-6 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6
                  group-hover:bg-red-100 transition-colors">
                  <feature.icon className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Contact Us</h2>
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Main Office</h3>
              <div className="space-y-6">
                <div className="flex items-start group">
                  <MapPin className="w-5 h-5 text-red-600 mt-1 mr-4 group-hover:text-red-500" />
                  <p className="text-gray-600 leading-relaxed">
                    12, 11/5 Jalan Johor,<br />
                    79100 Johor Bahru,<br />
                    Johor, Malaysia
                  </p>
                </div>
                {[
                  { icon: Phone, text: "+60 7-123 4567" },
                  { icon: Mail, text: "intech@lifelinkbloodbank.com" },
                  { icon: Clock, text: "Monday - Sunday: 8:00 AM - 6:00 PM" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center group">
                    <item.icon className="w-5 h-5 text-red-600 mr-4 group-hover:text-red-500" />
                    <p className="text-gray-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Emergency Contact</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                For emergencies and urgent blood requirements, please contact our 24/7 hotline:
              </p>
              <div className="bg-red-50 p-6 rounded-xl hover:bg-red-100 transition-colors">
                <p className="text-red-600 font-semibold mb-2">Emergency Hotline:</p>
                <div className="flex items-center space-x-2">
                  <Phone className="w-6 h-6 text-red-600" />
                  <p className="text-red-600 text-2xl font-bold">07-987 6543</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
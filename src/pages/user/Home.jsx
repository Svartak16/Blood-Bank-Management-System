// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BloodTypeSelector from '../../components/modules/blood-donation/bloodTypeSelector.jsx';
import DonationSteps from '../../components/modules/blood-donation/donationSteps.jsx';
import DonationTypes from '../../components/modules/blood-donation/donationTypes.jsx';
import { 
  ChevronRight, 
  Search, 
  Building, 
  Users, 
  Activity, 
  Clock, 
  FileText, 
  Droplet,
  HeartPulse,
  MapPin
} from 'lucide-react';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoaded(true);
  }, []);

  const services = [
    { 
      icon: <Search className="w-8 h-8 text-red-600 group-hover:scale-110 transition-transform" />, 
      title: "Blood Availability Search",
      description: "Check real-time blood availability",
      path: "/bloodavailability" 
    },
    { 
      icon: <Building className="w-8 h-8 text-red-600 group-hover:scale-110 transition-transform" />, 
      title: "Blood Bank Directory",
      description: "Find blood banks near you",
      path: "/directory" 
    },
    { 
      icon: <Users className="w-8 h-8 text-red-600 group-hover:scale-110 transition-transform" />, 
      title: "Donation Campaigns",
      description: "Join upcoming campaigns",
      path: "/campaigns" 
    },
    { 
      icon: <HeartPulse className="w-8 h-8 text-red-600 group-hover:scale-110 transition-transform" />, 
      title: "Donor Portal",
      description: "Access your donor account",
      path: "/login" 
    },
    { 
      icon: <Activity className="w-8 h-8 text-red-600 group-hover:scale-110 transition-transform" />, 
      title: "Blood Bank Dashboard",
      description: "View donation statistics",
      path: "/dashboard" 
    }
  ];
  
  const getRandomPosition = (i) => {
    const positions = [
      'top-1/4 left-1/4',
      'top-3/4 left-1/3',
      'top-1/2 left-2/3',
      'top-1/3 right-1/4',
      'top-2/3 right-1/3'
    ];
    return positions[i % positions.length];
  };


  return (
    <div className={`flex-1 flex flex-col w-full transition-opacity duration-1000 ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden min-h-[600px]">
        <div className="absolute inset-0 bg-gradient-animate"></div>
        
        {/* Background Droplets */}
        <div className="absolute -right-20 -top-20">
          <Droplet className="w-96 h-96 text-red-600 opacity-10 animate-float-rotate" />
        </div>
        <div className="absolute left-20 bottom-20">
          <Droplet className="w-64 h-64 text-red-600 opacity-10 animate-float-rotate-reverse" />
        </div>
        
        {/* Floating droplets */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`absolute ${getRandomPosition(i)} animate-float-random opacity-20`}>
            <Droplet className="w-8 h-8 text-red-400" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight animate-reveal-text">
              Every Drop Counts, <br />
              <span className="text-red-600 inline-block animate-glow">Save Lives</span> Today
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed animate-fade-in-up delay-200">
              Join our mission to help those in need. Your blood donation can save up to three lives.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
              <Link 
                to="/register" 
                className="group inline-flex items-center px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 
                         transition-all transform hover:scale-105 shadow-md hover:shadow-xl animate-pulse-subtle"
              >
                <span>Become a Donor</span>
                <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                to="/bloodavailability" 
                className="group inline-flex items-center px-8 py-4 bg-white text-red-600 rounded-lg hover:bg-red-50 
                         transition-all transform hover:scale-105 shadow-md hover:shadow-xl"
              >
                <span>Check Availability</span>
                <Search className="ml-2 w-5 h-5 transition-transform group-hover:scale-110" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-reveal-text">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
              Discover how we make blood donation accessible and efficient
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {services.map((service, index) => (
              <Link 
                key={index} 
                to={service.path}
                className={`group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all 
                         transform hover:-translate-y-2 flex flex-col items-center text-center 
                         animate-fade-in-up opacity-0 delay-${(index + 1) * 100}`}
              >
                <div className="mb-6 p-4 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">
                  <div className="transform transition-transform group-hover:scale-110 group-hover:rotate-6">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Component Sections */}
      <div className="animate-fade-in-up delay-400 opacity-0">
        <BloodTypeSelector />
      </div>
      <div className="animate-fade-in-up delay-500 opacity-0">
        <DonationSteps />
      </div>
      <div className="animate-fade-in-up delay-600 opacity-0">
        <DonationTypes />
      </div>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-cta-animate"></div>
        <div className="relative py-20">
          <div className="container mx-auto px-4 text-center relative">
            <h2 className="text-4xl font-bold mb-6 text-white animate-reveal-text">
              Ready to Save Lives?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90 animate-fade-in-up">
              Your donation can make a difference in someone's life.
            </p>
            <div className="flex flex-wrap justify-center gap-6 animate-fade-in-up">
              <Link 
                to="/register" 
                className="group inline-flex items-center px-8 py-4 bg-white text-red-600 rounded-lg 
                          transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Register as Donor</span>
                <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                to="/directory" 
                className="group inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg 
                          transition-all transform hover:scale-105 hover:bg-white hover:text-red-600"
              >
                <span>Find Nearest Center</span>
                <MapPin className="ml-2 w-5 h-5 transition-transform group-hover:scale-110" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
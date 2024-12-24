import React from 'react';
import { UserCheck, Heart, HandHeart, ArrowRight, Clock } from 'lucide-react';

const DonationSteps = () => {
  const steps = [
    {
      icon: <UserCheck className="w-14 h-14 text-red-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />,
      title: "Registration Process",
      description: "Sign up and schedule your first donation with ease",
      time: "5-10 minutes",
      benefits: ["Quick online registration", "Flexible scheduling", "Email confirmation"]
    },
    {
      icon: <Heart className="w-14 h-14 text-red-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />,
      title: "Health Screening",
      description: "A simple check-up to ensure you're ready to donate",
      time: "10-15 minutes",
      benefits: ["Basic health check", "Blood pressure test", "Hemoglobin test"]
    },
    {
      icon: <HandHeart className="w-14 h-14 text-red-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />,
      title: "Donation Day",
      description: "Relax as our professional staff guide you through the process",
      time: "30-45 minutes",
      benefits: ["Comfortable environment", "Professional care", "Post-donation snacks"]
    }
  ];

  return (
    <div className="w-full bg-gradient-to-b from-red-50 to-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-reveal-text">
            Your Journey to <span className="text-red-600 inline-block animate-glow">Saving Lives</span>
          </h2>
          <p className="text-lg text-gray-600 animate-fade-in-up delay-200">
            Understanding the donation process helps make your experience comfortable and rewarding
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div 
                className="group w-full md:w-1/3 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl 
                         transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative">
                  {/* Time indicator */}
                  <div className="absolute -top-2 right-0 flex items-center bg-red-100 text-red-600 
                                px-3 py-1 rounded-full text-sm group-hover:bg-red-200 transition-colors">
                    <Clock className="w-4 h-4 mr-1 animate-pulse" />
                    {step.time}
                  </div>
                  
                  {/* Icon */}
                  <div className="flex justify-center items-center h-24 mb-6 relative">
                    <div className="absolute inset-0 bg-red-50 rounded-full scale-0 group-hover:scale-100 
                                transition-transform duration-300 ease-out"/>
                    {step.icon}
                  </div>

                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-red-600 text-white rounded-full 
                                flex items-center justify-center font-bold transform group-hover:rotate-12 
                                transition-transform duration-300">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors">
                  {step.description}
                </p>

                {/* Benefits list */}
                <ul className="space-y-2">
                  {step.benefits.map((benefit, i) => (
                    <li key={i} 
                        className="flex items-center text-sm text-gray-600 transform transition-transform hover:translate-x-1"
                        style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2 group-hover:scale-150 transition-transform"/>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Connector for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex flex-col items-center gap-2 text-red-400 animate-fade-in"
                     style={{ animationDelay: `${(index + 1) * 200}ms` }}>
                  <div className="w-12 h-[2px] bg-red-200 transform transition-transform group-hover:scale-x-110"/>
                  <ArrowRight className="w-6 h-6 animate-bounce-x" />
                  <div className="w-12 h-[2px] bg-red-200 transform transition-transform group-hover:scale-x-110"/>
                </div>
              )}
              
              {/* Connector for mobile */}
              {index < steps.length - 1 && (
                <div className="flex md:hidden flex-col items-center gap-2 text-red-400 my-4 animate-fade-in"
                     style={{ animationDelay: `${(index + 1) * 200}ms` }}>
                  <div className="h-12 w-[2px] bg-red-200"/>
                  <ArrowRight className="w-6 h-6 rotate-90 animate-bounce-y" />
                  <div className="h-12 w-[2px] bg-red-200"/>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonationSteps;
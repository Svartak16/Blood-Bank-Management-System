import React, { useState, useEffect } from 'react';
import { Droplet, Clock, Users, Gauge, FlaskConical, FlaskRound, AlertCircle } from 'lucide-react';

const DonationTypes = () => {
  const [activeTab, setActiveTab] = useState('packed-red-blood');
  const [isContentVisible, setIsContentVisible] = useState(true);

  // Handle tab change with animation
  const handleTabChange = (newTab) => {
    setIsContentVisible(false);
    setTimeout(() => {
      setActiveTab(newTab);
      setIsContentVisible(true);
    }, 300);
  };

  const donationTypes = {
    'packed-red-blood': {
      title: 'Packed Red Blood Cells',
      icon: <Droplet className="w-6 h-6" />,
      color: 'red',
      content: {
        'What is it?': {
          icon: <FlaskRound />,
          text: "Blood Collected straight from the donor into a blood bag and mixed with an anticoagulant is called as whole blood. This collected whole blood is then centrifuged and red cell, platelets and plasma are separated. The separated Red cells are mixed with a preservative to be called as packed red blood cells."
        },
        'Who can donate?': {
          icon: <Users />,
          text: 'You need to be 18-65 years old, weight 45kg or more and be fit and healthy.'
        },
        'User For?': {
          icon: <AlertCircle />,
          text: "Correction of severe anemia in a number of conditions and blood loss in case of child birth, surgery or trauma settings."
        },
        "Lasts For?": {
          icon: <Clock />,
          text: "Red cells can be stored for 42 days at 2-6 degree celsius."
        },
        "How long does it take to donate?": {
          icon: <Clock />,
          text: "15-30 minutes to donate including the pre-donation check-up."
        },
        "How often can I donate?": {
          icon: <Gauge />,
          text: "Male donors can donate again after 90 days and female donors can donate again after 120 days."
        }
      }
    },
    'plasma': {
      title: 'Plasma',
      icon: <FlaskConical className="w-6 h-6" />,
      color: 'yellow',
      content: {
        'What is it?': {
          icon: <FlaskRound />,
          text: 'The straw-coloured liquid in which red blood cells, white blood cells, and platelets float in is called plasma. Contains special nutrients which can be used to create 18 different type of medical products to treat many different medical conditions.'
        },
        'Who can donate?': {
          icon: <Users />,
          text: 'The donation criteria is similar to that of red blood cell. However, for apheresis plasma collection minimum weight is 50 kgs.'
        },
        'User For?': {
          icon: <AlertCircle />,
          text: 'Used for bleeding patients with coagulation factor deficiency such as hemophilia A and B, von willibrand disease etc. also used in cases of blood loss due to trauma.'
        },
        'Lasts For?': {
          icon: <Clock />,
          text: 'Plasma after separation if frozen below -30 degrees can be stored up to one year.'
        },
        'How long does it take to donate?': {
          icon: <Clock />,
          text: '15-30 minutes to donate including the pre-donation check-up.'
        },
        'How often can I donate?': {
          icon: <Gauge />,
          text: 'similar to the red cell donation.'
        }
      }
    },
    'platelets': {
      title: 'Platelets',
      icon: <Droplet className="w-6 h-6" />,
      color: 'purple',
      content: {
        'What is it?': {
          icon: <FlaskRound />,
          text: 'These are cellular elements in blood which wedge together to help to clot and reduce bleeding. Always in high demand, Vital for people with low platelet count, like hematology and cancer patients.'
        },
        'Who can donate?': {
          icon: <Users />,
          text: 'One can donate whole blood from which the blood centre will separate platelets from other components. Criteria similar to whole blood donation apply. Alternatively, one can donate using apheresis equipment where only platelets are collected and rest components are returned back to donate.'
        },
        'User For?': {
          icon: <AlertCircle />,
          text: 'Conditions with very low platelet count such as Cancer, blood diseases, trauma, dengue etc.'
        },
        'Lasts For?': {
          icon: <Clock />,
          text: 'can be stored for 5 days at 20-24 degree celsius.'
        },
        'How does it work?': {
          icon: <FlaskConical />,
          text: 'We collect your blood, keep platelet and return rest to you by apheresis donation.'
        },
        'How long does it take?': {
          icon: <Clock />,
          text: '45-60 minutes to donate. 2-3 hours for pre-donation screening.'
        },
        'How often can I donate?': {
          icon: <Gauge />,
          text: 'Every 2 weeks but should not exceed more than 24 times in a year.'
        }
      }
    }
  };

  const getColorClasses = (type, isActive) => {
    const colors = {
      red: {
        active: 'bg-red-50 border-red-600 text-red-600',
        hover: 'hover:bg-red-50 hover:text-red-600',
        icon: 'text-red-600'
      },
      yellow: {
        active: 'bg-amber-50 border-amber-600 text-amber-600',
        hover: 'hover:bg-amber-50 hover:text-amber-600',
        icon: 'text-amber-600'
      },
      purple: {
        active: 'bg-purple-50 border-purple-600 text-purple-600',
        hover: 'hover:bg-purple-50 hover:text-purple-600',
        icon: 'text-purple-600'
      }
    };

    return isActive ? colors[type].active : colors[type].hover;
  };

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-reveal-text">
            Types of <span className="text-red-600 animate-glow">Blood Donation</span>
          </h2>
          <p className="text-lg text-gray-600 animate-fade-in-up delay-200">
            The average human body contains about five litres of blood, which is made of several cellular and non-cellular components such as
            <span className="text-red-600"> Red blood cells, Platelets, and Plasma</span>.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar navigation */}
          <div className="lg:w-1/4">
            <div className="flex lg:flex-col gap-2">
              {Object.entries(donationTypes).map(([key, type], index) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`flex items-center gap-3 w-full px-6 py-4 rounded-xl transition-all duration-300 
                    transform hover:scale-102 relative group animate-fade-in-up
                    ${activeTab === key 
                      ? `${getColorClasses(type.color, true)} border-l-4 shadow-md` 
                      : `${getColorClasses(type.color, false)} border-l-4 border-transparent`}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    {type.icon}
                  </div>
                  <span className="font-medium">{type.title}</span>
                  {activeTab === key && (
                    <div className="absolute right-2 w-2 h-2 rounded-full bg-current animate-ping" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="lg:w-3/4 bg-white rounded-2xl shadow-lg p-8 transition-all duration-300
                        transform hover:shadow-xl">
            <div className={`space-y-8 transition-opacity duration-300 ${
              isContentVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              {Object.entries(donationTypes[activeTab].content).map(([title, content], index) => (
                <div 
                  key={title} 
                  className={`border-b border-gray-100 pb-6 last:border-b-0 last:pb-0 
                           animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4 group">
                    <div className="p-2 bg-red-50 rounded-lg transition-all duration-300 
                                group-hover:scale-110 group-hover:rotate-3">
                      <div className="transform transition-transform duration-300 group-hover:rotate-12">
                        {content.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2 transition-colors
                                 duration-300 group-hover:text-red-600">
                        {title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed transition-colors duration-300
                                group-hover:text-gray-900">
                        {content.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationTypes;
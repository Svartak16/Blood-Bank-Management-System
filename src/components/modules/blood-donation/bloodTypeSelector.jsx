import React, { useState } from 'react';
import { Droplet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const BloodTypeSelector = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  
  const bloodTypes = [
    { type: 'A+', 
      canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
      canGiveTo: ['A+', 'AB+'],
      percentage: '35.7%'
    },
    { type: 'O+', 
      canReceiveFrom: ['O+', 'O-'],
      canGiveTo: ['O+', 'A+', 'B+', 'AB+'],
      percentage: '37.4%'
    },
    { type: 'B+', 
      canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
      canGiveTo: ['B+', 'AB+'],
      percentage: '8.5%'
    },
    { type: 'AB+', 
      canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canGiveTo: ['AB+'],
      percentage: '3.4%'
    },
    { type: 'A-', 
      canReceiveFrom: ['A-', 'O-'],
      canGiveTo: ['A+', 'A-', 'AB+', 'AB-'],
      percentage: '6.3%'
    },
    { type: 'O-', 
      canReceiveFrom: ['O-'],
      canGiveTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      percentage: '6.6%'
    },
    { type: 'B-', 
      canReceiveFrom: ['B-', 'O-'],
      canGiveTo: ['B+', 'B-', 'AB+', 'AB-'],
      percentage: '1.5%'
    },
    { type: 'AB-', 
      canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
      canGiveTo: ['AB+', 'AB-'],
      percentage: '0.6%'
    }
  ];

  const handleTypeSelect = (blood) => {
    setIsInfoVisible(false);
    setTimeout(() => {
      setSelectedType(blood);
      setIsInfoVisible(true);
    }, 200);
  };

  return (
    <div className="w-full bg-gradient-to-b from-red-50 to-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-reveal-text">
            Blood Type Compatibility
          </h2>
          <p className="text-lg text-gray-600 animate-fade-in-up">
            Understanding blood type compatibility is crucial for successful transfusions. 
            Select your blood type to learn more about donation compatibility.
          </p>
        </div>

        {/* Blood Type Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
          {bloodTypes.map((blood, index) => (
            <button
              key={blood.type}
              onClick={() => handleTypeSelect(blood)}
              className={`relative group p-6 rounded-xl border-2 transition-all duration-300
                transform hover:-translate-y-1 animate-fade-in-up
                ${selectedType?.type === blood.type 
                  ? 'bg-red-600 text-white border-red-600 shadow-lg scale-105' 
                  : 'bg-white text-gray-800 border-gray-200 hover:border-red-600 hover:shadow-md'
                }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative z-10">
                <Droplet className={`w-6 h-6 mx-auto mb-2 transition-all duration-300 
                  transform group-hover:scale-110
                  ${selectedType?.type === blood.type ? 'text-white' : 'text-red-600 group-hover:text-red-600'}`} 
                />
                <div className="text-2xl font-bold mb-1">{blood.type}</div>
                <div className={`text-sm transition-colors duration-300
                  ${selectedType?.type === blood.type ? 'text-red-100' : 'text-gray-500'}`}>
                  {blood.percentage}
                </div>
              </div>
              
              {selectedType?.type === blood.type && (
                <>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-ping" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full" />
                </>
              )}
              
              <div className={`absolute inset-0 bg-red-50 rounded-xl transition-opacity duration-300
                ${selectedType?.type === blood.type ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'}`} 
              />
            </button>
          ))}
        </div>

        {/* Compatibility Information Cards */}
        {selectedType && (
          <div className={`flex flex-col md:flex-row gap-8 max-w-5xl mx-auto 
            transition-all duration-500 ease-out
            ${isInfoVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            {/* Can receive from card */}
            <div className="flex-1 bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 
                          shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center
                              transform transition-transform group-hover:rotate-12">
                  <ArrowDownLeft className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-4">Can Receive From</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedType.canReceiveFrom.map((type, index) => (
                      <span 
                        key={type} 
                        className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium
                                 transform transition-all hover:-translate-y-1 hover:shadow-md"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-gray-600">
                    {selectedType.canReceiveFrom.length} compatible donor {selectedType.canReceiveFrom.length === 1 ? 'type' : 'types'}
                  </p>
                </div>
              </div>
            </div>

            {/* Can give to card */}
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 
                          shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center
                              transform transition-transform group-hover:rotate-12">
                  <ArrowUpRight className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-4">Can Donate To</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedType.canGiveTo.map((type, index) => (
                      <span 
                        key={type} 
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium
                                 transform transition-all hover:-translate-y-1 hover:shadow-md"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-gray-600">
                    {selectedType.canGiveTo.length} compatible recipient {selectedType.canGiveTo.length === 1 ? 'type' : 'types'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodTypeSelector;
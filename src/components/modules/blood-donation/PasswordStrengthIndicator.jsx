const PasswordStrengthIndicator = ({ password }) => {
    const requirements = [
      { re: /.{8,20}/, label: '8-20 Characters' },
      { re: /[0-9]/, label: 'Has Number' },
      { re: /[a-z]/, label: 'Has Lowercase' },
      { re: /[A-Z]/, label: 'Has Uppercase' },
    ];
  
    const strength = requirements.reduce((acc, req) => acc + (req.re.test(password) ? 1 : 0), 0);
  
    const getStrengthLabel = () => {
      if (strength === 0) return { text: 'Very Weak', color: 'bg-red-200' };
      if (strength < 2) return { text: 'Weak', color: 'bg-red-400' };
      if (strength < 3) return { text: 'Fair', color: 'bg-yellow-400' };
      if (strength < 4) return { text: 'Good', color: 'bg-green-400' };
      return { text: 'Strong', color: 'bg-green-600' };
    };
  
    const strengthInfo = getStrengthLabel();
  
    return (
      <div className="mt-2">
        <div className="flex items-center mb-2">
          <div className="flex-1 h-2 bg-gray-200 rounded">
            <div 
              className={`h-full rounded transition-all duration-300 ${strengthInfo.color}`}
              style={{ width: `${(strength / requirements.length) * 100}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm text-gray-600">{strengthInfo.text}</span>
        </div>
        <div className="space-y-2">
          {requirements.map((requirement, index) => (
            <div 
              key={index} 
              className="flex items-center text-sm"
            >
              <div className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center ${
                requirement.re.test(password) 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200'
              }`}>
                {requirement.re.test(password) && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`${
                requirement.re.test(password) 
                  ? 'text-green-600' 
                  : 'text-gray-500'
              }`}>
                {requirement.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default PasswordStrengthIndicator;
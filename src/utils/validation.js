export const validatePassword = (password) => {
    const errors = [];
    
    // Check length
    if (password.length < 8 || password.length > 20) {
        errors.push('Password must be between 8 and 20 characters');
    }

    // Check for alphabets
    if (!/[a-zA-Z]/.test(password)) {
        errors.push('Password must contain at least one letter');
    }

    // Check for numbers
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    return errors;
};
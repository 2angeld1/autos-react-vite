// Basic validation functions
export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  return value != null && value !== undefined;
};

export const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isMinLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

export const isMaxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

export const isNumber = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const isPositiveNumber = (value: number): boolean => {
  return isNumber(value) && value > 0;
};

export const isInteger = (value: any): boolean => {
  return Number.isInteger(Number(value));
};

export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

export const isUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Car-specific validators
export const validateCarMake = (make: string): string | null => {
  if (!isRequired(make)) return 'Make is required';
  if (!isMinLength(make, 2)) return 'Make must be at least 2 characters';
  if (!isMaxLength(make, 50)) return 'Make must not exceed 50 characters';
  return null;
};

export const validateCarModel = (model: string): string | null => {
  if (!isRequired(model)) return 'Model is required';
  if (!isMinLength(model, 1)) return 'Model must be at least 1 character';
  if (!isMaxLength(model, 50)) return 'Model must not exceed 50 characters';
  return null;
};

export const validateCarYear = (year: number): string | null => {
  if (!isRequired(year)) return 'Year is required';
  if (!isInteger(year)) return 'Year must be a valid integer';
  
  const currentYear = new Date().getFullYear();
  if (!isInRange(year, 1900, currentYear + 1)) {
    return `Year must be between 1900 and ${currentYear + 1}`;
  }
  
  return null;
};

export const validateCarPrice = (price: number): string | null => {
  if (!isRequired(price)) return 'Price is required';
  if (!isNumber(price)) return 'Price must be a valid number';
  if (!isPositiveNumber(price)) return 'Price must be greater than 0';
  if (price > 10000000) return 'Price seems unusually high';
  return null;
};

export const validateCarDescription = (description: string): string | null => {
  if (!isRequired(description)) return 'Description is required';
  if (!isMinLength(description, 10)) return 'Description must be at least 10 characters';
  if (!isMaxLength(description, 1000)) return 'Description must not exceed 1000 characters';
  return null;
};

export const validateFuelType = (fuelType: string): string | null => {
  const validTypes = ['gas', 'diesel', 'electricity', 'hybrid'];
  if (!isRequired(fuelType)) return 'Fuel type is required';
  if (!validTypes.includes(fuelType)) return 'Invalid fuel type';
  return null;
};

export const validateTransmission = (transmission: string): string | null => {
  const validTypes = ['a', 'm'];
  if (!isRequired(transmission)) return 'Transmission is required';
  if (!validTypes.includes(transmission)) return 'Invalid transmission type';
  return null;
};

export const validateCylinders = (cylinders: number): string | null => {
  if (!isRequired(cylinders)) return 'Cylinders is required';
  if (!isInteger(cylinders)) return 'Cylinders must be a valid integer';
  if (!isInRange(cylinders, 1, 16)) return 'Cylinders must be between 1 and 16';
  return null;
};

export const validateDisplacement = (displacement: number): string | null => {
  if (!isRequired(displacement)) return 'Displacement is required';
  if (!isNumber(displacement)) return 'Displacement must be a valid number';
  if (!isPositiveNumber(displacement)) return 'Displacement must be greater than 0';
  if (displacement > 10) return 'Displacement seems unusually high';
  return null;
};

export const validateMPG = (mpg: number, type: string): string | null => {
  if (!isRequired(mpg)) return `${type} MPG is required`;
  if (!isNumber(mpg)) return `${type} MPG must be a valid number`;
  if (!isPositiveNumber(mpg)) return `${type} MPG must be greater than 0`;
  if (mpg > 200) return `${type} MPG seems unusually high`;
  return null;
};

// User-specific validators
export const validateUserName = (name: string): string | null => {
  if (!isRequired(name)) return 'Name is required';
  if (!isMinLength(name, 2)) return 'Name must be at least 2 characters';
  if (!isMaxLength(name, 100)) return 'Name must not exceed 100 characters';
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) return 'Name contains invalid characters';
  
  return null;
};

export const validateUserEmail = (email: string): string | null => {
  if (!isRequired(email)) return 'Email is required';
  if (!isEmail(email)) return 'Invalid email format';
  if (!isMaxLength(email, 255)) return 'Email must not exceed 255 characters';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!isRequired(password)) return 'Password is required';
  if (!isMinLength(password, 6)) return 'Password must be at least 6 characters';
  if (!isMaxLength(password, 128)) return 'Password must not exceed 128 characters';
  
  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasLetter) return 'Password must contain at least one letter';
  if (!hasNumber) return 'Password must contain at least one number';
  
  return null;
};

export const validatePasswordConfirmation = (password: string, confirmation: string): string | null => {
  if (!isRequired(confirmation)) return 'Password confirmation is required';
  if (password !== confirmation) return 'Passwords do not match';
  return null;
};

export const validateUserRole = (role: string): string | null => {
  const validRoles = ['admin', 'user'];
  if (!isRequired(role)) return 'Role is required';
  if (!validRoles.includes(role)) return 'Invalid role';
  return null;
};

// File validators
export const validateImageFile = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return 'File must be JPEG, PNG, or WebP format';
  }
  
  if (file.size > maxSize) {
    return 'File size must be less than 5MB';
  }
  
  return null;
};

// Generic validators
export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!isRequired(value)) return `${fieldName} is required`;
  return null;
};

export const validateNumericRange = (
  value: number, 
  min: number, 
  max: number, 
  fieldName: string
): string | null => {
  if (!isNumber(value)) return `${fieldName} must be a valid number`;
  if (!isInRange(value, min, max)) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
};

export const validateStringLength = (
  value: string, 
  min: number, 
  max: number, 
  fieldName: string
): string | null => {
  if (!isMinLength(value, min)) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (!isMaxLength(value, max)) {
    return `${fieldName} must not exceed ${max} characters`;
  }
  return null;
};

// Form validation helper
export const validateForm = <T extends Record<string, any>>(
  data: T,
  validators: Record<keyof T, (value: any) => string | null>
): Record<keyof T, string> => {
  const errors: Record<keyof T, string> = {} as Record<keyof T, string>;
  
  Object.keys(validators).forEach((key) => {
    const validator = validators[key];
    const error = validator(data[key]);
    if (error) {
      errors[key] = error;
    }
  });
  
  return errors;
};

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Comprehensive car validation
export const validateCar = (carData: any): ValidationResult => {
  const errors: string[] = [];
  
  const makeError = validateCarMake(carData.make);
  if (makeError) errors.push(makeError);
  
  const modelError = validateCarModel(carData.model);
  if (modelError) errors.push(modelError);
  
  const yearError = validateCarYear(carData.year);
  if (yearError) errors.push(yearError);
  
  const priceError = validateCarPrice(carData.price);
  if (priceError) errors.push(priceError);
  
  const descriptionError = validateCarDescription(carData.description);
  if (descriptionError) errors.push(descriptionError);
  
  const fuelTypeError = validateFuelType(carData.fuel_type);
  if (fuelTypeError) errors.push(fuelTypeError);
  
  const transmissionError = validateTransmission(carData.transmission);
  if (transmissionError) errors.push(transmissionError);
  
  const cylindersError = validateCylinders(carData.cylinders);
  if (cylindersError) errors.push(cylindersError);
  
  const displacementError = validateDisplacement(carData.displacement);
  if (displacementError) errors.push(displacementError);
  
  const cityMpgError = validateMPG(carData.city_mpg, 'City');
  if (cityMpgError) errors.push(cityMpgError);
  
  const highwayMpgError = validateMPG(carData.highway_mpg, 'Highway');
  if (highwayMpgError) errors.push(highwayMpgError);
  
  const combinationMpgError = validateMPG(carData.combination_mpg, 'Combined');
  if (combinationMpgError) errors.push(combinationMpgError);
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Comprehensive user validation
export const validateUser = (userData: any, isUpdate: boolean = false): ValidationResult => {
  const errors: string[] = [];
  
  const nameError = validateUserName(userData.name);
  if (nameError) errors.push(nameError);
  
  const emailError = validateUserEmail(userData.email);
  if (emailError) errors.push(emailError);
  
  if (!isUpdate || userData.password) {
    const passwordError = validatePassword(userData.password);
    if (passwordError) errors.push(passwordError);
    
    if (userData.confirmPassword !== undefined) {
      const confirmationError = validatePasswordConfirmation(userData.password, userData.confirmPassword);
      if (confirmationError) errors.push(confirmationError);
    }
  }
  
  const roleError = validateUserRole(userData.role);
  if (roleError) errors.push(roleError);
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
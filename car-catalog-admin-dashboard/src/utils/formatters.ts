// Number formatters
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatPercent = (value: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

// Date formatters
export const formatDate = (date: string | Date, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    long: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    },
  };

  return new Intl.DateTimeFormat('en-US', options[format]).format(dateObj);
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const intervals = [
    { unit: 'year' as const, seconds: 31536000 },
    { unit: 'month' as const, seconds: 2592000 },
    { unit: 'week' as const, seconds: 604800 },
    { unit: 'day' as const, seconds: 86400 },
    { unit: 'hour' as const, seconds: 3600 },
    { unit: 'minute' as const, seconds: 60 },
  ];

  for (const { unit, seconds } of intervals) {
    const value = Math.floor(diffInSeconds / seconds);
    if (value >= 1) {
      return rtf.format(-value, unit);
    }
  }

  return 'Just now';
};

// String formatters
export const formatCarName = (make: string, model: string, year: number): string => {
  return `${make} ${model} ${year}`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Fuel type formatter
export const formatFuelType = (fuelType: string): string => {
  const fuelTypeMap: Record<string, string> = {
    gas: 'Gas',
    diesel: 'Diesel',
    electricity: 'Electric',
    hybrid: 'Hybrid',
  };
  
  return fuelTypeMap[fuelType] || fuelType;
};

// Transmission formatter
export const formatTransmission = (transmission: string): string => {
  return transmission === 'a' ? 'Automatic' : 'Manual';
};

// MPG formatter
export const formatMPG = (cityMpg: number, highwayMpg: number): string => {
  return `${cityMpg}/${highwayMpg} MPG`;
};

// Features formatter
export const formatFeatures = (features: string[] | undefined): string => {
  if (!features || features.length === 0) return 'No features listed';
  if (features.length <= 3) return features.join(', ');
  return `${features.slice(0, 3).join(', ')} +${features.length - 3} more`;
};

// Status formatters
export const formatStatus = (isActive: boolean): string => {
  return isActive ? 'Active' : 'Inactive';
};

export const formatAvailability = (isAvailable: boolean): string => {
  return isAvailable ? 'Available' : 'Unavailable';
};

// Role formatter
export const formatRole = (role: string): string => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

// Error formatter
export const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return 'An unexpected error occurred';
};
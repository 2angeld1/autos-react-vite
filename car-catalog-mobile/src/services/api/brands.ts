import api from './config';

export interface Brand {
  _id: string;
  name: string;
  logo?: string;
  cloudinaryUrl?: string; // Por si acaso
  country?: string;
  featured?: boolean;
}

export interface BrandsResponse {
  success: boolean;
  count: number;
  data: Brand[];
}

export const getBrands = async (): Promise<Brand[]> => {
  try {
    const response = await api.get<BrandsResponse>('/inventory/brands');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
};

export const getFeaturedBrands = async (): Promise<Brand[]> => {
  try {
    const response = await api.get<BrandsResponse>('/inventory/brands');
    // Filter locally since inventory controller doesn't have a specific featured route yet
    return response.data.data.filter(b => b.featured);
  } catch (error) {
    console.error('Error fetching featured brands:', error);
    return [];
  }
};

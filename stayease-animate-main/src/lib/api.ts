// Minimal API client for properties with auth header support
export const API_BASE = 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface ImageInfo { url: string; public_id: string }
export interface Property {
  _id: string;
  owner: string;
  name: string;
  type: 'hotel' | 'resort' | 'lodge' | 'apartment' | 'villa';
  description?: string;
  address: string;
  city: string;
  country: string;
  zipCode?: string;
  phone: string;
  email: string;
  website?: string;
  rooms: number;
  price: number;
  amenities: string[];
  images: ImageInfo[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> { success: boolean; data?: T; message?: string }

export interface CreatePropertyPayload {
  name: string;
  type: Property['type'];
  description?: string;
  address: string;
  city: string;
  country: string;
  zipCode?: string;
  phone: string;
  email: string;
  website?: string;
  rooms: number;
  price: number;
  amenities?: string[];
  images?: string[]; // data URLs
}

export interface UpdatePropertyPayload extends Partial<CreatePropertyPayload> {
  newImages?: string[];
  removeImagePublicIds?: string[];
  isActive?: boolean;
}

export const PropertiesAPI = {
  async create(payload: CreatePropertyPayload): Promise<ApiResponse<Property>> {
    const res = await fetch(`${API_BASE}/api/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  async listMine(): Promise<ApiResponse<Property[]>> {
    const res = await fetch(`${API_BASE}/api/properties/mine`, {
      headers: { ...getAuthHeaders() },
    });
    return res.json();
  },
  async get(id: string): Promise<ApiResponse<Property>> {
    const res = await fetch(`${API_BASE}/api/properties/${id}`, {
      headers: { ...getAuthHeaders() },
    });
    return res.json();
  },
  async update(id: string, payload: UpdatePropertyPayload): Promise<ApiResponse<Property>> {
    const res = await fetch(`${API_BASE}/api/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  async remove(id: string): Promise<ApiResponse<unknown>> {
    const res = await fetch(`${API_BASE}/api/properties/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return res.json();
  },
};

export const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

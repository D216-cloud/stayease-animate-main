// Minimal API client for properties with auth header support
const env = typeof import.meta !== 'undefined' ? import.meta.env : undefined;
// Normalize to exactly '<origin>/api' (strip any extra path such as '/api/properties')
(() => {
  const raw = (env?.VITE_API_BASE_URL || env?.VITE_API_URL || 'http://localhost:5000').trim();
  try {
    const u = new URL(raw);
    // Keep origin only
    const origin = `${u.protocol}//${u.host}`;
  // Optionally expose origin for debugging (commented to avoid lint issues)
  // (window as unknown as Record<string, unknown>).__API_ORIGIN__ = origin;
    // Export below
  } catch {
    // If not a full URL, assume origin missing and default to localhost:5000
  }
})();

const computeApiBase = (): string => {
  const raw = (env?.VITE_API_BASE_URL || env?.VITE_API_URL || 'http://localhost:5000').trim();
  // If raw already contains 'http', parse; else prefix http://
  const base = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`;
  let url: URL;
  try { url = new URL(base); } catch {
    url = new URL('http://localhost:5000');
  }
  const origin = `${url.protocol}//${url.host}`;
  return `${origin}/api`;
};

export const API_BASE = computeApiBase();

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
  defaultRoomImages?: ImageInfo[];
  defaultRoom?: {
    name?: string;
    roomType?: string;
    capacity?: number;
    maxGuests?: number;
    bedType?: string;
    size?: number;
    smokingAllowed?: boolean;
  breakfastIncluded?: boolean;
  isVIP?: boolean;
  vipFeatures?: string[];
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Rating information
  averageRating?: number;
  totalReviews?: number;
}

export interface PropertyWithStats extends Property {
  status: string;
  guests: number;
  revenue: string;
  occupancy: number;
}

export interface ApiResponse<T> { success: boolean; data?: T; message?: string }
export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}

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
  defaultRoomImages?: string[]; // data URLs for the default room
  defaultRoom?: Property['defaultRoom'];
}

export interface UpdatePropertyPayload extends Partial<CreatePropertyPayload> {
  newImages?: string[];
  removeImagePublicIds?: string[];
  newDefaultRoomImages?: string[];
  removeRoomImagePublicIds?: string[];
  isActive?: boolean;
}

export const PropertiesAPI = {
  async create(payload: CreatePropertyPayload): Promise<ApiResponse<Property>> {
  const res = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  async listMine(): Promise<ApiResponse<Property[]>> {
  const res = await fetch(`${API_BASE}/properties/mine`, {
      headers: { ...getAuthHeaders() },
    });
    return res.json();
  },
  async get(id: string): Promise<ApiResponse<Property>> {
  const res = await fetch(`${API_BASE}/properties/${id}`, {
      headers: { ...getAuthHeaders() },
    });
    return res.json();
  },
  async update(id: string, payload: UpdatePropertyPayload): Promise<ApiResponse<Property>> {
  const res = await fetch(`${API_BASE}/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  async remove(id: string): Promise<ApiResponse<unknown>> {
  const res = await fetch(`${API_BASE}/properties/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return res.json();
  },
  async listPublic(params: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedResponse<Property[]>> {
    const url = new URL(`${API_BASE}/properties/public`);
    if (params.page) url.searchParams.set('page', String(params.page));
    if (params.limit) url.searchParams.set('limit', String(params.limit));
    if (params.search) url.searchParams.set('search', params.search);
    const res = await fetch(url.toString());
    return res.json();
  },
  async getPublic(id: string): Promise<ApiResponse<Property>> {
    const res = await fetch(`${API_BASE}/properties/public/${id}`);
    return res.json();
  },
  async listMineWithStats(): Promise<ApiResponse<PropertyWithStats[]>> {
    const res = await fetch(`${API_BASE}/properties/mine/with-stats`, {
      headers: { ...getAuthHeaders() },
    });
    return res.json();
  },
};

// Bookings
export interface Booking {
  _id: string;
  property: Property | string;
  customer?: { first_name: string; last_name: string; email: string } | string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  taxesAndFees: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  rating?: number;
  review?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  review: string;
  reviewedAt: string;
  propertyName: string;
  customerName: string;
  customerEmail: string;
  customerReviewCount: number;
  isVerified: boolean;
  helpful: number;
  reported: boolean;
  createdAt: string;
  updatedAt: string;
}

export const BookingsAPI = {
  async create(payload: { propertyId: string; checkIn: string; checkOut: string; guests: number }): Promise<ApiResponse<Booking>> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  async listMine(): Promise<ApiResponse<Booking[]>> {
    const res = await fetch(`${API_BASE}/bookings/mine`, {
      headers: { ...getAuthHeaders() },
    });
    return res.json();
  },
  async listOwnerMine(): Promise<ApiResponse<Booking[]>> {
    const res = await fetch(`${API_BASE}/bookings/owner/mine`, {
      headers: { ...getAuthHeaders() },
    });
    return res.json();
  },
  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<ApiResponse<Booking>> {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
  async cancelMine(id: string): Promise<ApiResponse<Booking>> {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: { ...getAuthHeaders() },
    });
    return res.json();
  },
  async addReview(id: string, payload: { rating: number; review?: string }): Promise<ApiResponse<Booking>> {
    const res = await fetch(`${API_BASE}/bookings/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
  async ownerRatingsSummary(): Promise<ApiResponse<{ averageRating: number; totalReviews: number; counts?: Record<number, number> }>> {
    const res = await fetch(`${API_BASE}/bookings/owner/ratings`, {
      headers: { ...getAuthHeaders() },
    });
    return res.json();
  },
  async allRatingsSummary(): Promise<ApiResponse<{ averageRating: number; totalReviews: number; counts?: Record<number, number> }>> {
    const res = await fetch(`${API_BASE}/bookings/all-ratings`, {
      headers: { ...getAuthHeaders() },
    });
    return res.json();
  },
  async getOwnerReviews(): Promise<ApiResponse<Review[]>> {
    const res = await fetch(`${API_BASE}/bookings/owner/reviews`, {
      headers: { ...getAuthHeaders() },
    });
    return res.json();
  },
  async getAllReviews(): Promise<ApiResponse<Review[]>> {
    const res = await fetch(`${API_BASE}/bookings/all-reviews`, {
      headers: { ...getAuthHeaders() },
    });
    return res.json();
  },
  async getOwnerDashboardStats(): Promise<ApiResponse<{
    totalProperties: number;
    activeBookings: number;
    totalGuests: number;
    totalRevenue: string;
    occupancyRate: string;
    recentBookings: Booking[];
  }>> {
    const res = await fetch(`${API_BASE}/bookings/owner/stats`, {
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

// Reviews (public/property-specific)
export interface PropertyReview {
  id: string;
  rating: number;
  review: string;
  createdAt: string;
  customerName: string;
  bookingDates?: { checkIn?: string; checkOut?: string };
  helpful?: number;
  reported?: boolean;
}

export const ReviewsAPI = {
  async getByProperty(propertyId: string, opts: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<PropertyReview[]>> {
    const url = new URL(`${API_BASE}/reviews/property/${propertyId}`);
    if (opts.page) url.searchParams.set('page', String(opts.page));
    if (opts.limit) url.searchParams.set('limit', String(opts.limit));
    const res = await fetch(url.toString());
    return res.json();
  },
};
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Spot {
  id: number;
  name: string;
  city: string;
  address: string;
  colonia?: string;
  food_type?: string;
  hours?: string;
  description?: string;
  image_url?: string;
  avg_rating?: number;
  review_count?: number;
}

export interface Review {
  id: number;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export const apiClient = {
  async getSpots(city?: string, search?: string): Promise<Spot[]> {
    const params = new URLSearchParams();
    if (city && city !== 'all') params.append('city', city);
    if (search) params.append('search', search);
    const response = await axios.get(`${API_BASE_URL}/spots?${params.toString()}`);
    return response.data;
  },

  async getSpot(id: number): Promise<Spot & { reviews: Review[] }> {
    const response = await axios.get(`${API_BASE_URL}/spots/${id}`);
    return response.data;
  },

  async createReview(
    spotId: number,
    rating: number,
    comment?: string,
    token?: string
  ): Promise<Review> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.post(
      `${API_BASE_URL}/reviews/${spotId}`,
      { rating, comment },
      { headers }
    );
    return response.data;
  },

  async deleteReview(id: number, token?: string): Promise<void> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    await axios.delete(`${API_BASE_URL}/reviews/${id}`, { headers });
  },
};

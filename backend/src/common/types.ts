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
  latitude?: number;
  longitude?: number;
  avg_rating?: number;
  review_count?: number;
  created_at: string;
}

export interface Review {
  id: number;
  spot_id: number;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface SpotDetail extends Spot {
  reviews: Review[];
}

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId?: string;
      };
    }
  }
}

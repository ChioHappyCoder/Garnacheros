'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { apiClient, Spot, Review } from '@/lib/api';

interface SpotDetailProps {
  spotId: number;
}

export default function SpotDetail({ spotId }: SpotDetailProps) {
  const { getToken } = useAuth();
  const [spot, setSpot] = useState<(Spot & { reviews: Review[] }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiClient
      .getSpot(spotId)
      .then(setSpot)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [spotId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await getToken();
      await apiClient.createReview(spotId, rating, comment, token || undefined);
      setComment('');
      setRating(5);
      const updated = await apiClient.getSpot(spotId);
      setSpot(updated);
    } catch (error) {
      console.error('Failed to submit review', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      const token = await getToken();
      await apiClient.deleteReview(reviewId, token || undefined);
      const updated = await apiClient.getSpot(spotId);
      setSpot(updated);
    } catch (error) {
      console.error('Failed to delete review', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Puesto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/spots" className="mb-6 text-orange-600 hover:text-orange-700 font-semibold inline-block">
        ← Volver
      </Link>

      <img
        src={
          spot.image_url ||
          'https://images.unsplash.com/photo-1565050902556-49d882e12b04?w=400&h=300&fit=crop'
        }
        alt={spot.name}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{spot.name}</h1>
        <p className="text-xl text-gray-600 mb-4">{spot.food_type}</p>

        <div className="flex gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Colonia</p>
            <p className="font-semibold text-gray-800">{spot.colonia || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ciudad</p>
            <p className="font-semibold text-gray-800">{spot.city}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Dirección</p>
            <p className="font-semibold text-gray-800">{spot.address}</p>
          </div>
        </div>

        {spot.hours && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">Horarios</p>
            <p className="font-semibold text-gray-800">{spot.hours}</p>
          </div>
        )}

        {spot.description && (
          <div className="mb-4">
            <p className="text-gray-700">{spot.description}</p>
          </div>
        )}

        <div className="flex items-center gap-2 mb-6">
          <span className="text-yellow-500 text-2xl">⭐</span>
          <span className="text-2xl font-bold text-gray-800">
            {(spot.avg_rating || 0).toFixed(1)}
          </span>
          <span className="text-gray-600">({spot.review_count || 0} reseñas)</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dejar una reseña</h2>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition ${
                    star <= rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comentario</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
          >
            {submitting ? 'Enviando...' : 'Enviar reseña'}
          </button>
        </form>
      </div>

      {spot.reviews && spot.reviews.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Reseñas</h2>
          <div className="space-y-4">
            {spot.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold text-gray-800">{review.rating}/5</span>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
                {review.comment && (
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

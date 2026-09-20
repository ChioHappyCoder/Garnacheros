import { Spot } from "../api/client";

interface SpotCardProps {
  spot: Spot;
  onClick: () => void;
}

export default function SpotCard({ spot, onClick }: SpotCardProps) {
  const rating = spot.avg_rating || 0;
  const reviewCount = spot.review_count || 0;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden hover:scale-105"
    >
      <img
        src={spot.image_url || "https://images.unsplash.com/photo-1565050902556-49d882e12b04?w=400&h=300&fit=crop"}
        alt={spot.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{spot.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{spot.food_type || "Comida callejera"}</p>
        <p className="text-xs text-gray-500 mb-3">{spot.colonia || spot.city}</p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold text-gray-800">{rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({reviewCount})</span>
          </div>
          <span className="text-xs text-orange-600 font-semibold">Ver más</span>
        </div>
      </div>
    </div>
  );
}

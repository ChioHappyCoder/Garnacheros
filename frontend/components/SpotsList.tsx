'use client';

import { useEffect, useState } from 'react';
import { apiClient, Spot } from '@/lib/api';
import SpotCard from './SpotCard';

interface SpotsListProps {
  initialCity?: string;
}

export default function SpotsList({ initialCity = 'all' }: SpotsListProps) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);

  useEffect(() => {
    setLoading(true);
    apiClient
      .getSpots(selectedCity, searchTerm)
      .then(setSpots)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchTerm, selectedCity]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Buscar por nombre, tipo de comida o colonia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
        />

        <div className="flex gap-4 flex-wrap">
          {['all', 'CDMX', 'Aguascalientes'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCity === city
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {city === 'all' ? 'Todas las ciudades' : city}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando puestos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      )}

      {!loading && spots.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron puestos</p>
        </div>
      )}
    </div>
  );
}

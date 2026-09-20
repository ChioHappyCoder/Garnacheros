'use client';

import { useEffect, useState } from 'react';

interface HealthStatus {
  backend: { status: 'up' | 'down' | 'checking'; ping?: number };
  frontend: { status: 'up'; message: string };
  timestamp: string;
}

async function checkBackendHealth(): Promise<HealthStatus['backend']> {
  const start = Date.now();
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${apiUrl.replace('/api', '')}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    const ping = Date.now() - start;

    if (response.ok) {
      return { status: 'up', ping };
    } else {
      return { status: 'down' };
    }
  } catch {
    return { status: 'down' };
  }
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthStatus>({
    backend: { status: 'checking' },
    frontend: { status: 'up', message: '✨ Frontend funcionando perfectamente' },
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    const checkHealth = async () => {
      const backendStatus = await checkBackendHealth();
      setHealth({
        backend: backendStatus,
        frontend: { status: 'up', message: '✨ Frontend funcionando perfectamente' },
        timestamp: new Date().toISOString(),
      });
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const isHealthy = health.backend.status === 'up' && health.frontend.status === 'up';

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isHealthy ? 'bg-gradient-to-br from-orange-50 to-orange-100' : 'bg-gradient-to-br from-red-50 to-red-100'
    }`}>
      <div className="max-w-2xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-3">
            {isHealthy ? '🌮' : '⚠️'} Garnacheros Health
          </h1>
          <p className="text-2xl text-gray-700 font-semibold mb-2">
            {isHealthy ? '¡Todo está delicioso!' : 'Hay un problema en la cocina'}
          </p>
          <p className="text-gray-600 text-sm">
            Última verificación: {new Date(health.timestamp).toLocaleTimeString('es-MX')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="border-l-4 border-orange-600 pl-6 py-4 bg-orange-50 rounded">
            <h2 className="text-xl font-bold text-orange-800 mb-2">🍽️ Frontend</h2>
            <p
              className={`text-lg font-semibold ${
                health.frontend.status === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {health.frontend.status === 'up' ? '✅ UP' : '❌ DOWN'}
            </p>
            <p className="text-gray-700 mt-2">{health.frontend.message}</p>
          </div>

          <div className="border-l-4 border-orange-600 pl-6 py-4 bg-orange-50 rounded">
            <h2 className="text-xl font-bold text-orange-800 mb-2">🔥 Backend API</h2>
            <p
              className={`text-lg font-semibold ${
                health.backend.status === 'up'
                  ? 'text-green-600'
                  : health.backend.status === 'checking'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {health.backend.status === 'up'
                ? '✅ UP'
                : health.backend.status === 'checking'
                ? '⏳ VERIFICANDO...'
                : '❌ DOWN'}
            </p>
            {health.backend.ping && (
              <p className="text-gray-700 mt-2">
                <strong>Latencia:</strong> {health.backend.ping}ms
              </p>
            )}
            {health.backend.status === 'down' && (
              <p className="text-red-600 mt-2">
                El backend no está respondiendo. Verifica que el servidor Express esté corriendo en
                el puerto 3001.
              </p>
            )}
          </div>

          <div className="border-t-2 border-orange-200 pt-6 mt-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-gray-600 text-sm mb-2">Estado General</p>
                <p className="text-2xl font-bold text-green-600">
                  {isHealthy ? '🎉 SANO' : '😞 NO SANO'}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-600 text-sm mb-2">Versión</p>
                <p className="text-2xl font-bold text-blue-600">1.0.0</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="/spots"
              className="inline-block px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition"
            >
              🌮 Ir a Garnacheros
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>🔄 Esta página se actualiza automáticamente cada 10 segundos</p>
        </div>
      </div>
    </div>
  );
}

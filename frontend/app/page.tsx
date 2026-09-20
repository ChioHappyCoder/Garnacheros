import { SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const { userId } = await auth();

  if (userId) {
    redirect('/spots');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-orange-600 mb-2">🌮 Garnacheros</h1>
          <p className="text-gray-600">Califica y descubre los mejores puestos de comida callejera</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <SignInButton redirectUrl="/spots">
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition">
              Iniciar sesión
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}

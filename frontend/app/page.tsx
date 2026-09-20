import { SignIn } from '@clerk/nextjs';
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
        <SignIn afterSignInUrl="/spots" />
      </div>
    </div>
  );
}

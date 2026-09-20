import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: '🌮 Garnacheros - Califica puestos de comida callejera',
  description:
    'Plataforma para calificar y descubrir los mejores puestos de comida callejera en CDMX y Aguascalientes',
  keywords: ['comida callejera', 'garnachas', 'puestos', 'calificaciones', 'CDMX', 'Aguascalientes'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className="bg-gray-50">{children}</body>
      </html>
    </ClerkProvider>
  );
}

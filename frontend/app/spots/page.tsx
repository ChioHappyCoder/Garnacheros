import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import SpotsList from '@/components/SpotsList';

export const metadata = {
  title: 'Puestos - Garnacheros',
};

export default async function SpotsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return (
    <div>
      <Header />
      <SpotsList />
    </div>
  );
}

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import SpotDetail from '@/components/SpotDetail';

export const metadata = {
  title: 'Detalle - Garnacheros',
};

interface SpotDetailPageProps {
  params: {
    id: string;
  };
}

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const spotId = parseInt(params.id, 10);

  if (isNaN(spotId)) {
    return <div className="text-center py-12">ID de puesto inválido</div>;
  }

  return (
    <div>
      <Header />
      <SpotDetail spotId={spotId} />
    </div>
  );
}

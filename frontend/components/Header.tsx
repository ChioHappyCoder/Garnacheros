import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/spots" className="flex items-center gap-3 hover:opacity-80 transition">
          <h1 className="text-2xl font-bold text-orange-600">🌮 Garnacheros</h1>
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}

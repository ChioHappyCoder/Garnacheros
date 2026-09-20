import { UserButton } from "@clerk/clerk-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-orange-600">🌮 Garnacheros</h1>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}

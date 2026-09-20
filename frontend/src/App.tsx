import { ClerkProvider, SignInButton, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import SpotsList from "./components/SpotsList";
import SpotDetail from "./components/SpotDetail";
import Header from "./components/Header";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AppContent() {
  const { isSignedIn } = useUser();
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-orange-600 mb-2">🌮 Garnacheros</h1>
            <p className="text-gray-600">Califica y descubre los mejores puestos de comida callejera</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <SignInButton
              redirectUrl="/spots"
              signUpUrl="/sign-up"
            >
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition">
                Iniciar sesión
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  if (selectedSpotId) {
    return (
      <div>
        <Header />
        <SpotDetail spotId={selectedSpotId} onBack={() => setSelectedSpotId(null)} />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <SpotsList
        searchTerm={searchTerm}
        selectedCity={selectedCity}
        onSelectSpot={setSelectedSpotId}
        onSearchChange={setSearchTerm}
        onCityChange={setSelectedCity}
      />
    </div>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AppContent />
    </ClerkProvider>
  );
}

export default App

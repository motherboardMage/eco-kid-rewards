
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { toast } from "@/components/ui/sonner";

const Layout = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulate loading app data
    setTimeout(() => {
      setIsInitialized(true);
      toast("Welcome to WasteWiseAI!", {
        description: "Let's learn about waste segregation!",
        position: "top-center",
      });
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <main className="flex-1 container mx-auto px-4 py-6 max-w-md flex flex-col">
        {isInitialized ? <Outlet /> : <LoadingScreen />}
      </main>
      {isInitialized && <NavBar />}
    </div>
  );
};

const LoadingScreen = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="animate-bounce-scale mb-4">
        <EarthLogo />
      </div>
      <h2 className="text-2xl font-bold text-eco-green mb-2">WasteWiseAI</h2>
      <p className="text-gray-600">Loading your eco-adventure...</p>
    </div>
  );
};

const EarthLogo = () => (
  <div className="w-24 h-24 rounded-full bg-eco-blue flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-white" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-3-7H7a5 5 0 0 1 7-4.47V7h2v2h-2v2h4v2h-2.3a5 5 0 0 1-6.7 2zm1-2h6a3 3 0 0 0-6 0z" />
    </svg>
  </div>
);

export default Layout;

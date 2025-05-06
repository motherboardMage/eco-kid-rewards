
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Camera } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import ModelInfo from "@/components/ModelInfo";
import { useEffect } from "react";
import { initializeModel } from "@/utils/wasteClassifier";

const HomePage = () => {
  const navigate = useNavigate();
  const { username, coins, level } = useUserStore();
  
  // Initialize model on app start
  useEffect(() => {
    // Start model initialization in the background
    initializeModel();
  }, []);

  const actionCards = [
    {
      title: "Scan Waste",
      description: "Use your camera to identify waste and earn rewards",
      icon: <Camera size={32} className="text-white" />,
      color: "bg-eco-green",
      action: () => navigate("/camera")
    },
    {
      title: "Check Progress",
      description: "View your waste identification progress and achievements",
      icon: <Trophy size={32} className="text-white" />,
      color: "bg-eco-orange",
      action: () => navigate("/progress")
    }
  ];
  
  return (
    <div className="flex flex-col h-full">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-eco-green">WasteWiseAI</h1>
        <p className="text-gray-600">Learning waste segregation made fun!</p>
      </header>
      
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-gray-600">Welcome{username ? `, ${username}` : ''}!</p>
          <div className="flex items-center mt-1">
            <Trophy size={18} className="text-eco-orange mr-2" />
            <span className="font-bold">Level {level}</span>
            <span className="mx-2">•</span>
            <span className="font-bold">{coins} coins</span>
          </div>
        </div>
        <ModelInfo />
      </div>
      
      <div className="space-y-4 flex-1">
        {actionCards.map((card, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer"
            onClick={card.action}
          >
            <div className="flex">
              <div className={`${card.color} p-4 flex items-center justify-center w-20`}>
                {card.icon}
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-bold text-lg">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-eco-blue/10 rounded-xl">
        <h3 className="font-bold mb-2">How to use</h3>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
          <li>Upload or take a photo of waste</li>
          <li>Our AI will identify the waste type</li>
          <li>Learn about proper disposal</li>
          <li>Earn coins and level up!</li>
        </ol>
      </div>
    </div>
  );
};

export default HomePage;

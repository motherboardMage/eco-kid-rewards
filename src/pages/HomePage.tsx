
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { Coins, Star, Gift, Camera } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const HomePage = () => {
  const { coins, level, username } = useUserStore();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  const handleDailyTip = () => {
    const tips = [
      "Paper can be recycled 5-7 times before the fibers become too short!",
      "Plastic takes up to 1000 years to decompose in landfills!",
      "Glass can be recycled indefinitely without loss of quality!",
      "Composting can reduce household waste by up to 30%!",
      "Recycling one aluminum can saves enough energy to run a TV for three hours!"
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    toast("Eco Tip of the Day", {
      description: randomTip,
      position: "top-center",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-eco-green mb-2">
          WasteWiseAI
        </h1>
        <p className="text-gray-600">
          Learn waste segregation the fun way!
        </p>
      </header>
      
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {greeting}, {username || "Eco Hero"}!
        </h2>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Coins className="text-eco-yellow mr-2" size={24} />
            <span className="font-bold">{coins}</span>
          </div>
          <div className="flex items-center">
            <Star className="text-eco-orange mr-2" size={24} />
            <span className="font-bold">Level {level}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link to="/camera" className="waste-category bg-eco-light-green/10">
          <Camera size={32} className="text-eco-green mb-2" />
          <span className="font-semibold">Scan Waste</span>
        </Link>
        <Link to="/rewards" className="waste-category bg-eco-yellow/10">
          <Gift size={32} className="text-eco-orange mb-2" />
          <span className="font-semibold">Rewards</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Today's Challenge</h3>
        <p className="text-gray-600 mb-3">
          Scan and correctly sort 5 waste items today!
        </p>
        <div className="bg-gray-100 rounded-full h-4 mb-2">
          <div className="bg-eco-green rounded-full h-4" style={{ width: "40%" }}></div>
        </div>
        <div className="text-right text-sm text-gray-600">2/5 completed</div>
      </div>

      <Button
        variant="default"
        className="bg-eco-blue hover:bg-eco-blue/90 mt-auto"
        onClick={handleDailyTip}
      >
        Eco Tip of the Day
      </Button>
    </div>
  );
};

export default HomePage;

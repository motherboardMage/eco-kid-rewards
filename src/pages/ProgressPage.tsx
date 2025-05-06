
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, ArrowRight, Star } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { wasteCategories } from "@/data/wasteData";

const ProgressPage = () => {
  const { level, totalScanned, getWasteStats } = useUserStore();
  const wasteStats = getWasteStats();
  
  const experienceToNextLevel = level * 25;
  const currentExperience = totalScanned % (level * 25);
  const experiencePercentage = Math.min(
    Math.round((currentExperience / experienceToNextLevel) * 100),
    100
  );
  
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold text-center mb-4">Your Progress</h1>
      
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center">
            <Star className="text-eco-yellow mr-2" size={20} />
            Level {level}
          </h2>
          <span className="text-sm text-gray-500">
            {currentExperience}/{experienceToNextLevel} XP
          </span>
        </div>
        <Progress value={experiencePercentage} className="h-3" />
        
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>Level {level}</span>
          <span>Level {level + 1}</span>
        </div>
      </div>
      
      <h2 className="font-bold text-xl mb-4">Waste Categories</h2>
      
      <div className="space-y-4 mb-6">
        {wasteCategories.map((category) => {
          const scannedCount = wasteStats[category.id] || 0;
          const progressPercent = Math.min(
            Math.round((scannedCount / 10) * 100), 
            100
          );
          
          return (
            <div key={category.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{category.emoji}</span>
                  <h3 className="font-bold">{category.name}</h3>
                </div>
                <span className="text-sm font-medium">
                  {scannedCount}/10
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          );
        })}
      </div>
      
      <div className="bg-eco-purple/10 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-eco-purple">Teacher's View</h3>
            <p className="text-sm text-gray-600">
              Show your progress to parents or teachers
            </p>
          </div>
          <Button size="icon" className="rounded-full bg-eco-purple hover:bg-eco-purple/90">
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-4 mt-auto">
        <div className="flex items-center">
          <Trophy className="text-eco-orange text-lg mr-3" size={24} />
          <div>
            <p className="font-bold">Total Items Scanned</p>
            <p className="text-2xl font-bold">{totalScanned}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;

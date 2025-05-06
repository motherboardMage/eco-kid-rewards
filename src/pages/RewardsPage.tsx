
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge, Gift, Sticker } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useUserStore } from "@/stores/userStore";

const RewardsPage = () => {
  const { coins, badges, stickers, unlockBadge, unlockSticker } = useUserStore();
  
  // Available rewards that can be unlocked
  const availableBadges = [
    { id: "recycler", name: "Master Recycler", cost: 20, image: "🏆" },
    { id: "biodegradable", name: "Biodegradable Expert", cost: 30, image: "🍃" },
    { id: "plastic", name: "Plastic Warrior", cost: 50, image: "🥤" },
    { id: "paper", name: "Paper Saver", cost: 25, image: "📄" },
    { id: "glass", name: "Glass Guardian", cost: 40, image: "🍶" },
  ];
  
  const availableStickers = [
    { id: "earth", name: "Happy Earth", cost: 15, image: "🌎" },
    { id: "tree", name: "Growing Tree", cost: 25, image: "🌳" },
    { id: "recycle", name: "Recycle Symbol", cost: 10, image: "♻️" },
    { id: "turtle", name: "Sea Turtle", cost: 30, image: "🐢" },
    { id: "flower", name: "Blooming Flower", cost: 20, image: "🌻" },
  ];
  
  const unlockReward = (type: "badge" | "sticker", id: string, cost: number) => {
    if (coins < cost) {
      toast("Not enough coins", {
        description: `You need ${cost} coins to unlock this ${type}.`,
        variant: "destructive"
      });
      return;
    }
    
    if (type === "badge") {
      unlockBadge(id, cost);
    } else {
      unlockSticker(id, cost);
    }
    
    toast(`${type.charAt(0).toUpperCase() + type.slice(1)} Unlocked!`, {
      description: `You've successfully unlocked a new ${type}!`,
    });
  };
  
  const isUnlocked = (type: "badge" | "sticker", id: string) => {
    return type === "badge" 
      ? badges.includes(id)
      : stickers.includes(id);
  };
  
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold text-center mb-4">Your Rewards</h1>
      
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Coins</h2>
          <div className="flex items-center">
            <span className="text-2xl mr-2">🪙</span>
            <span className="text-xl font-bold">{coins}</span>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="badges" className="flex-1">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="badges" className="text-lg">
            <Badge className="mr-2" size={18} />
            Badges
          </TabsTrigger>
          <TabsTrigger value="stickers" className="text-lg">
            <Sticker className="mr-2" size={18} />
            Stickers
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="badges" className="mt-0">
          <div className="grid grid-cols-2 gap-4">
            {availableBadges.map((badge) => (
              <RewardCard
                key={badge.id}
                name={badge.name}
                image={badge.image}
                cost={badge.cost}
                unlocked={isUnlocked("badge", badge.id)}
                onUnlock={() => unlockReward("badge", badge.id, badge.cost)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stickers" className="mt-0">
          <div className="grid grid-cols-2 gap-4">
            {availableStickers.map((sticker) => (
              <RewardCard
                key={sticker.id}
                name={sticker.name}
                image={sticker.image}
                cost={sticker.cost}
                unlocked={isUnlocked("sticker", sticker.id)}
                onUnlock={() => unlockReward("sticker", sticker.id, sticker.cost)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface RewardCardProps {
  name: string;
  image: string;
  cost: number;
  unlocked: boolean;
  onUnlock: () => void;
}

const RewardCard = ({ name, image, cost, unlocked, onUnlock }: RewardCardProps) => {
  return (
    <div className="reward-item">
      <div className="text-4xl mb-2">{image}</div>
      <h3 className="font-bold text-center">{name}</h3>
      
      {unlocked ? (
        <span className="mt-2 text-sm bg-eco-green text-white px-2 py-1 rounded-full">
          Unlocked
        </span>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 bg-eco-yellow hover:bg-eco-yellow/90 text-black"
          onClick={onUnlock}
        >
          <span className="mr-1">🪙</span> {cost} Coins
        </Button>
      )}
    </div>
  );
};

export default RewardsPage;

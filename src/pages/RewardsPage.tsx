import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

const RewardsPage = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching rewards data
    setTimeout(() => {
      setRewards([
        { id: 1, name: "Eco-Friendly Stickers", description: "A set of cool stickers!", points: 50 },
        { id: 2, name: "Plant a Tree", description: "We'll plant a tree in your name!", points: 200 },
        { id: 3, name: "Reusable Water Bottle", description: "Stay hydrated and eco-conscious.", points: 100 },
      ]);
      setLoading(false);
      toast("Rewards are here!", {
        description: "Check out the latest eco-friendly rewards!",
        position: "top-center",
      });
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading rewards...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Rewards</h1>
      <p className="mb-4">Redeem your points for these awesome rewards!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <div key={reward.id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">{reward.name}</h2>
            <p className="text-gray-700 mb-2">{reward.description}</p>
            <p className="text-green-600 font-bold">{reward.points} Points</p>
            <button
              className="mt-4 bg-eco-green text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => {
                toast("Reward Redeemed!", {
                  description: `You've redeemed ${reward.name}!`,
                  position: "top-center",
                });
              }}
            >
              Redeem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsPage;

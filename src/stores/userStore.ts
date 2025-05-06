
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WasteStats {
  [categoryId: string]: number;
}

interface UserState {
  username: string;
  coins: number;
  level: number;
  totalScanned: number;
  badges: string[];
  stickers: string[];
  wasteStats: WasteStats;
  
  // Actions
  setUsername: (name: string) => void;
  addCoins: (amount: number) => void;
  incrementTotalScanned: (categoryId: string) => void;
  unlockBadge: (badgeId: string, cost: number) => void;
  unlockSticker: (stickerId: string, cost: number) => void;
  getWasteStats: () => WasteStats;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      username: '',
      coins: 50, // Starting coins
      level: 1,
      totalScanned: 0,
      badges: [],
      stickers: [],
      wasteStats: {},
      
      setUsername: (name: string) => set({ username: name }),
      
      addCoins: (amount: number) => set((state) => ({
        coins: state.coins + amount
      })),
      
      incrementTotalScanned: (categoryId: string) => set((state) => {
        const currentCategoryCount = state.wasteStats[categoryId] || 0;
        const newTotalScanned = state.totalScanned + 1;
        const newLevel = Math.floor(newTotalScanned / 25) + 1;
        
        return {
          totalScanned: newTotalScanned,
          level: Math.max(newLevel, state.level),
          wasteStats: {
            ...state.wasteStats,
            [categoryId]: currentCategoryCount + 1
          }
        };
      }),
      
      unlockBadge: (badgeId: string, cost: number) => set((state) => ({
        badges: [...state.badges, badgeId],
        coins: state.coins - cost
      })),
      
      unlockSticker: (stickerId: string, cost: number) => set((state) => ({
        stickers: [...state.stickers, stickerId],
        coins: state.coins - cost
      })),
      
      getWasteStats: () => get().wasteStats
    }),
    {
      name: 'wastewise-user-storage'
    }
  )
);

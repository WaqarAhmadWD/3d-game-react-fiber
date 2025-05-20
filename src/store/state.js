// utils/state.js
import { create } from "zustand";

export const useGameStore = create((set, get) => ({
  isGameOver: false,
  setGameOver: (value) => set({ isGameOver: value }),

  rand: (min = -25, max = 50,notBeGrater,notBeLess) =>{
      const random = Math.floor(Math.random() * (max - min + 1)) + min;
      if(notBeGrater && notBeLess && random > notBeGrater && random < notBeLess){
        return get().rand(min,max,notBeGrater,notBeLess);
      }
    return random
  },
  boxs: [],
  setBoxs: (value = 100) => {
    const rand = get().rand;
    const boxs = Array.from({ length: value }, () => ({
      position: [rand(-25,25,-5,5), 1, rand(-25,25,-5,5)],
    }));
    set({ boxs });
  },
}));

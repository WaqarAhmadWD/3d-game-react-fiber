// utils/state.js
import { create } from "zustand";
export const useGameStore = create((set, get) => ({
  isGameOver: false,
  setGameOver: (value) => set({ isGameOver: value }),
  rand: (min = -25, max = 50,notBeGrater,notBeLess) =>{
      const random = Math.floor(Math.random() * (max - min + 1)) + min;
      if(notBeGrater && notBeLess && random > notBeGrater && random < notBeLess){
        return null;
      }
    return random
  },
  boxs: [],
  setBoxs: ({count=100,range=[-25,25],skip=[]}) => {
    const rand = get().rand;
   const boxs = Array.from({ length: count }, () => {
  const [minRange, maxRange] = range;
  const [minSkip, maxSkip] = skip;

  const randx = rand(minRange, maxRange, minSkip, maxSkip);
  const randz = rand(minRange, maxRange, minSkip, maxSkip);

  return (randx && randz)
    ? { position: [randx, 1, randz] }
    : null;
}).filter(Boolean);
    set({ boxs });
  },
}));

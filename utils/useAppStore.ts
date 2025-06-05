import { create } from 'zustand';

type AppState = {
  newWorkoutDate: Date; // IDK if string
  setNewWorkoutDate: (newDate: Date) => void;
  
  //... other states
};

export const useAppStore = create<AppState>((set) => ({
  newWorkoutDate: new Date(),
  setNewWorkoutDate: (newDate) => set({ newWorkoutDate: newDate }),

}));
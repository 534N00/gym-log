import { create } from 'zustand';

// TODO: Populate based on MMKV
interface OptionsStore {
    exerciseOptions: string[];
    updateExercises: (ops: string[]) => void;
    variantOptions: string[];
    updateVariants: (ops: string[]) => void;
    refresh: boolean;
    triggerRefresh: () => void;
};

export const useOptionsStore = create<OptionsStore>((set) => {
    return {
        exerciseOptions: ["Benchpress","Back Squat","Deadlift"],
        updateExercises: (exerciseOptions) => set({ exerciseOptions }),
        variantOptions: ["Barbell", "Dumbbell", "Cybexy"],
        updateVariants: (variantOptions) => set({ variantOptions }),
        refresh: false,
        triggerRefresh: () => set((state) => ({ refresh: !state.refresh })),
    };
});
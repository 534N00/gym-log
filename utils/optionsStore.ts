import { create } from 'zustand';
import { getExerciseNames, insertExerciseName, deleteExerciseNames, getVariantNames, insertVariantName, deleteVariantNames } from './database';

// TODO: Populate futher based on MMKV and SQLite
interface OptionsStore {
    exerciseOptions: string[];
    addExercise: (name: string) => void;
    removeExercises: (names: string[]) => void;
    variantOptions: string[];
    addVariant: (name: string) => void;
    removeVariants: (names: string[]) => void;

    refresh: boolean;
    triggerRefresh: () => void;
};

export const useOptionsStore = create<OptionsStore>((set) => {
    const LIMIT = 1000, OFFSET = 0;
    return {
        // Initial load from DB
        exerciseOptions: getExerciseNames(LIMIT, OFFSET),
        variantOptions: getVariantNames(LIMIT, OFFSET),

        // Functions for modifying state and DB together
        addExercise: (name) => {
            insertExerciseName(name);
            set((state) => ({
                exerciseOptions: [name, ...state.exerciseOptions]
            }));
        },
        removeExercises: (names) => {
            deleteExerciseNames(names);
            set((state) => ({
                exerciseOptions: state.exerciseOptions.filter(n => !names.includes(n))
            }));
        },
        addVariant: (name: string) => {
            insertVariantName(name);
            set((state) => ({
                variantOptions: [name, ...state.variantOptions]
            }));
        },
        removeVariants: (names) => {
            deleteVariantNames(names);
            set((state) => ({
                variantOptions: state.variantOptions.filter(n => !names.includes(n))
            }));
        },

        // Trigger to cause requery of data
        refresh: false,
        triggerRefresh: () => set((state) => ({ refresh: !state.refresh })),

        // User preferences goes here
    };
});
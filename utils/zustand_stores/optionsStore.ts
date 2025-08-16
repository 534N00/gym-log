import { create } from "zustand";
import { getExerciseNames, getVariantNames } from "../database/databaseGetters";
import {
    deleteExerciseNames,
    deleteVariantNames,
    insertExerciseName,
    insertVariantName,
} from "../database/databaseSetters";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface OptionsStore {
    // User added exercises and variants
    exerciseOptions: string[];
    addExercise: (name: string) => void;
    removeExercises: (names: string[]) => void;
    variantOptions: string[];
    addVariant: (name: string) => void;
    removeVariants: (names: string[]) => void;
    initExerciseVariantOptions: () => void;
    resetOptionsStore: () => void;

    // Refresh trigger for updating callendar
    refresh: boolean;
    triggerRefresh: () => void;

    // User preferences
    userName: string;
    setUserName: (name: string) => void;
}

/**
 * Access store for user preferences and user added exercise/variant options
 */
export const useOptionsStore = create<OptionsStore>((set) => {
    const LIMIT = 1000,
        OFFSET = 0;
    return {
        resetOptionsStore: () => {
            set({
                exerciseOptions: [],
                variantOptions: [],
            });
        },
        userName: "",
        setUserName: (name) => {
            AsyncStorage.setItem("userName", name);
            set(() => ({ userName: name }));
        },
        // Initial load from DB
        exerciseOptions: [],
        variantOptions: [],

        // Initial load of user added exercises and variants from DB.
        // To be called after database is initialized.
        initExerciseVariantOptions: () => {
            set({
                exerciseOptions: getExerciseNames(LIMIT, OFFSET),
                variantOptions: getVariantNames(LIMIT, OFFSET),
            });
        },

        // Functions for modifying state and DB together
        addExercise: (name) => {
            if (insertExerciseName(name)) {
                // Only add if insertion succeeds (no duplicate and non-empty name)
                set((state) => ({
                    exerciseOptions: [name, ...state.exerciseOptions],
                }));
            }
        },
        removeExercises: (names) => {
            deleteExerciseNames(names);
            set((state) => ({
                exerciseOptions: state.exerciseOptions.filter(
                    (n) => !names.includes(n)
                ),
            }));
        },
        addVariant: (name: string) => {
            if (insertVariantName(name)) {
                set((state) => ({
                    variantOptions: [name, ...state.variantOptions],
                }));
            }
        },
        removeVariants: (names) => {
            deleteVariantNames(names);
            set((state) => ({
                variantOptions: state.variantOptions.filter(
                    (n) => !names.includes(n)
                ),
            }));
        },

        // Trigger to cause requery of data
        refresh: false,
        triggerRefresh: () => set((state) => ({ refresh: !state.refresh })),

        // User preferences goes here
    };
});

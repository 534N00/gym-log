import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOptionsStore } from "./zustand_stores/optionsStore";
import { ExerciseState, useNewWorkoutStore } from "./zustand_stores/newWorkoutStore";

interface NewWorkoutSaveState {
    date: Date;
    notes: string;
    tagColor: string;
    exerciseOrder: string[];
    exercises: Record<string, ExerciseState>;
}

/**
 * Hydrates Zustand stores from AsyncStorage.
 * 
 * This function retrieves the values from AsyncStorage for the keys "userName" and "newWorkout".
 * If either keys are present, the corresponding Zustand stores are updated with the retrieved values.
 * @throws {Error} If there is an error saving retrieving or hydrating values.
 */
export const hydrateStoreFromAsyncStorage = async () => {
    try {
        // Get AsyncStorage values
        const userName = await AsyncStorage.getItem("userName");
        const newWorkoutJson = await AsyncStorage.getItem("newWorkout");

        useOptionsStore.getState().setUserName(userName || "");
        let newWorkoutState: NewWorkoutSaveState | null = null;
        if (newWorkoutJson) {
            newWorkoutState = JSON.parse(newWorkoutJson) as NewWorkoutSaveState;
            useNewWorkoutStore.getState().setDate(new Date(newWorkoutState?.date));
            useNewWorkoutStore.getState().setNewNotes(newWorkoutState?.notes);
            useNewWorkoutStore.getState().setNewTagColor(newWorkoutState?.tagColor);
            useNewWorkoutStore.getState().setExerciseOrder(newWorkoutState?.exerciseOrder);
            useNewWorkoutStore.getState().setExercises(newWorkoutState?.exercises);
        }       
    } catch (e) {
        console.error("Error hydrating store from async storage:", e);
    }
};

/**
 * Saves the current new workout to AsyncStorage.
 * 
 * This function retrieves the current state of the new workout from the newWorkoutStore and saves it to AsyncStorage.
 * The new workout is saved with the key "newWorkout" and the state is saved as a JSON string.
 * 
 * @throws {Error} If there is an error saving the new workout to AsyncStorage.
 */
export const saveNewWorkoutToAsyncStorage = async () => {
    try {
        const date = useNewWorkoutStore.getState().date;
        const notes = useNewWorkoutStore.getState().notes;
        const tagColor = useNewWorkoutStore.getState().tagColor;
        const exerciseOrder = useNewWorkoutStore.getState().exerciseOrder;
        const exercises = useNewWorkoutStore.getState().exercises;

        AsyncStorage.setItem("newWorkout", JSON.stringify({ date, notes, tagColor, exerciseOrder, exercises }));
    } catch (e) {
        console.error("Error saving new workout to async storage:", e);
    }
};

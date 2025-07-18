import { nanoid } from "nanoid"; // Generates unique ids for referencing in state
import "react-native-get-random-values"; // Gives crypto functionality that nanoid is expecting
import { create } from "zustand";
import { triggerHaptic } from "../haptics";

export interface ExerciseState {
    id: string;
    name: string;
    variant: string;
    setOrder: string[];
    sets: Record<string, SetState>;
}

export interface SetState {
    id: string;
    resistance: number;
    reps: number;
    is_drop: number;
    has_partials: number;
    is_uni: number;
}

interface WorkoutState {
    date: Date;
    notes: string;
    tagColor: string;
    exerciseOrder: string[];
    exercises: Record<string, ExerciseState>;

    // Workout updates
    setDate: (date: Date) => void;
    setNewNotes: (notes: string) => void;
    setNewTagColor: (tagColor: string) => void;
    resetWorkout: () => void;

    // Exercise updates
    addExercise: () => void;
    updateExercise: (
        exerciseId: string,
        changes: Partial<ExerciseState>
    ) => void;
    removeExercise: (exerciseId: string) => void;

    addSet: (exerciseId: string) => void;
    updateSet: (
        exerciseId: string,
        setId: string,
        changes: Partial<SetState>
    ) => void;
    removeSet: (exerciseId: string, setId: string) => void;
}

/**
 * Initializes the default state of the store.
 *
 * This function is used to initialize the store upon creation. It generates
 * a new exercise with a single set and sets the tag color to a default orange.
 * The date is set to the current date, and the notes are set to an empty string.
 * The id's of the exercise and set are generated using nanoid.
 *
 * @returns The initial state of the store
 */
const setInitialState = () => {
    const initialExerciseId = nanoid();
    const initialSetId = nanoid();
    return {
        date: new Date(),
        notes: "",
        tagColor: "#FF5733",
        exerciseOrder: [initialExerciseId],
        exercises: {
            [initialExerciseId]: {
                id: initialExerciseId,
                name: "n/a",
                variant: "n/a",
                setOrder: [initialSetId],
                sets: {
                    [initialSetId]: {
                        id: initialSetId,
                        resistance: 0,
                        reps: 0,
                        is_drop: 0,
                        has_partials: 0,
                        is_uni: 0,
                    },
                },
            },
        },
    };
};

/**
 * Access store for new_workout screen
 */
export const useNewWorkoutStore = create<WorkoutState>((set, get) => {
    return {
        ...setInitialState(),
        refresh: false,
        setDate: (date) => set({ date }),
        setNewNotes: (notes) => set({ notes }),
        setNewTagColor: (tagColor) => set({ tagColor }),

        /**
         * Return to initial state
         */
        resetWorkout: () => set(setInitialState()),

        addExercise: () => {
            triggerHaptic("tap"); // function is used for buttons so haptic trigger here
            // Generate new ids
            const id = nanoid();
            const initialSetId = nanoid();
            const newExercise: ExerciseState = {
                id,
                name: "",
                variant: "",
                setOrder: [initialSetId],
                sets: {
                    [initialSetId]: {
                        id: initialSetId,
                        resistance: 0,
                        reps: 0,
                        is_drop: 0,
                        has_partials: 0,
                        is_uni: 0,
                    },
                },
            };
            set((state) => ({
                exerciseOrder: [...state.exerciseOrder, id], // append new exercise to list
                exercises: {
                    // and add exercise to dict
                    ...state.exercises,
                    [id]: newExercise,
                },
            }));
        },

        addSet: (exerciseId) => {
            triggerHaptic("tap");
            set((state) => {
                const exercise = state.exercises[exerciseId];
                if (!exercise) {
                    return { ...state };
                } // return a shallow copy of state if not found
                const id = nanoid();
                const newSet: SetState = {
                    id,
                    reps: 0,
                    resistance: 0,
                    is_drop: 0,
                    has_partials: 0,
                    is_uni: 0,
                };
                return {
                    exercises: {
                        // access exercise in question
                        ...state.exercises,
                        [exerciseId]: {
                            ...exercise,
                            setOrder: [...exercise.setOrder, id], // append a new set to exercise
                            sets: {
                                ...exercise.sets,
                                [id]: newSet,
                            },
                        },
                    },
                };
            });
        },

        updateExercise: (exerciseId, changes) => {
            set((state) => {
                const exercise = state.exercises[exerciseId];
                return {
                    exercises: {
                        ...state.exercises,
                        [exerciseId]: { ...exercise, ...changes },
                    },
                };
            });
        },

        updateSet: (exerciseId, setId, changes) => {
            set((state) => {
                const exercise = state.exercises[exerciseId];
                const targetSet = exercise?.sets[setId];
                if (!targetSet) {
                    return state;
                }

                return {
                    exercises: {
                        ...state.exercises,
                        [exerciseId]: {
                            ...exercise,
                            sets: {
                                ...exercise.sets,
                                // Keep set set information for exercise update only updated stuff (spread original, then spread updates)
                                [setId]: { ...targetSet, ...changes },
                            },
                        },
                    },
                };
            });
        },

        removeExercise: (exerciseId) => {
            triggerHaptic("tap");
            const { [exerciseId]: _, ...remaining } = get().exercises; // Get the exercises dict minus what we're deleting
            set((state) => ({
                exerciseOrder: state.exerciseOrder.filter(
                    (eid) => eid !== exerciseId
                ), // Remove exerciseId from ordering
                exercises: remaining, // Set in place exercises minus deleted one
            }));
        },

        removeSet: (exerciseId, setId) => {
            triggerHaptic("tap");
            set((state) => {
                const exercise = state.exercises[exerciseId];
                if (!exercise) {
                    return state;
                }
                const { [setId]: _, ...remaining } = exercise.sets;
                return {
                    exercises: {
                        ...state.exercises,
                        [exerciseId]: {
                            ...exercise,
                            setOrder: exercise.setOrder.filter(
                                (sid) => sid !== setId
                            ),
                            sets: remaining,
                        },
                    },
                };
            });
        },
    };
});

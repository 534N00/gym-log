import { create } from 'zustand';
import 'react-native-get-random-values'; // Gives crypto functionality that nanoid is expecting
import { nanoid } from 'nanoid';

export interface ExerciseState {
  id: string;
  name: string;
  variant: string;
  setOrder: string[];
  sets: Record<string, SetState>
};

export interface SetState {
  id: string
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
  setCurrentNotes: (notes: string) => void;
  setCurrentTagColor: (tagColor: string) => void;
  resetWorkout: () => void;
  
  // Exercise updates
  addExercise: () => void;
  updateExercise: (exerciseId: string, changes: Partial<ExerciseState>) => void;
  removeExercise: (exerciseId: string) => void;

  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setId: string, changes: Partial<SetState>) => void;
  removeSet: (exerciseId: string, setId: string) => void;
}

const setInitialState = () => {
  const initialExerciseId = nanoid();
  const initialSetId = nanoid();
  
  return {
    date: new Date(),
    notes: '',
    tagColor: '#FF5733',
    exerciseOrder: [initialExerciseId],
    exercises: {
      [initialExerciseId]: {
        id: initialExerciseId,
        name: 'n/a',
        variant: 'n/a',
        setOrder: [initialSetId],
        sets: {
          [initialSetId]: {
            id: initialSetId,
            resistance: 0,
            reps: 0,
            is_drop: 0,
            has_partials: 0,
            is_uni: 0
          }
        }
      },
    }
  };
};


export const useCurrentWorkoutStore = create<WorkoutState>((set, get) => {  
  return {
    ...setInitialState(),
    setDate: (date) => set({ date }),
    setCurrentNotes: (notes) => set({ notes }),
    setCurrentTagColor: (tagColor) => set({ tagColor }),

    resetWorkout: () => set(setInitialState()),

    addExercise: () => {
      // Generate new ids
      const id = nanoid();
      const initialSetId = nanoid();
      const newExercise: ExerciseState = {
        id, name: '', variant: '', setOrder: [initialSetId],
        sets: {[initialSetId]: {
          id: initialSetId, resistance: 0, reps: 0,
          is_drop: 0, has_partials: 0, is_uni: 0
        }}
      };

      set((state) => ({
        exerciseOrder: [...state.exerciseOrder, id], // append new exercise to list
        exercises: { // and add exercise to dict
          ...state.exercises,
          [id]: newExercise
        }
      }));
    },

    addSet: (exerciseId) => {  
      set((state) => {
        const exercise = state.exercises[exerciseId];
        if (!exercise) { return { ...state }; } // return a shallow copy of state if not found
        
        const id = nanoid();   
        const newSet: SetState = {
          id, reps: 0, resistance: 0, is_drop: 0, has_partials: 0, is_uni: 0
        };
        
        return {
          exercises: { // access exercise in question
            ...state.exercises,
            [exerciseId]: {
              ...exercise,
              setOrder: [...exercise.setOrder, id], // append a new set to exercise
              sets: {
                ...exercise.sets,
                [id]: newSet
              }
            }
          }
        };
      });
    },

    updateExercise: (exerciseId, changes) => {
      set((state) => {
        const exercise = state.exercises[exerciseId];
        return {
          exercises: {
            ...state.exercises,
            [exerciseId]: { ...exercise, ...changes }
          }
        };
      });
    },

    updateSet: (exerciseId, setId, changes) => {
      set((state) => {
        const exercise = state.exercises[exerciseId];
        const targetSet = exercise?.sets[setId];
        if (!targetSet) { return state; }
        
        return {
          exercises: {
            ...state.exercises,
            [exerciseId]: {
              ...exercise,
              sets: {
                ...exercise.sets,
                // Keep set set information for exercise update only updated stuff (spread original, then spread updates)
                [setId]: { ...targetSet, ...changes },
              }
            }
          }
        }
      });
    },

    removeExercise: (exerciseId) => {
      const { [exerciseId]: _, ...remaining } = get().exercises; // Get the exercises dict minus what we're deleting
      set((state) => ({
        exerciseOrder: state.exerciseOrder.filter((eid) => eid !== exerciseId), // Remove exerciseId from ordering
        exercises: remaining // Set in place exercises minus deleted one
      }));
    },

    removeSet: (exerciseId, setId) => {
      set((state) => {
        const exercise = state.exercises[exerciseId];
        if (!exercise) { return state; }

        const { [setId]: _, ...remaining } = exercise.sets;
        return {
          exercises: {
            ...state.exercises,
            [exerciseId]: {
              ...exercise,
              setOrder: exercise.setOrder.filter((sid) => sid !== setId),
              sets: remaining,
            }
          }
        };
      });
    }
  }
});
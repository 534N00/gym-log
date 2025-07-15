import { create } from 'zustand';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import { ExerciseState, SetState } from './newWorkoutStore';
import  { CompleteWorkout, CompleteExercise, CompleteSet } from './database';


// NOTE: Could mirror/import WorkoutState from newWorkoutStore.ts
// but I don't need editabilty right now.
interface PastWorkoutState {
    date: Date;
    notes: string;
    tagColor: string;
    exerciseOrder: string[];
    exercises: Record<string, ExerciseState>;
    setPastWorkout: (workout_data: CompleteWorkout) => void;
};

export const usePastWorkoutStore = create<PastWorkoutState>((set) => {
    return  {
        date: new Date("2024-03-14"), // PI day!
        notes: '',
        tagColor: '',
        exerciseOrder: [],
        exercises: {},

        setPastWorkout: (workout_data) => {
            // Generate temporary ids for each exercise for rendering
            let eId: string;
            const exerciseOrderCPY: string[] = [];
            const exercisesCPY: Record<string, ExerciseState> = {};
            // Go through each CompleteExercise from DB and convert to ExerciseState
            for (const exercise of workout_data.exercises as CompleteExercise[]) {
                eId = nanoid();
                exerciseOrderCPY.push(eId);
                const setsCPY: Record<string, SetState> = {}, setOrderCPY: string[] = [];
                let setId: string;
                // Convert CompleteSet to SetState
                for (const set of exercise.sets as CompleteSet[]) {
                    setId = nanoid();
                    setOrderCPY.push(setId);
                    // Build SetState
                    setsCPY[setId] = { id: setId,
                                       resistance: set.resistance,
                                       reps: set.reps,
                                       is_drop: set.is_drop,
                                       has_partials: set.has_partials,
                                       is_uni: set.is_uni } as SetState;
                }
                // Build ExerciseState
                exercisesCPY[eId] = { id: eId,
                                      name: exercise.name,
                                      variant: exercise.variant,
                                      setOrder: setOrderCPY,
                                      sets: setsCPY } as ExerciseState;
            }
            // Build WorkoutState
            set(() => ({
                date: workout_data.date_obj,
                notes: workout_data.notes,
                tagColor: workout_data.tag_color,
                exerciseOrder: exerciseOrderCPY,
                exercises: exercisesCPY
            } as PastWorkoutState));
        },
    };
});

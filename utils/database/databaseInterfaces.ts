// Database input, output, and return interfaces

// Database input interfaces
export interface WorkoutData {
    date: Date;
    notes?: string;
    tag_color: string;
    exercises: ExerciseData[];
}

export interface ExerciseData {
    name: string;
    variant?: string;
    sets: SetData[];
}

export interface SetData {
    resistance?: number;
    reps: number;
    is_drop?: number;
    has_partials?: number;
    is_uni?: number;
}

// Database output interfaces (what comes back from queries)
export interface WorkoutFromDB {
    date: number; // Unix timestamp
    notes: string | null;
    tag_color: string;
}

export interface ExerciseFromDB {
    date: number;
    pos: number;
    name: string;
    variant: string | null;
}

export interface SetFromDB {
    date: number;
    exercise_pos: number;
    pos: number;
    resistance: number | null;
    reps: number;
    is_drop: number | null;
    has_partials: number | null;
    is_uni: number | null;
}

// Return interfaces (what functions return)
export interface CompleteWorkout {
    date: number;
    notes: string;
    tag_color: string;
    date_obj: Date;
    exercises: CompleteExercise[];
}

export interface CompleteExercise {
    name: string;
    variant: string;
    sets: CompleteSet[];
}

// CompleteExerciseDate for when still needing date
export interface CompleteExerciseDate {
    date: number;
    name: string;
    variant: string;
    sets: CompleteSet[];
}

export interface CompleteSet {
    resistance: number;
    reps: number;
    is_drop: number;
    has_partials: number;
    is_uni: number;
}

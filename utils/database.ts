import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('workouts.db');

/**
 * Init database instance in app for use wherever
 */
export const initDatabase = () => {
    try {
        db.execSync( // Run SQL code that doesn't return data
            `
            CREATE TABLE IF NOT EXISTS workouts (
                date INTEGER PRIMARY KEY, -- Unix timestamp
                notes TEXT,
                tag_color TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS exercises (
                date INTEGER,
                pos INTEGER, -- position in ordering
                name TEXT NOT NULL,
                variant TEXT,
                PRIMARY KEY (date, pos),
                FOREIGN KEY (date) REFERENCES workouts(date)
            );

            CREATE TABLE IF NOT EXISTS sets (
                date INTEGER,
                exercise_pos INTEGER,
                pos INTEGER, -- ordering
                resistance REAL,
                reps REAL NOT NULL,
                is_drop INTEGER, -- bool for dropsets
                has_partials INTEGER, -- bool for partial reps done
                is_uni INTEGER, -- bool for unilateral movement
                PRIMARY KEY (date, exercise_pos, pos),
                FOREIGN KEY (date, exercise_pos) REFERENCES exercises(date, pos)
            );
            `
        );
    } catch (error) {
        console.error("Error initializing databse:", error);
        throw error;
    }
};

export const resetDatabase = () => {
    try {
        db.execSync(`
            DELETE FROM sets;
            DELETE FROM exercises;
            DELETE FROM workouts;
        `);
        db.execSync(`VACUUM;`); // To reclaim space after deletion
        console.log("DB reset");
    } catch (e) {
        console.error("DB reset fail:", e);
        throw e;
    }
}

// Input interfaces (for inserting data)
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

// Database result interfaces (what comes back from queries)
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
// CompleteWorkout, CompleteExercise, CompleteSet for when returning full workout
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
    is_uni: number ;
}



/**
 * Helper for insertWorkout that converts date obejct to Unix date integer
 * @param date Date object
 * @returns A Unix timestamp number
 */
const dateToUnix = (date: Date): number => {
    return Math.floor(date.getTime() / 1000);
};

const dateStringToUnixRange = (dateString: string): [number, number] => {
    const startOfDay = new Date(dateString);
    const endOfDay = new Date(dateString + 'T23:59:59');
    return [dateToUnix(startOfDay), dateToUnix(endOfDay)];
};

/**
 * Helper for converting from Unix date integer to date object
 * @param timestamp A Unix timestamp number
 * @returns Date object
 */
export const unixToDate = (timestamp: number): Date => {
    return new Date(timestamp * 1000);
};

/**
 * For inserting a full log when a workout is complete
 * @param workoutData Full workout data of exercises and sets to input into DB
 */
export const insertWorkout = (workoutData: WorkoutData): number => {
    try {
        // Insert workout
        const unixTimestamp = dateToUnix(workoutData.date);
        const workoutResult = db.runSync( // modify data and get metadata about operation
            'INSERT INTO workouts (date, notes, tag_color) VALUES (?,?,?)',
            [unixTimestamp, workoutData.notes || null, workoutData.tag_color]
        );
        const date_id = workoutResult.lastInsertRowId as number;

        // Insert workout's exercises
        const exercises = workoutData.exercises;
        for (let i=0; i<exercises.length; i++) {
            const exerciseResult = db.runSync(
                'INSERT INTO exercises (date, pos, name, variant) VALUES (?,?,?,?)',
                [date_id, i+1, exercises[i].name, exercises[i].variant || '']
            );
            
            // Insert exercise's sets
            const sets = exercises[i].sets;
            for (let j=0; j<sets.length; j++) {
                const setResult = db.runSync(
                    'INSERT INTO sets (date, exercise_pos, pos, resistance, reps, is_drop, has_partials, is_uni) VALUES (?,?,?,?,?,?,?,?)',
                    [date_id, i+1, j+1, sets[j].resistance || '', sets[j].reps, sets[j].is_drop || 0, sets[j].has_partials || 0, sets[j].is_uni || 0]
                );
            }
        }
        return date_id;
    } catch (error) {
        console.error("Error inserting complete workout:", error);
        throw error;
    }
};

/**
 * Gets basic workout information for recent `limit` many workouts.
 * @param limit how many workouts to retrieve
 * @returns List of base information for workouts
 */
export const getRecentWorkoutPreviews = (limit?: number): WorkoutFromDB[] => {
    try {
        const sql = limit ? 'SELECT * FROM workouts ORDER BY date DESC LIMIT ?' : 'SELECT * FROM workouts ORDER BY date DESC';
        const params = limit ? [limit] : [];
        const previews = db.getAllSync(sql, params) as WorkoutFromDB[];
        return previews;
    } catch (error) {
        console.error(`Error fetching workouts previews:`, error);
        throw error;
    }
};

/**
 * Gets basic workout information for workouts that occured on date specified by dateString.
 * @param dateString String date of form YYYY-MM-DD
 * @param limit Number of previews to get (default 6)
 * @returns List of base information for workouts
 */
export const getWorkoutPreviewsByDate = (dateString: string, limit: number = 6): WorkoutFromDB[] => {
    const [start, end] = dateStringToUnixRange(dateString);
    try {
        const sql = 'SELECT * FROM workouts WHERE date BETWEEN ? AND ? ORDER BY date LIMIT ?';
        const previews = db.getAllSync(sql, [start, end, limit]) as WorkoutFromDB[];
        return previews;
    } catch (e) {
        console.error(`Error fetching workout previews for (${dateString}):`, e);
        throw e;
    }
};

/**
 * Retrieves full data of one workout
 * @param date_id The Unix timestamp of the workout (would already have been availiable when getRecentWorkoutPreviews is used for UI rendering)
 * @returns CompleteWorkout object of data for workout, all exercises, and all sets of exercises
 */
export const getCompleteWorkout = (date_id: number): CompleteWorkout | null => {
    try {
        // Get base workout info
        const workout = db.getFirstSync('SELECT * FROM workouts WHERE date = ?', [date_id]) as WorkoutFromDB | null;
        if (!workout) { return null; } // If workout somehow doens't exist (shouln't be the case though)
        
        // Get exercises
        const exercises = db.getAllSync('SELECT * FROM exercises WHERE date = ? ORDER BY pos', [date_id]) as ExerciseFromDB[];

        // Get sets for each exercise and use combined DB information
        // to build out the full workout as one object
        const completedExercises: CompleteExercise[] = exercises.map(exercise => {
            // Get raw set DB rows
            const setsFromDb = db.getAllSync(`SELECT *
                                        FROM sets
                                        WHERE date=? AND exercise_pos=?
                                        ORDER BY pos`,
                            [date_id, exercise.pos]) as SetFromDB[];
            // Remove `date`, `exercise_pos`, and `pos` keys from objects (unnecessary) and retype
            // Also give values to anything that is in the db as null
            const sets: CompleteSet[] = setsFromDb.map(({ date, exercise_pos, pos, resistance, reps, is_drop, has_partials, is_uni }) => ({
                resistance: resistance ?? 0, reps: reps ?? 0, is_drop: is_drop ?? 0, has_partials: has_partials ?? 0, is_uni: is_uni ?? 0
            }));
            return {
                name: exercise.name,
                variant: exercise.variant,
                sets: sets
            } as CompleteExercise;
        });

        return {
            date: workout.date,
            notes: workout.notes || '',
            tag_color: workout.tag_color,
            date_obj: unixToDate(workout.date),
            exercises: completedExercises
        };
    } catch (error) {
        console.error('Error fetching complete workout:', error);
        throw error;
    }
};

/**
 * For getting recent instances where you did a 'preacher curl' or a 'chest press' etc.
 * @param name Name of the exercise sought for
 * @param count Number of instances of that exercise to retreive
 * @returns List of CompleteExercise objects will full data for sets
 */
export const getRecentSameExercise = (name: string, count: number, variant?: string): CompleteExercise[] => {
    try {
        const exercises = variant ? db.getAllSync('SELECT * FROM exercises WHERE name=? AND variant=? ORDER BY date DESC LIMIT ?', [name, variant, count]) as ExerciseFromDB[]
                                  : db.getAllSync('SELECT * FROM exercises WHERE name=? ORDER BY date DESC LIMIT ?', [name, count]) as ExerciseFromDB[];
        const completedExercises: CompleteExerciseDate[] = exercises.map(exercise => {
            const setsFromDb = db.getAllSync('SELECT * FROM sets WHERE date=? AND exercise_pos=? ORDER BY pos', [exercise.date, exercise.pos]) as SetFromDB[];
            const sets: CompleteSet[] = setsFromDb.map(({ resistance, reps, is_drop, has_partials, is_uni, ...rest }) => ({
                resistance: resistance ?? 0, reps: reps ?? 0, is_drop: is_drop ?? 0, has_partials: has_partials ?? 0, is_uni: is_uni ?? 0
            }));
            return {
                date: exercise.date,
                name: exercise.name,
                variant: exercise.variant || '',
                sets: sets
            };
        });
        return completedExercises;
    } catch (error) {
        console.error(`Error fetching exercises of name "${name}":`, error);
        throw error;
    }
};

import * as SQLite from 'expo-sqlite';
import * as types from './databaseInterfaces';

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

            -- Table representations of lists so I have mutability and long-term storage
            CREATE TABLE IF NOT EXISTS exercise_names (
                name TEXT PRIMARY KEY
            );

            CREATE TABLE IF NOT EXISTS variant_names (
                name TEXT PRIMARY KEY
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
            DELETE FROM exercise_names;
            DELETE FROM variant_names;
            VACUUM; -- reclaim space after deletion
        `);
        console.log("DB reset");
    } catch (e) {
        console.error("DB reset fail:", e);
        throw e;
    }
}

// Gather limit many exercise names after the offset
    // Ex: getExerciseNames(10,20) to get names 20-29
export const getExerciseNames = (limit: number = 10, offset: number = 0): string[] => {
    try {
        const rows = db.getAllSync(
            'SELECT name FROM exercise_names ORDER BY name LIMIT ? OFFSET ?',
            [limit, offset] 
        ) as { name: string }[];
        return rows.map(row => row.name);
    } catch (e) {
        console.error('Error fetching exercise names:', e);
        throw e;
    }
};

export const insertExerciseName = (name: string): void => {
    if (name === '') { return; }
    try {
        db.runSync('INSERT OR IGNORE INTO exercise_names (name) VALUES (?)', [name]);
    } catch (e) {
        console.error('Error inserting exercise name:', e);
        throw e;
    }
};

export const deleteExerciseNames = (names: string[]): void => {
    if (names.length === 0) { return; }
    try {
        const placeholders = names.map(() => '?').join(', ');
        db.runSync(`DELETE FROM exercise_names WHERE name IN (${placeholders})`, names);
    } catch (e) {
        console.error('Error deleting exercise names:', e);
        throw e;
    }
};

// Gather limit many variant names after the offset
export const getVariantNames = (limit: number = 10, offset: number = 0): string[] => {
    try {
        const rows = db.getAllSync(
            'SELECT name FROM variant_names ORDER BY name LIMIT ? OFFSET ?',
            [limit, offset]
        ) as { name: string }[];
        return rows.map(row => row.name);
    } catch (e) {
        console.error('Error fetching variant names:', e);
        throw e;
    }
};

export const insertVariantName = (name: string): void =>  {
    if (name === '') { return; }
    try {
        db.runSync('INSERT OR IGNORE INTO variant_names (name) VALUES (?)', [name]);
    } catch (e) {
        console.error('Error inserting variant name:', e);
        throw e;
    }
};

export const deleteVariantNames = (names: string[]): void => {
    if (names.length === 0) { return; }
    try {
        const placeholders = names.map(() => '?').join(', ');
        db.runSync(`DELETE FROM variant_names WHERE name IN (${placeholders})`, names);
    } catch (e) {
        console.error('Error deleting variant names:', e);
        throw e;
    }
};

/**
 * Converts date obejct to Unix date integer
 * @param date Date object
 * @returns A Unix timestamp number
 */
const dateToUnix = (date: Date): number => {
    return Math.floor(date.getTime() / 1000);
};

/**
 * Converts given date string to a unix date range
 * around the start and end of that day
 * @param dateString
 * @returns list of two numbers, start unix date number and end unix date number.
 */
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
export const insertWorkout = (workoutData: types.WorkoutData): number => {
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
            db.runSync(
                'INSERT INTO exercises (date, pos, name, variant) VALUES (?,?,?,?)',
                [date_id, i+1, exercises[i].name, exercises[i].variant || '']
            );
            
            // Insert exercise's sets
            const sets = exercises[i].sets;
            for (let j=0; j<sets.length; j++) {
                db.runSync(
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

export const getMostRecentDate = (): Date | null => {
    try {
        const dateNum = db.getFirstSync('SELECT MAX(date) FROM workouts') as any;
        if (dateNum['MAX(date)'] == null) { return null; }
        const date = unixToDate(dateNum['MAX(date)']);
        return date;
    } catch (e) {
        console.error("Error fetching most recent date:", e);
        throw e;
    }
};

/**
 * Gets basic workout information for recent `limit` many workouts.
 * @param limit how many workouts to retrieve
 * @returns List of base information for workouts
 */
export const getRecentWorkoutPreviews = (limit?: number, offset: number=0): types.WorkoutFromDB[] => {
    try {
        // Get limited many or all
        const sql = limit ? 'SELECT * FROM workouts ORDER BY date DESC LIMIT ? OFFSET ?' : 'SELECT * FROM workouts ORDER BY date DESC';
        const params = limit ? [limit, offset] : [];
        const previews = db.getAllSync(sql, params) as types.WorkoutFromDB[];
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
export const getWorkoutPreviewsByDate = (dateString: string, limit: number = 6): types.WorkoutFromDB[] => {
    const [start, end] = dateStringToUnixRange(dateString);
    try {
        const sql = 'SELECT * FROM workouts WHERE date BETWEEN ? AND ? ORDER BY date LIMIT ?';
        const previews = db.getAllSync(sql, [start, end, limit]) as types.WorkoutFromDB[];
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
export const getCompleteWorkout = (date_id: number): types.CompleteWorkout | null => {
    try {
        // Get base workout info
        const workout = db.getFirstSync('SELECT * FROM workouts WHERE date = ?', [date_id]) as types.WorkoutFromDB | null;
        if (!workout) { return null; } // If workout somehow doens't exist (shouln't be the case though)
        
        // Get exercises
        const exercises = db.getAllSync('SELECT * FROM exercises WHERE date = ? ORDER BY pos', [date_id]) as types.ExerciseFromDB[];

        // Get sets for each exercise and use combined DB information
        // to build out the full workout as one object
        const completedExercises: types.CompleteExercise[] = exercises.map(exercise => {
            // Get raw set DB rows
            const setsFromDb = db.getAllSync(`SELECT *
                                        FROM sets
                                        WHERE date=? AND exercise_pos=?
                                        ORDER BY pos`,
                            [date_id, exercise.pos]) as types.SetFromDB[];
            // Remove `date`, `exercise_pos`, and `pos` keys from objects (unnecessary) and retype
            // Also give values to anything that is in the db as null
            const sets: types.CompleteSet[] = setsFromDb.map(({ date, exercise_pos, pos, resistance, reps, is_drop, has_partials, is_uni }) => ({
                resistance: resistance ?? 0, reps: reps ?? 0, is_drop: is_drop ?? 0, has_partials: has_partials ?? 0, is_uni: is_uni ?? 0
            }));
            return {
                name: exercise.name,
                variant: exercise.variant,
                sets: sets
            } as types.CompleteExercise;
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
 * Get all recent instances of same exercise.
 * @param options object of keys (exercise_name?, primary_muscle?, variant?, limit?=3)
 * @returns List of CompleteExercise objects will full data for sets
 */
export const getRecentExercises = (exercise_name: string, variant?: string, limit: number = 3): types.CompleteExerciseDate[] => {
    try {
        // Get data from DB
        let exercises: types.ExerciseFromDB[] = [];
        if (exercise_name && variant) {
            exercises = db.getAllSync(
                'SELECT * FROM exercises WHERE name=? AND variant=? ORDER BY date DESC LIMIT ?',
                [exercise_name, variant, limit]
            ) as types.ExerciseFromDB[];
        } else if (exercise_name) {
            exercises = db.getAllSync(
                'SELECT * FROM exercises WHERE name=? ORDER BY date DESC LIMIT ?',
                [exercise_name, limit]
            ) as types.ExerciseFromDB[];
        } else {
            // Handle case where exercise_name is not provided
            console.error('No exercise name given to retreive for');
            return [];
        }
        
        // Reformat DB data into nice JS object
        const completedExercises: types.CompleteExerciseDate[] = exercises.map(exercise => {
            const setsFromDb = db.getAllSync('SELECT * FROM sets WHERE date=? AND exercise_pos=? ORDER BY pos', [exercise.date, exercise.pos]) as types.SetFromDB[];
            const sets: types.CompleteSet[] = setsFromDb.map(({ resistance, reps, is_drop, has_partials, is_uni, ...rest }) => ({
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
    } catch (e) {
        console.error(`DB query for recent exercises of params 
                       exercise_name=${exercise_name},  
                       variant=${variant},  
                       limit=${limit} failed:`, e);
        throw e;
    }
};

export const workoutsToCSV = () => {
    try {
        // Create columns
        let csvRows = ['Date, Tag Color, Notes']; 
        for (let n=1; n<=16; n++) { // Add columns for 16 exercises (can also make func that finds max number of exercises someone does)
            csvRows[0] += `, Exercise ${n}, Sets (${n})`;
        }
        // For each workout
        const workouts = db.getAllSync('SELECT * FROM workouts ORDER BY date') as types.WorkoutFromDB[];
        workouts.forEach(workout => {
            // Gather basic info
            const dateObj = unixToDate(workout.date);
            const dateStr = dateObj.getFullYear() + '-'
                            + String(dateObj.getMonth()+1).padStart(2,'0') + '-'
                            + String(dateObj.getDate()).padStart(2,'0');
            const row: string[] = [dateStr, workout.tag_color, workout.notes || ''];
            // Get all exercises of workout
            const exercises = db.getAllSync('SELECT * FROM exercises WHERE date=? ORDER BY pos', [workout.date]) as types.ExerciseFromDB[];
            exercises.forEach(exercise => {
                row.push(`${exercise.name} (${exercise.variant})`);
                // Get all sets of exercise
                const sets = db.getAllSync('SELECT resistance, reps, is_drop, has_partials, is_uni FROM sets WHERE date=? AND exercise_pos=? ORDER BY pos', [workout.date, exercise.pos]) as types.SetFromDB[];
                let setStr = '"';
                sets.forEach((set, index) => {
                    setStr += `${set.resistance} → ${set.reps}`;
                    if (set.is_drop || set.has_partials || set.is_uni) {
                        setStr += ` (${set.is_drop ? 'Drop.' : ''}${set.has_partials ? 'Part.' : ''}${set.is_uni ? 'Uni.' : ''})`
                    }
                    setStr += `${index !== sets.length - 1 ? ' | ' : ''}`;
                });
                setStr += '"'; // Close quotes to end CSV delimiting of commas for this field
                row.push(setStr);
            });
            csvRows.push(row.join(','));
        });
        const csvString = csvRows.join('\n');
        return csvString;
    } catch (e) {
        console.error('Error building workouts CSV:', e);
        throw e;
    }
};

export const exercisesAndVariantsToCSV = () => {
    try {
        const eNames: { name: string }[] = db.getAllSync('SELECT name FROM exercise_names ORDER BY name');
        const vNames: { name: string }[] = db.getAllSync('SELECT name FROM variant_names ORDER BY name');
        const csvRows = ['Name, Variant'];
        const maxRows = Math.max(eNames.length, vNames.length);
        for (let i=0; i<maxRows; ++i) {
            csvRows.push(`${eNames[i]?.name || ''}, ${vNames[i]?.name || ''}`);
        }
        const csvString = csvRows.join('\n');
        return csvString;
    } catch (e) {
        console.error('Error building exercises and variants CSV:', e);
        throw e;
    }
};

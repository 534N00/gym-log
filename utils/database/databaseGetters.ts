import { dateStringToUnixRange, unixToDate } from "../dateUtils";
import { db } from "./database";
import * as types from "./databaseInterfaces";

/**
 * Attempts to get most recent data from database.
 * @returns Date object or null if no data
 */
export const getMostRecentDate = (): Date | null => {
    try {
        const dateNum = db.getFirstSync(
            "SELECT MAX(date) FROM workouts"
        ) as any;
        if (dateNum["MAX(date)"] == null) {
            return null;
        }
        const date = unixToDate(dateNum["MAX(date)"]);
        return date;
    } catch (e) {
        console.error("Error fetching most recent date:", e);
        throw e;
    }
};

/**
 * Retrieve exercise names for populating state
 * @param limit number of names to retrieve (default 10)
 * @param offset (default 0)
 * @returns
 */
export const getExerciseNames = (
    limit: number = 10,
    offset: number = 0
): string[] => {
    try {
        const rows = db.getAllSync(
            "SELECT name FROM exercise_names ORDER BY name LIMIT ? OFFSET ?",
            [limit, offset]
        ) as { name: string }[];
        return rows.map((row) => row.name);
    } catch (e) {
        console.error("Error fetching exercise names:", e);
        throw e;
    }
};

/**
 * Retrieve exercise names for populating state
 * @param limit number of names to retrieve (default 10)
 * @param offset (default 0)
 * @returns
 */
export const getVariantNames = (
    limit: number = 10,
    offset: number = 0
): string[] => {
    try {
        const rows = db.getAllSync(
            "SELECT name FROM variant_names ORDER BY name LIMIT ? OFFSET ?",
            [limit, offset]
        ) as { name: string }[];
        return rows.map((row) => row.name);
    } catch (e) {
        console.error("Error fetching variant names:", e);
        throw e;
    }
};

/**
 * Gets basic workout information for recent workouts.
 * @param limit How many workouts to retrieve
 * @param offset (default 0)
 * @returns List of base information for workouts
 */
export const getRecentWorkoutPreviews = (
    limit?: number,
    offset: number = 0
): types.WorkoutFromDB[] => {
    try {
        // Get limited many or all
        const sql = limit
            ? "SELECT * FROM workouts ORDER BY date DESC LIMIT ? OFFSET ?"
            : "SELECT * FROM workouts ORDER BY date DESC";
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
export const getWorkoutPreviewsByDate = (
    dateString: string,
    limit: number = 6
): types.WorkoutFromDB[] => {
    const [start, end] = dateStringToUnixRange(dateString);
    try {
        const sql =
            "SELECT * FROM workouts WHERE date BETWEEN ? AND ? ORDER BY date LIMIT ?";
        const previews = db.getAllSync(sql, [
            start,
            end,
            limit,
        ]) as types.WorkoutFromDB[];
        return previews;
    } catch (e) {
        console.error(
            `Error fetching workout previews for (${dateString}):`,
            e
        );
        throw e;
    }
};

/**
 * Retrieves full data of one workout
 * @param date_id The Unix timestamp of the workout (would already have been availiable when getRecentWorkoutPreviews is used for UI rendering)
 * @returns CompleteWorkout object of data for workout, all exercises, and all sets of exercises
 */
export const getCompleteWorkout = (
    date_id: number
): types.CompleteWorkout | null => {
    try {
        // Get base workout info
        const workout = db.getFirstSync(
            "SELECT * FROM workouts WHERE date = ?",
            [date_id]
        ) as types.WorkoutFromDB | null;
        if (!workout) {
            return null;
        } // If workout somehow doens't exist (shouln't be the case though)

        // Get exercises
        const exercises = db.getAllSync(
            "SELECT * FROM exercises WHERE date = ? ORDER BY pos",
            [date_id]
        ) as types.ExerciseFromDB[];

        // Get sets for each exercise and use combined DB information
        // to build out the full workout as one object
        const completedExercises: types.CompleteExercise[] = exercises.map(
            (exercise) => {
                // Get raw set DB rows
                const setsFromDb = db.getAllSync(
                    `SELECT *
                                        FROM sets
                                        WHERE date=? AND exercise_pos=?
                                        ORDER BY pos`,
                    [date_id, exercise.pos]
                ) as types.SetFromDB[];
                // Remove `date`, `exercise_pos`, and `pos` keys from objects (unnecessary) and retype
                // Also give values to anything that is in the db as null
                const sets: types.CompleteSet[] = setsFromDb.map(
                    ({
                        date,
                        exercise_pos,
                        pos,
                        resistance,
                        reps,
                        is_drop,
                        has_partials,
                        is_uni,
                    }) => ({
                        resistance: resistance ?? 0,
                        reps: reps ?? 0,
                        is_drop: is_drop ?? 0,
                        has_partials: has_partials ?? 0,
                        is_uni: is_uni ?? 0,
                    })
                );
                return {
                    name: exercise.name,
                    variant: exercise.variant,
                    sets: sets,
                } as types.CompleteExercise;
            }
        );

        return {
            date: workout.date,
            notes: workout.notes || "",
            tag_color: workout.tag_color,
            date_obj: unixToDate(workout.date),
            exercises: completedExercises,
        };
    } catch (error) {
        console.error("Error fetching complete workout:", error);
        throw error;
    }
};

/**
 * Get all recent instances of same exercise.
 * @param options object of keys (exercise_name?, primary_muscle?, variant?, limit?=3)
 * @returns List of CompleteExercise objects will full data for sets
 */
export const getRecentExercises = (
    exercise_name: string,
    variant?: string,
    limit: number = 3
): types.CompleteExerciseDate[] => {
    try {
        // Get data from DB
        let exercises: types.ExerciseFromDB[] = [];
        if (exercise_name && variant) {
            exercises = db.getAllSync(
                "SELECT * FROM exercises WHERE name=? AND variant=? ORDER BY date DESC LIMIT ?",
                [exercise_name, variant, limit]
            ) as types.ExerciseFromDB[];
        } else if (exercise_name) {
            exercises = db.getAllSync(
                "SELECT * FROM exercises WHERE name=? ORDER BY date DESC LIMIT ?",
                [exercise_name, limit]
            ) as types.ExerciseFromDB[];
        } else {
            // Handle case where exercise_name is not provided
            console.error("No exercise name given to retreive for");
            return [];
        }

        // Reformat DB data into nice JS object
        const completedExercises: types.CompleteExerciseDate[] = exercises.map(
            (exercise) => {
                const setsFromDb = db.getAllSync(
                    "SELECT * FROM sets WHERE date=? AND exercise_pos=? ORDER BY pos",
                    [exercise.date, exercise.pos]
                ) as types.SetFromDB[];
                const sets: types.CompleteSet[] = setsFromDb.map(
                    ({
                        resistance,
                        reps,
                        is_drop,
                        has_partials,
                        is_uni,
                        ...rest
                    }) => ({
                        resistance: resistance ?? 0,
                        reps: reps ?? 0,
                        is_drop: is_drop ?? 0,
                        has_partials: has_partials ?? 0,
                        is_uni: is_uni ?? 0,
                    })
                );
                return {
                    date: exercise.date,
                    name: exercise.name,
                    variant: exercise.variant || "",
                    sets: sets,
                };
            }
        );
        return completedExercises;
    } catch (e) {
        console.error(
            `DB query for recent exercises of params 
                       exercise_name=${exercise_name},  
                       variant=${variant},  
                       limit=${limit} failed:`,
            e
        );
        throw e;
    }
};

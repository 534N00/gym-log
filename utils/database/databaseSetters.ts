import { dateToUnix } from "../dateUtils";
import { db } from "./database";
import * as types from "./databaseInterfaces";

/**
 * Inserts a new exercise name into the database.
 * @param name - The exercise name to be inserted. Must be a non-empty string.
 * @returns A boolean indicating whether the insertion was successful.
 *          Returns true if the name was inserted successfully, false if the name is empty
 *          or if a duplicate entry exists.
 */
export const insertExerciseName = (name: string): boolean => {
    if (name === "") {
        return false;
    }
    try {
        db.runSync("INSERT INTO exercise_names (name) VALUES (?)", [name]);
        return true;
    } catch (e) {
        console.log("Duplicate exists:", e);
        return false;
    }
};

/**
 * Inserts a new variant name into the database.
 * @param name - The variant name to be inserted. Must be a non-empty string.
 * @returns A boolean indicating whether the insertion was successful.
 *          Returns true if the name was inserted successfully, false if the name is empty
 *          or if a duplicate entry exists.
 */
export const insertVariantName = (name: string): boolean => {
    if (name === "") {
        return false;
    }
    try {
        db.runSync("INSERT INTO variant_names (name) VALUES (?)", [name]);
        return true;
    } catch (e) {
        console.log("Duplicate exists:", e);
        return false;
    }
};

/**
 * Deletes a list of exercise names from the database.
 * @param names - The list of exercise names to be deleted.
 * @returns A boolean indicating whether the deletion was successful.
 *          Returns true if the names were deleted successfully, false if the list is empty
 *          or if an error occurs.
 */
export const deleteExerciseNames = (names: string[]): boolean => {
    if (names.length === 0) {
        return false;
    }
    try {
        const placeholders = names.map(() => "?").join(", ");
        db.runSync(
            `DELETE FROM exercise_names WHERE name IN (${placeholders})`,
            names
        );
        return true;
    } catch (e) {
        console.error("Error deleting exercise names:", e);
        return false;
    }
};

/**
 * Deletes a list of variant names from the database.
 * @param names - The list of variant names to be deleted.
 * @returns A boolean indicating whether the deletion was successful.
 *          Returns true if the names were deleted successfully, false if the list is empty
 *          or if an error occurs.
 */
export const deleteVariantNames = (names: string[]): boolean => {
    if (names.length === 0) {
        return false;
    }
    try {
        const placeholders = names.map(() => "?").join(", ");
        db.runSync(
            `DELETE FROM variant_names WHERE name IN (${placeholders})`,
            names
        );
        return true;
    } catch (e) {
        console.error("Error deleting variant names:", e);
        return false;
    }
};

/**
 * Inserts a full log when a complete workouts is submitted
 * @param workoutData Full workout data of exercises and sets to input into DB
 * @returns The date_id of the inserted workout if successful, 0 otherwise.
 */
export const insertWorkout = (workoutData: types.WorkoutData): number => {
    try {
        // Insert workout
        const unixTimestamp = dateToUnix(workoutData.date);
        const workoutResult = db.runSync(
            // modify data and get metadata about operation
            "INSERT INTO workouts (date, notes, tag_color) VALUES (?,?,?)",
            [unixTimestamp, workoutData.notes || null, workoutData.tag_color]
        );
        const date_id = workoutResult.lastInsertRowId as number;

        // Insert workout's exercises
        const exercises = workoutData.exercises;
        for (let i = 0; i < exercises.length; i++) {
            db.runSync(
                "INSERT INTO exercises (date, pos, name, variant) VALUES (?,?,?,?)",
                [date_id, i + 1, exercises[i].name, exercises[i].variant || ""]
            );

            // Insert exercise's sets
            const sets = exercises[i].sets;
            for (let j = 0; j < sets.length; j++) {
                db.runSync(
                    "INSERT INTO sets (date, exercise_pos, pos, resistance, reps, is_drop, has_partials, is_uni) VALUES (?,?,?,?,?,?,?,?)",
                    [
                        date_id,
                        i + 1,
                        j + 1,
                        sets[j].resistance || "",
                        sets[j].reps,
                        sets[j].is_drop || 0,
                        sets[j].has_partials || 0,
                        sets[j].is_uni || 0,
                    ]
                );
            }
        }
        return date_id;
    } catch (error) {
        console.error("Error inserting complete workout:", error);
        return 0;
    }
};

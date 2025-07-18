import { db } from "./database/database";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as types from "./database/databaseInterfaces";
import { unixToDate } from "./dateUtils";

/**
 * Saves a CSV string to a file in the app's document directory
 * @param csvString The string containing the CSV data
 * @param fileName The name of the file to save it as (without the .csv extension)
 * @returns The URI of the saved file
 */
const saveCsvToFile = async (csvString: string, fileName: string) => {
    const uri = FileSystem.documentDirectory + fileName + ".csv";
    await FileSystem.writeAsStringAsync(uri, csvString, {
        encoding: FileSystem.EncodingType.UTF8,
    });
    return uri;
};

/**
 * Shares a CSV file using the device's sharing capabilities.
 * @param uri The URI of the CSV file to be shared.
 */
export const shareCsv = async (uri: string) => {
    if (!(await Sharing.isAvailableAsync())) {
        alert("Sharing is not available on this device");
        return;
    }
    await Sharing.shareAsync(uri, {
        mimeType: "text/csv",
        dialogTitle: "Share CSV File",
    });
};

/**
 * Saves all workouts and exercises/variant names to two separate CSV files and returns the URIs of the saved files
 * @returns An object with two properties: `workoutsUri` and `namesUri`, each containing the URI of the respective CSV file
 */
export const exportWorkouts = async () => {
    const workoutsCSV = workoutsToCSV();
    const namesCSV = exercisesAndVariantsToCSV();
    const workoutsUri = await saveCsvToFile(workoutsCSV, "workouts");
    const namesUri = await saveCsvToFile(namesCSV, "exercises_and_variants");
    return { workoutsUri, namesUri };
};

/**
 * Builds a CSV string from all workouts in the database. The CSV string is organized into rows of workouts, with each workout
 * containing columns for the date, tag color, notes, and up to 16 exercises. Each exercise column contains the name and variant
 * of the exercise, followed by up to 16 set columns. Each set column contains the resistance, reps, and any flags (drop, partials, uni)
 * for that set. The sets are separated by pipes (`|`) and surrounded by double quotes (`"`) to delimit commas within the sets.
 * @returns A CSV string
 */
export const workoutsToCSV = () => {
    try {
        // Create columns
        let csvRows = ["Date, Tag Color, Notes"];
        for (let n = 1; n <= 16; n++) {
            // Add columns for 16 exercises (can also make func that finds max number of exercises someone does)
            csvRows[0] += `, Exercise ${n}, Sets (${n})`;
        }
        // For each workout
        const workouts = db.getAllSync(
            "SELECT * FROM workouts ORDER BY date"
        ) as types.WorkoutFromDB[];
        workouts.forEach((workout) => {
            // Gather basic info
            const dateObj = unixToDate(workout.date);
            const dateStr =
                dateObj.getFullYear() +
                "-" +
                String(dateObj.getMonth() + 1).padStart(2, "0") +
                "-" +
                String(dateObj.getDate()).padStart(2, "0");
            const row: string[] = [
                dateStr,
                workout.tag_color,
                `"${workout.notes}"` || "",
            ];
            // Get all exercises of workout
            const exercises = db.getAllSync(
                "SELECT * FROM exercises WHERE date=? ORDER BY pos",
                [workout.date]
            ) as types.ExerciseFromDB[];
            exercises.forEach((exercise) => {
                row.push(`${exercise.name} (${exercise.variant})`);
                // Get all sets of exercise
                const sets = db.getAllSync(
                    "SELECT resistance, reps, is_drop, has_partials, is_uni FROM sets WHERE date=? AND exercise_pos=? ORDER BY pos",
                    [workout.date, exercise.pos]
                ) as types.SetFromDB[];
                let setStr = '"';
                sets.forEach((set, index) => {
                    setStr += `${set.resistance} → ${set.reps}`;
                    if (set.is_drop || set.has_partials || set.is_uni) {
                        setStr += ` (${set.is_drop ? "Drop." : ""}${
                            set.has_partials ? "Part." : ""
                        }${set.is_uni ? "Uni." : ""})`;
                    }
                    setStr += `${index !== sets.length - 1 ? " | " : ""}`;
                });
                setStr += '"'; // Close quotes to end CSV delimiting of commas for this field
                row.push(setStr);
            });
            csvRows.push(row.join(","));
        });
        const csvString = csvRows.join("\n");
        return csvString;
    } catch (e) {
        console.error("Error building workouts CSV:", e);
        throw e;
    }
};

/**
 * Builds a CSV string of all exercise and variant names the user inputed, exercises and variants each in their own column.
 * @returns A CSV string
 */
export const exercisesAndVariantsToCSV = () => {
    try {
        const eNames: { name: string }[] = db.getAllSync(
            "SELECT name FROM exercise_names ORDER BY name"
        );
        const vNames: { name: string }[] = db.getAllSync(
            "SELECT name FROM variant_names ORDER BY name"
        );
        const csvRows = ["Name, Variant"];
        const maxRows = Math.max(eNames.length, vNames.length);
        for (let i = 0; i < maxRows; ++i) {
            csvRows.push(`${eNames[i]?.name || ""}, ${vNames[i]?.name || ""}`);
        }
        const csvString = csvRows.join("\n");
        return csvString;
    } catch (e) {
        console.error("Error building exercises and variants CSV:", e);
        throw e;
    }
};

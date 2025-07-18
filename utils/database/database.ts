import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("workouts.db");

/**
 * Init database instance
 */
export const initDatabase = () => {
    try {
        db.execSync(
            // Run SQL code that doesn't return data
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

/**
 * Reset database instance and vaccum space
 */
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
};

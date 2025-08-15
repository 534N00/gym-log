# Lift Log Architecture

## Routing Breakdown
\- app/  
&nbsp;&nbsp;&nbsp;&nbsp; | \- `index.tsx` -> Home screen  
&nbsp;&nbsp;&nbsp;&nbsp; | \- workout_history  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | \- `index.tsx` -> Past workout select or past exercise search  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | \- `[workoutId].tsx` -> Past workout data  
&nbsp;&nbsp;&nbsp;&nbsp; | \- `new_workout.tsx` -> New workout form  
&nbsp;&nbsp;&nbsp;&nbsp; | \- `add_movement.tsx` -> Entry of new exercises/variants to a user's exercise/variant lists  
&nbsp;&nbsp;&nbsp;&nbsp; | \- `app_settings.tsx` -> User preferences plus data deletion and export

## Tech Stack Flow

### Expo
The app uses Expo Router for screen navigation plus other Expo components for general content fitting.

### SQLite
A SQLite database is used for the recording of all workouts and also the user preferences of particular exercise names and variants. SQLite was chosen for its lightweight nature and for its consitently structured data. In all querying from this database the joining of tables is avoided as the extra attributes I would get in a join are uneccesary for use in typical JS objects.

### AsyncStorage
As user preferences are generally few in number and simple in type, AsyncStorage is the most conveneient place storage for them.

### Zustand
Zustand stores are used to centralize state that is passed in parts as props to various components. Some state stores are currently used for are the states of exercises new workout and past workouts. Using state for past workouts is currently unnecessary though as mutability is not yet implemented. A store is also used for storing all user preferences after retreiving them from the database or from AsyncStorage

## Key Decisions & Tradeoffs

### SQLite over MongoDB Atlas (with Realm SDK) for local storage
\+ greater comfortability with SQL, ease of setup and use, and ease in ordering data  
\- greater complexity in querying to achieve document-like output

### User forced to select from previously inputed exercise names and variants
\+ promotes uniformity of data making search simpler  
\- potentially annoying to user who finds having to navigate to add a name so they can then select it as it disrupts their experience

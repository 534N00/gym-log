# Lift Log 💪
An offline mobile app for logging weightlifting training session to help with accumulating micro gains on a macro scale.

After user a Google form and its accompanying spread sheet for a year to log workouts I had collected several ideas for how I can log and search for information in more convenient ways. Some of the issues this app is meant to address are:
- encouraging more uniform input data
- more efficient inputting of data
- easy search for recent instances of doing a certain exercise

## Features
- Fully offline usability
- Log workout sessions with sets, reps, and modifiers (with intervaled autosave)
- Custom exercise (Benchpress, etc.) and variant selection (Barbell, Dumbbell, Cable, Machine, etc.)
- CSV export of logs and input exercise/variant selection

## Tech Stack
- React Native (Expo)
- Zustand state management
- SQLite and Async Storage for data persistance

## Folder Structure
- /app - Expo router directory and content pages
- /assets - Fonts (I might not have used) and images (icons and images used/could-be-used)
- /components - React components
- /utils - SQLite database and Zustand store initializers plus relevant getters, setters, and assorted utiltiy functions

## Contributing
Pull requests and comments are very welcome. First time using React Native though I've used React before and would be happy to learn how I could have designed things better. Contribution are also welcome with lots of idea I have listed in `toDo.md`.

## Local machine setup

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

0. Have Node.js and npm installed.

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## App Usage & Gallery

### Home
At the home screen you are greeted by a nice dog, and the number of days since your last entered workout, as well as a big button to start a new workout.


<img src="./assets/images/readme/home.jpg" alt="Home Tab Image" width="200"/>

### History
Here a user can either select a date where a tag color is present, tap the preview, and view the full previously logged workout, or they can search for recent instances of an exercise they've been doing by tapping the toggle switch.


<img src="./assets/images/readme/history_imgs.jpg" alt="History Tab Images" width="410"/>

### New Workout
Users can adjust the date and tag color of the workout by tapping on the respective items to open modals, and then add in however many exercises they end up doing in that workout. To select an exercise/variant in each exercise tile, the user needs to tap on the box and keyword search for it, tapping then on the option that appears. If a user has not yet entered their sought for exercise/variant they can navigate to the 'Add Movements' tab, add it, and return afterwards. The purpose of this requirement of tapping on user-set options is to improve uniformity and consistency in logging.

<img src="./assets/images/readme/new_workout_imgs.jpg" alt="New Workout Tab Images" width="410"/>

### Add Movements & Variants
Here users can add to and delete from their personal lists of exercises and variation types they perform. To switch between viewing and modifying movements and variation types, the user can tap on the colored text.

<img src="./assets/images/readme/movements.jpg" alt="Add Movements Tab Image" width="200"/>

### Settings
A user's name can be set to modify the welcome text. A user can also tap "Generate user data CSV" to create a CSV file which they can then export using their system context menu to wherever they like. The intension was for enableing export to a spreadsheet software. And of course a user can also choose to wipe all their data from their device.

<img src="./assets/images/readme/settings_imgs.jpg" alt="Settings Tab Images" width="410"/>
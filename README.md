# Lift Log 💪
An offline mobile app for logging weightlifting training session to help with accumulating micro gains on a macro scale.

After user a Google form and its accompanying spread sheet for a year to log workouts I had collected several ideas for how I can log and search for information in more convenient ways. Some of the issues this app is meant to address are:
- encouraging more uniform input data
- more efficient inputting of data
- easy search for recent instances of doing a certain exercise

## Features
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
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { workoutsToCSV, exercisesAndVariantsToCSV } from './database';

const saveCsvToFile = async (csvString: string, fileName: string) => {
    const uri = FileSystem.documentDirectory + fileName + '.csv';
    await FileSystem.writeAsStringAsync(uri, csvString, { encoding: FileSystem.EncodingType.UTF8 });
    return uri;
};

export const shareCsv = async (uri: string) => {
    if (!(await Sharing.isAvailableAsync())) {
        alert('Sharing is not available on this device');
        return;
    }
    await Sharing.shareAsync(uri, { mimeType: 'text/csv', dialogTitle: 'Share CSV File'});
};

export const exportWorkouts = async () => {
    const workoutsCSV = workoutsToCSV();
    const namesCSV = exercisesAndVariantsToCSV();
    const workoutsUri = await saveCsvToFile(workoutsCSV, 'workouts');
    const namesUri = await saveCsvToFile(namesCSV, 'exercises_and_variants');
    return { workoutsUri, namesUri };
};
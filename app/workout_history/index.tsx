import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect, useMemo } from 'react'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import GradientBlock from '@/components/GradientBlock';
import WorkoutPreview from '@/components/WorkoutPreview';
import { getRecentWorkoutPreviews, getWorkoutPreviewsByDate, unixToDate, WorkoutFromDB } from '@/utils/database';

const WorkoutHistory = () => {
  // Stores workout previews for given date to then render into WorkoutPreview components
  const [workoutPreviews, setWorkoutPreviews] = useState<WorkoutFromDB[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, object>>({}); // also is cache for all needed calendar info
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Gets initial group of most recent workouts to show
  useEffect(() => {
    const previewData = getRecentWorkoutPreviews(30);
    const newMarked = previewData.reduce((acc: Record<string, { dots: any[] }>, workout) => {
      console.log(workout);
      // Convert Unix date to Date
      const dateObj = unixToDate(workout.date);
      // Then rebuild date of form YYYY-MM-DD relative to user timezone
      const dateStr = dateObj.getFullYear() + '-'
                      + String(dateObj.getMonth()+1).padStart(2,'0') + '-'
                      + String(dateObj.getDate()).padStart(2,'0');
      // If we previously already found a workout for that day, we'll add the dot to the list
      // so that both dots render for the day
      if (dateStr in acc) {
        acc[dateStr].dots.push({key: workout.date, color: workout.tag_color});
      } else {
        acc[dateStr] = { dots: [{key: workout.date, color: workout.tag_color}] };
      }
      return acc;
    }, {} as Record<string, { dots: any[] }>);
    console.log(newMarked);
    setMarkedDates(newMarked);
  }, []);

  useEffect(() => {
    console.log(markedDates);
  }, [markedDates]);

  // For behavior of user tapping on day and then seeing the previews for that day
  const handleDayPress = (day: { dateString: string }) => {
    // Update Calendar state
    setMarkedDates((prevDate) => ({
      ...prevDate,
      // Set new date as selected
      [day.dateString]: {
        ...(prevDate[day.dateString] || {}),
        selected: true,
        selectedColor: '#dedcdd',
      },
      // If there's a different previously selected date, deselect that
      ...(selectedDate && selectedDate !== day.dateString
        ? {
            [selectedDate]: {
              ...(prevDate[selectedDate] || {}),
              selected: false,
            },
          }
        : {}),
    }));
    setSelectedDate(day.dateString);
    // Get previews for date to render
    const previews = getWorkoutPreviewsByDate(day.dateString);
    setWorkoutPreviews(previews);
  };

  return (
    <View className="flex-1 bg-[#B587A8]">
      <GradientBlock />
      <SafeAreaView className="px-6 pt-4">
        <View className="flex-row mb-4">
          <Text className="text-4xl font-bold">Past Workouts</Text>
          <Text>Cal/Search Toggle</Text>
        </View>
        <Calendar
          style={styles.calendar}
          maxDate={new Date().toDateString()}
          onDayPress={(day) => handleDayPress(day)}
          enableSwipeMonths={true}
          markingType={'multi-dot'}
          // markedDates is object of date keys to marked state
          markedDates={markedDates}
        />
        <View className="h-[350px] flex-row flex-wrap justify-between">
          {workoutPreviews.length > 0 && workoutPreviews.map((preview) => (
            <WorkoutPreview key={preview.date} workoutId={preview.date} readable_date={unixToDate(preview.date).toDateString()} color={preview.tag_color} />
          ))}
        </View>
        
        {/* <Pressable // Test get from db
          className="p-4 rounded-3xl bg-white w-20" 
          onPress={
            () => {
              try {
                const previews = getRecentWorkoutPreviews(3);
                console.log(previews);

                // const workout = getCompleteWorkout(previews[0].date);
                // console.log(workout);
                // console.log(workout?.exercises[0].sets);
                // const benchExercises = getRecentSameExercise('Benchpress', 4, 'Barbell');
                // console.log(benchExercises);
                // console.log(benchExercises[0].sets);


              } catch (e) {
                console.error(e);
              }
            }
          }
        ><Text>Get</Text></Pressable> */}
      </SafeAreaView>
    </View>
  );
};

export default WorkoutHistory;

const styles = StyleSheet.create({
  calendar: {
    borderRadius:7,
    marginBottom:20,
  }
});
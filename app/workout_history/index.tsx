import GradientBlock from '@/components/GradientBlock';
import WorkoutPreview from '@/components/WorkoutPreview';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getRecentWorkoutPreviews, getWorkoutPreviewsByDate, unixToDate, WorkoutFromDB } from '@/utils/database';
import { triggerHaptic } from '@/utils/haptics';
import { useOptionsStore } from '@/utils/optionsStore'; // for refresh tag\
import { useEffect, useState } from 'react';
import { Text, View, Switch, TextInput, Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutocompleteSelect from '@/components/AutocompleteSelect';

const WorkoutHistory = () => {
  // Refresh tag for callendar when new submit
  const refresh = useOptionsStore((state) => state.refresh);

  // State for if using calendar search or text search
  const [isSearch, setIsSearch] = useState(false);
  const [soughtMuscle, setSoughtMuscle] = useState('');
  const [soughtExercise, setSoughtExercise] = useState('');
  

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
  }, [refresh]);


  // For behavior of user tapping on day and then seeing the previews for that day
  const handleDayPress = (day: { dateString: string }) => {
    triggerHaptic('tap');
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
      <SafeAreaView className="px-6 pt-2">
        <View className="flex-row mb-4 items-center relative">
          <Text className="text-4xl font-bold">Past Workouts</Text>
          <View className='absolute right-0 flex-row items-center gap-x-3'>
            <View className='scale-125'>
              <Switch onChange={() => setIsSearch(!isSearch)} value={isSearch}
                      thumbColor={'#55868C'} trackColor={{true: '#C5EBC3'}} />
            </View>
            <FontAwesome name="search" size={26} color="black" />
          </View>
        </View>
        <View // Calendar/search container
          className='h-96 bg-green-300 items-center' >
          {!isSearch ? (
            <Calendar
              style={{borderRadius:7, marginBottom:20, width:370,}}
              maxDate={new Date().toDateString()}
              onDayPress={(day) => handleDayPress(day)}
              enableSwipeMonths={true}
              markingType={'multi-dot'}
              // markedDates is object of date keys to marked state
              markedDates={markedDates}
            />) : (<>
            <Text>Primary Muscle</Text>
            <AutocompleteSelect useCase='search' optionType={'muscles'} setter={setSoughtMuscle} placeholder={'Search by primary muscle worked'} />
            <Text>Exercise Name</Text>
            <AutocompleteSelect useCase='search' optionType={'exercises'} setter={setSoughtExercise} placeholder={'Search by exercise'} />
            <Pressable><Text>Search</Text></Pressable>
          </>)}
         
        </View>
        <View // Bottom header
          className='flex-row justify-center items-center'>
          <View // horizontal rule
                  className="m-4 p-[1px] bg-gray-500 w-24 rounded-full"/>
          <Text className='text-xl font-bold'>Workouts Bellow</Text>
          <View // horizontal rule
                  className="m-4 p-[1px] bg-gray-500 w-24 rounded-full"/>
        </View>
        <View className="h-96 flex-row flex-wrap justify-between bg-red-200">
          {workoutPreviews.length > 0 && workoutPreviews.map((preview) => (
            <WorkoutPreview key={preview.date} workoutId={preview.date} readable_date={unixToDate(preview.date).toDateString()} color={preview.tag_color} />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WorkoutHistory;
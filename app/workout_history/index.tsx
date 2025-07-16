import GradientBlock from '@/components/GradientBlock';
import WorkoutPreview from '@/components/WorkoutPreview';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getRecentExercises, getRecentWorkoutPreviews, getWorkoutPreviewsByDate, unixToDate } from '@/utils/database';
import { WorkoutFromDB, CompleteExerciseDate } from '@/utils/databaseInterfaces';
import { triggerHaptic } from '@/utils/haptics';
import { useOptionsStore } from '@/utils/optionsStore'; // for refresh tag\
import { useEffect, useState } from 'react';
import { Text, View, Switch, Pressable, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutocompleteSelect from '@/components/AutocompleteSelect';
import StatelessExerciseTile from '@/components/render_workout/StatelessExerciseTile';

const WorkoutHistory = () => {
  // Refresh tag for callendar when new submit
  const refresh = useOptionsStore((state) => state.refresh);

  // State for if using calendar search or text search
  const [isSearch, setIsSearch] = useState(false);
  const [soughtExercise, setSoughtExercise] = useState('');
  const [soughtVariant, setSoughtVariant] = useState('');
  

  // Stores workout previews for given date to then render into WorkoutPreview and ExerciseTile components
  const [workoutPreviews, setWorkoutPreviews] = useState<WorkoutFromDB[]>([]);
  const [exercises, setExercises] = useState<CompleteExerciseDate[]>([]); // for search of exercises for tiles
  const [markedDates, setMarkedDates] = useState<Record<string, object>>({}); // also is cache for all needed calendar info
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const [offset, setOffset] = useState(0);
  const [lastDate, setLastDate] = useState(3000000000000); // store last unix date in most recent preview DB query
  const [canLoadMore, setCanLoadMore] = useState(true);

  const processPreviewData = (previewData: WorkoutFromDB[]) => {
    setLastDate(previewData[previewData.length-1].date);
    const newMarked = previewData.reduce((acc: Record<string, { dots: any[] }>, workout) => {
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
    setMarkedDates(newMarked);
  };

  // Gets initial group of most recent workouts to show
  useEffect(() => {
    // Reset pagination states
    setOffset(0);
    setCanLoadMore(true);

    // Query for initial recent workouts
    const previewData = getRecentWorkoutPreviews(60);
    processPreviewData(previewData);
  }, [refresh]);

  type CalendarDate = { timestamp: number, dateString: string, day: number, month: number, year: number };
  // Load more previews if use swipes to past month where older workouts might exist
  const handleLoadMore = (calendarDate: CalendarDate) => {
    if (canLoadMore && calendarDate.timestamp/1000 < lastDate) {
      setOffset(offset + 60);
      const previewsData = getRecentWorkoutPreviews(60, offset);
      if (previewsData.length > 0) {
        setLastDate(previewsData[previewsData.length-1].date);
        processPreviewData(previewsData);
      } else { setCanLoadMore(false); console.log('No more to load'); }
    }
  };

  // For behavior of user tapping on day and then seeing the previews for that day
  const handleDayPress = (calendarDate: CalendarDate) => {
    triggerHaptic('tap');
    // Update Calendar state
    setMarkedDates((prevDate) => ({
      ...prevDate,
      // Set new date as selected
      [calendarDate.dateString]: {
        ...(prevDate[calendarDate.dateString] || {}),
        selected: true,
        selectedColor: '#dedcdd',
      },
      // If there's a different previously selected date, deselect that
      ...(selectedDate && selectedDate !== calendarDate.dateString
        ? {
            [selectedDate]: {
              ...(prevDate[selectedDate] || {}),
              selected: false,
            },
          }
        : {}),
    }));
    setSelectedDate(calendarDate.dateString);
    // Get previews for date to render
    const previews = getWorkoutPreviewsByDate(calendarDate.dateString);
    setWorkoutPreviews(previews);
  };

  // On search, query db for recent exercise instances and set to state for rendering
  const handleSearch = () => {
    triggerHaptic('success');
    // Update workout previews by query db
    const data = soughtVariant === '' ? getRecentExercises(soughtExercise) : getRecentExercises(soughtExercise, soughtVariant);
    setExercises(data);
  };

  return (
    <View className="flex-1 bg-[#B587A8]">
      <GradientBlock />
      <SafeAreaView className="px-6 pt-2 flex-1" edges={['top']}>
        
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingBottom: 32,}} showsVerticalScrollIndicator={false}>
          <View className="flex-row mb-4 items-center relative">
            <Text className="text-4xl font-bold">Recent Workouts</Text>
            <View className='absolute right-0 flex-row items-center gap-x-3'>
              <View className='scale-125'>
                <Switch onChange={() => setIsSearch(!isSearch)} value={isSearch}
                        thumbColor={'#55868C'} trackColor={{true: '#C5EBC3'}} />
              </View>
              <FontAwesome name="search" size={26} color="black" />
            </View>
          </View>
          <View // Calendar/search container
            className='h-full items-center'>
            {!isSearch ? (<>
              <Calendar
                style={{borderRadius:7, marginBottom:20, width:370,}}
                maxDate={new Date().toDateString()}
                onDayPress={(day) => handleDayPress(day)}
                onMonthChange={(month) => handleLoadMore(month)}
                enableSwipeMonths={true}
                markingType={'multi-dot'}
                // markedDates is object of date keys to marked state
                markedDates={markedDates}
              />
              <View // Bottom header
                className='flex-row justify-center items-center'>
                <View // horizontal rule
                  className="m-4 p-[1px] bg-gray-500 w-24 rounded-full"/>
                  <Text className='text-xl font-bold'>Workouts Below</Text>
                <View // horizontal rule
                  className="m-4 p-[1px] bg-gray-500 w-24 rounded-full"/>
              </View>
              <View className="h-96 flex-row flex-wrap gap-x-4">
                {workoutPreviews.map((preview) => (
                  <WorkoutPreview key={preview.date} workoutId={preview.date} readable_date={unixToDate(preview.date).toDateString()} color={preview.tag_color} />
                ))}
              </View>
              </>
              ) : (<>
              <View className='min-h-60 items-center -mb-0'>
                <AutocompleteSelect size='big' optionType={'exercises'} setter={setSoughtExercise} placeholder={'Search by exercise'} />
                <AutocompleteSelect size='small' optionType={'variants'} setter={setSoughtVariant} placeholder={'Search by variant'} />
                <Pressable className='bg-white rounded-xl p-4 mt-4 w-32 items-center' onPress={handleSearch}>
                  <Text>Search</Text>
                </Pressable>
              </View>
              
              <View // Bottom header
                className='-mt-6 mb-4 flex-row justify-center items-center'>
                <View // horizontal rule
                  className="m-4 p-[1px] bg-gray-500 w-16 rounded-full"/>
                  <Text className='text-xl font-bold'>Exercise Instances Below</Text>
                <View // horizontal rule
                  className="m-4 p-[1px] bg-gray-500 w-16 rounded-full"/>
              </View>
              <View className="flex-row flex-wrap gap-y-4">
                {exercises.map((exercise, index) => (
                  <StatelessExerciseTile key={index} exerciseData={exercise} />
                ))}
              </View>
            </>)}
          </View>
          
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default WorkoutHistory;
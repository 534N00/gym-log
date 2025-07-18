import ColorPickerModal from '@/components/ColorPickerModal';
import GradientBlock from '@/components/GradientBlock';
import DateBox from '@/components/render_workout/DateBox';
import ExerciseTile from '@/components/render_workout/ExerciseTile';
import NoteBlock from '@/components/render_workout/NoteBlock';
import { insertWorkout } from '@/utils/database/database';
import { triggerHaptic } from '@/utils/haptics';
import { useCurrentWorkoutStore } from '@/utils/zustand_stores/newWorkoutStore';
import { useOptionsStore } from '@/utils/zustand_stores/optionsStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const NewWorkout = () => {
  const date = useCurrentWorkoutStore((state) => state.date);
  const setDate = useCurrentWorkoutStore((state) => state.setDate);
  const tagColor = useCurrentWorkoutStore((state) => state.tagColor);
  const setCurrentTagColor = useCurrentWorkoutStore((state) => state.setCurrentTagColor);
  const notes = useCurrentWorkoutStore((state) => state.notes);
  const setCurrentNotes = useCurrentWorkoutStore((state) => state.setCurrentNotes);

  const exerciseOrder = useCurrentWorkoutStore((state) => state.exerciseOrder);
  const exercises = useCurrentWorkoutStore((state) => state.exercises);

  const resetWorkout = useCurrentWorkoutStore((state) => state.resetWorkout);
  const addExercise = useCurrentWorkoutStore((state) => state.addExercise);

  const triggerRefresh = useOptionsStore((s) => s.triggerRefresh);
  
  const [colorModalVisible, setColorModalVisible] = useState(false);

  const handleSubmit = useCallback(() =>  {
    triggerHaptic('success');
    const exercisesArr = exerciseOrder.map((id) =>  {
      const ex = exercises[id];
      return {
        name: ex.name || 'N/A',
        variant: ex.variant,
        sets: ex.setOrder.map(setId => {
          const set = ex.sets[setId];
          return {
            resistance: set.resistance || 0,
            reps: set.reps || 0,
            is_drop: set.is_drop || 0,
            has_partials: set.has_partials || 0,
            is_uni: set.is_uni || 0,
          };
        }),
      };
    });

    const workoutData = {
      date, notes, tag_color: tagColor, exercises: exercisesArr,
    };

    try {
      insertWorkout(workoutData);
      resetWorkout();
      triggerRefresh(); // get past workouts callendar to refresh
    } catch (error) {
      console.error("Failed to insert workout:", error);
      throw error;
    }
  }, [date, exerciseOrder, exercises, notes, resetWorkout, tagColor, triggerRefresh]);

  return (
    <View
      // global style
      className="flex-1 bg-[#B587A8]"
    >
      <GradientBlock />
      <SafeAreaView className='flex-1' edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex:1,}}
          keyboardVerticalOffset={-10}
        >
          <ScrollView
            // content container
            className="px-6 pt-2 h-full flex-1"
            keyboardShouldPersistTaps="handled" 
            contentContainerStyle={{
              alignItems: 'center',
              paddingBottom: 32,
            }}
            showsVerticalScrollIndicator={false}          
          >
            <View // Header block
              className="flex-row items-center gap-x-3 mb-6 -ml-2 -mr-2"
            >
              <DateBox date={date} onChange={(e, selectedDate) => {if (selectedDate) { setDate(selectedDate); }}} />
              <View // Tag color and delete buttons
                className="flex-row items-center justify-between w-[20%]"
              >
                <Pressable onPress={() => {
                  triggerHaptic('light');
                  setColorModalVisible(true);
                }}>
                  <MaterialIcons name="circle" size={35} color={tagColor} />
                </Pressable>
                <ColorPickerModal
                  visible={colorModalVisible}
                  setVisibility={setColorModalVisible}
                  setSelected={setCurrentTagColor}
                />
                <Pressable onPress={() => {
                  triggerHaptic('error');
                  resetWorkout();
                }}>
                  <Ionicons name="trash" color={"black"} size={35} />
                </Pressable>
              </View>
            </View>
            
            <View // Exercise tiles
              className="flex-col gap-4 mb-6"
            >
              {exerciseOrder.map((exerciseId, index) => (
                // Map through exercise IDs in order, rendering each tile for that exercise
                <ExerciseTile
                  key={exerciseId}
                  eIndex={index+1}
                  exerciseId={exerciseId} 
                />
              ))}
            </View>

            <Pressable // Add exercise
              className="p-4 m-2 rounded-full bg-[#FFDD80] w-40 items-center"
              onPress={addExercise}
              style={{zIndex:-1}}
            >
              <Text>Add Exercise</Text>
            </Pressable>
            <NoteBlock value={notes} setter={setCurrentNotes} />
            <Pressable // Finish workout
              className="p-4 m-2 rounded-full bg-[#C5EBC3] w-56 items-center"
              onPress={handleSubmit}
            >
              <Text>Finish Workout</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default NewWorkout;
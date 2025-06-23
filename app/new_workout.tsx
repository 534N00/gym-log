import { useCurrentWorkoutStore } from '@/utils/newWorkoutStore'
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native'
import { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import DateBox from '@/components/DateBox';
import ColorPickerModal from '@/components/ColorPickerModal';
import ExerciseTile from '@/components/ExerciseTile';
import GradientBlock from '@/components/GradientBlock';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
  
  const [colorModalVisible, setColorModalVisible] = useState(false);

  return (
    <View
      // global style
      className="flex-1 bg-[#B587A8]"
    >
      <GradientBlock />
      <SafeAreaView>
        <ScrollView
          // content container
          className="px-6 pt-2 h-full"
          keyboardShouldPersistTaps="handled" 
          contentContainerStyle={{
            alignItems: 'center'
          }}
          showsVerticalScrollIndicator={false}          
        >
          <View // Header block
            className="flex-row items-center gap-x-3 mb-6 -ml-2 -mr-2"
          >
            <MaterialIcons className="-ml-2 -mr-1" name="arrow-back" size={35} color="black" />
            <DateBox date={date} onChange={(e, selectedDate) => {if (selectedDate) { setDate(selectedDate); }}} />
            <View // Tag color and delete buttons
              className="flex-row items-center justify-between w-[20%]"
            >
              <Pressable onPress={() => setColorModalVisible(true)}>
                <MaterialIcons name="circle" size={35} color={tagColor} />
              </Pressable>
              <ColorPickerModal
                visible={colorModalVisible}
                setVisibility={setColorModalVisible}
                setSelected={setCurrentTagColor}
              />
              <Pressable onPress={resetWorkout}>
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
            className="p-4 rounded-full bg-[#FFDD80] w-40 items-center"
            onPress={addExercise}
          >
            <Text>Add Exercise</Text>
          </Pressable>
          <TextInput // Notes
            className="p-2 bg-gray-200 shadow"
            placeholder="Add notes here..."
            value={notes}
            onChangeText={(note: string) => setCurrentNotes(note)}
          />
          <Pressable // Finish workout
            className="p-4 rounded-full bg-[#FFDD80] w-40 items-center"
            onPress={addExercise}
          >
            <Text>Add Exercise</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default NewWorkout;
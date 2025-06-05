import { useAppStore } from '@/utils/useAppStore';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import DateBox from '@/components/DateBox';
import GradientBlock from '@/components/GradientBlock';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const NewWorkout = () => {
  const date = useAppStore((state) => state.newWorkoutDate);
  const setDate = useAppStore((state) => state.setNewWorkoutDate);

  return (
    <View
      // global style
      className="flex-1 bg-gray-100"
    >
      <GradientBlock />
      <SafeAreaView>
        <ScrollView
          // content container
          className="grow-1 px-6 pt-2"
          contentContainerStyle={{
            paddingBottom: 32
          }}
          showsVerticalScrollIndicator={false}          
        >
          <View // Header block
            className="flex-row items-center justify-between mb-6 -ml-2 -mr-2"
          >
            <Ionicons name="chevron-back" size={35} color="black" />
            <DateBox date={date} onChange={(e, selectedDate) => {if (selectedDate) { setDate(selectedDate); }}} />
            <View // Tag color and delete buttons
              className="flex-row items-center space-x-4"
            >
              <Pressable onPress={() => console.log('color')}>
                <MaterialIcons name="circle" size={35} color={"black"} />
              </Pressable>
              <Pressable onPress={() => console.log('delete')}>
                <Ionicons name="trash-outline" color={"black"} size={45} />
              </Pressable>
            </View>
            
          </View>
          
          <Text>Component for new exercise</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default NewWorkout;
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, ScrollView, KeyboardAvoidingView, Platform, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { usePastWorkoutStore } from '@/utils/pastWorkoutStore';
import { getCompleteWorkout } from '@/utils/database';
import GradientBlock from '@/components/GradientBlock';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


// TODO: Either edit render_workout components to use one or the other zustand store
// TODO: or make copy components which would let me remove unnecessary edit buttons
// TODO: rather than just disable them
const OldWorkout = () => {
    const { workoutId } = useLocalSearchParams();
    const navigation = useNavigation();
    
    // Zustand state access
    const { setPastWorkout, date, notes, tagColor, exerciseOrder, exercises } = usePastWorkoutStore((state) => ({
              setPastWorkout: state.setPastWorkout,date: state.date, notes: state.notes,
              tagColor: state.tagColor, exerciseOrder: state.exerciseOrder, exercises: state.exercises
    }));

    // Update visual state with each workoutId
    useEffect(() => {
      // Query DB to get full info
      const fullWorkout = getCompleteWorkout(+workoutId);
      // Populate all attributes
      fullWorkout && setPastWorkout(fullWorkout);
    }, [workoutId, setPastWorkout]);

    return (
        <View className='flex-1 bg-[#B587A8]'>
          <GradientBlock/>
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
                showsVerticalScrollIndicator={false}>
                <View>
                  <Pressable className='p-4 rounded-2xl items-center bg-white' onPress={() => navigation.goBack()}>
                    <MaterialIcons className="-ml-2 -mr-1" name="arrow-back" size={35} color="black" />
                  </Pressable>
                  <Text>{workoutId}</Text>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
    );
};

export default OldWorkout;
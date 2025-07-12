import { View, Text, KeyboardAvoidingView, Platform, TextInput, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useOptionsStore } from '@/utils/optionsStore';
import GradientBlock from '@/components/GradientBlock';
import Checkbox from '@/components/Checkbox';

const AddMovements = () => {
  // States
  const exerciseOptions = useOptionsStore(state => state.exerciseOptions);
  const variantOptions = useOptionsStore(state => state.variantOptions);
  const addExercise = useOptionsStore(state => state.addExercise);
  const addVariant = useOptionsStore(state => state.addVariant);
  const removeExercises = useOptionsStore(state => state.removeExercises);
  const removeVariants = useOptionsStore(state => state.removeVariants);


  const [isExer, setIsExer] = useState(true); // toggle between exercise or variant setting
  const [inputValue, setInputValue] = useState('');
  const [checked, setChecked] = useState<Set<string>>(new Set()); // set for what items have been checked

  // For check press updating FlatList
  const handleCheck = useCallback((name: string, isChecked: boolean) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (isChecked) next.add(name);
      else next.delete(name);
      return next;
    });
  }, []);

  const handleDelete = useCallback(() => {
    if (isExer) {
      removeExercises([...checked]);
    } else {
      removeVariants([...checked]);
    }
    setChecked(new Set());
  }, [isExer, checked, removeExercises, removeVariants]);

  return (
      <View className='flex-1 bg-[#B587A8]'>
          <GradientBlock/>
          <SafeAreaView className='flex-1' edges={['top']}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1,}} keyboardVerticalOffset={-10}>
              <View // content container
                className="px-6 pt-2 h-full flex-1 items-center">
                <View // Header
                  className="flex-row flex-wrap mt-2 mb-8">
                  <Text className="text-3xl font-bold">What </Text>
                  <Pressable onPress={() => setIsExer((prev) => !prev)}>
                    <Text className={`text-3xl font-bold underline italic ${isExer ? 'text-blue-500' : 'text-lime-600'}`}>{isExer ? "exercises" : "variants"}</Text>
                  </Pressable>
                  <Text className="text-3xl font-bold">would you like to add?</Text>
                </View>
                <TextInput
                  className="p-2 w-80 h-16 rounded-xl bg-white font-bold text-2xl"
                  value={inputValue}
                  onChangeText={setInputValue}
                />
                <Pressable
                  className="p-4 m-4 rounded-full bg-[#C5EBC3] w-48 items-center"
                  onPress={() => {
                    if (isExer) {
                      addExercise(inputValue);
                    } else {
                      addVariant(inputValue);
                    }
                    setInputValue('');
                  }}
                >
                  <Text>Submit</Text>
                </Pressable>
                <View // horizontal rule
                  className="m-4 p-[1px] bg-gray-500 w-96 rounded-full"/>

                <View className="w-80 m-2">
                  <Text className="text-xl font-semibold text-center">Here&apos;s what {"exercises/variants"} you&apos;re doing already</Text>
                </View>
                <FlatList
                  className='h-80 w-96 p-2 bg-white rounded-2xl'
                  data={isExer ? exerciseOptions : variantOptions}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <View className="flex-row items-center justify-between m-2">
                      <Text className='text-lg'>{item}</Text>
                      <Checkbox
                        checked={checked.has(item)}
                        onCheck={checkedNow => handleCheck(item, checkedNow)}
                      />
                    </View>
                  )}
                  contentContainerStyle={{ paddingBottom: 16 }}
                />
                <View className="flex-row m-4 items-center justify-center">
                  <Pressable className={`${checked.size !== 0 ? 'bg-red-500' : 'bg-red-800'} m-2 w-48 p-4 rounded-full`} onPress={handleDelete}>
                    <Text className='text-center text-white'>Delete Selected</Text>
                  </Pressable>
                </View>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
  );
};

export default AddMovements;
import AutocompleteSelect from '@/components/AutocompleteSelect';
import SetControls from '@/components/render_workout/SetControls';
import { useCurrentWorkoutStore } from '@/utils/newWorkoutStore';
import Feather from '@expo/vector-icons/Feather';
import { Pressable, Text, View } from 'react-native';

interface ExerciseTileProps {
  eIndex: number; // Index of the exercise in the workout Exercise 0, 1, etc.
  exerciseId: string; // Unique identifier for the exercise
};

const ExerciseTile: React.FC<ExerciseTileProps> = ({ eIndex, exerciseId }) => {
  const removeExercise = useCurrentWorkoutStore((state) => state.removeExercise);
  const updateExercise = useCurrentWorkoutStore((state) => state.updateExercise);

  return (
      <View className="p-4 bg-white rounded-2xl h-60 w-[370px] shadow">
        {eIndex !== 1 && (
          <Pressable // Trash exercise button
            className="absolute top-2 right-2"
            onPress={() => removeExercise(exerciseId)}>
            <Feather name="x" size={20} color="black" />
          </Pressable>
        )}
        
        <View className="flex-row mb-3">      
          <View className="flex flex-col gap-y-8 mr-3 mt-3">
            <Text>Exercise {eIndex}</Text>
            <Text>Resistance Type</Text>
          </View>
          <View className="flex-col -mt-2">
            <AutocompleteSelect
              optionType="exercises"
              setter={(newExercise: string) => updateExercise(exerciseId, { name: newExercise })}
              placeholder="exercise name"
              exerciseId={exerciseId} />
            <AutocompleteSelect
              optionType="variants"
              setter={(newVariant: string) => updateExercise(exerciseId, { variant: newVariant })}
              placeholder="variant name"
              exerciseId={exerciseId} />
          </View>
        </View>
        <SetControls exerciseId={exerciseId} />
      </View>
  );
};

export default ExerciseTile;

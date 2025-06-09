import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

const AddExerciseTile = ({ onPress }: { onPress: () => void }) => {
  const [exerciseType, setExerciseType] = useState<string | null>(null);
  const [resistanceType, setResistanceType] = useState<string | null>(null);
  const [sets, setSets] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  return (
    <View>
      <Pressable>X for del</Pressable>
      <View>
        <Text>Exercise {"n"}</Text>
        <Pressable>exercise type</Pressable>
      </View>
      <View>
        <Text>Resistance Type</Text>
        <Pressable>machine/variation xx</Pressable>
      </View>
      <View></View>
    </View>
  );
};

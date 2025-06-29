
import { View, Text, Pressable, TextInput } from 'react-native';
import { useEffect, useCallback, useState } from 'react';
import { useCurrentWorkoutStore } from '@/utils/newWorkoutStore'
import Dropdown from '@/components/Dropdown';
import Checkbox from '@/components/Checkbox';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface SetControlsProps {
    exerciseId: string;
};

const SetControls: React.FC<SetControlsProps> = ({ exerciseId }) => {
    const thisExercise = useCurrentWorkoutStore((state) => state.exercises[exerciseId]);
    const [thisSet, setThisSet] = useState<any>(null); // Current set data
    const [curSetIndex, setCurSetIndex] = useState(0); // Current set index

    const addSet = useCurrentWorkoutStore((state) => state.addSet);
    const updateSet = useCurrentWorkoutStore((state) => state.updateSet);
    const removeSet = useCurrentWorkoutStore((state) => state.removeSet);

    // Sync current set data based on current seat index
    const syncData = useCallback(() => {
        // Retrieve now current set index from set order
        const setId = thisExercise.setOrder[curSetIndex];
        // Use setId to get now current set data
        setThisSet(setId ? thisExercise.sets[setId] : null);
    }, [thisExercise, curSetIndex, setThisSet]);

    // Handle deleting current set
    const handleDeleteSet = useCallback(() =>  {
        // If there is only one set, do not allow deletion
        if (thisExercise.setOrder.length <= 1) { return; }
        removeSet(exerciseId, thisSet.id);
        // Update set data with next set in order unless at end (then show previous)
        if (curSetIndex < thisExercise.setOrder.length - 1) {
            syncData(); // Stay on the current set if it exists
        } else {
            setCurSetIndex(curSetIndex - 1); // Move to the previous set if at end
            syncData();
        }
    }, [thisExercise, curSetIndex, thisSet, exerciseId, removeSet, syncData]);

    // Initially sync data from state on mount
    useEffect(() => {
        syncData();
    }, [syncData]);    

    return (
        <View className="flex-col items-center -mb-12">
            <View className="flex-row h-[53px] w-[270px] items-center justify-center bg-[#55868C] gap-x-3">
                <View // left buttons
                    className="absolute left-2 flex-row bg-[##FFDD80] rounded-full -ml-20">
                    <Pressable // Delete set button
                        onPress={handleDeleteSet}
                        className="p-4 rounded-full"
                    >
                        <Ionicons name="trash-outline" size={24} color={thisExercise.setOrder.length < 2 ? "grey" : "black"} />
                    </Pressable>
                    <Pressable // Previous set button
                        className="p-4 rounded-full bg-blue-50"
                        onPress={() => curSetIndex > 0 ? setCurSetIndex(curSetIndex - 1) : null}
                    >
                        <Ionicons name="chevron-back" size={24} color={curSetIndex === 0 ? "grey" : "black"} />
                    </Pressable>
                </View>
                
                <Text className="text-white">Set {curSetIndex+1}</Text>
                <TextInput // Resistance input
                    className="bg-gray-200 rounded-lg w-12 font-medium text-center"
                    keyboardType="numeric"
                    onChangeText={(text) => updateSet(exerciseId, thisSet.id, { resistance: parseFloat(text) || 0 })}
                    value={thisSet ? String(thisSet.resistance) : ''}
                />
                <Text className="text-white">for</Text>
                <TextInput // Reps input
                    className="bg-gray-200 rounded-lg w-10 font-medium text-center"
                    keyboardType="numeric"
                    onChangeText={(text) => updateSet(exerciseId, thisSet.id, { reps: parseInt(text) || 0 })}
                    value={thisSet ? String(thisSet.reps) : ''}
                />

                <View // Right buttons
                    className="absolute right-2 flex-row bg-[#FFDD80] rounded-full -mr-20">
                    <Pressable // Next set button
                        className="p-4 rounded-full bg-blue-50"
                        onPress={() => curSetIndex < thisExercise.setOrder.length - 1 ? setCurSetIndex(curSetIndex + 1) : null}
                    >
                        <Ionicons name="chevron-forward" size={24} color={curSetIndex === thisExercise.setOrder.length - 1 ? "grey" : "black"} />
                    </Pressable>
                    <Pressable // Add set button
                        className="p-4 rounded-full"
                        onPress={()=> {
                            addSet(exerciseId);
                            setCurSetIndex(thisExercise.setOrder.length); // Move to the new set
                        }}
                    >
                        <MaterialCommunityIcons name="plus-circle-outline" size={24} color="black" />
                    </Pressable>
                </View>
            </View>
            <View // Checkboxes for set attributes
                className="flex-row items-center justify-center gap-x-4 bg-[#55868C] h-10 w-80 rounded-bl-lg rounded-br-lg "
            >
                <Checkbox label={"Drop"} checked={!!thisSet?.is_drop} onCheck={(check => updateSet(exerciseId, thisSet.id, { is_drop: check === true ? 1 : 0 }))}/>
                <Checkbox label={"Partial"} checked={!!thisSet?.has_partials} onCheck={(check) => updateSet(exerciseId, thisSet.id, { has_partials: check === true ? 1 : 0 })}/>
                <Checkbox label={"Unilat"} checked={!!thisSet?.is_uni} onCheck={(check) => updateSet(exerciseId, thisSet.id, { is_uni: check === true ? 1 : 0 })}/>
            </View>
        </View>
    );
};

export default SetControls;
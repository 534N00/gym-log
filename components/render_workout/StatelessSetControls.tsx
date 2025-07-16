import { CompleteSet } from '@/utils/databaseInterfaces';
import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import { triggerHaptic } from '@/utils/haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import Checkbox from '@/components/Checkbox';

interface StatelessSetControlsProps {
    sets: CompleteSet[]
};

// Basically stateless copy of SetControls without references to anything since all data will be provided
const StatelessSetControls: React.FC<StatelessSetControlsProps> = ({sets}) => {

    const [curSetIndex, setCurSetIndex] = useState(0);

    return (
        <View className='flex-col items-center -mb-12'>
            <View className="flex-row h-[53px] w-80 items-center justify-center bg-[#55868C] gap-x-3 rounded-t-[24px]">
                <Pressable // Previous set button
                    className="p-4 rounded-full bg-blue-50 -ml-20 z-10"
                    onPress={() => { if (curSetIndex > 0) {
                        setCurSetIndex(curSetIndex - 1);
                        triggerHaptic('light');
                    }}}
                >
                        <Ionicons name="chevron-back" size={24} color={curSetIndex === 0 ? "grey" : "black"} />
                </Pressable>
                <Text className="text-white">Set {curSetIndex+1}</Text>
                <Text className='bg-gray-200 rounded-lg w-12 font-medium text-center'>{String(sets[curSetIndex].resistance)}</Text>
                <Text className="text-white">for</Text>
                <Text className="bg-gray-200 rounded-lg w-10 font-medium text-center">{String(sets[curSetIndex].reps)}</Text>
                <Pressable // Next set button
                    className="p-4 rounded-full bg-blue-50 -mr-20 z-10"
                    onPress={() => { if(curSetIndex < sets.length - 1) {
                        setCurSetIndex(curSetIndex + 1);
                        triggerHaptic('light'); 
                    }}}
                >
                    <Ionicons name="chevron-forward" size={24} color={curSetIndex === sets.length-1 ? "grey" : "black"} />
                </Pressable>
            </View>
            <View className="flex-row items-center justify-center gap-x-4 bg-[#55868C] h-10 w-80 rounded-bl-lg rounded-br-lg">
                <Checkbox label={"Drop"} checked={!!sets[curSetIndex]?.is_drop} editable={false} onCheck={() => {}}/>
                <Checkbox label={"Partial"} checked={!!sets[curSetIndex]?.has_partials} editable={false} onCheck={() => {}}/>
                <Checkbox label={"Unilat"} checked={!!sets[curSetIndex]?.is_uni} editable={false} onCheck={() => {}}/>
            </View>
        </View>
    );
};

export default StatelessSetControls;
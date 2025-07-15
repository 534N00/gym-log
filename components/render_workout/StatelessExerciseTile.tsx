import { CompleteExerciseDate, unixToDate } from "@/utils/database";
import { View, Text } from "react-native";
import StatelessSetControls from "./StatelessSetControls";

interface StatelessExerciseTileProps {
    exerciseData: CompleteExerciseDate;
};

// Basically stateless copy of ExerciseTile without references to anything since all data will be provided
const StatelessExerciseTile: React.FC<StatelessExerciseTileProps> = ({exerciseData}) => {
    const dateString = unixToDate(exerciseData.date)
                       .toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
    });
    return (
        <View className="p-4 bg-white rounded-2xl h-60 w-[370px] shadow">
            <View className="flex-row mb-3">
                <View className="flex flex-col gap-y-8 mr-3 mt-3">
                    <Text>{dateString}</Text>
                    <Text>Resistance Type</Text>
                </View>
                <View className="flex-col -mt-2">
                    <Text className="p-3 bg-gray-200 w-60 rounded-lg mt-2">{exerciseData.name}</Text>
                    <Text className="p-3 bg-gray-200 w-60 rounded-lg mt-2">{exerciseData.variant}</Text>    
                </View>
            </View>
            
            <StatelessSetControls sets={exerciseData.sets}/>
        </View>
    );
};

export default StatelessExerciseTile;
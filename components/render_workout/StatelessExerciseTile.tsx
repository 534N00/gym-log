import { unixToDate } from "@/utils/dateUtils";
import { CompleteExerciseDate } from "@/utils/database/databaseInterfaces";
import { View, Text } from "react-native";
import StatelessSetControls from "./StatelessSetControls";

interface StatelessExerciseTileProps {
    exerciseData: CompleteExerciseDate;
}


/**
 * StatelessExerciseTile is a component that renders detailed information about an exercise.
 * It displays the date of the exercise, its name, variant, and associated sets.
 * The component uses StatelessSetControls to render the sets of the exercise.
 * A stateless mirror of ExerciseTile.
 *
 * @prop {CompleteExerciseDate} props.exerciseData - The exercise data, including the date,
 * name, variant, and sets to be displayed.
 * @returns {JSX.Element} StatelessExerciseTile component
 */

const StatelessExerciseTile: React.FC<StatelessExerciseTileProps> = ({
    exerciseData,
}) => {
    const dateString = unixToDate(exerciseData.date).toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );
    return (
        <View className="p-4 bg-white rounded-2xl h-60 w-[370px] shadow">
            <View className="flex-row mb-3">
                <View className="flex flex-col gap-y-8 mr-3 mt-3">
                    <Text>{dateString}</Text>
                    <Text>Resistance Type</Text>
                </View>
                <View className="flex-col -mt-2">
                    <Text className="p-3 bg-gray-200 w-60 rounded-lg mt-2">
                        {exerciseData.name}
                    </Text>
                    <Text className="p-3 bg-gray-200 w-60 rounded-lg mt-2">
                        {exerciseData.variant}
                    </Text>
                </View>
            </View>

            <StatelessSetControls sets={exerciseData.sets} />
        </View>
    );
};

export default StatelessExerciseTile;

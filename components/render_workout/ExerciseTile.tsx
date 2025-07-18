import AutocompleteSelect from "@/components/AutocompleteSelect";
import SetControls from "@/components/render_workout/SetControls";
import { useNewWorkoutStore } from "@/utils/zustand_stores/newWorkoutStore";
import { usePastWorkoutStore } from "@/utils/zustand_stores/pastWorkoutStore";
import Feather from "@expo/vector-icons/Feather";
import { Pressable, Text, View } from "react-native";

interface ExerciseTileProps {
    eIndex: number;
    exerciseId: string;
    editable?: boolean;
}
/**
 * ExerciseTile is a component that displays an exercise with its sets and
 * variant information. If editable is true, it also provides a trash button
 * to delete the exercise and a dropdown to select a different exercise and
 * variant. If editable is false, it displays the exercise and variant as
 * text in a gray box.
 *
 * @prop eIndex The index of the exercise in the workout. Used to display
 * the exercise number.
 * @prop exerciseId The unique identifier for the exercise. Used to
 * access the exercise data from the state.
 * @prop editable Whether the exercise tile should be editable or not.
 * Defaults to true.
 * @returns {JSX.Element} ExerciseTile component
 */
const ExerciseTile: React.FC<ExerciseTileProps> = ({
    eIndex,
    exerciseId,
    editable = true,
}) => {
    // For updating if editable like in new_workout
    const removeExercise = useNewWorkoutStore(
        (state) => state.removeExercise
    );
    const updateExercise = useNewWorkoutStore(
        (state) => state.updateExercise
    );

    // For loading past data already loaded into state if past_workout
    const exercise = usePastWorkoutStore((s) => s.exercises[exerciseId]);

    return (
        <View className="p-4 bg-white rounded-2xl h-60 w-[370px] shadow">
            {editable && eIndex !== 1 && (
                <Pressable // Trash exercise button
                    className="absolute top-2 right-2"
                    onPress={() => removeExercise(exerciseId)}
                >
                    <Feather name="x" size={20} color="black" />
                </Pressable>
            )}

            <View className="flex-row mb-3">
                <View className="flex flex-col gap-y-8 mr-3 mt-3">
                    <Text>Exercise {eIndex}</Text>
                    <Text>Resistance Type</Text>
                </View>
                <View className="flex-col -mt-2">
                    {editable ? (
                        <>
                            <AutocompleteSelect
                                optionType="exercises"
                                setter={(newExercise: string) =>
                                    updateExercise(exerciseId, {
                                        name: newExercise,
                                    })
                                }
                                placeholder="exercise name"
                            />
                            <AutocompleteSelect
                                optionType="variants"
                                setter={(newVariant: string) =>
                                    updateExercise(exerciseId, {
                                        variant: newVariant,
                                    })
                                }
                                placeholder="variant name"
                            />
                        </>
                    ) : (
                        <>
                            <Text className="bg-gray-200 w-60 rounded-lg mt-2 p-3">
                                {exercise.name}
                            </Text>
                            <Text className="bg-gray-200 w-60 rounded-lg mt-2 p-3">
                                {exercise.variant}
                            </Text>
                        </>
                    )}
                </View>
            </View>
            <SetControls
                exerciseId={exerciseId}
                store={editable ? useNewWorkoutStore : usePastWorkoutStore}
                editable={editable}
            />
        </View>
    );
};

export default ExerciseTile;

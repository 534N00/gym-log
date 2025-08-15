import { triggerHaptic } from "@/utils/haptics";
import { useNewWorkoutStore } from "@/utils/zustand_stores/newWorkoutStore";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
// import Dropdown from '@/components/Dropdown';
import Checkbox from "@/components/Checkbox";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface SetControlsProps {
    exerciseId: string;
    store: Function;
    editable?: boolean;
}

interface StoreState {
    exercises: Record<string, any>;
}

/**
 * Set controls component for a specific exercise. Allows navigation between sets and
 * modification of set data (resistance, reps, attributes).
 * Syncs current set data on mount and any time the set index changes for rendering.
 *
 * @prop {string} exerciseId Unique identifier of the exercise for state reference
 * @prop {Function} store Hook to access the current workout state
 * @prop {boolean} [editable=false] Whether to allow modification of set data
 * @returns {JSX.Element} SetControls component
 */
const SetControls: React.FC<SetControlsProps> = ({
    exerciseId,
    store,
    editable = false,
}) => {
    const thisExercise = store(
        (state: StoreState) => state.exercises[exerciseId]
    );
    const [thisSet, setThisSet] = useState<any>(null); // New set data
    const [curSetIndex, setCurSetIndex] = useState(0); // New set index
    const [resistanceInput, setResistanceInput] = useState("");
    const [repsInput, setRepsInput] = useState("");

    const addSet = useNewWorkoutStore((state) => state.addSet);
    const updateSet = useNewWorkoutStore((state) => state.updateSet);
    const removeSet = useNewWorkoutStore((state) => state.removeSet);

    const hydrateSetData = () => {
        const setId = thisExercise.setOrder[curSetIndex];
        const setData = setId ? thisExercise.sets[setId] : null;
        setThisSet(setData);
        setResistanceInput(
            setData
                ? setData.resistance === 0
                    ? ""
                    : String(setData.resistance)
                : ""
        );
        setRepsInput(
            setData ? (setData.reps === 0 ? "" : String(setData.reps)) : ""
        );
    };

    useEffect(() => {
        hydrateSetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curSetIndex, thisExercise]);

    // Handlers for set controls
    const handleDeleteSet = useCallback (() => {
        if (thisExercise.setOrder.length < 2) {
            return;
        }
        removeSet(exerciseId, thisExercise.setOrder[curSetIndex]);
        if (curSetIndex > 0) {
            setCurSetIndex(curSetIndex - 1);
        }
    }, [curSetIndex, exerciseId, removeSet, thisExercise.setOrder]);

    const handlePrevSet = useCallback(() => {
        if (curSetIndex > 0) {
            setCurSetIndex(curSetIndex - 1);
            triggerHaptic("light");
        }
    }, [curSetIndex]);

    const handleNextSet = useCallback(() => {
        if (curSetIndex < thisExercise.setOrder.length - 1) {
            setCurSetIndex(curSetIndex + 1);
            triggerHaptic("light");
        }
    }, [curSetIndex, thisExercise.setOrder.length]);

    const handleAddSet = useCallback(() => {
        addSet(exerciseId);
        setCurSetIndex(thisExercise.setOrder.length); // Move to the new set
    }, [exerciseId, addSet, thisExercise.setOrder.length]);

    // Handlers for text inputs
    const handleResistanceChange = useCallback((text: string) => {
        setResistanceInput(text);
        if (!thisSet?.id) { return; } // Safety check
        // Allow empty string, or valid float (e.g. "7.5", "12.5")
        if (text === "") {
            updateSet(exerciseId, thisSet.id, { resistance: 0 });
        } else if (/^\d*\.?\d*$/.test(text)) {
            // Only update if the text is a valid float string and does not end with a dot
            if (!text.endsWith(".")) {
                const value = parseFloat(text);
                if (!isNaN(value)) {
                    updateSet(exerciseId, thisSet.id, { resistance: value });
                }
            }
            // If ends with ".", don't update store, just update local state
        }
    }, [exerciseId, thisSet, updateSet]);

    const handleRepsChange = useCallback((text: string) => {
        setRepsInput(text);
        if (!thisSet?.id) { return; } // Safety check
        if (text === "") {
            updateSet(exerciseId, thisSet.id, { reps: 0 });
        } else if (!isNaN(parseInt(text))) {
            updateSet(exerciseId, thisSet.id, {
                reps: parseInt(text),
            });
        }
    }, [exerciseId, thisSet, updateSet]);

    // Handlers for checkboxes
    const handleDropCheck = useCallback((check: boolean) => {
        if (!thisSet?.id) return;
        updateSet(exerciseId, thisSet.id, { is_drop: check ? 1 : 0 });
    }, [exerciseId, thisSet, updateSet]);

    const handlePartialCheck = useCallback((check: boolean) => {
        if (!thisSet?.id) return;
        updateSet(exerciseId, thisSet.id, { has_partials: check ? 1 : 0 });
    }, [exerciseId, thisSet, updateSet]);

    const handleUnilatCheck = useCallback((check: boolean) => {
        if (!thisSet?.id) return;
        updateSet(exerciseId, thisSet.id, { is_uni: check ? 1 : 0 });
    }, [exerciseId, thisSet, updateSet]);

    return (
        <View className="flex-col items-center -mb-12">
            <View className="flex-row h-[53px] w-80 items-center justify-center bg-[#55868C] gap-x-3 rounded-t-[24px]">
                {editable && (
                    <View // Delete set
                        className="absolute w-28 left-4 flex-row bg-[#FFDD80] rounded-full -ml-20"
                    >
                        <Pressable // Delete set button
                            onPress={handleDeleteSet}
                            className="p-4 rounded-full"
                        >
                            <Ionicons
                                name="trash-outline"
                                size={24}
                                color={
                                    thisExercise.setOrder.length < 2
                                        ? "grey"
                                        : "black"
                                }
                            />
                        </Pressable>
                    </View>
                )}
                <Pressable // Previous set button
                    className="p-4 rounded-full bg-blue-50 -ml-20 z-10"
                    onPress={handlePrevSet}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={curSetIndex === 0 ? "grey" : "black"}
                    />
                </Pressable>
                <Text className="text-white">Set {curSetIndex + 1}</Text>
                <TextInput // Resistance input
                    className="bg-gray-200 rounded-lg w-12 font-medium text-center"
                    keyboardType="decimal-pad"
                    editable={editable}
                    onChangeText={handleResistanceChange}
                    value={
                        editable
                            ? resistanceInput
                            : thisSet
                            ? String(thisSet.resistance)
                            : ""
                    }
                />
                <Text className="text-white">for</Text>
                <TextInput // Reps input
                    className="bg-gray-200 rounded-lg w-10 font-medium text-center"
                    keyboardType="numeric"
                    editable={editable}
                    onChangeText={handleRepsChange}
                    value={
                        editable
                            ? repsInput
                            : thisSet
                            ? String(thisSet.reps)
                            : ""
                    }
                />
                <Pressable // Next set button
                    className="p-4 rounded-full bg-blue-50 -mr-20 z-10"
                    onPress={handleNextSet}
                >
                    <Ionicons
                        name="chevron-forward"
                        size={24}
                        color={
                            curSetIndex === thisExercise.setOrder.length - 1
                                ? "grey"
                                : "black"
                        }
                    />
                </Pressable>
                {editable && (
                    <View // Add set
                        className="absolute w-28 justify-end right-4 flex-row bg-[##FFDD80] rounded-full -mr-20"
                    >
                        <Pressable // Add set button
                            className="p-4 rounded-full"
                            onPress={handleAddSet}
                        >
                            <MaterialCommunityIcons
                                name="plus-circle-outline"
                                size={24}
                                color="black"
                            />
                        </Pressable>
                    </View>
                )}
            </View>
            <View // Checkboxes for set attributes
                className="flex-row items-center justify-center gap-x-4 bg-[#55868C] h-10 w-80 rounded-bl-lg rounded-br-lg"
            >
                <Checkbox
                    label={"Drop"}
                    checked={!!thisSet?.is_drop}
                    editable={editable}
                    onCheck={handleDropCheck}
                />
                <Checkbox
                    label={"Partial"}
                    checked={!!thisSet?.has_partials}
                    editable={editable}
                    onCheck={handlePartialCheck}
                />
                <Checkbox
                    label={"Unilat"}
                    checked={!!thisSet?.is_uni}
                    editable={editable}
                    onCheck={handleUnilatCheck}
                />
            </View>
        </View>
    );
};

export default SetControls;

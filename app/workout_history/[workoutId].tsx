import GradientBlock from "@/components/GradientBlock";
import ExerciseTile from "@/components/render_workout/ExerciseTile";
import NoteBlock from "@/components/render_workout/NoteBlock";
import { getCompleteWorkout } from "@/utils/database/databaseGetters";
import { deleteWorkout } from "@/utils/database/databaseSetters";
import { usePastWorkoutStore } from "@/utils/zustand_stores/pastWorkoutStore";
import { useOptionsStore } from "@/utils/zustand_stores/optionsStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
    Animated
} from "react-native";
import { triggerHaptic } from "@/utils/haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCalendarStore } from "@/utils/zustand_stores/calendarStore";

const HOLD_DURATION = 2000; // 5 sec
const BAR_CONSTANT = 4000; // <5 sec for bar to fill up

const OldWorkout = () => {
    const { workoutId } = useLocalSearchParams();
    const navigation = useNavigation();

    // Zustand state access
    const setPastWorkout = usePastWorkoutStore((state) => state.setPastWorkout);
    const date = usePastWorkoutStore((s) => s.date);
    const notes = usePastWorkoutStore((s) => s.notes);
    const tagColor = usePastWorkoutStore((s) => s.tagColor);
    const exerciseOrder = usePastWorkoutStore((s) => s.exerciseOrder);
    const triggerRefresh = useOptionsStore((s) => s.triggerRefresh);
    const deleteMarkedDate = useCalendarStore((s) => s.deleteMarkedDate);
    

    const animation = useRef(new Animated.Value(0)).current;
    const holdTimeout = useRef<NodeJS.Timeout | number | null>(null);
    
    const startHold = () => {
        triggerHaptic("tap");
        Animated.timing(animation, {
            toValue: 1,
            duration: BAR_CONSTANT,
            useNativeDriver: false,
        }).start();
        holdTimeout.current = setTimeout(() => {
            deleteWorkout(+workoutId);
            triggerRefresh();
            typeof workoutId === "string" && deleteMarkedDate(workoutId); // delete marked date from calendar
            triggerHaptic("success");
            navigation.goBack();
        }, HOLD_DURATION);
    };

    const cancelHold = () => {
        if (holdTimeout.current) clearTimeout(holdTimeout.current);
        Animated.timing(animation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    // Update visual state with each workoutId
    useEffect(() => {
        // Query DB to get full info
        const fullWorkout = getCompleteWorkout(+workoutId);
        // Populate all attributes
        fullWorkout && setPastWorkout(fullWorkout);
    }, [workoutId, setPastWorkout]);

    return (
        <View className="flex-1 bg-[#B587A8]">
            <GradientBlock />
            <SafeAreaView className="flex-1" edges={["top"]}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={-10}
                >
                    <ScrollView
                        // content container
                        className="px-6 pt-2 h-full flex-1"
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            alignItems: "center",
                            paddingBottom: 32,
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View // Header block
                            className="flex-row items-center gap-x-3 mb-6 -ml-2 -mr-2"
                        >
                            <Pressable
                                className="p-4 rounded-xl items-center bg-white"
                                onPress={() => navigation.goBack()}
                            >
                                <MaterialIcons
                                    className="-ml-2 -mr-1"
                                    name="arrow-back"
                                    size={30}
                                    color="black"
                                />
                            </Pressable>
                            <View className="rounded-2xl p-4 bg-zinc-50 w-80">
                                <Text className="text-3xl font-bold text-center">
                                    {date.toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </Text>
                            </View>
                            <MaterialIcons
                                name="circle"
                                size={35}
                                color={tagColor}
                            />
                        </View>
                        {/* <Text>{workoutId}</Text> */}
                        <View // exercise tiles
                            className="flex-col gap-4 mb-6"
                        >
                            {exerciseOrder.map((exerciseId, index) => (
                                // Map through exercise IDs in order, rendering each tile for that exercise
                                <ExerciseTile
                                    key={exerciseId}
                                    eIndex={index + 1}
                                    exerciseId={exerciseId}
                                    editable={false}
                                />
                            ))}
                        </View>
                        <NoteBlock value={notes} editable={false} />
                        <Pressable // reset DB
                            className="p-4 bg-red-100 rounded-full m-2 overflow-hidden"
                            onPressIn={startHold}
                            onPressOut={cancelHold}
                        >
                            <Animated.View
                                className="absolute left-0 top-0 bottom-0 bg-[#F87171] rounded-full opacity-60"
                                style={{
                                    width: animation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ["0%", "100%"],
                                    }),
                                }}
                            />
                            <Text className="items-center font-bold">Delete Workout</Text>
                        </Pressable>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

export default OldWorkout;

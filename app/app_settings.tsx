import DismissKeyboardWrapper from "@/components/DismissKeyboardWrapper";
import GradientBlock from "@/components/GradientBlock";
import { resetDatabase } from "@/utils/database/database";
import * as exporting from "@/utils/exporting";
import { triggerHaptic } from "@/utils/haptics";
import { useOptionsStore } from "@/utils/zustand_stores/optionsStore";
import { useRef, useState } from "react";
import { Animated, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HOLD_DURATION = 5000; // 5 sec
const BAR_CONSTANT = 11000; // <5 sec for bar to fill up

const AppSettings = () => {
    const userName = useOptionsStore((state) => state.userName);
    const setUserName = useOptionsStore((state) => state.setUserName);
    const triggerRefresh = useOptionsStore((state) => state.triggerRefresh);
    const resetOptionsStore = useOptionsStore((state) => state.resetOptionsStore);
    const [userNameField, setUserNameField] = useState(userName);
    const [uriObj, setUriObj] = useState<{
        workoutsUri: string;
        namesUri: string;
    } | null>(null);

    // Reset DB animation logic
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
            resetDatabase();
            triggerHaptic("success");
            animation.setValue(0);
            triggerRefresh();
            resetOptionsStore();
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

    return (
        <View className="flex-1 bg-[#B587A8]">
            <GradientBlock />
            <DismissKeyboardWrapper>
                <SafeAreaView className="flex-1" edges={["top"]}>
                    <View // content continer
                        className="px-6 pt-2 flex-1 items-center"
                    >
                        <View className="w-full mb-6">
                            <Text className="text-4xl font-bold">Settings</Text>
                        </View>
                        <View className="w-full">
                            <Text className="text-xl font-semibold w-full mb-3">
                                Personal Preferences
                            </Text>
                            <Text className="text-lg">User Name</Text>
                            <TextInput
                                className="p-3 bg-white rounded-2xl w-52"
                                value={userNameField}
                                onChangeText={setUserNameField}
                                placeholder="Your name here"
                                onBlur={() => setUserName(userNameField)}
                            />
                        </View>
                        <View // horizontal rule
                            className="m-4 p-[1px] bg-gray-500 w-96 rounded-full"
                        />
                        <View className="w-full items-center">
                            <Text className="text-xl font-semibold w-full">
                                User Data Export
                            </Text>
                            <Pressable
                                className="p-4 bg-[#C5EBC3] rounded-full m-2 w-52 items-center"
                                onPress={async () => {
                                    triggerHaptic("success");
                                    const obj =
                                        await exporting.exportWorkouts();
                                    setUriObj(obj);
                                }}
                            >
                                <Text>Generate user data CSV</Text>
                            </Pressable>
                            <View className="flex-row">
                                <Pressable
                                    onPress={() => {
                                        if (uriObj) {
                                            exporting.shareCsv(
                                                uriObj.workoutsUri
                                            );
                                            triggerHaptic("tap");
                                        }
                                    }}
                                    className="p-4 rounded-full m-2 w-48 items-center"
                                    style={{
                                        backgroundColor: uriObj
                                            ? "#FFDD80"
                                            : "#DABD6B",
                                    }}
                                >
                                    <Text>Share workout data</Text>
                                </Pressable>
                                <Pressable
                                    className="p-4 rounded-full m-2 w-48 items-center"
                                    style={{
                                        backgroundColor: uriObj
                                            ? "#FFDD80"
                                            : "#DABD6B",
                                    }}
                                    onPress={() => {
                                        if (uriObj) {
                                            exporting.shareCsv(uriObj.namesUri);
                                            triggerHaptic("tap");
                                        }
                                    }}
                                >
                                    <Text>Share name data</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View // horizontal rule
                            className="m-4 p-[1px] bg-gray-500 w-96 rounded-full"
                        />
                        <View className="w-full items-center">
                            <Text className="text-xl font-semibold w-full">
                                Danger Zone
                            </Text>
                            <Pressable // reset DB
                                className="p-4 bg-red-100 rounded-2xl m-2 overflow-hidden"
                                onPressIn={startHold}
                                onPressOut={cancelHold}
                            >
                                <Animated.View
                                    className="absolute left-0 top-0 bottom-0 bg-[#F87171] rounded-xl opacity-60"
                                    style={{
                                        width: animation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ["0%", "100%"],
                                        }),
                                    }}
                                />
                                <Text className="items-center font-bold">
                                    Hold to reset DB
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </DismissKeyboardWrapper>
        </View>
    );
};

export default AppSettings;

import { View, Text } from "react-native";
/**
 * Component displaying number of days since last workout.
 * Accesses SQLite database for most recent log, pulls current date, and does arithmetic
 */
const DaysSinceLastWorkout = () => {
 
  return (
    <View>
        <Text className="text-3xl font-extrabold">{"Some number based on arith"}</Text>
        <Text>days since last workout</Text>
    </View>
  );
}
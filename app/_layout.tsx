import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import "@/global.css"; // Import NativeWind 


export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Tabs screenOptions={{
        tabBarActiveTintColor: "green"
      }}>
        <Tabs.Screen name="index" options={{
          title: "Home",
          headerShown: false,
          tabBarLabel: ({ focused }) => focused ? <Text>Home</Text> : <Text></Text>,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />
        }} />
        <Tabs.Screen name="workout_history" options={{
          title: "History",
          tabBarLabel: ({ focused }) => focused ? <Text>History</Text> : <Text></Text>,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="history" color={color} size={size} />
        }} />
        <Tabs.Screen name="new_workout" options={{
          title: "New Workout",
          tabBarLabel: ({ focused }) => focused ? <Text>New Workout</Text> : <Text></Text>,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="weight-lifter" color={color} size={size} />
        }} />
        <Tabs.Screen name="add_movements" options={{
          title: "Add Movements",
          tabBarLabel: ({ focused }) => focused ? <Text>Add Movements</Text> : <Text></Text>,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="run" color={color} size={size} />
        }} />
        <Tabs.Screen name="app_settings" options={{
          title: "Settings",
          tabBarLabel: ({ focused }) => focused ? <Text>Settings</Text> : <Text></Text>,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="cog" color={color} size={size} />
        }} />
      </Tabs>
    </SafeAreaProvider>
  );
};

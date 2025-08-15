import "@/global.css"; // Import NativeWind styles
import { initDatabase } from "@/utils/database/database"; // Import database initialization
import { useEffect } from "react";

import { hydrateStoreFromAsyncStorage } from "@/utils/asyncStorage";
import { useOptionsStore } from "@/utils/zustand_stores/optionsStore";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  // Initialize the database when the app starts and hydrate stores
  const initExerciseVariantOptions = useOptionsStore((state) => state.initExerciseVariantOptions);
  useEffect(() => {
    initDatabase();
    initExerciseVariantOptions();
    hydrateStoreFromAsyncStorage();
  });

  return (    
    <SafeAreaProvider // calculates safe area for SafeAreaViews      
    >
      <StatusBar style="auto"/>
      <Tabs screenOptions={{
        tabBarActiveTintColor: "#55868C",
        tabBarStyle: {
          // backgroundColor: "white",
          height: 60
        }
      }}>
        <Tabs.Screen name="index" options={{
          title: "Home",
          headerShown: false,
          tabBarLabel: ({ focused }) => focused ? <Text>Home</Text> : <></>,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />
        }} />
        <Tabs.Screen name="workout_history" options={{
          title: "History",
          headerShown: false,
          tabBarLabel: ({ focused }) => focused ? <Text>History</Text> : <></>,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="history" color={color} size={size} />
        }} />
        <Tabs.Screen name="new_workout" options={{
          title: "New",
          headerShown: false,
          tabBarLabel: ({ focused }) => focused ? <Text>New</Text> : <></>,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="weight-lifter" color={color} size={size} />
        }} />
        <Tabs.Screen name="add_movements" options={{
          title: "Movements",
          headerShown: false,
          tabBarLabel: ({ focused }) => focused ? <Text>Moves</Text> : <></>,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="run" color={color} size={size} />
        }} />
        <Tabs.Screen name="app_settings" options={{
          title: "Settings",
          headerShown: false,
          tabBarLabel: ({ focused }) => focused ? <Text>Settings</Text> : <></>,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="cog" color={color} size={size} />
        }} />
      </Tabs>
    </SafeAreaProvider>
  );
};

import "@/global.css"; // Import NativeWind styles
import { initDatabase } from "@/utils/database"; // Import database initialization
import { useEffect } from "react";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function RootLayout() {
  useEffect(() => {
    // Initialize the database when the app starts
    initDatabase();
    console.log("Database initialized");
  }, []);

  return (    
    <SafeAreaProvider // calculates safe area for SafeAreaViews      
    >
      <StatusBar style="auto"/>
      <Tabs screenOptions={{
        tabBarActiveTintColor: "green",
        tabBarStyle: {
          // backgroundColor: "white",
          borderTopLeftRadius:15,
          borderTopRightRadius:15,
          // height: 60
        }
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
          title: "New",
          headerShown: false,
          tabBarLabel: ({ focused }) => focused ? <Text>New</Text> : <Text></Text>,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="weight-lifter" color={color} size={size} />
        }} />
        <Tabs.Screen name="add_movements" options={{
          title: "Movements",
          tabBarLabel: ({ focused }) => focused ? <Text>Movements</Text> : <Text></Text>,
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

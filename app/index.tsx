import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import GradientBlock from "@/components/GradientBlock";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Index() {
  const router = useRouter();
  
  return (
    <View // global style      
      className="flex-1 bg-gray-100"
    >
      <GradientBlock />
      <SafeAreaView>
        <ScrollView // content container          
          className="grow-1 px-6 pt-4"
          contentContainerStyle={{
            paddingBottom: 32
          }}
          showsVerticalScrollIndicator={false}
        >
          <View // welcome message
            className="mb-6"
          >
              <Text className="text-4xl font-bold mb-2">Welcome back!</Text>
              <Text className="text-xl font-semibold">Ready to get into it?</Text>
          </View>
          <View // bubbles
            className="h-[100] flex-row items-center justify-between mb-6"
          > 
            <View className="w-[55%] h-full rounded-3xl p-4 bg-zinc-50 items-center">
              <Text className="text-3xl font-extrabold mt-2 mb-2">9</Text>
              <Text className="text-lg">days since last workout</Text>
            </View>
            <Pressable onPress={() => router.push('/new_workout')}
              className="w-[40%] h-full rounded-3xl p-4 bg-zinc-50 items-center"
            >
              <MaterialCommunityIcons name="heart-plus" color={"darkred"} size={45} />
              <Text className="text-lg mt-1">New Workout</Text>
            </Pressable>
          </View>
         
          <View> 
            <Text>Component here</Text>
          </View>
          
          <View>
            <Text>Recent Workouts</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

import GradientBlock from "@/components/GradientBlock";
import { getMostRecentDate } from "@/utils/database/database";
import { triggerHaptic } from "@/utils/haptics";
import { useOptionsStore } from "@/utils/zustand_stores/optionsStore";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TODAY = new Date(), MS_PER_DAY = 86400000;

export default function Index() {
  const router = useRouter();
  const userName = useOptionsStore(state => state.userName);
  const [recentDate, setRecentDate] = useState<Date | null>(TODAY);

  // Calc num of days between two dates
  const daysBetween = (newer: Date, older: Date) => {
    // Normalize to midnight
    const d1 = new Date(newer.getFullYear(), newer.getMonth(), newer.getDate());
    const d2 = new Date(older.getFullYear(), older.getMonth(), older.getDate());
    return Math.floor((d1.getTime() - d2.getTime()) / MS_PER_DAY);
  }
  
  // Update the 'days since last workout info'
  const refresh = useOptionsStore((state) => state.refresh);
  useEffect(() => {
    const recent = getMostRecentDate();
    setRecentDate(recent);
  }, [refresh]);

  return (
    <View // global style      
      className="flex-1 bg-[#B587A8]"
    >
      <GradientBlock />
      <SafeAreaView className='flex-1' edges={['top']}>
        <ScrollView // content container          
          className="grow-1 px-6 pt-2"
          contentContainerStyle={{
            paddingBottom: 32
          }}
          showsVerticalScrollIndicator={false}
        >
          <View // welcome message
            className="mb-6"
          >
              <Text className="text-4xl font-bold mb-2">{`Welcome back${userName === '' ? '' : ` ${userName}`}!`}</Text>
              <Text className="text-xl font-semibold">Ready to get into it?</Text>
          </View>
          <View // bubbles
            className="flex-row items-center justify-between"
          > 
            <View className="w-[55%] h-full rounded-3xl p-4 bg-zinc-50 items-center">
              <Text className="text-3xl font-extrabold mt-2 mb-2">{recentDate ? daysBetween(TODAY, recentDate) : -1}</Text>
              <Text className="text-lg">days since last workout</Text>
            </View>
            <Pressable onPress={() => { router.push('/new_workout'); triggerHaptic('tap'); }}
              className="w-[40%] h-full rounded-3xl p-4 bg-zinc-50 items-center"
            >
              <MaterialCommunityIcons name="heart-plus" color={"darkred"} size={45} />
              <Text className="text-lg mt-1">New Workout</Text>
            </Pressable>
          </View>
          
          <Pressable onPress={() => triggerHaptic('wolf')}>
            <Image className="w-full" resizeMode='contain' style={{height: 500}} source={require('@/assets/images/wolf-ripping-shirt.gif')} />
          </Pressable>         
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

import { View, Text, Pressable, Animated } from 'react-native'
import { useRef } from 'react'
import GradientBlock from '@/components/GradientBlock';
import { SafeAreaView } from 'react-native-safe-area-context';
import { resetDatabase } from '@/utils/database';
import { triggerHaptic } from '@/utils/haptics';

const HOLD_DURATION = 5000; // 5 sec
const BAR_CONSTANT = 11000; // <5 sec for bar to fill up

const AppSettings = () => {
  // Reset DB animation logic
  const animation = useRef(new Animated.Value(0)).current;
  const holdTimeout = useRef<NodeJS.Timeout | number | null>(null);

  const startHold = () => {
    triggerHaptic('tap');
    Animated.timing(animation, {
      toValue: 1, duration: BAR_CONSTANT, useNativeDriver: false,
    }).start();
    holdTimeout.current = setTimeout(() => {
      resetDatabase();
      triggerHaptic('success');
      animation.setValue(0);
    }, HOLD_DURATION);
  }

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
      <SafeAreaView className='flex-1' edges={['top']}>
        <View // content continer
          className="px-6 pt-2 flex-1 items-center"
        >
          <View className='w-full'>
            <Text className="text-4xl font-bold">Settings</Text>
          </View>
          <Pressable
            className="p-4 bg-white rounded-2xl m-2 overflow-hidden"
            onPressIn={startHold}
            onPressOut={cancelHold}
          >
            <Animated.View
              className="absolute left-0 top-0 bottom-0 bg-[#F87171] rounded-xl opacity-60"
              style={{
                width: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              }}
            />
            <Text className="items-center font-bold">
              Hold to reset DB
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AppSettings;
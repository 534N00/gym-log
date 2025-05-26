import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <ScrollView
      className="grow-1 bg-green-50 dark:bg-green-500"
      contentContainerStyle={{
        // flexGrow:1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SafeAreaView edges={['top']}>
        <View>
        <Text>Welcome back!</Text>
        <Text>Read to get back into it?</Text>
       </View>
      </SafeAreaView>
       
    </ScrollView>
  );
}

import { View, useColorScheme, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientBlock = () => {
  // Calculate height of display
  const screenHeight = Dimensions.get('window').height;
  const blockHeight = screenHeight * 0.3; // 30% of the screen height (can be stored in state)

  const colorScheme = useColorScheme();
  // Colors for light and dark mode
  
  return (
    <>
      <View style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: blockHeight,
        backgroundColor: "#E6CBDF"
      }}/>
      <LinearGradient
        colors={["#E6CBDF", "#B587A8"]}
        style={{
          position: 'absolute',
          top: blockHeight - 50, // Overlap with solid block
          left: 0,
          right: 0,
          height: 200 // Fixed height for transition
      }}/>
    </>
  );
};

export default GradientBlock;
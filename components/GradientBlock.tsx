import { View, useColorScheme, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientBlock = () => {
  // Calculate height of display
  const screenHeight = Dimensions.get('window').height;
  const blockHeight = screenHeight * 0.3; // 30% of the screen height (can be stored in state)

  const colorScheme = useColorScheme();
  // Colors for light and dark mode
  const colors = {
    light: ['lightblue', '#f5f5f5'] as [string, string],
    dark: ['#1e90ff', '#000080'] as [string, string] // Example colors for dark mode
  };
  const gradient = colors.light;
  // const gradient = colorScheme === 'dark' ? colors.dark : colors.light;

  return (
    <>
      <View style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: blockHeight,
        backgroundColor: gradient[0]
      }}/>
      <LinearGradient
        colors={gradient}
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
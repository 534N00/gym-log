import { View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * GradientBlock is used to create a gradient effect on the background of the app.
 * The gradient transitions from #E6CBDF to #B587A8 but can be modified to change colors.
 * The gradient is on top of a solid block with the same starting color, which is 30% of the screen height.
 * The gradient block is absolutely positioned at the top of the screen with a fixed height of 200.
 * @returns {JSX.Element} A JSX element representing the gradient block.
 */
const GradientBlock = () => {
  // Calculate height of display
  const screenHeight = Dimensions.get('window').height;
  const blockHeight = screenHeight * 0.3; // 30% of the screen height (can be stored in state)
  
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
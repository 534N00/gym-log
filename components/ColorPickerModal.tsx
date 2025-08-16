import { Modal, Pressable, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { triggerHaptic } from "@/utils/haptics";

const COLORS = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F1C40F",
    "#8E44AD",
    "#f7f335ff",
];

interface ColorPickerModalProps {
    visible: boolean;
    setVisibility: (visible: boolean) => void;
    setSelected: (color: string) => void;
}

/**
 * A modal that displays a color picker. It will appear when the
 * `visible` prop is true, and it will close when the user taps
 * outside of the color picker or selects a color.
 *
 * @prop {boolean} visible - Whether the modal is visible or not
 * @prop {(visible: boolean) => void} setVisibility - A function to
 * set the visibility of the modal
 * @prop {(color: string) => void} setSelected - A function to
 * call when the user selects a color
 * @returns {JSX.Element} - The rendered color picker modal
 */
const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
    visible,
    setVisibility,
    setSelected,
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisibility(false)}
        >
            <Pressable // to close modal when tapping outside
                className="flex-1 justify-center items-center relative"
                onPress={() => setVisibility(false)}
            >
                <Pressable
                    className="absolute top-20 right-5"
                    onPress={(e) => e.stopPropagation()}
                >
                    <View
                        style={{
                            backgroundColor: "rgba(230,230,230,0.6)",
                            borderColor: "rgba(255,255,255,0.5)",
                            borderWidth: 1,
                        }}
                        className="rounded-lg p-4 h-[110px] w-[157px] flex-row flex-wrap bg-opacity-40 backdrop-blur-sm"
                    >
                        {COLORS.map((color: string) => (
                            <Pressable
                                className="p-1"
                                key={color}
                                onPress={() => {
                                    triggerHaptic("tap");
                                    setSelected(color);
                                    setVisibility(false);
                                }}
                            >
                                <MaterialIcons
                                    name="circle"
                                    size={35}
                                    color={color}
                                />
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default ColorPickerModal;

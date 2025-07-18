import { Pressable, Text, View } from "react-native";
import { triggerHaptic } from "@/utils/haptics";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface CheckboxProps {
    label?: string;
    editable?: boolean;
    onCheck: (check: boolean) => void;
    checked: boolean;
}

/**
 * A simple checkbox component that renders a label and a checkbox button.
 *
 * @prop {string} [label] - Optional label for the checkbox
 * @prop {boolean} [editable=true] - Whether the checkbox is editable or not
 * @prop {Function} onCheck - Function that will be called when the checkbox is pressed
 * @prop {boolean} checked - Whether the checkbox is checked or not
 * @returns JSX.Element - The rendered checkbox component
 */
const Checkbox: React.FC<CheckboxProps> = ({
    label,
    checked,
    editable = true,
    onCheck,
}) => {
    return (
        <View className="ml-2 mr-2 flex-row items-center gap-x-2">
            {label && <Text className="text-white">{label}</Text>}
            <Pressable
                className="p-3 rounded-md bg-white shadow-md justify-center items-center"
                disabled={!editable}
                onPress={() => {
                    triggerHaptic("light");
                    onCheck(!checked);
                }}
            >
                {checked && (
                    <FontAwesome
                        name="check"
                        size={10}
                        color="black"
                        className="-m-1.5"
                    />
                )}
            </Pressable>
        </View>
    );
};

export default Checkbox;

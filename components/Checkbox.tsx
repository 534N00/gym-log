import { Pressable, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface CheckboxProps {
    label: string;
    onCheck: (check: boolean) => void;
    checked: boolean;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onCheck }) => {
    return (
        <View className="ml-2 mr-2 flex-row items-center gap-x-2">
            <Text className="text-white">{label}</Text>
            <Pressable
                className="p-3 rounded-md bg-white shadow-md justify-center items-center"
                onPress={() => {
                    onCheck(!checked)
                }}
            >
                {checked && (
                    <FontAwesome name="check" size={10} color="black" className="-m-1.5" />
                )}
            </Pressable>
        </View>
    );
};

export default Checkbox;
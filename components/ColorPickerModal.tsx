import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Pressable, View } from 'react-native';

const COLORS = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#F1C40F',
    '#8E44AD',
    '#E74C3C',
];

interface ColorPickerModalProps {
    visible: boolean;
    setVisibility: (visible: boolean) => void;
    setSelected: (color: string) => void;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({visible, setVisibility, setSelected}) => {
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisibility(false)}
        >
            <Pressable // to close modal when tapping outside
                className="flex-1 justify-center items-center"
                onPress={() => setVisibility(false)}
            >
                <Pressable
                    onPress={e => e.stopPropagation()}
                >
                    <View className="bg-[#C5EBC3] rounded-lg p-4 h-[110px] w-[155px] flex-row flex-wrap">
                        {COLORS.map((color: string) => (
                            <Pressable
                                className="p-1"
                                key={color}
                                onPress={() => {
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
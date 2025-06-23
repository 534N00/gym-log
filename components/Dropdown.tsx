import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

interface DropdownProps {
    options: string[];
    selected: string;
    onSelect: (value: string) => void; 
};

const Dropdown: React.FC<DropdownProps> = ({ options, selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility
    
    return (
        <View className="w-14">
            <Pressable className="bg-red-50 rounded-lg font-medium flex-row items-center justify-center pt-3 pb-3" onPress={() => setIsOpen(!isOpen) }>
                <Text>{selected}</Text>
                <Ionicons name={isOpen ? "caret-up" : "caret-down"} size={16} color="black" />
            </Pressable>
            {isOpen && options.map((item) => (
                <Pressable 
                    key={item}
                    className="absolute z-50"
                    onPress={() => {
                        onSelect(item);
                        setIsOpen(false);
                    }}
                >
                    <Text>{item}</Text>
                </Pressable>
            ))}
        </View>
        
    );
}

export default Dropdown;
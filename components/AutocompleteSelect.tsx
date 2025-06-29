import { View, TextInput, Text, Keyboard, Pressable } from 'react-native';
import { useCurrentWorkoutStore } from '@/utils/newWorkoutStore';
import { useOptionsStore } from '@/utils/optionsStore';
import { useState, useEffect } from 'react';

interface AutocompleteSelectProps {
    optionType: string; // 'exercises' or 'variants'
    setter: Function; // Function to set the selected option
    placeholder?: string; // Placeholder text for the input
    exerciseId: string; // Optional, but needed for loading with past data
    isPast?: boolean; // Optional, for determining if we need to fetch past data
}

// Why do I have query state rather then directly update the store?
// Because it is easier to manage one text state then worry about updating whatever in store later,
// and because this gives behavior of only saving when the user selects a predefined option rather than type whatever in.
const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({ 
    optionType, 
    setter, 
    placeholder = "",
    exerciseId,
    isPast = false 
}) => {

    const [query, setQuery] = useState(''); // text input
    const [showDropdown, setShowDropdown] = useState(false); // dropdown bool

    // Populate text field with past data if exerciseId is provided
    useEffect(() => {
        if (isPast) {
            const thisExercise = useCurrentWorkoutStore.getState().exercises[exerciseId];
            if (thisExercise) {
                if (optionType === 'exercises') {
                    setQuery(thisExercise.name);
                } else if (optionType === 'variants') {
                    setQuery(thisExercise.variant);
                }
            }
        }
    }, [isPast, exerciseId, optionType, setQuery]);

    const exerciseOptions = useOptionsStore((state) => state.exerciseOptions);
    const variantOptions = useOptionsStore((state) => state.variantOptions);
    const options = optionType === 'exercises' ? exerciseOptions : variantOptions; // What options to display in dropdown

    const filteredOptions = options
        .filter(option => option.toLowerCase().includes(query.toLowerCase())) // Simple filtering
        .slice(0, 5); // Limit to first 5 matches

    return ( 
        <View>
            <TextInput
                className="bg-gray-200 w-60 rounded-lg mt-2"
                value={query}
                onChangeText={(text) => { // Update query and show dropdown
                    setQuery(text);
                    setShowDropdown(true);
                }}
                onBlur={() => { setShowDropdown(false); }} // Hide dropdown on blur
                placeholder={placeholder}
            />
            {(showDropdown && query.trim() !== "" && filteredOptions.length > 0) && (
                // Dropdown for filtered options
                <View className="absolute top-[100%] left-0 right-0 bg-white shadow-lg rounded-md z-50">
                    {filteredOptions.map((item) => (
                        <Pressable 
                            key={item}
                            className="py-3 px-4 border-b border-gray-100"
                            onPress={() => {
                                setShowDropdown(false); // Hide dropdown after selection
                                setQuery(item);
                                setter(item);
                                Keyboard.dismiss(); // Dismiss keyboard
                            }}
                        >
                            <Text>{item}</Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}

export default AutocompleteSelect;
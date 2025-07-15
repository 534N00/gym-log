import { View, TextInput, Text, Keyboard, Pressable } from 'react-native';
import { useOptionsStore } from '@/utils/optionsStore';
import { useState, useCallback } from 'react';
import { triggerHaptic } from '@/utils/haptics';

interface AutocompleteSelectProps {
    optionType: string; // 'exercises' or 'variants'
    setter: Function; // Function to set the selected option
    placeholder?: string; // Placeholder text for the input
    size?: string; // for if used in exercise tile or in past workout search (conditional CSS basically)
}

// Why do I have query state rather then directly update the store?
// Because it is easier to manage one text state then worry about updating whatever in store later,
// and because this gives behavior of only saving when the user selects a predefined option rather than type whatever in.
const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({ optionType, setter, placeholder="", size='small'}) => {
    const [query, setQuery] = useState(''); // text input
    const [showDropdown, setShowDropdown] = useState(false); // dropdown bool

    // Figure out which variable in store to use
        // Stuck doing this because they're all in the same store, named different things (refactor potential)
    const options = useOptionsStore(state => optionType === 'variants'
                                        ? state.variantOptions : state.exerciseOptions);
    const filteredOptions = options
        .filter(option => option.toLowerCase().includes(query.toLowerCase())) // Simple filtering
        .slice(0, 4); // Limit to first 4 matches

    // Update internal text field state and outside state using selection
    const handleSelect = useCallback((item: string) => {
        triggerHaptic('tap'); // Happtic trigger
        setShowDropdown(false); // Hide dropdown after selection
        setQuery(item); // Internal state update
        setter(item); // External state update
        Keyboard.dismiss(); // Dismiss keyboard
    }, [setter]);

    return ( 
        <View>
            <TextInput
                className={size === 'small' ? "bg-gray-200 w-60 rounded-lg mt-2" : "p-2 w-80 h-16 rounded-xl bg-white font-bold text-2xl"}
                value={query}
                onChangeText={(text) => { // Update query and show dropdown
                    setQuery(text);
                    if (text === '') {
                        setter('');
                    }
                    setShowDropdown(true);
                }}
                onBlur={() => { setShowDropdown(false); }} // Hide dropdown on blur
                placeholder={placeholder}
            />
            {(showDropdown && query.trim() !== "" && filteredOptions.length > 0) && (
                // Dropdown for filtered options
                <View className="absolute top-[100%] left-0 right-0 bg-white shadow-lg rounded-xl z-50">
                    {filteredOptions.map((item, idx) => (
                        <Pressable 
                            key={item}
                            className={`py-3 px-4 ${idx !== filteredOptions.length - 1 ? 'border-b border-gray-100' : ''}`}
                            onPress={() => {
                                console.log('press');
                                handleSelect(item);
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
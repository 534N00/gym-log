import { useState } from "react";
import { Text, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { triggerHaptic } from "@/utils/haptics";

interface DateBoxProps {
    date: Date;
    onChange: (event: any, selectedDate?: Date) => void;
}

/**
 * DateBox component renders a pressable text displaying the provided date.
 * When pressed, it displays a DateTimePicker for selecting a date.
 * Once a date is selected or the picker is dismissed,
 * the onChange callback is called with the selected date.
 * 
 * @prop {Date} date - The current date to display.
 * @prop {Function} onChange - Callback function to handle the change in date.
 * @returns {JSX.Element} ExerciseTile component
 */
const DateBox: React.FC<DateBoxProps> = ({ date, onChange }) => {
    // State to control the visibility of the DateTimePicker
    const [showPicker, setShowPicker] = useState(false);

    return (
        <>
            <Pressable
                className="rounded-2xl p-4 bg-zinc-50 w-80"
                onPress={() => {
                    triggerHaptic("tap");
                    setShowPicker(true);
                }}
            >
                <Text className="text-3xl font-bold text-center">
                    {date.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </Text>
            </Pressable>

            {showPicker && ( // conditionaly render DateTimePicker based on showPicker state
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(e, selectedDate) => {
                        setShowPicker(false);
                        onChange(e, selectedDate);
                    }}
                />
            )}
        </>
    );
};
export default DateBox;

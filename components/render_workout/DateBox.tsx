import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateBox = ({ date, onChange }: {
  date: Date;
  onChange: (event: any, selectedDate?: Date) => void;
}) => {
  // State to control the visibility of the DateTimePicker
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <Pressable 
        className="rounded-2xl p-4 bg-zinc-50 w-[68%]"
        onPress={() => setShowPicker(true)}
        
      >
        <Text className="text-3xl font-bold text-center">
          {date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
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
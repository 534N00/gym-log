import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateBox = ({ date, onChange }: {
  date: Date;
  onChange: (event: any, selectedDate?: Date) => void;
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <Pressable 
        onPress={() => setShowPicker(true)}
        className="bg-zinc-100 px-4 py-2 rounded-xl"
      >
        <Text className="text-2xl font-bold">
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
import { Text, Pressable } from 'react-native';
import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface WorkoutPreviewProps {
    workoutId: number,
    readable_date: string,
    color: string,
};

const WorkoutPreview: React.FC<WorkoutPreviewProps> = ({ workoutId, readable_date, color }) => {
    const router = useRouter();
    const handlePress = useCallback(() => {
        router.push(`/workout_history/${workoutId}`);
    }, [workoutId, router]);

    return (
        <Pressable
            className="flex-row p-3 w-52 h-14 mb-2 rounded-xl bg-gray-200 gap-x-2 items-center"
            onPress={handlePress}
        >
            <MaterialIcons name="circle" size={24} color={color} />
            <Text>{readable_date}</Text>
        </Pressable>
    );
};

export default WorkoutPreview;

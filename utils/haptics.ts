import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

export const triggerHaptic = (type: string) => { 
    switch (type) {
        case 'success':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
        case 'light':
            if (Platform.OS === 'android') {
                Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Clock_Tick);
            } else {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            break;
        case 'tap':
            if (Platform.OS === 'android') {
                Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
            } else {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            break;
        case 'wolf':
            Vibration.vibrate([0, 15, 40, 25, 60, 40, 90], false);
            break;
    }
};
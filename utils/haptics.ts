import { Platform, Vibration } from "react-native";
import * as Haptics from "expo-haptics";

/**
 * Triggers a haptic feedback based on the specified type.
 *
 * @param type - The type of haptic feedback to trigger. Can be one of:
 *   - "success": Triggers a success notification feedback.
 *   - "error": Triggers an error notification feedback.
 *   - "light": Triggers a light impact feedback, or a clock tick on Android.
 *   - "tap": Triggers a medium impact feedback, or a confirm vibration on Android.
 *   - "wolf": Triggers a custom vibration pattern.
 */

export const triggerHaptic = (type: string) => {
    switch (type) {
        case "success":
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
        case "error":
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
        case "light":
            if (Platform.OS === "android") {
                Haptics.performAndroidHapticsAsync(
                    Haptics.AndroidHaptics.Clock_Tick
                );
            } else {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            break;
        case "tap":
            if (Platform.OS === "android") {
                Haptics.performAndroidHapticsAsync(
                    Haptics.AndroidHaptics.Confirm
                );
            } else {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            break;
        case "wolf":
            Vibration.vibrate([0, 15, 40, 25, 60, 40, 90], false);
            break;
    }
};

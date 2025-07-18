import { Keyboard, TouchableWithoutFeedback } from 'react-native';

/**
 * A component that wraps its children with a TouchableWithoutFeedback, which
 * dismisses the keyboard on press. The accessible prop is set to false to
 * prevent TalkBack from reading the TouchableWithoutFeedback as a separate
 * element.
 */
const DismissKeyboardWrapper = ({ children }: { children: React.ReactNode }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {children}
    </TouchableWithoutFeedback>
);

export default DismissKeyboardWrapper;
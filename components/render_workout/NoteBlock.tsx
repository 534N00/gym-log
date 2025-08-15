import { Text, TextInput } from "react-native";

interface NoteBlockProps {
    value: string;
    setter?: Function;
    editable?: boolean;
}

/**
 * A component to render a note block with a header and a text input
 * The text input is multi-line and can have up to 6 lines of text
 * The component is editable by default, but can be set to not be editable
 * when the editable prop is set to false
 * @prop {string} value The value of the text input
 * @prop {Function} [setter] A function that will be called when the user
 * changes the text input
 * @prop {boolean} [editable=true] Whether or not the text input is editable
 * @returns {JSX.Element} NoteBlock component
 */
const NoteBlock: React.FC<NoteBlockProps> = ({
    value,
    setter,
    editable = true,
}) => {
    return (
        <>
            <Text className="-mb-4 ml-3 z-10 w-[75px] h-[35px] rounded-xl bg-white shaddow text-center align-middle self-start">
                Notes
            </Text>
            <TextInput // Notes
                className="w-[370px] h-36 p-4 m-2 rounded-xl bg-gray-200 shadow"
                placeholder="Add notes here..."
                multiline={true}
                numberOfLines={6}
                editable={editable}
                value={value}
                onChangeText={(note: string) => setter && setter(note)}
                textAlignVertical="top"
                scrollEnabled={true}
                placeholderTextColor="grey"
            />
        </>
    );
};

export default NoteBlock;

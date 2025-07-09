import { Text, TextInput } from 'react-native';

interface NoteBlockProps {
    value: string;
    setter?: Function;
    editable?: boolean;
};

const NoteBlock: React.FC<NoteBlockProps> = ({ value, setter, editable=true }) => {
    return (
        <>
            <Text className="-mb-4 ml-3 z-10 w-[75px] h-[35px] rounded-xl bg-white shaddow text-center align-middle self-start">Notes</Text>
            <TextInput // Notes
                className="w-[370px] h-36 p-4 m-2 rounded-xl bg-gray-200 shadow"
                placeholder="Add notes here..."
                multiline={true}
                numberOfLines={6}
                editable={editable}
                value={value}
                onChangeText={(note: string) => setter && setter(note)}
                textAlignVertical='top'
                scrollEnabled={true}
            />
        </>
    );
};

export default NoteBlock;
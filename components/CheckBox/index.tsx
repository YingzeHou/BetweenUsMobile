import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface CheckBoxProps {
    isChecked: boolean,
    onPress: ()=>void,
}

export default function CheckBox(props: CheckBoxProps) {
    const name = props.isChecked? "checkbox-marked-outline": "checkbox-blank-outline";
    return(
        <View>
            <Pressable onPress={props.onPress}>
                <MaterialCommunityIcons name={name} size={24} color="black"/>
            </Pressable>
        </View>
    )
}
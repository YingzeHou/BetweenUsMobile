import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

interface AccountProps {
    iconName: string
    entryType: string
}

export default function AccountEntry(props: AccountProps) {
    return(
        <TouchableOpacity>
            <View style={styles.container}>
                <Ionicons style={{marginRight:5}} name={props.iconName} size={25}></Ionicons>
                <Text style={styles.typeText}>{props.entryType}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems: 'center',
        backgroundColor:"#EDEDED",
        width:'100%',
        padding:20,
        marginVertical:2
    },
    typeText: {
        fontSize:16
    }
})
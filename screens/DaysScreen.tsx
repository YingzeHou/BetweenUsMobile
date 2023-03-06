import { Text, View, StyleSheet } from "react-native";

export default function DaysScreen () {
    return (
        <View style={styles.container}>
            <Text>Days Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        height:'100%',
        width:"100%"
    }
})
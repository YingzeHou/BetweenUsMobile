import { Text, View, StyleSheet } from "react-native";

export default function BudgetScreen () {
    return (
        <View style = {styles.container}>
            <Text>Budget Screen</Text>
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
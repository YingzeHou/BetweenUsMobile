import { View, Text, StyleSheet} from "react-native";
import DayCard from "../components/DayCard";

export default function DayDetailScreen({route, navigation}: any) {

    const {day} = route.params;
    return (
        <View style={styles.container}>
            <View style={styles.containerBox}>
                <DayCard day = {day}/>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        height:'100%',
        width:'100%',
        backgroundColor:'white'
    },
    containerBox: {
        top:'20%'
    },
    titleBox:{
        width:'100%',
        flexDirection:'row',
        flex:0.3,
        justifyContent:'center'
    },
})
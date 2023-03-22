import { useState } from "react";
import { View, Text, StyleSheet, Pressable} from "react-native";
import DayCard from "../components/DayCard";
import DayModal from "../components/DayModal";
import Colors from "../constants/Colors";

export default function DayDetailScreen({route, navigation}: any) {

    const {day} = route.params;
    const [modalVisible, setModalVisible] = useState(false);

    const triggerModal = () => {
        return <DayModal mode='edit' day = {day} visible = {true}/>
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerBox}>
                <DayCard day = {day}/>
                {/* <DayModal mode='edit' day = {day} visible = {true}/> */}
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={({pressed}) => [styles.buttonEdit, {backgroundColor:pressed? 'gray': Colors.borderColor}]}
                        onPress={() => triggerModal()}
                    >
                        <Text style={{color:'white'}}>Edit</Text>
                    </Pressable>

                    <Pressable
                        style={({pressed}) => [styles.buttonDelete, {backgroundColor:pressed? 'gray': Colors.alertColor}]}
                        onPress={() => alert("Edit")}
                    >
                        <Text style={{color:'white'}}>Delete</Text>
                    </Pressable>
                </View> 
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
    buttonContainer: {
        width:'80%',
        alignSelf:'center',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
    },
    buttonEdit: {
        marginTop:20,
        backgroundColor: Colors.borderColor,
        opacity:0.8,
        width:'25%',
        alignItems:'center',
        paddingVertical:10,
        borderRadius: 20,
    },
    buttonDelete: {
        marginTop:20,
        backgroundColor: Colors.alertColor,
        opacity:0.8,
        width:'25%',
        alignItems:'center',
        paddingVertical:10,
        borderRadius: 20,
    }
})
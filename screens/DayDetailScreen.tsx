import { useCallback, useState } from "react";
import { View, Text, StyleSheet, Pressable, TouchableOpacity} from "react-native";
import DayCard from "../components/DayCard";
import DayModal from "../components/DayModal";
import Colors from "../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { deleteDay } from "../redux/dayListSlice";
import { db } from "../firebase";
import { Modal } from "react-native-paper";
import { DeleteModal } from "../components/DeleteModal";

export default function DayDetailScreen({route, navigation}: any) {

    const {day, index} = route.params;
    const [modalVisible, setModalVisible] = useState(false);

    const dayRef = db.collection("days");
    const dispatch = useDispatch<AppDispatch>();

    const[deleteModalVisible, setDeleteModalVisible] = useState(false);

    const triggerModal = useCallback((visible: boolean) => {
         setModalVisible(visible)
    }, [])

    const triggerDelModal = useCallback((visible: boolean) => {
        setDeleteModalVisible(visible)
    }, [])

    const deleteD = () => {
        dispatch(deleteDay({
            atIndex: index
        }))

        dayRef.doc(day.id).delete()
        .then(()=>{})
        .catch((error) => alert(error));
        
        navigation.navigate('Days', null);
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerBox}>
                <DayCard day = {day}/>
                {modalVisible && <DayModal mode='edit' day = {day} index = {index} triggerModal = {triggerModal} navigation={navigation}/>}
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={({pressed}) => [styles.buttonEdit, {backgroundColor:pressed? 'gray': Colors.borderColor}]}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={{color:'white'}}>Edit</Text>
                    </Pressable>

                    <Pressable
                        style={({pressed}) => [styles.buttonDelete, {backgroundColor:pressed? 'gray': Colors.alertColor}]}
                        onPress={() => setDeleteModalVisible(true)}
                    >
                        <Text style={{color:'white'}}>Delete</Text>
                    </Pressable>
                </View> 
            </View>
            {deleteModalVisible && <DeleteModal setVisibleCallback={triggerDelModal} operation={deleteD} page="day" other={null}/>}
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
    modalContainer:{
        height:'60%',
        justifyContent:'center',
        alignItems:'center',
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
        alignItems:'center',
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
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height:'100%',
        backgroundColor:'blue'
        // marginTop: 22,
    },
    modalView: {
        // margin: 20,
        height:'100%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        top:'70%',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize:18
    },

})
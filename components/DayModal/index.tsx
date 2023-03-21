import {View, Text, StyleSheet, Animated, TouchableOpacity, Modal, Pressable, TextInput, Keyboard, Switch} from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {db} from "../../firebase"
import { AppDispatch, RootState } from '../../store';
import { createDay } from '../../redux/dayListSlice';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Picker} from '@react-native-picker/picker';
import Colors from '../../constants/Colors';

export default function DayModal() {

    const dropDownItems = [
        {label:'Love', value:'love'},
        {label:'Date', value:'date'},
        {label:'Travel', value:'travel'},
        {label:'Home', value:'home'},
        {label:'Life', value:'life'},
        {label:'Other', value:'other'}
    ]
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.user);
    const dayRef = db.collection("days");
    const [modalVisible, setModalVisible] = useState(false);
    const [event, setEvent] = useState("");

    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [address, setAddress] = useState("");

    const [dropDownPickerVisible, setDropDownPickerVisible] = useState(false);
    const [category, setCategory] = useState("");
    const [pinned, setPinned] = useState(0);

    const handleDateConfirm = (date:Date) => {
        const offset = date.getTimezoneOffset(); 
        date = new Date(date.getTime() - (offset*60*1000));
        setDatePickerVisible(false);
        setStartDate(date.toISOString().split('T')[0]);
    };

    const handleDateCancel = () => {
        setDatePickerVisible(false);
    }

    const toggleSwitch = () => {
        setPinned(Math.abs(1-pinned));
    }

    const setDropDownValue = (itemValue: string, itemIndex: number) => {
        setCategory(dropDownItems[itemIndex]['label']);
        setDropDownPickerVisible(false);
    }

    // const create = () => {
    //     dispatch(createDay({
    //         title: collectionName,
    //         desc: description,
    //         users: [userState.user.userId, userState.user.pairUser.userId]
    //     }));

    //     dayRef.add({
    //         title: collectionName,
    //         desc: description,
    //         users: [userState.user.userId, userState.user.pairUser.userId]
    //     })

    //     setModalVisible(false)
    // }
    return (
        <View>
            <TouchableOpacity
                style = {{position:'absolute', top:-20, right:5, zIndex:2}}
                onPress={() => setModalVisible(true)}  
            >
                <Text style = {{fontSize:30, color:"white"}}>+</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                // transparent={true}
                presentationStyle='formSheet'
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>

                <TouchableOpacity 
                    style={styles.container} 
                    activeOpacity={1} 
                >

                <DateTimePickerModal
                    isVisible={datePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={handleDateCancel}
                />

                {dropDownPickerVisible && (
                    <Picker
                        selectedValue={category}
                        onValueChange={(itemValue, itemIndex) =>
                            setDropDownValue(itemValue,itemIndex)
                        }
                        style={{
                            position:'absolute',
                            bottom:'0%',
                            width:'100%',
                            height:'25%',
                            zIndex:2,
                            backgroundColor:'rgba(0,0,0,0.9)',
                            borderRadius:20
                        }}
                        itemStyle={{
                            color:'white'
                        }}>
                        {dropDownItems.map((data, i) => (
                            <Picker.Item label={data.label} value={data.value} key={i}/>
                        ))}
                    </Picker>
                )}
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Create Your Day</Text>
                    <TextInput
                        placeholder="Day Event Name"
                        placeholderTextColor="gray"
                        value={event}
                        onChangeText = {setEvent}
                        style={styles.textInput}
                    />

                    <TouchableOpacity onPress={()=>{setDatePickerVisible(true), Keyboard.dismiss()}} style={styles.textInput}>
                        <Text style={styles.textStyle}>Start Date:  <Text style={styles.textInput}>{startDate}</Text></Text>
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Address"
                        placeholderTextColor="gray"
                        value={address}
                        onChangeText = {setAddress}
                        style={styles.textInput}
                    />

                    <TouchableOpacity onPress={()=>{setDropDownPickerVisible(true), Keyboard.dismiss()}} style={styles.textInput}>
                        <Text style={styles.textStyle}>Category:  <Text style={styles.textInput}>{category}</Text></Text>
                    </TouchableOpacity>
                    <View style={styles.toggleContainer}>
                        <Text style={styles.textStyle}>Set As Pinned Event?</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#47805e" }}
                            thumbColor="#f4f3f4"
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={pinned==1}
                            style={styles.toggle}
                        />
                    </View>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => alert("Create!")}
                    >
                    <Text style={styles.textStyle}>Create!</Text>
                    </Pressable>
                </View>
                </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
        flex:1,
        justifyContent:'flex-start',
        alignItems:'center'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },

    buttonClose: {
        marginTop:100,
        backgroundColor: '#F8EEEC',
    },
    textStyle: {
      color: 'black',
      fontWeight:'normal',
      textAlign: 'center',
      fontSize:20
    },
    modalText: {
      marginBottom: 40,
      textAlign: 'center',
      fontSize:25,
      fontWeight:'bold',
      color: Colors.borderColor,
      borderWidth:2,
      borderRadius:5,
      padding:10
    },
    textInput: {
        width:'80%',
        fontSize:20,
        marginVertical: 20,
        borderColor:'gray',
        borderRadius:5,
        borderBottomWidth:2,
        padding:10
    },
    toggleContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginBottom:50,
        marginTop:20
    }, 
    toggle:{
        marginLeft:20
    },
  });
  
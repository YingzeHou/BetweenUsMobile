import {View, Text, StyleSheet, Animated, TouchableOpacity, Modal, Pressable, TextInput, Keyboard, Switch} from 'react-native';
import { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {db} from "../../firebase"
import { AppDispatch, RootState } from '../../store';
import { createDay, fetchDays, updateDay } from '../../redux/dayListSlice';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Picker} from '@react-native-picker/picker';
import Colors from '../../constants/Colors';

interface dayModalProps {
    mode: string,
    day: {
        id: string
        event: string,
        startDate: string,
        category: string,
        address: string,
        pinned: number
    },
    index: number,
    triggerModal: Function,
    navigation: any
}
export default function DayModal({mode, day, index, triggerModal, navigation}:dayModalProps) {

    const dropDownItems = [
        {label:'Love', value:'Love'},
        {label:'Date', value:'Date'},
        {label:'Travel', value:'Travel'},
        {label:'Home', value:'Home'},
        {label:'Life', value:'Life'},
        {label:'Other', value:'Other'}
    ]
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.user);
    const dayState = useSelector((state: RootState) => state.dayList);
    const dayRef = db.collection("days");
    const [modalVisible, setModalVisible] = useState(false);
    const [event, setEvent] = useState("");

    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [address, setAddress] = useState("");

    const [dropDownPickerVisible, setDropDownPickerVisible] = useState(false);
    const [category, setCategory] = useState("");
    const [pinned, setPinned] = useState(0);

    useEffect(() => {
        if(mode == 'edit') {
            setEvent(day.event);
            setStartDate(day.startDate);
            setAddress(day.address);
            setCategory(day.category);
            setPinned(day.pinned);
            setModalVisible(true)
        }
    },[])
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

    const checkPin = () => {
        const pinDay = dayState.days[0]!=null? dayState.days[0].pinned==1? dayState.days[0]: null: null;
        if(pinDay!=null && pinned == 1) {
            const pinDayId = pinDay.id;
            dayRef.doc(pinDayId).update({
                pinned: 0
            })
            .then(()=> {
                dispatch(updateDay({
                    atIndex: 0,
                    event: pinDay.event,
                    startDate: pinDay.startDate,
                    category: pinDay.category,
                    address: pinDay.address,
                    pinned: 0,
                    users: [userState.user.userId, userState.user.pairUser.userId]
                }))
            })
        }
    }
    const create = () => {
        checkPin();
        dayRef.add({
            event: event,
            startDate: startDate,
            category: category,
            address: address,
            pinned: pinned,
            users: [userState.user.userId, userState.user.pairUser.userId]
        })
        .then((docRef) => {
            dispatch(createDay({
                id: docRef.id,
                event: event,
                startDate: startDate,
                category: category,
                address: address,
                pinned: pinned,
                users: [userState.user.userId, userState.user.pairUser.userId]
            }));
        })

        setModalVisible(false)
    }

    const update = () => {
        checkPin();
        const data = {
            event: event,
            startDate: startDate,
            category: category,
            address: address,
            pinned: pinned,
            // users: [userState.user.userId, userState.user.pairUser.userId]
        }

        dayRef.doc(day.id)
        .update(data)
        .then(() => {
            dispatch(fetchDays())
            .then(() => {
                setModalVisible(false)
                triggerModal(false)
                navigation.navigate("Days", null);
            })
        })
    }
    return (
        <View>

            {mode == "create"? 
            (
                <TouchableOpacity
                    style = {{position:'absolute', top:-20, right:5, zIndex:2}}
                    onPress={() => setModalVisible(true)}  
                >
                    <Text style = {{fontSize:30, color:"white"}}>+</Text>
                </TouchableOpacity>
            ):
            (
                <></>
            )}

            <Modal
                animationType="slide"
                // transparent={true}
                presentationStyle='formSheet'
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                    triggerModal(false)
                }}>

                <TouchableOpacity 
                    style={styles.container} 
                    activeOpacity={1} 
                >
                <View style={styles.innerContainer}>

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
                            height:'30%',
                            zIndex:2,
                            backgroundColor:Colors.borderColor,
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
                    {mode == 'create'?
                    (
                        <Text style={styles.modalText}>Create Your Day</Text>
                    ):
                    (
                        <Text style={styles.modalText}>Edit Your Day</Text>
                    )}
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
                    {mode == 'create'?
                    (
                        <Pressable
                            style={({pressed}) => [styles.button, {backgroundColor:pressed? 'gray': Colors.borderColor}]}
                            onPress={() => create()}
                        >
                        <Text style={styles.buttonTextStyle}>Create!</Text>
                        </Pressable>
                    ):
                    (
                        <Pressable
                            style={({pressed}) => [styles.button, {backgroundColor:pressed? 'gray': Colors.borderColor}]}
                            // style={[styles.button, styles.buttonClose]}
                            onPress={() => update()}
                        >
                        <Text style={styles.buttonTextStyle}>Update!</Text>
                        </Pressable>
                    )}
                </View>
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
        backgroundColor:Colors.borderColor
    },
    innerContainer:{
        marginTop:10,
        borderRadius:15,
        flex:1,
        width:'90%',
        alignSelf:'center',
        backgroundColor:'white'
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
        backgroundColor: Colors.borderColor,
    },
    textStyle: {
        color: Colors.borderColor,
        fontWeight:'normal',
        textAlign: 'center',
        fontSize:20
    },
    buttonTextStyle: {
        color:'white',
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
  
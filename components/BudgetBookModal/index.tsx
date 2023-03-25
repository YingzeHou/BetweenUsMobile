import { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet, TextInput, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import { db } from "../../firebase";
import { createBudgetBook, updateBudgetBook } from "../../redux/budgetbookListSlice";
import { AppDispatch, RootState } from "../../store";

interface BudgetBookModalProps {
    mode: string,
    book: {
        id: string,
        name: string,
        date: string,
        progress: number
    },
    index: number,
    triggerModal: Function,
    navigation: any,
}

export default function BudgetBookModal ({mode, book, index, triggerModal, navigation}: BudgetBookModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.user);

    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("")

    const bbookRef = db.collection("budgetbooks");

    useEffect(()=>{
        if(mode == 'edit') {
            setName(book.name);
            setModalVisible(true)
        }
    },[])

    const getCurrDate = () => {
        var currDate = new Date();
        const offset = currDate.getTimezoneOffset(); 
        currDate = new Date(currDate.getTime() - (offset*60*1000));
        const currDateStr = currDate.toISOString().split('T')[0];
        return currDateStr;
    }
    const create = () => {
        const currDateStr = getCurrDate();

        bbookRef.add({
            name: name,
            date: currDateStr,
            progress: 0,
            users: [userState.user.userId, userState.user.pairUser.userId]
        })
        .then((docRef) => {
            dispatch(createBudgetBook({
                id: docRef.id,
                name: name,
                date: currDateStr,
                progress: 0,
                users: [userState.user.userId, userState.user.pairUser.userId]
            }))
        })

        setModalVisible(false);
        setName("");
    }
    
    const update = () => {
        const currDateStr = getCurrDate();
        const data = {
            name: name,
            date: currDateStr,
            progress: book.progress
        }

        bbookRef.doc(book.id)
        .update(data)
        .then(()=>{
            dispatch(updateBudgetBook({
                atIndex: index,
                name: name,
                date: currDateStr,
                progress: book.progress,
                users: [userState.user.userId, userState.user.pairUser.userId]
            }))
        })
        .catch((error) => alert(error));

        setModalVisible(false)
        triggerModal(false)
    }
    return (
        <View>
            {mode == 'create'? 
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
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>

                <TouchableOpacity 
                    style={styles.container} 
                    activeOpacity={1} 
                    onPressOut={mode=='create'? () => {setModalVisible(false)}: () => {triggerModal(false)}}
                >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {/* <Text style={styles.modalText}>Create Account Book</Text> */}
                    <Text style={styles.modalText}>{mode=='create'? "Create Account Book": "Edit Account Book"}</Text>
                    <TextInput
                        placeholder="Collection Name"
                        placeholderTextColor="gray"
                        value={name}
                        onChangeText = {setName}
                        style={styles.textInput}
                    />
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
                            onPress={() => update()}
                        >
                        <Text style={styles.buttonTextStyle}>Update!</Text>
                        </Pressable>
                    )}
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
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: Colors.borderColor,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },
    button: {
        marginVertical:10,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonTextStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize:18
    },
    textInput: {
        width:'50%',
        fontSize:15,
        marginVertical: 10,
        borderColor:'gray',
        borderRadius:5,
        borderWidth:2,
        padding:5
    },
  });
  
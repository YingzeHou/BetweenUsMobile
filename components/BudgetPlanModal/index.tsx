import { useEffect, useRef, useState } from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet, TextInput, Pressable, FlatList, Animated, Easing, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import { db } from "../../firebase";
import { createBudgetBook, updateBudgetBook } from "../../redux/budgetbookListSlice";
import { AppDispatch, RootState } from "../../store";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import PlanComposition from "../PlanComposition";
import { createPlan } from "../../redux/planListSlice";

interface BudgetPlanModalProps {
    mode: string,
    // book: {
    //     id: string,
    //     name: string,
    //     date: string,
    //     progress: number
    // },
    // index: number,
    triggerModal: Function,
    parentId: string
    // navigation: any,
}

export default function BudgetPlanModal ({mode, triggerModal, parentId}: BudgetPlanModalProps) {
    const [expectExpanded, setExpectExpanded] = useState(false);
    const [actualExpanded, setActualExpanded] = useState(false);
    const animationExpHeight = useRef(new Animated.Value(0)).current;
    const animMargin = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const animMarginAct = useRef(new Animated.Value(0)).current;
    const fadeAnimAct = useRef(new Animated.Value(0)).current;
    const animationActHeight = useRef(new Animated.Value(0)).current;

    const switchActual = () => {
        if(actualExpanded) {
            Animated.timing(animMarginAct, {
                duration: 200,
                toValue: -18,
                easing: Easing.linear,
                useNativeDriver: false
            }).start(({ finished }) => {
            // completion callback
                setActualExpanded(false);
            });
            Animated.timing(fadeAnimAct, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
        else {
            setActualExpanded(true);
        }
    }
    useEffect(()=>{
        if(actualExpanded) {
            Animated.timing(animationActHeight, {
                duration: 200,
                toValue: 100,
                easing: Easing.linear,
                useNativeDriver: false
            }).start();
            Animated.timing(fadeAnimAct, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }).start();
            Animated.timing(animMarginAct, {
                duration: 200,
                toValue: 10,
                easing: Easing.linear,
                useNativeDriver: false
            }).start();
        }
        else {
            Animated.timing(animationActHeight, {
                duration: 200,
                toValue: 0,
                easing: Easing.linear,
                useNativeDriver: false
            }).start();
        }
    }, [actualExpanded])

    const switchExpect = () => {
        if(expectExpanded) {
            Animated.timing(animMargin, {
                duration: 200,
                toValue: -18,
                easing: Easing.linear,
                useNativeDriver: false
            }).start(({ finished }) => {
            // completion callback
                setExpectExpanded(false);
            });
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
        else {
            setExpectExpanded(true);
        }
    }
    useEffect(()=>{
        if(expectExpanded) {
            Animated.timing(animationExpHeight, {
                duration: 200,
                toValue: 100,
                easing: Easing.linear,
                useNativeDriver: false
            }).start();
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }).start();
            Animated.timing(animMargin, {
                duration: 200,
                toValue: 10,
                easing: Easing.linear,
                useNativeDriver: false
            }).start();
        }
        else {
            Animated.timing(animationExpHeight, {
                duration: 200,
                toValue: 0,
                easing: Easing.linear,
                useNativeDriver: false
            }).start();
        }
    }, [expectExpanded])

    // const expandExpected = () => {
    //     if(expanded) {
    //         Animated.timing(fadeAnim, {
    //             toValue: 0,
    //             duration:300,
    //             useNativeDriver: true,
    //         }).start(({ finished }) => {
    //             setExpanded(false)
    //            });;
    //     }
    //     else {
    //         Animated.timing(fadeAnim, {
    //             toValue: 1,
    //             duration: 300,
    //             useNativeDriver: true,
    //         }).start();
    //         setExpanded(true)
    //     }
    // }

    interface HeaderProps {
        mode: string
    }
    const Header = ({mode}: HeaderProps) => {
        return (
            <View style={styles.headerBox}>
                <TouchableOpacity style={styles.headerContainer} onPress={mode=='expect'? ()=>switchExpect(): ()=>switchActual()}>
                    {(mode == 'expect' && expectExpanded) || ((mode == 'actual' && actualExpanded)) ?(
                        <MaterialCommunityIcons name="arrow-up-drop-circle" size={20} color='white'/>
                    ):
                    (
                        <MaterialCommunityIcons name="arrow-down-drop-circle" size={20} color='white'/>
                    )}
                    <Text style={styles.headerText}>{mode=='expect'? "Expected Amount: ": "Actual Amount:"} </Text>
                </TouchableOpacity>
                {(mode == 'expect' && expectExpanded) ? (
                <TouchableOpacity onPress={()=>createComp()}>
                    <Animated.View style={{marginLeft: animMargin, opacity: fadeAnim}}>
                        <MaterialIcons style={styles.icon} name="add-circle-outline" size={25}></MaterialIcons>
                    </Animated.View>
                </TouchableOpacity>
                ):
                (
                    <></>
                )}

                {/* {(mode == 'actual' && actualExpanded) ? (
                <TouchableOpacity onPress={()=>createComp('actual')}>
                    <Animated.View style={{marginLeft: animMarginAct, opacity: fadeAnimAct}}>
                        <MaterialIcons style={styles.icon} name="add-circle-outline" size={25}></MaterialIcons>
                    </Animated.View>
                </TouchableOpacity>
                ):
                (
                    <></>
                )} */}
            </View>
        )
    }
   
    interface Composition {
        type: string,
        category: string,
        amount: number,
    }
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.user);

    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("")
    const [expComps, setExpComps] = useState<Composition[]>([]);
    const [actComps, setActComps] = useState<Composition[]>([]);
    const [current, setCurrent] = useState("")

    const planRef = db.collection("budgetplans");

    const createComp = () => {
        setExpComps([...expComps, {
            type: "expect",
            category: "",
            amount:0
        }])
        setActComps([...actComps, {
            type: "actual",
            category: "",
            amount:0
        }])
    }

    const updateComp = (index: number, category: string, amount: number) => {
        const copy = [...expComps];
        copy[index].category = category;
        copy[index].amount = amount;
        setExpComps(copy);
        const copy2 = [...actComps];
        copy2[index].category = category;
        setActComps(copy2);
    }

    const updateActComp = (index: number, amount: number) => {
        const copy = [...actComps];
        copy[index].amount = amount;
        setActComps(copy);
    }

    const deleteComp = (index: number) => {
        const copy = [...expComps];
        copy.splice(index, 1);
        setExpComps(copy);
        const copy2 = [...actComps];
        copy2.splice(index, 1);
        setActComps(copy2);
    }

    const createP = () => {
        planRef.add({
            parentId: parentId,
            name: name,
            expComps: expComps,
            actComps: actComps,
            users: [userState.user.userId, userState.user.pairUser.userId]
        })
        .then((docRef)=>{
            dispatch(createPlan({
                id: docRef.id,
                parentId: parentId,
                name: name,
                expComps: expComps,
                actComps: actComps,
                users: [userState.user.userId, userState.user.pairUser.userId]
            }))
        })

        setModalVisible(false)
        setName("")
        setExpComps([])
        setActComps([])
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
                <ScrollView style={{flex:1, height:'90%'}}>
                <View
                    style={styles.innerContainer}>

                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                {/* <Text style={{color:'black'}}>{parentId}</Text> */}
                    {mode == 'create'?
                    (
                        <Text style={styles.modalText}>Create Your Plan</Text>
                    ):
                    (
                        <Text style={styles.modalText}>Edit Your Plan</Text>
                    )}
                    <TextInput
                        placeholder="Name of Your Plan"
                        placeholderTextColor="gray"
                        value={name}
                        onChangeText = {setName}
                        style={styles.textInput}
                    />
                    
                    {/* <View> */}
                    <Header mode="expect"/>
                    {/* {expanded? ( */}
                    <KeyboardAvoidingView 
                            behavior={Platform.OS === "ios" ? "padding" : "height"} 
                            keyboardVerticalOffset={Platform.OS === "ios"? 100: 0}>
                    <Animated.View
                        style={{height: animationExpHeight, width:'100%'}}
                    >
                        <ScrollView
                            style={styles.scroll}
                            showsVerticalScrollIndicator={false}
                        >
                            <TouchableOpacity>
                                {expComps.map((item, i) => 
                                (
                                    <PlanComposition key={i} composition={item} onUpdate={(category: string, amount: number)=>updateComp(i, category, amount)} onDelete={()=>deleteComp(i)} mode="expect"/>
                                    // <Text key={i} style={{fontSize:20}}>{item.category}: {item.amount}</Text>
                                ))}
                            </TouchableOpacity>
                        </ScrollView>
                    </Animated.View>
                    </KeyboardAvoidingView>

                    <Header mode="actual"/>
                    {/* {expanded? ( */}
                    <KeyboardAvoidingView 
                            behavior={Platform.OS === "ios" ? "padding" : "height"} 
                            keyboardVerticalOffset={Platform.OS === "ios"? 150: 0}>
                    <Animated.View
                        style={{height: animationActHeight, width:'100%'}}
                    >
                        <ScrollView
                            style={styles.scroll}
                            showsVerticalScrollIndicator={false}
                        >
                            <TouchableOpacity>
                                {actComps.map((item, i) => 
                                (
                                    <PlanComposition key={i} composition={item} onUpdate={(category: string, amount: number)=>updateActComp(i, amount)} onDelete={()=>deleteComp(i)} mode="actual"/>
                                ))}
                            </TouchableOpacity>
                        </ScrollView>
                    </Animated.View>
                    </KeyboardAvoidingView>

                    {mode == 'create'?
                    (
                        <TouchableOpacity onPress={()=>createP()} style={styles.button}>
                            <Text style={styles.buttonTextStyle}>Create</Text>
                        </TouchableOpacity>
                    ):
                    (
                        <TouchableOpacity onPress={()=>alert("Update")} style={styles.button}>
                            <Text style={styles.buttonTextStyle}>Update</Text>
                        </TouchableOpacity>
                    )}
                </View>
                </View>
                </View>
                </ScrollView>
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
    expandList:{
        borderRadius:10,
        backgroundColor: Colors.borderColorLight,
    },
    headerContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: Colors.borderColorLight,
        padding:10,
        borderRadius:10,
        marginTop:50
    },
    headerText:{
        marginHorizontal:10,
        color:'white',
        fontSize:15
    },
    headerBox: {
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
    },
    icon: {
        marginTop:50
    },
    innerContainer:{
        marginTop:10,
        borderRadius:15,
        flex:1,
        width:'90%',
        alignSelf:'center',
        backgroundColor:'white'
    },
    scroll:{
        width:'100%',
        paddingHorizontal:50,
        marginTop:10,
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
        backgroundColor: Colors.borderColor,
        marginTop:'30%',
        marginBottom:'30%'
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
  
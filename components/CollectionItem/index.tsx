import {View, Text, StyleSheet, Animated, TouchableOpacity, Modal, TextInput, Pressable} from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {Swipeable, GestureHandlerRootView} from "react-native-gesture-handler"
import { useEffect, useState } from "react";
import {db, auth} from "../../firebase"
import { AppDispatch, RootState } from '../../store';
import {useDispatch, useSelector} from 'react-redux';
import { updateCollection, deleteCollection } from "../../redux/collectionListSlice";
import { casDeleteTodos } from '../../redux/todoListSlice';

interface CollectionItemProps {
    collection: {
        id: string,
        title: string,
        desc: string
    }
    navigation: any,
    index: number,
    closeRow: (index: number, mode: string)=>void,
    setRow: (index: number, ref: any) =>void,
}

export default function CollectionItem({collection, navigation, index, closeRow, setRow}: CollectionItemProps) {
    const renderRightActions = (progress: any, dragX: any) => {
        const scale = dragX.interpolate({
            inputRange:[-100,0],
            outputRange: [1,0],
            extrapolate:'clamp'
        })
        return (
            
          <View
            style={{
                flexDirection:'row',
                alignItems:'center',
                alignContent: 'center',
                justifyContent: 'center',
                width: 100,
            }}>
            <TouchableOpacity onPress={()=>setEditModalVisible(!editModalVisible)}>
                <Animated.Text style={[{fontSize:15, color:'black', marginRight:15}, {transform:[{scale}]}]}>Edit</Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setDeleteModalVisible(!deleteModalVisible)}>
                <Animated.Text style={[{fontSize:15, color:'red', marginRight:15}, {transform:[{scale}]}]}>Delete</Animated.Text>
            </TouchableOpacity>
          </View>
        );
    };

    const [editModalVisible, setEditModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [collectionName, setCollectionName] = useState(collection.title)
    const [description, setDescription] = useState(collection.desc)

    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.user);

    const collectionRef = db.collection('collections');

    const update = () => {
        const data = {
            title: collectionName,
            desc: description,
        }

        dispatch(updateCollection({
            atIndex: index,
            title: collectionName,
            desc: description,
            users: [userState.user.userId, userState.user.pairUser.userId]
        }))

        collectionRef.doc(collection.id)
        .update(data)
        .then(()=>{
            
        })
        .catch((error) => alert(error));

        setEditModalVisible(false)
        closeRow(index, "absolute")
    }

    const deleteCol = () => {
        dispatch(deleteCollection({
            atIndex: index
        }))

        collectionRef.doc(collection.id).delete()
        .then(() => {
            dispatch(casDeleteTodos(collection.id))
        })
        .catch((error) => alert(error));

    }
    return(
        <GestureHandlerRootView>
            <Swipeable
                friction={1}
                renderRightActions={(progress, dragX) =>
                    renderRightActions(progress, dragX)
                }
                onSwipeableOpen={() => closeRow(index, "relative")}
                ref={(ref) => setRow(index, ref)}
            >
                <TouchableOpacity onPress={()=> navigation.navigate('Note', {
                    parentId: collection.id,
                })}
                >
                    <View style={styles.container}>
                        <View style={styles.root}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="list-status" size={24} color="white" />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{collection.title}</Text>
                                <Text style={styles.desc}>{collection.desc}</Text>
                            </View>
                        </View>
                        <View style={{
                            backgroundColor: '#A2A2A2',
                            height: 1,
                            width: '95%'}}
                        />
                    </View>
                </TouchableOpacity>
            </Swipeable>

            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => {
                setEditModalVisible(!editModalVisible);
                }}>
                
                <TouchableOpacity 
                    style={styles.container} 
                    activeOpacity={1} 
                    onPressOut={() => {setEditModalVisible(false), closeRow(index, "absolute")}}
                >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Update Collection</Text>
                    <TextInput
                        placeholder="Collection Name"
                        placeholderTextColor="gray"
                        value={collectionName}
                        onChangeText = {setCollectionName}
                        style={styles.textInput}
                    />
                    <TextInput
                        placeholder="Description"
                        placeholderTextColor="gray"
                        value={description}
                        onChangeText = {setDescription}
                        style={styles.textInput}
                    />
                    <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => update()}>
                    <Text style={styles.textStyle}>Update!</Text>
                    </Pressable>
                </View>
                </View>
                </TouchableOpacity>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => {
                setDeleteModalVisible(!deleteModalVisible);
                }}
            >
                
                <TouchableOpacity 
                    style={styles.container} 
                    activeOpacity={1} 
                    onPressOut={() => {setDeleteModalVisible(false), closeRow(index, "absolute")}}
                >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Deletion of collection will delete all todos within</Text>
                    <Text style={styles.modalText}>Are you sure to delete?</Text>
                    <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => deleteCol()}>
                        <Text style={styles.textStyle}>Delete</Text>
                    </Pressable>
                </View>
                </View>
                </TouchableOpacity>
            </Modal>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    root:{
        flexDirection:'row',
        width:'100%',
        padding: 20,
    },
    iconContainer:{
        width:40,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#404040',
        marginRight:10
    },
    textContainer: {
        justifyContent:'flex-start',
        alignItems:'flex-start'
    },
    title:{
        fontSize:20,
        marginRight:10
    },
    desc: {
        color:'grey'
    },
    rightAction:{
        backgroundColor:'red',
        justifyContent:'center',
        flex:1,
        alignItems:'flex-end',
        borderRadius:20
    },
    leftAction:{
        backgroundColor:'gray',
        justifyContent:'center',
        flex:1,
        alignItems:'flex-start',
        borderRadius:20
    },
    actionText:{
        fontSize:10,
        // paddingRight:25,
        // paddingLeft:25,
        color:'white'
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
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },

    buttonClose: {
        marginTop:10,
        backgroundColor: '#F8EEEC',
    },
    textStyle: {
        color: 'black',
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
})
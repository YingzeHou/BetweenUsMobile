import { View, Text, StyleSheet, Animated, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from "../../firebase"
import { AppDispatch, RootState } from '../../store';
import { createCollection, updateCollection } from '../../redux/collectionListSlice';
import Colors from '../../constants/Colors';

interface CollectionModalProps {
    mode: string,
    collection: {
        id: string,
        title: string,
        desc: string
    },
    index: number,
    triggerModal: Function,
    navigation: any,
    other: any
}
export default function CollectionModal({ mode, collection, index, triggerModal, navigation, other }: CollectionModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.user);
    const collectionRef = db.collection("collections");
    const [modalVisible, setModalVisible] = useState(false);
    const [collectionName, setCollectionName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (mode == 'edit') {
            setCollectionName(collection.title);
            setDescription(collection.desc);
            setModalVisible(true)
        }
    }, [])
    const create = () => {

        collectionRef.add({
            title: collectionName,
            desc: description,
            users: [userState.user.userId, userState.user.pairUser.userId]
        })
            .then((docRef) => {
                dispatch(createCollection({
                    id: docRef.id,
                    title: collectionName,
                    desc: description,
                    users: [userState.user.userId, userState.user.pairUser.userId]
                }));
            })

        setModalVisible(false)
    }

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
            .then(() => {

            })
            .catch((error) => alert(error));

        setModalVisible(false)
        other.closeRow(index, "absolute")
    }

    return (
        <View>
            {mode == 'create' ?
                (
                    <TouchableOpacity
                        style={{ position: 'absolute', top: -20, right: 5, zIndex: 2 }}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={{ fontSize: 30, color: "white" }}>+</Text>
                    </TouchableOpacity>
                ) :
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
                    onPressOut={mode == 'create' ? () => { setModalVisible(false) } : () => { triggerModal(false), other.closeRow(other.index, "absolute") }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{mode == 'create' ? "Create Collection" : "Edit Collection"}</Text>
                            <TextInput
                                placeholder="Collection Name"
                                placeholderTextColor="gray"
                                value={collectionName}
                                onChangeText={setCollectionName}
                                style={styles.textInput}
                            />
                            <TextInput
                                placeholder="Description"
                                placeholderTextColor="gray"
                                value={description}
                                onChangeText={setDescription}
                                style={styles.textInput}
                            />
                            {mode == 'create' ?
                                (
                                    <Pressable
                                        style={({ pressed }) => [styles.button, { backgroundColor: pressed ? 'gray' : Colors.borderColor }]}
                                        onPress={() => create()}
                                    >
                                        <Text style={styles.buttonTextStyle}>Create!</Text>
                                    </Pressable>
                                ) :
                                (
                                    <Pressable
                                        style={({ pressed }) => [styles.button, { backgroundColor: pressed ? 'gray' : Colors.borderColor }]}
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
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)'
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
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },

    buttonClose: {
        marginTop: 10,
        backgroundColor: Colors.borderColor,
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
        fontSize: 18
    },
    textInput: {
        width: '50%',
        fontSize: 15,
        marginVertical: 10,
        borderColor: 'gray',
        borderRadius: 5,
        borderWidth: 2,
        padding: 5
    },
});

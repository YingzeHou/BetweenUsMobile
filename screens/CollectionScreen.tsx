import { useState, useEffect } from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, ImageBackground, KeyboardAvoidingView, Platform, Text, ScrollView, Modal, TouchableOpacity } from "react-native";
import CollectionItem from "../components/CollectionItem";
import { AppDispatch, RootState } from "../store";
import {useDispatch, useSelector} from 'react-redux';
import { fetchCollections } from "../redux/collectionListSlice";

export default function CollectionScreen({route, navigation}: any ) {

    const dispatch = useDispatch<AppDispatch>();
    const screenState = useSelector((state: RootState) => state.collectionList)

    useEffect(() => {
        dispatch(fetchCollections());
    },[])

    const [modalVisible, setModalVisible] = useState(false);
    let row: Array<any> = [];
    let prevOpenedRow: any;
    const setRow = (index: number, ref: any) => {
        row[index] = ref;
    }
    const closeRow = (index: number, mode: string) => {
        if(mode == "relative") {
            if (prevOpenedRow && prevOpenedRow !== row[index]) {
                prevOpenedRow.close();
            }
            prevOpenedRow = row[index];
        }
        else {
            row[index].close();
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            {/* <ImageBackground source={require('../assets/images/todobg.png')} resizeMode="cover" style={styles.container} imageStyle={{opacity:1}}> */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                keyboardVerticalOffset={Platform.OS === "ios"? 100: 0}
                style={styles.formContainer}
            >
                <View style={styles.container}>
                    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                        {screenState.collections.map((collection, index) => (
                            <CollectionItem collection={collection} navigation={navigation} index={index} closeRow = {closeRow} setRow = {setRow} key={collection.id}/>
                        ))}
                    </ScrollView>
                </View>

                <Modal
                    animationType="slide"
                    visible={modalVisible}
                    presentationStyle='pageSheet'
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                    style={{backgroundColor:'white'}}
                >

                </Modal>
            </KeyboardAvoidingView>
            {/* </ImageBackground> */}
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    formContainer:{
        flex:1,
        width:'100%',
        height:'100%',
        top:0,
        backgroundColor:'white'
    },
    scroll:{
        flex: 1,
        width:'100%',
        height:'100%',
    },
})
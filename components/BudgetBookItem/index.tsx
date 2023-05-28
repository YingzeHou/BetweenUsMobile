import { View, StyleSheet, Text, Pressable, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useActionSheet } from '@expo/react-native-action-sheet';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useCallback, useState } from "react";
import BudgetBookModal from "../BudgetBookModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { deleteBudgetBook } from "../../redux/budgetbookListSlice";
import { db } from "../../firebase";
import { DeleteModal } from "../DeleteModal";

interface BudgetBookItemProps {
    book: {
        id: string,
        name: string,
        date: string,
        progress: number
    },
    index: number,
    navigation: any,
}
export function BudgetBookItem({book, index, navigation}: BudgetBookItemProps) {
    const { showActionSheetWithOptions } = useActionSheet();
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)

    const triggerEditModal = useCallback((visible: boolean) => {
        setEditModalVisible(visible);
    }, [])
    const triggerDelModal = useCallback((visible: boolean) => {
        setDeleteModalVisible(visible);
    }, [])

    const dispatch = useDispatch<AppDispatch>();
    const bbookRef = db.collection("budgetbooks");

    const deleteBook = () => {

        bbookRef.doc(book.id).delete()
        .then(() => {
            dispatch(deleteBudgetBook({
                atIndex: index
            }))
        })
        .catch((error) => alert(error));

    }

    const onPress = () => {
        const options = ['Delete', 'Edit', 'Cancel'];
        const destructiveButtonIndex = 0;
        const editButtonIndex = 1;
        const cancelButtonIndex = 2;
    
        showActionSheetWithOptions({
          options,
          cancelButtonIndex,
          destructiveButtonIndex
        }, (selectedIndex) => {
          switch (selectedIndex) {
            case editButtonIndex:
              setEditModalVisible(true);
              break;
    
            case destructiveButtonIndex:
              // Delete
              setDeleteModalVisible(true)
              break;
    
            case cancelButtonIndex:
              // Canceled
          }
        });
    }
    return (
        <View style={{flex:1}}>
        <TouchableOpacity 
            onPress={()=>navigation.navigate("BudgetBookDetail", {
                book: book,
                parentId: book.id
            })}
        >
            <View style={styles.container}>
                <View style={styles.iconBox}>
                    <MaterialCommunityIcons name="book-sync-outline" size={40} color={Colors.borderColor} />
                </View>
                <View style={styles.textBox}>
                    <Text style={styles.text}>{book.name}</Text>
                    <Text style={styles.smallText}>update on: {book.date}</Text>
                </View>
                <View style={styles.progressBox}>
                    <CircularProgress
                        value={book.progress}
                        radius={18}
                        inActiveStrokeColor={'#2ecc71'}
                        inActiveStrokeOpacity={0.2}
                        progressValueColor={'white'}
                        valueSuffix={'%'}
                    />
                </View>
                <TouchableOpacity 
                    style={styles.smallIconBox}
                    onPress={()=>{onPress()}}
                >
                    <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={25} color='white' />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
        {editModalVisible && <BudgetBookModal mode='edit' book={book} index={index} triggerModal={triggerEditModal} navigation={navigation}/>}
        {deleteModalVisible && <DeleteModal setVisibleCallback={triggerDelModal} operation={deleteBook} page='budgetBook' other={null}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'95%',
        height:50,
        backgroundColor: Colors.borderColor,
        marginVertical:10,
        alignSelf:'center',
        borderRadius:10,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    iconBox: {
        height:'100%',
        width:60,
        backgroundColor:'wheat',
        justifyContent:'center',
        alignItems:'center',
        borderTopLeftRadius:10,
        borderBottomLeftRadius: 10
    },
    smallIconBox:{
        marginRight:10
    },
    progressBox:{
        marginRight:10
    },
    textBox: {
        flex:1,
        justifyContent:'flex-start',
        alignItems:'flex-start'
    },
    text:{
        marginLeft:10,
        color:'white',
        fontSize:20
    },
    smallText: {
        marginLeft:10,
        color:'gray',
        fontSize:10
    }
})
import { View, StyleSheet, ImageBackground, Platform, ScrollView, Keyboard,KeyboardAvoidingView, TouchableWithoutFeedback, Text} from "react-native";
import TodoItem from "../components/TodoItem";
import { useEffect, useRef, useState } from "react";
import {db, auth} from "../firebase"
import {useDispatch, useSelector} from 'react-redux';
import { AppDispatch, RootState } from "../store";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "../redux/todoListSlice";
import { TouchableOpacity } from "react-native-gesture-handler";
import { fetchPair } from "../redux/pairSlice";
import Colors from "../constants/Colors";

export default function NoteScreen({route, navigation}: any) {
    const dispatch = useDispatch<AppDispatch>();
    const screenState = useSelector((state: RootState) => state.todoList)
    const userState = useSelector((state: RootState) => state.user);
    console.log(screenState.todos)
    const {parentId} = route.params;
    const [isMounted, setIsMounted] = useState(false);
    const isFirstMount = useRef(true);

    const todoRef = db.collection('todos');
    useEffect(() => {
        dispatch(fetchTodos(parentId));
        dispatch(fetchPair());
    },[])

    useEffect(()=>{
        if(screenState.todos.length == 0) {
            dispatch(createTodo({
                atIndex: 0,
                parentId: parentId,
                users: [userState.user.userId, userState.user.pairUser.userId]
            }))
        }
        else {
            if(isFirstMount.current) {
                isFirstMount.current = false;
            }
            else {
                setIsMounted(true);
            }
        }
    },[screenState.todos])



    const saveToCloud = () => {
        const currIds: any[] = [];
        screenState.todos.map((todo, index) => {
            const data = {
                index: index,
                content: todo.content,
                parentId: todo.parentId,
                isCompleted: todo.isCompleted,
                users: todo.users
            };
            if(todo.id.length == 20){
                currIds.push(todo.id);
                todoRef.doc(todo.id)
                    .update(data)
                    .then(()=>{
                        
                    })
                    .catch((error) => alert(error));
            }
            else {
                todoRef
                    .add(data)
                    .then((docRef) => {
                        
                    })
                    .catch((error) => alert(error));
            }
        })
        let difference = screenState.prevIds.filter(x => !currIds.includes(x));

        for(const id of difference) {
            todoRef.doc(id).delete().
            then(() =>{
            })
            .catch((error) => alert(error));
        }
        navigation.navigate("Collection")
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{height:'100%', width:'100%', backgroundColor:'white'}}>
                {screenState.loading && (<Text style={{alignSelf:'center', top:'40%'}}>LOADING...</Text>)}
                {screenState.error && (<Text>ERROR</Text>)}
                {!screenState.loading && !screenState.error && (
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"} 
                        keyboardVerticalOffset={Platform.OS === "ios"? 100: 0}
                        style={styles.formContainer}
                    >
                        <View style={styles.container}>
                            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                                {screenState.todos.map((todo, index) => (
                                    <View key={todo.id}>
                                        {/* {todo.parentId === parentId ? ( */}
                                            {/* <TodoItem todo={todo} onSubmit={()=>createNewItem(index+1)} onDelete={()=>deleteItem(index)} onUpdate={(content: string, isChecked: boolean)=>updateItem(index, content, isChecked)} focus = {isMounted} key={todo.id}/> */}
                                            <TodoItem 
                                                todo={todo} 
                                                onSubmit={()=>dispatch(createTodo({
                                                    atIndex: index+1,
                                                    parentId: parentId,
                                                    users: [userState.user.userId, userState.user.pairUser.userId]
                                                }))} 
                                                onDelete={()=>dispatch(deleteTodo({
                                                    atIndex: index
                                                }))} 
                                                onUpdate={(content:string, isChecked: boolean)=>dispatch(updateTodo({
                                                    atIndex: index,
                                                    content: content,
                                                    isChecked: isChecked,
                                                    users: [userState.user.userId, userState.user.pairUser.userId]
                                                }))}
                                                // onUpdate={(content: string, isChecked: boolean)=>updateItem(index, content, isChecked)} 
                                                focus = {isMounted} 
                                                key={todo.id}/>
                                        {/* ):(
                                            <View/>
                                        )} */}
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                        <TouchableOpacity style={{
                            justifyContent:'center', 
                            alignItems:'center', 
                            backgroundColor: Colors.borderColor, 
                            width:'90%',
                            alignSelf:'center',
                            borderRadius:5, 
                            padding:10, 
                            marginBottom:10
                        }} onPress={saveToCloud}>
                            <Text style={{color:'white', fontWeight:'bold', fontSize:20}}>Save Changes</Text>
                        </TouchableOpacity>
                        {/* <Button color={"black"} title="Save Changes" onPress={saveToCloud}/> */}
                    </KeyboardAvoidingView>
                )}
        </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: "flex-start",
        paddingHorizontal:20,
        paddingVertical:15
    },
    scroll:{
        flex: 1,
        // position:'absolute',
        width:'100%',
        height:'100%',
    },
    formContainer:{
        flex:1,
        width:'100%',
        height:'100%',
        top:0,
    },
})
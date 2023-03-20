import { useEffect, useState, useRef} from "react"
import { TextInput, View, StyleSheet, Keyboard } from "react-native"
import CheckBox from "../CheckBox"
import {db, auth} from "../../firebase"

interface TodoItemProps {
    todo: {
        id: string,
        index: number,
        content: string,
        parentId: string
        isCompleted: boolean,
        users: any[]

    }
    onSubmit: ()=>void,
    onDelete: ()=>void,
    onUpdate: (content: string, isChecked: boolean)=>void,
    focus: boolean
}
export default function TodoItem({todo, onSubmit, onDelete, onUpdate, focus}: TodoItemProps) {
    const [isChecked, setIsChecked] = useState(false);
    const [content, setContent] = useState('');
    const input = useRef(null);
    // console.log(focus)

    useEffect(() => {
        if(!todo) {return};
        setIsChecked(todo.isCompleted);
        setContent(todo.content);
        // onUpdate(todo.content);
    }, [todo])

    useEffect(() => {
        // get focus on input
        if(input.current && focus) {
            input?.current?.focus();
        }
    }, [input])

    const updateText = (text: string) => {
        setContent(text);
        onUpdate(text, isChecked);
    }

    const updateStatus = () => {
        onUpdate(content, !isChecked);
        setIsChecked(!isChecked);
    } 

    const onKeyPress = ({nativeEvent}) => {
        if(nativeEvent.key === "Backspace" && content === '') {
            // delete item
            onDelete();
        }
    }
    return (
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom:10}}>
            <CheckBox isChecked={isChecked} onPress={updateStatus}/>
            <TextInput
                // autoFocus={false}
                ref={input}
                value={content}
                onChangeText={(text)=>updateText(text)}
                // onChangeText = {setContent}
                // onEndEditing = {updateText}
                style={isChecked? styles.textCompleted: styles.textInput}
                onSubmitEditing={onSubmit}
                blurOnSubmit
                onKeyPress={onKeyPress}
            />
        </View> 
    )
}

const styles = StyleSheet.create({
    textInput: {
        flex:1,
        fontSize:18,
        color:'black',
        marginLeft:12,
    },
    textCompleted: {
        flex:1,
        textDecorationLine: 'line-through',
        color:'gray',
        fontSize:18,
        marginLeft:12,
    }
})
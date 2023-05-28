import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TextInput, Text, Keyboard, TouchableOpacity, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
// import { TextInput } from "react-native-gesture-handler";

interface PlanCompositionProps {
    composition: {
        type: string,
        category: string,
        amount: number,
    },
    // onSubmit: ()=>void,
    onUpdate: (category: string, amount: number)=>void
    onDelete: ()=>void,
    mode: string
    // focus: boolean
}
export default function PlanComposition({composition, onUpdate, onDelete, mode}: PlanCompositionProps) {
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if(!composition) {return};
        setCategory(composition.category);
        setAmount(composition.amount.toString());
    }, [composition])

    const updateCategory = (category: string) => {
        setCategory(category);
        onUpdate(category, Number(amount))
    }

    const updateAmount = (amount: string) => {
        setAmount(amount);
        onUpdate(category, Number(amount));
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            keyboardVerticalOffset={Platform.OS === "ios"? 100: 0}
            style={{flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom:10}}
            // onPress={()=>Keyboard.dismiss()}
        >

            {mode === 'expect' && (
                <TouchableOpacity onPress={()=>onDelete()}>
                    <MaterialCommunityIcons name="minus-circle-outline" size={25}/>
                </TouchableOpacity>
            )}
            <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            {mode === 'expect'?(
                <TextInput
                    value={category}
                    onChangeText={(text)=>updateCategory(text)}
                    style={styles.textInput}
                    blurOnSubmit
                    // onKeyPress={onKeyPress}
                />
            ):
            (
                <Text style={styles.textInput}>{category !== ''? category: "Pending"}</Text>
            )}
            <Text>:</Text>
            <TextInput
                // keyboardType='numeric'
                value={amount}
                onChangeText={(text)=> updateAmount(text)}
                style={styles.textInput}
                blurOnSubmit
            />
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView > 
    )
}

const styles = StyleSheet.create({
    textInput: {
        borderBottomWidth:2,
        marginHorizontal:10,
        fontSize:18,
        width:80,
    }
})
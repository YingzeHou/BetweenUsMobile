import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View, TouchableOpacity} from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import {useDispatch, useSelector} from 'react-redux'
import { AppDispatch, RootState } from "../store";
import { createPair } from "../redux/pairSlice";
import {db, auth} from "../firebase"

export default function SignUpScreen({route, navigation}: any) {
    const dispatch = useDispatch<AppDispatch>();
    // const screenState = useSelector((state: RootState) => state.pair)
    // const pairRef = db.collection("pairs");
    const userRef = db.collection("users");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');

    const onSubmit = () => {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(authUser => {
            authUser?.user?.updateProfile({
                displayName: username,
                photoURL: require("../assets/images/avatar-placeholder.png")
            });
            
            // const data = {
            //     myId: authUser.user?.uid,
            //     pairId: "",
            // }
            // pairRef.add(data)
            //     .then((docRef) => {
            //         dispatch(createPair({
            //             id: docRef.id,
            //             uid: authUser.user?.uid
            //         }))
            //     })
            //     .catch((error) => alert(error));
        
            const user = {
                userId: authUser.user?.uid,
                username: username,
                email: email,
                photoUrl: require("../assets/images/avatar-placeholder.png"),
                gender: gender,
                pairUser :{
                    userId: "",
                    username: "",
                    email: "",
                    photoUrl: "",
                    gender: ""
                }
            }

            userRef.add(user)
                .then((docRef)=> {

                })
                .catch((error) => alert(error));

            navigation.navigate('SignIn')
        })
        .catch(error => alert(error.message))
    }
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            // keyboardVerticalOffset={Platform.OS === "ios"? "padding": "height"}
            style={styles.formContainer}
        >
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up @ Between Us</Text>
            <TextInput
                placeholder="username"
                placeholderTextColor="gray"
                value={username}
                onChangeText = {setUsername}
                style={styles.textInput}
            />

            <TextInput
                placeholder="example@mail.com"
                placeholderTextColor="gray"
                value={email}
                onChangeText = {setEmail}
                style={styles.textInput}
            />

            <TextInput
                placeholder="password"
                placeholderTextColor="gray"
                value={password}
                onChangeText = {setPassword}
                secureTextEntry
                style={styles.textInput}
            />  

            <TouchableOpacity style={styles.signUp} onPress={onSubmit}>
                <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>

        </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#fbfbf8',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    title:{
        marginBottom:100,
        fontSize:30,

    },
    textInput: {
        width:'100%',
        marginLeft:'50%',
        fontSize:18,
        marginVertical: 25
    },
    signUpText:{
        fontSize:25,
        color:'white',
        fontWeight:'200'
    },
    signUp: {
        backgroundColor:'#a83f39',
        padding:15,
        borderRadius:20,
        marginTop:100,
        color:'white'
    },
    formContainer:{
        flex:1,
        width:'100%',
        height:'100%',
        top:0,
    },
})
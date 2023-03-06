import { useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { auth } from '../firebase';

export default function SignInScreen({route, navigation}: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = () => {
        auth.signInWithEmailAndPassword(email,password)
        .then((userCredential) => {
            var user = userCredential.user
            if(user) {
                navigation.navigate("Root");
            }
        })
        .catch((error) => {
            var errMsg = error.message;
            if(errMsg.includes('badly')){
                alert("邮箱格式错误")
            }
            else{
                console.log(errMsg);
                alert("邮箱或密码错误")
            }
        })
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Between Us ❤️</Text>
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

            <TouchableOpacity style={styles.signIn} onPress={onSubmit}>
                <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('SignUp')}>
                <Text style={styles.registerText}>Don't have an account? Sign Up Here</Text>
            </TouchableOpacity>

        </View>
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
    signInText:{
        fontSize:25,
        color:'white',
        fontWeight:'200'
    },
    signIn: {
        backgroundColor:'#a83f39',
        padding:15,
        borderRadius:20,
        marginTop:100,
        color:'white'
    },
    registerText:{
        marginTop:20,
        fontSize:15,
        color:'#a83f39',
        fontWeight:'400'
    },
})
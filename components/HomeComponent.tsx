import { Ionicons } from "@expo/vector-icons";
import { Image, View, StyleSheet } from "react-native";
import { MonoText } from "./StyledText";

export default function HomeComponent(
    props: {title: string; type: any }
) {
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                {/* <Ionicons name={props.logoPath} size={50} color='white'></Ionicons> */}
                {props.type == 'note' ? (
                    <Image source={require('../assets/images/notelogo.png')} style={styles.noteLogo}/>
                ): props.type == 'budget' ? (
                    <Image source={require('../assets/images/budgetlogo.png')} style={styles.budgetLogo}/>
                ): props.type == 'days' ?(
                    <Image source={require('../assets/images/daylogo.png')} style={styles.budgetLogo}/>
                ): (
                    <Image source={require('../assets/images/ellipsis.png')} style={styles.budgetLogo}/>
                )}
                <MonoText style={styles.text}>{props.title}</MonoText>
            </View>
        </View>
    );  
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    box: {
        borderWidth:4,
        borderColor:'#ffe5e0',
        backgroundColor:'white',
        height:80,
        width:80,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center'
    },
    noteLogo: {
      width: 30,
      height: 40,
    },
    budgetLogo: {
        width: 35,
        height: 35,
    },
    text:{
        fontWeight: "400",
        fontSize:15,
        color:'black'
    },
    logo: {
      width: 66,
      height: 58,
    },
  });
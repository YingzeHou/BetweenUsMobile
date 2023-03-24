import { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable, Animated, TouchableWithoutFeedback } from "react-native";
import Colors from "../../constants/Colors";

interface BudgetNavBarProps {
    switchTab: Function
}
export function BudgetNavBar({switchTab}: BudgetNavBarProps) {
    const [tabFocus, setTabFocus] = useState(0)
    const changeTab = (tabNum: number) => {
        setTabFocus(tabNum);
        switchTab(tabNum);
    }
    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback>
                <Pressable style={tabFocus == 0? styles.tabFocus: styles.tabDefault}
                    onPress={()=>changeTab(0)}>
                    <Text style={tabFocus == 0? styles.textFocus: styles.textDefault}>Book</Text>
                </Pressable>
            </TouchableWithoutFeedback>
            <Pressable style={tabFocus == 1? styles.tabFocus: styles.tabDefault}
                onPress={()=>changeTab(1)}>
                <Text style={tabFocus == 1? styles.textFocus: styles.textDefault}>Statistic</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'80%',
        height:'5%',
        borderRadius:50,
        backgroundColor: Colors.light.tabIconDefault,
        alignSelf:'center',
        marginVertical:10,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
    },
    tabFocus: {
        backgroundColor: Colors.borderColor,
        width:'30%',
        height:'80%',
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center',
        transition:'0.5s, transform 0.5s' 
    },
    tabDefault: {
        // backgroundColor: Colors.borderColor,
        width:'30%',
        height:'80%',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        transition:'0.5s, transform 0.5s' 
    },
    textFocus: {
        color:'white'
    },
    textDefault: {
        color:'black'
    }
})
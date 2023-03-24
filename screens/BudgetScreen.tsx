import { useCallback, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { BudgetNavBar } from "../components/BudgetNavBar";
import { BudgetBookScreen } from "./BudgetBookScreen";
import { BudgetStatScreen } from "./BudgetStatScreen";

export default function BudgetScreen () {
    const [tabNum, setTabNum] = useState(0);
    const switchTab = useCallback((tabNum: number) => {
        setTabNum(tabNum)
    }, [])
    return (
        <View style = {styles.container}>
            <BudgetNavBar switchTab={switchTab}/>
            {tabNum == 0? 
            (
                <BudgetBookScreen/>
            ):
            (
                <BudgetStatScreen/>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        height:'100%',
        width:"100%"
    }
})
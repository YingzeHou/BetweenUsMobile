import { useCallback, useEffect, useState } from "react";
import {View, StyleSheet, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView, Keyboard, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DayItem from "../components/DayItem";
import PinDayItem from "../components/PinDayItem";
import { fetchDays } from "../redux/dayListSlice";
import { AppDispatch, RootState } from "../store";

export default function DaysScreen ({route, navigation}: any) {
    const data = [
        {
            id:'1',
            event:'💗 with Liao',
            startDate:'2019-09-17',
            category:'love',
            address:'Beijing',
            pinned:1
        },
        {
            id:'2',
            event:'Eat Hotpot',
            startDate:'2024-09-17',
            category:'daily',
            address:'Nanjing',
            pinned:0
        },

    ]

    const dispatch = useDispatch<AppDispatch>();
    const screenState = useSelector((state: RootState) => state.dayList)

    useEffect(() => {
        dispatch(fetchDays());
    },[])

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(fetchDays()).then(()=>{setRefreshing(false);});
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            {/* <ImageBackground source={require('../assets/images/todobg.png')} resizeMode="cover" style={styles.container} imageStyle={{opacity:1}}> */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                keyboardVerticalOffset={Platform.OS === "ios"? 100: 0}
                style={styles.formContainer}
            >
                <View style={styles.container}>
                    <ScrollView 
                        style={styles.scroll} 
                        showsVerticalScrollIndicator={false}
                        refreshControl = {
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }>
                        {screenState.days.map((day, index) => 
                        day.pinned == 1? 
                        (
                            <PinDayItem day={day} navigation={navigation} index={index} key={day.id}/>
                        ):
                        (
                            <DayItem day={day} navigation={navigation} index={index} key={day.id}/>
                        ))}
                    </ScrollView>
                </View>

            </KeyboardAvoidingView>
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
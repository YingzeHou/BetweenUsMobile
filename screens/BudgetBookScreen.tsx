import { useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { BudgetBookItem } from "../components/BudgetBookItem";
import Colors from "../constants/Colors";
import { fetchBudgetBooks } from "../redux/budgetbookListSlice";
import { AppDispatch, RootState } from "../store";

export function BudgetBookScreen({route, navigation}: any) {
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const screenState = useSelector((state: RootState) => state.budgetBookList)

    useEffect(() => {
        dispatch(fetchBudgetBooks());
    },[])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
          }, 2000);
    }, []);
    return (
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
                    }
                >
                    {screenState.budgetBooks.map((book, i) =>
                        <BudgetBookItem key={book.id} book={book} index={i} navigation={navigation}/>
                    )}
                </ScrollView>
            </View>
            </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        flex:1,
        width:'95%',
        alignSelf:'center',
        height:'100%',
        top:0,
        backgroundColor:'white'
    },
    container:{
        height:'100%',
        width:'100%',
        borderWidth:2,
        borderColor: Colors.borderColor,
        alignSelf:'center',
        borderRadius:10,
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    scroll:{
        flex: 1,
        width:'100%',
        height:'100%',
    },
})
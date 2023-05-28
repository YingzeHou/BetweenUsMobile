import { useEffect } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import BudgetDetailCard from "../components/BudgetDetailCard";
import { fetchPlans } from "../redux/planListSlice";
import { AppDispatch, RootState } from "../store";

export function BudgetBookDetailScreen ({route, navigation}: any) {
    const data = [
        {
            id: '1',
            parentId: '1',
            title: "Trip to Seattle",
            desiredAmount: 2000,
            currentAmount: 650,

        },
        {
            id: '2',
            parentId: '1',
            title: "Trip to San F",
            desiredAmount: 1000,
            currentAmount: 200,
            
        },
        {
            id: '1',
            parentId: '1',
            title: "Trip to China",
            desiredAmount: 5000,
            currentAmount: 1280,
            
        },
        {
            id: '1',
            parentId: '1',
            title: "Trip to Beijing",
            desiredAmount: 2500,
            currentAmount: 1600,
            
        }
    ]
    const {book} = route.params
    const dispatch = useDispatch<AppDispatch>();
    const screenState = useSelector((state: RootState) => state.planList)
    useEffect(() => {
        dispatch(fetchPlans(book.id));
    },[])
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
            >
                {screenState.plans.map((plan, i) => 
                    <BudgetDetailCard key={i} plan={plan}/>
                )}

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    },
    scroll: {
        flex:1,
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'center',
        alignItems:'center'
    }
})
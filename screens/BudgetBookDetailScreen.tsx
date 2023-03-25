import { View, StyleSheet, Pressable, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BudgetDetailCard from "../components/BudgetDetailCard";

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
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
            >
                {data.map((plan, i) => 
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
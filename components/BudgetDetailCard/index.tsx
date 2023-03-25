import { Pressable, Text, StyleSheet, View, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import CircularProgress from 'react-native-circular-progress-indicator';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useActionSheet } from '@expo/react-native-action-sheet';

interface BudgetDetailCardProps {
    plan: {
        id: string,
        parentId: string,
        title: string,
        desiredAmount: number,
        currentAmount: number,
    }
}
export default function BudgetDetailCard({plan}: BudgetDetailCardProps) {
    const { showActionSheetWithOptions } = useActionSheet();
    const onPress = () => {
        const options = ['Delete', 'Edit', 'Cancel'];
        const destructiveButtonIndex = 0;
        const editButtonIndex = 1;
        const cancelButtonIndex = 2;
    
        showActionSheetWithOptions({
          options,
          cancelButtonIndex,
          destructiveButtonIndex
        }, (selectedIndex) => {
          switch (selectedIndex) {
            case editButtonIndex:
              alert("EDIT")
              break;
    
            case destructiveButtonIndex:
              // Delete
              alert("DELETE")
              break;
    
            case cancelButtonIndex:
              // Canceled
          }
        });
    }
    return (
        <Pressable
            style={({pressed}) => [styles.card, {backgroundColor:pressed? 'gray': 'rgba(0,29,56, .6)'}]}
            onPress={()=>alert("OPEN")}
        >
            <Text style={styles.title}>{plan.title}</Text>
            <View style={styles.progressBox}>
                <CircularProgress
                    value={plan.currentAmount / plan.desiredAmount * 100}
                    radius={35}
                    inActiveStrokeColor={Colors.borderColor}
                    inActiveStrokeOpacity={0.8}
                    progressValueColor={'white'}
                    valueSuffix={'%'}
                />
            </View>
            <TouchableOpacity onPress={()=>onPress()}>
                <MaterialCommunityIcons name="dots-horizontal" size={30} color={Colors.borderColor} />
            </TouchableOpacity>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        width:'40%',
        height:'25%',
        backgroundColor: 'rgba(0,29,56, .6)',
        borderRadius:25,
        marginVertical:10,
        marginHorizontal:10,
        justifyContent:'space-around',
        alignItems:'center'
    },
    title: {
        marginTop:10,
        color: 'white',
        fontWeight:'bold',
        fontSize:15,
        borderColor: Colors.borderColor,
    },
    progressBox:{
        marginVertical:20
    },
})
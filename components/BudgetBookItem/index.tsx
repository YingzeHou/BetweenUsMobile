import { View, StyleSheet, Text, Pressable, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useActionSheet } from '@expo/react-native-action-sheet';
import CircularProgress from 'react-native-circular-progress-indicator';

interface BudgetBookItemProps {
    book: {
        id: string,
        name: string,
        date: string
    },
    navigation: any,
}
export function BudgetBookItem({book, navigation}: BudgetBookItemProps) {
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
            style={({pressed}) => [styles.container, {backgroundColor:pressed? 'darkgray': Colors.borderColor}]}
            onPress={()=>navigation.navigate("BudgetBookDetail", {
                book: book
            })}
        >
            <View style={styles.iconBox}>
                <MaterialCommunityIcons name="book-sync-outline" size={40} color={Colors.borderColor} />
            </View>
            <View style={styles.textBox}>
                <Text style={styles.text}>{book.name}</Text>
                <Text style={styles.smallText}>{book.date}</Text>
            </View>
            <View style={styles.progressBox}>
                <CircularProgress
                    value={45}
                    radius={18}
                    inActiveStrokeColor={'#2ecc71'}
                    inActiveStrokeOpacity={0.2}
                    progressValueColor={'white'}
                    valueSuffix={'%'}
                />
            </View>
            <TouchableOpacity 
                style={styles.smallIconBox}
                onPress={()=>{onPress()}}
            >
                <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={25} color='white' />
            </TouchableOpacity>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'95%',
        height:50,
        backgroundColor: Colors.borderColor,
        marginVertical:10,
        alignSelf:'center',
        borderRadius:10,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    iconBox: {
        height:'100%',
        width:60,
        backgroundColor:'wheat',
        justifyContent:'center',
        alignItems:'center',
        borderTopLeftRadius:10,
        borderBottomLeftRadius: 10
    },
    smallIconBox:{
        marginRight:10
    },
    progressBox:{
        marginRight:10
    },
    textBox: {
        flex:1,
        justifyContent:'flex-start',
        alignItems:'flex-start'
    },
    text:{
        marginLeft:10,
        color:'white',
        fontSize:20
    },
    smallText: {
        marginLeft:10,
        color:'gray',
        fontSize:10
    }
})
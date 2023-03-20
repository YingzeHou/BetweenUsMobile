import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface DayItemProps {
    day: {
        id: string
        event: string,
        startDate: string,
        category: string,
        address: string,
        pinned: number
    }
    navigation: any,
    index: number,
}

const getDuration = (startDateStr: string) => {
    let startDate = new Date(startDateStr)
    let today = new Date()
    let duration = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    return duration
}

export default function PinDayItem({day, navigation, index}: DayItemProps) {
    return (
        <GestureHandlerRootView>
            <TouchableOpacity onPress={()=> navigation.navigate('DayDetail', {
                day: day
            })}
            >
                <View style={styles.container}>
                    <View style={styles.root}>
                        <Text style={styles.pin}>Pinned</Text>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{day.event}</Text>
                            <Text style={styles.desc}>@ {day.address}</Text>
                            <Text style={styles.desc}>Start from: {day.startDate}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            {/* <Text style={styles.title}>{day.category}</Text> */}
                            {getDuration(day.startDate) > 0? (
                                <Text style={styles.dayText}>{getDuration(day.startDate)} Days </Text>
                            ): (
                                <Text style={styles.dayText}>{-getDuration(day.startDate)} Days</Text>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    pin:{
        position:'absolute',
        right:10,
        top:10,
        fontWeight:"bold",
        borderWidth:2,
        padding:2,
        borderRadius:10,
    },
    root:{
        backgroundColor:'#f5f5f5',
        borderBottomWidth:2,
        borderStyle:'outset',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'100%',
        paddingVertical: 50,
        paddingHorizontal:20
    },
    textContainer: {
        justifyContent:'flex-start',
        alignItems:'flex-start'
    },
    title:{
        fontSize:25,
        marginRight:10
    },
    dayText:{
        fontSize:25,
        marginRight:10,
        color:'black',
        fontWeight:"bold"
    },
    desc: {

        color:'grey'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
  
      buttonClose: {
          marginTop:10,
          backgroundColor: '#F8EEEC',
      },
      textStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize:18
      },
      textInput: {
          width:'50%',
          fontSize:15,
          marginVertical: 10,
          borderColor:'gray',
          borderRadius:5,
          borderWidth:2,
          padding:5
      },
})
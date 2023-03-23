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

export default function DayItem({day, navigation, index}: DayItemProps) {
    return (
        <GestureHandlerRootView>
            <TouchableOpacity onPress={()=> navigation.navigate('DayDetail', {
                day: day,
                index: index,
                navigation: navigation
            })}
            >
                <View style={styles.container}>
                    <View style={styles.root}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{day.event}</Text>
                            <Text style={styles.desc}>{day.address}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            {getDuration(day.startDate) > 0? (
                                <Text style={styles.titlePast}>{getDuration(day.startDate)} Days</Text>
                            ): (
                                <Text style={styles.titleFuture}>{-getDuration(day.startDate)} Days</Text>
                            )}
                        </View>
                    </View>
                    <View style={{
                        backgroundColor: '#A2A2A2',
                        height: 1,
                        width: '95%'}}
                    />
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
    root:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'100%',
        padding: 20,
    },
    iconContainer:{
        width:40,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#404040',
        marginRight:10
    },
    textContainer: {
        justifyContent:'flex-start',
        alignItems:'flex-start'
    },
    title:{
        fontSize:20,
        marginRight:10
    },
    titleFuture:{
        fontSize:20,
        marginRight:10,
        color:'#8B4000'
    },
    titlePast:{
        fontSize:20,
        marginRight:10,
        color:'#008b8b'
    },
    desc: {
        color:'grey'
    },
    rightAction:{
        backgroundColor:'red',
        justifyContent:'center',
        flex:1,
        alignItems:'flex-end',
        borderRadius:20
    },
    leftAction:{
        backgroundColor:'gray',
        justifyContent:'center',
        flex:1,
        alignItems:'flex-start',
        borderRadius:20
    },
    actionText:{
        fontSize:10,
        // paddingRight:25,
        // paddingLeft:25,
        color:'white'
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
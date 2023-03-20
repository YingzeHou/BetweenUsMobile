import {View, Text, StyleSheet, ImageBackground} from 'react-native';

interface DayCardPrompt {
    day: {
        id: string
        event: string,
        startDate: string,
        category: string,
        address: string,
        pinned: number
    }
}

const getDuration = (startDateStr: string) => {
    let startDate = new Date(startDateStr)
    let today = new Date()
    let duration = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    return duration
}

export default function DayCard({day}: DayCardPrompt) {
    return (
        <View style={styles.containerBox}>
            <View style={styles.titleBox}>
                <Text style={styles.title}>{day.event}</Text>
            </View>
            {getDuration(day.startDate) > 0? (
                <Text style={styles.dayText}>{getDuration(day.startDate)}</Text>
            ): (
                <Text style={styles.dayText}>{-getDuration(day.startDate)}</Text>
            )}
            <Text style={styles.text}>At: {day.address}</Text>

            {getDuration(day.startDate) > 0? (
                <Text style={styles.text}>From: {day.startDate}</Text>
            ): (
                <Text style={styles.text}>Expect On: {day.startDate}</Text>
            )}
            {/* <Text>From: {day.startDate}</Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        height:'100%',
        width:'100%',
        backgroundColor:'white'
    },
    containerBox: {
        width:300,
        height:250,
        backgroundColor:'#001d38',
        alignSelf:'center',
        justifyContent:'flex-start',
        alignItems:'center',
        borderRadius:40,
        opacity:0.8
    },
    titleBox:{
        width:'100%',
        flexDirection:'row',
        flex:0.6,
        justifyContent:'center',
        backgroundColor:'wheat',
        borderTopStartRadius:40,
        borderTopEndRadius:40

    },
    title:{
        fontSize:20,
        marginTop:20,
        fontWeight:'bold',
        fontFamily:'AppleSDGothicNeo-Regular',
        color:'black'
    },
    dayText: {
        marginTop:15,
        fontSize:80,
        fontFamily:'AppleSDGothicNeo-Regular',
        color:'white'
    },
    text: {
        color:'white'
    }
 })
import { Modal, Pressable, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

interface DeleteModalProps {
    setVisibleCallback: Function,
    operation: Function,
    page: string,
    other: any
}
export function DeleteModal({setVisibleCallback, operation, page, other}: DeleteModalProps) {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => {
                setVisibleCallback(false);
            }}
        >
            <TouchableOpacity 
                style={styles.modalContainer} 
                activeOpacity={0} 
                onPressOut={page=='day'? () => {setVisibleCallback(false)}: () => {setVisibleCallback(false), other.closeRow(other.index, "absolute")}}
            >
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Are you sure to delete?</Text>
                {page=='collection' &&  <Text style={styles.modalText}>All todos within will be deleted</Text>}
                <Pressable
                    style={({pressed}) => [page=='day'? styles.buttonDay: styles.buttonCol, {backgroundColor:pressed? 'gray': Colors.alertColor}]}
                    onPress={() => operation()}
                >
                    <Text style={{color:'white'}}>Delete</Text>
                </Pressable>
            </View>
            </View>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    modalView: {
        top:'30%',
        height:'30%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: Colors.borderColor,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    buttonDay: {
        top:'70%',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonCol: {
        top:'30%',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize:18
    },
    modalContainer:{
        height:'60%',
        justifyContent:'center',
        alignItems:'center',
    },
})
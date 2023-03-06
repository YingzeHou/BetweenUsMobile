import { Button, Image, Keyboard, Modal, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Avatar } from "react-native-paper";
import { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { AppDispatch, RootState } from '../store';
import { TextInput } from 'react-native-gesture-handler';
import {db, auth, storage} from "../firebase"
import * as ImagePicker from 'expo-image-picker';
import { fetchUser, userInfo } from '../redux/userSlice';
import AccountEntry from '../components/AccountItem';

export default function TabThreeScreen({route, navigation}: any) {
  const user = auth.currentUser;
  const dispatch = useDispatch<AppDispatch>();
  const screenState = useSelector((state:RootState) => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState("");
  const [code, setCode] = useState("");
  const [pairUserId, setPairUserId] = useState("");
  const userRef = db.collection("users");

  useEffect(() => {
    dispatch(fetchUser(auth.currentUser?.uid!))
  },[]) 

  const update = (uid: string) => {
    userRef
      .where("userId", "==", uid)
      .get()
      .then((querySnapshot) => {
        const doc = querySnapshot.docs[0];
        // console.log(doc);
        const {userId, username, email, photoUrl, gender} = doc.data();
        const user: userInfo = {
            userId: userId,
            username: username,
            email:email,
            photoUrl: photoUrl,
            gender: gender,
        };
        const data = {
          pairUser: user
        }
          
        userRef.doc(screenState.user.id).update(data)
          .then(() => {
            setPairUserId(data.pairUser.userId);
          })
          .catch((error) => alert(error));
          })
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
        uploadImage(result.assets[0].uri);
    }
  }

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = storage.child("avatar/"+auth.currentUser?.uid);
    await ref.put(blob);
    storage.child("avatar/"+auth.currentUser?.uid).getDownloadURL()
          .then((photoUrl) => {
            auth.currentUser?.updateProfile({
              photoURL: photoUrl
            }).then(()=> {
              userRef.doc(screenState.user.id).update({
                photoUrl: photoUrl
              })
              .then(()=>{
                setImage(photoUrl);
              })
            });
          })
  }

  return (
    <View style={styles.container}>
      { screenState.user.photoUrl!=="" ?(
        <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={100}
              source={{
                uri: image===""? screenState.user.photoUrl: image
              }}
            />
            <Text style={styles.avatarText}>{screenState.user.username}</Text>
          </View>
        </TouchableOpacity>
        <Image
          source={require("../assets/images/link.png")}
          style = {{ width:100, height:100}}
        />
        {!screenState.user.pairUser.userId? (
          <TouchableOpacity onPress={()=>setModalVisible(true)}>
            <View style={styles.avatarContainer}>
            <Avatar.Icon
              size={100}
              icon="help"
              style={{backgroundColor:'gray'}}
            />
            </View>
            <Text style={styles.avatarText}>Link?</Text>
          </TouchableOpacity>
        ):(
          <TouchableOpacity  onPress={()=>setModalVisible(true)}>
            <View style={styles.avatarContainer}>
            <Avatar.Image
              size={100}
              source={{
                uri: screenState.user.pairUser.photoUrl
              }}
            />
            <Text style={styles.avatarText}>{screenState.user.pairUser.username}</Text>
            </View>
        </TouchableOpacity>
        )}
      </View>
      ): (
        <Text style={{color:"black", alignSelf:'center'}}>Retrieving your Info...</Text>
      )}

        <ScrollView style={styles.listView}>
          <AccountEntry entryType='General Settings' iconName='cog-outline'/>
          <AccountEntry entryType='My Profile' iconName='person-outline'/>
          <AccountEntry entryType='User Mode' iconName='keypad-outline'/>
        </ScrollView>
      

        <Modal
          animationType="slide"
          visible={modalVisible}
          presentationStyle='pageSheet'
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
          style={styles.modalStyle}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.modalView}>
            <View style = {styles.bar}></View>
            <Text style={styles.modalHeader}>Enter the Code for your link 💓</Text>
            <TextInput
              value={code}
              style={styles.modalInput}
              onChangeText={setCode}
            />
            <TouchableOpacity style={styles.modalSubmit} onPress={() => update(code)}>
              <Text style={{fontSize:20, color:'white'}}>Link!</Text>
            </TouchableOpacity>
          </View>
          </TouchableWithoutFeedback>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 22,
    backgroundColor:'white'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  header: {
    position:'absolute',
    height:'35%',
    width:'100%',
    top:0,
    flexDirection:'row',
    backgroundColor:'#EDEDED',
    justifyContent:'center',
    alignItems:'center'
  },
  avatarContainer:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'transparent'
  },
  avatarText: {
    color:'black',
    marginTop:5
  },
  modalStyle: {
    backgroundColor:'white'
  },
  bar:{
    position:'absolute',
    top:0,
    width: 100,
    height: 5,
    backgroundColor: "gray",
    borderRadius:10,
  },
  modalHeader: {
    top:'20%',
    color:'black',
    fontSize:20,
    fontWeight:'bold'
  },
  modalInput:{
    fontSize:15,
    height:'6%',
    width:'90%',
    borderWidth:2,
    borderColor:'black',
    borderRadius:10,
    top:'25%',
    padding:10
  },
  modalSubmit: {
    height:'6%',
    width:'25%',
    backgroundColor:'#a83f39',
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    top:'30%'
  },
  listView: {
    top:'40%',
    flex: 1,
    width:'100%',
    height:'100%',
  }
});

import React from 'react';
import { ImageBackground, Pressable, StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import HomeComponent from '../components/HomeComponent';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import { useEffect } from 'react';
import { fetchUser } from '../redux/userSlice';
import {auth} from "../firebase"
import { AppDispatch } from '../store';
import {useDispatch} from 'react-redux'
import DayCard from '../components/DayCard';

const day = {
  id:'1',
  event:'💗 with Liao',
  startDate:'2019-09-17',
  category:'love',
  address:'Beijing',
  pinned:1
}
export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchUser(auth.currentUser?.uid!))
  },[]) 
  
  return (
    <ImageBackground source={require('../assets/images/bg.jpeg')} resizeMode="cover" style={styles.container} imageStyle={{opacity:1}}>
      {/* <HomeComponent title='Notes' logoPath='../assets/images/notelogo.png'></HomeComponent> */}
      <DayCard day={day}/>
      <View style={styles.homecontainer}>
        <TouchableOpacity onPress={()=> navigation.navigate('Collection')}>
          <HomeComponent title='Note' type='note'></HomeComponent>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> navigation.navigate('Budget')}>
          <HomeComponent title='Budget' type='budget'></HomeComponent>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> navigation.navigate('Days')}>
          <HomeComponent title='Days' type='days'></HomeComponent>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> alert("More to come!")}>
          <HomeComponent title='More' type='more'></HomeComponent>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homecontainer:{
    position:'absolute',
    bottom: 20,
    backgroundColor: 'transparent',
    width: '100%',
    height:'15%',
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center'
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
});

import React, { useState } from 'react';
import { Animated, ImageBackground, Pressable, StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import HomeComponent from '../components/HomeComponent';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import { useEffect } from 'react';
import { fetchUser } from '../redux/userSlice';
import {auth} from "../firebase"
import { AppDispatch, RootState } from '../store';
import {useDispatch, useSelector} from 'react-redux'
import DayCard from '../components/DayCard';
import { fetchDays } from '../redux/dayListSlice';

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
  const screenState = useSelector((state: RootState) => state.dayList)
  useEffect(() => {
    dispatch(fetchUser(auth.currentUser?.uid!))
    dispatch(fetchDays())
  },[]) 

  const [fadeAnim] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [])
  
  return (
    <ImageBackground source={require('../assets/images/bg.jpeg')} resizeMode="cover" style={styles.container} imageStyle={{opacity:1}}>
      <Animated.View
        style={{opacity: fadeAnim}}
      >
      {screenState.days!=null && screenState.days[0]!=null && <DayCard day={screenState.days[0]}/>}
      </Animated.View>
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

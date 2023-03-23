/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { TouchableOpacity, ColorSchemeName, Pressable, Text } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/TabOneScreen';
import TabThreeScreen from '../screens/TabThreeScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NoteScreen from '../screens/NoteScreen';
import BudgetScreen from '../screens/BudgetScreen';
import DaysScreen from '../screens/DaysScreen';
import CollectionScreen from '../screens/CollectionScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SplashScreen from '../screens/SplashScreen';
import {useDispatch, useSelector} from "react-redux"
import { AppDispatch } from '../store';
import CollectionModal from '../components/CollectionModal';
import DayDetailScreen from '../screens/DayDetailScreen';
import DayModal from '../components/DayModal';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const dummyData = {
    id:"0",
    event:"",
    startDate:"",
    category:"",
    address:"",
    pinned:-1
  }
  return (
    <Stack.Navigator>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="Collection" component={CollectionScreen} options={{ 
        title: 'Collections',
        headerStyle: {
          backgroundColor: Colors.borderColor,
        },
        headerTintColor: 'white',
        headerRight: () => (
          <CollectionModal/>
        ),
        }} />
      <Stack.Screen name="Note" component={NoteScreen} options={{ 
        title: 'Todos',
        headerStyle: {
          backgroundColor: Colors.borderColor,
        },
        headerTintColor: 'white',
        headerRight: () => (
          <TouchableOpacity
            style = {{height: 100, marginTop: -5}}
            onPress={() => alert('This is a button!')}  
          >
            <Text style = {{fontSize:30, color:'white'}}>...</Text>
          </TouchableOpacity>
        ),
        }} />
      <Stack.Screen name="Budget" component={BudgetScreen} options={{ 
        title: 'Our Budget Plan',
        headerStyle: {
          backgroundColor: Colors.borderColor,
        },
        headerTintColor: 'white',
        headerRight: () => (
          <TouchableOpacity
            style = {{height: 100, marginTop: -5}}
            onPress={() => alert('This is a button!')}  
          >
            <Text style = {{fontSize:30}}>...</Text>
          </TouchableOpacity>
        ),
        }} />

      <Stack.Screen name="Days" component={DaysScreen} options={{ 
        title: 'Our Days Matter',
        headerStyle: {
          backgroundColor: Colors.borderColor,
        },
        headerTintColor: 'white',
        headerRight: () => (
          <DayModal mode='create' day={dummyData} index={-1} triggerModal={()=>{}} navigation={null}/>
        ),
        }} />

      <Stack.Screen name="DayDetail" component={DayDetailScreen} options={{ 
        title: 'Day Detail',
        headerStyle: {
          backgroundColor: Colors.borderColor,
        },
        headerTintColor: 'white',
        // headerRight: () => (
        //   // <DayModal mode='edit' day={dummyData} visible={false}/>
        //   // <TouchableOpacity
        //   //   style = {{height: 100, marginTop:15}}
        //   //   onPress={() => alert('This is a button!')}  
        //   // >
        //   //   <Text style = {{fontSize:15,color:"white", alignSelf:'center'}}>Edit</Text>
        //   // </TouchableOpacity>
        // ),
        }} />
        
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      // screenOptions={{
      //   tabBarActiveTintColor: Colors[colorScheme].tint,
      // }}
      
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'TabOne') {
            iconName = focused
              ? 'people-circle'
              : 'people-circle-outline';
          } else if (route.name === 'TabTwo') {
            iconName = focused ? 'heart-circle' : 'heart-circle-outline';
          } else {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'pink',
        tabBarInactiveTintColor: 'gray',
      })}
      >
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'We',
          headerShown: false,
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: 'Tab Two',
          headerShown: false,
          // tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabThree"
        component={TabThreeScreen}
        options={{
          title: 'Me',
          headerShown: false,
          // tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}
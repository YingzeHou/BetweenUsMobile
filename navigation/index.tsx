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
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from '../store';
import CollectionModal from '../components/CollectionModal';
import DayDetailScreen from '../screens/DayDetailScreen';
import DayModal from '../components/DayModal';
import { BudgetBookDetailScreen } from '../screens/BudgetBookDetailScreen';
import BudgetBookModal from '../components/BudgetBookModal';
import BudgetPlanModal from '../components/BudgetPlanModal';

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
  const dummyDayData = {
    id: "0",
    event: "",
    startDate: "",
    category: "",
    address: "",
    pinned: -1
  }

  const dummyBookData = {
    id: "0",
    name: "",
    date: "",
    progress: 0
  }

  const dummyColData = {
    id: "0",
    title: "",
    desc: ""
  }
  return (
    <Stack.Navigator>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="Collection" component={CollectionScreen} options={{
        title: 'Our Collections',
        headerStyle: {
          backgroundColor: Colors.borderColor,
        },
        headerTintColor: 'white',
        headerRight: () => (
          <CollectionModal mode='create' collection={dummyColData} index={-1} triggerModal={() => { }} navigation={null} other={null} />
        ),
      }} />
      <Stack.Screen name="Note" component={NoteScreen} options={{
        title: 'Todos',
        headerStyle: {
          backgroundColor: Colors.borderColor,
        },
        headerTintColor: 'white',
      }} />
      <Stack.Screen name="Budget" component={BudgetScreen} options={{
        title: 'Our Budget',
        headerStyle: {
          backgroundColor: Colors.borderColor,
        },
        headerTintColor: 'white',
        headerRight: () => (
          <BudgetBookModal mode='create' book={dummyBookData} index={-1} triggerModal={() => { }} navigation={null} />
        ),
      }} />

      <Stack.Screen 
        name="BudgetBookDetail" 
        component={BudgetBookDetailScreen} 
        options = {({route}) => ({
          title: 'Budget Detail',
          headerStyle: {
            backgroundColor: Colors.borderColor,
          },
          headerTintColor: 'white',
          headerRight: () => (
            <BudgetPlanModal mode='create' triggerModal={()=>{}} parentId = {route.params?.parentId}/>
          )
        })}
      />

      <Stack.Screen name="Days" component={DaysScreen} options={{
        title: 'Our Days',
        headerStyle: {
          backgroundColor: Colors.borderColor,
        },
        headerTintColor: 'white',
        headerRight: () => (
          <DayModal mode='create' day={dummyDayData} index={-1} triggerModal={() => { }} navigation={null} />
        ),
      }} />

      <Stack.Screen name="DayDetail" component={DayDetailScreen} options={{
        title: 'Day Detail',
        headerStyle: {
          backgroundColor: Colors.borderColor,
        },
        headerTintColor: 'white',
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
      {/* <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: 'Tab Two',
          headerShown: false,
          // tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      /> */}
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
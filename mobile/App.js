

import React, { useState, useEffect, useRef } from 'react';
import Slider from '@react-native-community/slider';
import Journals from './pages/Journals'
import Journal from './pages/Journal'
import Record from './pages/Record'
import Note from './pages/Note'
import Settings from './pages/Settings'
import CalendarComponent from './pages/Calendar'
import Day from './pages/Date'

import { MenuProvider } from 'react-native-popup-menu';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import configureStore  from './redux/configureStore'
import  AsyncStorage  from '@react-native-async-storage/async-storage'
import { Linking } from 'react-native';
import {
  SafeAreaView, Dimensions,
  ScrollView,BackHandler,
  StatusBar,TouchableOpacity,
  StyleSheet,
  Text,
  useColorScheme,
  View, Button
} from 'react-native';
import Modal from 'react-native-modal';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/FontAwesome';
import IconS from 'react-native-vector-icons/SimpleLineIcons';
import Introduction from './pages/Introduction'

const screenWidth = Dimensions.get('screen').width;
const {store, persistor} = configureStore();




const App = () => {
  const [firstTimeInfo, setFirstTime] = useState(false);
  const [loaded, setLoaded] = useState(false)
  const [status, setStatus] = useState(false)
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const Stack = createStackNavigator();
  const subscriber = store.getState().appR.subscriber

  useEffect(() => {
    AsyncStorage.getItem('firstTime') 
      .then(firstTime => {
          if(firstTime == null || firstTime == 'true' ) { // first time 
           setFirstTime(true)
            AsyncStorage.setItem('firstTime', 'true')
              setLoaded(true)
          } else if(firstTime != null || firstTime != 'true') {
             setFirstTime(false)
              setLoaded(true)           
          } })
   }, []);

   useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!hasReviewed) {
        setIsReviewModalVisible(true);
        return true;
      } else {
        return false;
      }
    });

    return () => backHandler.remove();
  }, [hasReviewed]);

  const handleReviewAction = (shouldReview) => {
    setIsReviewModalVisible(false);
    if (shouldReview) {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.voicejournal');
      setHasReviewed(true);
      AsyncStorage.setItem('hasReviewed', 'true');
    } else {
      BackHandler.exitApp();
    }
  };

  useEffect(() => {
    const getReviewStatus = async () => {
      const hasReviewedStr = await AsyncStorage.getItem('hasReviewed');
      if (hasReviewedStr === 'true') {
        setHasReviewed(true);
      }
    };
    getReviewStatus();
  }, []);





  const Menu = () => {
    return(
    <Stack.Navigator screenOptions={{
      headerShown: false
    }} 
  
  >
  <Stack.Screen name="Journals" component={Journals} />
  <Stack.Screen name="Note" component={Note} />
  <Stack.Screen name="Day" component={Day} />
  <Stack.Screen name="Settings" component={Settings} />
  <Stack.Screen name="Calendar" component={CalendarComponent} />
  <Stack.Screen name="Journal" component={Journal} />
  </Stack.Navigator>)
  }


    const Tab = createBottomTabNavigator();
    const MyTabNavigator = () => {
      return(

        <Tab.Navigator 
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home' ) {
              iconName =  'notebook'

            } 
          //   else if (route.name === 'User') {
          //     iconName = 'badge'

          // } 
          else if (route.name === 'Record') {
            iconName = 'microphone'
          }

            return <IconS name={iconName} size={27} color={color} />
          },
           headerShown: false,
            tabBarActiveTintColor: '#866c5e',
          tabBarInactiveTintColor: '#a9a8a7',
          tabBarShowLabel: false,

        })}
        >
          <Tab.Screen name="Home" component={Menu}  />
         <Tab.Screen name="Record" component={Record}/>
     {/* {status == 'not subscriber' ? <Tab.Screen name="User"  children={() => <UserPage setStatus={setStatus} />} /> : null 
    }  */}
        </Tab.Navigator>
      )
    }


    return (
      <NavigationContainer>
        <MenuProvider>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      {!loaded? 
null :
 firstTimeInfo ?
 <Introduction setFirstTimeFunc={setFirstTime} /> 
 :<MyTabNavigator /> }

      </PersistGate>
         </Provider>
         </MenuProvider>
          </NavigationContainer>
    );
  };

  const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#975e47',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    buttonText: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

export default App;

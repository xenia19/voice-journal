import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, Switch, Text, Image,  Dimensions, View, Button, Appearance,NativeModules,
TextInput, ScrollView, SafeAreaView, PermissionsAndroid, FlatList, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconI from 'react-native-vector-icons/FontAwesome';
import record from '../images/recordc.png'
import edit from '../images/editc.png'
import yoga from '../images/notebook.jpg'


import add from '../images/addc.png'
import calendar from '../images/firstc.png'
import secure from '../images/secure.png'

import { SwiperFlatList } from 'react-native-swiper-flatlist'


import {connect} from 'react-redux'
import {setIn} from '../redux/setIn'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Introduction = (props) => {


const colorScheme = Appearance.getColorScheme();
const height_app = Dimensions.get('window').height
const [paused, setPaused] = useState(false)
const [id, setId] = useState(0)
const swiper = useRef(0)
const locale = NativeModules.I18nManager.localeIdentifier  
const start = () => {
AsyncStorage.setItem('firstTime', 'false')
props.setFirstTimeFunc(false)
}





  return (

   
    <View style={colorScheme == 'dark' ? styles.backgr : styles.backgr}>
     
<View style={{flex: 1}}>
   <SwiperFlatList  ref={swiper} index={0} showPagination 
   paginationStyleItemActive={{backgroundColor: '#e6a9ac'}}
   paginationStyleItemInactive={{backgroundColor: '#d0d3d7'}}
   >
   <View>
    <TouchableOpacity onPress={()=>start()} 
style={{alignItems: 'flex-end', marginVertical: 5, marginRight: 15}}>
   <Icon name='close-circle-outline' size={30} color='#fe7476' /></TouchableOpacity>
      <View style={[styles.child]}>
      <Image source={yoga} style={{width: 350, height: height_app*0.6, borderRadius: 20}} />

      <View style={{ justifyContent: 'center', height: height_app*0.3}}><Text style={styles.text}>
      Transform your audio notes into written text with our easy-to-use app.
       </Text>
       <View style={{alignSelf: 'center'}}><TouchableOpacity
    onPress={()=>swiper.current.scrollToIndex({index: 1, animated: true})}  
    style={{backgroundColor: '#ff7576', paddingHorizontal: 20, borderRadius: 10,  height: 50, justifyContent:
     'center', alignItems: 'center', marginTop: 10 }}><Text style={{color: '#fff', fontSize: 17}}>How does it work?</Text>
    </TouchableOpacity></View>
    </View>
    

  </View>
</View>



<View style={[styles.child] }>
      <Image source={record} style={{width:Dimensions.get('window').width, height: height_app*0.7, borderRadius: 10 }} />
  <View style={{justifyContent: 'center', height: height_app*0.2}}>
    <Text style={[styles.text, {marginTop: 30}]}>Simply press the microphone button to start recording your notes.</Text>
    <Text style={[styles.text, {marginTop: 10}]}>Your audio notes will be converted into text, making it easy to read, edit and share with others. 
 </Text>
    </View>
</View>

<View style={[styles.child] }>
      <Image source={edit} style={{width:Dimensions.get('window').width, height: height_app*0.7, borderRadius: 10 }} />
  <View style={{justifyContent: 'center', height: height_app*0.2}}>
  
    <Text style={[styles.text, {marginTop: 5}]}>Plus, with the ability to print your entries, you can have a physical copy of your memories to keep forever.</Text>
    </View>
</View>

      <View style={[styles.child] }>
      <Image source={add} style={{width:Dimensions.get('window').width, height: height_app*0.7, borderRadius: 10 }} />
  <View style={{justifyContent: 'center', height: height_app*0.2}}>
    <Text style={[styles.text, {marginTop: 30}]}>You can easily create multiple diaries for different purposes, whether it's for personal reflection, work notes, or even a travel journal.</Text>
    </View>
</View>



<View style={[styles.child] }>
      <Image source={calendar} style={{width:Dimensions.get('window').width, height: height_app*0.7, borderRadius: 10 }} />
  <View style={{justifyContent: 'center', height: height_app*0.2}}>
    <Text style={[styles.text, {marginTop: 30}]}>Use the calendar to keep track of the notes you made on different days.</Text>
    </View></View>


  <View style={[styles.child] }>
      <Image source={secure} style={{width:Dimensions.get('window').width, height: height_app*0.7, borderRadius: 10 }} />
  <View style={{justifyContent: 'center'}}>
    <Text style={[styles.text, {marginTop: 10}]}>All your recordings are stored only on your device, ensuring complete privacy and security when using our app.</Text>
    </View>
    
     <TouchableOpacity onPress={()=> start()} 
    style={{backgroundColor: '#ff7576', marginTop: 20, paddingHorizontal: 70, borderRadius: 10, height: 40, justifyContent: 'center'}}>
    <Text style={{color: '#fff', fontSize: 17}}>Begin</Text></TouchableOpacity>
</View>
    </SwiperFlatList></View>

</View> 

  )
};



  const styles = StyleSheet.create({

    backgr: {
      backgroundColor: 'white', flex: 1,
    }, 
  container: {  backgroundColor: 'white' },
  child: {alignItems: 'center',
  width: Dimensions.get('window').width },

    instruction: {
    backgroundColor: '#fff', marginHorizontal: 30,
    marginTop: 15, alignSelf: 'center', padding: 20,
    borderRadius: 20, marginBottom: 10,

    },

  block: {
    position: 'relative',
    backgroundColor: '#fff',
    top: 0

  },

  line: {
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
     marginLeft: 20

  },
  text:
{fontSize: 17, color: 'black', textAlign: 'center', marginBottom: 10,  paddingHorizontal: 30,
width: Dimensions.get('window').width}
  ,

  textIt:
  {fontSize: 17, color: 'black', textAlign: 'center', marginBottom: 10,  paddingHorizontal: 30,fontStyle: 'italic',
  width: Dimensions.get('window').width},

  micro: {alignSelf: 'center', alignItems:'center', justifyContent:'center', marginHorizontal: 5,
  backgroundColor: '#253263', height: 60, width: 60,  borderRadius: 30, marginBottom: 10},

  button: {
  backgroundColor: '#fe9594',
  borderRadius: 30,
  marginHorizontal: 70,
  marginTop: 20

 },
 buttonText: {
  fontSize: 16, fontWeight: 'bold',  color: '#fff', paddingVertical: 10,
   textAlign: 'center'
}


});

 const mapStateToProps = (state) => {
  const { appR } = state
  return {appR}
}

export default connect(mapStateToProps)(Introduction)
import React, {useState, Component, useRef, useEffect } from 'react';
import {connect} from 'react-redux'

import IconI from 'react-native-vector-icons/Ionicons';
import {
  View,Switch,
  Text, FlatList, Button,
  StyleSheet,
  Image, Dimensions, TextInput, ScrollView,

  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import IconEvil from 'react-native-vector-icons/FontAwesome'

import diary2 from '../images/diary2.png'
import diary3 from '../images/diary3.png'
import diary4 from '../images/diary4.png'
import diary5 from '../images/diary5.png'
import diary6 from '../images/diary6.png'
import diary7 from '../images/diary7.png'
import diary8 from '../images/diary8.png'
import diary9 from '../images/diary9.png'
import moment from 'moment'
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob'
import Slider from '@react-native-community/slider';
//import {storage} from './storage'
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import {deleteJournal} from '../redux/delete'
import {deleteNotesfromArr} from '../redux/deleteNotesfromArr'
import {setJournalArr} from '../redux/setJournalArr'
import {setNotesArr} from '../redux/setNotesArr'
import DateTimePicker from '@react-native-community/datetimepicker';
import {setNotificationTime} from '../redux/setNotificationTime'


import premium from '../images/prem.png'

const journalCover = [{image: diary2, key: 0}, {image: diary3, key: 1}, {image: diary4, key: 2},
  {image: diary5, key: 3}, {image: diary6, key: 4}, {image: diary7, key: 5}, {image: diary8, key: 6}, 
  {image: diary9, key: 7}]

const Settings = ({ route, navigation, appR, dispatch  }) => {
      
    const [journalName, setJournalName] = useState()
    const [cover, setCover] = useState()
    const jName =  route.params.jNameParam 
    const coverPrev = route.params.cover ? route.params.cover : diary9
    const [vis, setVis] = useState(false)
    const [borderedImage, setBorderedImage] = useState(borderedImage)
    const journalArr = appR.journalArr
    const notesArr = appR.notesArr
    const [needed, setNeeded] = useState([])
    const [stringPdf, setStringPdf] = useState()
    const notification_time = appR.notification_time
    const [isEnabled, setIsEnabled] = useState();
    const [open, setOpen] = useState(false);
   
    const [dateTime, setDateTime] = useState(new Date())
    const [not_time, setNot_time] = useState()
    const [notificationStatus, setNotificationStatus] = useState(false)
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24)
    const [status, setStatus] = useState();
    const [modalPremiumVisible, setModalPremiumVisible] = useState(false)
    const subscriber = true




//  const cancel = () => {
//     notifee.cancelTriggerNotification(jName)
//     }

//     const toggleSwitch = () => {
//       setIsEnabled(previousState => !previousState)
//       if(!isEnabled) {
//         setNotificationStatus(false)
//         cancel()
//       }
//     }

    // useEffect(() => {
    //   const filteredArr = journalArr.filter(el => el.jName == jName )
    //   const notification_status = filteredArr[0].notification
    //   setNotificationStatus(notification_status)
    //   if(notification_status) {
    //     setIsEnabled(true)
    //   }
    //  }, [])
  

  //    useEffect(() => {

      
  //     const rN = Math.floor(Math.random() * 100000)
  //     if(isEnabled ){
  //       if(!notificationStatus){
  //         setOpen(true)
  //       }
       
  //     } 
  //     else if(isEnabled && notificationStatus){
  //     } else if(isEnabled == false) {
  
  //       cancel()
  //      setNotificationStatus(false)
  //       if(journalArr.length == 1) {
  //         const newarr = [{jName: jName, image: coverPrev, key: rN, notification: false}]
  //         dispatch(setJournalArr(newarr))     
  //       } else {
  //         let idFordeleteFav = journalArr.map(function(el) {return el['jName']}).indexOf(jName)
  //         journalArr[idFordeleteFav] = {jName: jName, image: coverPrev, key: rN, notification: false}
  //         dispatch(setJournalArr(journalArr))
  //       }
  //     }
  //  }, [isEnabled])


    const onDeleteJournal = () => {

      let idFordeleteFav = journalArr.map(function(el) {return el['jName']}).indexOf(jName)
   
      if(notesArr.length) {
        let idFordeleteFromJournalArr = notesArr.map(function(el) {return el['jName']}).indexOf(jName)
        dispatch(deleteNotesfromArr(idFordeleteFromJournalArr))
     
      }
     
   
     dispatch(deleteJournal(idFordeleteFav))  
     setVis(false)
      // navigation.navigate('Journals')
      navigation.navigate('Journals', {jName: jName})
    }

    const changeJournal = () => {
      const rN = Math.floor(Math.random() * 100000);
      const jourName = journalName ? journalName : jName; // Новое имя журнала
      const coverUpdated = cover ? cover : coverPrev; // Обновлённая обложка
    
      // Находим индекс журнала, который нужно изменить
      const idFordeleteFav = journalArr.findIndex((el) => el.jName === jName);
    
      if (idFordeleteFav !== -1) {
        // Обновляем журнал в journalArr
        journalArr[idFordeleteFav] = {
          ...journalArr[idFordeleteFav],
          jName: jourName,
          image: coverUpdated,
          key: rN, // Новый уникальный ключ
        };
    
        // Обновляем заметки в notesArr, связанные с данным журналом
        const updatedNotesArr = notesArr.map((note) =>
          note.journalName === jName ? { ...note, journalName: jourName } : note
        );
    
        // Диспатчим обновлённые массивы
        dispatch(setJournalArr(journalArr));
        dispatch(setNotesArr(updatedNotesArr));
    
        // Переход на страницу с новым именем журнала
        navigation.navigate('Journal', { jName: jourName });
      } else {
        console.error('Journal not found for updating.');
      }
    };
    

    
  const onSetCover = (el, i) => {
    setCover(el)
    setBorderedImage(i)
  }

  // const onChange = async(event, selectedDate) => {
  //   notifee.cancelTriggerNotification("My notes")

  //   const rN = Math.floor(Math.random() * 100000)
  //   const channelId = await notifee.createChannel({
  //     id: jName,
  //     name: jName,
  //   });
  
  //     if (Platform.OS === 'android') {
  //       setOpen(false);
   
  //     }
  //     if (event.type === 'dismissed') {
        
  //      setNot_time(null)
  //      dispatch(setNotificationTime(null))
  //     } else {
        
  //       setNot_time(selectedDate);
  //       const datedSelectedDate = new Date(selectedDate)
  //       dispatch(setNotificationTime(datedSelectedDate))
    
    
  //       const hours = selectedDate ? moment(selectedDate).format('HH') : null
  //       const min = selectedDate ? moment(selectedDate).format('mm') : null
    
  //       const date = future
  //     // const date = new Date(Date.now());
   
  //              date.setHours(hours);
  //              date.setMinutes(min);
              
  //           const timeToPass = hours + ':' + min

  //           setNotificationStatus(timeToPass)
     
  //              if(journalArr.length == 1) {
  //               const newarr = [{jName: jName, image: coverPrev, key: rN, notification: hours + ':' + min}]
  //               dispatch(setJournalArr(newarr))     
                
  //             } else {
  //               let idFordeleteFav = journalArr.map(function(el) {return el['jName']}).indexOf(jName)
  //               journalArr[idFordeleteFav] = {jName: jName, image: coverPrev, key: rN, notification: hours + ':' + min}
  //               dispatch(setJournalArr(journalArr))
  //             }   
  
  //     const trigger: TimestampTrigger = {
  //       type: TriggerType.TIMESTAMP,
  //       timestamp: date.getTime(),
  //     repeatFrequency: RepeatFrequency.DAILY,
  //       alarmManager: {
  //         allowWhileIdle: true,
  //       },
  //     };
  
  //   await notifee.createTriggerNotification(
  //     {
  //       id: jName,
  //       title: jName,
  //       body: 'Record a note',
     
  //       android: {
  //         channelId,
  //          pressAction: {
  //   launchActivity: "default",
  //   id: jName,
  // }}},
  //     trigger,)
    
  //   }}

    return (
      
<View style={{ backgroundColor: '#fce4d3', flex: 1}}>
<View style={{flexDirection: 'row', marginLeft: 15, marginTop: 15, marginBottom: 20}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
      <IconI name="arrow-back" style={{marginRight: 20}} size={25} color="#805f4c" /></TouchableOpacity>
    
      
      </View>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
       {/* {notificationStatus  ?  
       
       <Text style={{marginLeft: 19, marginBottom: 10, fontWeight: 'bold' ,  fontSize: 16, marginTop: 5, marginRight: 10}}>Notification at {notificationStatus}</Text>
       :<Text style={{marginLeft: 19, marginBottom: 10, fontWeight: 'bold' , fontSize: 16, marginTop: 5, marginRight: 10}}>Notification</Text>}    */}
       {/* <View style={{marginLeft: 0}}>
          <Switch
        trackColor={{false: '#c4b3a6', true: '#c4b3a6'}}
        thumbColor={isEnabled ? '#965e46' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      /></View> */}
          </View>
{/* <Text style={{marginLeft: 19, marginBottom: 10, fontWeight: 'bold' , fontSize: 16, marginTop: 5, color: '#805f4c'}}>Change the name of the journal</Text>
<TextInput
        style={{  backgroundColor: '#ecd8c8', borderRadius: 10,  paddingLeft: 15, alignSelf:'center',width: '90%',height: 45, color: '#805f4c'}}
        onChangeText={text => setJournalName(text)}
        value={journalName}
        placeholder={''}
        placeholderTextColor={'#836a58'}
        maxLength={20}
      /> */}

<Text style={{marginLeft: 19, marginBottom: 10, fontWeight: 'bold' , fontSize: 16, marginTop: 20, color: '#805f4c'}}>Change cover</Text>
<SwiperFlatList style={{marginBottom: 20, marginHorizontal: 20 }}
        data={journalCover} snapToInterval={10}
        renderItem={({ item}) => (
          <View>
          <TouchableOpacity key={item.key} onPress={()=>onSetCover(item.image, item.key)}>
           <Image opacity={item.key == borderedImage ? 1:  0.76} source={item.image} style={{height: 180, width: 140}} />
            </TouchableOpacity></View>
        )}
      />
      <TouchableOpacity onPress={()=>changeJournal()} 
      style={{backgroundColor: '#836a58', borderRadius: 10, 
      alignSelf:'center', width: '85%',height: 45,justifyContent:'center',
      paddingVertical: 10, marginBottom: 15}}>
        <Text style={{fontWeight: 'bold', textAlign: 'center', color: '#fff', fontSize: 15}}>Update</Text></TouchableOpacity>

        <TouchableOpacity onPress={()=>setVis(true)} 
      style={{backgroundColor: '#939392', borderRadius: 10, 
      alignSelf:'center', width: '85%',height: 45,justifyContent:'center',
      paddingVertical: 10, marginBottom: 10}}>
        <Text style={{fontWeight: 'bold', textAlign: 'center', color: '#fff', fontSize: 15}}>Delete this journal</Text></TouchableOpacity>
</View>

<Modal style={{marginVertical: 20}} isVisible={vis}><View style={{height: '30%', backgroundColor: '#fce4d3', borderRadius: 20, paddingHorizontal: 20, alignItems:'center' ,justifyContent: 'center'}}>
        <Text style={{marginTop: 10, fontSize: 16,  color: '#805f4c'}}>You're going to delete the journal "{jName}" with all your notes.</Text>
        <Text style={{marginTop: 20, fontSize: 16,  color: '#805f4c'}}>Are you sure?</Text>
        
        <View style={{flexDirection: 'row', justifyContent:'center', marginTop: 20 }}>
        <TouchableOpacity onPress={()=>onDeleteJournal()} style={{backgroundColor: '#866c5e', borderRadius: 10,  marginRight: 20,
      alignItems:'center', width: 100, justifyContent:'center', padding: 10}}><Text style={{color: '#fff', fontSize: 16}}>Delete</Text></TouchableOpacity>

        <TouchableOpacity style={{backgroundColor: '#939392', borderRadius: 10, 
      alignItems:'center',width: 100, justifyContent:'center', padding: 10}} onPress={()=>setVis(false)}><Text style={{color: '#fff', fontSize: 16}}>No</Text></TouchableOpacity>
        </View>
        </View>
        </Modal>

        {/* {open && 
        <DateTimePicker
          testID="dateTimePicker"
          value={notification_time==null ? dateTime : new Date(notification_time)}
          mode='time'
          is24Hour={true}
          display="clock"
         onChange={onChange}
        />
} */}



        </View>
      )}
      
        
const mapStateToProps = (state) => {
    const { appR } = state
    return {appR}
  }
  
  export default connect(mapStateToProps)(Settings)
  
  const styles = StyleSheet.create({
  
  });
  
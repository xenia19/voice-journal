import React, {useState, Component, useEffect, createRef } from 'react';
import {connect} from 'react-redux'
import {
  View,
  Text,
  StyleSheet, FlatList, Button,
  Image, Dimensions, TextInput, ScrollView,

  TouchableOpacity,
} from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import RNFetchBlob from 'rn-fetch-blob'
import diary from '../images/diary2.png'
import travel from '../images/diary2.png'
import Modal from 'react-native-modal';
import IconI from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import {setJournalArr} from '../redux/setJournalArr'
import {setSubscriber} from '../redux/setSubscriber'
import  AsyncStorage  from '@react-native-async-storage/async-storage'
import Slider from '@react-native-community/slider';
import diary2 from '../images/diary2.png'
import diary3 from '../images/diary3.png'
import diary4 from '../images/diary4.png'
import diary5 from '../images/diary5.png'
import diary6 from '../images/diary6.png'
import diary7 from '../images/diary7.png'
import diary8 from '../images/diary8.png'
import diary9 from '../images/diary9.png'
import no from '../images/no.png'
import CalendarComponent from './Calendar'

const dirs = RNFetchBlob.fs.dirs;
const papka = dirs.MusicDir + '/Diary';
    RNFetchBlob.fs
      .mkdir(papka)
      .catch(err => {
        console.log(err);
      });



const Journals = ({ navigation, appR, dispatch}) => {


  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false)
  const [journalName, setJournalName] = useState()
  const [active, setActive] = useState(false)
  const [jourName, setJourName] = useState()

  const [notesActivate, setNotesActivate] = useState(false)
  const [cover, setCover]= useState(diary5)
  const [changeName, setChangeName] = useState(false)
  const notesArr = appR.notesArr
 // const onlyNotes = appR.allNotes

  const journalArr = appR.journalArr

 // const allNotes = appR.allNotes
 const [journalNotesArr, setJournalNotesArr] = useState([])
  const [alljournalNotesArr, setallJournalNotesArr] = useState()
  const [journalNameBorder, setJournalNameBorder] = useState(0)
  const [showStyle, setShowStyle] = useState(true)
  const [borderedImage, setBorderedImage] = useState()
  const [noNotes, setNoNotes] = useState(false)
  const [notesActive, setNotesActive] = useState(false)
  const [journalEmpty, setJournalEmpty] = useState()
  const swiper = React.createRef()
  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height


 // const jName = storage.getString('jName')
  const journalCover = [{image: diary2, key: 0}, {image: diary3, key: 1}, {image: diary4, key: 2},
    {image: diary5, key: 3}, {image: diary6, key: 4}, {image: diary7, key: 5}, {image: diary8, key: 6},
    {image: diary9, key: 7}]

  useEffect(() => {

    const unsubscribe = navigation.addListener('focus', () => {
      setJournalNameBorder(0)
     // setallJournalNotesArr(onlyNotes)
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;

    if(journalArr && journalArr.length) {
      setActive(true)
    } else {
      setActive(false)
    }
  }, [navigation, appR]);

useEffect(() => {
  if(journalArr && journalArr.length) {
    setActive(true)
  } else {
    setActive(false)
  }
}, [journalArr])

// Remove the listener when you are done
//didFocusSubscription.remove();

useEffect(() => {
  if(journalArr && journalArr.length){
    setActive(true)
  } else {   //нет журналов
    setActive(false)
  }
}, [])


useEffect(() => {

  if(notesArr && notesArr.length) {

    //setNotesActive(true)
    const arrThatWeNeed = notesArr[0].notes


    if(arrThatWeNeed.length) {
      setJournalNotesArr(arrThatWeNeed)
      setJournalEmpty(false)
      setActive(true)

    } else {
      setJournalEmpty(true)
    }


  } else {
    setJournalEmpty(true)
    setJournalNotesArr([])
  }
}, [])

useEffect(() => {
 
  if(notesArr && notesArr.length) {

    const arrThatWeNeed = notesArr[0].notes
    if(arrThatWeNeed.length) {
      setJournalNotesArr(arrThatWeNeed)
      setJournalEmpty(false)
      setActive(true)
    } else {
      setJournalEmpty(true)
    }
  } 
}, [notesArr])



const changeJournal = (clickedJournal, i) => {

  setJournalEmpty(false)
  setShowStyle(false)
  setJourName(clickedJournal)
  setJournalNameBorder(i)
  setNoNotes(false)



  if(notesArr && notesArr.length) {
    const arrThatWeNeed = notesArr.filter(el => {
    if(el) {
      return(
        
        el["journalName"] == clickedJournal
      )
      
    } else {
  
      setNoNotes(true)
      setJournalEmpty(true)
    } 
  })



  if(arrThatWeNeed.length) {
    let needed = arrThatWeNeed[0].notes

    setJournalNotesArr(needed)

  } else { //если нет записей в дневнике
     setNoNotes(true)
     setJournalEmpty(true)
  }} else { //если вообще нет записей
    setNoNotes(true)
  setJournalEmpty(true)
  }
}

const showAll = () => {
  setShowStyle(true)
  setJournalNameBorder(null)
//  setJournalNotesArr(allNotes)
}




  const addNewJournal = () => {
    if(journalName && journalName.length) {
      const rN = Math.floor(Math.random() * 100000)
      setChangeName(false)
      if(journalArr) {
       let filtered  = journalArr.filter(el => {
        return (
          el.jName == journalName
        )
       })
  
       if(filtered.length) {
        setChangeName(true)
       } else {
        let newArr= [...journalArr, {jName: journalName, image: cover, key: rN, notification: false}]
        dispatch(setJournalArr(newArr))
        setModalVisible(false)
        if(journalArr.length >= 1) {
          swiper.current.goToLastIndex()
        } 
        setJournalName('')
   
       }
      } 
    } else {
      closeModal()
    }
    

  }

  const onSetCover = (el, i) => {
    setCover(el)
    setBorderedImage(i)
  }

  const closeModal = () => {
    setChangeName(false)
    setModalVisible(false)
    setJournalName('')
  }

  return (
    <View style={{backgroundColor: '#fce4d3', height: '100%', marginBottom: 26, justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', marginTop: 10, marginLeft: 20, alignItems:'center', 
        justifyContent:'space-between', marginRight: 20,marginBottom: 10}}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#805f4c'}}>Your Journals</Text>
        <TouchableOpacity onPress={()=> setModalVisible(true)} style={{backgroundColor: '#ecd8c8', paddingHorizontal: 10, borderRadius: 4,   shadowOpacity: 0.26,
  shadowOffset: { width: 0, height: 2},
  shadowRadius: 30,
  elevation: 3,}}><Text style={{fontSize: 25, fontWeight: 'bold', color: '#805f4c'}}>+</Text></TouchableOpacity>
        </View>


      <View style={{flexDirection: 'row', marginBottom: 10, height: height/2.8}}>
{active ?
        <SwiperFlatList
        
        snapToInterval={20}
        ref={swiper}
        data={journalArr}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.key} onPress={()=>navigation.navigate('Journal', {jName: item.jName, notesArr: notesArr, cover: item.image})}>
            <Image style={{ width: 'auto', height: '100%',
            aspectRatio: 1/1.3 , flex: 1}} source={item.image}/>
            <Text style={{textAlign: 'center', color: '#805f4c'}}>{item.jName}</Text>
            </TouchableOpacity>
        )}
      /> : 
      <View style={{alignItems:  'center', justifyContent: 'center', flex: 1}}>
      <Text style={{fontSize:15, color: '#805f4c'}}>You don't have journals yet</Text>
      <Image source={no} style={{height: 267, width: 300}} /></View>
      }
        </View>
<View style={{backgroundColor: '#fffaf5',  borderRadius: 30, paddingBottom: 12,  marginBottom: 20}}>
 <CalendarComponent navigation={navigation} /> 
</View>

<Modal isVisible={modalVisible}  onBackdropPress={()=>closeModal()}>
        <View style={{ backgroundColor: '#fce4d3', borderRadius: 20, alignContent: "space-between"}} >
 
  <View style={{  marginHorizontal: 10, borderRadius: 20, backgroundColor: '#fce4d3'  }}>

    <View>
  <TouchableOpacity onPress={()=> closeModal()}
   style={{flexDirection: 'row', paddingTop: 10, marginRight: 10, marginBottom: 10, justifyContent: 'flex-end'}}>
    <IconI name={ 'close-outline'} size={25} color='#626b95' /></TouchableOpacity>
{/* <Text style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>Add new journal</Text> */}
<TextInput
        style={{  backgroundColor: '#ecd8c8', borderRadius: 10, color: '#805f4c', paddingLeft: 15, alignSelf:'center',width: '85%',height: 45,}}
        onChangeText={text => setJournalName(text)}
        value={journalName}
        placeholder="Name of your journal"
        placeholderTextColor='#805f4c'
        maxLength={20}
      /></View>
      
      
      <View>
      <Text style={{marginLeft: 19, marginBottom: 10,color: '#805f4c', fontWeight: 'bold' , fontSize: 16, marginTop: 20}}>Choose cover</Text>
      <SwiperFlatList style={{marginBottom: 20 }} snapToInterval={10}
        data={journalCover}
        renderItem={({ item}) => (
          <View>
          <TouchableOpacity key={item.key} onPress={()=>onSetCover(item.image, item.key)}>
           <Image opacity={item.key == borderedImage ? 1:  0.76} source={item.image} style={{height: 180, width: 140}} />
            </TouchableOpacity></View>
        )}
      /></View>

      <View style={{marginBottom: 30}}>
      <TouchableOpacity onPress={()=>addNewJournal()}
      style={{backgroundColor: '#836a58', borderRadius: 10,
      alignSelf:'center', width: '85%',height: 45,justifyContent:'center',
      paddingVertical: 10, marginBottom: 10}}><Text style={{fontWeight: 'bold', textAlign: 'center', color: '#fff', fontSize: 15}}>Add new journal</Text></TouchableOpacity>
        {changeName ? <Text style={{fontSize: 15, textAlign: 'center', marginVertical: 15, color: '#805f4c',}}>You already have a journal with this name</Text>: null}</View></View></View>
         </Modal>

         
    </View>
  );
};

const mapStateToProps = (state) => {
  const { appR } = state
  return {appR}
}

export default connect(mapStateToProps)(Journals)

const styles = StyleSheet.create({

});

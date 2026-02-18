import React, {useState, Component, useEffect, useRef } from 'react';
import IconI from 'react-native-vector-icons/Ionicons';
import IconEvil from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Foundation';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import {Menu,MenuOptions,MenuOption,MenuTrigger} from 'react-native-popup-menu';

import {connect} from 'react-redux'
import {
  View, Share,
  Text,
  StyleSheet,ActivityIndicator,
  Image, Dimensions, TextInput, ScrollView,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import travel from '../images/travel.png'
import Video from 'react-native-video';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Slider from '@react-native-community/slider';
import {setNotesArr} from '../redux/setNotesArr'
import {useFocusEffect} from '@react-navigation/native';
import Modal from 'react-native-modal'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';

import premium from '../images/prem.png'

const audioRecorderPlayer = new AudioRecorderPlayer();

var RNFS = require('react-native-fs');
const screenWidth = Dimensions.get('screen').width;


function pad(n, width, z = 0) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSeconds = (position) => ([
  pad(Math.floor(position / 60), 2),
  pad(position % 60, 2),
]);

const Note = ({ route, navigation, appR, dispatch }) => {


 // const [journalArr, setJournalArr] = useStorage('journalArr', [{jName: 'Morning Pages', image: diary}, {jName: 'Travel Notes', image: travel}]);
  const [modalVisible, setModalVisible] = useState(false)
  const [results, setResults] = useState('')
 
  const { noteTitle,  audio, date, text, jName, key } = route.params;

  const [status, setStatus] = useState();
  const [modalPremiumVisible, setModalPremiumVisible] = useState(false)
  const [currentPositionSec, setCurrentPositionSec] = useState(0)
  const [paused, setPaused] = useState(false)
  const [currentDurationSec, setDurationSec] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pausedIcon, setPausedIcon] = useState(false)
  const [activityIndi, setActivityIndi] = useState(false)
  const [showText, setShowText] = useState(false)
  const [note, setNote] = useState()
  const [selectedPrinter, setSelectedPrinter] = useState()
  const notesArr = appR.notesArr
  const onlyNotes = appR.allNotes
  const subscriber = true

  useEffect(() => {
    if(subscriber) {
      setStatus('permit')
    } else {
      setStatus('not subscriber')
    }
  }, [subscriber])

  useEffect(() => {
    if(subscriber) {
      setStatus('permit')
    } else {
      setStatus('not subscriber')
    }
  }, [])

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          note,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };


useEffect(() => {
  setNote(text)
}, [])

useEffect(() => {
  setNote(text)
}, [text])

useEffect(() => {

  setNote(text)
  function handleBackButton() {
    navigation.navigate('Day', {day: date})
    return true;
  }

  const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

  return () => backHandler.remove();
}, [navigation]);


  const elapsed = minutesAndSeconds(currentPositionSec);
  const remaining = minutesAndSeconds(currentDurationSec - currentPositionSec);
  const curDur = minutesAndSeconds(currentDurationSec)
  const audioRef = useRef()
 const seek = (time) => {

    time = Math.round(time);
  audioRef.current.seek(time)
   setCurrentPositionSec(time)
   setPaused(false)
   setPausedIcon(true)

  }

  const setTime = (data) => {
    let cp = Math.floor(data.currentTime)
    setCurrentPositionSec(cp)
  }

const setDurationFunc = (data) => {
  let cp = Math.floor(data.duration)
  setDurationSec(cp)
}

const playSwitcher = () => {
  if(playing && !paused) {
    setPaused(true)
    setPausedIcon(false)

  } else if( !playing) {
   setPlaying(true)
   setPausedIcon(true)
   //setPaused(true)
  }  else if(playing && paused) {

    setPaused(false)
    setPausedIcon(true)
  }
}

useEffect(() => {

  if(paused) {
    setPausedIcon(false)
  } else {
    setPausedIcon(true)
  }
}, [paused])

useEffect(() =>{
  if(!playing) {
    setPausedIcon(false)
  }
}, [playing])

const onDeleteNote = () => {
  
  // Get the journal object from `notesArr` with the matching `jName`
  const arrJ = notesArr.filter(el => {
    return el.jName === jName;
  });

  // Check if `arrJ` is not empty
  if (!arrJ.length) {
    return;
  }

  // Get the `notes` array of the journal object
  let notesA = arrJ[0].notes;

  // Find the index of the note to delete based on `key`
  let idForDelete = notesA.map(function(el) {
    return el['key'];
  }).indexOf(key);

  // Check if the note was not found
  if (idForDelete === -1) {
    console.error(`Note with key "${key}" not found in journal "${jName}"`);
    return;
  }

  // Create a new `notes` array without the deleted note
  let newNotesA = [...notesA.slice(0, idForDelete), ...notesA.slice(idForDelete + 1)];

  // Update the `arrJ` object with the new `notes` array
  let updatedArr = {...arrJ[0], notes: newNotesA};
  let updateArr1 = [{...arrJ[0], notes: newNotesA}];

  // Find the index of the journal in `notesArr` based on `jName`
  let idOfArr = notesArr.map(function(el) {
    return el['jName'];
  }).indexOf(jName);

  // Check if there's only one journal in `notesArr`
  if (notesArr.length === 1) {
    dispatch(setNotesArr(updateArr1));
    navigation.navigate('Journal', {jName: jName});
  } else {
    // Filter `notesArr` to exclude the journal being updated
    let newBigNotesA = notesArr.filter(el => {
      return el.jName !== jName;
    });
    // Combine the filtered `notesArr` and the updated `arrJ` object
    let lastVersion = [...newBigNotesA, updatedArr];
    dispatch(setNotesArr(lastVersion));
    navigation.navigate('Journal', {jName: jName});
  }
  setModalVisible(false)
};


const onSaveNote = () => {

  const fil = notesArr.filter(el => {
    return el.jName == jName
  })

const filNotes = fil[0] ? fil[0].notes : []  //Записи конкретного журнала
  if(filNotes.length==1) {  //если только 1 запись

    let updatedElement = [{"audio": audio, "date": date, "key": key, "noteTitle": noteTitle, "text": note}]
    const updatedNotesofOneJournal = updatedElement
    let idFordeleteJournal = notesArr.map(function(el) {return el['jName']}).indexOf(jName)
    let newBigArr = [...notesArr.slice(0, idFordeleteJournal), ...notesArr.slice(idFordeleteJournal+1)]
    let updatedArr = {...fil[0], notes: updatedElement}
  let updatedBigArr = [...newBigArr, updatedArr]
  dispatch(setNotesArr(updatedBigArr))

 //если есть записи  в этом журнале
  } else {
    let idFordelete = filNotes.map(function(el) {return el['noteTitle']}).indexOf(noteTitle)
        filNotes[idFordelete].text = note
        let updatedArr = {...fil, notes: filNotes}
        let updatedJournal = updatedArr[0]
        let idFordeleteJournal = notesArr.map(function(el) {return el['jName']}).indexOf(jName)
     
        let newBigArr = [...notesArr.slice(0, idFordeleteJournal), ...notesArr.slice(idFordeleteJournal+1)]
        let updatedBigArr = [...newBigArr, updatedJournal]
        dispatch(setNotesArr(updatedBigArr))
  }
  setShowText(false)
}

const finishEdit = () => {
  setShowText(false)
  onSaveNote()
}

const onEdit = () => {
  setShowText(true)
}

const onPrint = async() => {
 await RNPrint.print({
      html: note
    })
}

 
  return (
    <View style={{backgroundColor: '#f5e3d3', flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent:'space-between', paddingTop: 15, marginLeft: 15, alignItems: 'center', marginBottom: 10}}>
  
       <TouchableOpacity onPress={() => navigation.navigate('Day', {day: date})}>
      <IconI name="arrow-back" style={{marginRight: 20}} size={25} color='#805f4c' /></TouchableOpacity>
      
        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#805f4c'}}>{noteTitle}    {date}</Text>

      <Menu >
      <MenuTrigger customStyles={{
        triggerOuterWrapper: { marginRight: 10}
      }}
      ><IconM name="dots-vertical" style={{marginRight: 20}} color='#805f4c' size={25}/></MenuTrigger>
      <MenuOptions customStyles={{optionsContainer: {backgroundColor: '#fffaf5', paddingVertical:10, borderRadius: 10, width: 'auto', paddingHorizontal: 20}}}>
        <MenuOption onSelect={() => onPrint()}><Text style={{fontSize: 16, marginBottom: 10, color: '#828180'}}>Print</Text></MenuOption>
        <MenuOption onSelect={() => onShare()}><Text style={{fontSize: 16, marginBottom: 10, color: '#828180'}}>Share</Text></MenuOption>
        <MenuOption onSelect={status == 'permit' ? () => setModalVisible(true) : ()=> setModalPremiumVisible(true)}><Text style={{fontSize: 16, color: '#828180'}}>Delete</Text></MenuOption>
       
      </MenuOptions>
    </Menu>
        </View>

      
      
        <ScrollView style={{backgroundColor: '#fffaf5',  borderTopRightRadius: 30, borderTopLeftRadius:30, paddingBottom: 40}}> 
      


        <View style={{flexDirection: 'row', marginLeft: 20, marginTop: 15}}>
        <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', marginRight: 10}} onPress={()=>playSwitcher()}><IconI name= {pausedIcon? 'pause-outline':"play-outline"}  size={29} color="#805f4c"  /></TouchableOpacity>
       <TouchableOpacity style={{marginRight: 10}} onPress={showText? () => finishEdit() : ()=>onEdit()}>
        <IconI name={showText ? 'save-outline':"create-outline"} size={30} color="#805f4c" /></TouchableOpacity>
        
      
        </View>
{playing?  
        <View style={{marginTop: 15, marginHorizontal: 15}}>
      <View style={{ flexDirection: 'row', marginBottom: 7 }}>
        <Text style={styles.text}>
          {elapsed[0] + ":" + elapsed[1]}
        </Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.text}>
        {currentDurationSec > 1 && curDur[0] + ':' + curDur[1]}
        </Text>
      </View>
      <View>
        <Video source={{ uri: audio}} // Can be a URL or a local file.
        ref={audioRef}
       // playInBackground={true}
      //  playWhenInactive={true}
        paused={paused}               // Pauses playback entirely.
        resizeMode="cover"           // Fill the whole screen at aspect ratio.
        //repeat={true}                // Repeat forever.
      // onLoadStart={this.loadStart} // Callback when video starts to load
        onLoad={setDurationFunc}    // Callback when video loads
       onProgress={setTime}    // Callback every ~250ms with currentTime
       onEnd={()=>setPlaying(false)}           // Callback when playback finishes
       />
        <Slider
       maximumValue={Math.max(currentDurationSec, 1, currentPositionSec + 1)}
        onSlidingStart={()=>setPaused(true)}
        onSlidingComplete={seek}
        value={currentPositionSec}
        minimumTrackTintColor='#805f4c'
        thumbTintColor='#805f4c'
        // minimumTrackTintColor='black'
        // maximumTrackTintColor='blue'
        // thumbStyle={styles.thumb}
        // trackStyle={styles.track}
      />
      </View>
    </View>
:null }
    
    <Modal isVisible={modalVisible}><View style={{height: '25%', backgroundColor: '#fce4d3', borderRadius: 20, paddingHorizontal: 20, alignItems:'center' ,justifyContent: 'center'}}>
        <Text style={{marginTop: 10, fontSize: 16, color: '#805f4c'}}>You're going to delete this note.</Text>
        <Text style={{marginTop: 20, fontSize: 16, color: '#805f4c'}}>Are you sure?</Text>
        
        <View style={{flexDirection: 'row', justifyContent:'center', marginTop: 20 }}>
        <TouchableOpacity onPress={ ()=>onDeleteNote()} style={{backgroundColor: '#866c5e', borderRadius: 10,  marginRight: 20,
      alignItems:'center', width: 100, justifyContent:'center', padding: 10}}><Text style={{color: '#fff', fontSize: 16}}>Delete</Text></TouchableOpacity>

        <TouchableOpacity style={{backgroundColor: '#939392', borderRadius: 10, 
      alignItems:'center',width: 100, justifyContent:'center', padding: 10}} onPress={()=>setModalVisible(false)}><Text style={{color: '#fff', fontSize: 16}}>No</Text></TouchableOpacity>
        </View>
        </View>
        </Modal>
    
    {showText ?
    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
       <TextInput
        multiline={true}
       style={{ backgroundColor: '#fff', color:'#808080', marginBottom: 15, width: '90%', color: '#828180',
       borderRadius: 10, padding: 15,  fontSize: 14, alignItems: 'center', fontSize: 16}}
       onChangeText={i => i.length==0 ? setNote("") : setNote(i) }
       value={note}
       placeholder="Title"
       placeholderTextColor='#828180'
     /></View>
    
    : <View style={{marginHorizontal: 20, marginVertical: 20}}><Text style={{fontSize: 16, color: '#828180'}}>{note}</Text></View> 
    }
   


   <Modal isVisible={modalPremiumVisible}>
<View style={{height: '45%', backgroundColor: '#fce4d3', borderRadius: 20, paddingHorizontal: 20, alignItems:'center'}}>
<Image source={premium} style={{height: 50, width: 50, marginTop: 20}} />
        <Text style={{marginTop: 10, fontSize: 16,  color: '#828180'}}>Subscribe to the premium version to delete your notes and covert your audio to text.</Text>
    <TouchableOpacity onPress={()=>navigation.navigate('User')} style={{backgroundColor: '#866c5e', borderRadius: 10, marginTop: 30,
      alignItems:'center',  justifyContent:'center', width: 250, height: 50}}><Text style={{color: '#fff', fontSize: 16}}>View subscription plans</Text></TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: '#939392', borderRadius: 10, marginTop: 10,
      alignItems:'center',justifyContent:'center', width: 250, height: 50}} onPress={()=>setModalPremiumVisible(false)}><Text style={{color: '#fff', fontSize: 16, textAlign: 'center'}}>I don't want to delete my notes</Text></TouchableOpacity>
        </View>
</Modal>

        </ScrollView>
       
       
      
    </View>
  );
}

const mapStateToProps = (state) => {
  const { appR } = state
  return {appR}
}

export default connect(mapStateToProps)(Note)

const styles = StyleSheet.create({
  text: {
    color: '#805f4c'
  }

});

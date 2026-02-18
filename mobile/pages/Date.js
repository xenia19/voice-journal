import React, {useState, Component, useRef, useEffect} from 'react';
import Slider from '@react-native-community/slider';
import {
  View,
  Text,
  StyleSheet,BackHandler,
  Image, Dimensions, TextInput, ScrollView,FlatList,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import IconI from 'react-native-vector-icons/Ionicons';

function pad(n, width, z = 0) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSeconds = (position) => ([
  pad(Math.floor(position / 60), 2),
  pad(position % 60, 2),
]);

const Day = ({appR, route, navigation}) => {

  const [modalVisible, setModalVisible] = useState(false)
  const [journalName, setJournalName] = useState()
  const [currentPositionSec, setCurrentPositionSec] = useState(0)
  const [currentDurationSec, setDurationSec] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [needed, setNeeded] = useState([])
  const [note, setNote] = useState([])
  const [pausedIcon, setPausedIcon] = useState(false)
  const [paused, setPaused] = useState(false)
  const notesArr = appR.notesArr
  const { day } = route.params;
  const elapsed = minutesAndSeconds(currentPositionSec);
  const remaining = minutesAndSeconds(currentDurationSec - currentPositionSec);
  const curDur = minutesAndSeconds(currentDurationSec)
  const audioRef = useRef()
  const exactDay = day.dateString


useEffect(() => {
  
  const notesArrJournal = []
  notesArr.map(el => {
    el.notes.map(i => {
      if(i.date == exactDay) {
        notesArrJournal.push(i)
      }  
    })
  })
 setNote(notesArrJournal)
}, [])

useEffect(() => {
 
  const notesArrJournal = []
  notesArr.map(el => {
    el.notes.map(i => {
      if(i.date == route.params.day) {
        notesArrJournal.push(i)
      }  
    })
  })
 setNote(notesArrJournal)
}, [navigation])

useEffect(() => {
  console.log( 'exact day', exactDay)
  if(exactDay != undefined){
    const notesArrJournal = []
    notesArr.map(el => {
      el.notes.map(i => {
        if(i.date == exactDay) {
          notesArrJournal.push(i)
        }
      })
    })
   setNote(notesArrJournal)
  }
}, [exactDay])

useEffect(() => {
  function handleBackButton() {
    navigation.navigate("Journals")
    return true;
  }
  const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
  return () => backHandler.remove();
}, [navigation]);


const setDurationFunc = (data) => {
  let cp = Math.floor(data.duration)
  setDurationSec(cp)
}

const playSwitcher = (key) => {
  console.log(playing, paused, key)

  if(playing==key && !paused) {
    setPaused(key)
    setPausedIcon(false)
  } else if( !playing) {
   setPlaying(key)
   setPausedIcon(key)
  }  else if(playing==key && paused) {
    setPaused(false)
    setPausedIcon(key)
  } else if(playing!==key) {  //new audio
    setPlaying(key)
    setDurationSec(0)
    setCurrentPositionSec(0)
    setPausedIcon(key)
  }
}
const seek = (time) => {
  time = Math.round(time);
audioRef.current.seek(time)
 setCurrentPositionSec(time)
 setPaused(false)
}

const onEndMusic = () => {
  setPausedIcon(false)
  setPlaying(false)
  setCurrentPositionSec(0)
  setDurationSec(0)
}

const setTime = (data) => {
  let cp = Math.floor(data.currentTime)
  setCurrentPositionSec(cp)
}

  const renderItem = ({item}) => (
    <View key={item.key} style={{marginTop: 20, marginLeft: 20}}>
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <TouchableOpacity onPress={()=>playSwitcher(item.key)}><IconI name= {pausedIcon==item.key? 'pause-outline':"play-outline"}  size={30} color="#805f4c" style={{marginRight: 15}} /></TouchableOpacity>
                            <Text style={{ fontWeight: 'bold', color: "#805f4c"}}>{item.noteTitle}</Text>
                            </View>
                           <View style={{right: 0, position: 'absolute',alignItems: 'center', flexDirection:'row', marginRight: 20}}>
                        
       <TouchableOpacity onPress={()=>navigation.navigate("Note", {noteTitle: item.noteTitle,jName: item.jName, 
        audio: item.audio, date: item.date, text:item.text,  key: item.key})}><IconI name="reader-outline" size={30} color="#805f4c" /></TouchableOpacity></View>
                          
                          
        {playing==item.key?  
        <View style={{marginTop: 15, marginHorizontal: 15}}>
        <Video source={{ uri: item.audio}} // Can be a URL or a local file.
        ref={audioRef}
        paused={paused == item.key}               // Pauses playback entirely.
        resizeMode="cover"           // Fill the whole screen at aspect ratio.
        //repeat={true}                // Repeat forever.
      // onLoadStart={this.loadStart} // Callback when video starts to load
        onLoad={setDurationFunc}    // Callback when video loads
       onProgress={setTime}    // Callback every ~250ms with currentTime
        onEnd={()=>onEndMusic()}           // Callback when playback finishes
       // onError={this.videoError}    // Callback when video cannot be loaded
        style={styles.audioElement} />

        <Slider
       maximumValue={Math.max(currentDurationSec, 1, currentPositionSec)}
     //   onSlidingStart={()=>setPaused(note.key)}
        onSlidingComplete={seek}
        value={currentPositionSec}
        minimumTrackTintColor='#805f4c'
        thumbTintColor='#805f4c'
        // minimumTrackTintColor='black'
        // maximumTrackTintColor='blue'
        // thumbStyle={styles.thumb}
        // trackStyle={styles.track}
      />
   
      <View style={{ flexDirection: 'row', marginBottom: 7 }}>
        <Text style={styles.text}>
          {elapsed[0] + ":" + elapsed[1]}
        </Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.text}>
        {currentDurationSec > 1 && curDur[0] + ':' + curDur[1]}
        </Text>
      </View>
    </View>
:null }
              </View>
  )


  return (
    <View style={{backgroundColor: '#f5e3d3', height: '100%'}}>
        <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 20, 
        justifyContent:'space-between', marginRight: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => navigation.navigate('Journals')}>
      <IconI name="arrow-back" style={{marginRight: 20}} size={25} color="#805f4c" /></TouchableOpacity>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: "#805f4c"}}>{day.dateString ? day.dateString : route.params.day}</Text></View>
        </View>
        <View style={{flexDirection: 'row', marginBottom: 20, marginHorizontal: 10}}>
        </View>
        <View style={{backgroundColor: '#fffaf5', flex:1,  paddingBottom: 40, borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
        
     
   <FlatList
        data={note}
        renderItem={renderItem}
        keyExtractor={item => item.key}
     /> 
        </View>
        </View>
  );
};

const mapStateToProps = (state) => {
  const { appR } = state
  return {appR}
}

export default connect(mapStateToProps)(Day)

const styles = StyleSheet.create({
  text: {
    color: '#805f4c'
  }
});

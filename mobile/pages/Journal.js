import React, {useState, Component, useRef, useEffect } from 'react';
import {connect} from 'react-redux'
import {Menu,MenuOptions,MenuOption,MenuTrigger,} from 'react-native-popup-menu';
import IconI from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,  BackHandler,
  Text, FlatList, Button,ActivityIndicator,
  StyleSheet,
  Image, Dimensions, TextInput, ScrollView,

  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal'
import IconEvil from 'react-native-vector-icons/FontAwesome'
import diary2 from '../images/diary2.png'
import diary3 from '../images/diary3.png'
import diary4 from '../images/diary4.png'
import diary5 from '../images/diary5.png'
import diary6 from '../images/diary6.png'
import diary7 from '../images/diary7.png'
import diary8 from '../images/diary8.png'
import diary9 from '../images/diary9.png'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob'
import Slider from '@react-native-community/slider';
//import {storage} from './storage'
import { SwiperFlatList } from 'react-native-swiper-flatlist';



function pad(n, width, z = 0) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSeconds = (position) => ([
  pad(Math.floor(position / 60), 2),
  pad(position % 60, 2),
]);

const journalCover = [{image: diary2, key: 0}, {image: diary3, key: 1}, {image: diary4, key: 2},
  {image: diary5, key: 3}, {image: diary6, key: 4}, {image: diary7, key: 5}, {image: diary8, key: 6}, 
  {image: diary9, key: 7}]

const dirs = RNFetchBlob.fs.dirs;
const papka = dirs.MusicDir + '/Diary';
    RNFetchBlob.fs
      .mkdir(papka)
      .catch(err => {
        console.log(err);
      });


const Journal = ({ route, navigation, appR, dispatch  }) => {
    const { jName, cover } = route.params;
  // const [journalArr, setJournalArr] = useStorage('journalArr', []);
  const [modalVisible, setModalVisible] = useState(false)
  const [currentPositionSec, setCurrentPositionSec] = useState(0)
  const [paused, setPaused] = useState(false)
  const [currentDurationSec, setDurationSec] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pausedIcon, setPausedIcon] = useState(false)
  const [activityIndi, setActivityIndi] = useState(false)
  const [needed, setNeeded] = useState([])
  const [activated, setActivated] = useState(false)
  const [journalName, setJournalName] = useState()
  const notesArr = appR.notesArr
  const [borderedImage, setBorderedImage] = useState(borderedImage)
  const [vis, setVis] = useState()
  const [filePath, setFilePath] = useState()
  const [modalActive, setModalActive] = useState(false)


  useEffect(() => {

    const arrThatWeNeed = notesArr.filter(el => {
      return(
      el.jName== jName
      )
    })
    
    if(arrThatWeNeed && arrThatWeNeed.length) {
      setNeeded(arrThatWeNeed[0].notes)
      setActivated(true)
     
    } else {
      return
    }  
  }, [])

  useEffect(() => {
    console.log(notesArr, "Notes")
    function handleBackButton() {
      navigation.navigate('Journals')
      return true;
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => backHandler.remove();
  }, [navigation]);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const arrThatWeNeed = notesArr.filter(el => {
        return(
        el.jName== jName
        )
      })
      if(arrThatWeNeed.length && arrThatWeNeed[0].notes && arrThatWeNeed[0].notes.length) {
        setNeeded(arrThatWeNeed[0].notes)
        setActivated(true)
      } else {
        setNeeded([])
        setActivated(false)
      }  
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, appR, jName]);

  
  const elapsed = minutesAndSeconds(currentPositionSec);
  const remaining = minutesAndSeconds(currentDurationSec - currentPositionSec);
  const curDur = minutesAndSeconds(currentDurationSec)
  const audioRef = useRef()
  const audio =''

 const seek = (time) => {

    time = Math.round(time);
    audioRef.current.seek(time)
   setCurrentPositionSec(time)
   setPaused(false)
  // setPausedIcon(true)
  }

  const allNotesToPdf = () => {
    setModalActive(true)
    const arrThatWeNeed = notesArr.filter(el => {
      return(
      el.jName == jName
      )
    })
    if(arrThatWeNeed.length && arrThatWeNeed[0].notes && arrThatWeNeed[0].notes.length) {
      let allNotesArr = arrThatWeNeed[0].notes
      let onlyNotesArr = allNotesArr.map(el => {
        return `<div>
        <h3>${el.noteTitle} -&nbsp;${el.date}&nbsp;</h3>
        <p>${el.text}</p>
        <br /><br /></div>`
      })
      let stringToProcess = onlyNotesArr.join(' ')
    // setStringPdf(stringToProcess)
     createPDF(stringToProcess)
  //  onPrint(stringToProcess)
    } else {
       return
    } 
  }

  const createPDF = async(stringToProcess) => {
    
    let options = {
      html: stringToProcess,
      fileName: jName,
      directory: 'Documents',
    };

    let file = await RNHTMLtoPDF.convert(options)

    setFilePath(file.filePath)
    onShare(file.filePath)
   
  }

  const onPrint = async() => {
    setModalActive(true)
    const arrThatWeNeed = notesArr.filter(el => {
      return(
      el.jName == jName
      )
    })
    if(arrThatWeNeed.length && arrThatWeNeed[0].notes && arrThatWeNeed[0].notes.length) {
      let allNotesArr = arrThatWeNeed[0].notes
      let onlyNotesArr = allNotesArr.map(el => {
        return `<div>
        <h3>${el.noteTitle} -&nbsp;${el.date}&nbsp;</h3>
        <p>${el.text}</p>
        <br /><br /></div>`
      })
      let stringToProcess = onlyNotesArr.join(' ')
      

    await RNPrint.print({
         html: stringToProcess
       })

       setModalActive(false)
   }
  }

   const onShare =  (filePath) => {
    setModalActive(false)
    Share.open({
     
    //  message: "Message:",
      url: `file://${filePath}`,
    //  subject: "Report",
  })
  .catch((err) => {
    err && console.log(err)
  })

  };

  const setTime = (data) => {
    let cp = Math.floor(data.currentTime)
    setCurrentPositionSec(cp)
  }

const setDurationFunc = (data) => {
  let cp = Math.floor(data.duration)
  setDurationSec(cp)
}

  const playSwitcher = (key) => {
  
    if(playing==key && !paused) {
      setPaused(key)
      setPausedIcon(false)
  
    } else if( !playing) {
     setPlaying(key)
     setPausedIcon(key)
     //setPaused(true)
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
  
  const onEndMusic = () => {
    setPausedIcon(false)
    setPlaying(false)
    setCurrentPositionSec(0)
    setDurationSec(0)
  }


  const renderItem = ({item}) => (
    <View key={item.key} style={{marginTop: 20, marginLeft: 20}}>
  
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <TouchableOpacity onPress={()=>playSwitcher(item.key)}><IconI name= {pausedIcon==item.key? 'pause-outline':"play-outline"}  size={30} color="#805f4c" style={{marginRight: 15}} /></TouchableOpacity>
                            <Text style={{ fontWeight: 'bold',  color: '#805f4c'}}>{item.noteTitle}</Text>
                            </View>
                           <View style={{right: 0, position: 'absolute',alignItems: 'center', flexDirection:'row', marginRight: 20}}>
                           <Text style={{marginRight: 25,   color: '#805f4c'}}>{item.date}</Text>
       <TouchableOpacity onPress={()=>navigation.navigate("Note", {noteTitle: item.noteTitle, 
        audio: item.audio, date: item.date, text:item.text, jName: jName, key: item.key})}><IconI name="reader-outline" size={30} color="#805f4c" /></TouchableOpacity></View>
                          
                          
                           {playing==item.key?  
        <View style={{marginTop: 15, marginHorizontal: 15}}>
        <Video source={{ uri: item.audio}} // Can be a URL or a local file.
        ref={audioRef}
        paused={paused == item.key}               // Pauses playback entirely.
        resizeMode="cover"           // Fill the whole screen at aspect ratio.
        onLoad={setDurationFunc}    // Callback when video loads
       onProgress={setTime}    // Callback every ~250ms with currentTime
        onEnd={()=>onEndMusic()}           // Callback when playback finishes
        style={styles.audioElement} />

        <Slider
       maximumValue={Math.max(currentDurationSec, 1, currentPositionSec)}
        onSlidingComplete={seek}
        value={currentPositionSec}
        minimumTrackTintColor='#805f4c'
        thumbTintColor='#805f4c'
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
  );


  return (
 
    <View style={{backgroundColor: '#f5e3d3', height: '100%'}}>
        <View style={
          {flexDirection: 'row', justifyContent:'space-between', paddingTop: 15, marginLeft: 15, alignItems: 'center', marginBottom: 10}
          }>
            <TouchableOpacity onPress={() => navigation.navigate('Journals')}>
      <IconI name="arrow-back" style={{marginRight: 20}} size={25} color={'#805f4c'} /></TouchableOpacity>
        <Text style={{fontSize: 16, fontWeight: 'bold',   color: '#805f4c'}}>{jName}</Text>

<View style={{flexDirection: 'row',  alignItems: 'center'}}>
        <TouchableOpacity onPress={()=>navigation.navigate('Record', {jNameParam: jName})} 
        style={{backgroundColor: '#ecd8c8', paddingHorizontal: 10, justifyContent:'center', borderRadius: 4,  shadowOffset: { width: 0, height: 2},
        shadowRadius: 30,elevation: 3, marginRight: 10}}><Text style={{fontSize: 25, color: '#805f4c'}}>+</Text></TouchableOpacity>
{activated ?
        <Menu>
      <MenuTrigger customStyles={{
        triggerOuterWrapper: { marginRight: 0}
      }}
      ><IconM name="dots-vertical" style={{marginRight: 20}} size={25} color='#805f4c' /></MenuTrigger>
      <MenuOptions customStyles={{optionsContainer: {backgroundColor: '#fffaf5', paddingVertical:10, borderRadius: 10, width: 'auto', paddingHorizontal: 20}}}>
        <MenuOption onSelect={() => onPrint()}><Text style={{fontSize: 16, marginBottom: 10, color: '#828180'}}>Print</Text></MenuOption>
        <MenuOption onSelect={()=>allNotesToPdf()}><Text style={{fontSize: 16, marginBottom: 10, color: '#828180'}}>Share</Text></MenuOption>
        <MenuOption onSelect={()=>navigation.navigate('Settings', {jNameParam: jName, cover: cover, color: '#828180'})}><Text style={{fontSize: 16,  marginBottom: 10, color: '#828180'}}>Settings</Text></MenuOption>

      </MenuOptions>
    </Menu> : 
    
    <Menu>
      <MenuTrigger customStyles={{
        triggerOuterWrapper: { marginRight: 10}
      }}
      ><IconM name="dots-vertical" style={{marginRight: 20}} size={25} color='#805f4c'/></MenuTrigger>
      <MenuOptions customStyles={{optionsContainer: {backgroundColor: '#fffaf5', paddingVertical:10, borderRadius: 10, width: 'auto', paddingHorizontal: 20}}}>
        <MenuOption onSelect={()=>navigation.navigate('Settings', {jNameParam: jName, cover: cover})}><Text style={{fontSize: 16, color: '#828180'}}>Settings</Text></MenuOption>
      </MenuOptions>
    </Menu> }</View>


        </View>
        <View style={{backgroundColor: '#fffaf5', flex:1,  paddingBottom: 40, borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
        
     
{activated ?   <FlatList
        data={needed}
        renderItem={renderItem}
        keyExtractor={item => item.key}
     /> : 
     <View style={{marginTop: 15, marginLeft: 15, fontSize: 15}}>
      <Text style={{color: '#828180'}}>You don't have notes in this journal yet</Text></View>}
      
        </View>
       


    </View>
  );
};



const mapStateToProps = (state) => {
  const { appR } = state
  return {appR}
}

export default connect(mapStateToProps)(Journal)

const styles = StyleSheet.create({

});

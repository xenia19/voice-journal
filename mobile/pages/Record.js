import React, {useState, Component, useRef, useEffect} from 'react';
import {connect} from 'react-redux'
import {
  View,Pressable,
  Text,
  StyleSheet,Button,Platform,
  Image, Dimensions, TextInput, ScrollView,PermissionsAndroid,ActivityIndicator,
  Slider,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';
import IconI from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob'
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { Dropdown } from 'react-native-element-dropdown';
import {setJournalArr} from '../redux/setJournalArr'
//import {storage} from './storage'
import {setId} from '../redux/setId'
import {setNotesArr} from '../redux/setNotesArr'
import premium from '../images/prem.png'
import Modal from 'react-native-modal';
const audioRecorderPlayer = new AudioRecorderPlayer();
import diary9 from '../images/diary9.png'
import {setPermission} from '../redux/setPermission'
import SelectDropdown from 'react-native-select-dropdown'

const dirs = RNFetchBlob.fs.dirs;
const papka = dirs.MusicDir + '/Diary';
    RNFetchBlob.fs
      .mkdir(papka)
      .catch(err => {
        console.log(err);
      });

function pad(n, width, z = 0) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSeconds = (position) => ([
  pad(Math.floor(position / 60), 2),
  pad(position % 60, 2),
]);


const Record = ({navigation, route, appR, dispatch}) => {
  var uploadUrl = 'https://vosk-api-english.onrender.com/api' 
  var FormData = require('form-data');
  const jNameParam = route.params ? route.params.jNameParam : null
  const [modalVisible, setModalVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState();
  const [perm, setPermissionL] = useState()
  const [currentPositionSec, setCurrentPositionSec] = useState(0)
  const [currentDurationSec, setDurationSec] = useState(0)
  const [playTime, setPlayTime] = useState('00:00:00')
  const [duration, setDuration] = useState('00:00:00')
  const [recordTime, setRecordTime] = useState('00:00')
  const [recordSecs, setRecordSecs] = useState(0)
  const [paused, setPaused] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [pausedIcon, setPausedIcon] = useState(false)
  const [finished, setFinished] = useState(false)
  const [resumeIcon, setResumeIcon] = useState(false)
  const [firstClick, setFirstClick] = useState(true)
  const [noteTitle, setNoteTitle] = useState('')
  const [jName, setJName] = useState()
  const [titleError, setTitleError] = useState()
  const [journalNameError, setJournalNameError] = useState()
  const [finishPlay, setFinishPlay] = useState()
  const [activityIndi, setActivityIndi] = useState(false)
  const [results, setResults] = useState('')
  const [subInfo, setSubInfo] = useState()
  const [justAudio, setJustAudio] = useState()
  const [modalPremiumVisible, setModalPremiumVisible] = useState(false)
  const [modalPremiumVisibleBeforeRecord, setModalPremiumVisibleBeforeRecord] = useState(false)
  const elapsed = minutesAndSeconds(currentPositionSec);
  const remaining = minutesAndSeconds(currentDurationSec - currentPositionSec);
  const curDur = minutesAndSeconds(currentDurationSec)
  const audioRef = useRef()
  const notebooks = appR.journalArr
  const subscriber = true
  const permission = appR.permission

 var RNFS = require('react-native-fs');
  const id = appR.id
  const notesArr = appR.notesArr
  const onlyNotes = appR.allNotes


useEffect(() => {
  notesNumber()
}, [subscriber])

React.useEffect(() => {
  const unsubscribe = navigation.addListener('blur', () => {  
    if(audioRecorderPlayer._isRecording == true){
      onPauseRecord()
    } else {
      return
    }
  }); 

}, [navigation]);

useEffect(() => {
  notesNumber()
}, [notesArr])

useEffect(() => {
  notesNumber()
  checkPermissions()
  console.log(notebooksArr,jNameParam, "hahaha")
}, [])


const notesNumber = () => {
  newArr = []
  notesArr.map(el => {
   return el.notes.map(i => {
      newArr.push(i)
    })
  })

}
const uploadFile = async (audioForUpload) => {
  console.log("📁 Файл для загрузки:", audioForUpload)
  
  checkPermissions()
  onStopPlay()
  
  if(audioForUpload !== 'undefined') {
    let jNameC = jNameParam ? jNameParam : jName
    
    if(!jNameC) {
      setJournalNameError(true)
      return
    } else if(!noteTitle) {
      setTitleError(true)
      return
    }
    
    setModalVisible(true)
    setActivityIndi(true)
    setRecordTime('00:00')
    
    const uploadStartTime = Date.now()
    
    try {
      console.log("📤 Начинаю загрузку...")
      
      // ✅ Проверяем что файл существует
      const fileExists = await RNFS.exists(audioForUpload)
      if (!fileExists) {
        throw new Error("Audio file not found: " + audioForUpload)
      }
      
      const fileInfo = await RNFS.stat(audioForUpload)
      console.log("✓ Файл существует, размер:", fileInfo.size, "bytes")
      
      // ✅ ПРАВИЛЬНЫЙ URI для Android
      let fileUri = audioForUpload
      if (!fileUri.startsWith('file://')) {
        fileUri = 'file://' + fileUri
      }
      console.log("📎 URI:", fileUri)
      
      // ✅ Создаем FormData правильно
      const formData = new FormData()
      formData.append('111', {
        uri: fileUri,
        type: 'audio/wav',  // Изменил с audio/x-wav
        name: 'audio.wav'
      })
      
      const uploadUrl = 'https://vosk-api-english.onrender.com/api'
      console.log("🚀 Отправляю на:", uploadUrl)
      
      // ✅ Fetch БЕЗ Content-Type header (браузер сам добавит boundary)
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        // НЕ указываем Content-Type!
      })
      
      const uploadTime = ((Date.now() - uploadStartTime) / 1000).toFixed(2)
      console.log("✅ Ответ получен за", uploadTime, "сек")
      console.log("🔢 Status code:", response.status)
      
      const result = await response.json()
      console.log("🎉 Результат:", result)
      
      if(result && result.text) {
        console.log("💾 Текст:", result.text)
        setResults(result.text)
        onSave(result.text)
      } else if(result && result.error) {
        console.error("❌ Ошибка от сервера:", result.error)
        alert(`Server error: ${result.error}`)
      } else {
        console.error("❌ Неправильный формат:", result)
        alert("Error: Unexpected response format")
      }
      
      setModalVisible(false)
      setActivityIndi(false)
      
    } catch(err) {
      const uploadTime = ((Date.now() - uploadStartTime) / 1000).toFixed(2)
      console.error("❌ ОШИБКА (через", uploadTime, "сек):", err.message)
      
      alert(`Error: ${err.message}`)
      
      setNoteTitle('')
      setModalVisible(false)
      setActivityIndi(false)
      setFinished(false)
      setFirstClick(true)
      setJName('')
      setRecordTime('00:00')
    }
  }
}
const checkPermissions = async () => {
  console.log("Starting checkPermissions"); // Лог начала выполнения

  if ('android' === 'android') {
    console.log("Running on Android");

    try {
      console.log("Requesting RECORD_AUDIO permission");

      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      ]);

      console.log("Grants:", grants);

      if (grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("RECORD_AUDIO granted");
        dispatch(setPermission(true));
        setPermissionL(true);
      } else {
        console.log("RECORD_AUDIO denied, retrying");
        checkPermissions(); // Retry permissions if not granted
      }

      if (Platform.Version >= 33) {
        console.log("Android version >= 33");

        const readMediaAudioGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
        );

        console.log("READ_MEDIA_AUDIO result:", readMediaAudioGranted);

        if (readMediaAudioGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("audioAccessGranted");
        } else {
          console.log("audioAccessDenied");
        }
      } else {
        console.log("Android version < 33");

        const readExternalStorageGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );

        console.log("READ_EXTERNAL_STORAGE result:", readExternalStorageGranted);

        if (readExternalStorageGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("storageAccessGranted");
        } else {
          console.log("storageAccessDenied");
        }
      }

      if (Platform.Version < 33) {
        console.log("Requesting WRITE_EXTERNAL_STORAGE for Android < 33");

        const writeExternalStorageGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        console.log("WRITE_EXTERNAL_STORAGE result:", writeExternalStorageGranted);

        if (writeExternalStorageGranted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("writeStorageDenied");
          return;
        }
      }
    } catch (err) {
      console.warn("Error in checkPermissions:", err);
    }
  }
};


   useEffect(() => {
    setJournalNameError(false)
   }, [jName])

   useEffect(() => {
    setTitleError(false)
   }, [noteTitle])

   const onStartRecord =() => {

   
     if(permission ||  perm) {
          setPlaying(true)
          setFirstClick(false)
          audioRecorderPlayer.startRecorder(`${papka}/${id}.wav`)
          audioRecorderPlayer.addRecordBackListener((e) => {

            setRecordSecs(e.currentPosition)
            let countedTime = audioRecorderPlayer.mmssss(
              Math.floor(e.currentPosition))


            let arr = countedTime.split(':')
             let min_ = arr[0]
             let sec_ = arr[1]
             let minSec = min_ + ':' + sec_
             setRecordTime(minSec)
          });
     } else {
      checkPermissions()
      console.log("not")
     }
   }

   const onResumeRecorder = () => {
    setPlaying(true)
    audioRecorderPlayer.resumeRecorder(`${papka}/${id}.wav`)
   }


   const onStopRecord = () => {
   audioRecorderPlayer.stopRecorder(`${papka}/${id}.wav`)
     audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0)
    setFinished(true)
   }

   const onPlay = () => {
    audioRecorderPlayer.startPlayer(`${papka}/${id}.wav`)
    setFinishPlay(true)
    audioRecorderPlayer.addPlayBackListener((e) => {
      if(e.currentPosition == e.duration) {
        setFinishPlay(false)
      }
    })
  }

  const onStopPlay = () => {
    audioRecorderPlayer.pausePlayer(`${papka}/${id}.wav`)
    setFinishPlay(false)
  //const trackA = new Sound(`${papka}/${this.state.id}.wav`, Sound.MAIN_BUNDLE, error => trackA.play());
  }


   const onPauseRecord = () => {
    setPlaying(false)
    audioRecorderPlayer.pauseRecorder(`${papka}/${id}.wav`)
    setResumeIcon(true)
    }

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

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

today =  yyyy + '-'  + mm + '-' + dd


const createNewJournal = (jNameC, newNote) => {
  const rN = Math.floor(Math.random() * 100000);
  const newJournal = [{jName: jNameC, image: diary9, key: rN, notification: false}];
  dispatch(setJournalArr(newJournal));
  return [{jName: jNameC, notes: [newNote]}];
};

const createNewNote = (jNameC, newNote) => {
  const journal = notesArr.find(j => j.jName === jNameC);
  if (journal) {
    const newNotes = [...journal.notes, newNote];
    return notesArr.map(j => {
      return j.jName === jNameC ? {...j, notes: newNotes} : j;
    })
  } else {
    return [...notesArr, {jName: jNameC, notes: [newNote]}];
  }
};

const onSave = (textAudio) => {
  console.log(textAudio,"here we are")
  setModalVisible(false)
  if(audioForUpload !== 'undefined') {
    let jNameC = jName ? jName: jNameParam 
   
    if(!jNameC ){
      setJournalNameError(true)
    } else if(!noteTitle) {
      setTitleError(true)
    } else {
  
   // setModalVisible(true)
    setRecordTime('00:00')

  dispatch(setId(appR.id + 1));
  audioRecorderPlayer.stopPlayer(`${papka}/${id}.wav`);
  onStopPlay();
  let jNameC =  jName ? jName : jNameParam;
  let newNote =  {noteTitle: noteTitle, jName: jNameC, date: today, key: id, audio: `${papka}/${id}.wav`, text: textAudio};

  if (!notebooks.length) {
    dispatch(setNotesArr(createNewJournal(jNameC, newNote)));
  } else {
    dispatch(setNotesArr(createNewNote(jNameC, newNote)));
  }
  setNoteTitle('');
  setActivityIndi(false);
  setFinished(false);
  setFirstClick(true);
  setJName('');

  navigation.navigate("Note", { audio: `${papka}/${id}.wav`, date: today, noteTitle: noteTitle, text: textAudio, key: id, jName: jNameC});
    }
}}

const onDelete = () => {
 setFirstClick(true)
 setFinished(false)
 setRecordTime('00:00')
 setNoteTitle('')

}

const refuseSubs = () => {
  setJustAudio(true)
  setModalPremiumVisible(false)
}

const notebooksArr = notebooks.length ?  notebooks.map(el=> el.jName) : []
let audioForUpload = `${papka}/${id}.wav`

  return (
    <View style={{backgroundColor: '#f5e3d3', flex:1 }}>




     <View style={{alignSelf: 'center', justifyContent: 'center', flex: 1, marginBottom: 10}}>
    {finished? null :
    <Pressable onPress={()=>console.log("hey")}>
    <Text style={{fontSize: 30, alignSelf: 'center', paddingBottom:10, color: '#7b5541'}}>{recordTime}</Text></Pressable> }
    {finished ?
    <View>
    <TouchableOpacity style={{alignSelf: 'center', backgroundColor: '#805f4c', borderRadius: 60,
      paddingHorizontal: 20, paddingVertical: 5, marginBottom: 20}} onPress={finishPlay? ()=>onStopPlay(): ()=>onPlay()}>
      <Icon name={finishPlay? 'pause':"play"}  size={65}  color='#fff' />
    </TouchableOpacity>
    <TextInput
         maxLength={15}
        style={{ backgroundColor: '#fff', textAlign:'center',color:'#808080', marginBottom: 15, height: 60,
        borderRadius: 10, padding: 20, width: 250, fontSize: 14, alignItems: 'center'}}
        onChangeText={text => setNoteTitle(text)}
        value={noteTitle}
        placeholder="Title"
        placeholderTextColor='#808080'
      />
{notebooksArr.length ? 
  <SelectDropdown
	data={notebooksArr}
  buttonStyle={{backgroundColor: '#fff', borderRadius: 10, width: 250,  marginBottom: 15, height: 60,}}
  buttonTextStyle={{fontSize: 14, color:'#808080'}}
  defaultButtonText='Select journal'
  dropdownStyle={{borderRadius: 15, }}
  defaultValue={jNameParam? jNameParam : null}
  rowTextStyle={{fontSize: 14, color:'#808080'}}
	onSelect={(selectedItem, index) => {
		setJName(selectedItem)
	}}
	buttonTextAfterSelection={(selectedItem, index) => {
		return selectedItem
	}}
	rowTextForSelection={(item, index) => {
		return item
	}}
/>



:
    <TextInput
    maxLength={15}
   style={{ backgroundColor: '#fff', textAlign:'center',color:'#808080', marginBottom: 15, height: 60,
   borderRadius: 10, padding: 20, width: 250, fontSize: 14, alignItems: 'center'}}
   onChangeText={text => setJName(text)}
   value={jName}
   placeholder="Name of journal"
   placeholderTextColor='#808080'
 />
}

<View>
    <TouchableOpacity  style={{height: 60, backgroundColor: '#a68479', borderRadius: 10, padding: 20, width: 250,  shadowColor: 'black',
}}  onPress={()=> uploadFile(audioForUpload)}>


      <Text style={{color:'#fff', fontSize: 14, textAlign: 'center'}}>Save</Text>
      {/* <IconMI name="save" size={95}  color="#b1c8d5" /> */}
    </TouchableOpacity>
    <TouchableOpacity  style={{height: 60, marginTop: 15, backgroundColor: '#828180',
    borderRadius: 10, padding: 20, width: 250}}  onPress={()=>onDelete()}>
      <Text style={{color:'#fff', fontSize: 14, textAlign: 'center'}}>Delete</Text>
    </TouchableOpacity>
    <View style={{marginTop: 15, alignSelf: 'center'}}>
      {titleError ? <Text style={{color: '#805f4c'}}>Please, write a title.</Text> : null}
      {journalNameError ? <Text style={{color: '#805f4c'}}>Please, choose a journal.</Text> : null}</View>
    </View>

    </View>
    :
       firstClick ? <View><TouchableOpacity style={{alignSelf: 'center', backgroundColor: '#965f47', marginTop: 20, borderRadius: 90,
       shadowOffset: { width: 20, height: 2},shadowRadius: 130,elevation: 3}} onPress={  ()=> onStartRecord()}><Icon name={ "microphone" } style={{paddingHorizontal: 35, paddingVertical: 10}}  size={95} color="#fefaf4" /></TouchableOpacity>
       {/* {justAudio ? <View style={{alignItems: 'center'}}><Text style={{marginTop: 20}}>Your audio will NOT be converted to text</Text>
       <Pressable onPressIn={()=>navigation.navigate('User')} style={{marginTop: 10,   zIndex: 3, elevation: 3,}}><View style={{flexDirection: 'row'}}><Text style={{fontWeight: 'bold'}}>Subscribe</Text><Text> to continue converting your audio to text</Text></View></Pressable></View>
        : null} */}
       </View>
       :

            <View>{playing ?
              <View style={{flexDirection: 'row'}}>
              <View style={{marginRight: 10}}><TouchableOpacity style={{ backgroundColor: '#965f47', borderRadius: 40}} onPress={ ()=>onPauseRecord()}>
            <Icon name={ "pause" } style={{paddingHorizontal: 20, paddingVertical: 5}}  size={55} color="#fefaf4" /></TouchableOpacity></View>
              <TouchableOpacity onPress={ ()=>onStopRecord()} style={{ backgroundColor: '#965f47', borderRadius: 40}}>
              <Icon name={ "stop" } style={{paddingHorizontal: 15, paddingVertical:5, }} size={55} color="#fefaf4" /></TouchableOpacity></View>

              :  <View style={{flexDirection: 'row'}}>
                <View style={{marginRight: 10}}><TouchableOpacity style={{ backgroundColor: '#965f47', borderRadius: 40}} onPress={ ()=>onResumeRecorder()}>
              <Icon name={ "microphone" } style={{paddingHorizontal: 20, paddingVertical: 5}}  size={55} color="#fefaf4" /></TouchableOpacity></View>
                <TouchableOpacity onPress={ ()=>onStopRecord()} style={{ backgroundColor: '#965f47', borderRadius: 40}}>
                <Icon name={ "stop" } style={{paddingHorizontal: 15, paddingVertical:5, }} size={55} color="#fefaf4" /></TouchableOpacity></View>
              }
             </View>}






      </View>
      <Modal isVisible={modalVisible}>
  <View style={{height: '30%', backgroundColor: 'rgba(255, 255, 255,0.8)', borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
<ActivityIndicator size="large" color="#965f47" />
<Text style={{fontSize: 17, marginTop: 10,  color: '#828180'}}>Please, wait a little bit.</Text>
<Text style={{fontSize: 17, marginTop: 10,  color: '#828180'}}>Your audio is converting to text.</Text>
</View>
</Modal>
    </View>
  );
};

const mapStateToProps = (state) => {
  const { appR } = state
  return {appR}
}

export default connect(mapStateToProps)(Record)

const styles = StyleSheet.create({
  text: {
    color: '#805f4c'
  }
});



import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Pressable, Image, Button,TextInput, ScrollView, Text, TouchableOpacity, Switch} from 'react-native';

import {Calendar} from 'react-native-calendars';
import {connect} from 'react-redux'
import IconI from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';

const CalendarComponent = ({appR, navigation}, props) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toString());
  const [showInfo, setShowInfo] = useState(false)
  const [markedDay_, setMarkedDay] = useState()
  const [showText, setShowText] = useState(false)
  const [allNotes, setAllNotes] = useState([])
  const [question, setQuestion] = useState('Вопрос')
  const [appointments, setAppointment] = useState([])
  const [mergedArrF, setMergedArr] = useState([])
  const [text, setText] = useState([])
  const [imageLink, setImageLink] = useState("")
  const [noteAdded, setNoteAdded] = useState(false)
  const [imageUploaded, setImageUploaded] = useState(false)
  const [imageLinks, setImageArr] = useState([])
  const [newDate, changeDate] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showChooseAppointment, setShowChooseAppointment] = useState(false)
  const [showAnalis, setShowAnalis] = useState(false)
  const [user, setUser] = useState()
  const notesArr = appR.notesArr

useEffect(() => {
const allNotesArr = notesArr.map(el => {
  return el.notes
})

if(allNotesArr && allNotesArr.length ){
  allNotesArr.map(el => {
   return el.map(i => {
    let itemDate = i.date
    allNotes.push(itemDate)
    })
  })
}


 let markedDay = {};

 allNotes.map((item) => {
  markedDay[item] = {
    selected: true,
    selectedColor: "#d1dff0",
  };
});

setMarkedDay(markedDay)
}, [])

let newObj;


const goToDate = (date) => {
let notesDateArr = []
 let filtered= notesArr.map(el => {
  if(el.notes.length>1) {
      el.notes.map(i => {
       if(i.date == date.dateString){
          notesDateArr.push(i)
       } 
      })

  } else {
   if(el.notes[0]&& el.notes[0].date == date.dateString){
    notesDateArr.push(el.notes[0])
   }
  }
  })
  if(notesDateArr && notesDateArr.length) {
    navigation.navigate('Day', {day: date})
  } else {
    return
  }
}


  return (
    markedDay_ ?
  <Calendar
      current={startDate}
     
      style={styles.calendar}
      onDayPress={date => goToDate(date)}
      markingType={'custom'}
      firstDay={1}
      markedDates={markedDay_}
      theme={{
      'stylesheet.day.basic':{
          'base':{
           paddingHorizontal: 6,
            height:23,
            textColor: '#805f4c'
          },
        text: {
          marginTop: 2,
          color: '#805f4c'
        }},
       
        arrowColor: "#805f4c",
       backgroundColor: '#fffaf5',
       calendarBackground: '#fffaf5',
       textSectionTitleColor: '#805f4c',
       selectedDayBackgroundColor: '#ecd8c8',
       selectedDayTextColor: '#fff',
       todayTextColor: '#805f4c',
       dayTextColor: '#805f4c',
       textDisabledColor: '#d9e1e8',
       disabledArrowColor: '#fff',
       monthTextColor: '#805f4c',
       indicatorColor: '#805f4c',
       textMonthFontSize: 15,
       textDayFontWeight: '400',
       textMonthFontWeight:'600',
       textDayHeaderFontWeight: '600',
       textDayFontSize: 15,
       textDayHeaderFontSize: 15,
     }}
    />  : null
  )
}



const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,

  },
  error: {
    fontSize: 16,
    margin: 20,
    textAlign: 'center',
    color: '#094ca7'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  oneline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },

  label: {
    textAlign: 'left',
    marginLeft: 20,
    marginTop: 7,
    color: '#ecd8c8'
  },


 wrapper: {
  color: '#182B4D',
  marginTop: 35

 },

  calendar: {
    borderRadius: 20,
  },

  below_cal: {
    backgroundColor: '#fff',
    borderRadius: 30,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 16,

    padding: 20,
    color: '#182B4D',

    borderColor: '#094ca7',
    borderWidth: 1,
    margin: 25,

  },
  appointment: {
    backgroundColor: '#fff',
    borderRadius: 20,
   marginBottom: 20,
    justifyContent: 'center',

    padding: 16,

    color: '#1a3a62',
    marginHorizontal: 9,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,

    flex: 1,

    alignItems: 'center'

  },

  appointmentOld: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 26,
    paddingVertical: 15,
    color: '#1a3a62',
    marginHorizontal: 9,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    flex: 1,
  },

  text: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'lightgrey',
    fontSize: 16,
    color: '#182B4D'
  },
  input: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#094ca7',
    borderWidth: 1,
    height: 40,
    paddingLeft: 14,


  },
  inputModal: {
    marginHorizontal: 20,
    margin: 5,
    backgroundColor: '#fefeff',
    borderRadius: 10,
    borderColor: '#e5e5e6',
    borderWidth: 1,
    height: 60,
    paddingLeft: 10,
    flexDirection: 'row',
    alignContent: 'center',
    paddingTop: 5,
    fontSize: 17,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.23,
    shadowRadius: 1.62,
    elevation: 2


  },
  picker: {
    marginHorizontal: 20,
    height: 40,
    borderRadius: 10,
    borderColor: "#094ca7",
    marginVertical: 10,
    padding: 7,
    color: '#094ca7',

  },
  img: {
    width: 50,
    height:50,
    marginRight: 10,
    borderRadius: 30
  },
  imgBig: {
    width: 60,
    height:60,

    borderRadius: 30,
    marginTop: 20
  },
  button: {

    backgroundColor: '#1279fe',
    fontSize: 17,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  buttonModal: {
    backgroundColor: '#1279fe',


    padding: 13,
    borderRadius: 15,
  },
  button_text: {
    color: 'white',

    fontSize: 17,
    padding: 10,
    textAlign: 'center'
  },
  text_appointment: {
    fontSize: 17,
    color: '#1a3a62',
    marginBottom: 10
  },
  text_appointmentBold: {
    fontSize: 17,
    color: '#1a3a62',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  rounded: {
    margin: 10
  },
  dot: {
    flex: 1,
    justifyContent: 'flex-end',
    textAlign: 'center',
    marginBottom: 10,

  },
  title: {
    color: '#1A385F',
    fontSize: 17,

  },

});

const mapStateToProps = (state) => {
  const { appR } = state
  return { appR }
};

export default connect(mapStateToProps)(CalendarComponent)
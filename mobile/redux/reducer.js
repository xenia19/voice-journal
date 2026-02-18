

import { combineReducers } from 'redux';
import { NativeModules } from 'react-native'

const rN = Math.floor(Math.random() * 100000)

import diary from '../images/diary9.png'
import travel from '../images/travel.png'

const INITIAL_STATE = {
 id: rN,
 notesArr: [],
 journalArr:  [{jName: 'My notes', image: diary, key: rN, notification: "10:00"}],
 notification_time: new Date(),
 subscriber: false,
 permission: false
}


const appReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'SET_ID':
        return {
          ...state,
       id: action.payload
        }

        case 'SET_ALL_NOTES':
          return {
            ...state,
         allNotes: action.payload
          }

       case 'SET_PERMISSION':
        return {
          ...state,
       permission: action.payload
        }

          case 'SET_NOTES_ARR':
            return {
              ...state,
           notesArr: action.payload
            }
          
            case 'SET_JOURNAL_ARR':
              return {
                ...state,
             journalArr: action.payload
              }

          case 'DELETE_JOURNAL':
                return {
                  ...state,
                  journalArr: [...state.journalArr.slice(0, action.payload), ...state.journalArr.slice(action.payload+1)]
      
                }

        case 'DELETE_NOTES_FROM_JOURNAL':
                  return {
                    ...state,
                    notesArr: [...state.notesArr.slice(0, action.payload), ...state.notesArr.slice(action.payload+1)]
        
                  }

      case 'SET_NOTIFICATION_TIME':
                    return {
                    ...state,
                   notification_time: action.payload
          
                  }
   
       case 'SET_SUBSCRIBER':
                    return {
                    ...state,
                  subscriber: action.payload
                  
                  }
        default:
          return state
      }
    }

export default combineReducers({
  appR: appReducer
});
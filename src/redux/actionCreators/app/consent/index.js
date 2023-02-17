import  {ActionTypes} from '../../../actionTypes';
import * as Endpoints from '../../../../services/endPoints'
import * as NetworkParams from '../../../../services/networkParams'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RewardsActionCreator } from '../rewards';
import { GenericPostCall } from '../../genericPostCall';



export const ConsentActionCreator = {

  //get alert status
  getAlertStatus: (userId) => async (dispatch,getState) => {

        dispatch({type:ActionTypes.GET_ALERT_STATUS_REQUEST})
        try{
       
        const apiResponse = await GenericPostCall(dispatch,Endpoints.GetAlertStatus,JSON.stringify({
            user_id:userId
          }))

            
            dispatch({type:ActionTypes.GET_ALERT_STATUS_REPONSE,payload:apiResponse})
        }
        catch(e){
          console.log('/////...../////ERROR: '+e.toString())
            dispatch({type:ActionTypes.GET_ALERT_STATUS_REPONSE,payload:e,error:true})
        }
  },

  //save alert status
  saveAlertStatus: (userId,wallet,reward) => async (dispatch,getState) => {

    dispatch({type:ActionTypes.SAVE_ALERT_STATUS_REQUEST})
    try{
   
    const apiResponse = await GenericPostCall(dispatch,Endpoints.SaveAlert,JSON.stringify({
        user_id:userId,
        Wallet:wallet,
        Reward:reward
      }))


        dispatch(ConsentActionCreator.getAlertStatus(userId))
        dispatch({type:ActionTypes.SAVE_ALERT_STATUS_REPONSE,payload:apiResponse})
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.SAVE_ALERT_STATUS_REPONSE,payload:e,error:true})
    }
},

//time based request
timeBasedRequest: (userId,duration,lat,long) => async (dispatch,getState) => {

    dispatch({type:ActionTypes.REQUEST_TIME_CONSENT_REQUEST})
    try{
   
    const apiResponse = await GenericPostCall(dispatch,Endpoints.RequestTimeConsent,JSON.stringify({
        user_id:userId,
        Duration:duration,
        Lat:lat,
        Long:long
      }))

        
        dispatch({type:ActionTypes.REQUEST_TIME_CONSENT_REPONSE,payload:apiResponse})
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.REQUEST_TIME_CONSENT_REPONSE,payload:e,error:true})
    }
},

//location services
getOrSetLocationServices: (val) => async (dispatch,getState) => {

    dispatch({type:ActionTypes.GET_LOCATION_SERVICES_STATUS_REQUEST})
    try{
   
        if(val != null){
            await EncryptedStorage.setItem('isLocationEnabled',JSON.stringify(val))
        }
        EncryptedStorage.getItem('isLocationEnabled',async(res,err) => {
            if(res == 'true' || res == null){
             dispatch({type:ActionTypes.GET_LOCATION_SERVICES_STATUS_REPONSE,payload:{isLocationEnabled:true}})
            }else{
             dispatch({type:ActionTypes.GET_LOCATION_SERVICES_STATUS_REPONSE,payload:{isLocationEnabled:false}})
         }
         if(err){
            dispatch({type:ActionTypes.GET_LOCATION_SERVICES_STATUS_REPONSE,payload:{isLocationEnabled:true}})
         }
        })
        
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.GET_LOCATION_SERVICES_STATUS_REPONSE,payload:e,error:true})
    }
},

getOrSetTime: (val) => async (dispatch,getState) => {
  dispatch({type:ActionTypes.GET_TIME_REQUEST})
  try{

          if(val != null){
              await EncryptedStorage.setItem('timeWhenClicked',val)
          }else{
            await EncryptedStorage.setItem('timeWhenClicked','Hide')
          }
          EncryptedStorage.getItem('timeWhenClicked',async(res,err) => {
               dispatch({type:ActionTypes.GET_TIME_REPONSE,payload:res})
           if(err){
              dispatch({type:ActionTypes.GET_TIME_REPONSE,payload:null})
           }
          })
  }
  catch(e){
      dispatch({type:ActionTypes.GET_TIME_REPONSE,payload:e,error:true})
  }
},

//get time consent request
getTimeConsentStatus: (userId) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.GET_TIME_CONSENT_REQUEST})
  try{
 
  const apiResponse = await GenericPostCall(dispatch,Endpoints.GetTimeConsentStatus,JSON.stringify({
      user_id:userId
    }))
  
      dispatch({type:ActionTypes.GET_TIME_CONSENT_REPONSE,payload:apiResponse})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.GET_TIME_CONSENT_REPONSE,payload:e,error:true})
  }
},

//set time consent request
setTimeConsentStatus: (userId,value) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.SET_TIME_CONSENT_REQUEST})
  try{
 
  const apiResponse = await GenericPostCall(dispatch,Endpoints.SwitchTimeConsent,JSON.stringify({
      user_id:userId,
      IsActive:value
    }))
      dispatch(ConsentActionCreator.getTimeConsentStatus(userId))
      dispatch({type:ActionTypes.SET_TIME_CONSENT_REPONSE,payload:apiResponse})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.SET_TIME_CONSENT_REPONSE,payload:e,error:true})
  }
},
}
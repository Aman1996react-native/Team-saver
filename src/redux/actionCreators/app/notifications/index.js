import  {ActionTypes} from '../../../actionTypes';
import * as Endpoints from '../../../../services/endPoints'
import * as NetworkParams from '../../../../services/networkParams'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RewardsActionCreator } from '../rewards';
import { GenericPostCall } from '../../genericPostCall';



export const NotificationsActionCreator = {

  //get notifications
  getNotifications: (userId) => async (dispatch,getState) => {

        dispatch({type:ActionTypes.NOTIFICATIONS_REQUEST})
        try{     
              
            const apiResponse = await GenericPostCall(dispatch,Endpoints.GetNotifications,JSON.stringify({
              user_id:userId
            }))   
            
            if(typeof(apiResponse) != 'undefined'){
              console.log("🚀 ~ file: index.js ~ line 24 ~ getNotifications: ~ apiResponse", apiResponse)
              if(typeof(apiResponse.RequestList) != 'undefined'){
                  if(apiResponse.RequestList.length > 0){
                    apiResponse.RequestList.forEach(item => {
                      item.Selected = false
                    })
                  }
              }
            }
            
           dispatch({type:ActionTypes.NOTIFICATIONS_REPONSE,payload:apiResponse})
           console.log("🚀 ~ file: index.js ~ line 35 ~ getNotifications: ~ apiResponse", apiResponse)
        }
        catch(e){
          console.log('/////...../////ERROR: '+e.toString())
            dispatch({type:ActionTypes.NOTIFICATIONS_REPONSE,payload:e,error:true})
        }
  },

  //update notifications seen
  updateNotificationSeenStatus: (userId,requestId,notificationType) => async (dispatch,getState) => {

    dispatch({type:ActionTypes.NOTIFICATION_SEEN_REQUEST})
    try{
        
        const apiResponse = await GenericPostCall(dispatch,Endpoints.NotificationSeen,JSON.stringify({
          user_id:userId,
          RequestID:requestId,
          NotificationType:notificationType
      }))
      dispatch(NotificationsActionCreator.getNotifications(userId))
       dispatch({type:ActionTypes.NOTIFICATION_SEEN_REPONSE,payload:apiResponse})
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.NOTIFICATION_SEEN_REPONSE,payload:e,error:true})
    }
},

 //delete notifications 
 deleteNotification: (userId,notifications,deleteAll) => async (dispatch,getState) => {


  dispatch({type:ActionTypes.NOTIFICATION_DELETE_REQUEST})
  try{
      
      const apiResponse = await GenericPostCall(dispatch,Endpoints.NotificationDelete,JSON.stringify({
        user_id:userId,
        Notifications:notifications,
        DeleteAll:deleteAll
    }))
    
    dispatch(NotificationsActionCreator.getNotifications(userId))
    
    
     dispatch({type:ActionTypes.NOTIFICATION_DELETE_REPONSE,payload:apiResponse})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.NOTIFICATION_DELETE_REPONSE,payload:e,error:true})
  }
},

resetNotificationDelete: () => async (dispatch,getState) => {
  dispatch({type:ActionTypes.NOTIFICATION_DELETE_RESET,payload:{}})
},

resetNotificationSeen: () => async (dispatch,getState) => {
  dispatch({type:ActionTypes.NOTIFICATION_SEEN_RESET,payload:{}})
},

  //approve requested money
  approveRequestedMoney: (userId,requestId,approved) => async (dispatch,getState) => {

    dispatch({type:ActionTypes.APPROVE_MONEY_REQUEST_REQUEST})
    try{
        const apiResponse = await GenericPostCall(dispatch,Endpoints.SendRequestMoney,JSON.stringify({
          user_id:userId,
          RequestID:requestId,
          Approved:approved
      }))
    
        dispatch(NotificationsActionCreator.getNotifications(userId))
        dispatch(RewardsActionCreator.getPointsBalance(userId))

        dispatch({type:ActionTypes.APPROVE_MONEY_REQUEST_REPONSE,payload:apiResponse})
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.APPROVE_MONEY_REQUEST_REPONSE,payload:e,error:true})
    }
},
resetApproveRequest: () => async (dispatch,getState) => {
    dispatch({type:ActionTypes.APPROVE_MONEY_REQUEST_RESET,payload:{}})
  },
}
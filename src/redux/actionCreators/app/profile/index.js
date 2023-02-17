import  {ActionTypes} from '../../../actionTypes';
import * as Endpoints from '../../../../services/endPoints'
import * as NetworkParams from '../../../../services/networkParams'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { GenericPostCall } from '../../genericPostCall';



export const ProfileActionCreator = {

  //get profile
  getProfileDetails: (userId) => async (dispatch,getState) => {

        dispatch({type:ActionTypes.GET_PROFILE_REQUEST})
        try{
           
            const apiResponse = await GenericPostCall(dispatch,Endpoints.GetUserProfile,JSON.stringify({
              user_id:userId
            }))

            // console.warn(JSON.stringify(apiResponse))
            if(typeof(apiResponse) != 'undefined'){
              let nameToDisplay = ''
              if(typeof(apiResponse.FirstName) != 'undefined'){
                if(apiResponse.FirstName != null){
                  if(apiResponse.FirstName.length > 0){
                    nameToDisplay = apiResponse.FirstName.charAt(0).toUpperCase()
                  }
                }
              }

              if(typeof(apiResponse.LastName) != 'undefined'){
                if(apiResponse.LastName != null){
                  if(apiResponse.LastName.length > 0){
                    nameToDisplay = nameToDisplay + apiResponse.LastName.charAt(0).toUpperCase()
                  }
                }
              }
              apiResponse.nameToDisplay = nameToDisplay
            }

            // console.warn('PROFILEEEEE: '+JSON.stringify(apiResponse))
            
            dispatch({type:ActionTypes.GET_PROFILE_REPONSE,payload:apiResponse})
        }
        catch(e){
          console.log('/////...../////ERROR: '+e.toString())
            dispatch({type:ActionTypes.GET_PROFILE_REPONSE,payload:e,error:true})
        }
  },

  //edit profile
  editProfileDetails: (userId,first,middle,last,place) => async (dispatch,getState) => {

    dispatch({type:ActionTypes.EDIT_PROFILE_REQUEST})
    try{
        const apiResponse = await GenericPostCall(dispatch,Endpoints.EditProfile,JSON.stringify({
          user_id:userId,
          FirstName:first,
          LastName:last
      }))
        
        dispatch({type:ActionTypes.EDIT_PROFILE_REPONSE,payload:apiResponse})
        dispatch(ProfileActionCreator.getProfileDetails(userId))
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.EDIT_PROFILE_REPONSE,payload:e,error:true})
    }
},

  //get fav brands
  getFavBrands: (userId) => async (dispatch,getState) => {

    dispatch({type:ActionTypes.GET_FAV_BRANDS_REQUEST})
    try{
        const apiResponse = await GenericPostCall(dispatch,Endpoints.GetFavBrands,JSON.stringify({
          user_id:userId
        }))
        
        dispatch({type:ActionTypes.GET_FAV_BRANDS_REPONSE,payload:apiResponse})
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.GET_FAV_BRANDS_REPONSE,payload:e,error:true})
    }
},

//get gifts and rewards
getGiftsAndRewards: (userId) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.GET_GIFTS_REWARDS_REQUEST})
  try{
     
      const apiResponse = await GenericPostCall(dispatch,Endpoints.GetGiftsRewards,JSON.stringify({
        user_id:userId
      }))

      let gifts = []
      let rewards = []

      if(typeof(apiResponse) != 'undefined'){
        if(apiResponse.length > 0){
          apiResponse.forEach(record => {
            if(typeof(record.Self) != 'undefined'){
              if(record.Self == 'true'){
                rewards.push(record)
              }else{
                gifts.push(record)
              }
            }
          })
        }
      }
      const res = {
        gifts:gifts,
        rewards:rewards
      }
      
      dispatch({type:ActionTypes.GET_GIFTS_REWARDS_REPONSE,payload:res})
  }
  catch(e){
    console.log('/////...../////ERROR get gifts rewardss: '+e.toString())
      dispatch({type:ActionTypes.GET_GIFTS_REWARDS_REPONSE,payload:e,error:true})
  }
},

//edit email
editEmail: (userId,email,dynamic, step) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.EDIT_EMAIL_REQUEST})
  try{
      const apiResponse = await GenericPostCall(dispatch,Endpoints.EditEmail,JSON.stringify({
        user_id:userId,
        Email:email,
        dynamic_link:dynamic,
        Step:Number(step)
      }))

      
      // console.warn('EDIT EMAIL RES:  '+JSON.stringify(apiResponse))
      dispatch({type:ActionTypes.EDIT_EMAIL_RESPONSE,payload:apiResponse})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.EDIT_EMAIL_RESPONSE,payload:e,error:true})
  }
},

//edit mobile
editMobile: (userId,mobile,step) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.EDIT_MOBILE_REQUEST})
  try{
      const apiResponse = await GenericPostCall(dispatch,Endpoints.EditMobile,JSON.stringify({
        user_id:userId,
        Mobile:mobile,
        Step:Number(step)
      }))
      
// console.warn('EDIT MOBILE RES: '+JSON.stringify(apiResponse))
      

      dispatch({type:ActionTypes.EDIT_MOBILE_RESPONSE,payload:apiResponse})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.EDIT_MOBILE_RESPONSE,payload:e,error:true})
  }
},

resetVerifyEmail: () => async (dispatch,getState) => {
  dispatch({type:ActionTypes.EDIT_EMAIL_RESET,payload:{}})
},

resetVerifyMobile: () => async (dispatch,getState) => {
  dispatch({type:ActionTypes.EDIT_MOBILE_RESET,payload:{}})
},

  
}
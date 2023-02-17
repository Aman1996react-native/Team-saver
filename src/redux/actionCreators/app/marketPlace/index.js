import  {ActionTypes} from '../../../actionTypes';
import * as Endpoints from '../../../../services/endPoints'
import * as NetworkParams from '../../../../services/networkParams'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RewardsActionCreator } from '../rewards';
import { GenericGetCall, GenericPostCall } from '../../genericPostCall';



export const MarketPlaceActionCreator = {

  //get devices
  getDevices: () => async (dispatch,getState) => {

        dispatch({type:ActionTypes.GET_DEVICES_REQUEST})
        try{
       
        const apiResponse = await GenericGetCall(Endpoints.GetDevices,dispatch)
            
            dispatch({type:ActionTypes.GET_DEVICES_REPONSE,payload:apiResponse})
        }
        catch(e){
          console.log('/////...../////ERROR: '+e.toString())
            dispatch({type:ActionTypes.GET_DEVICES_REPONSE,payload:e,error:true})
        }
  },

  //get accessories
  getAccessories: () => async (dispatch,getState) => {

    dispatch({type:ActionTypes.GET_ACCESSORIES_REQUEST}) 
    try{
        const apiResponse = await GenericGetCall(Endpoints.GetAccessories,dispatch)
    
        dispatch({type:ActionTypes.GET_ACCESSORIES_REPONSE,payload:apiResponse})
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.GET_ACCESSORIES_REPONSE,payload:e,error:true})
    }
},

}
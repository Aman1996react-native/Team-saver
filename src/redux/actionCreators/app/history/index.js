import  {ActionTypes} from '../../../actionTypes';
import * as Endpoints from '../../../../services/endPoints'
import * as NetworkParams from '../../../../services/networkParams'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RewardsActionCreator } from '../rewards';
import { GenericPostCall } from '../../genericPostCall';



export const HistoryActionCreator = {

  //get notifications
  getPointsHistory: (userId) => async (dispatch,getState) => {

        dispatch({type:ActionTypes.GET_HISTORY_POINTS_REQUEST})
        try{
       
        const apiResponse = await GenericPostCall(dispatch,Endpoints.GetPointsHistory,JSON.stringify({
            user_id:userId
          }))
        let pointsEarned = []
        let pointsRedeemed = []

        if(typeof(apiResponse) != 'undefined'){
            if(apiResponse.length > 0){
                apiResponse.forEach(rec => {
                    if(typeof(rec.Type) != 'undefined'){
                        if(rec.Type == 'Burnt'){
                            pointsRedeemed.push(rec)
                        }else{
                            pointsEarned.push(rec)
                        }
                    }
                })
            }
        }

        const ele = {
            pointsEarned:pointsEarned.length > 0 ? pointsEarned : pointsEarned,
            pointsRedeemed:pointsRedeemed.length > 0 ? pointsRedeemed : pointsRedeemed
        }
        
            
            dispatch({type:ActionTypes.GET_HISTORY_POINTS_REPONSE,payload:ele})
        }
        catch(e){
          console.log('/////...../////ERROR Points history: '+e.toString())
            dispatch({type:ActionTypes.GET_HISTORY_POINTS_REPONSE,payload:e,error:true})
        }
  },

  //approve requested money
  getMoneyHistory: (userId) => async (dispatch,getState) => {

    dispatch({type:ActionTypes.GET_HISTORY_MONEY_REQUEST})
    try{
   
    const apiResponse = await GenericPostCall(dispatch,Endpoints.GetMoneyHistory,JSON.stringify({
        user_id:userId
      }))
    
        dispatch({type:ActionTypes.GET_HISTORY_MONEY_REPONSE,payload:apiResponse.length > 0 ? apiResponse : apiResponse})
    }
    catch(e){
      console.log('/////...../////ERROR Money history: '+e.toString())
        dispatch({type:ActionTypes.GET_HISTORY_MONEY_REPONSE,payload:e,error:true})
    }
},

//get click history
getClickHistory: (userId,searchText) => async (dispatch,getState) => {

    dispatch({type:ActionTypes.GET_CLICK_HISTORY_REQUEST})
    try{
   
    const apiResponse = await GenericPostCall(dispatch,Endpoints.GetClickHistorySearch,JSON.stringify({
        user_id:userId,
        SearchText:searchText
      }))
    
        dispatch({type:ActionTypes.GET_CLICK_HISTORY_REPONSE,payload:apiResponse})
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.GET_CLICK_HISTORY_REPONSE,payload:e,error:true})
    }
},

//submit claim reward
submitRewardClaim: (userId,offerId,offerName,invoiceId,saleValue,date,expectedPoints,attachmentBase64,attachmentType,email,memberId) => async (dispatch,getState) => {

    dispatch({type:ActionTypes.SUBMIT_REWARD_CLAIM_REQUEST})
    try{
   
    const apiResponse = await GenericPostCall(dispatch,Endpoints.SubmitRewardClaim,JSON.stringify({
        UserID:userId,
        OfferID:offerId,
        OfferName:offerName,
        InvoiceID:invoiceId,
        SaleValue:saleValue,
        Date:date,
        ExpectedPoints:expectedPoints,
        Attachement:attachmentBase64,
        AttachementType:attachmentType,
        Email:email,
        MemberID:memberId
      }))

      
        console.warn('SUBMIT CLAIM: '+JSON.stringify(apiResponse))
        dispatch({type:ActionTypes.SUBMIT_REWARD_CLAIM_REPONSE,payload:apiResponse})
    }
    catch(e){
      console.log('/////...../////ERROR: '+e.toString())
        dispatch({type:ActionTypes.SUBMIT_REWARD_CLAIM_REPONSE,payload:e,error:true})
    }
},

resetSubmitClaim: () => async (dispatch,getState) => {
  dispatch({type:ActionTypes.SUBMIT_REWARD_CLAIM_RESET})
},

}
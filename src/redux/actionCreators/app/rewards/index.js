import  {ActionTypes} from '../../../actionTypes';
import * as Endpoints from '../../../../services/endPoints'
import * as NetworkParams from '../../../../services/networkParams'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { GenericGetCall, GenericPostCall } from '../../genericPostCall';



export const RewardsActionCreator = {

  //get rewards categories
  getRewardsCategories: () => async (dispatch,getState) => {

        dispatch({type:ActionTypes.GET_REWARD_CAT_REQUEST})
        try{
            const apiResponse = await GenericGetCall(Endpoints.GetRewardCategories,dispatch)

            // console.warn('CAT:  '+ JSON.stringify(apiResponse))
            
            dispatch({type:ActionTypes.GET_REWARD_CAT_RESPONSE,payload:apiResponse})
        }
        catch(e){
          alert(e.toString())
          console.log('/////...../////ERROR: '+e.toString())
            dispatch({type:ActionTypes.GET_REWARD_CAT_RESPONSE,payload:e,error:true})
        }
  },

  //Get rewards details
  getRewardDetails: (rewardId) => async (dispatch,getState) => {

    dispatch({type:ActionTypes.GET_REWARD_DETAILS_REQUEST})
    try{
        const apiResponse = await GenericPostCall(dispatch,Endpoints.GetRewardDetails,JSON.stringify({
          RewardID:rewardId
        }))
        let catArray = []
        let allMerchants = []
      if(typeof(apiResponse) != 'undefined'){
        if(typeof(apiResponse) == 'object'){
          if(apiResponse.length > 0){
            apiResponse.forEach(cat => {
              if(typeof(cat.MerchantDetails) != 'undefined'){
                if(cat.MerchantDetails.length > 0){
                  catArray.push(cat)
                      cat.MerchantDetails.forEach(merchant => {
                        if(typeof(merchant.OfferDetails) != 'undefined'){
                          if(merchant.OfferDetails.length > 0){
                            
                            let mer = merchant
                            mer.Category_ID = cat.Category_ID
                            mer.Category_Name = cat.Category_Name
                            allMerchants.push(mer)
                          }
                        }
                      })
                }
              }
            })   
                        
          }
        }
      }

      if(catArray.length > 0){
        catArray.forEach(ct => {
          ct.MerchantDetails.forEach(mer => {
            if(typeof(mer.OfferDetails) != 'undefined'){
              if(mer.OfferDetails.length < 1){
                const index = ct.MerchantDetails.indexOf(mer)
                if(index > -1){
                  console.log(mer.Merchant_Name)
                  ct.MerchantDetails.splice(index,1)
                }
              }
            }
          })
        })
      }

      let cArr = catArray
      if(typeof(apiResponse) != 'undefined'){
        if(apiResponse.length > 0){
          const zerothIdex = apiResponse[0]
          const ele = {
            Category_ID:zerothIdex.Category_ID,
            Category_Name:zerothIdex.Category_Name,
            IconSmall:zerothIdex.IconSmall,
            IconBig:zerothIdex.IconBig,
            MerchantDetails:allMerchants
          }
          cArr.splice(0,0,ele)
          cArr[0].selected = true
        }
      }
      

      const updatedResponse = {
        merchants:allMerchants,
        categories:catArray
      }
        dispatch({type:ActionTypes.GET_REWARD_DETAILS_RESPONSE,payload:updatedResponse})
    }
    catch(e){
      alert(e.toString())
      console.log('/////...../////ERROR Get Reward Details: '+e.toString())
        dispatch({type:ActionTypes.GET_REWARD_DETAILS_RESPONSE,payload:e,error:true})
    }
},
//get matchedcontacts
getMatchedContacts: (userId,contacts) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.GET_MATCHED_CONTACTS_REQUEST})
  try{
      const apiResponse = await GenericPostCall(dispatch,Endpoints.MatchContact,JSON.stringify({
        user_id:userId,
        contactDetails:contacts
      }))

      if(typeof(apiResponse) != 'undefined'){
        if(typeof(apiResponse.contactDetails) != 'undefined'){
          if(apiResponse.contactDetails.length > 0){
            apiResponse.contactDetails.forEach(con => {
              let name = con.Name
              let nameToDisplay = ''
              if(name != null){
                if(name.length > 0){
                  nameToDisplay = name.charAt(0).toUpperCase()
                }
                if(name.includes(' ')){
                  let splittedName = name.split(' ')
                    if(typeof(splittedName) != 'undefined'){
                      if(splittedName.length > 0){
                        if(typeof(splittedName[1]) != 'undefined'){
                            if(splittedName[1].length > 0){
                                nameToDisplay = nameToDisplay + splittedName[1].charAt(0).toUpperCase()
                            }
                        }
                      }
                    }
                  }
              }
              con.nameToDisplay = nameToDisplay
            })
          }
        }
      }


      console.log(JSON.stringify(contacts))

      dispatch({type:ActionTypes.GET_MATCHED_CONTACTS_RESPONSE,payload:apiResponse})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.GET_MATCHED_CONTACTS_RESPONSE,payload:e,error:true})
  }
},

//get point balance
getPointsBalance: (userId) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.GET_POINTS_BALANCE_REQUEST})
  try{
      const apiResponse = await GenericPostCall(dispatch,Endpoints.GetBalance,JSON.stringify({
        user_id:userId,
      }))
      
      dispatch({type:ActionTypes.GET_POINTS_BALANCE_RESPONSE,payload:apiResponse})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.GET_POINTS_BALANCE_RESPONSE,payload:e,error:true})
  }
},

//redeem gift card
redeemGiftCard: (userId,catId,merId,amount,points,date,desc,name,number,self,fromName,fromMobile,isCCS,offerId) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.REDEEM_GIFT_CARD_REQUEST})
  let reqBody = null

  if(isCCS){
    reqBody = {
      user_id:userId,
      Category_ID:catId.toString(),
      Merchant_ID:Number(merId),
      Amount:amount.toString(),
      Self:'true',
      Offer_ID:Number(offerId)
      
  }

  }else{
      reqBody = {
        user_id:userId,
        Category_ID:catId,
        Merchant_ID:merId,
        Amount:amount,
        Points:points,
        Delivery_Date:date,
        Description:desc,
        Name:name,
        Mobile_Number:number,
        Self:self,
        FromName:fromName,
        FromMobile:fromMobile,
        Offer_ID:offerId
        
    }
  }
  
  try{
      const apiResponse = await GenericPostCall(dispatch,Endpoints.RequestGiftcard,JSON.stringify(reqBody))

      

      dispatch({type:ActionTypes.REDEEM_GIFT_CARD_RESPONSE,payload:apiResponse})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.REDEEM_GIFT_CARD_RESPONSE,payload:e,error:true})
  }
},

resetRedeemgiftCard: () => async (dispatch,getState) => {
  dispatch({type:ActionTypes.REDEEM_GIFT_CARD_RESET,payload:{}})
},

resetPurchaseFoodAndWine: () => async (dispatch,getState) => {
  dispatch({type:ActionTypes.PURCHASE_FOOD_POS_RESET,payload:{}})
},

resetPointsTransfer: () => async (dispatch,getState) => {
  dispatch({type:ActionTypes.POINTS_TRANSFER_RESET,payload:{}})
},


//get food and wine
getFoodAndWine: (userId,rewardId) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.GET_FOOD_AND_WINE_REQUEST})
  try{
      const apiResponse = await GenericPostCall(dispatch,Endpoints.GetPOSMerProds,JSON.stringify({
        user_id:userId,
        RewardID:rewardId
      }))

      let cafes = []
      if(typeof(apiResponse) != 'undefined'){
        if(apiResponse.length > 0){
          apiResponse.forEach(cafe => {
            if(typeof(cafe.Menu) != 'undefined'){
                if(cafe.Menu.length > 0){
                    cafe.Menu.forEach(menu => {
                      if(typeof(menu.Price) != 'undefined'){
                        let points = menu.Price/0.005
                        menu.Points = points,
                        menu.CafeId = cafe.MerchantID
                      }
                    })
                    cafes.push(cafe)
                }
            }
          })
        }
      }
      
      dispatch({type:ActionTypes.GET_FOOD_AND_WINE_REPONSE,payload:cafes})
  }
  catch(e){
    console.log('/////...../////ERROR Get Food and wine: '+e.toString())
      dispatch({type:ActionTypes.GET_FOOD_AND_WINE_REPONSE,payload:e,error:true})
  }
},

//purchase food and wine pos
purchaseFoodAndWine: (userId,self,fromName,fromMobile,cafeId,points,price,date,name,mobile,desc,selMenu) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.PURCHASE_FOOD_POS_REQUEST})
  
  try{
      const apiResponse = await GenericPostCall(dispatch,Endpoints.POSRequest,JSON.stringify({
        user_id:userId,
        Self:self,
        FromName:fromName,
        FromMobile:fromMobile,
        RestaurantID:cafeId,
        TotalPoints:points + '',
        TotalAmount:price + '',
        Delivery_Date:date == '' ? null : date,
        Name:name,
        Mobile_Number:mobile,
        Description:desc,
        Menu:selMenu
          
      }))

      console.log(JSON.stringify(apiResponse))
      

      // dispatch(RewardsActionCreator.getPointsBalance(userId))
      dispatch({type:ActionTypes.PURCHASE_FOOD_POS_REPONSE,payload:apiResponse})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.PURCHASE_FOOD_POS_REPONSE,payload:e,error:true})
  }
},

//point transfer
pointsTransfer: (userId,points,contacts) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.POINTS_TRANSFER_REQUEST})
  try{
      const apiResponse = await GenericPostCall(dispatch,Endpoints.TransferPoints,JSON.stringify({
        user_id:userId,
        TotalPoints:points,
        Contacts:contacts
    }))
      dispatch(RewardsActionCreator.getPointsBalance(userId))
      
      dispatch({type:ActionTypes.POINTS_TRANSFER_REPONSE,payload:apiResponse})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.POINTS_TRANSFER_REPONSE,payload:e,error:true})
  }
},

//transfer to master card
transferToMasterCard: (userId,amount) => async (dispatch,getState) => {

  dispatch({type:ActionTypes.TRANSFER_TO_MASTER_CARD_REQUEST})
  try{
      const apiResponse = await GenericPostCall(dispatch,Endpoints.RequestDigiCard,JSON.stringify({
        UserID:userId,
        Amount:amount.toString()
    }))

    console.warn('REQUEST DIGI CARD BODY: '+JSON.stringify({
      UserID:userId,
      Amount:amount.toString()
  }))

      dispatch(RewardsActionCreator.getPointsBalance(userId))
      
      dispatch({type:ActionTypes.TRANSFER_TO_MASTER_CARD_RESPONSE,payload:apiResponse})
  }
  catch(e){
    console.log('/////...../////ERROR: '+e.toString())
      dispatch({type:ActionTypes.TRANSFER_TO_MASTER_CARD_RESPONSE,payload:e,error:true})
  }
},

//reset transfer to master card
resetTransferToMasterCard: () => async (dispatch,getState) => {
  dispatch({type:ActionTypes.TRANSFER_TO_MASTER_CARD_RESET,payload:{}})
},

}
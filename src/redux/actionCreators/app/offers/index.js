import { ActionTypes } from '../../../actionTypes';
import * as Endpoints from '../../../../services/endPoints'
import * as NetworkParams from '../../../../services/networkParams'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { GenericGetCall, GenericPostCall } from '../../genericPostCall';
import { CCSActionCreator } from '../ccs';
import { Alert } from 'react-native';
import moment from 'moment';



export const OffersActionCreator = {

  //get categories
  getCategories: (userId) => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.Get_OFFERS_REQUEST })
    try {
        Alert.alert('SXAS')
      const apiResponse = await GenericPostCall(dispatch, Endpoints.GetCategoriesWithOffers, JSON.stringify({
        user_id: userId
      }))
      let catArray = []
      let allOffers = []

      if (typeof (apiResponse) != 'undefined') {
        if (typeof (apiResponse) == 'object') {
          if (apiResponse.length > 0) {
            apiResponse.forEach(cat => {
              if (typeof (cat.OfferDetails) != 'undefined') {
                if (cat.OfferDetails.length > 0 || cat.Category_Name == 'All') {
                  catArray.push(cat)
                  allOffers = [...allOffers, ...cat.OfferDetails]
                }
              }
            })
            if (catArray.length > 0) {
              catArray[0].selected = true
              catArray[0].OfferDetails = [...allOffers]
            }


          }
        }
      }
      dispatch({ type: ActionTypes.Get_OFFERS_RESPONSE, payload: catArray })
    }
    catch (e) {
      alert(e.toString())
      console.log('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.Get_OFFERS_RESPONSE, payload: e, error: true })
    }
  },

  

  //save offer
  saveOffer: (userId, catId, offerId) => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.SAVE_OFFERS_REQUEST })
    try {

      const apiResponse = await GenericPostCall(dispatch, Endpoints.SaveOffers, JSON.stringify({
        user_id: userId,
        Category_ID: catId,
        OfferID: offerId
      }))
      dispatch(OffersActionCreator.getSavedOffers(userId))
      dispatch({ type: ActionTypes.SAVE_OFFERS_RESPONSE, payload: apiResponse })
    }
    catch (e) {
      console.log('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.SAVE_OFFERS_RESPONSE, payload: e, error: true })
    }
  },

  //api on shop clicked
  shopClickApi: (userId, offerId, offerName) => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.SHOP_CLICKED_REQUEST })
    try {

      const apiResponse = await GenericPostCall(dispatch, Endpoints.ShopClickAPI, JSON.stringify({
        UserID: userId,
        OfferID: offerId,
        OfferName: offerName
      }))
      dispatch({ type: ActionTypes.SHOP_CLICKED_RESPONSE, payload: apiResponse })
    }
    catch (e) {
      console.log('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.SHOP_CLICKED_RESPONSE, payload: e, error: true })
    }
  },

  resetSaveOffers: () => async (dispatch, getState) => {
    dispatch({ type: ActionTypes.SAVE_OFFERS_RESET })
  },

  //get saved offers
  getSavedOffers: (userId) => async (dispatch, getState) => {
    Alert.alert('1',apiResponse)
    dispatch({ type: ActionTypes.GET_SAVE_OFFERS_REQUEST })
    try {

      const apiResponse = await GenericPostCall(dispatch, Endpoints.GetSavedOffers, JSON.stringify({
        user_id: userId
      }))
      let catArray = []
      if (typeof (apiResponse) != 'undefined') {
        if (typeof (apiResponse) == 'object') {
          if (apiResponse.length > 0) {
            apiResponse.forEach(cat => {
              if (typeof (cat.OfferDetails) != 'undefined') {
                if (cat.OfferDetails.length > 0) {
                  catArray.push(cat)
                }
              }
            })
            if (catArray.length > 0) {
              catArray[0].selected = true
            }

          }
        }
      }
      dispatch({ type: ActionTypes.GET_SAVE_OFFERS_RESPONSE, payload: catArray })
    }
    catch (e) {
      alert(e.toString())
      console.log('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.GET_SAVE_OFFERS_RESPONSE, payload: e, error: true })
    }
  },

getAllOffer : (data) => async (dispatch,getState) => {
//  console.log("daata",data)
  dispatch({ type: ActionTypes.Get_ALL_OFFER_Request })
  try {
    const apiResponse = await GenericPostCall(dispatch, Endpoints.GetAllAggMerchants
      , JSON.stringify({
        PageSize : data.PageSize,
        StartIndex :data.StartIndex,
        Timestamp : data.Timestamp
    }),
    )
   console.log("getAllOffer--------------------------",apiResponse)
   if (data.StartIndex == 0){
    dispatch({ type: ActionTypes.Get_All_OFFER_RESONSE, payload: apiResponse })
   } else {
    dispatch({ type: ActionTypes.GET_OTHER_50_OFFERS, payload: apiResponse })
   }
  }
  catch (e) {
    console.log('/////...../////ERROR get Ct with offers2: ' + e.toString())
    dispatch({ type: ActionTypes.Get_All_OFFER_RESONSE, payload: e, error: true })
  }
  // dispatch({ type: ActionTypes.Get_ALL_OFFER_Request })
  // try {
  //   const apiResponse = await GenericPostCall(dispatch, Endpoints.GetAllAggMerchants
  //     ,JSON.stringify(data)
  //   )
  //  console.log("AllofferResponse===",apiResponse)
  //   dispatch({ type: ActionTypes.Get_All_OFFER_RESONSE, payload: apiResponse })
  // }
  // catch (e) {
  //   console.log('/////...../////ERROR get Ct with offers2: ' + e.toString())
  //   dispatch({ type: ActionTypes.Get_All_OFFER_RESONSE, payload: e, error: true })
  // }
},


GetAggMerchantsByCat : (cat_Id) => async (dispatch,getState) => {
  // alert(cat_Id)
  // dispatch({ type: ActionTypes.GetAggMerchantsByCat_REQUEST })
  dispatch({ type: ActionTypes.Get_ALL_OFFER_Request })
  try {
   const apiResponse = await GenericPostCall(dispatch,Endpoints.GetAggMerchantsByCat, JSON.stringify({
    Category_ID: cat_Id,
    }))
   console.log("Category_ID---------------",apiResponse)
   dispatch({ type: ActionTypes.Get_All_OFFER_RESONSE, payload: apiResponse })
    // dispatch({ type: ActionTypes.GetAggMerchantsByCat_RESPONSE, payload: apiResponse })
  }
  catch (e) {
    console.log('/////...../////ERROR get Ct with offers2: ' + e.toString())
    dispatch({ type: ActionTypes.GetAggMerchantsByCat_RESPONSE, payload: e, error: true })
  }
},


  //get categories with offers2
  getCategoriesWithOffers2 : (userId) => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.Get_OFFERS_REQUEST })
    try {
     // Alert.alert(userId)
      // const apiResponse = await GenericPostCall(dispatch, Endpoints.GetAllAggMerchants
      //   , JSON.stringify({
      //     PageSize : 50,
      //     StartIndex : 1,
      //     Timestamp: new Date(),
      // }),
      // )
      const apiResponse = await GenericGetCall(Endpoints.GetAllCategories,dispatch)
      // console.log('12312',userId)
     console.log("apiResponseapiResponse",apiResponse)
      let catArray = []
      let allOffers = []

      if (typeof (apiResponse) != 'undefined') {
        if (typeof (apiResponse) == 'object') {
          if (apiResponse.length > 0) {
            apiResponse.forEach(cat => {
              if (typeof (cat.MerchantDetails) != 'undefined') {
                if (cat.MerchantDetails.length > 0) {
                  catArray.push(cat)

                }
              }
            })
            if (catArray.length > 0) {
              catArray[0].selected = true
            }
          }
        }
      }
      //console.warn(JSON.stringify(catArray))
     console.log('catArray', catArray)
      // dispatch({ type: ActionTypes.Get_OFFERS_RESPONSE, payload: catArray })
      // dispatch({ type: ActionTypes.Get_All_OFFER_RESONSE, payload: apiResponse })
      dispatch({ type: ActionTypes.Get_OFFERS_RESPONSE, payload: apiResponse })
      dispatch(CCSActionCreator.offerWithCategoryName(null))
      dispatch(CCSActionCreator.offerWithCategoryName(''))
      dispatch(CCSActionCreator.resetResponse('24'))
    }
    catch (e) {
      console.log('/////...../////ERROR get Ct with offers2: ' + e.toString())
      dispatch({ type: ActionTypes.Get_OFFERS_RESPONSE, payload: e, error: true })
    }
  },

  //reset array
  resetGetCategoriesWithOffers2: () => async (dispatch, getState) => {
    dispatch({ type: ActionTypes.Get_OFFERS_RESET })
  },


  //get saved offers2
  getSavedOffers: (userId) => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.GET_SAVE_OFFERS_REQUEST })
    try {

      const apiResponse = await GenericPostCall(dispatch, Endpoints.GetSavedOffers2, JSON.stringify({
        user_id: userId
      }))
      let catArray = []
      if (typeof (apiResponse) != 'undefined') {
        if (typeof (apiResponse) == 'object') {
          if (apiResponse.length > 0) {
            apiResponse.forEach(cat => {
              if (typeof (cat.MerchantDetails) != 'undefined') {
                if (cat.MerchantDetails.length > 0) {
                  catArray.push(cat)

                }
              }
            })
            if (catArray.length > 0) {
              catArray[0].selected = true
            }

          }
        }
      }
      dispatch({ type: ActionTypes.GET_SAVE_OFFERS_RESPONSE, payload: catArray })
    }
    catch (e) {
      alert(e.toString())
      console.log('/////...../////ERROR Get Saved Offers: ' + e.toString())
      dispatch({ type: ActionTypes.GET_SAVE_OFFERS_RESPONSE, payload: e, error: true })
    }
  },
}
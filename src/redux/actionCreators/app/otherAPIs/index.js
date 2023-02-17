import { ActionTypes } from '../../../actionTypes';
import * as Endpoints from '../../../../services/endPoints'
import * as NetworkParams from '../../../../services/networkParams'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RewardsActionCreator } from '../rewards';
import { GenericGetCall, GenericPostCall } from '../../genericPostCall';
import { Platform } from "react-native";
import compareVersions from 'compare-versions';
import DeviceInfo from 'react-native-device-info';
import { GetSignature } from '../../generateSignature';



export const OtherAPIActionCreator = {

  //update fcm token
  updateFcmToken: (userId, fcmToken, platform) => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.UPDATE_FCM_TOKEN_REQUEST })
    try {

      const apiResponse = await GenericPostCall(dispatch, Endpoints.UpdateFCMToken, JSON.stringify({
        user_id: userId,
        FCMToken: fcmToken,
        Platform: platform
      }))

      dispatch({ type: ActionTypes.UPDATE_FCM_TOKEN_REPONSE, payload: apiResponse })
    }
    catch (e) {
      console.log('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.UPDATE_FCM_TOKEN_REPONSE, payload: e, error: true })
    }
  },

  //get maintainance status
  getMaintainanceStatus: () => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.GET_MAINTAINANCE_REQUEST })
    try {
      const apiResponse = await GenericGetCall(Endpoints.MaintenanceStatus, dispatch)

      dispatch({ type: ActionTypes.GET_MAINTAINANCE_REPONSE, payload: apiResponse })
    }
    catch (e) {
      console.log('/////...../////ERROR get maintainance: ' + e.toString())
      dispatch({ type: ActionTypes.GET_MAINTAINANCE_REPONSE, payload: e, error: true })
    }
  },

  GetConfigResponse: () => async (dispatch, getState) => {
    dispatch({ type: ActionTypes.GET_CONFIG_REQUEST })
    try {
//       const apiResponse = await GenericGetCall(Endpoints.GetClientConfig, dispatch)
// console.log("apiResponse----------",apiResponse)
      // dispatch({ type: ActionTypes.GET_MAINTAINANCE_REPONSE, payload: apiResponse })
      const tokenSaved = await EncryptedStorage.getItem('sessionToken')
      let refreshToken = ''

      if (typeof (tokenSaved) != 'undefined') {
          if (tokenSaved != null) {
              if (tokenSaved) {
                  const tokenJson = JSON.parse(tokenSaved)
                  if (typeof (tokenJson) != 'undefined') {
                      if (typeof (tokenJson.refresh_token) != 'undefined') {
                          if (tokenJson.refresh_token != null) {
                              if (tokenJson.refresh_token) {
                                  refreshToken = tokenJson.refresh_token
                              }
                          }
                      }
                  }
              }
          }
      }
      const signature = await GetSignature(Endpoints.GetClientConfig, null, refreshToken)
      let header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
        Signature: signature

    }
    console.log("header===========",header)
    const response = await fetch(Endpoints.BaseUrl + Endpoints.GetClientConfig, {
        method: 'GET',
        headers: header,
        // pkPinning: true,
        // disableAllSecurity: false,
        // sslPinning: {
// your certificates name (without extension), for example cert1.cer, cert2.cer
        // certs: ["expcert","mycert"]
        // certs : ["sha256/3wz3N6kiFmneYzatFTvyQZnOUslpeej7KonAzt8F6Qc="]
        // }  
    })
    const apiResponse = await response.json()
    dispatch({ type: ActionTypes.GET_CONFIG_REPONSE, payload: apiResponse })
    console.log('response 101----',apiResponse)
    console.log('response is--------------',Endpoints.BaseUrl +  Endpoints.GetClientConfig, header)

    }
    catch (e) {
      console.log('/////...../////ERROR get GetClientConfig: ' + e.toString())
      dispatch({ type: ActionTypes.GET_CONFIG_REPONSE, payload: e, error: true })
    }
  },
  

  //force update
  forceUpdate: () => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.FORCE_UPDATE_REQUEST })
    try {

      const apiResponse = await GenericPostCall(dispatch, Endpoints.ForceUpdate, JSON.stringify({
        Platform: Platform.OS == 'ios' ? 1 : 2
      }))

      // console.warn('FORCE UPDATE: ' + JSON.stringify(apiResponse))
      let res = {
        shouldForceUpdate: false
      }
      if (typeof (apiResponse) != 'undefined') {
        if (apiResponse != null) {
          if (typeof (apiResponse.Version) != 'undefined') {
            if (apiResponse.Version != null) {
              if (apiResponse.Version.length > 0) {
                console.warn('ACTUAL: ' + DeviceInfo.getVersion() + 'API :' + apiResponse.Version + 'COMPARED: ' + compareVersions(apiResponse.Version,DeviceInfo.getVersion()))
                const comparedResult = compareVersions(apiResponse.Version, DeviceInfo.getVersion())
                if (typeof (comparedResult) != 'undefined') {
                  if (comparedResult != null) {
                    if (comparedResult == 1) {
                      res.shouldForceUpdate = true
                    } else {
                      res.shouldForceUpdate = false
                    }
                  }
                }

              }
            }
          }
        }
      }

      console.warn(res.shouldForceUpdate)

      dispatch({ type: ActionTypes.FORCE_UPDATE_REPONSE, payload: res })
    }
    catch (e) {
      console.log('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.FORCE_UPDATE_REPONSE, payload: e, error: true })
    }
  },
  //get woolworth's details
  getWoolworthDetails: (userId) => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.GET_WOOLWORTH_REQUEST })
    try {

      const apiResponse = await GenericPostCall(dispatch, Endpoints.RequestWoolworth, JSON.stringify({
        user_id: userId
      }))

      console.warn('Woolworth: ' + JSON.stringify(apiResponse))

      dispatch({ type: ActionTypes.GET_WOOLWORTH_REPONSE, payload: apiResponse })
    }
    catch (e) {
      console.log('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.GET_WOOLWORTH_REPONSE, payload: e, error: true })
    }
  },

  resetWoolworthDetails: () => async (dispatch, getState) => {
    dispatch({ type: ActionTypes.GET_WOOLWORTH_RESET, payload: {} })
  },
}
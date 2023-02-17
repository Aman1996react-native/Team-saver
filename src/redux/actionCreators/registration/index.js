import * as ActionTypes from '../../actionTypes/registration';
import * as Endpoints from '../../../services/endPoints'
import * as NetworkParams from '../../../services/networkParams'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { ProfileActionCreator } from '../app/profile';
import { GenericGetCall, GenericPostCall } from '../genericPostCall';
import { AuthActionCreator } from '../auth';
import { LoginctionCreator } from '../login';
import { RewardsActionCreator } from '../app/rewards';
import { sha256 } from 'react-native-sha256';
import axios from 'axios'
import { Alert, NativeModules } from 'react-native';
import { CheckAccessTokenExpiryTime } from '../checkAccessTokenExpiry';
import { GetSignature } from '../generateSignature';
var Aes = NativeModules.Aes
const keyToEncrytThePassword = 'IRM54JE9Q86DFE!@'
import CryptoJS from "react-native-crypto-js";

export const RegistrationActionCreator = {

  //send name and email
  sendNameAndEmailAddress: (firstName, lastName, email, password, dynamic, referralCode, mobile) => async (dispatch, getState) => {
    console.log("🚀 ~ file: index.js:22 ~ sendNameAndEmailAddress: ~ password", password)
    console.log('FirstName', firstName)
    console.log('LastName', lastName)
    console.log('email_id', email)
    console.log('ReferralCode', referralCode)
    console.log('mobile_no', mobile)


    dispatch({ type: ActionTypes.SEND_NAME_AND_EMAIL_REQUEST })
    try {
      const apiResponse = await GenericPostCall(dispatch, Endpoints.ChkNameEmail, JSON.stringify({
        FirstName: firstName,
        LastName: lastName,
        email_id: email,
        password: password,
        ReferralCode: referralCode,
        mobile_no: mobile,

      }))



      console.warn('RRRRREEEESSSSS:  ' + JSON.stringify(apiResponse))

      if (apiResponse != null) {
        if (Object.keys(apiResponse).length > 0) {
          if (typeof (apiResponse.Status) != 'undefined') {
            if (apiResponse.Status == 'Success') {
              if (typeof (apiResponse.Token) != 'undefined') {
                if (apiResponse.Token != null) {
                  if (typeof (apiResponse.Token.access_token) != 'undefined') {
                    if (apiResponse.Token.access_token.length > 10) {
                      try {
                        // if (typeof (apiResponse.IsPrimaryUser) != 'undefined') {
                        //   await EncryptedStorage.setItem('isPrimaryUser', JSON.stringify(apiResponse.IsPrimaryUser))
                        // } else {
                        //   await EncryptedStorage.setItem('isPrimaryUser', JSON.stringify(true))
                        // }
                        await EncryptedStorage.setItem('userId', 'No User Id')

                        await EncryptedStorage.setItem('sessionToken', JSON.stringify(apiResponse.Token))
                        let today = new Date();
                        let date = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
                        let time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
                        let dateTime = date + 'T' + time;
                        await EncryptedStorage.setItem('timeWhenGotAccessToken', dateTime)

                        await EncryptedStorage.setItem('email', email)
                      } catch (e) {

                      }
                    }
                  }
                }


              }
            }
          }
        }
      }
      dispatch({ type: ActionTypes.SEND_NAME_AND_EMAIL_RESPONSE, payload: apiResponse })
    }
    catch (e) {
      console.warn('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.SEND_NAME_AND_EMAIL_RESPONSE, payload: e, error: true })
    }
  },

  //Verify email
  isEmailVerified: (userId, status) => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.EMAIL_VERIFIED_REQUEST })
    try {
      const apiResponse = await GenericPostCall(dispatch, Endpoints.EmailVerified, JSON.stringify({
        Status: status,
        user_id: userId,
      }))
      dispatch({ type: ActionTypes.EMAIL_VERIFIED_RESPONSE, payload: apiResponse })
    }
    catch (e) {
      console.log('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.EMAIL_VERIFIED_RESPONSE, payload: e, error: true })
    }
  },

  //Send mobile number
  sendMobileNumber: (userId, mobileNumber) => async (dispatch, getState) => {
    dispatch({ type: ActionTypes.SEND_MOBILE_NUMBER_REQUEST })
    try {

      const apiResponse = await GenericPostCall(dispatch, Endpoints.ChkMobile, JSON.stringify({
        mobile_no: mobileNumber,
        user_id: userId,
      }))

      console.warn(JSON.stringify(apiResponse))

      dispatch({ type: ActionTypes.SEND_MOBILE_NUMBER_RESPONSE, payload: apiResponse })
      dispatch(RegistrationActionCreator.resetResponse('3'))
    }
    catch (e) {
      console.log('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.SEND_MOBILE_NUMBER_RESPONSE, payload: e, error: true })
    }
  },

  //Verify OTP
  isMobileNumberVerified: (userId, status) => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.OTP_VERIFIED_REQUEST })
    try {
      const apiResponse = await GenericPostCall(dispatch, Endpoints.MobileVerified, JSON.stringify({
        Status: status,
        user_id: userId,
      }))

      dispatch({ type: ActionTypes.OTP_VERIFIED_RESPONSE, payload: apiResponse })
    }
    catch (e) {
      console.log('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.OTP_VERIFIED_RESPONSE, payload: e, error: true })
    }
  },

  //Verify Email and Mobile
  verifyEmailAndMobile: (userId, code, otpType) => async (dispatch, getState) => {
    let jsonFromBody = JSON.stringify({
      "UserID": userId,
      "OTP": code,
      "OTPType": otpType
    })
    console.log("jsonFromBody", jsonFromBody)
    try {
      const apiResponse = await GenericPostCall(dispatch, Endpoints.VerifyOTP, JSON.stringify({
        UserID: userId,
        OTP: code,
        OTPType: otpType
      }))
      console.log("apiResponse-----", apiResponse)

      let word = apiResponse.Status
      let response2 = apiResponse.Status
      response2 = { Status: "Success" }
      console.log("wordword", word)
      let key = keyToEncrytThePassword;
      key = CryptoJS.enc.Utf8.parse(key);
      let iv = keyToEncrytThePassword;
      iv = CryptoJS.enc.Utf8.parse(iv);
      let decrypted = CryptoJS.AES.decrypt(word, key, { iv: iv });
      decrypted = decrypted.toString(CryptoJS.enc.Utf8);
      let de_res = decrypted.split("_")
      console.log("decrypted", de_res[0], ",,", decrypted);
      if (de_res[0] === "Fail") {
        alert("Please check your otp.")
        setTimeout(() => {
          dispatch({ type: ActionTypes.VERIFY_EMAIL_AND_MOBILE_RESPONSE, payload: apiResponse })
        }, 3000);
      } else if (de_res[0] === "OK") {
        console.log("response2", response2)
        dispatch({ type: ActionTypes.VERIFY_EMAIL_AND_MOBILE_RESPONSE, payload: response2 })
        dispatch(RegistrationActionCreator.resetResponse('11'))
      } else {
        alert("Please check your otp.")
      }
    } catch (e) {
      console.log('/////...../////ERROR: ' + JSON.stringify(e.toString()))
      dispatch({ type: ActionTypes.VERIFY_EMAIL_AND_MOBILE_RESPONSE, payload: e, error: true })
    }
  },

  //create mpin
  createMPin: (userId, mpin, isEnabled, password) => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.SEND_PIN_REQUEST })
    try {

      console.warn(JSON.stringify({
        mpin: mpin,
        user_id: userId,
      }))

      const apiResponse = await GenericPostCall(dispatch, Endpoints.CreateRegPIN, JSON.stringify({
        mpin: mpin,
        user_id: userId,
      }))

      const email = await EncryptedStorage.getItem('email')

      if (typeof (apiResponse) != 'undefined') {
        if (typeof (apiResponse.Status) != 'undefined') {
          if (apiResponse.Status == 'Success') {
            if (isEnabled) {

              dispatch(AuthActionCreator.isTouchIdEnabled(null, email))
              await EncryptedStorage.setItem(email.toString(), password)
              console.warn('SAVED PASSWORD CREATE PIN PAGE: ' + await EncryptedStorage.getItem(email.toString()))

            } else {
              await EncryptedStorage.setItem(email.toString(), '')
            }
          }
        }
      }

      dispatch({ type: ActionTypes.SEND_PIN_RESPONSE, payload: apiResponse })
    }
    catch (e) {
      console.log('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.SEND_PIN_RESPONSE, payload: e, error: true })
    }
  },

  //get T&C
  getTCAndPP: (isPP) => async (dispatch, getState) => {

    isPP ? dispatch({ type: ActionTypes.GET_PP_REQUEST }) : dispatch({ type: ActionTypes.GET_TC_REQUEST })
    try {
      const ep = isPP ? Endpoints.GetPrivacyPolicy : Endpoints.GetTermsNCondition
      const apiResponse = await GenericGetCall(ep, dispatch)
      isPP ? dispatch({ type: ActionTypes.GET_PP_RESPONSE, payload: apiResponse }) : dispatch({ type: ActionTypes.GET_TC_RESPONSE, payload: apiResponse })

      console.warn(JSON.stringify(apiResponse))


    }
    catch (e) {
      console.log('/////...../////ERROR: ' + e.toString())
      isPP ? dispatch({ type: ActionTypes.GET_PP_RESPONSE, payload: e, error: true }) : dispatch({ type: ActionTypes.GET_TC_RESPONSE, payload: e, error: true })
    }
  },

  //accept T&C
  acceptTC: (userId, accepted) => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.ACCEPT_TC_REQUEST })
    try {

      const apiResponse = await GenericPostCall(dispatch, Endpoints.AcceptTNC, JSON.stringify({
        tnc: accepted.toString(),
        user_id: userId,
      }))

      dispatch({ type: ActionTypes.ACCEPT_TC_RESPONSE, payload: apiResponse })
    }
    catch (e) {
      console.log('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.ACCEPT_TC_RESPONSE, payload: e, error: true })
    }
  },

  //upload image
  uploadImage: (userId, image, shouldCallgetProfile) => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.UPLOAD_IMAGE_REQUEST })
    try {

      const apiResponse = await GenericPostCall(dispatch, Endpoints.UploadImage, JSON.stringify({
        image: image,
        user_id: userId,
      }))

      if (shouldCallgetProfile) {
        dispatch(ProfileActionCreator.getProfileDetails(userId))
      }
      dispatch({ type: ActionTypes.UPLOAD_IMAGE_RESPONSE, payload: apiResponse })
    }
    catch (e) {
      console.log('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.UPLOAD_IMAGE_RESPONSE, payload: e, error: true })
    }
  },

  //get top brands
  getTopBrands: (userId) => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.GET_TOP_BRANDS_REQUEST })
    try {
      const apiResponse = await GenericPostCall(dispatch, Endpoints.GetBrandList, JSON.stringify({
        user_id: userId,
      }))
      // if(typeof(apiResponse) !='undefined'){
      //  if(apiResponse.length > 0){
      //    apiResponse.forEach(item => {
      //     item.selected = false
      //   })
      // }
      //}
      let selectedBrands = []
      if (typeof (apiResponse) != 'undefined') {
        if (apiResponse.length > 0) {
          apiResponse.forEach(item => {
            if (item.Selected == 'true') {
              const element = {
                id: item.id
              }
              selectedBrands.push(element)
            }
          })
        }
      }
      const ele = {
        brands: apiResponse,
        selectedBrands: selectedBrands
      }
      dispatch({ type: ActionTypes.GET_TOP_BRANDS_RESPONSE, payload: apiResponse })
    }
    catch (e) {
      console.log('/////...../////ERROR Get Brands list: ' + e.toString())
      dispatch({ type: ActionTypes.GET_TOP_BRANDS_RESPONSE, payload: e, error: true })
    }
  },

  //save favourites
  saveFavourites: (userId, selected) => async (dispatch, getState) => {

    dispatch({ type: ActionTypes.SAVE_FAVOURITES_REQUEST })
    try {



      let selctedBrands = []


      if (typeof (selected) != 'undefined') {
        if (selected.length > 0) {
          selected.forEach(sel => {
            const ele = {
              id: sel.id
            }
            selctedBrands.push(ele)
          })
        }
      }

      console.warn(JSON.stringify(selctedBrands))

      const apiResponse = await GenericPostCall(dispatch, Endpoints.AddBrandToUser, JSON.stringify({
        selected_fav: selctedBrands,
        user_id: userId,
      }))

      console.warn(JSON.stringify(JSON.stringify(apiResponse)))

      dispatch({ type: ActionTypes.SAVE_FAVOURITES_RESPONSE, payload: apiResponse })
      dispatch(ProfileActionCreator.getFavBrands(userId))
      dispatch(RegistrationActionCreator.getTopBrands(userId))
    }
    catch (e) {
      console.log('/////...../////ERROR: ' + e.toString())
      dispatch({ type: ActionTypes.SAVE_FAVOURITES_RESPONSE, payload: e, error: true })
    }
  },

  //reset
  resetResponse: (name) => async (dispatch, getState) => {
    switch (name) {
      case '1':
        dispatch({ type: ActionTypes.SEND_NAME_AND_EMAIL_RESET, payload: {} })
        break;

      case '2':
        dispatch({ type: ActionTypes.EMAIL_VERIFIED_RESET, payload: {} })
        break;

      case '3':
        dispatch({ type: ActionTypes.SEND_MOBILE_NUMBER_RESET, payload: {} })
        break;

      case '4':
        dispatch({ type: ActionTypes.OTP_VERIFIED_RESET, payload: {} })
        break;

      case '5':
        dispatch({ type: ActionTypes.SEND_PIN_RESET, payload: {} })
        break;

      case '6':
        dispatch({ type: ActionTypes.GET_TC_RESET, payload: {} })
        break;

      case '7':
        dispatch({ type: ActionTypes.ACCEPT_TC_RESET, payload: {} })
        break;

      case '8':
        dispatch({ type: ActionTypes.UPLOAD_IMAGE_RESET, payload: {} })
        break;

      case '9':
        dispatch({ type: ActionTypes.GET_TOP_BRANDS_RESET, payload: {} })
        break;

      case '10':
        dispatch({ type: ActionTypes.SAVE_FAVOURITES_RESET, payload: {} })
        break;

      case '11':
        dispatch({ type: ActionTypes.VERIFY_EMAIL_AND_MOBILE_RESET, payload: {} })
        break;

      default:
        break;
    }

  },

}
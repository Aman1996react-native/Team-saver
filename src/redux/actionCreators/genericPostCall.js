import * as NetworkParams from '../../services/networkParams'
import * as Endpoints from '../../services/endPoints'
import { AuthActionCreator } from './auth'
import { OtherAPIActionCreator } from './app/otherAPIs'
import Config from "react-native-config";
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { sha256 } from 'react-native-sha256';
import { GetSignature } from './generateSignature';
import { CheckAccessTokenExpiryTime } from './checkAccessTokenExpiry';
import { CCSActionCreator } from './app/ccs';
import { GetAccessToken } from './getAccessToken';
import { Fail400, Success200, Success201, Success202, Success203, Success204, UnAuthorised401 } from '../../services/statusCodes';
import { isUserInactiveWhenAppIsInForeground } from './isUserInactiveInForeground';
import axios from 'axios'
import { Alert } from 'react-native';
// import { fetch } from 'react-native-ssl-pinning';



export const GenericPostCall = async (dispatch, endpoint, body) => {
    console.log("🚀 ~ file: genericPostCall.js ~ line 21 ~ GenericPostCall ~ dispatch", dispatch)
    console.log("🚀 ~ file: genericPostCall.js ~ line 21 ~ GenericPostCall ~ endpoint",Endpoints.BaseUrl+endpoint)
    console.log("🚀 ~ file: genericPostCall.js ~ line 21 ~ GenericPostCall ~ body", body)
    try {
        await isUserInactiveWhenAppIsInForeground(null, endpoint, dispatch)
        await isUserInactiveWhenAppIsInForeground(new Date(), endpoint, dispatch)
        let token = null
        if (endpoint != Endpoints.Login && endpoint != Endpoints.ChkNameEmail && endpoint != Endpoints.CreateToken && endpoint != Endpoints.ForgottenPin
            && endpoint != Endpoints.ForceUpdate && endpoint != Endpoints.Verify_SSO_UserLogin && endpoint != Endpoints.GetClientConfig) {
            token = await CheckAccessTokenExpiryTime(endpoint)
        }

        await EncryptedStorage.setItem('isCreateTokenRequestMade', JSON.stringify(false))

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


        // console.log('TOKEN BANTHU:  ' + JSON.stringify(token))
        if (typeof (token) == 'undefined') {
            console.warn('TOKEN : UNDEFINED')
            dispatch(AuthActionCreator.isLoggedIn(false))
            dispatch(AuthActionCreator.isFirstTime(false))
            return
        }
        if (token == null) {
            // console.log('TOKEN :  NULL: ' + Endpoints.Verify_SSO_UserLogin+ endpoint)
            if (endpoint != Endpoints.Login && endpoint != Endpoints.ChkNameEmail && endpoint != Endpoints.CreateToken && endpoint != Endpoints.ForgottenPin
                && endpoint != Endpoints.ForceUpdate  ) {
                dispatch(AuthActionCreator.isLoggedIn(false))
                dispatch(AuthActionCreator.isFirstTime(false))
                return
            }

        }


        if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
            if (endpoint != Endpoints.ChkNameEmail && endpoint != Endpoints.EmailVerified && endpoint != Endpoints.VerifyOTP
                && endpoint != Endpoints.GetBalance
                && endpoint != Endpoints.GetHeroTiles && endpoint != Endpoints.GetSecondaryUsers && endpoint != Endpoints.GetGiftsRewards
                && endpoint != Endpoints.UpdateFCMToken && endpoint != Endpoints.ChkMobile && endpoint != Endpoints.CreateRegPIN &&
                endpoint != Endpoints.AcceptTNC && endpoint != Endpoints.UploadImage && endpoint != Endpoints.AddBrandToUser && endpoint != Endpoints.CreateToken
                && endpoint != Endpoints.UpdateFCMToken && endpoint != Endpoints.Login && endpoint != Endpoints.ChangePin && endpoint != Endpoints.ForgottenPin
                && endpoint != Endpoints.ForceUpdate && endpoint != Endpoints.GetClientConfig
            ) {

                await dispatch(OtherAPIActionCreator.getMaintainanceStatus())
                // await dispatch(OtherAPIActionCreator.GetConfigResponse())

                const res = await EncryptedStorage.getItem('email')
                if (res) {

                    const timeStamp = new Date().getTime()

                    const checkStatusSig = await GetSignature(Endpoints.CheckUserStatus, JSON.stringify({
                        EmailID: res,
                        Timestamp: timeStamp
                    }), refreshToken)

                    // console.log("checkStatusSig---",checkStatusSig)

                    const userStatusResponse = await fetch(Endpoints.BaseUrl + Endpoints.CheckUserStatus, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                            Signature: checkStatusSig
                        },
                        body: JSON.stringify({
                            EmailID: res,
                            Timestamp: timeStamp
                        }),
                        // pkPinning: true,
                        // disableAllSecurity: false,
                        // sslPinning: {
              // your certificates name (without extension), for example cert1.cer, cert2.cer
                        // certs: ["expcert","mycert"]
                        // certs : ["sha256/3wz3N6kiFmneYzatFTvyQZnOUslpeej7KonAzt8F6Qc="]
                        // }
                    })
                    console.log('STATUS',userStatusResponse)

                    // console.warn(Endpoints.CheckUserStatus + ':  ' + userStatusResponse.status)

                    if (userStatusResponse.status == Success200) {
                        dispatch(CCSActionCreator.isUserInactive(false))
                    }
                    else if (userStatusResponse.status == Success202) {
                        dispatch(CCSActionCreator.isUserInactive(false))
                        dispatch(AuthActionCreator.isLoggedIn(false))
                        dispatch(AuthActionCreator.isFirstTime(true))
                        return
                    } else if (userStatusResponse.status == Success201) {
                        dispatch(CCSActionCreator.isUserInactive(true))

                    }else if (userStatusResponse.status == Success203) {
                        dispatch(AuthActionCreator.isLoggedIn(false))
                        dispatch(AuthActionCreator.isFirstTime(true))

                    }else if (userStatusResponse.status == Success204) {
                        dispatch(AuthActionCreator.isLoggedIn(false))
                        dispatch(AuthActionCreator.isFirstTime(true))

                    }

                } else {
                    return
                }

            }
        }

        let jsonFromBody = null
        jsonFromBody = JSON.parse(body)
        Object.keys(jsonFromBody).push('Timestamp')

        if (typeof (jsonFromBody['user_id']) != 'undefined') {
            delete jsonFromBody['user_id']
        }
        if (typeof (jsonFromBody['UserID']) != 'undefined') {
            delete jsonFromBody['UserID']
        }
        if (typeof (jsonFromBody['PrimaryUserID']) != 'undefined') {
            delete jsonFromBody['PrimaryUserID']
        }
        if (typeof (jsonFromBody['SenderUserID']) != 'undefined') {
            delete jsonFromBody['SenderUserID']
        }


        jsonFromBody.Timestamp = new Date().getTime()

        let signature = null
        let header = null
        if (endpoint == Endpoints.Login) {
            
            let body = jsonFromBody
            jsonFromBody = null
            jsonFromBody = {
                email_id: body.email_id,
                Timestamp: new Date().getTime()
            }
            

            signature = await GetSignature(endpoint, JSON.stringify(jsonFromBody), body['mpin'])
            header = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Signature: signature
            }
            console.log('Alma Sig', signature, new Date().getTime())
        }

       else if (endpoint == Endpoints.Verify_SSO_UserLogin) {
            let body = jsonFromBody
            jsonFromBody = null
            jsonFromBody = {
                email_id: body.email_id,
                Timestamp: new Date().getTime()
            }

            signature = await GetSignature(endpoint, JSON.stringify(jsonFromBody))
            header = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Signature: signature
            }
            console.log('Alma Sig', signature, new Date().getTime())
        }

        else if (endpoint == Endpoints.ChkNameEmail || endpoint == Endpoints.CreateToken || endpoint == Endpoints.ForgottenPin
            || endpoint == Endpoints.ForceUpdate) {
            signature = await GetSignature(endpoint, JSON.stringify(jsonFromBody), endpoint == Endpoints.ChkNameEmail || endpoint == Endpoints.ForgottenPin || endpoint == Endpoints.ForceUpdate ? '' : refreshToken)
            console.log('Alma Sgi', signature)
            header = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Signature: signature
            }
        }
        else {
            signature = await GetSignature(endpoint, JSON.stringify(jsonFromBody), refreshToken)
            header = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                Signature: signature
            }
        }

        // console.warn(Endpoints.BaseUrl + endpoint)

        const response = await fetch(Endpoints.BaseUrl + endpoint, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(jsonFromBody),
            // pkPinning: true,
            // disableAllSecurity: false,
            // sslPinning: {
  // your certificates name (without extension), for example cert1.cer, cert2.cer
            // certs: ["expcert","mycert"]
            // certs : ["sha256/3wz3N6kiFmneYzatFTvyQZnOUslpeej7KonAzt8F6Qc="]
            // }
        })

        // console.warn(endpoint + ': Status: ' + response.status + 'HEADER: ' + JSON.stringify(header))

        // const response = await axios({
        //     method: 'POST',
        //     url: Endpoints.BaseUrl + endpoint,
        //     // timeout: 1000 * 20, // Wait for 20 seconds
        //     // withCredentials: true,
        //     data:JSON.stringify(jsonFromBody),
        //     headers: header
        // })

        // console.warn(endpoint + '   ' + response.status)


        let shouldAddStatusParameter = false
        let shouldparseResponse = true

        if (endpoint == Endpoints.SaveAlert || endpoint == Endpoints.GetAlertStatus || endpoint == Endpoints.SwitchTimeConsent
            || endpoint == Endpoints.RequestTimeConsent || endpoint == Endpoints.GetTimeConsentStatus || endpoint == Endpoints.RequestFeedback
            || endpoint == Endpoints.ShopClickAPI || endpoint == Endpoints.SubmitRewardClaim || endpoint == Endpoints.Login
            || endpoint == Endpoints.ForgottenPin || endpoint == Endpoints.ChangePin || endpoint == Endpoints.ForgottenPin || endpoint == Endpoints.RequestGiftcard
            || endpoint == Endpoints.RequestWoolworth || endpoint == Endpoints.TransferMoney || endpoint == Endpoints.RequestDigiCard
            || endpoint == Endpoints.GetSecondaryUsers || endpoint == Endpoints.SetTarget || endpoint == Endpoints.GetUserProfile
            || endpoint == Endpoints.GetBalance || endpoint == Endpoints.EditProfile || endpoint == Endpoints.EditEmail
            || endpoint == Endpoints.EditMobile || endpoint == Endpoints.ForceUpdate || endpoint == Endpoints.GetNotifications
            || endpoint == Endpoints.NotificationSeen || endpoint == Endpoints.NotificationDelete || endpoint == Endpoints.GetBankDetails
            || endpoint == Endpoints.DeleteBankDetails || endpoint == Endpoints.AddUpdateBankDetails || endpoint == Endpoints.DeleteUser
            || endpoint == Endpoints.RemoveSecondaryUsers || endpoint == Endpoints.ChkNameEmail || endpoint == Endpoints.EmailVerified
            || endpoint == Endpoints.ChkMobile || endpoint == Endpoints.MobileVerified || endpoint == Endpoints.CreateRegPIN
            || endpoint == Endpoints.AcceptTNC || endpoint == Endpoints.UploadImage || endpoint == Endpoints.GetTermsNCondition
            || endpoint == Endpoints.GetPrivacyPolicy || endpoint == Endpoints.AddBrandToUser || endpoint == Endpoints.VerifyOTP) {

            shouldAddStatusParameter = true

        }

        if (endpoint == Endpoints.SaveAlert || endpoint == Endpoints.SwitchTimeConsent
            || endpoint == Endpoints.RequestFeedback
            || endpoint == Endpoints.ShopClickAPI || endpoint == Endpoints.SubmitRewardClaim
            || endpoint == Endpoints.RequestGiftcard || endpoint == Endpoints.SetTarget || endpoint == Endpoints.EditProfile
            || endpoint == Endpoints.NotificationSeen || endpoint == Endpoints.NotificationDelete
            || endpoint == Endpoints.DeleteBankDetails || endpoint == Endpoints.AddUpdateBankDetails || endpoint == Endpoints.DeleteUser
            || endpoint == Endpoints.RemoveSecondaryUsers || endpoint == Endpoints.EmailVerified || endpoint == Endpoints.ChkMobile
            || endpoint == Endpoints.MobileVerified || endpoint == Endpoints.CreateRegPIN || endpoint == Endpoints.AcceptTNC || endpoint == Endpoints.UploadImage
            || endpoint == Endpoints.AddBrandToUser || endpoint == Endpoints.VerifyOTP || endpoint == Endpoints.UpdateFCMToken

        ) {

            shouldparseResponse = false

        }

        var neverInitialised;
        if (response.status == Success200) {
            if (endpoint == Endpoints.VerifyOTP) {
                const apiResponse = await response.json()
                return apiResponse
                // dispatch(CCSActionCreator.isUserInactive(false))
                // await EncryptedStorage.setItem('isPrimaryUser', JSON.stringify(true))
            }
            if (endpoint == Endpoints.Login) {
                dispatch(CCSActionCreator.isUserInactive(false))
                await EncryptedStorage.setItem('isPrimaryUser', JSON.stringify(true))
            }
            if (shouldparseResponse) {
                const apiResponse = await response.json()
                // console.warn('RESPONSE 200: ' + JSON.stringify(response))
                jsonFromBody = null
                signature = null
                let modifiedResponse = apiResponse
                modifiedResponse.Status = 'Success'
                // console.warn('RESPONSE:  ' + 'TYPE: ' + typeof (modifiedResponse) + endpoint + '       ' + JSON.stringify(modifiedResponse) + '  URL:  ' + Endpoints.BaseUrl + endpoint)
//              if(endpoint == Endpoints.VerifyOTP){
// return apiResponse
//              } else {
                return modifiedResponse
            //  }
            } else {
                return { Status: 'Success' }
                
            }

        }
        else if (response.status == Success201) {
            if (endpoint == Endpoints.Login) {
                dispatch(CCSActionCreator.isUserInactive(true))
                await EncryptedStorage.setItem('isPrimaryUser', JSON.stringify(true))
                const apiResponse = await response.json()
                // console.warn('RESPONSE 200: ' + JSON.stringify(response))
                jsonFromBody = null
                signature = null
                let modifiedResponse = apiResponse
                modifiedResponse.Status = 'Success'
                // console.warn('RESPONSE:  ' + 'TYPE: ' + typeof (modifiedResponse) + endpoint + '       ' + JSON.stringify(modifiedResponse) + '  URL:  ' + Endpoints.BaseUrl + endpoint)
                return modifiedResponse
            }
        }
        else if (response.status == Success202) {
            if (endpoint == Endpoints.Login || endpoint == Endpoints.ChkNameEmail) {
                dispatch(CCSActionCreator.isUserInactive(false))
                await EncryptedStorage.setItem('isPrimaryUser', JSON.stringify(false))
                const apiResponse = await response.json()
                // console.warn('RESPONSE 200: ' + JSON.stringify(response))
                jsonFromBody = null
                signature = null
                let modifiedResponse = apiResponse
                modifiedResponse.Status = 'Success'
                // console.warn('RESPONSE:  ' + 'TYPE: ' + typeof (modifiedResponse) + endpoint + '       ' + JSON.stringify(modifiedResponse) + '  URL:  ' + Endpoints.BaseUrl + endpoint)
                return modifiedResponse
            }
        }
        else if (response.status == UnAuthorised401) {
            return neverInitialised
        }
        else if (response.status == Fail400) {
            let modifiedResponse = undefined
            if (shouldAddStatusParameter) {
                if (endpoint == Endpoints.ChkNameEmail || endpoint == Endpoints.Login || endpoint == Endpoints.ChangePin || endpoint == Endpoints.ForgottenPin) {
                    const apiResponse = await response.json()
                    modifiedResponse = apiResponse
                    modifiedResponse.Status = 'Fail'
                    // console.warn(JSON.stringify(modifiedResponse))
                    return modifiedResponse
                } else {
                    return { Status: 'Fail' }
                }
            }
            return neverInitialised
        }


    } catch (error) {
        console.warn('Error:   ' + endpoint + '       ' + body + '      ' + error.toString() + '  URL:    ' + Endpoints.BaseUrl + endpoint)
        return {
            error: error.toString()
        }
    }
}

export const GenericGetCall = async (endpoint, dispatch) => {
console.log("endpoint==========",endpoint)
    try {

        await isUserInactiveWhenAppIsInForeground(null, endpoint, dispatch)
        await isUserInactiveWhenAppIsInForeground(new Date(), endpoint, dispatch)

        const token = await CheckAccessTokenExpiryTime(endpoint)

        await EncryptedStorage.setItem('isCreateTokenRequestMade', JSON.stringify(false))

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

        const signature = await GetSignature(endpoint, null, refreshToken)
        // console.log('signature is',signature)
        // console.log('token is',token)

        if (typeof (token) == 'undefined') {
            console.warn('GET TOKEN UNDEFINED')
            dispatch(AuthActionCreator.isLoggedIn(false))
            dispatch(AuthActionCreator.isFirstTime(false))
            return
        }
        if (token == null) {
            console.warn('GET TOKEN NULL')
            dispatch(AuthActionCreator.isLoggedIn(false))
            dispatch(AuthActionCreator.isFirstTime(false))
            return
        }
        let header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Signature: signature

        }
        console.log("header===========",header,"====",endpoint)
        const response = await fetch(Endpoints.BaseUrl + endpoint, {
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
        console.log('response 101',response)
        console.log('response is--------------',Endpoints.BaseUrl + endpoint, header)

        // console.warn(endpoint + '   ' + response.status + 'HEADER: ' + JSON.stringify(header))

        var neverinitialisedGet;

        if (response.status == Success200) {
            const apiResponse = await response.json()
            // console.warn(endpoint + '   ' + JSON.stringify(apiResponse))
            if (endpoint == Endpoints.GetTermsNCondition || endpoint == Endpoints.GetPrivacyPolicy) {
                apiResponse.Status = 'Success'
            }

            return apiResponse
        }
        else if (response.status == UnAuthorised401) {
            return neverinitialisedGet
        }
        else if (response.status == Fail400) {
            return neverinitialisedGet
        }



    } catch (error) {
        return {
            error: error.toString()
        }
    }
}

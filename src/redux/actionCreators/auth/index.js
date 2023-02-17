import { ActionTypes } from '../../actionTypes/index'
import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import { Alert } from 'react-native';



export const AuthActionCreator = {
    isFirstTime: (val) => async (dispatch, getState) => {
        console.log("🚀 ~ file: index.js ~ line 11 ~ isFirstTime: ~ val", val)
        dispatch({ type: ActionTypes.IS_FIRST_LAUNCH_REQUEST })
        try {

            if (val != null) {
                await EncryptedStorage.setItem('isFirstTime', JSON.stringify(val))
                
            }
            EncryptedStorage.getItem('isFirstTime', async (res, err) => {
                if (res == 'true' || res == null) {
                    dispatch({ type: ActionTypes.IS_FIRST_LAUNCH_RESPONSE, payload: true })
                } else {
                    dispatch({ type: ActionTypes.IS_FIRST_LAUNCH_RESPONSE, payload: false })
                }
                if (err) {
                    dispatch({ type: ActionTypes.IS_FIRST_LAUNCH_RESPONSE, payload: true })
                }
            })
        }
        catch (e) {
            dispatch({ type: ActionTypes.IS_FIRST_LAUNCH_RESPONSE, payload: e, error: true })
        }
    },
    isLoggedIn: (val) => async (dispatch, getState) => {
        console.log("🚀 ~ file: index.js ~ line 34 ~ isLoggedIn: ~ val", val)
        
        dispatch({ type: ActionTypes.IS_LOGGED_IN_REQUEST })
        try {

            if (val != null) {
                await EncryptedStorage.setItem('isLoggedIn', JSON.stringify(val))
                if(!val){
                    dispatch(AuthActionCreator.resetAll())
                    await EncryptedStorage.setItem('sessionToken', '')
                    await EncryptedStorage.setItem('timeWhenGotAccessToken', '')
                }
            }
            EncryptedStorage.getItem('isLoggedIn', async (res, err) => {
                if (res == 'true') {
                    dispatch({ type: ActionTypes.IS_LOGGED_IN_RESPONSE, payload: true })
                } else {
                    dispatch({ type: ActionTypes.IS_LOGGED_IN_RESPONSE, payload: false })
                    dispatch(AuthActionCreator.resetAll())
                }
                if (err) {
                    dispatch({ type: ActionTypes.IS_LOGGED_IN_RESPONSE, payload: false })
                    dispatch(AuthActionCreator.resetAll())
                }
            })
        }
        catch (e) {
            dispatch({ type: ActionTypes.IS_LOGGED_IN_RESPONSE, payload: e, error: true })
        }
    },

    isTouchIdEnabled: (val,email) => async (dispatch, getState) => {
        dispatch({ type: ActionTypes.IS_TOUCHID_ENABLED_REQUEST })
        try {

            console.warn(val,email)

            if (val != null) {
                await EncryptedStorage.setItem(email.toString(), JSON.stringify(val))
            }
            EncryptedStorage.getItem(email.toString(), async (res, err) => {
                if (typeof(res) != 'undefined') {
                    if(res != null){
                        if(res.length > 3){
                            dispatch({ type: ActionTypes.IS_TOUCHID_ENABLED_RESPONSE, payload: true })
                        }else {
                            dispatch({ type: ActionTypes.IS_TOUCHID_ENABLED_RESPONSE, payload: false })
                        }
                    }else {
                        dispatch({ type: ActionTypes.IS_TOUCHID_ENABLED_RESPONSE, payload: false })
                    }
                    
                } else {
                    dispatch({ type: ActionTypes.IS_TOUCHID_ENABLED_RESPONSE, payload: false })
                }
                if (err) {
                    dispatch({ type: ActionTypes.IS_TOUCHID_ENABLED_RESPONSE, payload: false })
                }
            })
        }
        catch (e) {
            dispatch({ type: ActionTypes.IS_TOUCHID_ENABLED_RESPONSE, payload: e, error: true })
        }
    },

    resetIsTouchIdEnabled: () => async (dispatch, getState) => {

        var variableUndefined;

        try {
            dispatch({ type: ActionTypes.IS_TOUCHID_ENABLED_RESET, payload: {} })
        }
        catch (e) {

        }
    },
    resetAll: () => async (dispatch, getState) => {

        var variableUndefined;

        try {
            dispatch({ type: ActionTypes.LOGIN_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.Get_OFFERS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.SAVE_OFFERS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.SHOP_CLICKED_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_SAVE_OFFERS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_REWARD_CAT_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_REWARD_DETAILS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_MATCHED_CONTACTS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_POINTS_BALANCE_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.REDEEM_GIFT_CARD_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_PROFILE_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.EDIT_PROFILE_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_FAV_BRANDS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_GIFTS_REWARDS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_FOOD_AND_WINE_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.PURCHASE_FOOD_POS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_BANK_DETAILS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.SEND_MONEY_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.REQUEST_MONEY_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.NOTIFICATIONS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.APPROVE_MONEY_REQUEST_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.MAKE_PAYMENT_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_HISTORY_POINTS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_HISTORY_MONEY_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.POINTS_TRANSFER_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.UPDATE_FCM_TOKEN_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.FORCE_UPDATE_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_NOTIFICATION__RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.NOTIFICATION_SEEN_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.NOTIFICATION_DELETE_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_MAINTAINANCE_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_WOOLWORTH_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_DEVICES_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_ACCESSORIES_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.CREATE_COMMUNITY_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_COMMUNITIES_BY_USER_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_ALL_COMMUNITIES_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_ALERT_STATUS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.SAVE_ALERT_STATUS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.REQUEST_TIME_CONSENT_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_LOCATION_SERVICES_STATUS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_USER_STATUS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.POST_COMMENTS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.JOIN_COMMUNITY_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.EDIT_COMMUNITY_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_TIME_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_TIME_CONSENT_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.SET_TIME_CONSENT_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.SEND_MESSAGE_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_MESSAGE_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_CHAT_ID_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_CHAT_THREAD_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.SET_TARGET_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_SECONDARY_USERS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.ADD_SECONDARY_USERS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.REMOVE_SECONDARY_USERS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_FEEDBACK_TITLES_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.SUBMIT_FEEDBACK_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_CALL_DETAILS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_DAILY_OFFERS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_POPULAR_OFFERS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_CHALLENGES_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_HERO_TILES_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_HERO_TILES_OFFERS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_CLICK_HISTORY_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.SUBMIT_REWARD_CLAIM_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.TRANSFER_TO_BANK_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.CHANGE_PIN_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.REFERRAL_CODE_VERIFICATION_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.REFERRAL_CODE_GENERATE_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.GET_REFERRAL_CODE_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.ADD_UPDATE_BANK_DETAILS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.DELETE_BANK_DETAILS_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.EDIT_EMAIL_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.EDIT_MOBILE_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.DELETE_USER_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.TRANSFER_TO_MASTER_CARD_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.OFFER_WITH_RETAILER_NAME_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_HELP_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_PROFILE_RESET, payload: variableUndefined })
            dispatch({ type: ActionTypes.HAS_APP_SWITCHED_TO_FOREGROUND_AFTER_SPECIFIED_TIME_RESET, payload: variableUndefined })








        }
        catch (e) {

        }
    },
}

import { ActionTypes } from '../../../actionTypes';
import * as Endpoints from '../../../../services/endPoints'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { GenericGetCall, GenericPostCall } from '../../genericPostCall';
import { RewardsActionCreator } from '../rewards';
import { TopUpActionCreator } from '../topup';
import { AuthActionCreator } from '../../auth';
import { OFFERSCATEGORIES } from '../../../../constants';
import { Alert } from 'react-native';

export const CCSActionCreator = {

    // Is primary user
    isPrimaryUser: () => async (dispatch, getState) => {
        
        dispatch({ type: ActionTypes.IS_PRIMARY_REQUEST })
        try {
            EncryptedStorage.getItem('isPrimaryUser', (res, err) => {

                if (res == null || res == 'true') {

                    dispatch({ type: ActionTypes.IS_PRIMARY_REPONSE, payload: true })
                } else {

                    dispatch({ type: ActionTypes.IS_PRIMARY_REPONSE, payload: false })
                }
            })

        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.IS_PRIMARY_REPONSE, payload: e, error: true })
        }
    },

    // Is Inactive user
    isUserInactive: (val) => async (dispatch, getState) => {

        dispatch({ type: ActionTypes.GET_USER_STATUS_REQUEST })
        try {
            if (val != null) {
                await EncryptedStorage.setItem('isUserInactive', JSON.stringify(val))
            }
            EncryptedStorage.getItem('isUserInactive', async (res, err) => {
                if (res == 'true') {
                    dispatch({ type: ActionTypes.GET_USER_STATUS_RESPONSE, payload: true })
                } else {
                    dispatch({ type: ActionTypes.GET_USER_STATUS_RESPONSE, payload: false })
                }
                if (err) {
                    dispatch({ type: ActionTypes.GET_USER_STATUS_RESPONSE, payload: false })
                }
                if (typeof (res) == 'undefined') {
                    dispatch({ type: ActionTypes.GET_USER_STATUS_RESPONSE, payload: false })
                }
                if (res == null) {
                    dispatch({ type: ActionTypes.GET_USER_STATUS_RESPONSE, payload: false })
                }
            })

        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.GET_USER_STATUS_RESPONSE, payload: e, error: true })
        }
    },

    //Set Target
    settarget: (userId, targetAmount, goalName) => async (dispatch, getState) => {
        
        dispatch({ type: ActionTypes.SET_TARGET_REQUEST })
        try {
            const apiResponse = await GenericPostCall(dispatch, Endpoints.SetTarget, JSON.stringify({
                UserID: userId,
                TargetAmount: targetAmount,
                GoalName: goalName
            }))

            //   console.warn('TARGET: '+JSON.stringify(apiResponse))
            dispatch(RewardsActionCreator.getPointsBalance(userId))
            dispatch({ type: ActionTypes.SET_TARGET_REPONSE, payload: apiResponse })
        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.SET_TARGET_REPONSE, payload: e, error: true })
        }
    },

    //get secondary users list
    getSecondaryUsers: (userId) => async (dispatch, getState) => {
        
        dispatch({ type: ActionTypes.GET_SECONDARY_USERS_REQUEST })
        try {
            const apiResponse = await GenericPostCall(dispatch, Endpoints.GetSecondaryUsers, JSON.stringify({
                PrimaryUserID: userId
            }))

            console.warn('SECONDARY USERS: '+JSON.stringify(apiResponse))

            dispatch({ type: ActionTypes.GET_SECONDARY_USERS_REPONSE, payload: apiResponse })
        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.GET_SECONDARY_USERS_REPONSE, payload: e, error: true })
        }
    },

    //add secondary users
    addSecondaryUsers: (userId, fName, lName, email, mobile) => async (dispatch, getState) => {

        dispatch({ type: ActionTypes.ADD_SECONDARY_USERS_REQUEST })
        try {
            const apiResponse = await GenericPostCall(dispatch, Endpoints.AddSecondaryUsers, JSON.stringify({
                PrimaryUserID: userId,
                SecondaryUserList: [
                    {
                        FirstName: fName,
                        LastName: lName,
                        Email: email,
                        Mobile: mobile
                    }
                ]
            }))

            dispatch({ type: ActionTypes.ADD_SECONDARY_USERS_REPONSE, payload: apiResponse })
        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.ADD_SECONDARY_USERS_REPONSE, payload: e, error: true })
        }
    },

    //remove secondary users
    removeSecondaryUsers: (primaryUserId, secondaryuserId) => async (dispatch, getState) => {

        dispatch({ type: ActionTypes.REMOVE_SECONDARY_USERS_REQUEST })
        try {
            const apiResponse = await GenericPostCall(dispatch, Endpoints.RemoveSecondaryUsers, JSON.stringify({
                PrimaryUserID: primaryUserId,
                SecondaryUserID: secondaryuserId
            }))

            //   console.warn('DELETE SECONDARY: '+JSON.stringify(apiResponse))

            dispatch(CCSActionCreator.getSecondaryUsers(primaryUserId))
            dispatch({ type: ActionTypes.REMOVE_SECONDARY_USERS_REPONSE, payload: apiResponse })
        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.REMOVE_SECONDARY_USERS_REPONSE, payload: e, error: true })
        }
    },

    //get feedback titles
    getFeedbackTitles: () => async (dispatch, getState) => {

        dispatch({ type: ActionTypes.GET_FEEDBACK_TITLES_REQUEST })
        try {
            const apiResponse = await GenericGetCall(Endpoints.GetFeedbackTitles, dispatch)

            dispatch({ type: ActionTypes.GET_FEEDBACK_TITLES_REPONSE, payload: apiResponse })
        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.GET_FEEDBACK_TITLES_REPONSE, payload: e, error: true })
        }
    },

    //get call details
    getCallDetails: () => async (dispatch, getState) => {

        dispatch({ type: ActionTypes.GET_CALL_DETAILS_REQUEST })
        try {
            const apiResponse = await GenericGetCall(Endpoints.GetCallDetails, dispatch)

            dispatch({ type: ActionTypes.GET_CALL_DETAILS_REPONSE, payload: apiResponse })
        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.GET_CALL_DETAILS_REPONSE, payload: e, error: true })
        }
    },

    //submit feedback
    submitFeedback: (userId, titleId, desc) => async (dispatch, getState) => {

        dispatch({ type: ActionTypes.SUBMIT_FEEDBACK_REQUEST })
        try {
            const apiResponse = await GenericPostCall(dispatch, Endpoints.RequestFeedback, JSON.stringify({
                UserID: userId,
                Description: desc
            }))


            dispatch({ type: ActionTypes.SUBMIT_FEEDBACK_REPONSE, payload: apiResponse })
        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.SUBMIT_FEEDBACK_REPONSE, payload: e, error: true })
        }
    },

    //Transfer to bank
    transferToBank: (amount) => async (dispatch, getState) => {

        dispatch({ type: ActionTypes.TRANSFER_TO_BANK_REQUEST })
        try {
            const apiResponse = await GenericPostCall(dispatch, Endpoints.TransferMoney, JSON.stringify({
                Amount: amount.toString()
            }))
            dispatch(RewardsActionCreator.getPointsBalance('No Userid'))
            dispatch({ type: ActionTypes.TRANSFER_TO_BANK_REPONSE, payload: apiResponse })
        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.TRANSFER_TO_BANK_REPONSE, payload: e, error: true })
        }
    },

    //Referralcode Generation
    generateReferralCode: (userId) => async (dispatch, getState) => {

        dispatch({ type: ActionTypes.REFERRAL_CODE_GENERATE_REQUEST })
        try {
            const apiResponse = await GenericPostCall(dispatch, Endpoints.GenerateCode, JSON.stringify({
                PrimaryUserID: userId
            }))

            //   console.warn(JSON.stringify(apiResponse))


            dispatch(CCSActionCreator.getReferralCode(userId))
            dispatch({ type: ActionTypes.REFERRAL_CODE_GENERATE_RESPONSE, payload: apiResponse })
        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.REFERRAL_CODE_GENERATE_RESPONSE, payload: e, error: true })
        }
    },

    //Get Referralcode
    getReferralCode: (userId) => async (dispatch, getState) => {

        dispatch({ type: ActionTypes.GET_REFERRAL_CODE_REQUEST })
        try {
            const apiResponse = await GenericPostCall(dispatch, Endpoints.GetReferralCode, JSON.stringify({
                PrimaryUserID: userId
            }))

            dispatch({ type: ActionTypes.GET_REFERRAL_CODE_RESPONSE, payload: apiResponse })
        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.GET_REFERRAL_CODE_RESPONSE, payload: e, error: true })
        }
    },

    //Add update bank details
    addUpdateBankDetails: (userId, name, accNum, bsb, email) => async (dispatch, getState) => {

        dispatch({ type: ActionTypes.ADD_UPDATE_BANK_DETAILS_REQUEST })
        try {
            const apiResponse = await GenericPostCall(dispatch, Endpoints.AddUpdateBankDetails, JSON.stringify({
                // SenderUserID:userId,
                UserName: name,
                AccountNumber: accNum,
                BranchCode: bsb,
                UserEmail: email

            }))



            dispatch(TopUpActionCreator.getBankDetails(userId))
            dispatch({ type: ActionTypes.ADD_UPDATE_BANK_DETAILS_RESPONSE, payload: apiResponse })
            dispatch(CCSActionCreator.resetResponse('11'))
        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.ADD_UPDATE_BANK_DETAILS_RESPONSE, payload: e, error: true })
        }
    },

    //Delete  bank details
    deleteBankDetails: (userId) => async (dispatch, getState) => {

        dispatch({ type: ActionTypes.DELETE_BANK_DETAILS_REQUEST })
        try {
            const apiResponse = await GenericPostCall(dispatch, Endpoints.DeleteBankDetails, JSON.stringify({
                user_id: userId

            }))



            dispatch(TopUpActionCreator.getBankDetails(userId))
            dispatch({ type: ActionTypes.DELETE_BANK_DETAILS_RESPONSE, payload: apiResponse })
        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.DELETE_BANK_DETAILS_RESPONSE, payload: e, error: true })
        }
    },


    //Referralcode verification
    verifyReferralCode: (userId, email, referralCode) => async (dispatch, getState) => {

        dispatch({ type: ActionTypes.REFERRAL_CODE_VERIFICATION_REQUEST })
        try {
            const apiResponse = await GenericPostCall(dispatch, Endpoints.VerifyReferralCode, JSON.stringify({
                UserID: userId,
                Email: email,
                ReferralCode: referralCode
            }))


            dispatch({ type: ActionTypes.REFERRAL_CODE_VERIFICATION_RESPONSE, payload: apiResponse })
        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.REFERRAL_CODE_VERIFICATION_RESPONSE, payload: e, error: true })
        }
    },

    //permamnently delete user
    permanentlyDeleteUser: (userId) => async (dispatch, getState) => {

        dispatch({ type: ActionTypes.DELETE_USER_REQUEST })
        try {
            const apiResponse = await GenericPostCall(dispatch, Endpoints.DeleteUser, JSON.stringify({
                UserID: userId
            }))


            dispatch({ type: ActionTypes.DELETE_USER_RESPONSE, payload: apiResponse })
        }
        catch (e) {
            console.log('/////...../////ERROR: ' + e.toString())
            dispatch({ type: ActionTypes.DELETE_USER_RESPONSE, payload: e, error: true })
        }
    },

    //offer with retailer name
    offerWithRetailerName: (val) => async (dispatch, getState) => {
        dispatch({ type: ActionTypes.OFFER_WITH_RETAILER_NAME_REQUEST })
        try {

            if (val != null) {
                await EncryptedStorage.setItem('retailerName', val)
            }
            EncryptedStorage.getItem('retailerName', async (res, err) => {

                if (res) {
                    dispatch({ type: ActionTypes.OFFER_WITH_RETAILER_NAME_RESPONSE, payload: res })
                } else {
                    dispatch({ type: ActionTypes.OFFER_WITH_RETAILER_NAME_RESPONSE, payload: null })
                }
            })
        }
        catch (e) {
            dispatch({ type: ActionTypes.OFFER_WITH_RETAILER_NAME_RESPONSE, payload: e, error: true })
        }
    },

    

    //offer with category name
    offerWithCategoryName: (val) => async (dispatch, getState) => {
        dispatch({ type: ActionTypes.OFFER_WITH_CATEGORY_NAME_REQUEST })
        dispatch(CCSActionCreator.resetResponse('15'))
        try {

            if (val != null) {
                let catName = ''
                switch (val) {
                    case 'gotoarts':
                        catName = OFFERSCATEGORIES.Arts_Photography
                        break;
                    case 'gotoauto':
                        catName = OFFERSCATEGORIES.Auto_Accessories
                        break;
                    case 'gotobaby':
                        catName = OFFERSCATEGORIES.Baby_Childern
                        break;
                    case 'gotobusiness':
                        catName = OFFERSCATEGORIES.Business_Work
                        break;
                    case 'gotocosmetics':
                        catName = OFFERSCATEGORIES.Cosmetics
                        break;
                    case 'gotoentertainment':
                        catName = OFFERSCATEGORIES.Entertainment
                        break;
                    case 'gotofashion':
                        catName = OFFERSCATEGORIES.Fashion
                        break;
                    case 'gotofitness':
                        catName = OFFERSCATEGORIES.Fitness_Sports
                        break;
                    case 'gotogifts':
                        catName = OFFERSCATEGORIES.Flower_Gift
                        break;
                    case 'gotofood':
                        catName = OFFERSCATEGORIES.Food_Wine
                        break;
                    case 'gotohealth':
                        catName = OFFERSCATEGORIES.Health_Beauty
                        break;
                    case 'gotohome':
                        catName = OFFERSCATEGORIES.Home_Lifestyle
                        break;
                    case 'gotopet':
                        catName = OFFERSCATEGORIES.Pet
                        break;
                    case 'gototech':
                        catName = OFFERSCATEGORIES.Technology
                        break;
                    case 'gototravel':
                        catName = OFFERSCATEGORIES.Travel_Accomodation
                        break;
                    case 'gotooffers':
                        catName = OFFERSCATEGORIES.All
                        break;

                    default:
                        break;
                }
                await EncryptedStorage.setItem('categoryName', catName)
            }
            EncryptedStorage.getItem('categoryName', async (res, err) => {

                if (res) {
                    dispatch({ type: ActionTypes.OFFER_WITH_CATEGORY_NAME_RESPONSE, payload: res })
                } else {
                    dispatch({ type: ActionTypes.OFFER_WITH_CATEGORY_NAME_RESPONSE, payload: null })
                }
            })
        }
        catch (e) {
            dispatch({ type: ActionTypes.OFFER_WITH_CATEGORY_NAME_RESPONSE, payload: e, error: true })
        }
    },

    //should move to help
    shouldNavigateToHelp: (val) => async (dispatch, getState) => {
        dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_HELP_REQUEST })
        try {

            if (val != null) {
                await EncryptedStorage.setItem('shouldnavigateToHelp', JSON.stringify(val))
            }
            EncryptedStorage.getItem('shouldnavigateToHelp', async (res, err) => {
                if (res == 'true') {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_HELP_RESPONSE, payload: true })
                } else {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_HELP_RESPONSE, payload: false })
                }
                if (err) {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_HELP_RESPONSE, payload: false })
                }
            })
        }
        catch (e) {
            dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_HELP_RESPONSE, payload: e, error: true })
        }
    },

    //should move to rewards
    shouldNavigateToRewards: (val) => async (dispatch, getState) => {
        dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_REWARDS_REQUEST })
        try {

            if (val != null) {
                await EncryptedStorage.setItem('shouldnavigateToRewards', JSON.stringify(val))
            }
            EncryptedStorage.getItem('shouldnavigateToRewards', async (res, err) => {
                if (res == 'true') {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_REWARDS_RESPONSE, payload: true })
                } else {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_REWARDS_RESPONSE, payload: false })
                }
                if (err) {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_REWARDS_RESPONSE, payload: false })
                }
            })
        }
        catch (e) {
            dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_REWARDS_RESPONSE, payload: e, error: true })
        }
    },

    //should move to digital master card
    shouldNavigateToDigitalMasterCard: (val) => async (dispatch, getState) => {
        dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_DIGITAL_MASTER_CARD_REQUEST })
        try {

            if (val != null) {
                await EncryptedStorage.setItem('shouldnavigateToDigitalMasterCard', JSON.stringify(val))
            }
            EncryptedStorage.getItem('shouldnavigateToDigitalMasterCard', async (res, err) => {
                if (res == 'true') {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_DIGITAL_MASTER_CARD_RESPONSE, payload: true })
                } else {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_DIGITAL_MASTER_CARD_RESPONSE, payload: false })
                }
                if (err) {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_DIGITAL_MASTER_CARD_RESPONSE, payload: false })
                }
            })
        }
        catch (e) {
            dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_DIGITAL_MASTER_CARD_RESPONSE, payload: e, error: true })
        }
    },

    //should move to history
    shouldNavigateToHistory: (val) => async (dispatch, getState) => {
        dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_HISTORY_REQUEST })
        try {

            if (val != null) {
                await EncryptedStorage.setItem('shouldnavigateToHistory', JSON.stringify(val))
            }
            EncryptedStorage.getItem('shouldnavigateToHistory', async (res, err) => {
                if (res == 'true') {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_HISTORY_RESPONSE, payload: true })
                } else {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_HISTORY_RESPONSE, payload: false })
                }
                if (err) {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_HISTORY_RESPONSE, payload: false })
                }
            })
        }
        catch (e) {
            dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_HISTORY_RESPONSE, payload: e, error: true })
        }
    },

    //should move to settings
    shouldNavigateToSettings: (val) => async (dispatch, getState) => {
        dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_SETTINGS_REQUEST })
        try {

            if (val != null) {
                await EncryptedStorage.setItem('shouldnavigateToSettings', JSON.stringify(val))
            }
            EncryptedStorage.getItem('shouldnavigateToSettings', async (res, err) => {
                if (res == 'true') {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_SETTINGS_RESPONSE, payload: true })
                } else {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_SETTINGS_RESPONSE, payload: false })
                }
                if (err) {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_SETTINGS_RESPONSE, payload: false })
                }
            })
        }
        catch (e) {
            dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_SETTINGS_RESPONSE, payload: e, error: true })
        }
    },

    //should move to privacy policy
    shouldNavigateToPrivacyPolicy: (val) => async (dispatch, getState) => {
        dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_PRIVACY_POLICY_REQUEST })
        try {

            if (val != null) {
                await EncryptedStorage.setItem('shouldnavigateToPrivacyPolicy', JSON.stringify(val))
            }
            EncryptedStorage.getItem('shouldnavigateToPrivacyPolicy', async (res, err) => {
                if (res == 'true') {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_PRIVACY_POLICY_RESPONSE, payload: true })
                } else {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_PRIVACY_POLICY_RESPONSE, payload: false })
                }
                if (err) {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_PRIVACY_POLICY_RESPONSE, payload: false })
                }
            })
        }
        catch (e) {
            dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_PRIVACY_POLICY_RESPONSE, payload: e, error: true })
        }
    },

    //should move to terms
    shouldNavigateToTerms: (val) => async (dispatch, getState) => {
        dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_TERMS_REQUEST })
        try {

            if (val != null) {
                await EncryptedStorage.setItem('shouldnavigateToTerms', JSON.stringify(val))
            }
            EncryptedStorage.getItem('shouldnavigateToTerms', async (res, err) => {
                if (res == 'true') {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_TERMS_RESPONSE, payload: true })
                } else {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_TERMS_RESPONSE, payload: false })
                }
                if (err) {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_TERMS_RESPONSE, payload: false })
                }
            })
        }
        catch (e) {
            dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_TERMS_RESPONSE, payload: e, error: true })
        }
    },

    //should move to profile
    shouldNavigateToProfile: (val) => async (dispatch, getState) => {
        dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_PROFILE_REQUEST })
        try {

            if (val != null) {
                
                await EncryptedStorage.setItem('shouldnavigateToProfile', JSON.stringify(val))
                
            }
            EncryptedStorage.getItem('shouldnavigateToProfile', async (res, err) => {
                if (res == 'true') {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_PROFILE_RESPONSE, payload: true })
                } else {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_PROFILE_RESPONSE, payload: false })
                }
                if (err) {
                    dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_PROFILE_RESPONSE, payload: false })
                }
            })
        }
        catch (e) {
            dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_PROFILE_RESPONSE, payload: e, error: true })
        }
    },

    //has app switched to foreground after specified time
    hasAppSwitchedToForegroundAfterSpecifiedTime: (isForeground, val,shouldReturn) => async (dispatch, getState) => {
        // dispatch({type:ActionTypes.HAS_APP_SWITCHED_TO_FOREGROUND_AFTER_SPECIFIED_TIME_REQUEST})
        try {

            if (val != null && isForeground) {
                let today = new Date();
                let date = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
                let time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
                let dateTime = date + 'T' + time;
                await EncryptedStorage.setItem('timeWhenSwitchedToForeground', dateTime)
            }
            if (val != null && !isForeground) {
                if (val.length < 1) {
                    await EncryptedStorage.setItem('timeWhenSwitchedToBackground', '')
                } else {
                    let today = new Date();
                    let date = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
                    let time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
                    let dateTime = date + 'T' + time;
                    await EncryptedStorage.setItem('timeWhenSwitchedToBackground', dateTime)
                }


            }

            const foreground = await EncryptedStorage.getItem('timeWhenSwitchedToForeground')
            const background = await EncryptedStorage.getItem('timeWhenSwitchedToBackground')

            const isLoggedIn = await EncryptedStorage.getItem('isLoggedIn')

            if (typeof (isLoggedIn) != 'undefined') {
                if (isLoggedIn != null) {
                    if (isLoggedIn == 'true') {
                        if (isForeground) {
                            if (typeof (foreground) != 'undefined' && typeof (background) != 'undefined') {
                                if (foreground.length > 1 && background.length > 1) {

                                    const dateWhenSwitchedForeground = new Date(foreground)
                                    const dateWhenSwitchedBackground = new Date(background)

                                    // console.warn('BACK: ' + dateWhenSwitchedBackground + 'Fore: ' + dateWhenSwitchedForeground)

                                    let date = dateWhenSwitchedForeground.getFullYear() + '-' + (dateWhenSwitchedForeground.getMonth() + 1).toString().padStart(2, '0') + '-' + dateWhenSwitchedForeground.getDate().toString().padStart(2, '0');
                                    let time = dateWhenSwitchedForeground.getHours().toString().padStart(2, '0') + ":" + dateWhenSwitchedForeground.getMinutes().toString().padStart(2, '0') + ":" + dateWhenSwitchedForeground.getSeconds().toString().padStart(2, '0');
                                    let dateTime = date + 'T' + time;




                                    let dateBackground = dateWhenSwitchedBackground.getFullYear() + '-' + (dateWhenSwitchedBackground.getMonth() + 1).toString().padStart(2, '0') + '-' + dateWhenSwitchedBackground.getDate().toString().padStart(2, '0');
                                    let timeBackground = dateWhenSwitchedBackground.getHours().toString().padStart(2, '0') + ":" + dateWhenSwitchedBackground.getMinutes().toString().padStart(2, '0') + ":" + dateWhenSwitchedBackground.getSeconds().toString().padStart(2, '0');
                                    let dateTimeBackground = dateBackground + 'T' + timeBackground;


                                    const difference = Math.abs(new Date(dateTime) - new Date(dateTimeBackground)) / 1000
                                    const secondsElapsed = Math.floor(difference / 60 * 60)

                                    // console.warn('DIFFERENCE: ' + secondsElapsed)
                                    if (secondsElapsed >= 1800) {
                                        if(!shouldReturn){
                                            dispatch(AuthActionCreator.isLoggedIn(false))
                                            dispatch(AuthActionCreator.isFirstTime(false))
                                        }else{
                                            await EncryptedStorage.setItem('secondsElapsed',JSON.stringify(secondsElapsed))
                                            return secondsElapsed
                                        }
                                        
                                    }

                                } else {

                                }
                            } else {

                            }
                        }

                    }
                }
            }
        }
        catch (e) {
            dispatch({ type: ActionTypes.HAS_APP_SWITCHED_TO_FOREGROUND_AFTER_SPECIFIED_TIME_RESPONSE, payload: e, error: true })
        }
    },

    //Is user inactive when app is in foreground
    isUserInactiveWhenAppIsInForeground: (val, endpoint) => async (dispatch, getState) => {
        try {

            if (val != null) {
                let today = new Date();
                let date = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
                let time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
                let dateTime = date + 'T' + time;
                await EncryptedStorage.setItem('timeWhenLastApiCallMade', dateTime)
            }

            const timeWhenLastApiCallMade = await EncryptedStorage.getItem('timeWhenLastApiCallMade')


            const isLoggedIn = await EncryptedStorage.getItem('isLoggedIn')

            if (typeof (isLoggedIn) != 'undefined') {
                if (isLoggedIn != null) {
                    if (isLoggedIn == 'true') {
                        // if (isForeground) {
                        if (typeof (timeWhenLastApiCallMade) != 'undefined') {
                            if (timeWhenLastApiCallMade != null) {
                                if (timeWhenLastApiCallMade.length > 1) {

                                    const timeWhenLastApiCallMadeDateTime = new Date(timeWhenLastApiCallMade)

                                    // console.warn('Last API: ' + timeWhenLastApiCallMadeDateTime)

                                    let date = timeWhenLastApiCallMadeDateTime.getFullYear() + '-' + (timeWhenLastApiCallMadeDateTime.getMonth() + 1).toString().padStart(2, '0') + '-' + timeWhenLastApiCallMadeDateTime.getDate().toString().padStart(2, '0');
                                    let time = timeWhenLastApiCallMadeDateTime.getHours().toString().padStart(2, '0') + ":" + timeWhenLastApiCallMadeDateTime.getMinutes().toString().padStart(2, '0') + ":" + timeWhenLastApiCallMadeDateTime.getSeconds().toString().padStart(2, '0');
                                    let dateTime = date + 'T' + time;

                                    let today = new Date();
                                    let dateNow = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
                                    let timeNow = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
                                    let dateTimeNow = dateNow + 'T' + timeNow;


                                    const difference = Math.abs(new Date(dateTime) - new Date(dateTimeNow)) / 1000
                                    const secondsElapsed = Math.floor(difference / 60 * 60)

                                    // console.warn(endpoint + ': DIFFERENCE BETWEEN LAST API MADE: ' + secondsElapsed)
                                    if (secondsElapsed >= 1800) {
                                        dispatch(AuthActionCreator.isLoggedIn(false))
                                        dispatch(AuthActionCreator.isFirstTime(false))
                                    }

                                } else {

                                }
                            }

                        } else {

                        }
                        // }

                    }
                }
            }
        }
        catch (e) {
            dispatch({ type: ActionTypes.HAS_APP_SWITCHED_TO_FOREGROUND_AFTER_SPECIFIED_TIME_RESPONSE, payload: e, error: true })
        }
    },

    resetResponse: (name) => async (dispatch, getState) => {
        switch (name) {
            case '1':
                dispatch({ type: ActionTypes.IS_PRIMARY_RESET, payload: {} })
                break;
            case '2':
                dispatch({ type: ActionTypes.SET_TARGET_RESET, payload: {} })
                break;
            case '3':
                dispatch({ type: ActionTypes.GET_SECONDARY_USERS_RESET, payload: {} })
                break;
            case '4':
                dispatch({ type: ActionTypes.ADD_SECONDARY_USERS_RESET, payload: {} })
                break;
            case '5':
                dispatch({ type: ActionTypes.REMOVE_SECONDARY_USERS_RESET, payload: {} })
                break;
            case '6':
                dispatch({ type: ActionTypes.GET_FEEDBACK_TITLES_RESET, payload: {} })
                break;
            case '7':
                dispatch({ type: ActionTypes.GET_CALL_DETAILS_RESET, payload: {} })
                break;
            case '8':
                dispatch({ type: ActionTypes.SUBMIT_FEEDBACK_RESET, payload: {} })
                break
            case '9':
                dispatch({ type: ActionTypes.TRANSFER_TO_BANK_RESET, payload: {} })
                break
            case '10':
                dispatch({ type: ActionTypes.REFERRAL_CODE_VERIFICATION_RESET, payload: {} })
                break
            case '11':
                dispatch({ type: ActionTypes.ADD_UPDATE_BANK_DETAILS_RESET, payload: {} })
                break
            case '12':
                dispatch({ type: ActionTypes.GET_BANK_DETAILS_RESET, payload: {} })
                break
            case '13':
                dispatch({ type: ActionTypes.DELETE_USER_RESET, payload: {} })
                break
            case '14':
                dispatch({ type: ActionTypes.DELETE_BANK_DETAILS_RESET, payload: {} })
                break
            case '15':
                dispatch({ type: ActionTypes.OFFER_WITH_RETAILER_NAME_RESET, payload: null })
                break
            case '16':
                dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_HELP_RESET, payload: null })
                break
            case '17':
                dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_PROFILE_RESET, payload: null })
                break
            case '18':
                dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_REWARDS_RESET, payload: null })
                break
            case '19':
                dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_DIGITAL_MASTER_CARD_RESET, payload: null })
                break
            case '20':
                dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_HISTORY_RESET, payload: null })
                break
            case '21':
                dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_SETTINGS_RESET, payload: null })
                break
            case '22':
                dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_PRIVACY_POLICY_RESET, payload: null })
                break
            case '23':
                dispatch({ type: ActionTypes.SHOULD_NAVIGATE_TO_TERMS_RESET, payload: null })
                break
            case '24':
                dispatch({ type: ActionTypes.OFFER_WITH_CATEGORY_NAME_RESET, payload: null })
                break
            default:
                break;
        }
    }
}
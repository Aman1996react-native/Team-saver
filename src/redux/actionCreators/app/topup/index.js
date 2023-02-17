import {
	ActionTypes
} from '../../../actionTypes';
import * as Endpoints from '../../../../services/endPoints'
import * as NetworkParams from '../../../../services/networkParams'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import {
	GenericPostCall
} from '../../genericPostCall';
import { ChatActionCreator } from '../chat';

export const TopUpActionCreator = {

	//get bank details
	getBankDetails: (userId) => async(dispatch, getState) => {

		dispatch({
			type: ActionTypes.GET_BANK_DETAILS_REQUEST
		})
		try {
			const apiResponse = await GenericPostCall(dispatch, Endpoints.GetBankDetails, JSON.stringify({
				user_id: userId
			}))

			dispatch({
				type: ActionTypes.GET_BANK_DETAILS_REPONSE,
				payload: apiResponse
			})
		} catch (e) {
			console.log('/////...../////ERROR: ' + e.toString())
			dispatch({
				type: ActionTypes.GET_BANK_DETAILS_REPONSE,
				payload: e,
				error: true
			})
		}
	},

	//send money
	sendMoney: (userId, totalAmount, contacts) => async(dispatch, getState) => {

		dispatch({
			type: ActionTypes.SEND_MONEY_REQUEST
		})
		try {
			const apiResponse = await GenericPostCall(dispatch, Endpoints.SendMoneyToUser, JSON.stringify({
				user_id: userId,
				TotalAmount: totalAmount,
				Contacts: contacts
			}))


			if (typeof (apiResponse) != 'undefined') {
				if (typeof (apiResponse.Status) != 'undefined') {
					if (apiResponse.Status == 'Success') {
						if (typeof (apiResponse.Contacts) != 'undefined') {
							if (apiResponse.Contacts != null) {
								if (apiResponse.Contacts.length > 0) {
									if (apiResponse.Contacts[0].Mobile_Number != null) {
										EncryptedStorage.getItem('userId', (res, err) => {
											if (res) {
														const receiver = [{
															Mobile: apiResponse.Contacts[0].Mobile_Number
														}]
														dispatch(ChatActionCreator.sendChat(res, receiver, `$${apiResponse.Contacts[0].Amount} Payment to ${apiResponse.Contacts[0].Name}`))
											}
										})
									}
								}
							}
						}
					}
				}
			}


			dispatch({
				type: ActionTypes.SEND_MONEY_REPONSE,
				payload: apiResponse
			})
		} catch (e) {
			console.log('/////...../////ERROR: ' + e.toString())
			dispatch({
				type: ActionTypes.SEND_MONEY_REPONSE,
				payload: e,
				error: true
			})
		}
	},

	resetSendMoney: () => async(dispatch, getState) => {
		dispatch({
			type: ActionTypes.SEND_MONEY_RESET,
			payload: {}
		})
	},

	//request money
	requestMoney: (userId, totalAmount, contacts) => async(dispatch, getState) => {

		dispatch({
			type: ActionTypes.REQUEST_MONEY_REQUEST
		})
		try {
			const apiResponse = await GenericPostCall(dispatch, Endpoints.RequestMoney, JSON.stringify({
				user_id: userId,
				TotalAmount: totalAmount,
				Contacts: contacts
			}))


			dispatch({
				type: ActionTypes.REQUEST_MONEY_REPONSE,
				payload: apiResponse
			})

			if (typeof (apiResponse) != 'undefined') {
				if (typeof (apiResponse.Status) != 'undefined') {
					if (apiResponse.Status == 'Requested') {
						if (typeof (apiResponse.Contacts) != 'undefined') {
							if (apiResponse.Contacts != null) {
								if (apiResponse.Contacts.length > 0) {
									let mobileArray = []
									apiResponse.Contacts.forEach(con => {
                                        const mob = {
                                            Mobile:con.Mobile_Number
                                        }
                                        mobileArray.push(mob)
										
                                    })

									apiResponse.Contacts.forEach(cont => {
										dispatch(ChatActionCreator.sendChat(userId, mobileArray, `$${cont.Amount} Requested from ${cont.Name}`))
                                    })
									
									
								}
							}
						}
					}
				}
			}

			
		} catch (e) {
			console.log('/////...../////ERROR: ' + e.toString())
			dispatch({
				type: ActionTypes.REQUEST_MONEY_REPONSE,
				payload: e,
				error: true
			})
		}
	},

	resetRequestMoney: () => async(dispatch, getState) => {
		dispatch({
			type: ActionTypes.REQUEST_MONEY_RESET,
			payload: {}
		})
	},

	//make payment
	makePayment: (userId, name, accNumber, bsb, amount) => async(dispatch, getState) => {

		dispatch({
			type: ActionTypes.MAKE_PAYMENT_REQUEST
		})
		try {
			const apiResponse = await GenericPostCall(dispatch, Endpoints.MakePayment, JSON.stringify({
				user_id: userId,
				Name: name,
				AccountNumber: accNumber,
				BSB: bsb,
				Description: 'Pay Anyone',
				Amount: amount
			}))

			dispatch({
				type: ActionTypes.MAKE_PAYMENT_REPONSE,
				payload: apiResponse
			})
		} catch (e) {
			console.log('/////...../////ERROR: ' + e.toString())
			dispatch({
				type: ActionTypes.MAKE_PAYMENT_REPONSE,
				payload: e,
				error: true
			})
		}
	},

	resetmakePayment: () => async(dispatch, getState) => {
		dispatch({
			type: ActionTypes.MAKE_PAYMENT_RESET,
			payload: {}
		})
	},
}
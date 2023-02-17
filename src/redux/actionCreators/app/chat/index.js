import {
	ActionTypes
} from '../../../actionTypes';
import * as Endpoints from '../../../../services/endPoints'
import * as NetworkParams from '../../../../services/networkParams'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import {
	GenericGetCall,
	GenericPostCall
} from '../../genericPostCall';


export const ChatActionCreator = {

	//get chat
	getChat: (userId, receiversMobile, chatId) => async(dispatch, getState) => {

		dispatch({
			type: ActionTypes.GET_MESSAGE_REQUEST
		})
		try {

			if (chatId == null) {
				const apiResponse = await GenericPostCall(dispatch, Endpoints.GetChat, JSON.stringify({
					SenderID: userId,
					Receivers: receiversMobile
				}))
				dispatch({
					type: ActionTypes.GET_MESSAGE_REPONSE,
					payload: apiResponse
				})
			} 
            
            else {
				const apiResponse = await GenericPostCall(dispatch, Endpoints.GetChat, JSON.stringify({
					SenderID: userId,
					ChatID: chatId
				}))
				dispatch({
					type: ActionTypes.GET_MESSAGE_REPONSE,
					payload: apiResponse
				})

			}


		} catch (e) {
			console.log('/////...../////ERROR: ' + e.toString())
			dispatch({
				type: ActionTypes.GET_MESSAGE_REPONSE,
				payload: e,
				error: true
			})
		}
	},

	//send chat
	sendChat: (userId, receiversMobile, message) => async(dispatch, getState) => {
		dispatch({
			type: ActionTypes.SEND_MESSAGE_REQUEST
		})
		try {

			const apiResponse = await GenericPostCall(dispatch, Endpoints.SendChatMsg, JSON.stringify({
				SenderID: userId,
				Receivers: receiversMobile,
				Message: message
			}))

			dispatch({
				type: ActionTypes.SEND_MESSAGE_REPONSE,
				payload: apiResponse
			})
			dispatch(ChatActionCreator.getChat(userId,receiversMobile,null))

		} catch (e) {
			console.log('/////...../////ERROR: ' + e.toString())
			dispatch({
				type: ActionTypes.SEND_MESSAGE_REPONSE,
				payload: e,
				error: true
			})
		}
	},

	//get chat id
	getChatId: (userId, receiversMobile) => async(dispatch, getState) => {

		dispatch({
			type: ActionTypes.GET_CHAT_ID_REQUEST
		})
		try {

			const apiResponse = await GenericPostCall(dispatch, Endpoints.GetChatID, JSON.stringify({
				SenderID: userId,
				Receivers: receiversMobile,
			}))

			dispatch({
				type: ActionTypes.GET_CHAT_ID_REPONSE,
				payload: apiResponse
			})
		} catch (e) {
			console.log('/////...../////ERROR: ' + e.toString())
			dispatch({
				type: ActionTypes.GET_CHAT_ID_REPONSE,
				payload: e,
				error: true
			})
		}
	},

	//get chat thread
	getChatThread: (userId) => async(dispatch, getState) => {

		dispatch({
			type: ActionTypes.GET_CHAT_THREAD_REQUEST
		})
		try {

			const apiResponse = await GenericPostCall(dispatch, Endpoints.GetMsgThread, JSON.stringify({
				user_id: userId
			}))

			dispatch({
				type: ActionTypes.GET_CHAT_THREAD_REPONSE,
				payload: apiResponse
			})
		} catch (e) {
			console.log('/////...../////ERROR: ' + e.toString())
			dispatch({
				type: ActionTypes.GET_CHAT_THREAD_REPONSE,
				payload: e,
				error: true
			})
		}
	},

	//reset get chat 
	resetGetChat: () => async(dispatch, getState) => {

		dispatch({
			type: ActionTypes.GET_MESSAGE_REQUEST
		})
		try {


			dispatch({
				type: ActionTypes.GET_MESSAGE_RESET,
				payload: {}
			})
		} catch (e) {
			console.log('/////...../////ERROR: ' + e.toString())
			dispatch({
				type: ActionTypes.GET_MESSAGE_RESET,
				payload: e,
				error: true
			})
		}
	},


}
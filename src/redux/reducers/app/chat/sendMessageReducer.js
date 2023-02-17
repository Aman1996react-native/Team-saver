import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default SendMessageReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.SEND_MESSAGE_RESET: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.SEND_MESSAGE_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.SEND_MESSAGE_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

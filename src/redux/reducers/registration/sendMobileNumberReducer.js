import * as ActionTypes from '../../actionTypes/registration';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default SendMobileNumberRegReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.SEND_MOBILE_NUMBER_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.SEND_MOBILE_NUMBER_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.SEND_MOBILE_NUMBER_RESET: {
            return {...state,loading:false, error:false,response:{}}
            
        }
    }
    return state;
}

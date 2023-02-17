import {ActionTypes} from '../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default ForgotMPINReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.FORGOT_PIN_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.FORGOT_PIN_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.FORGOT_PIN_RESET: {
            return {...state,loading:false, error:false,response:{}}
            
        }
    }
    return state;
}

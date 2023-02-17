import * as ActionTypes from '../../actionTypes/registration';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default MobileNumberVerifiedRegReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.OTP_VERIFIED_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.OTP_VERIFIED_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.OTP_VERIFIED_RESET: {
            return {...state,loading:false, error:false,response:{}}
            
        }
    }
    return state;
}

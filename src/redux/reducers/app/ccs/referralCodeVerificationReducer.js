import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default ReferralCodeVerificationReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.REFERRAL_CODE_VERIFICATION_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.REFERRAL_CODE_VERIFICATION_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.REFERRAL_CODE_VERIFICATION_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

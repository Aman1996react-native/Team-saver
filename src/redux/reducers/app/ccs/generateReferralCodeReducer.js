import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default GenerateReferralCodeReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.REFERRAL_CODE_GENERATE_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.REFERRAL_CODE_GENERATE_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.REFERRAL_CODE_GENERATE_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

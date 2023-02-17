import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default SubmitRewardClaimReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.SUBMIT_REWARD_CLAIM_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.SUBMIT_REWARD_CLAIM_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.SUBMIT_REWARD_CLAIM_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default ApproveRequestedMoneyReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.APPROVE_MONEY_REQUEST_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.APPROVE_MONEY_REQUEST_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.APPROVE_MONEY_REQUEST_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

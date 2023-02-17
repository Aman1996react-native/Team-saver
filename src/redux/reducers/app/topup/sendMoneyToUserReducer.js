import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default SendMoneyToUserReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.SEND_MONEY_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.SEND_MONEY_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.SEND_MONEY_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

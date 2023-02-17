import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default TransferToBankReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.TRANSFER_TO_BANK_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.TRANSFER_TO_BANK_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.TRANSFER_TO_BANK_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

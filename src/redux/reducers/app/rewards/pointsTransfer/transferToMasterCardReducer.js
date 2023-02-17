import {ActionTypes} from '../../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default TransferToMasterCardReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.TRANSFER_TO_MASTER_CARD_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.TRANSFER_TO_MASTER_CARD_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.TRANSFER_TO_MASTER_CARD_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default AddUpdatebankDetailsReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.ADD_UPDATE_BANK_DETAILS_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.ADD_UPDATE_BANK_DETAILS_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.ADD_UPDATE_BANK_DETAILS_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

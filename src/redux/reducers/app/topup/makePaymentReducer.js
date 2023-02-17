import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default MakePaymentReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.MAKE_PAYMENT_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.MAKE_PAYMENT_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.MAKE_PAYMENT_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

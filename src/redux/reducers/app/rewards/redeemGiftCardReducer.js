import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default RedeemGiftCardReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.REDEEM_GIFT_CARD_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.REDEEM_GIFT_CARD_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.REDEEM_GIFT_CARD_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

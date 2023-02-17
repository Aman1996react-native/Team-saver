import {ActionTypes} from '../../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default PurchaseFoodPOSReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.PURCHASE_FOOD_POS_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.PURCHASE_FOOD_POS_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.PURCHASE_FOOD_POS_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

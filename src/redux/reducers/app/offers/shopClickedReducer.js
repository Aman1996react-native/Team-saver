import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default ShopClickedReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.SHOP_CLICKED_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.SHOP_CLICKED_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.SHOP_CLICKED_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

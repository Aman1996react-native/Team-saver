import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default SaveOffersReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.SAVE_OFFERS_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.SAVE_OFFERS_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.SAVE_OFFERS_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

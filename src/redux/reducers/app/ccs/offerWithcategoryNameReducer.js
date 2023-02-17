import {ActionTypes} from '../../../actionTypes/index'

const initialState = {
    loading:false,
    response:null,
    error:false
}

export default OfferWithCategoryNameReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.OFFER_WITH_CATEGORY_NAME_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.OFFER_WITH_CATEGORY_NAME_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.OFFER_WITH_CATEGORY_NAME_RESET: {
            return {...state,loading:false, error:false,response:null}
        }
    }
    return state;
}
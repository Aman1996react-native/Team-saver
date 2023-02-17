import {ActionTypes} from '../../actionTypes/index'

const initialState = {
    loading:false,
    response:null,
    error:false
}

export default IsTouchIdEnabledReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    var variableUndefined;

    switch(type){
        case ActionTypes.IS_TOUCHID_ENABLED_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.IS_TOUCHID_ENABLED_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.IS_TOUCHID_ENABLED_RESET: {
            return {...state,loading:false, error:false,response:variableUndefined}
    }
    }
    return state;
}
import {ActionTypes} from '../../../actionTypes/index'

const initialState = {
    loading:false,
    response:null,
    error:false
}

export default ShouldnavigateToHistoryReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.SHOULD_NAVIGATE_TO_HISTORY_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.SHOULD_NAVIGATE_TO_HISTORY_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.SHOULD_NAVIGATE_TO_HISTORY_RESET: {
            return {...state,loading:false, error:false,response:null}
        }
    }
    return state;
}
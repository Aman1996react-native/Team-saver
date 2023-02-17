import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:null,
    error:false
}

export default HasAppSwitchedToForegroundAfterSpecifiedTimeReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.HAS_APP_SWITCHED_TO_FOREGROUND_AFTER_SPECIFIED_TIME_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.HAS_APP_SWITCHED_TO_FOREGROUND_AFTER_SPECIFIED_TIME_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.HAS_APP_SWITCHED_TO_FOREGROUND_AFTER_SPECIFIED_TIME_RESET: {
            return {...state,loading:false, error:false,response:null}
    }
    
    }
    return state;
}

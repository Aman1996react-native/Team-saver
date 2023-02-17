import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default PermanentlyDeleteUserReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.DELETE_USER_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.DELETE_USER_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.DELETE_USER_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

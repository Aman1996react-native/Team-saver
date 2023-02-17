import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default SetTargetReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.SET_TARGET_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.SET_TARGET_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.SET_TARGET_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

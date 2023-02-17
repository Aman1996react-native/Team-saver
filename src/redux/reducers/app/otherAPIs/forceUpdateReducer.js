import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default ForceUpdateReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.FORCE_UPDATE_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.FORCE_UPDATE_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.FORCE_UPDATE_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

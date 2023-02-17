import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default UpdateFCMTokenReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.UPDATE_FCM_TOKEN_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.UPDATE_FCM_TOKEN_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.UPDATE_FCM_TOKEN_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

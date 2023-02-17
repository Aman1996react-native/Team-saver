import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default RemoveSecondaryUsersReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.REMOVE_SECONDARY_USERS_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.REMOVE_SECONDARY_USERS_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.REMOVE_SECONDARY_USERS_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default AddSecondaryUsersReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.ADD_SECONDARY_USERS_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.ADD_SECONDARY_USERS_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.ADD_SECONDARY_USERS_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

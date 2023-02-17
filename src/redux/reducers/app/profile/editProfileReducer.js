import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default EditProfileReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.EDIT_PROFILE_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.EDIT_PROFILE_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.EDIT_PROFILE_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

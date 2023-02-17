import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default EditEmailReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.EDIT_EMAIL_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.EDIT_EMAIL_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.EDIT_EMAIL_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

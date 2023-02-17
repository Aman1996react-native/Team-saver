import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default DeleteNotificationsReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.NOTIFICATION_DELETE_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.NOTIFICATION_DELETE_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.NOTIFICATION_DELETE_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

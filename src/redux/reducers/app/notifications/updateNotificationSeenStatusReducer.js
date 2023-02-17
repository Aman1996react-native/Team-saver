import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default UpdateNotificationStatusReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.NOTIFICATION_SEEN_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.NOTIFICATION_SEEN_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.NOTIFICATION_SEEN_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default GetNotificationsReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.NOTIFICATIONS_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.NOTIFICATIONS_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.NOTIFICATIONS_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

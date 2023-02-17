import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default GetAlertStatusReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.GET_ALERT_STATUS_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.GET_ALERT_STATUS_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.GET_ALERT_STATUS_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

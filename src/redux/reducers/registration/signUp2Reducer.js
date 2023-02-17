import * as ActionTypes from '../../actionTypes/registration';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default SendNameAndEmailRegReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.SEND_NAME_AND_EMAIL_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.SEND_NAME_AND_EMAIL_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.SEND_NAME_AND_EMAIL_RESET: {
            return {...state,loading:false, error:false,response:{}}
            
        }
    }
    return state;
}

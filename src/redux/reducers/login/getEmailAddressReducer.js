import {ActionTypes} from '../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default GetEmailAddressReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.GET_EMAIL_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.GET_EMAIL_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
    }
    return state;
}

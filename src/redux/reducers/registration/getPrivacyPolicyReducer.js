import * as ActionTypes from '../../actionTypes/registration';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default GetPrivacyPolicyRegReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.GET_PP_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.GET_PP_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.GET_PP_RESET: {
            return {...state,loading:false, error:false,response:{}}
            
        }
    }
    return state;
}

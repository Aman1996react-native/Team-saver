import * as ActionTypes from '../../actionTypes/registration';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default GetTCRegReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.GET_TC_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.GET_TC_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.GET_TC_RESET: {
            return {...state,loading:false, error:false,response:{}}
            
        }
    }
    return state;
}

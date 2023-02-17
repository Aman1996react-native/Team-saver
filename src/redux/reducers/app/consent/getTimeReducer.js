import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:null,
    error:false
}

export default GetTimeReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.GET_TIME_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.GET_TIME_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.GET_TIME_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default IsPrimaryUserReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.IS_PRIMARY_REQUEST: {
            
            return {...state,loading:true,error:false}
        }
        case ActionTypes.IS_PRIMARY_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.IS_PRIMARY_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

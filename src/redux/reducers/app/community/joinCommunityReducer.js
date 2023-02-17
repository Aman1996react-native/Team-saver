import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default JoinCommunityReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.JOIN_COMMUNITY_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.JOIN_COMMUNITY_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.JOIN_COMMUNITY_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

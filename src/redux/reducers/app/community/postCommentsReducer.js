import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default PostCommentsReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.POST_COMMENTS_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.POST_COMMENTS_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.POST_COMMENTS_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

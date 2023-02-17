import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default SubmitFeedbackReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.SUBMIT_FEEDBACK_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.SUBMIT_FEEDBACK_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.SUBMIT_FEEDBACK_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

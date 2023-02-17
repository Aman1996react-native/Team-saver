import {ActionTypes} from '../../actionTypes/index'

const initialState = {
    loading:false,
    response:null,
    error:false
}

export default IsFirstTimeCheckReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.IS_FIRST_LAUNCH_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.IS_FIRST_LAUNCH_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
    }
    return state;
}
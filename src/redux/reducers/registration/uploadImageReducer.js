import * as ActionTypes from '../../actionTypes/registration';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default UploadImageRegReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.UPLOAD_IMAGE_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.UPLOAD_IMAGE_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.UPLOAD_IMAGE_RESET: {
            return {...state,loading:false, error:false,response:{}}
            
        }
    }
    return state;
}

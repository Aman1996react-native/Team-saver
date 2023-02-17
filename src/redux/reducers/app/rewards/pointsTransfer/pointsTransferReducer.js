import {ActionTypes} from '../../../../actionTypes';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default PointsTransferReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.POINTS_TRANSFER_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.POINTS_TRANSFER_REPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.POINTS_TRANSFER_RESET: {
            return {...state,loading:false, error:false,response:{}}
    }
    
    }
    return state;
}

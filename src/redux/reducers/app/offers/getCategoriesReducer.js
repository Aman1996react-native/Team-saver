import {ActionTypes} from '../../../actionTypes';

const initialState = {
    loading:false,
    response:[],
    error:false,
    Alloffers : [],
    Other50Data:[]
}

export default GetCateogoriesReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.Get_OFFERS_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.Get_OFFERS_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            console.log("payload",payload)
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.Get_OFFERS_RESET: {
            return {...state,loading:false, error:false,response:[]
            
        }
    }
    case ActionTypes.Get_All_OFFER_RESONSE : {
        if(error){
            return {...state,loading:false,error:true}
        }
        return {...state,loading:false, error:false,Alloffers:payload}
    }
    case ActionTypes.GET_OTHER_50_OFFERS : {
        if(error){
            return {...state,loading:false,error:true}
        }
        return {...state,loading:false, error:false,Other50Data:payload}
    }
    
    
    }
    return state;
}

import * as ActionTypes from '../../actionTypes/registration';

const initialState = {
    loading:false,
    response:{},
    error:false
}

export default SaveFavouritesRegReducer = (state = initialState,action) => {

    const {type,payload,error} = action;

    switch(type){
        case ActionTypes.SAVE_FAVOURITES_REQUEST: {
            return {...state,loading:true,error:false}
        }
        case ActionTypes.SAVE_FAVOURITES_RESPONSE: {
            if(error){
                return {...state,loading:false,error:true}
            }
            return {...state,loading:false, error:false,response:payload}
        }
        case ActionTypes.SAVE_FAVOURITES_RESET: {
            return {...state,loading:false, error:false,response:{}}
            
        }
    }
    return state;
}

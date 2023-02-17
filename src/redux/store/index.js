import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import combineReducers from '../reducers/index'

const ConfigureStore = () => {
    return createStore(combineReducers,applyMiddleware(thunk))
}

export default ConfigureStore
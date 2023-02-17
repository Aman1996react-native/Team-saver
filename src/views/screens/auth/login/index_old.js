import React, { Component } from "react";
import { 
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import {connect} from 'react-redux'
import {AuthActionCreator} from '../../../../redux/actionCreators/auth'



const mapStateToProps =(state) => ({
    
    loading:state.IsFirstTimeCheckReducer.loading,
    request:state.IsFirstTimeCheckReducer.request,
    response:state.IsFirstTimeCheckReducer.response,

    loginLoading:state.IsLoggedInReducer.loading,
    loginRequest:state.IsLoggedInReducer.request,
    loginResponse:state.IsLoggedInReducer.response,

  })


class LoginPage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>LoginPage</Text>
                <TouchableOpacity style={{backgroundColor:'red',width:120,marginTop:20,padding:20}}
                onPress={() => {
                    const {dispatch} = this.props
                    dispatch(AuthActionCreator.isFirstTime(false))
                    dispatch(AuthActionCreator.isLoggedIn(true))
                }}
                >
                    <Text>Login123</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:'red',width:120,marginTop:20,padding:20}}
                onPress={() => {
                    const {dispatch} = this.props
                    dispatch(AuthActionCreator.isFirstTime(true))
                    dispatch(AuthActionCreator.isLoggedIn(false))
                }}
                >
                    <Text>Register</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
export default connect(mapStateToProps) (LoginPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
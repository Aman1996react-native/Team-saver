import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from "react";

import Colors from '../../../utils/colors'
import {StyleSheet} from 'react-native';
import LoginPage from '../../../views/screens/auth/login'
import ForgotMPinPage from '../../../views/screens/auth/login/forgotMPin';
import NameEmailPage from '../../../views/screens/auth/login/nameEmailPage';
import ChangePinVerificationPage from '../../../views/screens/settings/changePinVerificationPage';
import SignUp6 from '../../../views/screens/auth/registration/signUp6';
import ForgotPassword from '../../../views/screens/auth/login/ForgotPassword';
import SignUpStep2 from '../../../views/screens/auth/registration/signUp2';


const LoginStack = createStackNavigator();

const LoginStackConfig = () => {
    return(
        <LoginStack.Navigator
            screenOptions={{
                headerShown: false
            }} >
            <LoginStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="Login" component={LoginPage}></LoginStack.Screen>
            <LoginStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="SignUp2" component={SignUpStep2}></LoginStack.Screen>
            <LoginStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="ForgotMpin" component={ForgotMPinPage}></LoginStack.Screen>
            <LoginStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="NameEmail" component={NameEmailPage}></LoginStack.Screen>
            <LoginStack.Screen options={{
                title: '',
            }} name="Change Pin Verification" component={ChangePinVerificationPage}></LoginStack.Screen>
            <LoginStack.Screen name="Change Pin" component={SignUp6}></LoginStack.Screen>
            <LoginStack.Screen name="ForgotPassword" component={ForgotPassword}></LoginStack.Screen>
        </LoginStack.Navigator>
    )
}

export default LoginStackConfig
const styles = StyleSheet.create({
    
    header: {
      backgroundColor: Colors.APP_GREEN,
    },
  });
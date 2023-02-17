import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from "react";

import Colors from '../../../utils/colors'
import {StyleSheet} from 'react-native';
import Config from "react-native-config";
import { SIGNUP_7 } from '../../../constants'



import SignUpStep1 from '../../../views/screens/auth/registration/signUp1';
import SignUpStep2 from '../../../views/screens/auth/registration/signUp2';
import SignUpStep3 from '../../../views/screens/auth/registration/signUp3';
import SignUpStep4 from '../../../views/screens/auth/registration/signUp4';
import SignUpStep5 from '../../../views/screens/auth/registration/signUp5';
import SignUpStep6 from '../../../views/screens/auth/registration/signUp6';
import SignUpStep7 from '../../../views/screens/auth/registration/signUp7';
import SignUpStep8 from '../../../views/screens/auth/registration/signUp8';
import SignUpStep9 from '../../../views/screens/auth/registration/signup9';
import SignUpStep10 from '../../../views/screens/auth/registration/signUp10';
import SignUpStep11 from '../../../views/screens/auth/registration/signUp11';
import Wizard1 from '../../../views/screens/auth/wizard/wizard1';
import Wizard2 from '../../../views/screens/auth/wizard/wizard2';
import Wizard3 from '../../../views/screens/auth/wizard/wizard3';
import Wizard4 from '../../../views/screens/auth/wizard/wizard4';
import Wizard5 from '../../../views/screens/auth/wizard/wizard5';
import Wizard6 from '../../../views/screens/auth/wizard/wizard6';
import CCSRegistration1 from '../../../views/screens/auth/registration/ccsRegistration/ccsRegistration1';
import AddMembersRegPage from '../../../views/screens/auth/registration/ccsRegistration/addMembersRegPage';
import SecondaryUserReferralVerificationPage from '../../../views/screens/auth/registration/ccsRegistration/ccsRegistration1/secondaryUserReferralCodePage';
import ForgotPassword from '../../../views/screens/auth/login/ForgotPassword';
// import RootNavigator from '.'


const RegistrationStack = createStackNavigator();

const RegistrationStackConfig = () => {
    return(
        <RegistrationStack.Navigator
            screenOptions={{
                headerStyle: styles.header,
                headerShown:(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? false : true,
                headerTintColor: Colors.White,
                headerBackTitle: ' ',
                headerTitleStyle: {
                    alignSelf:'center',
                    fontSize: 12,
                    // fontFamily:ARIAL_FONT.medium
                }

            }} >
                {/* CCSRegistration1 */}
            {/* <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="VerifyReferralCode" component={SecondaryUserReferralVerificationPage}></RegistrationStack.Screen>  */}
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center',}} name="SignUp1" component={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? CCSRegistration1 : SignUpStep1}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="SignUp2" component={SignUpStep2}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="SignUp3" component={SignUpStep3}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="SignUp4" component={SignUpStep4}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="SignUp5" component={SignUpStep5}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="AddMembers" component={AddMembersRegPage}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="VerifyReferralCode" component={SecondaryUserReferralVerificationPage}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="SignUp6" component={SignUpStep6}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="SignUp7" component={SignUpStep7}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="SignUp8" component={SignUpStep8}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="SignUp9" component={SignUpStep9}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="SignUp10" component={SignUpStep10}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="SignUp11" component={SignUpStep11}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="Wizard1" component={Wizard1}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="Wizard2" component={Wizard2}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="Wizard3" component={Wizard3}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="Wizard4" component={Wizard4}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="Wizard5" component={Wizard5}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="Wizard6" component={Wizard6}></RegistrationStack.Screen>
            <RegistrationStack.Screen options={{ title: '',headerTitleAlign: 'center'}} name="ForgotPassword" component={ForgotPassword}></RegistrationStack.Screen>

        </RegistrationStack.Navigator>
    )
}

export default RegistrationStackConfig

const styles = StyleSheet.create({
    
    header: {
      backgroundColor: Colors.APP_GREEN,
    //   height:60
    },
  });
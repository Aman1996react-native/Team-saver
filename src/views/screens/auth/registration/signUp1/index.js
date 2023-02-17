import React, {Component} from 'react';
import { StyleSheet, View, Image,Text } from 'react-native';
import Colors from '../../../../../utils/colors'
import { SIGNUP_1, SIGN_ME_UP, ALREADY_HAVE_AN_ACCOUNT } from '../../../../../constants'
import {  widthToDp, getDeviceWidth } from '../../../../../utils';
import YellowButton from '../../../../../components/button';
import UnderlineText from '../../../../../components/underlineText';
import Icons from '../../../../../assets/icons'
import { AuthActionCreator } from '../../../../../redux/actionCreators/auth'
import { connect } from 'react-redux'
import fonts from '../../../../../assets/fonts';
import Config from "react-native-config";


const mapStateToProps = (state) => ({
    loading: state.IsFirstTimeCheckReducer.loading,
    request: state.IsFirstTimeCheckReducer.request,
    response: state.IsFirstTimeCheckReducer.response,
    loginLoading: state.IsLoggedInReducer.loading,
    loginRequest: state.IsLoggedInReducer.request,
    loginResponse: state.IsLoggedInReducer.response,
})

const mapDispatchToProps = dispatch => ({
    isFirstTime: () => dispatch(AuthActionCreator.isFirstTime(false)),
    isLoggedIn: () => dispatch(AuthActionCreator.isLoggedIn(false))
})

const SignUpStep1 = (props) => (
    <View style={styles.container}>
        <View style={styles.textContainer} >
            {(Config.ENV.includes('suncorpDev') || Config.ENV.includes('suncorpProd')) ? 
            <Image source={Icons['SUNCORPCLIENTS']} resizeMode='contain' style={{
                width: getDeviceWidth() - 50,
                height: 100
            }} />
            :
            <Image source={Icons['SMILE']} resizeMode='contain' style={styles.image} />
            }
            
            <Text style={styles.firstText} >{SIGNUP_1.lbl_1}</Text>
            <Text style={[styles.text, { marginTop: 10 }]} >{SIGNUP_1.lbl_2}</Text>
            <Text style={styles.text} >{SIGNUP_1.lbl_3}</Text>
            <Text style={styles.text} >{SIGNUP_1.lbl_4}</Text>
        </View>

        <View style={styles.btnContainer} >
            <YellowButton title={SIGN_ME_UP} navigate={() => props.navigation.navigate('SignUp2',{isSignUp:true})} />
            <UnderlineText title={ALREADY_HAVE_AN_ACCOUNT} navigate={() => { props.navigation.navigate('SignUp2',{isSignUp:false}); }} />
        </View>
    </View>
);

export default connect(mapStateToProps, mapDispatchToProps)(SignUpStep1);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 30,
        backgroundColor: Colors.BG_LIGHT_BLUE
    },
    textContainer: {
        width: getDeviceWidth(),
        alignItems: "center",
        justifyContent: 'center',
        alignContent: "center",
        flex: 1
    },
    btnContainer: {
        width: getDeviceWidth(),
        alignItems: "center"
    },
    image: {
        width: widthToDp('16%'),
        height: widthToDp('16%'),
        tintColor: Colors.YELLOW,
        marginBottom: 10
    },
    firstText: {
        color: Colors.APP_GREEN,
        fontSize: widthToDp('10%'),
        fontFamily:fonts.medium
    },
    text: {
        color: Colors.BLACK,
        fontSize: widthToDp('4.5%'),
        fontFamily:fonts.regular
    },

});
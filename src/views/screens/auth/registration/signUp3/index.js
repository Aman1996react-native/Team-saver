import React, {Component} from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text,Linking } from 'react-native';
import Colors from '../../../../../utils/colors'
import { SIGNUP_3, NEXT } from '../../../../../constants'
import { widthToDp, getDeviceWidth } from '../../../../../utils';
import YellowButton from '../../../../../components/button';
import Icons from '../../../../../assets/icons'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RegistrationActionCreator } from '../../../../../redux/actionCreators/registration';
import ActivityIndicatorComponent from '../../../../../components/activityIndicator';
import { connect } from 'react-redux';
import fonts from '../../../../../assets/fonts';
import Config from "react-native-config";

import dynamicLinks from '@react-native-firebase/dynamic-links';
import { CCSActionCreator } from '../../../../../redux/actionCreators/app/ccs';
import OTPTimer from '../../../../../components/auth/otpTimer';



const mapStateToProps =(state) => ({
    
    loading:state.VerifyEmailReducer.loading,
    request:state.VerifyEmailReducer.request,
    response:state.VerifyEmailReducer.response,

    isPrimaryUserLoading:state.IsPrimaryUserReducer.loading,
    isPrimaryUserRequest:state.IsPrimaryUserReducer.request,
    isPrimaryUserResponse:state.IsPrimaryUserReducer.response,

    isEmailVerifiedLoading:state.VerifyEmailAndMobileReducer.loading,
    isEmailVerifiedRequest:state.VerifyEmailAndMobileReducer.request,
    isEmailVerifiedResponse:state.VerifyEmailAndMobileReducer.response,

  })

class SignUpStep3 extends Component {

    async componentDidMount(){

        // alert(this.props.route.params.emailVerificationCode)

    //     dynamicLinks()
    //   .getInitialLink()
    //   .then(link => {
    //     alert(JSON.stringify('GET INITIAL SIGNUP: '+JSON.stringify(link)))
    //   })

    //   Linking.addEventListener("url", url => alert('LINKING SIGNUP: '+JSON.stringify(url)));
    EncryptedStorage.getItem('email',(res,err) => {
        if(res){
            this.props.dispatch(CCSActionCreator.isPrimaryUser())
        }
    })
      
      Linking.addEventListener('url', this._handleOpenURL);

    }

    _handleOpenURL = (event) => {
        console.warn('INSIDE HANDLE OPEN URL: '+JSON.stringify(event.url))
        if(typeof(event) != 'undefined'){
            if(typeof(event.url) != 'undefined'){
                if(event.url){
                    if(event.url.includes('=')){
                        const splittedStr = event.url.split('=')
                        if(typeof(splittedStr) != 'undefined'){
                            if(splittedStr.length > 1){
                                if(splittedStr[1]){
                                    this.onNextTapped(splittedStr[1])
                                }else{
                                    alert('Please verify your email address')
                                }
                            }else{
                                alert('Please verify your email address')
                            }
                        }else{
                            alert('Please verify your email address')
                        }
                    }else{
                        alert('Please verify your email address')
                    }
                }else{
                    alert('Please verify your email address')
                }
            }else{
                alert('Please verify your email address')
            }
        }else{
            alert('Please verify your email address')
        }
        // Linking.removeEventListener('url', this._handleOpenURL);
    }

    componentWillUnmount(){
        Linking.removeEventListener('url', this._handleOpenURL);
    }


    componentDidUpdate(prevProps){
        const res = this.props.isEmailVerifiedResponse
        if(typeof(res) != 'undefined'){
            if(Object.keys(res).length > 0){
                if(typeof(res.Status) !='undefined'){
                    if(res.Status == 'Success'){
                        EncryptedStorage.getItem('userId',(userId,err) => {
                            if(userId){
                                const {dispatch} = this.props
                                dispatch(RegistrationActionCreator.isEmailVerified(userId,'true'))
                            }
                        })
                        this.props.navigation.navigate('SignUp4')
                    }else{
                        alert('Please check your inbox and verify email address.')
                    }
                    this.props.dispatch(RegistrationActionCreator.resetResponse('11'))
                }
            }
        }
    }

    onNextTapped = (code) => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                const {dispatch} = this.props
                dispatch(RegistrationActionCreator.verifyEmailAndMobile(res,code,'Email'))
            }
        })
    }

    render(){
        if(this.props.loading){
            return(
                <ActivityIndicatorComponent/>
            )
        }
        return(
            <View style={styles.container}>
                <View style={styles.textContainer} >
                    {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd'))
                    ?
                    <Image source={require('../../../../../assets/images/ccs_reg_image1.png')} resizeMode='contain' style={styles.image} />
                    :
                    <Image source={Icons['ROCKET']} resizeMode='contain' style={styles.image} />
                    }
                    
                    <Text style={[styles.text, { marginTop: 10 }]} >{SIGNUP_3.lbl_1}</Text>
                    <Text style={styles.text} >{SIGNUP_3.lbl_2}</Text>
                    <Text style={styles.text} >{SIGNUP_3.lbl_3}</Text>
                    <Text style={styles.text} ></Text>
                    <Text style={[styles.text,{margin:20}]} >{SIGNUP_3.lbl_4}</Text>
                    <OTPTimer/>
                </View>
            </View>
        )
    
    }
}

export default connect(mapStateToProps)(SignUpStep3);

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
        marginBottom: 10,
        
    },
    text: {
        color: Colors.BLACK,
        fontSize: 13,
        fontFamily:fonts.medium,
        textAlign:'center'
    }

});



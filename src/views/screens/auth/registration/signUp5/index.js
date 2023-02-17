import React, {Component, useState,useEffect } from 'react';
import { StyleSheet, View, Image, Text, Keyboard} from 'react-native';
import Icons from '../../../../../assets/icons'
import { SIGNUP_5, CONTINUE } from '../../../../../constants'
import Colors from '../../../../../utils/colors'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { heightToDp, widthToDp, getDeviceWidth } from '../../../../../utils';
import YellowButton from '../../../../../components/button';
import UnderlineText from '../../../../../components/underlineText';
import fonts from '../../../../../assets/fonts';
import Config from "react-native-config";
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RegistrationActionCreator } from '../../../../../redux/actionCreators/registration';
import { AuthActionCreator } from '../../../../../redux/actionCreators/auth';
import OTPTimer from '../../../../../components/auth/otpTimer';
import TimerImageComponent from '../../../../../components/timerImage/timerImageComponent';




const mapStateToProps =(state) => ({

    isEmailVerifiedLoading:state.VerifyEmailAndMobileReducer.loading,
    isEmailVerifiedRequest:state.VerifyEmailAndMobileReducer.request,
    isEmailVerifiedResponse:state.VerifyEmailAndMobileReducer.response,

  })

class SignUpStep5 extends Component {
    // Declare a new state variable, which we'll call "count"
    // const [count, setCount] = useState('');

    // useEffect(() => {
    //     if(count.length == 6){
    //         const otp = props.route.params.otp
    //         const isPrimary = props.route.params.isPrimary
            
    //         if(otp == count){
    //             Keyboard.dismiss()
    //             if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
    //                 if(isPrimary){
    //                     props.navigation.navigate('SignUp6')
    //                 }else{
    //                     props.navigation.navigate('SignUp6')
    //                 }
                   
    //             }else{
    //                 props.navigation.navigate('SignUp6')
    //             }
               
    //         }else{
    //             Keyboard.dismiss()
    //             alert('Incorect OTP')
    //             // props.navigation.navigate('SignUp6')
    //         }
    //     }
    //  }, [count]);

    constructor(props){
        super(props)
        this.state={
            count:''
        }
    }

    componentDidMount(){

    }

    componentDidUpdate(){
        if(this.state.count.length > 5){
            Keyboard.dismiss()
        }
        const res = this.props.isEmailVerifiedResponse
        if(typeof(res) != 'undefined'){
            if(res != null){
                if(Object.keys(res).length > 0){
                    this.props.dispatch(RegistrationActionCreator.resetResponse('11'))
                    if(typeof(res.Status) != 'undefined'){
                        if(res.Status == 'Success'){
                            EncryptedStorage.getItem('userId',(userId,err) => {
                                if(userId){
                                    const {dispatch} = this.props
                                    dispatch(RegistrationActionCreator.isMobileNumberVerified(userId,'true'))
                                }
                            })
                            this.props.navigation.navigate('SignUp6')
                        }
                    }
                }
            }
        }
    }

    onResendOtpTapped = () => {
        this.props.navigation.goBack()
    }

    
    render(){
    
     return (
        <View style={styles.container}>
            <View style={styles.textContainer} >
                {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ?
                null
            :
            <Image source={Icons['PASSWORD']} resizeMode='contain' style={styles.image} />
             }
                
                <Text style={[styles.text, { marginTop: 10 }]} >{SIGNUP_5.lbl_1}</Text>
                <Text style={styles.text} >{SIGNUP_5.lbl_2}</Text>
                <Text style={styles.text} >{SIGNUP_5.lbl_3}</Text>

                {/* customized */}
                <View style={styles.pinEntryContainer}>
                    <SmoothPinCodeInput
                    codeLength={6}
                    onFulfill={() => {

                        setTimeout(() => {
                           
                          }, 1000)
                        
                    }}
                        placeholder=""
                        cellStyle={{
                            borderWidth: 1,
                            borderRadius: 24,
                            borderColor: Colors.LightGray,
                            backgroundColor: Colors.WHITE,
                        }}
                        cellStyleFocused={{
                            borderColor: Colors.LightGray,
                            backgroundColor: Colors.WHITE,
                        }}
                        textStyle={{
                            fontSize: 24,
                            fontFamily:fonts.medium,
                            color: Colors.TEXT_INPUT
                        }}
                        textStyleFocused={{
                            color: Colors.TEXT_INPUT
                        }}
                        value={this.state.count}
                        onTextChange={count => {
                            this.setState({count:count})
                            
                        }}
                    />
                </View>
                <OTPTimer
                onResendOtpTapped={this.onResendOtpTapped}
                />
                <UnderlineText title={SIGNUP_5.lbl_4} navigate={() => { this.props.navigation.goBack() }} />
                <TimerImageComponent/>
            </View>

            <View style={styles.btnContainer} >
                <YellowButton title={CONTINUE}
                disabled={this.state.count.length < 6}
                style={{margin:20,alinSelf:'center'}} 
                navigate={() => {
                    if(this.state.count.length > 5){
                        EncryptedStorage.getItem('userId',(res,err) => {
                            if(res){
                                const {dispatch} = this.props
                                dispatch(RegistrationActionCreator.verifyEmailAndMobile(res,this.state.count,'Mobile'))
                            }
                        })
                    }
                    
                }} />
            </View>
        </View>
    );
            }
}

export default connect(mapStateToProps)(SignUpStep5);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: Colors.BG_LIGHT_BLUE
    },
    textContainer: {
        width: getDeviceWidth(),
        alignItems: "center",
        height:heightToDp('70%')
    },
    text:{
        fontFamily:fonts.medium,
        fontSize:13
    },
    image: {
        width: widthToDp('16%'),
        height: heightToDp('16%'),
        tintColor: Colors.YELLOW,
        marginTop: 15
    },
    btnContainer: {
        width: getDeviceWidth(),
        alignItems: "center"
    },
    pinEntryContainer: {
        alignItems: 'center',
        margin: 1,
        marginVertical: 30
    }
});
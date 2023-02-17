import React, { Component } from 'react';
import { StyleSheet, View, Keyboard, Image, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, NativeModules } from 'react-native';
import { SIGNUP_6, CONTINUE, BACK } from '../../../../../constants'
import Colors from '../../../../../utils/colors'
import YellowButton from '../../../../../components/button';
import Icons from '../../../../../assets/icons'
import { heightToDp, widthToDp, getDeviceWidth, isValidPassword } from '../../../../../utils';

import ActivityIndicatorComponent from '../../../../../components/activityIndicator';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RegistrationActionCreator } from '../../../../../redux/actionCreators/registration';
import { AuthActionCreator } from '../../../../../redux/actionCreators/auth';
import fonts from '../../../../../assets/fonts';
import Config from "react-native-config";
var Aes = NativeModules.Aes
import CryptoJS from "react-native-crypto-js";
import TouchIdOrFceIdComponent from '../../../../../components/touchid/touchIdOrFceIdComponent';
import { LoginctionCreator } from '../../../../../redux/actionCreators/login';




// const keyToEncrytThePassword = 'IRM54JE9Q86DFE!@'
const keyToEncrytThePassword = 'IRM54JE9Q86DFE!@'


const mapStateToProps = (state) => ({

    loading: state.CreateMPinRegReducer.loading,
    request: state.CreateMPinRegReducer.request,
    response: state.CreateMPinRegReducer.response,

    mobileVerifiedLoading: state.MobileNumberVerifiedRegReducer.loading,
    mobileVerifiedRequest: state.MobileNumberVerifiedRegReducer.request,
    mobileVerifiedResponse: state.MobileNumberVerifiedRegReducer.response,

    emailLoading: state.GetEmailAddressReducer.loading,
    emailRequest: state.GetEmailAddressReducer.request,
    emailResponse: state.GetEmailAddressReducer.response,

})

class SignUpStep6 extends Component {

    constructor(props) {
        super(props)
        this.state = {
            pin: '',
            confirmPin: '',
            email:'',
            isSwitchEnabled:false

        }
    }

    async componentDidMount() {
        // EncryptedStorage.getItem('userId',(res,err) => {
        //     if(res){
        //         this.props.dispatch(RegistrationActionCreator.isMobileNumberVerified(res,'true'))
        //     }
        // })
        const email = await EncryptedStorage.getItem('email')
        this.setState({email:email})
        this.props.dispatch(LoginctionCreator.getEmailAddress())

    }

    componentDidUpdate(prevProps) {
        const res = this.props.response
        if (typeof (res) != 'undefined') {
            if (Object.keys(res).length > 0) {
                if (typeof (res.Status) != 'undefined') {
                    if (res.Status == 'Success') {
                        // if(res.saved_status == 'true'){
                        this.props.dispatch(RegistrationActionCreator.resetResponse('5'))
                        if (typeof (this.props.route.params) != 'undefined') {
                            if (typeof (this.props.route.params.isChangePin) != undefined) {

                                this.props.dispatch(AuthActionCreator.isFirstTime(false))
                                this.props.dispatch(AuthActionCreator.isLoggedIn(false))
                                return
                            }
                        }

                        if (this.props.isFromLogin != null) {
                            if (this.props.isFromLogin) {
                                this.props.dispatch(AuthActionCreator.isFirstTime(false))
                                this.props.dispatch(AuthActionCreator.isLoggedIn(false))
                            } else {
                                this.props.navigation.navigate('SignUp7')
                            }
                        } else {
                            this.props.navigation.navigate('SignUp7')
                        }
                        // }
                    } else {
                        alert('There was a problem occured while creating the MPIN. Please try again.')
                    }
                }
                this.props.dispatch(RegistrationActionCreator.resetResponse('5'))
            }
        }
    }

    encryptData = (text, key) => {
        return Aes.randomKey(16).then(iv => {
            return Aes.encrypt(text, key, keyToEncrytThePassword).then(cipher => ({
                cipher,
                keyToEncrytThePassword,
            }))
        })
    }

    decryptData = (encryptedData, key) => Aes.decrypt(encryptedData.cipher, key, encryptedData.iv)

    generateKey = (password, salt, cost, length) => Aes.pbkdf2(password, salt, cost, length)

    onNextButtonTapped = () => {
        const pin = this.state.pin
        const cPin = this.state.confirmPin

        key = keyToEncrytThePassword
        let iv2 = keyToEncrytThePassword
        let utf8Key = CryptoJS.enc.Utf8.parse(key)
        console.warn('KEY: '+utf8Key)
        let utf8Iv = CryptoJS.enc.Utf8.parse(iv2)
        console.warn('IV: '+utf8Iv)
        let content = CryptoJS.enc.Utf8.parse(pin)
        

        var encrypted = CryptoJS.AES.encrypt(content, utf8Key, {
            iv:utf8Iv,
            mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
        });

        console.warn('ENCR: ' + encrypted + ' Type: '+typeof(encrypted.toString()))

        if(pin == cPin){
            Keyboard.dismiss()

        }

        // var decrypted = CryptoJS.AES.decrypt(encrypted, key)
        // console.warn('DEC: ' + decrypted)
        EncryptedStorage.getItem('userId', (res, err) => {
            if (res) {
                this.props.dispatch(RegistrationActionCreator.createMPin(res, encrypted.toString(),this.state.isSwitchEnabled,pin))
            }
        })

        return
    }

    onSwitchTapped = (isEnabled) => {
        this.setState({isSwitchEnabled:isEnabled})
    }

    render() {

        const isFromLogin = this.props.isFromLogin
        const isCCS = Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')

      

        if (this.props.loading || this.props.mobileVerifiedLoading) {
            return (
                <ActivityIndicatorComponent />
            )
        }
        return (
            <KeyboardAvoidingView behaviour={Platform.OS == 'ios' && 'padding'} style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ width: getDeviceWidth() }} >

                    <View style={styles.textContainer} >
                        <Image source={Icons['LOCK']} resizeMode='contain' style={styles.image} />
                        <Text style={styles.textGreen} >{typeof (isFromLogin) != 'undefined' ? SIGNUP_6.lbl_2 : SIGNUP_6.lbl_1}</Text>
                        <View style={styles.InputContainer}>
                            <TextInput
                                style={styles.textInput}
                                secureTextEntry={true}
                                value={isCCS ? this.state.pin.replace(' ', '') : this.state.pin.replace('.', '')}
                                onChangeText={(text) => {
                                    if (isCCS) {
                                        this.setState({ pin: text.replace(' ', '') })
                                    } else {
                                        this.setState({ pin: text.replace('.', '') })
                                    }

                                }}
                                placeholder={isCCS ? 'Enter Password*' : "Enter 6 digit MPIN*"}
                                maxLength={isCCS ? 20 : 6}
                                keyboardType={isCCS ? 'default' : 'numeric'}
                                placeholderTextColor={Colors.TEXT_INPUT_PLACEHOLDER}
                                underlineColorAndroid="transparent"
                                returnKeyType='next'
                                returnKeyLabel='Next'
                            />
                        </View>
                        {isCCS &&
                            <View>
                                {!isValidPassword(this.state.pin) && this.state.pin.length > 0 &&
                                    <Text style={{ fontFamily: fonts.regular, backgroundColor: 'transparent', fontSize: 12, color: Colors.APP_GREEN, textAlign: 'center', margin: 10 }}>Password is not valid</Text>
                                }
                            </View>
                        }
                        
                        <View style={[styles.InputContainer,{marginBottom:20}]}>
                            <TextInput
                                style={styles.textInput}
                                secureTextEntry={true}
                                value={isCCS ? this.state.confirmPin.replace(' ', '') : this.state.confirmPin.replace('.', '')}
                                onChangeText={(text) => {
                                    if (isCCS) {
                                        this.setState({ confirmPin: text.replace(' ', '') })
                                    } else {
                                        this.setState({ confirmPin: text.replace('.', '') })
                                    }

                                }}
                                placeholder={isCCS ? 'Confirm Password*' : "Confirm 6 digit MPIN*"}
                                maxLength={isCCS ? 20 : 6}
                                keyboardType={isCCS ? 'default' : 'numeric'}
                                placeholderTextColor={Colors.TEXT_INPUT_PLACEHOLDER}
                                underlineColorAndroid="transparent"
                                returnKeyType='done'
                                returnKeyLabel='Done'
                            />
                        </View>
                        {isCCS &&
                            <View>
                                {!(this.state.pin === this.state.confirmPin) && this.state.confirmPin.length > 0 &&
                                    <Text style={{ fontFamily: fonts.regular, backgroundColor: 'transparent', fontSize: 12, color: Colors.APP_GREEN, textAlign: 'center', margin: 10 }}>Entered passwords do not match</Text>
                                }
                            </View>
                        }
                        {isCCS &&
                            <Text style={{ fontFamily: fonts.regular, backgroundColor: 'transparent', fontSize: 12, color: Colors.APP_GREEN, textAlign: 'center', margin: 10,marginTop:8,marginBottom:15 }}>Minimum 8 and maximum 20 characters{'\n'}Should contain alphanumeric and special characters</Text>}
                        <TouchIdOrFceIdComponent
                        onSwitchTapped={this.onSwitchTapped}
                        shouldPromptTouchId={false}
                        isLogin={false}
                        isSettings={false}
                        isCreateMpin={true}
                        onSignInWithTouchIdTapped={null}
                        shouldShowEnableTouchId={true}
                        email={this.state.email}
                        />
                    </View>
                </ScrollView>
                <View style={styles.btnContainer} >
                    <YellowButton title={CONTINUE}
                        disabled={this.state.pin.length < 8 || this.state.confirmPin.length < 8 && !(this.state.pin === this.state.confirmPin) && !isValidPassword(this.state.pin) && !isValidPassword(this.state.confirmPin)}
                        navigate={() => { this.onNextButtonTapped() }} />
                    {typeof (isFromLogin) != 'undefined' &&
                        <View style={{ marginTop: 10 }}>
                            <YellowButton title={BACK}
                                navigate={() => {
                                    this.props.dispatch(AuthActionCreator.isFirstTime(false))
                                    this.props.dispatch(AuthActionCreator.isLoggedIn(false))
                                }} />
                        </View>

                    }
                </View>
            </KeyboardAvoidingView>
        )
    }

}

export default connect(mapStateToProps)(SignUpStep6);


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
        justifyContent: 'center',
        alignContent: "center"
    },
    InputContainer: {
        width: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? widthToDp('80%') :  widthToDp('70%'),
        marginTop: 20,
        borderWidth: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 0 : 1,
        borderStyle: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? null : "solid",
        borderColor: Colors.APP_GREEN,
        borderRadius: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 5 : 3,
        overflow: 'hidden'
    },
    textInput: {
        height: 45,
        color: Colors.TEXT_INPUT,
        backgroundColor: Colors.WHITE,
        paddingLeft: 10,
        fontFamily: fonts.regular,
        fontSize:13
    },
    btnContainer:
    {
        width: getDeviceWidth(),
        marginVertical: 40,
        alignItems: "center"
    },
    image:
    {
        width: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? widthToDp('20%')  : widthToDp('16%'),
        height: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? heightToDp('20%') : heightToDp('16%'),
        tintColor: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? null : Colors.YELLOW,
        marginTop: 30
    },
    textGreen:
    {
        color: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? Colors.BLACK : Colors.APP_GREEN,
        fontSize: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 20 : widthToDp('9%'),
        fontFamily: fonts.medium,
        alignSelf: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'flex-start' :'center',
        marginLeft: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 20 : null,
        marginTop: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 30 : null
    },
    textBlack:
    {
        color: Colors.BLACK,
        fontSize: widthToDp('4.5%'),
        marginTop: 10,
        fontFamily: fonts.medium
    }
});
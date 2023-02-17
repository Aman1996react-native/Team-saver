import React, { useState, Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
  NativeModules,
  Alert
} from 'react-native';
import Colors from '../../../../utils/colors'
import { getDeviceWidth, widthToDp, isValidEmail, getDeviceHeight, popUpHeight } from '../../../../utils';
import { connect } from 'react-redux';
import ActivityIndicatorComponent from '../../../../components/activityIndicator';
import { LoginctionCreator } from '../../../../redux/actionCreators/login';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import fonts from '../../../../assets/fonts';
import { AuthActionCreator } from '../../../../redux/actionCreators/auth';
import colors from '../../../../utils/colors';
import Icons from '../../../../assets/icons';
import Modal from 'react-native-modal';
import JailMonkey from 'jail-monkey'
import ReactNativeBiometrics from 'react-native-biometrics'
import Toast from 'react-native-toast-message';
import RBSheet from "react-native-raw-bottom-sheet";
import { WebView } from 'react-native-webview';
import Config from "react-native-config";
import YellowButton from '../../../../components/button';
import { DYNAMIC_LINK } from '../../../../constants';
import { CheckAccessTokenExpiryTime } from '../../../../redux/actionCreators/checkAccessTokenExpiry';
import TouchIdOrFceIdComponent from '../../../../components/touchid/touchIdOrFceIdComponent';
import LegalInfo from '../../LegalInfo';
import CheckBox from '@react-native-community/checkbox';
import FastImage from 'react-native-fast-image';
import CommonWebView from '../../../../components/commonWebview/commonWebView';
import CookieManager from '@react-native-cookies/cookies';
import CryptoJS from "react-native-crypto-js";
import base64 from 'react-native-base64';
import RNExitApp from 'react-native-exit-app';
var Aes = NativeModules.Aes
const keyToEncrytThePassword = 'IRM54JE9Q86DFE!@'

const mapStateToProps = (state) => ({

  loading: state.LoginReducer.loading,
  request: state.LoginReducer.request,
  response: state.LoginReducer.response,

  forgtPinLoading: state.ForgotMPINReducer.loading,
  forgtPinRequest: state.ForgotMPINReducer.request,
  forgtPinResponse: state.ForgotMPINReducer.response,

  changePinLoading: state.ChangePinReducer.loading,
  changePinRequest: state.ChangePinReducer.request,
  changePinResponse: state.ChangePinReducer.response,

  SSOLINKS_DATA : state.LoginReducer.response,

})

let enterPin = 'Enter your 6 digit PIN'
let forgotPin = 'Forgotten Pin?'
let forgotPassword = 'Forgot password'

class LoginPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      atext: false,
      btext: false,
      ctext: false,
      dtext: false,
      etext: false,
      ftext: false,
      code: '',
      password: '',
      errorMessage: '',
      email: '',
      forgotPinTapped: false,
      emailIfForgottenPassword: '',
      errorMessageChangePin: '',
      rootedDeviceText: '',
      shouldPromptTouchId: false,
      isSwitchEnabled: false,
      shouldShowEnableTouchId: true,
      secureEye: true,
      tnc: false,
      pp: false,
      legalInfo: '',
      OpenSSoWebView:false,
      sos_email:"",
      openlinkdata : ""
    }
  }



  concatCode = (value) => {

    var res = this.state.code
    res = res.concat(value)
    this.setState({ code: res }, () => {
      if (this.state.code.length == 6) {
        EncryptedStorage.getItem('email', (res, err) => {
          if (res != null && res) {
            this.onLoginTapped(this.state.code, res)
            // this.props.dispatch(LoginctionCreator.login(this.state.code, res))
          } else {
            // this.props.navigation.navigate('NameEmail')
            this.props.dispatch(AuthActionCreator.isFirstTime(true))
          }
        })
      }
    })
  }

  validateCode = () => {

  }

  clearCode = () => {
    this.setState({ atext: false, btext: false, ctext: false, dtext: false, etext: false, ftext: false, code: '' })
  }




  numberpressed = (value) => {
    const atext = this.state.atext
    const btext = this.state.btext
    const ctext = this.state.ctext
    const dtext = this.state.dtext
    const etext = this.state.etext
    const ftext = this.state.ftext

    if (!atext) {
      this.setState({ atext: true }, () => {
        this.concatCode(value);
      })

    } else if (atext && !btext) {
      this.setState({ btext: true }, () => {
        this.concatCode(value);
      })
    } else if (btext && !ctext) {
      this.setState({ ctext: true }, () => {
        this.concatCode(value);
      })
    } else if (ctext && !dtext) {
      this.setState({ dtext: true }, () => {
        this.concatCode(value);
      })
    }
    else if (dtext && !etext) {
      this.setState({ etext: true }, () => {
        this.concatCode(value);
      })
    }
    else if (etext && !ftext) {
      this.setState({ ftext: true }, () => {
        this.concatCode(value);
        // this.validateCode();
      })

    }
  }

  async componentDidMount() {
    // this.props.dispatch(LoginctionCreator.SSO_Links()) 
    await this.props.dispatch(LoginctionCreator.SSO_Links())
    // CookieManager.removeSessionCookies()
    // .then((sessionCookiesRemoved) => {
    //   console.log('CookieManager.removeSessionCookies =>', sessionCookiesRemoved);
    // });

    const email = await EncryptedStorage.getItem('email')
const sos_email = await EncryptedStorage.getItem('sos_email')
    //  console.warn('HEHEHEHEHEE TOKEN: '+ await EncryptedStorage.getItem('sessionToken'))

    // console.log("sos_email--[",sos_email)
    if (typeof (email) != 'undefined') {
      if (email != null) {
        if (email) {
          this.setState({ email: email, emailIfForgottenPassword: email,sos_email:sos_email })
        }
      }
    }
    if (JailMonkey.isJailBroken()) {
      this.ExitAppFunction()
      // Alternative behaviour for jail-broken/rooted devices.
      this.setState({ rootedDeviceText: 'Application is running on Rooted/Jail-broken device.' })
    } else {
      // console.log("JailMonkey.isJailBroken()",await JailMonkey.isJailBroken())
      this.setState({ rootedDeviceText: '' })
      // this.setState({ rootedDeviceText: 'Application is running on Rooted/Jail-broken device. component' })

    }

  

    if (this.state.email.length > 3) {
      const storedPassword = await EncryptedStorage.getItem(this.state.email.toString())

      console.warn(storedPassword)

      if (typeof (storedPassword) != 'undefined') {
        if (storedPassword != null) {
          if (typeof (storedPassword) == 'string') {
            if (storedPassword.length > 3) {
              this.setState({ shouldPromptTouchId: true })
            }
          }
        }
      }
    }


  }

  ExitAppFunction = () => {
    Alert.alert('Confirmation', 'Your device is jail breaked and rooted so you can not access the app.', [
     
        {text: 'OK', onPress: () => RNExitApp.exitApp()},
      ]);
}

  async componentDidUpdate(prevsprops) {
    const res = this.props.forgtPinResponse
    // console.log('secure eye state', this.state.secureEye)
    // console.warn('FORGOT PIN: ' + JSON.stringify(res))
    const response = this.props.response
    if (typeof (res) != 'undefined') {
      // console.warn(JSON.stringify(res))
      if (Object.keys(res).length > 0) {
        this.props.dispatch(LoginctionCreator.resetResponse('3'))
        if (typeof (res.Status) != 'undefined' && typeof (res.pinMailSent) != 'undefined') {
          if (res.Status == 'Success' && res.pinMailSent == 'true') {
            if (typeof (res.Token) != 'undefined') {
              if (res.Token != null) {
                if (typeof (res.Token.access_token) != 'undefined') {
                  if (res.Token.access_token != null) {
                    console.warn('FORGOT EMAIL: ' + this.state.emailIfForgottenPassword)
                    await EncryptedStorage.setItem('email', this.state.emailIfForgottenPassword)
                    await EncryptedStorage.setItem('sessionToken', JSON.stringify(res.Token))
                    let today = new Date();
                    let date = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
                    let time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
                    let dateTime = date + 'T' + time;
                    await EncryptedStorage.setItem('timeWhenGotAccessToken', dateTime)
                    this.setState({ forgotPinTapped: false }, () => {
                      this.props.navigation.navigate('Change Pin Verification', { isFromLogin: true })
                    })

                  }
                }
              }
            }


          } else {
            if (typeof (res.Description) != 'undefined') {
              if (res.Description != null) {
                this.setState({ errorMessageChangePin: res.Description })
              }
            }
          }
        }
      }
    }

    if (typeof (response) != 'undefined') {
      if (response != null) {
        if (Object.keys(response).length > 0) {
          this.props.dispatch(LoginctionCreator.resetResponse('1'))
          if (typeof (response.Status) != 'undefined') {
            if (response.Status == 'Fail') {
              this.setState({ errorMessage: 'Incorrect Password' })
            }
          }
        }

      }
    }
    const sso_Links = this.props.SSOLINKS_DATA
    if (prevsprops.SSOLINKS_DATA != this.props.SSOLINKS_DATA && this.props.SSOLINKS_DATA != 'undefined' && Object.keys(response).length > 0 ) {
this.setState({ openlinkdata : sso_Links},()=>{
  // console.log("thios,",this.state.openlinkdata)
})
   }
  }

  forgotMPIN = async () => {
    this.props.dispatch(LoginctionCreator.forgotMpin(this.state.emailIfForgottenPassword))
  }

  closeBottomSheet = () => {
    this.RBSheet.close()
  }

  onSwitchTapped = (isEnabled) => {
    this.setState({ isSwitchEnabled: isEnabled })
  }

  onLoginTapped = (password, email) => {
    this.props.dispatch(LoginctionCreator.login(password, email, this.state.isSwitchEnabled))
  }

  toastMessage = () => {
    <Toast
      position='top'
      topOffset='50'
      type='info'
      text1='Info'
      bottomOffset={20}
      visibilityTime={3000}
      autoHide={true}
    />
  }

  onSignInWithTouchIdTapped = async () => {

    if (this.state.email.length > 3) {
      const storedPassword = await EncryptedStorage.getItem(this.state.email.toString())

      if (typeof (storedPassword) != 'undefined') {
        if (storedPassword != null) {
          if (typeof (storedPassword) == 'string') {
            if (storedPassword.length > 3) {
              this.onLoginTapped(storedPassword, this.state.email)
            }
          }
        }
      }
    }
  }

  openWebView = async ()=>{
    const sos_email = await EncryptedStorage.getItem('Sos_email')
   
    console.log("this.state.sos_email", sos_email)
    if (sos_email == "" || sos_email  == 'undefined' || sos_email == null){
      if (this.state.openlinkdata != "" || this.state.openlinkdata != null){
        this.setState({OpenSSoWebView : true,},()=>{
          this.CommonWebView.openSosView(true)
        })
      }else{
        this.props.dispatch(LoginctionCreator.SSO_Links()) 
      }  
    } else {
      this.props.dispatch(LoginctionCreator.Sos_login(sos_email)) 
    }
  }

  hitLoginApiForSos = (email) => {
    this.props.dispatch(LoginctionCreator.Sos_login(email))
    // alert("Api hit")
  }

  Decryption=()=>{
// let data = "EgdxJpNVAWA6d0iNCUYvWQ=="

// key = keyToEncrytThePassword
// let iv2 = keyToEncrytThePassword
// let utf8Key = CryptoJS.enc.Utf8.parse(key)
// console.warn('KEY: '+utf8Key)
// let utf8Iv = CryptoJS.enc.Utf8.parse(iv2)
// console.warn('IV: '+utf8Iv)
// let content = CryptoJS.enc.Utf8.parse(data)
// console.warn('content: '+content)

// var encrypted = CryptoJS.AES.decrypt(content, utf8Key, {
//     iv:utf8Iv,
//     mode: CryptoJS.mode.CBC,
// padding: CryptoJS.pad.Pkcs7
// });
// var mydata = CryptoJS.AES.decrypt(data, keyToEncrytThePassword);


// console.log('ENCR: ' + encrypted + ' Type: '+typeof(encrypted.toString()))
//   }
// var bytes  = CryptoJS.AES.decrypt(content, utf8Key,{
//       iv:utf8Iv,
//   //     mode: CryptoJS.mode.CBC,
//   // padding: CryptoJS.pad.Pkcs7
//   })
// var plaintext = bytes.toString(CryptoJS.enc.Utf8);
// console.log("decrypted text ==", plaintext,"=",bytes);

const word = "Fail";
let key = keyToEncrytThePassword;
key = CryptoJS.enc.Utf8.parse(key);
let iv = keyToEncrytThePassword;
iv = CryptoJS.enc.Utf8.parse(iv);
let encrypted = CryptoJS.AES.encrypt(word, key, { iv: iv });
encrypted = encrypted.toString();
let decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });
decrypted = decrypted.toString(CryptoJS.enc.Utf8);console.log("Criptografia AES256 com Base64");

console.log('Texto: "meuteste"');
console.log(`Criptografado: ${encrypted}`);
console.log(`decrypted: ${decrypted}`);
  }

  render() {
    const atext = this.state.atext
    const btext = this.state.btext
    const ctext = this.state.ctext
    const dtext = this.state.dtext
    const etext = this.state.etext
    const ftext = this.state.ftext

    enterPin = (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Enter Email and Password' : 'Enter your 6 digit PIN'
    forgotPin = (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Forgotten Password?' : 'Forgotten Pin?'

    if (this.props.loading || this.props.forgtPinLoading || this.props.changePinLoading) {
      return (
        <ActivityIndicatorComponent />
      )
    }

    return (
      <ScrollView style={{ backgroundColor: '#FAFAFA', }} showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.container}>
          <View style={styles.imageBgContainer}>
            <View resizeMode='stretch' style={styles.imageBg}>
              <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: "center"
              }}>

                <Modal backdropOpacity={0.6}
                  backdropColor={'#000000'} isVisible={this.state.forgotPinTapped} style={styles.modal}>
                  <View style={styles.modalTopView}>
                    {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                      <FastImage
                        resizeMode='contain'
                        style={{
                          width: 60,
                          height: 60,
                          marginBottom: 20
                        }}
                        source={Icons['PIGICON']}
                        // source={Icons['CCS_REG1']}
                      />}
                    <Text style={[styles.numStyle, { fontFamily: fonts.bold }]}>Confirm Email*</Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center', margin: 10, width: '80%', borderWidth: 1, borderColor: colors.APP_GREEN, borderRadius: 5 }}>
                      <TextInput
                        placeholder='Email*'
                        value={this.state.emailIfForgottenPassword}
                        onChangeText={(text) => {
                          this.setState({ emailIfForgottenPassword: text })
                        }}
                        placeholderTextColor={colors.GREY}
                        keyboardType='email-address'
                        autoCapitalize="none"
                        style={[styles.numStyle, { marginTop: 10, marginBottom: 10, width: '100%', textAlign: 'center' }]}
                      />
                      {!isValidEmail(this.state.emailIfForgottenPassword) && this.state.email != '' &&
                        <Text style={{ fontFamily: fonts.regular, color: Colors.APP_GREEN, fontSize: 12, textAlign: 'center' }}>Invalid email address</Text>
                      }
                    </View>
                    <Text style={{ fontFamily: fonts.regular, fontSize: 12, textAlign: 'center', margin: 10, color: Colors.APP_GREEN }}>{this.state.errorMessageChangePin}</Text>
                    <YellowButton
                      title='Proceed'
                      style={{ width: '80%', alignSelf: 'center', marginTop: 20, }}
                      disabled={this.state.emailIfForgottenPassword.length < 3 || !isValidEmail(this.state.emailIfForgottenPassword)}
                      navigate={() => {
                        this.setState({ errorMessageChangePin: '' })
                        this.forgotMPIN()
                      }}
                    />
                    <YellowButton
                      title='Close'
                      style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}
                      navigate={() => {
                        this.setState({ forgotPinTapped: false, errorMessageChangePin: '' })
                      }}
                    />
                  </View>
                </Modal>

                {(!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) &&
                  <Text style={{ marginTop: 15, fontFamily: fonts.bold, fontSize: 22 }}>{enterPin}</Text>}

                {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                  <View style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Text style={{ marginLeft: 20, marginRight: 20, marginBottom: 10, fontFamily: fonts.medium, textAlign: 'center', color: colors.APP_GREEN }}>{this.state.rootedDeviceText}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: getDeviceWidth() - 30, marginLeft: 15, marginRight: 15 }}>
                      <Text style={{ marginTop: 15, marginLeft: 5, fontFamily: fonts.bold, fontSize: 22 }}>Login</Text>
                      <FastImage style={{ width: 170, height: 157, marginBottom: -15, marginLeft: 50 }}
                        resizeMode="contain" source={Icons['PIGICON']} />
                      <TouchableOpacity onPress={() => { alert('Please use G8 SSO details to login.') }}>
                        <FastImage style={{ width: 18, height: 18, marginBottom: 0, marginRight: 8 }}
                          resizeMode="contain" source={Icons['QUESTIONICON']} /></TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>

                      <TextInput
                        placeholder='Email*'
                        value={this.state.email}
                        onChangeText={(text) => {
                          this.setState({ email: text, emailIfForgottenPassword: text }, async () => {
                            if (this.state.email.length > 3) {
                              const storedPassword = await EncryptedStorage.getItem(this.state.email.toString())

                              if (typeof (storedPassword) != 'undefined') {
                                if (storedPassword != null) {
                                  if (typeof (storedPassword) == 'string') {
                                    if (storedPassword.length > 3) {
                                      this.setState({ shouldPromptTouchId: true, shouldShowEnableTouchId: false })
                                    } else {
                                      this.setState({ shouldPromptTouchId: false, shouldShowEnableTouchId: true })
                                    }
                                  }
                                }
                              } else {
                                this.setState({ shouldPromptTouchId: false, shouldShowEnableTouchId: true })
                              }
                            }
                          })
                        }}
                        placeholderTextColor={colors.GREY}
                        keyboardType='email-address'
                        autoCapitalize="none"
                        style={[styles.numStyle, { marginTop: 10, width: '100%', textAlign: 'left', backgroundColor: colors.WHITE, height: 45, borderRadius: 5, paddingLeft: 20 }]}
                      />
                      {!isValidEmail(this.state.email) && this.state.email != '' &&
                        <Text style={{ fontFamily: fonts.regular, color: Colors.APP_GREEN, fontSize: 12, textAlign: 'center' }}>Invalid email address</Text>
                      }

                    </View>
                    <View style={styles.inputContainer}>
                      <TextInput
                        placeholder='Password*'
                        value={this.state.password}
                        onChangeText={(text) => {
                          this.setState({ password: text })
                        }}
                        secureTextEntry={this.state.secureEye}
                        placeholderTextColor={colors.GREY}
                        style={[styles.numStyle, { marginBottom: 10, width: '100%', textAlign: 'left', backgroundColor: colors.WHITE, height: 45, borderRadius: 5, paddingLeft: 20 }]}
                      />
                      <Pressable onPress={() => this.setState(prevState => ({ secureEye: !prevState.secureEye }))}
                        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, width: 25, height: 25, position: 'absolute', right: 10, top: 15 }]}>
                        <Image style={{ position: 'absolute', width: 18, height: 18, right: 0, top: 0 }}
                          resizeMode="contain" source={Icons[this.state.secureEye ? 'SECURE_EYE' : 'SECURE_EYE_HIDE']} />
                      </Pressable>
                    </View>


                    <Text style={{ fontFamily: fonts.regular, fontSize: 12, textAlign: 'center', margin: 10, color: Colors.APP_GREEN }}>{this.state.errorMessage}</Text>

                  </View>


                }
                {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                  <>
                    <View style={{ marginTop: 10, justifyContent: 'flex-start', width: '100%' }}>
                      {/* <View style = {{ width : '100%', flexDirection : 'row', alignSelf : 'flex-start', paddingHorizontal : 20, marginTop : 50}}>
                      
                        <CheckBox
                                disabled={false}
                                style={{ width: 20, height: 20, marginRight: 10 }}
                                value={this.state.pp}
                                onValueChange={(newValue) => {
                                    this.setState( prevState => ({ pp : !prevState.pp }))
                                }}
                                boxType={'circle'}
                                onCheckColor={colors.APP_GREEN}
                                tintColor={colors.APP_GREEN}
                                onTintColor={colors.APP_GREEN}
                            />
                        <Pressable onPress={ () => (this.setState({legalInfo : 'pp'}) ,this.RBSheet.open())} style = { ({pressed}) => [{ opacity : pressed ? 0.5 : 1, marginHorizontal  :24}]}>
                        <Text style = {{ marginTop : 2, fontWeight : '700'}}>I agree to the Privacy Policy</Text>
                        </Pressable>
                  </View> */}
                      {/* <View style = {{ width : '100%', flexDirection : 'row', paddingHorizontal : 20, marginTop : 20}}>
                       
                         <CheckBox
                                disabled={false}
                                style={{ width: 20, height: 20, marginRight: 10 }}
                                value={this.state.tnc}
                                onValueChange={(newValue) => {
                                    this.setState( prevState => ({ tnc : !prevState.tnc }))
                                }}
                                boxType={'circle'}
                                onCheckColor={colors.APP_GREEN}
                                tintColor={colors.APP_GREEN}
                                onTintColor={colors.APP_GREEN}
                            />
                         <Pressable onPress={ () => (this.setState({legalInfo : 'tnc'}) ,this.RBSheet.open())} style = { ({pressed}) => [{ opacity : pressed ? 0.5 : 1, marginHorizontal  :24}]}>
                        <Text style = {{ marginTop : 2, fontWeight : '700'}}>I agree to the Terms & Conditions</Text>
                        </Pressable>
                  </View> */}
                      <View style={{ padding: 20, marginTop: "1%" }}>

                      <YellowButton  
                          disabled={this.state.password.length < 7 || this.state.password == null || this.state.email.length < 3 ||
                            !isValidEmail(this.state.email)}
                          navigate={() => {
                            this.onLoginTapped(this.state.password, this.state.email)
                          }}
                          // title='LOGIN TO TEAM SAVER'
                          title="Kiddo and Leor Login"
                        /> 

                      <YellowButton style={{ marginTop: 10 }}
                          navigate={() => {
                            console.log("click")
                            this.openWebView()
                            // this.Decryption()
                            
                          }}
                          // title='LOGIN WITH SSO'
                          title="G8 SSO Login"
                        />
                       

                        
                      </View>

                      <Text style={{ textAlign: 'center', fontSize: 11, marginTop: 60, paddingHorizontal: 15 }}>If you are a Leor or Kiddo team member, register your details below</Text>
                    </View>
                  </>
                }


                {(!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) &&
                  <View style={{ flexDirection: 'row' }} >
                    {atext ? <View style={styles.pinFilled} /> : <View style={styles.pin} />}
                    {btext ? <View style={styles.pinFilled} /> : <View style={styles.pin} />}
                    {ctext ? <View style={styles.pinFilled} /> : <View style={styles.pin} />}
                    {dtext ? <View style={styles.pinFilled} /> : <View style={styles.pin} />}
                    {etext ? <View style={styles.pinFilled} /> : <View style={styles.pin} />}
                    {ftext ? <View style={styles.pinFilled} /> : <View style={styles.pin} />}
                  </View>
                }

                <TouchableOpacity>
                  <View style={{ width: "100%", alignItems: "center", }} >

                    <Text style={{ fontSize: 15, }}></Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ forgotPinTapped: true, errorMessageChangePin: '' })
                        // this.props.navigation.navigate('ForgotPassword')
                      }}
                      style={{ padding: 10, height: 40, marginBottom: 25 }}>
                      <Text style={{ fontSize: 10, color: 'red' }}>{forgotPassword}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        // this.props.dispatch(AuthActionCreator.isFirstTime(true))
                        // this.props.dispatch(AuthActionCreator.isLoggedIn(false))
                        this.props.navigation.navigate('SignUp2', { isSignUp: true })
                      }}
                      style={{
                        padding: 10, height: 40,
                        width: widthToDp('90%'),
                        height: Number(Config.buttonHeight),
                        backgroundColor: 'transparent',
                        marginBottom: 15,
                        justifyContent: 'center',
                        borderRadius: widthToDp('45%'),
                        borderWidth: 2,
                        borderColor: 'red'
                      }}>
                      <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: colors.APP_GREEN, textAlign: 'center' }}>Register</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
                {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                  <View style={{ alignItems: 'center' }}>
                    {/* {this.state.email.length < 3 ||
                    !isValidEmail(this.state.email) ?

                    null
                    :

                    <TouchIdOrFceIdComponent
                      onSwitchTapped={this.onSwitchTapped}
                      shouldPromptTouchId={this.state.shouldPromptTouchId}
                      isLogin={true}
                      isSettings={false}
                      onSignInWithTouchIdTapped={this.onSignInWithTouchIdTapped}
                      shouldShowEnableTouchId={this.state.shouldShowEnableTouchId}
                      email={this.state.email}
                    />
                  } */}


                  </View>
                }
              </View>
            </View>
          </View>

          {(!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) ?
            <View style={styles.keypadContainer}>

              {/* 1st row */}
              <View style={styles.keypadRow} >
                <TouchableOpacity style={styles.keyBg} onPress={() => this.numberpressed(1)}>
                  <Text style={styles.numStyle}>1</Text>
                  <Text style={{ fontSize: 8, color: Colors.BG_LIGHT_BLUE }}>LLL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keyBg} onPress={() => this.numberpressed(2)}>
                  <Text style={styles.numStyle}>2</Text>
                  <Text style={styles.textStyle}>ABC</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keyBg} onPress={() => this.numberpressed(3)}>
                  <Text style={styles.numStyle}>3</Text>
                  <Text style={styles.textStyle}>DEF</Text>
                </TouchableOpacity>
              </View>




              {/* 2nd row */}
              <View style={styles.keypadRow} >
                <TouchableOpacity style={styles.keyBg} onPress={() => this.numberpressed(4)}>
                  <Text style={styles.numStyle}>4</Text>
                  <Text style={styles.textStyle}>GHI</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keyBg} onPress={() => this.numberpressed(5)}>
                  <Text style={styles.numStyle}>5</Text>
                  <Text style={styles.textStyle}>JKL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keyBg} onPress={() => this.numberpressed(6)}>
                  <Text style={styles.numStyle}>6</Text>
                  <Text style={styles.textStyle}>MNO</Text>
                </TouchableOpacity>
              </View>
              {/* 3rd row */}
              <View style={styles.keypadRow} >
                <TouchableOpacity style={styles.keyBg} onPress={() => this.numberpressed(7)}>
                  <Text style={styles.numStyle}>7</Text>
                  <Text style={styles.textStyle}>PQRS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keyBg} onPress={() => this.numberpressed(8)}>
                  <Text style={styles.numStyle}>8</Text>
                  <Text style={styles.textStyle}>TUV</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keyBg} onPress={() => this.numberpressed(9)}>
                  <Text style={styles.numStyle}>9</Text>
                  <Text style={styles.textStyle}>WXYZ</Text>
                </TouchableOpacity>
              </View>
              {/* 4th row */}
              <View style={styles.keypadRow}>
                <TouchableOpacity disabled={true} style={[styles.keyBg, { backgroundColor: 'transparent' }]}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: Colors.BG_LIGHT_BLUE
                  }}></Text>
                  <Text style={{ fontSize: 8, color: Colors.BG_LIGHT_BLUE }}></Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keyBg} onPress={() => this.numberpressed(0)}>
                  <Text style={styles.numStyle}>0</Text>
                  <Text style={{ fontSize: 8, color: Colors.BG_LIGHT_BLUE }}>LLL</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.keyBg, { backgroundColor: 'transparent' }]} onPress={() => this.clearCode()}>
                  <Image style={{ width: 32, height: 32, tintColor: colors.BLACK }} resizeMode="cover" source={require('../../../../assets/images/clear.png')} />
                </TouchableOpacity>
              </View> 

            </View>


            :

            null


          }

          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            height={popUpHeight()}
            openDuration={250}
            //closeOnDragDown={true}
            customStyles={{
              container: {
                justifyContent: "flex-start",
                alignItems: "center",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }
            }}
          >
            <LegalInfo data={this.state.legalInfo} close={() => this.closeBottomSheet()} />
          </RBSheet>
          {this.state.OpenSSoWebView ? <CommonWebView 
          ref={r => (this.CommonWebView = r)}
          URLdata={this.state.openlinkdata}
         hitSOSApi={(email)=> {this.hitLoginApiForSos(email)}}
           url={"https://reward360.optus.invia.com.au/saml/InitiateSingleSignOn"}></CommonWebView> : null}
        </SafeAreaView>
      </ScrollView>
    );
  }

}

export default connect(mapStateToProps)(LoginPage);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  imageBgContainer: {
    width: '100%',
    // height: 280,
    borderWidth: .1,
    borderColor: Colors.White,
    borderBottomRightRadius: 60,
    borderBottomLeftRadius: 60,
    overflow: 'hidden',

    // height: heightToDp('42%') 
  },
  imageBg: {
    width: '100%',
    height: '100%',
  },
  keypadContainer:
  {
    flex: 4.5,
    backgroundColor: Colors.LightGray,
    justifyContent: 'space-around',
    padding: 10
  },
  keypadRow: {
    flexDirection: 'row',
    backgroundColor: Colors.LightGray,
    justifyContent: 'space-around'
  },
  keyBg: {
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    margin: 5,
    paddingVertical: 10,
    flex: 1
  },
  numStyle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: Colors.BLACK
  },
  textStyle: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: Colors.BLACK
  },
  pin: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.APP_GREEN,
    borderRadius: 10,
  },
  pinFilled: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.APP_GREEN,
    borderRadius: 10,
    backgroundColor: colors.APP_GREEN
  },
  modal: {
    width: getDeviceWidth() - 20,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTopView: {
    backgroundColor: colors.White,
    // height: getDeviceWidth(),
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    // height: 340,
    paddingTop: 20,
    paddingBottom: 20
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: getDeviceWidth() - 40,
    margin: 20,
    marginBottom: 5,
    marginTop: 25,
    borderWidth: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 0 : 1,
    borderColor: colors.APP_GREEN,
    borderRadius: 5
  }
});

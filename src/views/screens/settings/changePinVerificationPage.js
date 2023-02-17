import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, NativeModules } from 'react-native';
import fonts from '../../../assets/fonts';
import YellowButton from '../../../components/button';
import { isValidEmail, widthToDp } from '../../../utils';
import colors from '../../../utils/colors';
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { ProfileActionCreator } from '../../../redux/actionCreators/app/profile';
import { DYNAMIC_LINK, SIGNUP_5 } from '../../../constants';
import { AuthActionCreator } from '../../../redux/actionCreators/auth';
import { RegistrationActionCreator } from '../../../redux/actionCreators/registration';
import ActivityIndicatorModal from '../../../components/activityIndicator/activityIndicatorModel';
import OTPTimer from '../../../components/auth/otpTimer';
import UnderlineText from '../../../components/underlineText';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import TimerImageComponent from '../../../components/timerImage/timerImageComponent';
import CryptoJS from "react-native-crypto-js";
import base64 from 'react-native-base64';
var Aes = NativeModules.Aes
const keyToEncrytThePassword = 'IRM54JE9Q86DFE!@'
const mapStateToProps = (state) => ({


  isEmailVerifiedLoading: state.VerifyEmailAndMobileReducer.loading,
  isEmailVerifiedRequest: state.VerifyEmailAndMobileReducer.request,
  isEmailVerifiedResponse: state.VerifyEmailAndMobileReducer.response,

  checkMobileLoading: state.SendMobileNumberRegReducer.loading,
  checkMobileRequest: state.SendMobileNumberRegReducer.request,
  checkMobileResponse: state.SendMobileNumberRegReducer.response,

})

class ChangePinVerificationPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      otp: ''
    };
  }

 async componentDidMount() {
  
  // console.warn('ENCR: ' + encrypted + ' Type: '+typeof(encrypted.toString()))
  // var ciphertext = CryptoJS.AES.encrypt('1234567', "r0b1nr0y");
  // console.log("encrypted text", ciphertext.toString());

  // var decrytekey = base64.encode("1234567")
  // console.log("decrytekey text", decrytekey.toString());

  // var ciphertext2 = CryptoJS.AES.encrypt(decrytekey, keyToEncrytThePassword);
  // console.log("ciphertext2",ciphertext2.toString())
}

  encryptData = (text, key) => {
    return Aes.randomKey(16).then(iv => {
        return Aes.encrypt("1234567", keyToEncrytThePassword).then(cipher => ({
            cipher,
            keyToEncrytThePassword,
        }))
    })


}


  componentWillUnmount() {
  }


  componentDidUpdate(prevProps) {

    if (this.state.otp.length > 5) {
      Keyboard.dismiss()
    }

    const res = this.props.isEmailVerifiedResponse
    if (typeof (res) != 'undefined') {
      if (Object.keys(res).length > 0) {
        this.props.dispatch(RegistrationActionCreator.resetResponse('11'))
        if (typeof (res.Status) != 'undefined') {
          if (res.Status == 'Success') {
            this.props.navigation.navigate('Change Pin', { isChangePin: true })

          }
        }
      }
    }
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  onNextTapped = async (code) => {
    const word = this.state.otp;
let key = keyToEncrytThePassword;
key = CryptoJS.enc.Utf8.parse(key);
let iv = keyToEncrytThePassword;
iv = CryptoJS.enc.Utf8.parse(iv);
let encrypted = CryptoJS.AES.encrypt(word, key, { iv: iv });
encrypted = encrypted.toString();
let decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv });
decrypted = decrypted.toString(CryptoJS.enc.Utf8);
console.log(`Criptografado: ${encrypted}`);
console.log(`Descriptografado: ${decrypted}`);
    EncryptedStorage.getItem('userId', (res, err) => {
      if (res) {
        this.props.dispatch(RegistrationActionCreator.verifyEmailAndMobile(res, encrypted.toString(), 'Mobile'))
        this.setState({ otp: '' })
        // this.props.dispatch(ProfileActionCreator.editEmail(res,this.props.route.params.email,DYNAMIC_LINK,'3'))
      }
    })
  }

  onResendOtpTapped = () => {
    this.setState({ otp: '' })
    EncryptedStorage.getItem('userId', (res, err) => {
      if (res) {
        const mobile = this.props.route.params.mobile
        if (typeof (mobile) != 'undefined') {
          if (mobile != null) {
            this.props.dispatch(RegistrationActionCreator.sendMobileNumber(res, mobile))
          }
        }
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicatorModal isVisible={this.props.isEmailVerifiedLoading || this.props.checkMobileLoading} />

        {/* <Text style={{fontFamily:fonts.bold,fontSize:16}}>Enter OTP:</Text> */}
        <Text style={{ fontFamily: fonts.bold, fontSize: 13 }} >{SIGNUP_5.lbl_1}</Text>
        <Text style={{ fontFamily: fonts.bold, fontSize: 13 }} >{SIGNUP_5.lbl_2}</Text>
        {typeof (this.props.route.params.mobile) != 'undefined'
          ?
          <Text style={{ fontFamily: fonts.bold, fontSize: 13 }} >{SIGNUP_5.lbl_3} {this.props.route.params.mobile}</Text>
          :
          <Text style={{ fontFamily: fonts.bold, fontSize: 13 }} >{SIGNUP_5.lbl_3} xxxxxxxxxx</Text>
        }


        {/* <View style={styles.InputContainer}> */}
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
              borderColor: colors.LightGray,
              backgroundColor: colors.WHITE,
            }}
            cellStyleFocused={{
              borderColor: colors.LightGray,
              backgroundColor: colors.WHITE,
            }}
            textStyle={{
              fontSize: 24,
              fontFamily: fonts.medium,
              color: colors.TEXT_INPUT
            }}
            textStyleFocused={{
              color: colors.TEXT_INPUT
            }}
            value={this.state.otp}
            onTextChange={count => {
              this.setState({ otp: count })

            }}

          />
        </View>
        {typeof(this.props.route.params.isFromLogin) == 'undefined' ?
        <OTPTimer
          onResendOtpTapped={this.onResendOtpTapped}
          
          />
        :
        <OTPTimer
          onResendOtpTapped={this.onResendOtpTapped}
          isFromLogin={true}
          />

          }


        

        {typeof (this.props.route.params.isFromLogin) == 'undefined' &&
          <UnderlineText title={SIGNUP_5.lbl_4} navigate={() => {
            this.setState({ otp: '' })
            EncryptedStorage.getItem('userId', (res, err) => {
              if (res) {
                const mobile = this.props.route.params.mobile
                if (typeof (mobile) != 'undefined') {
                  if (mobile != null) {
                    this.props.dispatch(RegistrationActionCreator.sendMobileNumber(res, mobile))
                  }
                }
              }
            })

          }} />
        }
        <TimerImageComponent/>

        <YellowButton
          title='Next'
          disabled={this.state.otp.length < 6}
          style={{ margin: 20 }}
          navigate={() => {
            this.onNextTapped()
            // EncryptedStorage.getItem('userId', (res, err) => {
            //   if (res) {
            //     this.props.dispatch(RegistrationActionCreator.verifyEmailAndMobile(res, this.state.otp, 'Mobile'))
            //     this.setState({ otp: '' })
            //   }
            // })
          }}
        />
        {typeof (this.props.route.params.isFromLogin) != 'undefined' &&
          <YellowButton
            title='Go Back'
            style={{ margin: 20 }}
            navigate={() => {
              this.props.navigation.goBack()
            }}
          />}
      </View>
    );

  }
}

export default connect(mapStateToProps)(ChangePinVerificationPage);


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  text: {
    color: colors.APP_GREEN,
    fontSize: widthToDp('5%'),
    fontFamily: fonts.medium,
    textAlign: 'center'
  },
  InputContainer: {
    width: widthToDp('70%'),
    marginTop: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.APP_GREEN,
    borderRadius: 3,
    overflow: 'hidden'
  },
  textInput: {
    height: 42,
    color: colors.TEXT_INPUT,
    backgroundColor: colors.WHITE,
    paddingLeft: 10,
    fontFamily: fonts.medium
  },
  pinEntryContainer: {
    alignItems: 'center',
    margin: 1,
    marginVertical: 20
  }

});


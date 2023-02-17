import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard } from 'react-native';
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
import OTPTimer from '../../../components/auth/otpTimer';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import UnderlineText from '../../../components/underlineText';
import TimerImageComponent from '../../../components/timerImage/timerImageComponent';


const mapStateToProps = (state) => ({

  loading: state.EditMobileReducer.loading,
  request: state.EditMobileReducer.request,
  response: state.EditMobileReducer.response,

  isEmailVerifiedLoading: state.VerifyEmailAndMobileReducer.loading,
  isEmailVerifiedRequest: state.VerifyEmailAndMobileReducer.request,
  isEmailVerifiedResponse: state.VerifyEmailAndMobileReducer.response,

})

class VerifyMobilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: ''
    };
  }

  componentDidUpdate() {

    if (this.state.otp.length > 5) {
      Keyboard.dismiss()
    }
    const verifyMobile = this.props.response
    const response = this.props.isEmailVerifiedResponse

    if (typeof (verifyMobile) != 'undefined') {
      if (Object.keys(verifyMobile).length > 0) {
        this.props.dispatch(ProfileActionCreator.resetVerifyMobile())
        if (typeof (verifyMobile.Status) != 'undefined') {
          if (verifyMobile.Status != null) {
            if (verifyMobile.Status == 'Success') {
              if (typeof (verifyMobile.Step) != 'undefined') {
                if (verifyMobile.Step == '3') {
                  this.props.dispatch(AuthActionCreator.isLoggedIn(true))
                  this.props.dispatch(AuthActionCreator.isFirstTime(false))
                }
              }

            }
          }
        }
      }
    }
    if (typeof (response) != 'undefined') {
      if (Object.keys(response).length > 0) {
        this.props.dispatch(RegistrationActionCreator.resetResponse('11'))
        if (typeof (response.Status) != 'undefined') {
          if (response.Status == 'Success') {
            console.warn('IS STEP 2:  ' + this.props.route.params.isStep2)
            if (this.props.route.params.isStep2) {
              EncryptedStorage.getItem('userId', (userId, err) => {
                if (userId) {
                  this.props.dispatch(ProfileActionCreator.editMobile(userId, this.props.route.params.mobile, '3'))
                }
              })
            } else {
              this.props.navigation.navigate('EditMobile')
            }

          }
        }
      }
    }
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
        {/* <Text style={{fontFamily:fonts.bold,fontSize:16}}>Enter OTP sent to {this.props.route.params.mobile}:</Text> */}
        <Text style={{ fontFamily: fonts.bold, fontSize: 13 }} >{SIGNUP_5.lbl_1}</Text>
        <Text style={{ fontFamily: fonts.bold, fontSize: 13 }} >{SIGNUP_5.lbl_2}</Text>
        <Text style={{ fontFamily: fonts.bold, fontSize: 13 }} >your mobile {this.props.route.params.mobile}</Text>

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
              backgroundColor: colors.WHITE,
            }}
            cellStyleFocused={{
              borderColor: Colors.LightGray,
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
        {/* <View style={styles.InputContainer}>
            <TextInput
            style={styles.textInput}
            placeholder="OTP"
            placeholderTextColor={colors.TEXT_INPUT_PLACEHOLDER}
            underlineColorAndroid="transparent"
            value={this.state.otp}
            onChangeText={(text) => {
                this.setState({ otp: text })
            }}
            autoCapitalize="none"
            maxLength={80}
            onTouchStart={() => {
                                    
            }}
                                
            />
        </View> */}
        <OTPTimer
          onResendOtpTapped={this.onResendOtpTapped} />

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
        <TimerImageComponent/>
        <YellowButton
          disabled={this.state.otp.length < 6}
          title='Next'
          style={{ margin: 20 }}
          navigate={() => {
            // const otp = this.props.route.params.otp
            if (this.state.otp.length > 3) {
              if (this.props.route.params.isStep2) {
                EncryptedStorage.getItem('userId', (res, err) => {
                  if (res) {
                    this.props.dispatch(RegistrationActionCreator.verifyEmailAndMobile(res, this.state.otp, 'Mobile'))
                    this.setState({ otp: '' })
                  }
                })
              } else {
                // if(otp == this.state.otp){
                //   this.setState({otp:''},() => {
                //     this.props.navigation.navigate('EditMobile')
                //   })

                // }
                EncryptedStorage.getItem('userId', (res, err) => {
                  if (res) {
                    this.props.dispatch(RegistrationActionCreator.verifyEmailAndMobile(res, this.state.otp, 'Mobile'))
                    this.setState({ otp: '' })
                  }
                })


              }

            }
          }}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps)(VerifyMobilePage);


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
    borderColor: Colors.APP_GREEN,
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
    marginVertical: 30
  }
})

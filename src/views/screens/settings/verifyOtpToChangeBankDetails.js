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
import ActivityIndicatorModal from '../../../components/activityIndicator/activityIndicatorModel';
import OTPTimer from '../../../components/auth/otpTimer';
import UnderlineText from '../../../components/underlineText';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import TimerImageComponent from '../../../components/timerImage/timerImageComponent';


const mapStateToProps = (state) => ({

  isEmailVerifiedLoading: state.VerifyEmailAndMobileReducer.loading,
  isEmailVerifiedRequest: state.VerifyEmailAndMobileReducer.request,
  isEmailVerifiedResponse: state.VerifyEmailAndMobileReducer.response,

  checkMobileLoading: state.SendMobileNumberRegReducer.loading,
  checkMobileRequest: state.SendMobileNumberRegReducer.request,
  checkMobileResponse: state.SendMobileNumberRegReducer.response,

})

class VerifyOtpToChangeBankDetails extends Component {
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

    const response = this.props.isEmailVerifiedResponse

    if (typeof (response) != 'undefined') {
      if (Object.keys(response).length > 0) {
        this.props.dispatch(RegistrationActionCreator.resetResponse('11'))
        if (typeof (response.Status) != 'undefined') {
          if (response.Status == 'Success') {
            this.props.navigation.navigate('Add Update Bank Details', { item: this.props.route.params.item, goBack: this.goBack })
          }
        }
      }
    }
  }

  goBack = () => {
    this.props.navigation.goBack()
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
        <Text style={{ fontFamily: fonts.bold, fontSize: 13 }} >{SIGNUP_5.lbl_3} {this.props.route.params.mobile}</Text>

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
          title='Next'
          disabled={this.state.otp.length < 6}
          style={{ margin: 20 }}
          navigate={() => {
            EncryptedStorage.getItem('userId', (res, err) => {
              if (res) {
                this.props.dispatch(RegistrationActionCreator.verifyEmailAndMobile(res, this.state.otp, 'Mobile'))
                this.setState({ otp: '' })
              }
            })
          }}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps)(VerifyOtpToChangeBankDetails);


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
    marginVertical: 30
  }
})
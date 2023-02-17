import React, { Component } from 'react';
import { View, Text,StyleSheet,Linking } from 'react-native';
import fonts from '../../../assets/fonts';
import { DYNAMIC_LINK, SIGNUP_3 } from '../../../constants';
import { widthToDp } from '../../../utils';
import colors from '../../../utils/colors';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import {connect} from 'react-redux'
import { ProfileActionCreator } from '../../../redux/actionCreators/app/profile';
import { AuthActionCreator } from '../../../redux/actionCreators/auth';
import { RegistrationActionCreator } from '../../../redux/actionCreators/registration';
import OTPTimer from '../../../components/auth/otpTimer';


const mapStateToProps =(state) => ({
    
    loading:state.EditEmailReducer.loading,
    request:state.EditEmailReducer.request,
    response:state.EditEmailReducer.response,

    isEmailVerifiedLoading:state.VerifyEmailAndMobileReducer.loading,
    isEmailVerifiedRequest:state.VerifyEmailAndMobileReducer.request,
    isEmailVerifiedResponse:state.VerifyEmailAndMobileReducer.response,

})

class VerifyEmailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
    Linking.addEventListener('url', this._handleOpenURL);
  }

  componentDidUpdate(){
    const verifyEmail = this.props.response
    const response = this.props.isEmailVerifiedResponse

    if(typeof(response) != 'undefined'){
        if(Object.keys(response).length > 0){
            this.props.dispatch(RegistrationActionCreator.resetResponse('11'))
            if(typeof(response.Status) != 'undefined'){
                if(response.Status == 'Success'){
                    if(this.props.route.params.isStep2){
                        EncryptedStorage.getItem('userId',(userId,err) => {
                            if(userId){
                                this.props.dispatch(ProfileActionCreator.editEmail(userId,this.props.route.params.email,DYNAMIC_LINK,'3'))
                            }
                        })
                    }else{
                        this.props.navigation.navigate('EditEmail')
                    }
                    
                }
            }
        }
    }

    if(typeof(verifyEmail) != 'undefined'){
        if(Object.keys(verifyEmail).length > 0){
            this.props.dispatch(ProfileActionCreator.resetVerifyEmail())
            if(typeof(verifyEmail.Status) != 'undefined'){
                if(verifyEmail.Status != null){
                    if(verifyEmail.Status == 'Success'){
                        if(typeof(verifyEmail.Step) != 'undefined'){
                            if(verifyEmail.Step == '3'){
                                this.props.dispatch(AuthActionCreator.isLoggedIn(false))
                                this.props.dispatch(AuthActionCreator.isFirstTime(true))
                            }
                        }
                        
                    }                     
                }
            }
        }
    }
  }

  onNextTapped = (code) => {
      const isStep2 = this.props.route.params.isStep2
      if(isStep2){
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(RegistrationActionCreator.verifyEmailAndMobile(res,code,'Email'))
                // this.props.dispatch(ProfileActionCreator.editEmail(res,this.props.route.params.email,DYNAMIC_LINK,'3'))
            }
        })
      }else{
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(RegistrationActionCreator.verifyEmailAndMobile(res,code,'Email'))
                // this.props.dispatch(ProfileActionCreator.editEmail(res,this.props.route.params.email,DYNAMIC_LINK,'3'))
            }
        })
        

      }
}

  _handleOpenURL = (event) => {
    
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


  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { marginTop: 10 }]} >{SIGNUP_3.lbl_1}</Text>
        <Text style={styles.text} >{SIGNUP_3.lbl_2}</Text>
        <Text style={styles.text} >{SIGNUP_3.lbl_3}</Text>
        <Text style={styles.text} ></Text>
        <Text style={[styles.text,{margin:20}]} >{SIGNUP_3.lbl_4}</Text>
        <Text style={[styles.text,{margin:10}]} >Email: {this.props.route.params.email}</Text>
        <OTPTimer/>
      </View>
    );
  }
}

export default connect(mapStateToProps) (VerifyEmailPage);


const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
        alignItems:'center',
        flex:1
    },
    text: {
        color: colors.BLACK,
        fontSize: 13,
        fontFamily:fonts.medium,
        textAlign:'center'
    }
})

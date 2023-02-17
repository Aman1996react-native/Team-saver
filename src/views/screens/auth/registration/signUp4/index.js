import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, TextInput, ScrollView,
KeyboardAvoidingView,Platform } from 'react-native';
import { SIGNUP_4, NEXT } from '../../../../../constants'
import Colors from '../../../../../utils/colors'
import YellowButton from '../../../../../components/button';
import Icons from '../../../../../assets/icons'
import { heightToDp, widthToDp, getDeviceWidth } from '../../../../../utils';
import ActivityIndicatorComponent from '../../../../../components/activityIndicator';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RegistrationActionCreator } from '../../../../../redux/actionCreators/registration';
import fonts from '../../../../../assets/fonts';
import Config from "react-native-config";
import { CCSActionCreator } from '../../../../../redux/actionCreators/app/ccs';



const mapStateToProps =(state) => ({
    
    loading:state.SendMobileNumberRegReducer.loading,
    request:state.SendMobileNumberRegReducer.request,
    response:state.SendMobileNumberRegReducer.response,

    isPrimaryUserLoading:state.IsPrimaryUserReducer.loading,
    isPrimaryUserRequest:state.IsPrimaryUserReducer.request,
    isPrimaryUserResponse:state.IsPrimaryUserReducer.response,

  })

class SignUpStep4 extends Component {

    constructor(props){
        super(props)
        this.state={
            mobileNumber:''
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            EncryptedStorage.getItem('email',(res,err) => {
                if(res){
                    this.props.dispatch(CCSActionCreator.isPrimaryUser())
                }
            })
            
        })
    }

    componentDidUpdate(prevProps){
        const res = this.props.response
        if(typeof(res) != 'undefined'){
            if(Object.keys(res).length > 0){
                if(typeof(res.Status) != 'undefined'){
                    if(res.Status == 'Success'){
                        // if(res.otpCode){
                            if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
                                const isPrimaryUser = this.props.isPrimaryUserResponse
                                
                                if(typeof(isPrimaryUser) != 'undefined'){
                                    if(isPrimaryUser){
                                        this.props.navigation.navigate('SignUp5',{isPrimary:true})
                                    }else{
                                        this.props.navigation.navigate('SignUp5',{isPrimary:false})
                                    }
                                }
                            }else{
                                this.props.navigation.navigate('SignUp5',{otp:res.otpCode,isPrimary:false})
                            }
                            
                        // }
                    }
                    // console.log(JSON.stringify(res))
                    // this.props.navigation.navigate('SignUp5',{otp:res.otpCode})

                }
                this.props.dispatch(RegistrationActionCreator.resetResponse('3'))
            }
        }
    }


    onNextButtonTapped = () => {
        let number = this.state.mobileNumber
        if(number.length > 9){
            if(number.charAt(0) == '0'){
                number = number.slice(0,0) + number.slice(1)
                number = '61' + number
            }else if(number.charAt(0) == '6'){

            }else{

            }
        }

        

        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(RegistrationActionCreator.sendMobileNumber(res,number))
                // this.props.navigation.navigate('SignUp5',{otp:'11'})
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
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' && 'padding'} style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ width: getDeviceWidth() }} >
                    <View style={styles.textContainer} >
                        <Image source={Icons['EMAIL']} resizeMode='contain' style={styles.image} />
                        <Text style={[styles.textGreen, { marginTop: 10 }]}  >{SIGNUP_4.lbl_1}</Text>
                        <Text style={styles.textGreen} >{SIGNUP_4.lbl_2}</Text>
                        <Text style={styles.textBlack} >{SIGNUP_4.lbl_3}</Text>
                        <View style={styles.InputContainer}>
                            <TextInput
                            style={styles.textInput}
                            placeholder="Mobile"
                            value={this.state.mobileNumber.replace('.','')}
                            onChangeText={(text) => {
                                this.setState({mobileNumber:text.replace('.','')})
                            }}
                            maxLength={11}
                            keyboardType='numeric'
                            placeholderTextColor={Colors.TEXT_INPUT_PLACEHOLDER}
                            underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.btnContainer} >
                    <YellowButton title={NEXT} 
                    disabled={this.state.mobileNumber.length < 10}
                    navigate={() => {this.onNextButtonTapped()}} />
                </View>
            </KeyboardAvoidingView>
        )
    }
    
}

export default connect(mapStateToProps)(SignUpStep4);

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
        alignContent: "center",
        height:heightToDp('70%')
    },
    InputContainer: {
        width: widthToDp('70%'),
        marginTop: 30,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: Colors.APP_GREEN,
        borderRadius: 3,
        overflow: 'hidden'
    },
    textInput: {
        height: 42,
        color: Colors.TEXT_INPUT,
        backgroundColor: Colors.WHITE,
        paddingLeft: 10,
        fontFamily:fonts.medium
    },
    btnContainer:
    {
        width: getDeviceWidth(),
        marginVertical: 40,
        alignItems: "center"
    },
    image:
    {
        width: widthToDp('16%'),
        height: heightToDp('16%'),
        tintColor: Colors.YELLOW
    },
    textGreen:
    {
        color: Colors.APP_GREEN,
        fontSize: widthToDp('9%'),
        fontFamily:fonts.medium
    },
    textBlack:
    {
        color: Colors.BLACK,
        fontSize: 13,
        marginTop: 10,
        textAlign:'center',
        fontFamily:fonts.medium
    }
});
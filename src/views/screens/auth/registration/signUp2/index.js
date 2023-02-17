import React, { Component, useState } from 'react';
import {
    StyleSheet, View, Image, Text, TextInput, ScrollView,TouchableOpacity,
    KeyboardAvoidingView, Platform, Keyboard, SafeAreaView, Pressable
} from 'react-native';
import { SIGNUP_2, NEXT, DYNAMIC_LINK } from '../../../../../constants'
import Colors from '../../../../../utils/colors'
import YellowButton from '../../../../../components/button';
import Icons from '../../../../../assets/icons'
import { heightToDp, widthToDp, getDeviceWidth, isValidEmail, showAlert, isValidPassword } from '../../../../../utils';

import { RegistrationActionCreator } from '../../../../../redux/actionCreators/registration';
import { connect } from 'react-redux';
import ActivityIndicatorComponent from '../../../../../components/activityIndicator';
import { AuthActionCreator } from '../../../../../redux/actionCreators/auth';
import fonts from '../../../../../assets/fonts';
import Config from "react-native-config";
import colors from '../../../../../utils/colors';
import { color } from 'react-native-reanimated';
import CheckBox from '@react-native-community/checkbox';
import CryptoJS from "react-native-crypto-js";
import AppHeader from '../../../../../components/AppHeader';
import { Overlay } from 'react-native-elements';
import WebView from 'react-native-webview';

const keyToEncrytThePassword = 'IRM54JE9Q86DFE!@'

const mapStateToProps = (state) => ({

    loading: state.SendNameAndEmailRegReducer.loading,
    request: state.SendNameAndEmailRegReducer.request,
    response: state.SendNameAndEmailRegReducer.response,

})



class SignUpStep2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            surname: '',
            referralCode: '',
            moveUp: false,
            errorMessage: '',
            mobileNumber: '',
            password: '',
            confirm_password: '',
            secureEye: true,
            confirm_SecureEye: false,
            tnc: false,
            pp: false,
            openOverlay:false,
            header:""
        };

    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );



    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({ moveUp: true })
    }

    _keyboardDidHide = () => {
        this.setState({ moveUp: false });
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

    moveToSignUp3() {
        const { email, name, surname, password } = this.state;

        key = keyToEncrytThePassword
        let iv2 = keyToEncrytThePassword
        let utf8Key = CryptoJS.enc.Utf8.parse(key)
        console.warn('KEY105: ' + utf8Key)
        let utf8Iv = CryptoJS.enc.Utf8.parse(iv2)
        console.warn('IV107: ' + utf8Iv)
        let content = CryptoJS.enc.Utf8.parse(password)


        var encrypted = CryptoJS.AES.encrypt(content, utf8Key, {
            iv: utf8Iv,
            mode: CryptoJS.mode.CBC,

            padding: CryptoJS.pad.Pkcs7
        });

        console.warn('ENCR: ' + encrypted + ' Type: ' + typeof (encrypted.toString()))

        // EncryptedStorage.getItem('userId', (res, err) => {
        //     if (res) {
        //         this.props.dispatch(RegistrationActionCreator.createMPin(res, encrypted.toString(),this.state.isSwitchEnabled,pin))
        //     }
        // })
        console.log("🚀 ~ file: index.js:88 ~ SignUpStep2 ~ moveToSignUp3 ~ email", email)
        console.log("🚀 ~ file: index.js:88 ~ SignUpStep2 ~ moveToSignUp3 ~ password", password)
        const { dispatch } = this.props
        dispatch(RegistrationActionCreator.sendNameAndEmailAddress(name, surname, email, encrypted.toString(), password, DYNAMIC_LINK, this.state.referralCode, this.state.mobileNumber))
        this.props.dispatch(AuthActionCreator.isLoggedIn(false))
        this.props.dispatch(AuthActionCreator.isFirstTime(false))
        // this.props.navigation.navigate('SignUp2')
    }

    componentDidUpdate(prevProps) {

        if (typeof (this.props.response) != 'undefined') {
            if (Object.keys(this.props.response).length > 0) {
                if (typeof (this.props.response.Status) != 'undefined') {
                    if (this.props.response.Status == 'Success') {
                        const { dispatch } = this.props
                        console.log(JSON.stringify(this.props.response))
                        console.log('ho gaya register')
                        if (typeof (this.props.response.userExist) != 'undefined') {
                            const response = this.props.response
                            if (typeof (response.VerificationPending) != 'undefined') {
                                const pending = response.VerificationPending != null ? response.VerificationPending.toLowerCase() : null
                                if (pending == null) {
                                    if (this.props.response.userExist == 'true') {
                                        dispatch(AuthActionCreator.isFirstTime(false))
                                        dispatch(AuthActionCreator.isLoggedIn(false))
                                    }
                                }
                                // else if(pending == 'email'){
                                //     // if(typeof(this.props.response.emailVerificationCode) != 'undefined'){
                                //     //     if(this.props.response.emailVerificationCode != null){
                                //     //         if(this.props.response.emailVerificationCode != ''){
                                //                 this.props.navigation.navigate('SignUp3')
                                //     //         }
                                //     //     }

                                //     // }else{
                                //     //     // this.props.navigation.navigate('SignUp3',{emailVerificationCode:''})
                                //     // }
                                // }
                                else if (pending == 'mobile') {
                                    this.props.dispatch(RegistrationActionCreator.isEmailVerified(response.user_id, 'true'))
                                    this.props.navigation.navigate('SignUp5')
                                } else if (pending == 'mpin') {
                                    this.props.navigation.navigate('SignUp6')
                                } else {
                                    this.props.navigation.navigate('SignUp7')
                                }
                            }


                        }

                        dispatch(RegistrationActionCreator.resetResponse('1'))
                    } else {
                        const { dispatch } = this.props
                        dispatch(RegistrationActionCreator.resetResponse('1'))
                        if (typeof (this.props.response.Description) != 'undefined') {
                            if (this.props.response.Description) {
                                this.setState({ errorMessage: this.props.response.Description })
                            }
                        }
                        // if (typeof (this.props.response.Status) == 'Fail' && (this.props.response.userExist) == 'false')  {
                        //    showAlert('scnscnjkscjkc')
                        // }
                    }
                }
            }
        }
    }

    handleEmail = (text) => {

        this.setState({ email: text })
    }
    handlePassword = (text) => {

        this.setState({ password: text })
    }
    handleName = (text, isSurname) => {
        if (isSurname) {
            this.setState({ surname: text })
        } else {
            this.setState({ name: text })
        }

    }

    // toggleOverlay = () =>{
    //     this.setState({openOverlay :false})
    // }

    renderHtml = (content) => {
        return(
            <WebView
                    source={{ uri: content }}
                    //Enable Javascript support
                    javaScriptEnabled={true}
                    //For the Cache
                    domStorageEnabled={true}
                    //View to show while loading the webpage
                    //Want to show the view or not
                    //startInLoadingState={true}
                    // onLoadStart={() => console.warn('Loaded..')}
                    // onLoad={() => console.warn('Loaded Done..')}
                 style={{ marginTop: 20, alignSelf : 'center', width : '100%', height : 200 }}
                />
        )
    }

    render() {
        const props = this.props
        let isSignup = typeof (this.props.isFromLogin) != 'undefined' ? false : true
        if (typeof (this.props.route) != 'undefined') {
            isSignup = this.props.route.params.isSignUp
        }
        if (props.loading) {
            return (
                <ActivityIndicatorComponent />
            )
        }

   
        const isCCS = Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')

        return (


            <SafeAreaView style={styles.container1}>
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' && 'padding'}
                    style={this.state.moveUp ? isSignup ? [styles.container, { marginTop: -200 }] : [styles.container, { marginTop: -140 }] : styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false} style={{ width: getDeviceWidth() }} >
                        <View style={styles.textContainer} >
                            {/* {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd'))
                                ?
                                <View style={{ flexDirection: 'row', justifyContent: 'center', width: getDeviceWidth() - 40, margin: 20 }}>
                                    <Image source={Icons['CCS_REG1']} resizeMode='contain' style={[styles.image, { marginTop: 50 }]} />
                                    <Image source={Icons['CCS_YELLOWBUBBLE']} resizeMode='contain' style={[styles.image, { marginTop: -20, width: getDeviceWidth() / 3,height:120 }]} />
                                </View>

                                :
                                <Image source={Icons['PUZZLE']} resizeMode='contain' style={styles.image} />
                            } */}

                            {(!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) &&
                                <View>
                                    <Text style={styles.textGreen} >{isSignup && SIGNUP_2.lbl_1}</Text>
                                    <Text style={styles.textGreen} >{isSignup && SIGNUP_2.lbl_2}</Text>
                                    <Text style={styles.textGreen} >{isSignup && SIGNUP_2.lbl_3}</Text>
                                    <Text style={[styles.textGreen, { marginBottom: 10 }]} >{isSignup && SIGNUP_2.lbl_4}</Text>
                                    <Text style={styles.textBlack} >{isSignup && SIGNUP_2.lbl_5}</Text>
                                    <Text style={styles.textBlack} >{isSignup && SIGNUP_2.lbl_6}</Text>
                                    <Text style={[styles.textBlack, { margin: 10, textAlign: 'center' }]} >{(!isSignup || this.props.isFromLogin) && SIGNUP_2.lbl_7}</Text>
                                </View>

                            }
                            {/* {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                                <View>
                                    <Text style={[styles.textGreen, { fontFamily:fonts.medium,color: Colors.BLACK, fontSize: 15,marginBottom:10, marginLeft: 30,marginRight: 30 }]} >{SIGNUP_2.ccs_lbl}</Text>
                                </View>
                            } */}

                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: getDeviceWidth() - 20, marginLeft: 15, marginRight: 15 }}>
                                <Text style={{ marginTop: 15, marginLeft: 35, fontFamily: fonts.bold, fontSize: 22 }}>Registration</Text>
                                <Image style={{ width: 170, height: 157, marginBottom: -15, marginLeft: 5 }}
                                    resizeMode="contain" source={Icons['PIGICON']} />
                                <TouchableOpacity onPress={() => { alert('Kiddo/Leor Team Members should use their work emails') }}>

                                    <Image style={{ width: 18, height: 18, marginBottom: 0, marginRight: 40 }}
                                        resizeMode="contain" source={Icons['QUESTIONICON']} /></TouchableOpacity>
                            </View>


                            <View style={styles.InputMainContainer}>
                                {/* <View style={styles.InputContainer}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="First Name*"
                                        placeholderTextColor={Colors.TEXT_INPUT_PLACEHOLDER}
                                        underlineColorAndroid="transparent"
                                        value={this.state.name}
                                        onChangeText={(text) => { this.handleName(text, false) }}
                                        autoCapitalize='words'
                                        maxLength={15}
                                        onTouchStart={() => {

                                        }}

                                    />
                                </View>
                                <View style={styles.InputContainer}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Last Name*"
                                        placeholderTextColor={Colors.TEXT_INPUT_PLACEHOLDER}
                                        underlineColorAndroid="transparent"
                                        value={this.state.surname}
                                        onChangeText={(text) => { this.handleName(text, true) }}
                                        autoCapitalize='words'
                                        maxLength={15}
                                        onTouchStart={() => {

                                        }}

                                    />
                                </View> */}
                                <View style={styles.InputContainer}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Email address*"
                                        placeholderTextColor={Colors.TEXT_INPUT_PLACEHOLDER}
                                        underlineColorAndroid="transparent"
                                        value={this.state.email}
                                        onChangeText={this.handleEmail}
                                        autoCapitalize="none"
                                        maxLength={80}
                                        keyboardType='email-address'
                                        onTouchStart={() => {

                                        }}

                                    />
                                    {!isValidEmail(this.state.email) && this.state.email != '' &&
                                        <Text style={{ fontFamily: fonts.regular, color: colors.APP_GREEN, fontSize: 12, textAlign: 'center' }}>Invalid email address</Text>}

                                </View>
                                <View style={[styles.InputContainer, { marginTop: 10 }]}>
                                    {/* <TextInput
                                        style={styles.textInput}
                                        placeholder="Mobile*"
                                        value={this.state.mobileNumber.replace('.', '')}
                                        onChangeText={(text) => {
                                            this.setState({ mobileNumber: text.replace('.', '') })
                                        }}
                                        maxLength={11}
                                        keyboardType='numeric'
                                        placeholderTextColor={Colors.TEXT_INPUT_PLACEHOLDER}
                                        underlineColorAndroid="transparent"
                                        returnKeyLabel='Done'
                                        returnKeyType='done'
                                    /> */}
                                    <TextInput
                                        placeholder='Password*'
                                        value={this.state.password}
                                        onChangeText={this.handlePassword}
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
                                <View style={[styles.InputContainer, { marginTop: 0 }]}>
                                    <TextInput
                                        placeholder='Confirm Password*'
                                        value={this.state.confirm_password}
                                        onChangeText={(text) => {
                                            this.setState({ confirm_password: text })
                                        }}
                                        secureTextEntry={this.state.confirm_SecureEye}
                                        placeholderTextColor={colors.GREY}
                                        style={[styles.numStyle, { marginBottom: 10, width: '100%', textAlign: 'left', backgroundColor: colors.WHITE, height: 45, borderRadius: 5, paddingLeft: 20 }]}
                                    />
                                    <Pressable onPress={() => this.setState(prevState => ({ confirm_SecureEye: !prevState.confirm_SecureEye }))}
                                        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, width: 25, height: 25, position: 'absolute', right: 10, top: 15 }]}>
                                        <Image style={{ position: 'absolute', width: 18, height: 18, right: 0, top: 0 }}
                                            resizeMode="contain" source={Icons[this.state.confirm_SecureEye ? 'SECURE_EYE' : 'SECURE_EYE_HIDE']} />
                                    </Pressable>
                                </View>
                                {isCCS &&
                            <Text style={{ fontFamily: fonts.regular, backgroundColor: 'transparent', fontSize: 12, color: Colors.APP_GREEN, textAlign: 'center', margin: 10,marginTop:8,marginBottom:15 }}>Minimum 8 and maximum 20 characters{'\n'}Should contain alphanumeric and special characters</Text>}
                                <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'flex-start', marginTop: 50 }}>
                                    {/* <Pressable style = {{width : 22, height : 22, borderRadius : 22/2, backgroundColor : 'white', borderWidth : 1.5, borderColor : 'red', alignSelf : 'flex-start'}}></Pressable> */}
                                    <CheckBox
                                        disabled={false}
                                        style={{ width: 20, height: 20, marginRight: 10 }}
                                        value={this.state.pp}
                                        onValueChange={(newValue) => {
                                            this.setState(prevState => ({ pp: !prevState.pp }))
                                        }}
                                        boxType={'circle'}
                                        onCheckColor={colors.APP_GREEN}
                                        tintColor={colors.APP_GREEN}
                                        onTintColor={colors.APP_GREEN}
                                    />
                                    <TouchableOpacity onPress={()=>{this.setState({ pp: !this.state.pp,},()=>{
                                          if (this.state.pp){ this.setState({openOverlay : true,header:"pp"}) }
                                    })}}>
                                    <Text style={{ paddingHorizontal: 24, marginTop: 2, fontWeight: '700' }}>I agree to the Privacy Policy</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: '100%', flexDirection: 'row', marginTop: 20 }}>
                                    {/* <Pressable style = {{width : 22, height : 22, borderRadius : 22/2, backgroundColor : 'white', borderWidth : 1.5, borderColor : 'red', alignSelf : 'flex-start'}}></Pressable> */}
                                    <CheckBox
                                        disabled={false}
                                        style={{ width: 20, height: 20, marginRight: 10 }}
                                        value={this.state.tnc}
                                        onValueChange={(newValue) => {
                                            this.setState(prevState => ({ tnc: !prevState.tnc }))
                                        }}
                                        boxType={'circle'}
                                        onCheckColor={colors.APP_GREEN}
                                        tintColor={colors.APP_GREEN}
                                        onTintColor={colors.APP_GREEN}
                                    />
                                    <TouchableOpacity onPress={()=>{this.setState({ tnc: !this.state.tnc,  },()=>{
                                      if (this.state.tnc){  this.setState({openOverlay : true,header:"tnc"}) }
                                    })}}>
                                    <Text style={{ paddingHorizontal: 24, marginTop: 2, fontWeight: '700' }}>I agree to the Terms & Conditions</Text>
                                    </TouchableOpacity>
                                </View>
                                {/* {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd'))
                                    ?
                                    isSignup
                                        ?
                                        <View style={[styles.InputContainer, {padding: 10, alignItems: 'center' ,backgroundColor:colors.DASHBOARD_PAGIING_VIEW}]}>
                                            <Text style={[styles.textBlack, { textAlign: 'center', fontSize: 12, fontFamily:fonts.medium, marginBottom: 5 }]}>If you have been referred by an existing member of Childcare Saver, enter your referral code below.</Text>
                                            <TextInput
                                                style={[styles.textInput, { width: '100%',borderRadius:5 }]}
                                                placeholder="Referral code"
                                                placeholderTextColor={Colors.TEXT_INPUT_PLACEHOLDER}
                                                underlineColorAndroid="transparent"
                                                value={this.state.referralCode}
                                                onChangeText={(text) => {
                                                    this.setState({ referralCode: text })
                                                }}
                                                autoCapitalize="none"
                                                maxLength={10}
                                                onTouchStart={() => {

                                                }}

                                            />
                                        </View>
                                        :
                                        null
                                    :
                                    null
                                } */}

                            </View>


                        </View>
                    </ScrollView>
                    <View style={styles.btnContainer} >
                        <Text style={{ fontFamily: fonts.regular, fontSize: 12, textAlign: 'center', margin: 10, color: Colors.APP_GREEN }}>{this.state.errorMessage}</Text>
                        <YellowButton
                            disabled={
                                //this.state.email.length < 1 || this.state.name.length < 1 || this.state.surname.length < 1 ||
                                !isValidEmail(this.state.email) || !this.state.tnc || !this.state.pp || this.state.password != this.state.confirm_password || this.state.password == '' || !isValidPassword(this.state.password)
                                // || this.state.mobileNumber.length < 10
                            }
                            title={'REGISTER FOR TEAM SAVER'}
                            navigate={() => { this.moveToSignUp3() }} />

                        {!this.props.route.params.isSignUp &&
                            <View style={{ marginTop: 10 }}>
                                <YellowButton title='Back'
                                    navigate={() => {
                                        this.props.navigation.goBack()
                                    }} />
                            </View>

                        }

                        {/* {typeof(this.props.isFromLogin) != 'undefined' &&
                    <View style={{marginTop:10}}>
                      <YellowButton title='Back' 
                        navigate={() => {
                            this.props.dispatch(AuthActionCreator.isFirstTime(false))
                            this.props.dispatch(AuthActionCreator.isLoggedIn(false))
                            }} />  
                    </View>
                    
                    } */}
                    </View>
                    <Overlay isVisible={this.state.openOverlay} onBackdropPress={()=>{this.setState({openOverlay :false})}} overlayStyle={{height:"90%",width:"90%",borderRadius:20,backgroundColor:"transparent",shadowColor:"transparent",shadowOpacity:0,elevation:0}}>
<View style={{height:"100%",width:"100%",backgroundColor:"white",borderRadius:20}}>
<View style={{height:"8%",width:"100%",backgroundColor:Colors.G8Red,borderTopLeftRadius:20,borderTopRightRadius:20,alignItems:"center",justifyContent:'center',flexDirection:"row"}}>
<View style={{width:"20%",height:"100%",}}></View>
        <View style={{width:"60%",alignItems:"center",justifyContent:"center",height:"100%"}}>
            <Text style={{color:"white"}}>{this.state.header == "pp" ? "Privacy Policy" :"Terms & conditions"}</Text>
        </View>
    <TouchableOpacity style={{height:"100%",alignItems:"center",justifyContent:"center",flex:1}} onPress={()=>{this.setState({openOverlay :false})}}>
 <Image style={{height:30,width:30,resizeMode:"contain"}} source={require("../../../../../assets/images/crossIcon.png")}></Image>
 </TouchableOpacity>
</View>
{this.state.header == "pp" ?  this.renderHtml('https://reward360.optus.invia.com.au/home/PrivacyPolicy') :  this.renderHtml('https://reward360.optus.invia.com.au/home/TNC')}
{/* {this.renderHtml('https://reward360.optus.invia.com.au/home/TNC')} */}
</View>
      </Overlay>
                </KeyboardAvoidingView>
            </SafeAreaView>

        )
    }
}


export default connect(mapStateToProps)(SignUpStep2);

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: "center",
        backgroundColor: Colors.BG_LIGHT_BLUE,
        paddingTop: 30
    },
    container: {
        // flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: "center",
        backgroundColor: Colors.BG_LIGHT_BLUE,
        paddingTop: 30
    },

    textContainer: {
        width: getDeviceWidth(),
        alignItems: "center",
        justifyContent: 'center',
        alignContent: "center"
    },
    InputContainer: {
        width: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? widthToDp('80%') : widthToDp('70%'),
        marginTop: 12,
        borderWidth: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 0 : 1,
        borderStyle: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? null : "solid",
        borderColor: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? null : Colors.APP_GREEN,
        borderRadius: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 5 : 3,
        overflow: 'hidden',
        alignSelf: 'center'
    },
    InputContainerCCS: {
        width: widthToDp('80%'),
        marginTop: 10,
        // borderWidth: 1,
        // borderStyle: "solid",
        // borderColor: Colors.APP_GREEN,
        borderRadius: 3,
        overflow: 'hidden',
        alignSelf: 'center'
    },
    textInput: {
        height: 45,
        color: Colors.TEXT_INPUT,
        backgroundColor: Colors.WHITE,
        paddingLeft: 10,
        fontFamily: fonts.regular,
        fontSize: 13
    },
    btnContainer:
    {
        width: getDeviceWidth(),
        marginVertical: 10,
        alignItems: "center"
    },
    image:
    {
        width: getDeviceWidth() / 4,
        height: 80,
    },
    textGreen:
    {
        color: Colors.APP_GREEN,
        fontSize: widthToDp('7%'),
        fontFamily: fonts.medium
    },
    textBlack:
    {
        color: Colors.BLACK,
        fontSize: widthToDp('4.5%'),
        marginTop: 10,
        textAlign: 'center',
        fontFamily: fonts.regular
    },
    InputMainContainer: {
        justifyContent: 'center'
    }
});
import React, { Component } from "react";
import {
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    SectionList,
    Image,
    TextInput,
    Switch,
    Text,
    StyleSheet
} from "react-native";
import ComigSoonPage from "../gift/comingSoonPage";
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { ProfileActionCreator } from "../../../redux/actionCreators/app/profile";
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import ImageComponent from "../../../components/imageComponent/imageComponent";
import colors from "../../../utils/colors";
import { getDeviceWidth } from "../../../utils";
import fonts from "../../../assets/fonts";
import { LoginctionCreator } from "../../../redux/actionCreators/login";
import { AuthActionCreator } from "../../../redux/actionCreators/auth";
import YellowButton from "../../../components/button";
import Config from "react-native-config";
import ConfirmationModal from "../../../components/ccs/confirmationModal";
import { DYNAMIC_LINK } from '../../../constants'
import { TopUpActionCreator } from "../../../redux/actionCreators/app/topup";
import { CCSActionCreator } from "../../../redux/actionCreators/app/ccs";
import { RegistrationActionCreator } from "../../../redux/actionCreators/registration";
import { CheckAccessTokenExpiryTime } from "../../../redux/actionCreators/checkAccessTokenExpiry";
import TouchIdOrFceIdComponent from "../../../components/touchid/touchIdOrFceIdComponent";
import ReactNativeBiometrics from 'react-native-biometrics'
import Modal from 'react-native-modal';
import Icons from '../../../assets/icons';
import AppHeader from "../../../components/AppHeader";




const mapStateToProps = (state) => ({

    loading: state.GetProfileDetailsReducer.loading,
    request: state.GetProfileDetailsReducer.request,
    response: state.GetProfileDetailsReducer.response,

    emailLoading: state.GetEmailAddressReducer.loading,
    emailRequest: state.GetEmailAddressReducer.request,
    emailResponse: state.GetEmailAddressReducer.response,

    changePinLoading: state.ChangePinReducer.loading,
    changePinRequest: state.ChangePinReducer.request,
    changePinResponse: state.ChangePinReducer.response,

    getbankDetailsLoading: state.GetBankDetailsReducer.loading,
    getbankDetailsRequest: state.GetBankDetailsReducer.request,
    getbankDetailsResponse: state.GetBankDetailsReducer.response,

    isPrimaryUserLoading: state.IsPrimaryUserReducer.loading,
    isPrimaryUserRequest: state.IsPrimaryUserReducer.request,
    isPrimaryUserResponse: state.IsPrimaryUserReducer.response,

    checkMobileLoading: state.SendMobileNumberRegReducer.loading,
    checkMobileRequest: state.SendMobileNumberRegReducer.request,
    checkMobileResponse: state.SendMobileNumberRegReducer.response,

    isUserInactiveLoading: state.GetUserStatusReducer.loading,
    isUserInactiveRequest: state.GetUserStatusReducer.request,
    isUserInactiveResponse: state.GetUserStatusReducer.response,

    shouldMoveToSettingsLoading: state.ShouldnavigateToSettingsReducer.loading,
    shouldMoveToSettingsRequest: state.ShouldnavigateToSettingsReducer.request,
    shouldMoveToSettingsResponse: state.ShouldnavigateToSettingsReducer.response,

    shouldMoveToPrivacyPolicyLoading: state.ShouldnavigateToPrivacyPolicyReducer.loading,
    shouldMoveToPrivacyPolicyRequest: state.ShouldnavigateToPrivacyPolicyReducer.request,
    shouldMoveToPrivacyPolicyResponse: state.ShouldnavigateToPrivacyPolicyReducer.response,

    shouldMoveToTermsLoading: state.ShouldnavigateToTermsReducer.loading,
    shouldMoveToTermsRequest: state.ShouldnavigateToTermsReducer.request,
    shouldMoveToTermsResponse: state.ShouldnavigateToTermsReducer.response,

    isTouchIdEnabledLoading: state.IsTouchIdEnabledReducer.loading,
    isTouchIdEnabledRequest: state.IsTouchIdEnabledReducer.request,
    isTouchIdEnabledResponse: state.IsTouchIdEnabledReducer.response,

    loginLoading: state.LoginReducer.loading,
    loginRequest: state.LoginReducer.request,
    loginResponse: state.LoginReducer.response,
})

let displayArray = [
    {
        title: 'My Account', data: [
            { id: 1, title: 'Login Email', value: '', canNavigate: false },
            { id: 10, title: 'Member ID', value: '', canNavigate: false },
            {
                id: 2,
                title: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'App Password' : 'App PIN',
                value: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Change your password' : 'Change your 6 digit PIN',
                canNavigate: true
            },
            { id: 11, title: 'Enable', value: 'TouchId or Face Id', canNavigate: false },

            { id: 3, title: 'Notification Settings', value: 'Turn on In-app notifications', canNavigate: true },
            { id: 4, title: 'Location Settings', value: 'Manage location settings', canNavigate: true },
            { id: 5, title: 'Consent Settings', value: 'Manage ad consent settings', canNavigate: true },
            // { id: 8, title: 'Bank Details', value: 'Manage bank details', canNavigate: true },
            { id: 6, title: 'Privacy Policy', value: '', canNavigate: true },
            { id: 7, title: 'Terms and Conditions', value: '', canNavigate: true },
            { id: 9, title: 'Permanently delete Teamsaver', value: '', canNavigate: true }
        ]
    }
]

var title = 'Are you sure you want to sign out of Teamsaver?'
var buttonText = 'YES, SIGN ME OUT'

class SettingsPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showConfirmationModal: false,
            turnSwitchOn: false,
            biometricType: null,
            isBioMetricsEnabled: false,
            password: '',
            errorMessage: '',
            sos_email:""
        }
    }

    async componentDidMount() {
      
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            const email = await EncryptedStorage.getItem('email')
            const savedPassword = await EncryptedStorage.getItem(email.toString())
            const LoginByData = await EncryptedStorage.getItem('LoginBy')
            this.setState({LoginByuser : LoginByData},()=>{
                console.log("LoginByuser---",this.state.LoginByuser)
            })
            console.warn(savedPassword)
            if (typeof (savedPassword) != 'undefined') {
                if (savedPassword != null) {
                    if (savedPassword.length > 3) {
                        this.setState({ turnSwitchOn: true })
                    }
                }
            }
            console.warn(email)
            await CheckAccessTokenExpiryTime('SettingsPage')
            this.fetchProfileDetails()
            this.props.dispatch(CCSActionCreator.shouldNavigateToSettings(null))
            this.props.dispatch(CCSActionCreator.shouldNavigateToPrivacyPolicy(null))
            this.props.dispatch(CCSActionCreator.shouldNavigateToTerms(null))
            this.props.dispatch(AuthActionCreator.isTouchIdEnabled(null, email))

            // ReactNativeBiometrics.isSensorAvailable()
            //     .then((resultObject) => {
            //         const { available, biometryType } = resultObject

            //         if (available && biometryType === ReactNativeBiometrics.TouchID) {
            //             this.setState({ biometricType: 'TouchID' })
            //         } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
            //             this.setState({ biometricType: 'FaceID' })
            //         } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
            //             this.setState({ biometricType: 'TouchID' })
            //         } else {
            //             this.setState({ biometricType: null })
            //         }
            //     })

        });

    }

    componentDidUpdate(prevProps) {
        const res = this.props.changePinResponse
        const chkMobile = this.props.checkMobileResponse
        if (typeof (res) != undefined) {
            if (Object.keys(res).length > 0) {
                this.props.dispatch(LoginctionCreator.resetResponse('2'))
                if (typeof (res.Status) != 'undefined' && typeof (res.pinMailSent) != 'undefined') {
                    if (res.Status == 'Success' && res.pinMailSent == 'true') {
                        if (typeof (this.props.response) != 'undefined') {
                            if (typeof (this.props.response.Mobile) != 'undefined') {
                                if (this.props.response.Mobile) {
                                    console.warn('MOBILE: ' + this.props.response.Mobile)
                                    this.props.navigation.navigate('Change Pin Verification', { mobile: this.props.response.Mobile })
                                }
                            }
                        }

                    }
                }
            }
        }

        if (typeof (this.props.isPrimaryUserResponse) != 'undefined') {
            if (this.props.isPrimaryUserResponse) {
                if (typeof (chkMobile) != undefined) {
                    if (Object.keys(chkMobile).length > 0) {
                        this.props.dispatch(RegistrationActionCreator.resetResponse('3'))
                        if (typeof (chkMobile.Status) != 'undefined') {
                            if (chkMobile.Status == 'Success') {
                                const res = this.props.getbankDetailsResponse
                                let item = {
                                    BankName: '',
                                    AccountNumber: '',
                                    BranchCode: ''
                                }
                                if (typeof (res) != 'undefined') {
                                    if (typeof (res.BankName) != 'undefined' && typeof (res.AccountNumber) != 'undefined' && typeof (res.BranchCode) != 'undefined') {
                                        if (res.BankName != null && res.AccountNumber != null && res.BranchCode != null) {
                                            item = {
                                                BankName: res.BankName,
                                                AccountNumber: res.AccountNumber,
                                                BranchCode: res.BranchCode
                                            }
                                        }
                                    }
                                }
                                if (typeof (this.props.response) != 'undefined') {
                                    if (typeof (this.props.response.Mobile) != 'undefined') {
                                        if (this.props.response.Mobile) {
                                            console.warn('MOBILE: ' + this.props.response.Mobile)
                                            this.props.navigation.navigate('VerifyOtp', { item: item, mobile: this.props.response.Mobile })
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        const isTouchIdEnabled = this.props.isTouchIdEnabledResponse

        console.warn(isTouchIdEnabled)

        // if (typeof (isTouchIdEnabled) != 'undefined') {
        //     if (isTouchIdEnabled != null) {
        //         this.setState({ isBioMetricsEnabled: isTouchIdEnabled })
        //         this.props.dispatch(AuthActionCreator.resetIsTouchIdEnabled())
        //     }
        // }


        const settingsRes = this.props.shouldMoveToSettingsResponse
        const privacyPolicyRes = this.props.shouldMoveToPrivacyPolicyResponse
        const termsRes = this.props.shouldMoveToTermsResponse

        if (typeof (settingsRes) != 'undefined') {
            this.props.dispatch(CCSActionCreator.resetResponse('21'))

            if (settingsRes != null) {
                if (settingsRes) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToSettings(false))
                }
            }
        }

        if (typeof (privacyPolicyRes) != 'undefined') {
            this.props.dispatch(CCSActionCreator.resetResponse('22'))

            if (privacyPolicyRes != null) {
                if (privacyPolicyRes) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToPrivacyPolicy(false))
                    this.props.navigation.navigate('Consent Details', { item: { id: 6, title: 'Privacy Policy', value: '', canNavigate: true } })
                }
            }
        }

        if (typeof (termsRes) != 'undefined') {
            this.props.dispatch(CCSActionCreator.resetResponse('23'))

            if (termsRes != null) {
                if (termsRes) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToTerms(false))
                    this.props.navigation.navigate('Consent Details', { item: { id: 7, title: 'Terms and Conditions', value: '', canNavigate: true } })
                }
            }
        }

        if (typeof (this.props.loginResponse) != 'undefined') {
            if (this.props.loginResponse != null) {
                if (Object.keys(this.props.loginResponse).length > 0) {
                    this.props.dispatch(LoginctionCreator.resetResponse('1'))
                    if (typeof (this.props.loginResponse.Status) != 'undefined') {
                        if (this.props.loginResponse.Status == 'Fail') {
                            this.setState({ errorMessage: 'Incorrect Password' })
                        }
                    }
                }

            }
        }
    }

    fetchProfileDetails = () => {
        EncryptedStorage.getItem('userId', (res, err) => {
            if (res) {
                this.props.dispatch(ProfileActionCreator.getProfileDetails(res))
                this.props.dispatch(LoginctionCreator.getEmailAddress())
                this.props.dispatch(TopUpActionCreator.getBankDetails(res))
                if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
                    this.props.dispatch(CCSActionCreator.isPrimaryUser())
                    this.props.dispatch(CCSActionCreator.isUserInactive(null))
                }
            }
        })
    }

    renderProfileImage = () => {
        const res = this.props.response
        if (typeof (res) != 'undefined') {
            if (typeof (res.Image) != 'undefined') {
                if (res.Image != null) {
                    return (
                        <ImageComponent
                            resizeMode={'cover'}
                            style={styles.image}
                            imageUrl={res.Image}
                        />
                    )

                }
            }
        }

        // if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
        //     return (
        //         <Image
        //             source={require('../../../assets/images/coins_cart.png')}
        //             style={{ width: 60, height: 160, marginBottom: -40 , position : 'absolute', zIndex : 1, bottom : 35, right : 150}}
        //             //resizeMode='contain'
        //         />
        //     )
        // }

        // return (
        //     <View style={{alignSelf: 'center', justifyContent: 'center', alignItems: 'center', padding: 5, borderRadius: 40, width: 80, height: 80, borderWidth: 1, borderColor: colors.BLACK, backgroundColor: colors.YELLOW }}>
        //         <Text style={[styles.name, { fontSize: 16, }]}>{this.props.response.nameToDisplay}</Text>
        //     </View>
        // )
    }

    // renderUserStatus = () => {
    //     const status = this.props.isUserInactiveResponse
    //     if (typeof (status) != 'undefined') {
    //         if (status != null) {
    //             if (status) {
    //                 return (
    //                     <Text style={[{ fontSize: 12, color: '#FFCC00', fontStyle: 'italic' }]}>Inactive</Text>
    //                 )
    //             } else {
    //                 return (
    //                     <Text style={[{ fontSize: 12, color: 'green', fontStyle: 'italic' }]}>Active</Text>
    //                 )
    //             }
    //         }
    //     }
    //     return null
    // }

    renderProfileDetails = (response) => {
        if (typeof (response) != 'undefined') {
            if (response != null) {
                return (
                    <View style={[styles.profileDetailsHolder, {marginLeft : 100}]}>
                        {this.renderProfileImage()}
                        <View style={{ marginLeft: 20, justifyContent: 'center' }}>
                            <Text style={[styles.nameText, { marginRight: 10, marginTop : 10 }]}>{response.FirstName} {response.LastName}</Text>
                            <Text style={styles.nameText}>{response.Mobile}</Text>
                            {/* {this.renderUserStatus()} */}
                        </View>
                    </View>
                )
            }
        }
    }

    renderMemberId = () => {
        const response = this.props.response
        if (typeof (response) != 'undefined') {
            if (response != null) {
                if (typeof (response.MemberID) != 'undefined') {
                    if (response.MemberID != null) {
                        return (
                            <View>
                                {/* <Text style={[styles.titleText,{marginTop:8}]}>Member ID:</Text> */}
                                <Text style={[styles.valueText, { marginTop: 2 }]}>{response.MemberID} </Text>
                            </View>
                        )
                    }
                }

            }
        }
    }

    onSwitchTapped = async (isEnabled) => {
        if (isEnabled) {
            title = `Please verify your password to enable ${this.state.biometricType}`
            buttonText = 'Okay, Sign me out'
            this.setState({ enableTouchIdTapped: true,errorMessage:'' })

        } else {
            title = `${this.state.biometricType} will be disabled.`
            buttonText = 'Ok'
            this.setState({ showConfirmationModal: true })
        }
    }

    renderSwitch = () => {
        if (this.state.biometricType != null) {
            return (
                <Switch
                    trackColor={{ true: colors.APP_GREEN }}
                    value={this.state.isBioMetricsEnabled}
                    onValueChange={async (status) => {
                        if (status) {
                            this.onSwitchTapped(true)
                        } else {
                            this.onSwitchTapped(false)

                        }

                    }}

                />
            )
        }
        return null

    }

    _renderow = ({ item, index }) => {
        if ((Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) && item.id == 4) {
            return null
        }
        if (item.id == 11) {
            if (this.state.biometricType != null) {
                return (
                    <View style={styles.row}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={styles.titleText}>{item.title}</Text>
                            <View>
                                <Text style={styles.valueText}>{this.state.biometricType}</Text>
                            </View>
                        </View>
                        {this.renderSwitch()}
                    </View>
                )
            } else {
                return null
            }

        }
        return (
            <TouchableOpacity style={styles.row}
                onPress={() => {
                    if (item.canNavigate) {
                        if (item.id == 2) {
                            EncryptedStorage.getItem('email', (email, err) => {
                                if (email) {
                                    this.props.dispatch(LoginctionCreator.changePin(email))
                                }
                            })

                            return
                        }
                        if (item.id == 9) {
                            this.props.navigation.navigate('PermanentlyDeleteAccount')
                            return
                        }
                        if (item.id == 8) {

                            EncryptedStorage.getItem('userId', (res, err) => {
                                if (res) {
                                    const response = this.props.response
                                    if (typeof (response) != 'undefined') {
                                        if (response != null) {
                                            this.props.dispatch(RegistrationActionCreator.sendMobileNumber(res, response.Mobile))
                                        }
                                    }
                                }
                            })


                            return
                        }
                        this.props.navigation.navigate('Consent Details', { item: item })
                    }
                }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={styles.titleText}>{item.title}</Text>
                    {item.id == 1 ?
                        <View>
                            <Text style={styles.valueText}>{this.props.emailResponse.email}</Text>

                        </View>

                        :

                        <View>
                            {item.id == 10 ?
                                <View>
                                    {this.renderMemberId()}
                                </View>

                                :
                                <View>
                                    {item.value.length > 0 &&
                                        <Text style={styles.valueText}>{item.value}</Text>
                                    }
                                </View>

                            }

                        </View>

                    }
                </View>
                {item.id != 1 && item.id != 2 && item.id != 10 &&
                    <Image style={{ width: 28, height: 28 }} resizeMode='contain' source={require('../../../assets/images/right-arrow.png')} />
                }

            </TouchableOpacity>
        )
    }

    _keyExtractor = (item, index) => item.id.toString()

    onClose = () => {
        this.setState({ showConfirmationModal: false })
    }
    onButtonTapped = async () => {
        this.setState({ showConfirmationModal: false })
        if (title.includes('will be disabled')) {
            this.setState({ isBioMetricsEnabled: false }, async () => {

            })
            const email = await EncryptedStorage.getItem('email')
            await EncryptedStorage.setItem(email.toString(), '')
            this.props.dispatch(AuthActionCreator.isTouchIdEnabled(null, email))
        } else {
            const email = await EncryptedStorage.getItem('email')
            await EncryptedStorage.setItem(email.toString(), '')
            await EncryptedStorage.setItem("Sos_email", '')
            this.props.dispatch(AuthActionCreator.isLoggedIn(false))
            this.props.dispatch(AuthActionCreator.isFirstTime(false))
        }

    }

    render() {
        const isPrimaryUser = this.props.isPrimaryUserResponse
         if (this.state.LoginByuser == "sso"){
            displayArray = [
                {
                    title: 'My Account', data: [
                        { id: 1, title: 'Login Email', value: '', canNavigate: false },
                        { id: 10, title: 'Member ID', value: '', canNavigate: false },
                        // {
                        //     id: 2,
                        //     title: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'App Password' : 'App PIN',
                        //     value: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Change your password' : 'Change your 6 digit PIN',
                        //     canNavigate: true
                        // },
                        { id: 11, title: 'Enable', value: 'TouchId or Face Id', canNavigate: false },
                        { id: 3, title: 'Notification Settings', value: 'Turn on In-app notifications', canNavigate: true },
                        { id: 4, title: 'Location Settings', value: 'Manage location settings', canNavigate: true },
                        { id: 5, title: 'Consent Settings', value: 'Manage ad consent settings', canNavigate: true },
                        // { id: 8, title: 'Bank Details', value: 'Manage bank details', canNavigate: true },
                        { id: 6, title: 'Privacy Policy', value: '', canNavigate: true },
                        { id: 7, title: 'Terms and Conditions', value: '', canNavigate: true },
                        { id: 9, title: 'Permanently delete Teamsaver', value: '', canNavigate: true }
                    ]
                }
            ]
        } else {
        displayArray = [
            {
                title: 'My Account', data: [
                    { id: 1, title: 'Login Email', value: '', canNavigate: false },
                    { id: 10, title: 'Member ID', value: '', canNavigate: false },
                    {
                        id: 2,
                        title: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'App Password' : 'App PIN',
                        value: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Change your password' : 'Change your 6 digit PIN',
                        canNavigate: true
                    },
                    { id: 11, title: 'Enable', value: 'TouchId or Face Id', canNavigate: false },
                    { id: 3, title: 'Notification Settings', value: 'Turn on In-app notifications', canNavigate: true },
                    { id: 4, title: 'Location Settings', value: 'Manage location settings', canNavigate: true },
                    { id: 5, title: 'Consent Settings', value: 'Manage ad consent settings', canNavigate: true },
                    // { id: 8, title: 'Bank Details', value: 'Manage bank details', canNavigate: true },
                    { id: 6, title: 'Privacy Policy', value: '', canNavigate: true },
                    { id: 7, title: 'Terms and Conditions', value: '', canNavigate: true },
                    { id: 9, title: 'Permanently delete Teamsaver', value: '', canNavigate: true }
                ]
            }
        ]
    }

        if (typeof (isPrimaryUser) != 'undefined') {
            if (!isPrimaryUser) {
                displayArray = [
                    {
                        title: 'My Account', data: [
                            { id: 1, title: 'Login Email', value: '', canNavigate: false },
                            { id: 10, title: 'Member ID', value: '', canNavigate: false },
                            {
                                id: 2,
                                title: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'App Password' : 'App PIN',
                                value: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Change your password' : 'Change your 6 digit PIN',
                                canNavigate: true
                            },
                            { id: 11, title: 'Enable', value: 'TouchId or FaceId', canNavigate: false },
                            { id: 3, title: 'Notification Settings', value: 'Turn on In-app notifications', canNavigate: true },
                            { id: 4, title: 'Location Settings', value: 'Manage location settings', canNavigate: true },
                            { id: 5, title: 'Consent Settings', value: 'Manage ad consent settings', canNavigate: true },
                            { id: 6, title: 'Privacy Policy', value: '', canNavigate: true },
                            { id: 7, title: 'Terms and Conditions', value: '', canNavigate: true },
                            { id: 9, title: 'Permanently delete Teamsaver', value: '', canNavigate: true }

                        ]
                    }
                ]
            } else if(this.state.LoginByuser == "sso") {
                displayArray = [
                    {
                        title: 'My Account', data: [
                            { id: 1, title: 'Login Email', value: '', canNavigate: false },
                            { id: 10, title: 'Member ID', value: '', canNavigate: false },
                            // {
                            //     id: 2,
                            //     title: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'App Password' : 'App PIN',
                            //     value: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Change your password' : 'Change your 6 digit PIN',
                            //     canNavigate: true
                            // },
                            { id: 11, title: 'Enable', value: 'TouchId or Face Id', canNavigate: false },
                            { id: 3, title: 'Notification Settings', value: 'Turn on In-app notifications', canNavigate: true },
                            { id: 4, title: 'Location Settings', value: 'Manage location settings', canNavigate: true },
                            { id: 5, title: 'Consent Settings', value: 'Manage ad consent settings', canNavigate: true },
                            // { id: 8, title: 'Bank Details', value: 'Manage bank details', canNavigate: true },
                            { id: 6, title: 'Privacy Policy', value: '', canNavigate: true },
                            { id: 7, title: 'Terms and Conditions', value: '', canNavigate: true },
                            { id: 9, title: 'Permanently delete Teamsaver', value: '', canNavigate: true }
                        ]
                    }
                ]
            }else {
                displayArray = [
                    {
                        title: 'My Account', data: [
                            { id: 1, title: 'Login Email', value: '', canNavigate: false },
                            { id: 10, title: 'Member ID', value: '', canNavigate: false },
                            {
                                id: 2,
                                title: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'App Password' : 'App PIN',
                                value: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Change your password' : 'Change your 6 digit PIN',
                                canNavigate: true
                            },
                            { id: 11, title: 'Enable', value: 'TouchId or Face Id', canNavigate: false },
                            { id: 3, title: 'Notification Settings', value: 'Turn on In-app notifications', canNavigate: true },
                            { id: 4, title: 'Location Settings', value: 'Manage location settings', canNavigate: true },
                            { id: 5, title: 'Consent Settings', value: 'Manage ad consent settings', canNavigate: true },
                            // { id: 8, title: 'Bank Details', value: 'Manage bank details', canNavigate: true },
                            { id: 6, title: 'Privacy Policy', value: '', canNavigate: true },
                            { id: 7, title: 'Terms and Conditions', value: '', canNavigate: true },
                            { id: 9, title: 'Permanently delete Teamsaver', value: '', canNavigate: true }
                        ]
                    }
                ]
            }
        } else {
            displayArray = [
                {
                    title: 'My Account', data: [
                        { id: 1, title: 'Login Email', value: '', canNavigate: false },
                        { id: 10, title: 'Member ID', value: '', canNavigate: false },
                        {
                            id: 2,  
                            title: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'App Password' : 'App PIN',
                            value: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Change your password' : 'Change your 6 digit PIN',
                            canNavigate: true
                        },
                        { id: 11, title: 'Enable', value: 'TouchId or Face Id', canNavigate: false },
                        { id: 3, title: 'Notification Settings', value: 'Turn on In-app notifications', canNavigate: true },
                        { id: 4, title: 'Location Settings', value: 'Manage location settings', canNavigate: true },
                        { id: 5, title: 'Consent Settings', value: 'Manage ad consent settings', canNavigate: true },
                        // { id: 8, title: 'Bank Details', value: 'Manage bank details', canNavigate: true },
                        { id: 6, title: 'Privacy Policy', value: '', canNavigate: true },
                        { id: 7, title: 'Terms and Conditions', value: '', canNavigate: true },
                        { id: 9, title: 'Permanently delete Teamsaver', value: '', canNavigate: true }
                    ]
                }
            ]
        }
        return (
            <>
            <AppHeader />
            
            <SafeAreaView style={styles.container}>
                
                <ActivityIndicatorModal isVisible={this.props.loading || this.props.changePinLoading || this.props.checkMobileLoading || this.props.loginLoading} />
                {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                    <ConfirmationModal
                        isVisible={this.state.showConfirmationModal}
                        title={title}
                        buttonText={buttonText}
                        onClose={this.onClose}
                        onButtonTapped={this.onButtonTapped}
                    />
                }
                <Modal backdropOpacity={0.6}
                    backdropColor={'#000000'} isVisible={this.state.enableTouchIdTapped} style={styles.modal}>
                    <View style={styles.modalTopView}>
                        {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                            <Image
                                resizeMode='contain'
                                style={{
                                    width: 60,
                                    height: 60,
                                    marginBottom: 20
                                }}
                                source={Icons['CCS_REG1']}
                            />}
                        {/* <Text style={[styles.numStyle, { fontFamily: fonts.bold, textAlign: 'center', margin: 10 }]}> Please verify your password to enable {this.state.biometricType}</Text> */}
                        <View style={{ justifyContent: 'center', alignItems: 'center', margin: 10, width: '80%', borderWidth: 1, borderColor: colors.APP_GREEN, borderRadius: 5 }}>
                            <TextInput
                                placeholder='Password*'
                                value={this.state.password}
                                onChangeText={(text) => {
                                    this.setState({ password: text })
                                }}
                                secureTextEntry={true}
                                placeholderTextColor={colors.GREY}
                                autoCapitalize="none"
                                style={[styles.numStyle, { marginTop: 10, marginBottom: 10, width: '100%', textAlign: 'center' }]}
                            />
                        </View>
                        <Text style={{ fontFamily: fonts.regular, fontSize: 12, textAlign: 'center', margin: 10, color: colors.APP_GREEN }}>{this.state.errorMessage}</Text>
                        <YellowButton
                            title='Proceed'
                            style={{ width: '80%', alignSelf: 'center', marginTop: 20, }}
                            disabled={this.state.password.length < 7 || this.state.password == null}
                            navigate={async () => {
                                // this.setState({enableTouchIdTapped:false})
                                const email = await EncryptedStorage.getItem('email')
                                this.props.dispatch(LoginctionCreator.login(this.state.password, email, true))
                            }}
                        />
                        <YellowButton
                            title='Close'
                            style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}
                            navigate={() => {
                                this.setState({ enableTouchIdTapped: false })
                            }}
                        />
                    </View>
                </Modal>
                <SectionList
                    ListHeaderComponent={() => {
                        return (
                            <View style={styles.profileDetailsHolder}>
                                {this.renderProfileDetails(this.props.response)}
                            </View>
                        )

                    }}
                    sections={displayArray}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderow}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.myAccountTextHolder}>
                            <Text style={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? styles.nameTextCCS : styles.nameText}>{title}</Text>
                        </View>
                    )}
                    ItemSeparatorComponent={() => {
                        return (
                            <View style={{ height: 1, backgroundColor: colors.LightGray, width: getDeviceWidth() - 30, marginRight: 15, marginLeft: 15 }}></View>
                        )
                    }}
                />

                <YellowButton
                    title='Sign Out'
                    navigate={() => {
                        const { dispatch } = this.props
                        if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
                            title = 'Are you sure you want to sign out of Teamsaver?'
                            buttonText = 'YES, SIGN ME OUT'
                            this.setState({ showConfirmationModal: true })
                        } else {
                            dispatch(AuthActionCreator.isLoggedIn(false))
                            dispatch(AuthActionCreator.isFirstTime(false))
                            dispatch(AuthActionCreator.resetAll())
                        }

                    }}
                    style={{ alignSelf: 'center', marginBottom: 10, marginTop: 10 }}
                />
            </SafeAreaView>
            </>
        );
    }
}
export default connect(mapStateToProps)(SettingsPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
    },
    profileDetailsHolder: {
        flexDirection: 'row',
        // alignItems: 'flex-end',
        // margin: 10,
        marginTop : 10

    },
    signOutButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.APP_GREEN,
        padding: 10,
        width: getDeviceWidth() - 20,
        margin: 10,
        height: 50
    },
    signOutText: {
        fontFamily: fonts.bold,
        fontSize: 16,
        color: colors.White
    },
    nameText: {
        fontFamily: fonts.bold,
        fontSize: 18,
    },
    nameTextCCS: {
        fontFamily: fonts.bold,
        fontSize: 18,
        color: colors.White
    },
    myAccountTextHolder: {
        width: getDeviceWidth() - 20,
        margin: 10,
        backgroundColor: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? colors.G8Blue : colors.LightGray,
        padding: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        height: 50,
        justifyContent: 'center'
    },
    row: {
        width: getDeviceWidth() - 30,
        margin: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleText: {
        fontFamily: fonts.bold,
        fontSize: 16,
        marginBottom: 5
    },
    valueText: {
        fontFamily: fonts.regular,
        fontSize: 12,
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
    }
});
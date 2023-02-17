import React, { Component } from "react";
import {
    View,
    Text,
    Switch,
    FlatList,
    ScrollView,
    Image,
    StyleSheet,
    Alert
} from "react-native";
import fonts from "../../../assets/fonts";
import { getDeviceHeight, getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";
import { connect } from 'react-redux';
import { RegistrationActionCreator } from "../../../redux/actionCreators/registration";
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { ConsentActionCreator } from "../../../redux/actionCreators/app/consent";
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import Config from "react-native-config";
import { WebView } from 'react-native-webview';
import { CheckAccessTokenExpiryTime } from "../../../redux/actionCreators/checkAccessTokenExpiry";
import DeviceSecurity from "react-native-device-security";
import RNExitApp from "react-native-exit-app";
import UsbDubbingFunction,{usbDubbingCheck} from "../maintainanceAndForceUpdate/usbDubbingCheck";


const displayArray1 = [
    { id: 1, title: 'Wallet Alert Notifications', value: 'Turn on In-app Wallet Notifications' },
    { id: 2, title: 'Reward Alert Notifications', value: 'Turn on In-app Rewards Notifications' },
    { id: 3, title: 'Location Services', value: `Allow mWallet to access the device's precise location` },
    { id: 4, title: 'Consent Settings', value: `Give consent for mWallet to send you personalised content based on your activity in mWallet` },
    { id: 5, title: ' Time based consent', value: `Give consent for mWallet to send you personalised content based on your activity in mWallet during the following times` }
]
const mapStateToProps = (state) => ({

    loading: state.GetTCRegReducer.loading,
    request: state.GetTCRegReducer.request,
    response: state.GetTCRegReducer.response,

    ppLoading: state.GetPrivacyPolicyRegReducer.loading,
    ppRequest: state.GetPrivacyPolicyRegReducer.request,
    ppResponse: state.GetPrivacyPolicyRegReducer.response,

    alertStatusLoading: state.GetAlertStatusReducer.loading,
    alertStatusRequest: state.GetAlertStatusReducer.request,
    alertStatusResponse: state.GetAlertStatusReducer.response,

    saveAlertLoading: state.SaveAlertStatusReducer.loading,
    saveAlertRequest: state.SaveAlertStatusReducer.request,
    saveAlertResponse: state.SaveAlertStatusReducer.response,

    timeBasedLoading: state.RequestTimeBasedConsentReducer.loading,
    timeBasedRequest: state.RequestTimeBasedConsentReducer.request,
    timeBasedResponse: state.RequestTimeBasedConsentReducer.response,

    locationLoading: state.GetLocatonServicesStatusReducer.loading,
    locationRequest: state.GetLocatonServicesStatusReducer.request,
    locationResponse: state.GetLocatonServicesStatusReducer.response,

    timeLoading: state.GetTimeReducer.loading,
    timeRequest: state.GetTimeReducer.request,
    timeResponse: state.GetTimeReducer.response,

    getTimeConsentLoading: state.GetTimeConsentStatusReducer.loading,
    getTimeConsentRequest: state.GetTimeConsentStatusReducer.request,
    getTimeConsentResponse: state.GetTimeConsentStatusReducer.response,

    setTimeConsentLoading: state.SetTimeConsentStatusReducer.loading,
    setTimeConsentRequest: state.SetTimeConsentStatusReducer.request,
    setTimeConsentResponse: state.SetTimeConsentStatusReducer.response,
})

class ConsentDetailsPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            switchOn: false,
            walletAlertSwitch: false,
            rewardAlertSwitch: false,
            notificationCall: false,
            locationServicesSwitch: false,
            locationServicesCall: false,
            timeConsentStatus: false,
            timeConsentStatusCall: false
        }

    }

    async componentDidMount(){
        this.props.navigation.addListener('focus', this._onFocus);
        await CheckAccessTokenExpiryTime('ConsentDetailsPage')
        const id = this.props.route.params.item.id
        if (id == 6) {
            this.props.dispatch(RegistrationActionCreator.getTCAndPP(true))
        }
        if (id == 7) {
            this.props.dispatch(RegistrationActionCreator.getTCAndPP(false))
        }

        if (id == 3) {
            this.getAlertStatus()
        }

        if (id == 4) {
            this.getLocationStatus()
        }

        if (id == 5) {
            this.getTimeConsentStatus()
        }
       
    }


    _onFocus = async () =>{
        UsbDubbingFunction()
        //     let data =  !Config.ENV.includes('ccsDev') ? await DeviceSecurity.isAdbEnabled() : null
        //     if (data){
        //        Alert.alert(
        //            "Confirmation",
        //            "Please disable your device usb dubbing mode.",
        //            [
        //              { text: "OK", onPress: () => RNExitApp.exitApp()
        //            }
        //            ]
        //          );
        //    }      
        }

    componentDidUpdate = (prevProps) => {
        const notificationRes = this.props.alertStatusResponse
        const locationRes = this.props.locationResponse
        const timeConsentStatusRes = this.props.getTimeConsentResponse

        if (this.state.notificationCall) {
            if (typeof (notificationRes) != 'undefined') {
                if (typeof (notificationRes.Status) != 'undefined') {
                    if (notificationRes.Status == 'Success') {
                        this.setState({
                            walletAlertSwitch: notificationRes.Wallet,
                            rewardAlertSwitch: notificationRes.Reward, notificationCall: false
                        })

                    }
                }
            }
        }

        if (this.state.locationServicesCall) {
            if (typeof (locationRes) != 'undefined') {
                if (typeof (locationRes.isLocationEnabled) != 'undefined') {
                    this.setState({
                        locationServicesSwitch: locationRes.isLocationEnabled,
                        locationServicesCall: false
                    })

                }
            }
        }

        if (this.state.timeConsentStatusCall) {
            if (typeof (timeConsentStatusRes) != 'undefined') {
                if (typeof (timeConsentStatusRes.Status) != 'undefined') {
                    if (timeConsentStatusRes.Status == 'Success') {
                        this.setState({
                            timeConsentStatus: timeConsentStatusRes.IsActive,
                            timeConsentStatusCall: false
                        })
                    }
                }
            }
        }
    }

    getTimeConsentStatus = () => {
        this.setState({ timeConsentStatusCall: true })
        EncryptedStorage.getItem('userId', (res, err) => {
            if (res) {
                this.props.dispatch(ConsentActionCreator.getTimeConsentStatus(res))
            }
        })
    }

    getAlertStatus = () => {
        this.setState({ notificationCall: true })
        EncryptedStorage.getItem('userId', (res, err) => {
            if (res) {
                this.props.dispatch(ConsentActionCreator.getAlertStatus(res))
            }
        })
    }

    getLocationStatus = () => {
        this.setState({ locationServicesCall: true })
        EncryptedStorage.getItem('userId', (res, err) => {
            if (res) {
                this.props.dispatch(ConsentActionCreator.getOrSetLocationServices(null))
            }
        })
    }


    saveAlertStatus = (wallet, reward) => {
        EncryptedStorage.getItem('userId', (res, err) => {
            if (res) {
                this.props.dispatch(ConsentActionCreator.saveAlertStatus(res, wallet, reward))
            }
        })
    }

    saveLocationStatus = () => {
        EncryptedStorage.getItem('userId', (res, err) => {
            if (res) {
                this.props.dispatch(ConsentActionCreator.getOrSetLocationServices(this.state.locationServicesSwitch))
            }
        })
    }


    renderNotificationSettings = (item) => {
        if (item.id == 3) {
            return (
                <View>
                    {(!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) &&
                        <View style={styles.row}>
                            <View style={{ width: '70%' }}>
                                <Text style={[styles.titleText]}>{displayArray1[0].title}</Text>
                                <Text style={styles.valueText}>{displayArray1[0].value}</Text>
                            </View>
                            <Switch
                                trackColor={{ true: colors.APP_GREEN }}
                                value={this.state.walletAlertSwitch}
                                onValueChange={(status) => {
                                    this.setState({ walletAlertSwitch: status }, () => {
                                        this.saveAlertStatus(this.state.walletAlertSwitch, this.state.rewardAlertSwitch)
                                    })
                                }}

                            />
                        </View>
                    }

                    {(!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) &&
                        <View style={styles.seperator} />
                    }

                    <View style={styles.row}>
                        <View style={{ width: '70%' }}>
                            <Text style={styles.titleText}>{displayArray1[1].title}</Text>
                            <Text style={styles.valueText}>{displayArray1[1].value}</Text>
                        </View>
                        <Switch
                            trackColor={{ true: colors.APP_GREEN }}
                            value={this.state.rewardAlertSwitch}
                            onValueChange={(status) => {
                                this.setState({ rewardAlertSwitch: status }, () => {
                                    this.saveAlertStatus(this.state.walletAlertSwitch, this.state.rewardAlertSwitch)
                                })
                            }}
                        />
                    </View>
                    <View style={styles.seperator} />
                </View>

            )
        }
    }

    renderLocationSettings = (item) => {
        if (item.id == 4) {
            return (
                <View>
                    <View style={styles.row}>
                        <View style={{ width: '70%' }}>
                            <Text style={styles.titleText}>{displayArray1[2].title}</Text>
                            <Text style={styles.valueText}>{displayArray1[2].value}</Text>
                        </View>
                        <Switch
                            trackColor={{ true: colors.APP_GREEN }}
                            value={this.state.locationServicesSwitch}
                            onValueChange={(status) => {
                                this.setState({ locationServicesSwitch: status }, () => {
                                    this.saveLocationStatus()
                                })
                            }}

                        />
                    </View>
                    <View style={styles.seperator} />
                </View>

            )
        }
    }

    renderTimeBasedSettings = (item) => {

        if (item.id == 5) {
            let val = `Give consent for mWallet to send you personalised content based on your activity in mWallet during the following times`
            if ((Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd'))) {
                val = `Give consent for Team Saver Rewards to send you personalised content based on your activity in CCS Rewards`
            }
            return (
                <View>
                    <View style={styles.row}>
                        <View style={{ width: '70%' }}>
                            <Text style={[styles.titleText, {marginTop : 20}]}>{displayArray1[3].title}</Text>
                            <Text style={[styles.valueText, {lineHeight : 16, marginTop : 10}]}>{val}</Text>
                        </View>
                        <Switch
                            trackColor={{ true: colors.APP_GREEN }}
                            value={this.state.timeConsentStatus}
                            onValueChange={(status) => {
                                this.setState({ timeConsentStatus: status }, () => {
                                    EncryptedStorage.getItem('userId', async (res, err) => {
                                        if (res) {
                                            await CheckAccessTokenExpiryTime('ConsentDetailsPage')
                                            this.props.dispatch(ConsentActionCreator.setTimeConsentStatus(res, this.state.timeConsentStatus))
                                        }
                                    })
                                })
                            }}

                        />
                    </View>
                    {/* <View style={styles.seperator} /> */}

                    {this.props.timeResponse != null && this.state.timeConsentStatus && this.props.timeResponse != 'Hide' &&
                        (!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) &&
                        <View style={styles.row}>
                            <View style={{ width: '70%' }}>
                                <Text style={styles.titleText}>{displayArray1[4].title}</Text>
                                <Text style={styles.valueText}>{displayArray1[4].value}</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 5, }}>
                                <Text style={styles.titleText}>Until</Text>
                                <Text style={[styles.titleText, { color: colors.APP_GREEN, }]} >{this.props.timeResponse}</Text>
                            </View>
                        </View>}
                </View>

            )
        }
    }

    renderHtml = (content) => {
        return (
            <WebView
                source={{ uri: content }}
                //Enable Javascript support
                javaScriptEnabled={true}
                //For the Cache
                domStorageEnabled={true}
            //View to show while loading the webpage
            //Want to show the view or not
            //startInLoadingState={true}
            // onLoadStart={() => this.showSpinner()}
            // onLoad={() => this.hideSpinner()}
            // style={{ marginTop: 20 }}
            />
        )
    }

    renderTCAndPP = (isPP) => {
        const PPprops = this.props.ppResponse
        const TCprops = this.props.response
        if (isPP) {
            // if (typeof (PPprops) != 'undefined') {
            //     if (typeof (PPprops.PP) != 'undefined') {
                    return (
                        <View style={{ margin: 10, flex: 1, }}>
                            {this.renderHtml('https://reward360.optus.invia.com.au/home/PrivacyPolicy')}
                        </View>
                    )
            //     }
            // }
        }
        else {
            if (typeof (TCprops) != 'undefined') {
                if (typeof (TCprops.TNC) != 'undefined') {
                    return (
                        <View style={{ margin: 10, flex: 1, }}>
                            {this.renderHtml('https://reward360.optus.invia.com.au/home/TNC')}
                        </View>
                    )
                }
            }
        }
    }




    render() {
        const navItem = this.props.route.params.item
        const props = this.props
        if (navItem.id == 6) {
            return (
                <View style={{ flex: 1, }}>
                    <ActivityIndicatorModal
                        isVisible={props.loading || props.ppLoading || props.saveAlertLoading ||
                            props.timeBasedLoading || props.alertStatusLoading || props.locationLoading
                            || props.getTimeConsentLoading || props.setTimeConsentLoading} />
                    {this.renderTCAndPP(true)}
                </View>
            )
        }
        if (navItem.id == 7) {
            return (
                <View style={{ flex: 1, }}>
                    <ActivityIndicatorModal
                        isVisible={props.loading || props.ppLoading || props.saveAlertLoading ||
                            props.timeBasedLoading || props.alertStatusLoading || props.locationLoading
                            || props.getTimeConsentLoading || props.setTimeConsentLoading} />
                    {this.renderTCAndPP(false)}
                </View>
            )
        }
        return (
            <View style={[styles.container,{justifyContent:'space-between'}]}>
                <ActivityIndicatorModal
                    isVisible={props.loading || props.ppLoading || props.saveAlertLoading ||
                        props.timeBasedLoading || props.alertStatusLoading || props.locationLoading
                        || props.getTimeConsentLoading || props.setTimeConsentLoading} />
                {this.renderNotificationSettings(navItem)}
                {this.renderLocationSettings(navItem)}
                {this.renderTimeBasedSettings(navItem)}
                <Image
                    resizeMode="contain"
                    style={{
                        width: getDeviceWidth() - 30, height:getDeviceHeight()/2.4 ,marginLeft: 15,
                        marginRight: 15,alignSelf:'flex-end', marginBottom : 20
                    }}
                    source={require('../.././../assets/images/coins_consent.png')}
                />
            </View>
        );
    }
}
export default connect(mapStateToProps)(ConsentDetailsPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontSize: 14,
    },
    valueText: {
        fontFamily: fonts.regular,
        fontSize: 12,
    },
    seperator: {
        height: 1,
        backgroundColor: colors.LightGray,
        width: getDeviceWidth() - 30,
        margin: 15
    }
});
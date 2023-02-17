import React, { Component } from "react";
import { StyleSheet, AppState, StatusBar, View, Linking, Platform, Alert,Settings } from "react-native";
import { connect } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import RegistrationStackConfig from '../navigation/auth/registration'
import LoginStackConfig from '../navigation/auth/login'
import { RootStackConfig, RootStackConfigCCSInactivePrimaryUser, RootStackConfigCCSOfferDynamicLinkPrimaryUser, RootStackConfigCCSSecondary } from '../navigation'
import { AuthActionCreator } from '../redux/actionCreators/auth'
import ActivityIndicatorComponent from "../components/activityIndicator";
import MaintainanceConfig from '../navigation/maintainance'
import { OtherAPIActionCreator } from "../redux/actionCreators/app/otherAPIs";
import NetInfo from "@react-native-community/netinfo";
import NoInternetModal from "../components/noInternet/noInternetModal";
import { TabNavigator, TabNavigatorForCCSSecondaryUser } from "../navigation/tab";
import { ThemeProvider } from "../components/themeProvider";
import Config from "react-native-config";
import { CCSActionCreator } from "../redux/actionCreators/app/ccs";
import { OFFERSCATEGORIESDYNAMICLINK } from "../constants";

import DeviceInfo from 'react-native-device-info';
import ForceUpdateConfig from "../navigation/forceUpdate";


const mapStateToProps = (state) => ({
    loading: state.IsFirstTimeCheckReducer.loading,
    request: state.IsFirstTimeCheckReducer.request,
    response: state.IsFirstTimeCheckReducer.response,

    loginLoading: state.IsLoggedInReducer.loading,
    loginRequest: state.IsLoggedInReducer.request,
    loginResponse: state.IsLoggedInReducer.response,

    maintainanceLoading: state.GetmaintainanceReducer.loading,
    maintainanceRequest: state.GetmaintainanceReducer.request,
    maintainanceResponse: state.GetmaintainanceReducer.response,

    forceUpdateLoading: state.ForceUpdateReducer.loading,
    forceUpdateRequest: state.ForceUpdateReducer.request,
    forceUpdateResponse: state.ForceUpdateReducer.response,

    isPrimaryUserLoading: state.IsPrimaryUserReducer.loading,
    isPrimaryUserRequest: state.IsPrimaryUserReducer.request,
    isPrimaryUserResponse: state.IsPrimaryUserReducer.response,

    isUserInactiveLoading: state.GetUserStatusReducer.loading,
    isUserInactiveRequest: state.GetUserStatusReducer.request,
    isUserInactiveResponse: state.GetUserStatusReducer.response,

    offerWithRetailerNameLoading: state.OfferWithRetailerNameReducer.loading,
    offerWithRetailerNameRequest: state.OfferWithRetailerNameReducer.request,
    offerWithRetailerNameResponse: state.OfferWithRetailerNameReducer.response,

    offerWithCategoryNameLoading: state.OfferWithCategoryNameReducer.loading,
    offerWithCategoryNameRequest: state.OfferWithCategoryNameReducer.request,
    offerWithCategoryNameResponse: state.OfferWithCategoryNameReducer.response,

    shouldMoveToHelpLoading: state.ShouldnavigateToHelpReducer.loading,
    shouldMoveToHelpRequest: state.ShouldnavigateToHelpReducer.request,
    shouldMoveToHelpResponse: state.ShouldnavigateToHelpReducer.response,

})

class AppStart extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
            timeWhenWentBackground: new Date().getTime(),
            timeWhenCameForeground: new Date().getTime(),
            showDashboard: false
        }

        // console.warn('VERSION: ' + DeviceInfo.getVersion())
        console.warn('VERSION: ' + DeviceInfo.getVersion())
        console.log('PROPS: ' + props)

    }

    

    _handleAppStateChange2 = (nextState) => {
        // console.warn('FOCUSED')
        this.props.dispatch(CCSActionCreator.hasAppSwitchedToForegroundAfterSpecifiedTime(true, new Date(), false))
    }

    _handleAppStateChange3 = (nextState) => {
        // console.warn('BLURRED')
        this.props.dispatch(CCSActionCreator.hasAppSwitchedToForegroundAfterSpecifiedTime(false, new Date(), false))
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'background') {
            // this.setState({timeWhenWentBackground:new Date().getTime()})
            // console.warn('Background: '+new Date())

            this.props.dispatch(CCSActionCreator.hasAppSwitchedToForegroundAfterSpecifiedTime(false, new Date(), false))
        }
        if (nextAppState === 'active') {
            // console.warn('Foreground: '+new Date())
            // if((new Date().getTime() - this.state.timeWhenWentBackground)/1000 > 300){
            //     // this.setState({timeWhenWentBackground:'reset'})
            // }
            // console.warn('ACTIVE')
            this.props.dispatch(CCSActionCreator.hasAppSwitchedToForegroundAfterSpecifiedTime(true, new Date(), false))

        }
        if (Platform.OS == 'ios') {
            if (nextAppState === 'inactive') {
                // console.warn('Foreground: '+new Date())
                // if((new Date().getTime() - this.state.timeWhenWentBackground)/1000 > 300){
                //     // this.setState({timeWhenWentBackground:'reset'})
                // }


                this.props.dispatch(CCSActionCreator.hasAppSwitchedToForegroundAfterSpecifiedTime(false, new Date(), false))
            }
        }

    }

    async componentDidMount() {

        // await this.props.dispatch(OtherAPIActionCreator.GetConfigResponse())
        // console.warn('TRIGERRED')
        AppState.addEventListener('change', this._handleAppStateChange);
        if (Platform.OS == 'android') {
            AppState.addEventListener('focus', this._handleAppStateChange2);
            AppState.addEventListener('blur', this._handleAppStateChange3);
        }


        Linking.addEventListener('url', this._handleOpenURL);
        this.props.dispatch(CCSActionCreator.hasAppSwitchedToForegroundAfterSpecifiedTime(false, '', false))

        if (Platform.OS == 'android') {
            Linking.getInitialURL().then((ev) => {
                if (ev) {
                    // console.warn('Enteredddd'+ ev);
                    this._handleOpenURL({ url: ev });
                }
            }).catch(err => {
                console.warn('An error occurred', err);
            });
        }


        this.props.dispatch(CCSActionCreator.offerWithRetailerName(null))
        const { dispatch } = this.props

        dispatch(AuthActionCreator.isFirstTime(null))
        dispatch(AuthActionCreator.isLoggedIn(false))
        dispatch(OtherAPIActionCreator.forceUpdate())
        if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
            dispatch(CCSActionCreator.isPrimaryUser())
            dispatch(CCSActionCreator.isUserInactive())
        }

        NetInfo.addEventListener(state => {
            this.setState({ isVisible: !state.isConnected })
        });
    }

    _handleOpenURL = (event) => {
         console.log('START: '+JSON.stringify(event.url))
        if (typeof (event) != 'undefined') {
            if (typeof (event.url) != 'undefined') {
                if (event.url.includes('gotoprofile') || event.url.includes('gotomanagemember')) {
                    // this.props.navigation.navigate('Profile')
                    if (event.url.includes('gotomanagemember')) {
                        this.props.dispatch(CCSActionCreator.shouldNavigateToProfile(true))
                    }

                } else if (event.url.includes('gotohelp')) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToHelp(true))
                }
                else if (event.url.includes('gotorewards')) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToRewards(true))
                }
                else if (event.url.includes('gotodigitialmastercard')) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToDigitalMasterCard(true))
                }
                else if (event.url.includes('gotohistory')) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToHistory(true))
                }
                else if (event.url.includes('gotosettings')) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToSettings(true))
                }
                else if (event.url.includes('gotoprivacypolicy')) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToPrivacyPolicy(true))
                }
                else if (event.url.includes('gototerms')) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToTerms(true))
                }
                else if (event.url.includes('offer?retailerName')) {
                    if (event.url.includes('retailerName')) {
                        const splittedUrl = event.url.split('=')
                        if (typeof (splittedUrl) != 'undefined') {
                            if (splittedUrl.length > 1) {
                                if (typeof (splittedUrl[1]) != 'undefined') {
                                    this.props.dispatch(CCSActionCreator.offerWithRetailerName(splittedUrl[1]))
                                }
                            }
                        }
                    }

                }
                else if (event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Arts_Photography) || event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Auto_Accessories) ||
                    event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Baby_Childern) || event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Business_Work) ||
                    event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Cosmetics) || event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Entertainment) ||
                    event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Fashion) || event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Fitness_Sports) ||
                    event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Flower_Gift) || event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Food_Wine) ||
                    event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Health_Beauty) || event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Home_Lifestyle) ||
                    event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Pet) || event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Technology) ||
                    event.url.includes(OFFERSCATEGORIESDYNAMICLINK.Travel_Accomodation)
                ) {
                    const splittedUrl = event.url.split('/')
                    if (typeof (splittedUrl) != 'undefined') {
                        if (splittedUrl.length > 1) {
                            if (typeof (splittedUrl[splittedUrl.length - 1]) != 'undefined') {
                                // console.warn(splittedUrl[splittedUrl.length - 1])
                                this.props.dispatch(CCSActionCreator.offerWithCategoryName(splittedUrl[splittedUrl.length - 1]))
                            }
                        }
                    }

                }
                else if (event.url.includes('gotooffers')) {
                    this.props.dispatch(CCSActionCreator.offerWithRetailerName('gotooffers'))
                }
                else if (event.url.includes('gotonotifications')) {
                    // this.props.navigation.navigate('Notification')
                }
                else if (event.url.includes('gotorewards')) {
                    // this.props.navigation.navigate('Notification')
                }
                else if (event.url.includes('gotodashboard')) {
                }
            }
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        if (Platform.OS == 'android') {
            AppState.removeEventListener('focus', this._handleAppStateChange2);
            AppState.removeEventListener('blur', this._handleAppStateChange3);
        }

        Linking.removeEventListener('url', this._handleOpenURL);
    }


    render() {
        const props = this.props
        const offerDynamicLink = this.props.offerWithRetailerNameResponse
        // console.warn('STATTTTTTTTTTTTT: '+props.isUserInactiveResponse)
        // console.log('props are',props)


        if (this.state.isVisible) {
            return (
                <NoInternetModal isVisible={this.state.isVisible} />
            )
        }

        if (props.loading || props.loginLoading) {
            return (
                <View>
                    <StatusBar translucent barStyle='light-content'></StatusBar>
                    <ActivityIndicatorComponent />
                </View>

            )
        }

        if (typeof (props.forceUpdateResponse) != 'undefined') {
            if (typeof (props.forceUpdateResponse.shouldForceUpdate) != 'undefined') {
                if (props.forceUpdateResponse.shouldForceUpdate) {
                    console.log("props.forceUpdateResponse.shouldForceUpdate---",props.forceUpdateResponse.shouldForceUpdate)
                    return (
                        <NavigationContainer>
                            <StatusBar translucent barStyle='light-content'></StatusBar>
                            <ForceUpdateConfig/>
                            <RegistrationStackConfig />
                        </NavigationContainer>
                    )
                }
            }

        }

        if (typeof (props.maintainanceResponse) != 'undefined') {
            if (typeof (props.maintainanceResponse.Status) != 'undefined') {
                if (props.maintainanceResponse.Status) {
                    console.log("props.maintainanceResponse.Status",props.maintainanceResponse.Status)
                    return (
                        <NavigationContainer>
                            <StatusBar translucent barStyle='light-content'></StatusBar>
                            <MaintainanceConfig />
                        </NavigationContainer>
                    )
                }
            }

        }

        if (typeof (props.response) != 'undefined' && props.response) {
            console.log("props.response",props.response)
            return (
                <NavigationContainer>
                    <StatusBar translucent barStyle='light-content'></StatusBar>
                    <RegistrationStackConfig />
                </NavigationContainer>
            )
        }


        // if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
        //     if(typeof(props.isPrimaryUserResponse) != 'undefined'){
        //         if(props.isPrimaryUserResponse != null){
        //             if(!props.isPrimaryUserResponse){
        //                 if(typeof (props.loginResponse) != 'undefined' && props.loginResponse){
        //                     if(this.state.timeWhenWentBackground == 'reset'){
        //                         const RootStack = createStackNavigator();

        //                             return (
        //                                 <NavigationContainer>
        //                                     <StatusBar translucent  barStyle='light-content'></StatusBar>
        //                                     <RootStack.Navigator
        //                                     screenOptions={{
        //                                     headerStyle: styles.header,
        //                                     headerTintColor: Colors.White,
        //                                     headerBackTitle: ' ',
        //                                     headerTitleStyle: {
        //                                         alignSelf:'center',
        //                                         fontSize: 12,
        //                                         // fontFamily:ARIAL_FONT.medium
        //                                     }

        //                                     }} >
        //                                         <RootStack.Screen options={{ headerShown:false}} name="Drawer" component={TabNavigatorForCCSSecondaryUser}></RootStack.Screen>
        //                                     </RootStack.Navigator>
        //                                 </NavigationContainer>
        //                             )
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
            if (typeof (props.isPrimaryUserResponse) != 'undefined') {
                if (props.isPrimaryUserResponse != null) {
                    if (!props.isPrimaryUserResponse) {
                        if (typeof (props.loginResponse) != 'undefined' && props.loginResponse) {
                            return (
                                <NavigationContainer>
                                    <ThemeProvider>
                                        <StatusBar translucent barStyle='light-content'></StatusBar>
                                        <RootStackConfigCCSSecondary />
                                    </ThemeProvider>

                                </NavigationContainer>
                            )
                        }

                    }
                }
            }
        }

        // if(typeof (props.loginResponse) != 'undefined' && props.loginResponse){
        //     if(this.state.timeWhenWentBackground == 'reset'){
        //         const RootStack = createStackNavigator();

        //             return (
        //                 <NavigationContainer>
        //                     <StatusBar translucent  barStyle='light-content'></StatusBar>
        //                     <RootStack.Navigator
        //                     screenOptions={{
        //                     headerStyle: styles.header,
        //                     headerTintColor: Colors.White,
        //                     headerBackTitle: ' ',
        //                     headerTitleStyle: {
        //                         alignSelf:'center',
        //                         fontSize: 12,
        //                         // fontFamily:ARIAL_FONT.medium
        //                     }

        //                     }} >
        //                         <RootStack.Screen options={{ headerShown:false}} name="Drawer" component={TabNavigator}></RootStack.Screen>
        //                     </RootStack.Navigator>
        //                 </NavigationContainer>
        //             )
        //     }
        // }    

        // if (typeof (props.loginResponse) != 'undefined' && props.loginResponse) {
        //     if(typeof(offerDynamicLink) != 'undefined'){
        //         if(offerDynamicLink != null){
        //             return (
        //                 <NavigationContainer>
        //                     <ThemeProvider>
        //                         <StatusBar translucent  barStyle='light-content'></StatusBar>
        //                         <RootStackConfigCCSOfferDynamicLinkPrimaryUser />
        //                     </ThemeProvider>

        //                 </NavigationContainer>
        //             )
        //         }
        //     }

        // }

        if (typeof (props.loginResponse) != 'undefined' && props.loginResponse) {
            if (typeof (props.isUserInactiveResponse) != 'undefined') {
                if (props.isUserInactiveResponse != null) {
                    if (!props.isUserInactiveResponse) {
                        return (
                            <NavigationContainer>
                                <ThemeProvider>
                                    <StatusBar translucent barStyle='light-content'></StatusBar>
                                    <RootStackConfig />
                                </ThemeProvider>

                            </NavigationContainer>
                        )
                    }
                }
            }

        }

        if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
            if (typeof (props.isPrimaryUserResponse) != 'undefined') {
                if (props.isPrimaryUserResponse != null) {
                    if (props.isPrimaryUserResponse) {
                        if (typeof (props.isUserInactiveResponse) != 'undefined') {
                            if (props.isUserInactiveResponse != null) {
                                if (props.isUserInactiveResponse) {
                                    if (typeof (props.loginResponse) != 'undefined' && props.loginResponse) {
                                        return (
                                            <NavigationContainer>
                                                <ThemeProvider>
                                                    <StatusBar translucent barStyle='light-content'></StatusBar>
                                                    <RootStackConfigCCSInactivePrimaryUser />
                                                </ThemeProvider>

                                            </NavigationContainer>
                                        )
                                    }
                                }
                            }
                        }


                    }
                }
            }
        }
        return (
            <NavigationContainer>
                <ThemeProvider>
                    <StatusBar translucent barStyle='light-content'></StatusBar>
                    <LoginStackConfig />
                </ThemeProvider>
            </NavigationContainer>
        );
    }
}
// export default AppStart;
export default connect(mapStateToProps)(AppStart);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        backgroundColor: Colors.APP_GREEN,
    },
});
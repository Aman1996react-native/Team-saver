import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import React, { Component } from "react";
import {
    View,
    Text,
    Linking,
    PermissionsAndroid,
    AppState,
    Platform,
    Alert,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import { connect } from 'react-redux'
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import Dashboard from "../../../components/dashboard/dashboard";
import { RewardsActionCreator } from "../../../redux/actionCreators/app/rewards";
import { AuthActionCreator } from '../../../redux/actionCreators/auth'
import colors from "../../../utils/colors";
import Geolocation from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { OtherAPIActionCreator } from "../../../redux/actionCreators/app/otherAPIs";
import { CommunityActionCreator } from "../../../redux/actionCreators/app/community";
import Config from "react-native-config";
import { ConsentActionCreator } from "../../../redux/actionCreators/app/consent";
import { CCSActionCreator } from "../../../redux/actionCreators/app/ccs";
import { DashboardActionCreator } from "../../../redux/actionCreators/app/dashboard";
import { OffersActionCreator } from "../../../redux/actionCreators/app/offers";
import { CheckAccessTokenExpiryTime } from "../../../redux/actionCreators/checkAccessTokenExpiry";
import { ProfileActionCreator } from "../../../redux/actionCreators/app/profile";
import { NotificationsActionCreator } from "../../../redux/actionCreators/app/notifications";
import NotificationBell from "../../../components/notificationBell/notificationBell";
import RoundImage from "../../../components/roundImage";
import { OFFERSCATEGORIESDYNAMICLINK } from "../../../constants";



const mapStateToProps = (state) => ({

    loading: state.IsFirstTimeCheckReducer.loading,
    request: state.IsFirstTimeCheckReducer.request,
    response: state.IsFirstTimeCheckReducer.response,

    loginLoading: state.IsLoggedInReducer.loading,
    loginRequest: state.IsLoggedInReducer.request,
    loginResponse: state.IsLoggedInReducer.response,

    balanceLoading: state.GetPointsBalanceReducer.loading,
    balanceRequest: state.GetPointsBalanceReducer.request,
    balanceResponse: state.GetPointsBalanceReducer.response,

    fcmTokenLoading: state.UpdateFCMTokenReducer.loading,
    fcmTokenRequest: state.UpdateFCMTokenReducer.request,
    fcmTokenResponse: state.UpdateFCMTokenReducer.response,

    getAllCommunitiesLoading: state.GetAllCommunitiesReducer.loading,
    getAllCommunitiesRequest: state.GetAllCommunitiesReducer.request,
    getAllCommunitiesResponse: state.GetAllCommunitiesReducer.response,

    isPrimaryUserLoading: state.IsPrimaryUserReducer.loading,
    isPrimaryUserRequest: state.IsPrimaryUserReducer.request,
    isPrimaryUserResponse: state.IsPrimaryUserReducer.response,

    getHeroTilesLoading: state.GetHeroTilesReducer.loading,
    getHeroTilesRequest: state.GetHeroTilesReducer.request,
    getHeroTilesResponse: state.GetHeroTilesReducer.response,

    getDailyOffersLoading: state.GetDailyOffersReducer.loading,
    getDailyOffersRequest: state.GetDailyOffersReducer.request,
    getDailyOffersResponse: state.GetDailyOffersReducer.response,

    getPopularOffersLoading: state.GetPopularOffersReducer.loading,
    getPopularOffersRequest: state.GetPopularOffersReducer.request,
    getPopularOffersResponse: state.GetPopularOffersReducer.response,

    offerWithRetailerNameLoading: state.OfferWithRetailerNameReducer.loading,
    offerWithRetailerNameRequest: state.OfferWithRetailerNameReducer.request,
    offerWithRetailerNameResponse: state.OfferWithRetailerNameReducer.response,

    offerWithCategoryNameLoading: state.OfferWithCategoryNameReducer.loading,
    offerWithCategoryNameRequest: state.OfferWithCategoryNameReducer.request,
    offerWithCategoryNameResponse: state.OfferWithCategoryNameReducer.response,

    shouldMoveToHelpLoading: state.ShouldnavigateToHelpReducer.loading,
    shouldMoveToHelpRequest: state.ShouldnavigateToHelpReducer.request,
    shouldMoveToHelpResponse: state.ShouldnavigateToHelpReducer.response,

    shouldMoveToProfileLoading: state.ShouldnavigateToProfileReducer.loading,
    shouldMoveToProfileRequest: state.ShouldnavigateToProfileReducer.request,
    shouldMoveToProfileResponse: state.ShouldnavigateToProfileReducer.response,

    shouldMoveToRewardsLoading: state.ShouldnavigateToRewardsReducer.loading,
    shouldMoveToRewardsRequest: state.ShouldnavigateToRewardsReducer.request,
    shouldMoveToRewardsResponse: state.ShouldnavigateToRewardsReducer.response,

    shouldMoveToSettingsLoading: state.ShouldnavigateToSettingsReducer.loading,
    shouldMoveToSettingsRequest: state.ShouldnavigateToSettingsReducer.request,
    shouldMoveToSettingsResponse: state.ShouldnavigateToSettingsReducer.response,

    shouldMoveToPrivacyPolicyLoading: state.ShouldnavigateToPrivacyPolicyReducer.loading,
    shouldMoveToPrivacyPolicyRequest: state.ShouldnavigateToPrivacyPolicyReducer.request,
    shouldMoveToPrivacyPolicyResponse: state.ShouldnavigateToPrivacyPolicyReducer.response,

    shouldMoveToTermsLoading: state.ShouldnavigateToTermsReducer.loading,
    shouldMoveToTermsRequest: state.ShouldnavigateToTermsReducer.request,
    shouldMoveToTermsResponse: state.ShouldnavigateToTermsReducer.response,

    shouldMoveToMasterCardLoading: state.ShouldnavigateToMasterCardReducer.loading,
    shouldMoveToMasterCardRequest: state.ShouldnavigateToMasterCardReducer.request,
    shouldMoveToMasterCardResponse: state.ShouldnavigateToMasterCardReducer.response,

    shouldMoveToHistoryLoading: state.ShouldnavigateToHistoryReducer.loading,
    shouldMoveToHistoryRequest: state.ShouldnavigateToHistoryReducer.request,
    shouldMoveToHistoryResponse: state.ShouldnavigateToHistoryReducer.response,

    shopClickedLoading: state.ShopClickedReducer.loading,
    shopClickedRequest: state.ShopClickedReducer.request,
    shopClickedResponse: state.ShopClickedReducer.response,


})

var timer = 300

class DashboardPage extends Component {
    constructor(props) {
        super(props)
    }


    componentDidUpdate() {
        const offersDynamicLink = this.props.offerWithRetailerNameResponse
        const offersWithCategoryName = this.props.offerWithCategoryNameResponse
        const shouldNavigateToHelp = this.props.shouldMoveToHelpResponse
        const shouldNavigateToProfile = this.props.shouldMoveToProfileResponse
        const shouldNavigateToRewards = this.props.shouldMoveToRewardsResponse
        const shouldNavigateToMasterCard = this.props.shouldMoveToMasterCardResponse
        const shouldNavigateToSettings = this.props.shouldMoveToSettingsResponse
        const shouldNavigateToPrivacyPolicy = this.props.shouldMoveToPrivacyPolicyResponse
        const shouldNavigateToTerms = this.props.shouldMoveToTermsResponse
        const shouldNavigateToHistory = this.props.shouldMoveToHistoryResponse

        if (typeof (offersDynamicLink) != 'undefined') {
            if (offersDynamicLink != null) {
                this.props.navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Offers',
                            params: { someParam: 'Param1' },
                        },
                    ],
                })
                this.props.navigation.navigate('Offers')
            }
        }

        if (typeof (offersWithCategoryName) != 'undefined') {
            if (offersWithCategoryName != null) {
                this.props.navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Offers',
                            params: { someParam: 'Param1' },
                        },
                    ],
                })
                this.props.navigation.navigate('Offers')
            }
        }

        if (typeof (shouldNavigateToHelp) != 'undefined') {
            if (shouldNavigateToHelp != null) {
                if (shouldNavigateToHelp) {
                    this.props.navigation.navigate('More')
                }

            }
        }

        if (typeof (shouldNavigateToHistory) != 'undefined') {
            if (shouldNavigateToHistory != null) {
                if (shouldNavigateToHistory) {
                    this.props.navigation.navigate('More')
                }

            }
        }

        if (typeof (shouldNavigateToTerms) != 'undefined') {
            if (shouldNavigateToTerms != null) {
                if (shouldNavigateToTerms) {
                    this.props.navigation.navigate('More')
                }

            }
        }

        if (typeof (shouldNavigateToPrivacyPolicy) != 'undefined') {
            if (shouldNavigateToPrivacyPolicy != null) {
                if (shouldNavigateToPrivacyPolicy) {
                    this.props.navigation.navigate('More')
                }

            }
        }

        if (typeof (shouldNavigateToSettings) != 'undefined') {
            if (shouldNavigateToSettings != null) {
                if (shouldNavigateToSettings) {
                    this.props.navigation.navigate('More')
                }

            }
        }

        if (typeof (shouldNavigateToMasterCard) != 'undefined') {
            if (shouldNavigateToMasterCard != null) {
                if (shouldNavigateToMasterCard) {

                    this.props.navigation.navigate('Gifts')
                }

            }
        }

        if (typeof (shouldNavigateToRewards) != 'undefined') {
            if (shouldNavigateToRewards != null) {
                if (shouldNavigateToRewards) {
                    this.props.navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'Gifts',
                                params: { someParam: 'Param1' },
                            },
                        ],
                    })
                    this.props.navigation.navigate('Gifts')
                }

            }
        }

        if (typeof (shouldNavigateToProfile) != 'undefined') {
            if (shouldNavigateToProfile != null) {
                if (shouldNavigateToProfile) {
                    // this.props.dispatch(CCSActionCreator.resetResponse('17'))
                    // this.props.dispatch(CCSActionCreator.shouldNavigateToProfile(false))
                    this.props.navigation.navigate('Profile')
                }

            }
        }


    }



    goToOffers = () => {
        this.props.dispatch(CCSActionCreator.offerWithRetailerName(null))
        this.props.dispatch(CCSActionCreator.offerWithCategoryName(null))
        this.props.dispatch(CCSActionCreator.shouldNavigateToHelp(null))
        this.props.dispatch(CCSActionCreator.shouldNavigateToProfile(null))
        this.props.dispatch(CCSActionCreator.shouldNavigateToRewards(null))
        this.props.dispatch(CCSActionCreator.shouldNavigateToSettings(null))
        this.props.dispatch(CCSActionCreator.shouldNavigateToPrivacyPolicy(null))
        this.props.dispatch(CCSActionCreator.shouldNavigateToTerms(null))
        this.props.dispatch(CCSActionCreator.shouldNavigateToHistory(null))
        this.props.dispatch(CCSActionCreator.shouldNavigateToDigitalMasterCard(null))
    }

    async componentDidMount() {
        // alert('Hi')
        // this._unsubscribe = this.props.navigation.addListener('focus', async () => {
        await CheckAccessTokenExpiryTime('Home')

        this.props.navigation.setOptions({
            title: '',
            headerRight: () => (
                <View style={styles.rightBarButtonHolder}>
                    <TouchableOpacity style={{ marginRight: 12 }} >
                        <NotificationBell
                            navigation={this.props.navigation} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: 12 }} >
                        <RoundImage
                            navigation={this.props.navigation}  />
                    </TouchableOpacity>

                </View>

            )
        })

        this.getPointsBalance()
        if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
            this.props.dispatch(CCSActionCreator.isPrimaryUser())
        }

        this.props.dispatch(DashboardActionCreator.getDailyOffers())
        this.props.dispatch(DashboardActionCreator.getPopularOffers())
        this.props.dispatch(DashboardActionCreator.getHeroTiles(true))
        // });
        Linking.addEventListener('url', this._handleOpenURL);
        // await CheckAccessTokenExpiryTime('Home')
        this._checkPermission()
        this._onAppOpenedNotifications()
        this._getInitialNotifications()

        this._unsubscribe = messaging().onMessage(async remoteMessage => {
            if (Platform.OS == 'android') {
                Alert.alert('Notification', 'You have got a notification and will be navigated to Notifications Screen',
                    [
                        {
                            text: 'OK',
                            onPress: () => this.props.navigation.navigate('Notification')
                        }
                    ],
                    { cancelable: true }
                )
            }

        });

        if (Platform.OS == 'ios') {
            if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
                return
            }
            Geolocation.getCurrentPosition(info => {
                EncryptedStorage.getItem('isLocationEnabled', (res, err) => {

                    if (res == 'true' || res == null) {
                        this.props.dispatch(ConsentActionCreator.getOrSetLocationServices(true))
                    }
                })

            })

        } else {
            this.requestAndroidLocationPermission()
        }

        this.goToOffers()
    }

    requestAndroidLocationPermission = async () => {
        if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
            return
        }
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "mWallt App needs Location Permission",
                    message:
                        "mWallt App needs Location Permission " +
                        "so you can see how far away are you from cafes.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            } else {
                alert("Location permission denied");
            }
        } catch (err) {
        }
    }

    _getInitialNotifications = async () => {
        firebase.messaging().getInitialNotification().then(async (remoteMessage) => {
            if (typeof (remoteMessage) != 'undefined') {
                if (remoteMessage != null) {
                    try {


                        EncryptedStorage.getItem('fromBackground', async (res, err) => {
                            if (res == 'true') {
                                await EncryptedStorage.setItem('fromBackground', JSON.stringify(false))
                            } else {
                                this.props.navigation.navigate('Notification')
                            }
                        })

                    } catch (e) {

                    }

                }
            }
        })
    }

    _onAppOpenedNotifications = async () => {
        firebase.messaging().onNotificationOpenedApp(async (message) => {
            await EncryptedStorage.setItem('fromBackground', JSON.stringify(true))
            this.props.navigation.navigate('Notification')
        })
    }

    _checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled == 1) {

            const register = await firebase.messaging().registerDeviceForRemoteMessages()
            const isRegistered = firebase.messaging().isDeviceRegisteredForRemoteMessages
            const token = await firebase.messaging().getToken()
            EncryptedStorage.getItem('userId', (userId, err) => {
                if (userId) {
                    this.props.dispatch(OtherAPIActionCreator.updateFcmToken(userId, token, Platform.OS == 'ios' ? 1 : 2))
                }

            })
            // console.warn('FCM TKEN: '+token)
            EncryptedStorage.getItem('fcmToken', async (res, err) => {
                if (typeof (token) != 'undefined') {
                    if (token != null) {
                        if (res) {
                            if (token.toString() != res) {
                                await EncryptedStorage.setItem('fcmToken', token.toString())
                                EncryptedStorage.getItem('userId', (userId, err) => {
                                    if (userId) {
                                        this.props.dispatch(OtherAPIActionCreator.updateFcmToken(userId, token, Platform.OS == 'ios' ? 1 : 2))
                                    }

                                })

                            } else {
                                await EncryptedStorage.setItem('fcmToken', token.toString())
                            }
                        } else {
                            await EncryptedStorage.setItem('fcmToken', token.toString())
                        }
                    }
                }

            })


        } else {
            this._getPermission()
        }
    }

    _getPermission = async () => {
        firebase.messaging().requestPermission()
            .then(() => {
                this._checkPermission()
            })
            .catch(error => {
                // User has rejected permissions  
            });
    }

    askPushPermission = async () => {
        let authStatus = await messaging().requestPermission();
        let enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {

        } else {
            authStatus = await messaging().requestPermission();
            enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        }

        console.log('TOKEN 2: ' + firebase.messaging().getToken())
    }

    _handleOpenURL = (event) => {
        console.warn('DASHBOARD: ' + JSON.stringify(event.url))
        if (typeof (event) != 'undefined') {
            if (typeof (event.url) != 'undefined') {

                if (event.url.includes('gotoprofile') || event.url.includes('gotomanagemember')) {
                    this.props.navigation.navigate('Profile')
                    if (event.url.includes('gotomanagemember')) {
                        this.props.dispatch(CCSActionCreator.shouldNavigateToProfile(true))
                    }

                }

                else if (event.url.includes('gotorewards')) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToRewards(true))
                    this.props.navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'Gifts',
                                params: { someParam: 'Param1' },
                            },
                        ],
                    })
                    this.props.navigation.navigate('Gifts')
                }
                else if (event.url.includes('gotodigitialmastercard')) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToDigitalMasterCard(true))
                    this.props.navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'Gifts',
                                params: { someParam: 'Param1' },
                            },
                        ],
                    })
                    this.props.navigation.navigate('Gifts')
                }

                else if (event.url.includes('gotohelp')) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToHelp(true))
                    this.props.navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'More',
                                params: { someParam: 'Param1' },
                            },
                        ],
                    })
                    this.props.navigation.navigate('More')
                }
                else if (event.url.includes('gotohistory')) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToHistory(true))
                    this.props.navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'More',
                                params: { someParam: 'Param1' },
                            },
                        ],
                    })
                    this.props.navigation.navigate('More')
                }
                else if (event.url.includes('gotosettings')) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToSettings(true))
                    this.props.navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'More',
                                params: { someParam: 'Param1' },
                            },
                        ],
                    })
                    this.props.navigation.navigate('More')
                }
                else if (event.url.includes('gotoprivacypolicy')) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToPrivacyPolicy(true))
                    this.props.navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'More',
                                params: { someParam: 'Param1' },
                            },
                        ],
                    })
                    this.props.navigation.navigate('More')
                }
                else if (event.url.includes('gototerms')) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToTerms(true))
                    this.props.navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'More',
                                params: { someParam: 'Param1' },
                            },
                        ],
                    })
                    this.props.navigation.navigate('More')
                }

                else if (event.url.includes('offer?retailerName')) {
                    if (event.url.includes('retailerName')) {
                        const splittedUrl = event.url.split('=')
                        if (typeof (splittedUrl) != 'undefined') {
                            if (splittedUrl.length > 1) {
                                if (typeof (splittedUrl[1]) != 'undefined') {
                                    this.props.dispatch(CCSActionCreator.offerWithRetailerName(splittedUrl[1]))
                                    this.props.navigation.reset({
                                        index: 0,
                                        routes: [
                                            {
                                                name: 'Offers',
                                                params: { someParam: 'Param1' },
                                            },
                                        ],
                                    })
                                    this.props.dispatch(OffersActionCreator.resetGetCategoriesWithOffers2())
                                    this.props.navigation.navigate('Offers')
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
                                console.warn(splittedUrl[splittedUrl.length - 1])
                                this.props.dispatch(CCSActionCreator.offerWithCategoryName(splittedUrl[splittedUrl.length - 1]))
                                this.props.navigation.reset({
                                    index: 0,
                                    routes: [
                                        {
                                            name: 'Offers',
                                            params: { someParam: 'Param1' },
                                        },
                                    ],
                                })
                                this.props.dispatch(OffersActionCreator.resetGetCategoriesWithOffers2())
                                this.props.navigation.navigate('Offers')
                            }
                        }
                    }

                }
                else if (event.url.includes('gotooffers')) {
                    this.props.navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'Offers',
                                params: { someParam: 'Param1' },
                            },
                        ],
                    })
                    this.props.dispatch(CCSActionCreator.offerWithRetailerName('gotooffers'))
                    this.props.navigation.navigate('Offers')
                }
                else if (event.url.includes('gotodashboard')) {
                    this.props.dispatch(AuthActionCreator.isLoggedIn(true))
                    this.props.dispatch(AuthActionCreator.isFirstTime(false))
                } else if (event.url.includes('gotonotifications')) {
                    this.props.navigation.navigate('Notification')
                }
            }
        }
    }

    componentWillUnmount() {
        // this._unsubscribe();
        this._unsubscribe();
        AppState.removeEventListener('change', this._handleAppStateChange);

        // Linking.removeEventListener('url', this._handleOpenURL);
    }

    getPointsBalance = () => {
        EncryptedStorage.getItem('userId', (res, err) => {
            if (res) {
                this.props.dispatch(RewardsActionCreator.getPointsBalance(res))
                this.props.dispatch(ProfileActionCreator.getProfileDetails(res))
                this.props.dispatch(NotificationsActionCreator.getNotifications(res))
                // this.props.dispatch(OffersActionCreator.getCategoriesWithOffers2(res))
                if (!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) {
                    this.props.dispatch(CommunityActionCreator.getAllCommunities(res))
                }

            }
        })
    }

    renderDashBoard = () => {
        const res = this.props.getAllCommunitiesResponse

        let heroTilesArray = []
        let dailyOffersArray = []
        let popularOffersArray = []
        let communitiesArray = []

        const heroTileRes = this.props.getHeroTilesResponse
        console.log("🚀 ~ file: index.js:697 ~ DashboardPage ~ heroTileRes", heroTileRes)
        const dailyOffers = this.props.getDailyOffersResponse
        const popularOffers = this.props.getPopularOffersResponse

        if (typeof (heroTileRes) != 'undefined') {
            if (heroTileRes.length > 0) {
                heroTilesArray = heroTileRes
            }
        }

        if (typeof (dailyOffers) != 'undefined') {
            if (dailyOffers.length > 0) {
                dailyOffersArray = dailyOffers
            }
        }

        if (typeof (popularOffers) != 'undefined') {
            if (popularOffers.length > 0) {
                popularOffersArray = popularOffers
            }
        }

        if (typeof (res) != 'undefined') {
            if (res.length > 0) {
                communitiesArray = res
            }
        }

        let heroTile1 = []
        let heroTile2 = []

        // console.warn(heroTilesArray.length)

        if (typeof (heroTileRes) != 'undefined') {
            if (heroTileRes != null) {
                if (typeof (heroTileRes.ForDashboardTop) != 'undefined') {
                    if (heroTileRes.ForDashboardTop != null) {
                        if (heroTileRes.ForDashboardTop.length > 0) {
                            heroTile1 = heroTileRes.ForDashboardTop
                        }
                    }
                }
                if (typeof (heroTileRes.ForDashboardBottom) != 'undefined') {
                    if (heroTileRes.ForDashboardBottom != null) {
                        if (heroTileRes.ForDashboardBottom.length > 0) {
                            heroTile2 = heroTileRes.ForDashboardBottom
                        }
                    }
                }
            }

            // if(heroTilesArray.length > 0){
            //     // alert('Hello'+heroTilesArray[0])
            //     if(typeof(heroTilesArray[0]) != 'undefined'){
            //         heroTile1.push(heroTilesArray[0])
            //     }

            // }
            // if(heroTilesArray.length > 1){
            //     if(typeof(heroTilesArray[1]) != 'undefined'){
            //         heroTile2.push(heroTilesArray[1])
            //     }

            // }
        }

        const dashboardArray = [
            {
                title: '',
                data: [{ id: 1 }]
            },
            {
                title: '',
                data: [{ id: 2 }]
            },
            {
                title: '',
                data: [{ id: 10, value: heroTile1 }]
            },
            {
                title: '',
                data: [{ id: 4 }]
            },
            {
                title: '',
                data: [{ id: 5 }]
            },
            {
                title: '',
                data: [{ id: 6 }]
            },
            {
                title: '',
                data: [{ id: 7 }]
            },
            {
                title: '',
                data: [{ id: 11, value: heroTile2 }]
            },
        ]




        if (typeof (this.props.balanceResponse) != 'undefined' && typeof (res) != 'undefined') {
            if (typeof (this.props.balanceResponse.Balance) != 'undefined' && typeof (this.props.balanceResponse.PendingBalance) != 'undefined' &&
                typeof (this.props.balanceResponse.Amount) != 'undefined') {


                return (
                    <Dashboard
                        balance={this.props.balanceResponse.Balance}
                        pending={this.props.balanceResponse.PendingBalance}
                        amount={this.props.balanceResponse.Amount}
                        balanceRes={this.props.balanceResponse}
                        communities={res.length > 0 ? res : []}
                        navigation={this.props.navigation}
                        data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }]}
                        onLogoutTapped={this.onLogoutTapped}
                        isDashboard={true}
                        isPrimaryUser={this.props.isPrimaryUserResponse}
                        dailyOffers={this.props.getDailyOffersResponse}
                        popularOffers={popularOffersArray}
                        heroTile1={heroTile1}
                        heroTile2={heroTile2}
                        dashboardArray={dashboardArray}
                        onTilesTapped={this.onTilesTapped}
                    />
                )

            }
        }

    }

    onTilesTapped = (item) => {
        if (typeof (item.URL) != 'undefined') {
            if (item.URL != null) {
                if (item.URL != '') {
                    console.warn(item.URL)
                    if (item.MerchantID == 0) {
                        if (item.URL.includes('/gotoprofile')) {
                            if (typeof (this.props.isPrimaryUserResponse) != 'undefined') {
                                if (this.props.isPrimaryUserResponse != null) {
                                    if (this.props.isPrimaryUserResponse) {
                                        this.props.dispatch(CCSActionCreator.shouldNavigateToProfile(true))
                                    }
                                }
                            }
                            this.props.navigation.navigate('Profile')
                            return
                        } else if (item.URL.includes('/gotooffers')) {
                            this.props.navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'Offers',
                                        params: { someParam: 'Param1' },
                                    },
                                ],
                            })
                            this.props.navigation.navigate('Offers')
                            return
                        }

                    }

                    console.warn(JSON.stringify(item))

                    const element = {
                        Merchant_Name: item.MerchantName,
                        Merchant_Image: item.Logo,
                        CashbackTerms: typeof (item.CashbackTerms) != 'undefined' ? item.CashbackTerms : null,
                        CashbackTimeframe: typeof (item.CashbackTimeframe) != 'undefined' ? item.CashbackTimeframe : null,
                        SplCashbackTerms: typeof (item.SplCashbackTerms) != 'undefined' ? item.SplCashbackTerms : null,
                        OfferDetails: [
                            {
                                Offer_ID: item.MerchantID,
                                Description: item.Description,
                                Terms: typeof (item.OfferTerms) != 'undefined' ? item.OfferTerms : null,
                                Rate: typeof (item.Commission_Rate) != 'undefined' ? item.Commission_Rate : null,
                                TargetURL: typeof (item.URL) != 'undefined' ? item.URL : null,
                                Name: item.MerchantName,
                                CommissionType: typeof(item.CommissionType) != 'undefined' ? item.CommissionType : null


                            }
                        ]
                    }

                    if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
                        this.props.navigation.navigate('CCSOfferPreview', { selectedMerchant: element, selectedCatIndex: 0 })
                    }


                    EncryptedStorage.getItem('userId', (res, err) => {
                        if (res) {
                            // this.props.dispatch(OffersActionCreator.shopClickApi(res, item.MerchantID, item.MerchantName))
                        }
                    })
                    // this.props.navigation.navigate('ProductSite', {
                    //     targetUrl: item.URL,
                    //     ClientID: null,
                    //     MemberclientTokenId: null
                    // })
                }
            }
        }
    }

    onLogoutTapped = () => {
        const { dispatch } = this.props
        dispatch(AuthActionCreator.isLoggedIn(false))
        dispatch(AuthActionCreator.isFirstTime(true))

    }


    render() {

        return (
            <View style={styles.container}>
                {/* <ActivityIndicatorModal isVisible={this.props.loading || this.props.balanceLoading}/> */}
                {this.renderDashBoard()}
            </View>

        )
        return (
            <View style={styles.container}>
                <Text>DashboardPage</Text>
                <TouchableOpacity style={{ backgroundColor: 'red', width: 120, marginTop: 20, padding: 20 }}
                    onPress={() => {
                        const { dispatch } = this.props
                        dispatch(AuthActionCreator.isLoggedIn(false))
                        dispatch(AuthActionCreator.isFirstTime(true))

                    }}
                >
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
export default connect(mapStateToProps)(DashboardPage);



const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between'
    },
    rightBarButtonHolder: {
        flexDirection: 'row',
        alignItems: 'center',

    },
});
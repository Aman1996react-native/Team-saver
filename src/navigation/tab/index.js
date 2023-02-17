
import React, { useCallback, useEffect } from 'react';
import { Image, View, StyleSheet, TouchableOpacity, Text, Alert, AppState } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardPage from '../../views/screens/dashboard';
import MarketPlace from '../../views/screens/marketPlace';
import Gift from '../../views/screens/gift';
import Offers from '../../views/screens/offers';
import ProductSite from '../../views/screens/offers/productSite';
import RoundImage from '../../components/roundImage'
import Colors from '../../utils/colors'
import OfferPreviewPage from '../../views/screens/offers/offerPreviewPage';
import RewardDetailsPage from '../../views/screens/gift/rewardDetailsPage';
import GiftRedeemCheckoutStart from '../../views/screens/gift/giftRedeemCheckoutStart';
import GiftRedeemCheckoutFinal from '../../views/screens/gift/GiftRedeemCheckoutFinal';
import fonts from '../../assets/fonts';
import Profile from '../../views/screens/profile';
import Topup from '../../views/screens/topup';
import TopUpAddMoney from '../../views/screens/topup/topUpAddMoney';
import TopUpSendMoney from '../../views/screens/topup/topUpSendMoney';
import TopUpRequestMoney from '../../views/screens/topup/topUpRequestMoney';
import PointsTransferPage from '../../views/screens/gift/pointsTransferPage';
import PointsTransferReviewPage from '../../views/screens/gift/pointsTransferReviewPage';
import NotificationBell from '../../components/notificationBell/notificationBell';
import ComigSoonPage from '../../views/screens/gift/comingSoonPage';
import ChallengeContainer from '../../views/screens/dashboard/challengeContainer';
import AddCoinToStashContainer from '../../views/screens/dashboard/addCointToStashContainer';

import Icons from '../../assets/icons'
import colors from '../../utils/colors';
import MorePage from '../../views/screens/more/morePage';
import NotificationsScreen from '../../views/screens/notification';
import Payment from '../../views/screens/payment';
import History from '../../views/screens/history';
import Help from '../../views/screens/help';
import ReceiptsPage from '../../views/screens/receipt';
import SettingsPage from '../../views/screens/settings';
import InvoicePage from '../../views/screens/receipt/invoicePage';
import ReceiptMerchantPage from '../../views/screens/receipt/receiptMerchantPage';
import ConsentDetailsPage from '../../views/screens/settings/consentDetailsPage';
import CreateCommunityPage from '../../views/screens/profile/createCommunityPage';
import CommunityDescriptionPage from '../../views/screens/auth/communityDescriptionPage';
import ChatPage from '../../views/screens/chat';
import ChatMessagePage from '../../views/screens/chat/chatMessagePage';
import Config from "react-native-config";
import CCSFeedback from '../../views/screens/help/ccsFeedback';
import CCSCallPage from '../../views/screens/help/ccsCall';
import AddSecondaryUsersPage from '../../views/screens/profile/addSecondaryUserspage';
import TransferToBankPage from '../../views/screens/gift/ccs/transferToBankPage';
import SuncorpShopCategoryDescPage from '../../views/screens/marketPlace/suncorpShopCategoryDescPage';
import SuncorpShopCatListPage from '../../views/screens/marketPlace/suncorpShopCatListPage';
import ReferAFriendPage from '../../views/screens/profile/referAFriendPage';
import SubmitRewardClaimPage from '../../views/screens/history/submitRewardClaimPage';
import transferToBankConfirmationPage from '../../views/screens/gift/ccs/transferToBankConfirmationPage';
import ChangePinVerificationPage from '../../views/screens/settings/changePinVerificationPage';
import SignUp6 from '../../views/screens/auth/registration/signUp6';
import AddUpdatebankDetailsPage from '../../views/screens/settings/addUpdatebankDetailsPage';
import VerifyEmailPage from '../../views/screens/profile/verifyEmailPage';
import VerifyMobilePage from '../../views/screens/profile/verifyMobilePage';
import EditEmailAddressPage from '../../views/screens/profile/editEmailAddressPage';
import EditMobileNumberPage from '../../views/screens/profile/editMobileNumberPage';
import PermanentlyDeleteAccountConfirmationPage from '../../views/screens/settings/permanentlyDeleteAccountConfirmationPage';
import TransferToMasterCardPage from '../../views/screens/gift/ccs/transferToMasterCardPage';
import VerifyOtpToChangeBankDetails from '../../views/screens/settings/verifyOtpToChangeBankDetails';
import UpdateBankConfirmationPage from '../../views/screens/settings/updateBankConfirmationPage';
import HeaderLeft from '../../components/headerLeft/headerLeft';
import HeaderBackImage from '../../components/headerLeft/headerBackImage';
import CcsOfferPreviewPage from '../../views/screens/offers/ccsOfferPreviewPage';
import AppHeader from '../../components/AppHeader';
import { useFocusEffect } from '@react-navigation/native';
import DeviceSecurity from 'react-native-device-security';
import RNExitApp from 'react-native-exit-app';
import UsbDubbingFunction,{usbDubbingCheck} from '../../views/screens/maintainanceAndForceUpdate/usbDubbingCheck';
import FastImage from 'react-native-fast-image';


const BottonTab = createBottomTabNavigator();



/**
 * Home Navigation
 */

const tabImageArray = ['HOMETAB', 'TOPUPTAB', 'GIFTTAB', 'OFFERTAB', 'PROFILETAB']

const HomeStack = createStackNavigator();
function HomeStackConfig({ navigation }) {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.APP_GREEN,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0
        },
        headerTintColor: Colors.WHITE,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 12,
          // fontFamily:ARIAL_FONT.medium
        },
        headerBackImage: () => (
          <HeaderBackImage />

        )

      }} >
      <HomeStack.Screen options={{
        // headerTitle: props => <DashboardTitle {...props} />,
        title: '',
        headerBackTitle: ' ',
        headerLeft: () => (
          null
        )

      }} name="Home" component={DashboardPage}></HomeStack.Screen>

      <HomeStack.Screen options={{
        title: '',
        headerBackTitle: ' '
      }} name="ProductSite" component={ProductSite}></HomeStack.Screen>

      <HomeStack.Screen options={{
        title: '',
        headerBackTitle: ' '
      }} name="CCSOfferPreview" component={CcsOfferPreviewPage}></HomeStack.Screen>

      <HomeStack.Screen options={{
        // headerTitle: props => <DashboardTitle {...props} />,
        title: '',
        headerBackTitle: ' ',

      }} name="CommunityDesc" component={CommunityDescriptionPage}></HomeStack.Screen>

      <HomeStack.Screen
        options={{
          headerBackTitle: ' ',
          title: ''
        }} name="CreateCommunity" component={CreateCommunityPage}></HomeStack.Screen>

      <HomeStack.Screen options={{
        // headerTitle: props => <DashboardTitle {...props} />,
        title: '',
        headerBackTitle: ' ',

      }} name="Challenge" component={ChallengeContainer}></HomeStack.Screen>

      <HomeStack.Screen options={{
        // headerTitle: props => <DashboardTitle {...props} />,
        title: '',
        headerBackTitle: ' ',

      }} name="AddCoin" component={AddCoinToStashContainer}></HomeStack.Screen>
      <HomeStack.Screen
        options={{
          title: '',
          headerBackTitle: ' ',
        }} name="ReferAFriend" component={ReferAFriendPage}></HomeStack.Screen>

      <HomeStack.Screen options={{
        headerBackTitle: ' ',
        title: ''
      }} name="AddSecondaryUsers" component={AddSecondaryUsersPage}></HomeStack.Screen>

    </HomeStack.Navigator>
  );
}


/**
 * Botton Tab Navigation
 */


const GiftsStack = createStackNavigator();
function GiftStackConfig({ navigation }) {
  return (
    <GiftsStack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: Colors.APP_GREEN,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: Colors.WHITE,
      headerTitleAlign: 'center',
      headerBackTitle: ' ',
      title: '',
      headerTitleStyle: {
        fontSize: 12
        //fontFamily:ARIAL_FONT.medium
      },
      headerBackImage: () => (
        <HeaderBackImage />

      )
    }}>
      <GiftsStack.Screen
        options={{
        
          headerShown: true
        }}
        name="Gifts" component={Gift}></GiftsStack.Screen>

      <GiftsStack.Screen name="RewardDetails" component={RewardDetailsPage}></GiftsStack.Screen>

      <GiftsStack.Screen name="PointsTransfer" component={PointsTransferPage}></GiftsStack.Screen>

      <GiftsStack.Screen name="TransferToBankCCS" component={TransferToBankPage}></GiftsStack.Screen>

      <GiftsStack.Screen options={{
        title: '',
      }} name="Settings" component={SettingsPage}></GiftsStack.Screen>

      <GiftsStack.Screen name="TransferToBankConfirmationCCS" component={transferToBankConfirmationPage}></GiftsStack.Screen>

      <GiftsStack.Screen name="TransferToMasterCard" component={TransferToMasterCardPage}></GiftsStack.Screen>



      <GiftsStack.Screen name="PointsTransferReview" component={PointsTransferReviewPage}></GiftsStack.Screen>

      <GiftsStack.Screen options={{
        title: '',
      }} name="GiftRedeemCheckoutStart" component={GiftRedeemCheckoutStart}></GiftsStack.Screen>

      <GiftsStack.Screen options={{
        title: '',
      }} name="GiftRedeemCheckoutFinal" component={GiftRedeemCheckoutFinal}></GiftsStack.Screen>

      <GiftsStack.Screen options={{
        title: '',
      }} name="ComingSoon" component={ComigSoonPage}></GiftsStack.Screen>

      <GiftsStack.Screen options={{
        title: '',
      }} name="OfferPreview" component={OfferPreviewPage}></GiftsStack.Screen>

      <GiftsStack.Screen options={{
        title: '',
      }} name="ProductSite" component={ProductSite}></GiftsStack.Screen>

    </GiftsStack.Navigator>
  );
}

const OffersStack = createStackNavigator();
function OffersStackConfig({ navigation }) {
  return (
    <OffersStack.Navigator screenOptions={{
      headerStyle: styles.header,
      headerTintColor: Colors.WHITE,
      headerTitleAlign: 'center',
      headerBackTitle: ' ',
      // headerShown : false,
      headerTitleStyle: {
        fontSize: 12
      },
      headerBackImage: () => (
        <HeaderBackImage />

      )
    }}>
      <OffersStack.Screen options={{
        title: '',
        // headerShown : false,
        headerLeft: () => (
          <HeaderLeft />
        ),

      }} name="Offers" component={Offers}></OffersStack.Screen>

      <OffersStack.Screen options={{
        title: '',
      }} name="OfferPreview" component={OfferPreviewPage}></OffersStack.Screen>

      <OffersStack.Screen options={{
        title: '',
      }} name="CCSOfferPreview" component={CcsOfferPreviewPage}></OffersStack.Screen>

      <OffersStack.Screen options={{
        title: '',
      }} name="ProductSite" component={ProductSite}></OffersStack.Screen>




    </OffersStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();
function ProfileStackConfig({ navigation }) {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleAlign: 'center',
        headerTintColor: Colors.WHITE,
        headerTitleStyle: {
          // fontFamily:ARIAL_FONT.medium,
          fontSize: 12
        },
      }}>
      <ProfileStack.Screen options={{
        headerShown: false
      }} name="Profile" component={Profile}></ProfileStack.Screen>

      <ProfileStack.Screen options={{
        headerShown: false
      }} name="VerifyEmail" component={VerifyEmailPage}></ProfileStack.Screen>
      <ProfileStack.Screen options={{
        headerShown: false
      }} name="VerifyMobile" component={VerifyMobilePage}></ProfileStack.Screen>

      <ProfileStack.Screen options={{
        headerShown: false
      }} name="EditEmail" component={EditEmailAddressPage}></ProfileStack.Screen>
      <ProfileStack.Screen options={{
        headerShown: false
      }} name="EditMobile" component={EditMobileNumberPage}></ProfileStack.Screen>

      <ProfileStack.Screen options={{
        headerBackTitle: ' ',
        title: ''
      }} name="ReceiptMerchant" component={ReceiptMerchantPage}></ProfileStack.Screen>
      <ProfileStack.Screen options={{
        headerBackTitle: ' ',
        title: ''
      }} name="AddSecondaryUsers" component={AddSecondaryUsersPage}></ProfileStack.Screen>
      <ProfileStack.Screen
        options={{
          headerBackTitle: ' ',
          title: ''
        }} name="Invoice" component={InvoicePage}></ProfileStack.Screen>
      <ProfileStack.Screen
        options={{
          headerBackTitle: ' ',
          title: ''
        }} name="CreateCommunity" component={CreateCommunityPage}></ProfileStack.Screen>
      <ProfileStack.Screen
        options={{
          title: '',
          headerBackTitle: ' ',
        }} name="CommunityDesc" component={CommunityDescriptionPage}></ProfileStack.Screen>
      <ProfileStack.Screen
        options={{
          title: '',
          headerBackTitle: ' ',
        }} name="ReferAFriend" component={ReferAFriendPage}></ProfileStack.Screen>
    </ProfileStack.Navigator>
  );
}

const TopUpStack = createStackNavigator();
function TopUpConfig({ navigation }) {
  return (
    <TopUpStack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleAlign: 'center',
        headerTintColor: Colors.WHITE,
        headerBackTitle: ' ',
        headerTitleStyle: {
          fontSize: 12
        },
        headerRight: () => (
          <View style={styles.rightBarButtonHolder}>
            <TouchableOpacity style={{ marginRight: 12 }} >
              <RoundImage
                navigation={navigation} />
            </TouchableOpacity>

          </View>

        )
      }} >
      <TopUpStack.Screen options={{
        title: '',
      }} name="TopUp" component={Topup}></TopUpStack.Screen>

      <TopUpStack.Screen options={{
        title: '',
      }} name="TopUpAddMoney" component={TopUpAddMoney}></TopUpStack.Screen>

      <TopUpStack.Screen options={{
        title: 'Send Money',
        headerTitleStyle: { fontFamily: fonts.bold }
      }} name="TopUpSendMoney" component={TopUpSendMoney}></TopUpStack.Screen>

      <TopUpStack.Screen options={{
        title: 'Request Money',
        headerTitleStyle: { fontFamily: fonts.bold }
      }} name="TopUpRequestMoney" component={TopUpRequestMoney}></TopUpStack.Screen>

      <TopUpStack.Screen options={{
        title: '',
        headerTitleStyle: { fontFamily: fonts.bold }
      }} name="ChatMessagePage" component={ChatMessagePage}></TopUpStack.Screen>

    </TopUpStack.Navigator>
  );
}

const MarketPlaceStack = createStackNavigator();
function MarketPlaceStackConfig({ navigation }) {
  return (
    <MarketPlaceStack.Navigator screenOptions={{
      headerStyle: styles.header,
      headerTintColor: Colors.WHITE,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 12
        // fontFamily:ARIAL_FONT.medium
      }
    }}>
      <MarketPlaceStack.Screen options={{
        title: ' ',
        headerBackTitle: ' ',
        headerRight: () => (
          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10 }} onPress={() => { }} >
            <Image style={{ width: 34, height: 34, }} source={require('../../assets/images/bag.png')} />
            <Text style={{ color: Colors.WHITE, fontSize: 8, marginBottom: 5 }}>Bag 0</Text>
          </TouchableOpacity>
        )

      }} name="MarketPlace" component={MarketPlace}></MarketPlaceStack.Screen>

      <MarketPlaceStack.Screen options={{
        title: ' ',
        headerBackTitle: ' ',
        headerRight: () => (
          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginRight: 10 }} onPress={() => { }} >
            <Image style={{ width: 34, height: 34, }} source={require('../../assets/images/bag.png')} />
            <Text style={{ color: Colors.WHITE, fontSize: 8, marginBottom: 5 }}>Bag 0</Text>
          </TouchableOpacity>
        )

      }} name="SuncorpShopCatDesc" component={SuncorpShopCategoryDescPage}></MarketPlaceStack.Screen>


    </MarketPlaceStack.Navigator>
  );
}

const PaymentStack = createStackNavigator();
function PaymentStackConfig({ navigation }) {
  return (
    <PaymentStack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleAlign: 'center',
        headerTintColor: Colors.WHITE,
        headerTitleStyle: {
          // fontFamily:ARIAL_FONT.medium,
          fontSize: 12
        }
      }} >
      <PaymentStack.Screen options={{
        title: '',
      }} name="Payment" component={Payment}></PaymentStack.Screen>
    </PaymentStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();
function SettingsStackConfig({ navigation }) {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleAlign: 'center',
        headerTintColor: Colors.WHITE,
        headerTitleStyle: {
          // fontFamily:ARIAL_FONT.medium,
          fontSize: 12
        }
      }} >
      <SettingsStack.Screen options={{
        title: '',
      }} name="Settings" component={SettingsPage}></SettingsStack.Screen>
      <SettingsStack.Screen options={{
        title: '',
      }} name="Consent Details" component={ConsentDetailsPage}></SettingsStack.Screen>
      {/* <SettingsStack.Screen options={{
        title: '',
      }} name="Change Pin Verification" component={ChangePinVerificationPage}></SettingsStack.Screen> */}
    </SettingsStack.Navigator>
  );
}

const HistoryStack = createStackNavigator();
function HistoryStackConfig({ navigation }) {
  return (
    <HistoryStack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleAlign: 'center',
        headerTintColor: Colors.WHITE,
        headerTitleStyle: {
          // fontFamily:ARIAL_FONT.medium,
          fontSize: 12
        }
      }} >
      <HistoryStack.Screen options={{
        title: '',
      }} name="History" component={History}></HistoryStack.Screen>
      <HistoryStack.Screen options={{
        title: '',
      }} name="SubmitRewardClaim" component={SubmitRewardClaimPage}></HistoryStack.Screen>
    </HistoryStack.Navigator>
  );
}

const HelpStack = createStackNavigator();
function HelpStackConfig({ navigation }) {
  return (
    <HelpStack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleAlign: 'center',
        headerTintColor: Colors.WHITE,
        headerTitleStyle: {
          // fontFamily:ARIAL_FONT.medium,
          fontSize: 12
        }
      }} >
      {/* <HelpStack.Screen options={{
        title: '',
      }} name="Help" component={Help}></HelpStack.Screen> */}
      <HelpStack.Screen options={{
        title: '',
      }} name="Help" component={CCSFeedback}></HelpStack.Screen>
      <HelpStack.Screen options={{
        title: '',
      }} name="Call" component={CCSCallPage}></HelpStack.Screen>
    </HelpStack.Navigator>
  );
}

const ReceiptStack = createStackNavigator();
function ReceiptStackConfig({ navigation }) {
  return (
    <ReceiptStack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleAlign: 'center',
        headerTintColor: Colors.WHITE,
        headerTitleStyle: {
          // fontFamily:ARIAL_FONT.medium,
          fontSize: 12
        }
      }} >
      <ReceiptStack.Screen name="Receipt" component={ReceiptsPage}></ReceiptStack.Screen>
      <ReceiptStack.Screen name="Invoice" component={InvoicePage}></ReceiptStack.Screen>
      <ReceiptStack.Screen
      screenOptions = {{headerShown : false}}
      name="RewardDetails" component={RewardDetailsPage}></ReceiptStack.Screen>
    </ReceiptStack.Navigator>
  );
}

const ChatStack = createStackNavigator();
function ChatStackConfig({ navigation }) {
  return (
    <ChatStack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleAlign: 'center',
        headerTintColor: Colors.WHITE,
        headerTitleStyle: {
          // fontFamily:ARIAL_FONT.medium,
          fontSize: 12
        }
      }} >
      <ChatStack.Screen name="Chat" component={ChatPage}></ChatStack.Screen>
      <ChatStack.Screen name="ChatMessagePage" component={ChatMessagePage}></ChatStack.Screen>
    </ChatStack.Navigator>
  );
}

const MoreStack = createStackNavigator();
function MoreStackConfig({ navigation, }) {
  return (
    <MoreStack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleAlign: 'center',
        headerTintColor: Colors.WHITE,
        title: '',
        headerBackTitle: ' ',
        headerTitleStyle: {
          fontFamily: fonts.bold,
          fontSize: 18
        },
        headerBackImage: () => (
          <HeaderBackImage />

        ),
        headerRight: () => (
          <View style={styles.rightBarButtonHolder}>

            <TouchableOpacity style={{ marginRight: 12 }} >
              <RoundImage
                navigation={navigation} />
            </TouchableOpacity>
          </View>

        )
      }}>
      <MoreStack.Screen  options={{
        headerLeft: () => (
          <HeaderLeft />
        ),
      }} name="More" component={MorePage}></MoreStack.Screen>
      <MoreStack.Screen name="MarketPlace" component={MarketPlace}></MoreStack.Screen>
      <MoreStack.Screen name="Payment" component={PaymentStackConfig}></MoreStack.Screen>
      <MoreStack.Screen name="Help" component={HelpStackConfig}></MoreStack.Screen>
      <ReceiptStack.Screen name="Receipt" component={ReceiptsPage}></ReceiptStack.Screen>
      <ReceiptStack.Screen name="Invoice" component={InvoicePage}></ReceiptStack.Screen>
      <ReceiptStack.Screen name="RewardDetails" component={RewardDetailsPage}></ReceiptStack.Screen>
      <SettingsStack.Screen name="Settings" 
      options={{headerShown : false}} 
      component={SettingsPage}></SettingsStack.Screen>
      <SettingsStack.Screen name="Consent Details" component={ConsentDetailsPage}></SettingsStack.Screen>
      <SettingsStack.Screen name="Change Pin Verification" component={ChangePinVerificationPage}></SettingsStack.Screen>
      <SettingsStack.Screen name="VerifyOtp" component={VerifyOtpToChangeBankDetails}></SettingsStack.Screen>
      <SettingsStack.Screen name="Add Update Bank Details" component={AddUpdatebankDetailsPage}></SettingsStack.Screen>
      <SettingsStack.Screen name="UpdateBankConfirmation" component={UpdateBankConfirmationPage}></SettingsStack.Screen>
      <SettingsStack.Screen name="PermanentlyDeleteAccount" component={PermanentlyDeleteAccountConfirmationPage}></SettingsStack.Screen>
      <SettingsStack.Screen name="Change Pin" component={SignUp6}></SettingsStack.Screen>
      <ChatStack.Screen name="Chat" component={ChatPage}></ChatStack.Screen>
      <ChatStack.Screen name="ChatMessagePage" component={ChatMessagePage}></ChatStack.Screen>
      <MoreStack.Screen options={{
        title: '',
      }} name="History" component={History}></MoreStack.Screen>
      <MoreStack.Screen options={{
        title: '',
      }} name="SubmitRewardClaim" component={SubmitRewardClaimPage}></MoreStack.Screen>
      <MarketPlaceStack.Screen options={{
        title: ' ',
        headerBackTitle: ' ',

      }} name="SuncorpShopCatDesc" component={SuncorpShopCategoryDescPage}></MarketPlaceStack.Screen>

      <MarketPlaceStack.Screen options={{
        title: ' ',
        headerBackTitle: ' ',

      }} name="SuncorpShopCatList" component={SuncorpShopCatListPage}></MarketPlaceStack.Screen>
    </MoreStack.Navigator>
  );
}

const NotificationStack = createStackNavigator();
function NotificationConfig({ navigation }) {
  return (
    <NotificationStack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleAlign: 'center',
        headerTintColor: colors.WHITE,
        headerTitleStyle: {
          fontFamily: fonts.medium,
          fontSize: 14
        },
        headerLeft: () => (
          <HeaderLeft />
        )

      }} >
      <NotificationStack.Screen options={{
        title: 'Notifications',

      }} name="Notification" component={NotificationsScreen}></NotificationStack.Screen>
    </NotificationStack.Navigator>
  );
}



export const TabNavigator = () => {

useEffect(()=>{
  // AppSateFunction()
},[])
  
  

  const CheckDebbuger = async () => {
    UsbDubbingFunction()
    // let data =  !Config.ENV.includes('ccsDev') ? await DeviceSecurity.isAdbEnabled() : null
    // if (data){
    //     Alert.alert(
    //         "Confirmation",
    //         "Please disable your device usb dubbing mode.",
    //         [
    //           { text: "OK", onPress: () => RNExitApp.exitApp()
    //         }
    //         ]
    //       );
    // }
      }
      

  return (
    <BottonTab.Navigator
      initialRouteName="TodayScreen"
      backBehavior='none'
      tabBarOptions={{
        labelStyle: styles.label,
        style: styles.tab,
        activeTintColor: Colors.APP_GREEN,
        inactiveTintColor: 'gray',
        keyboardHidesTabBar: true,


      }}

      screenOptions={({ route }) => ({
        tabBarButton: [
          "Profile",
          'Notification'
        ].includes(route.name)
          ? () => {
            return null;
          }
          : undefined,
          tabBarIcon: ({ focused, color, size }) => {focused ? CheckDebbuger() : null}
      })}
      
    >

      <BottonTab.Screen
        name="Home"
        component={HomeStackConfig}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color,focused }) => {
            focused ? CheckDebbuger() : null
           return <FastImage
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_home_icon.png') : require('../../assets/images/tab-home_1.png')}
              resizeMode='contain'
              style={{ ...styles.image, tintColor: color }}
            />
          }
          
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Home',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      {(!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) &&
        <BottonTab.Screen
          name="TopUp"
          component={TopUpConfig}
          options={{
            tabBarLabel: 'Wallet',
            tabBarIcon: ({ color }) => (
              <FastImage
                resizeMode='contain'
                source={require('../../assets/images/wallet_1.png')}
                style={{ width: 28, height: 28, tintColor: color }}
              />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'TopUp',
                    params: { someParam: 'Param1' },
                  },
                ],
              })
            },
          })}
        />}

      <BottonTab.Screen
        name="Gifts"
        component={GiftStackConfig}
        options={{
          tabBarLabel: 'Gifts',
          
          tabBarIcon: ({ color,focused }) => {
          focused && CheckDebbuger()
             return <FastImage
              resizeMode='contain'
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_gift_icon.png') : require('../../assets/images/tab-gift_1.png')}

              style={{ ...styles.image, tintColor: color }}
            />
          },
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Gifts',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="Offers"
        component={OffersStackConfig}
        options={{
          headerShown : true,
          tabBarLabel: 'Offers',
          tabBarIcon: ({ color,focused }) => {
            focused && CheckDebbuger()
            return <FastImage
              resizeMode='contain'
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_trophy_icon.png') : require('../../assets/images/tab-offer_1.png')}
              style={{ ...styles.image, tintColor: color }}
            />
          },
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Offers',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="More"
        component={MoreStackConfig}
        options={{
          tabBarLabel: 'More',
          headerTitleStyle: { fontFamily: fonts.bold },
          tabBarIcon: ({ color,focused}) => {
            focused && CheckDebbuger()
          return  <FastImage
              resizeMode='contain'
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_more_icon.png') : require('../../assets/images/more.png')}

              style={{ width: 25, height: 25, tintColor: color }}
            />
          },
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'More',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="Profile"
        component={ProfileStackConfig}
        options={{
          tabBarLabel: '',


        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'More',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="Notification"
        component={NotificationConfig}
        options={{
          tabBarLabel: '',


        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Notification',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />
    </BottonTab.Navigator>
  );
}

export const TabNavigatorOfferDynamicLink = () => {
  return (
    <BottonTab.Navigator
      initialRouteName="Offers"
      backBehavior='none'
      tabBarOptions={{
        labelStyle: styles.label,
        style: styles.tab,
        activeTintColor: Colors.APP_GREEN,
        inactiveTintColor: 'gray',
        keyboardHidesTabBar: true,


      }}

      screenOptions={({ route }) => ({
        tabBarButton: [
          "Profile",
          'Notification'
        ].includes(route.name)
          ? () => {
            return null;
          }
          : undefined,
      })}
    >

      <BottonTab.Screen
        name="Home"
        component={HomeStackConfig}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Image
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_home_icon.png') : require('../../assets/images/tab-home_1.png')}
              resizeMode='contain'
              style={{ ...styles.image, tintColor: color }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Home',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      {(!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) &&
        <BottonTab.Screen
          name="TopUp"
          component={TopUpConfig}
          options={{
            tabBarLabel: 'Wallet',
            tabBarIcon: ({ color }) => (
              <Image
                resizeMode='contain'
                source={require('../../assets/images/wallet_1.png')}
                style={{ width: 28, height: 28, tintColor: color }}
              />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'TopUp',
                    params: { someParam: 'Param1' },
                  },
                ],
              })
            },
          })}
        />}

      <BottonTab.Screen
        name="Gifts"
        component={GiftStackConfig}
        options={{
          tabBarLabel: 'Gifts',
          tabBarIcon: ({ color }) => (
            <Image
              resizeMode='contain'
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_gift_icon.png') : require('../../assets/images/tab-gift_1.png')}
              style={{ ...styles.image, tintColor: color }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Gifts',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="Offers"
        component={OffersStackConfig}
        options={{
          tabBarLabel: 'Offers',
          tabBarIcon: ({ color }) => (
            <Image
              resizeMode='contain'
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_trophy_icon.png') : require('../../assets/images/tab-offer_1.png')}
              style={{ ...styles.image, tintColor: color }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Offers',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="More"
        component={MoreStackConfig}
        options={{
          tabBarLabel: 'More',
          headerTitleStyle: { fontFamily: fonts.bold },
          tabBarIcon: ({ color }) => (
            <Image
              resizeMode='contain'
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_more_icon.png') : require('../../assets/images/more.png')}
              style={{ width: 25, height: 25, tintColor: color }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'More',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="Profile"
        component={ProfileStackConfig}
        options={{
          tabBarLabel: '',


        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'More',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="Notification"
        component={NotificationConfig}
        options={{
          tabBarLabel: '',


        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Notification',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />
    </BottonTab.Navigator>
  );
}

export const TabNavigatorForCCSSecondaryUser = () => {
  return (
    <BottonTab.Navigator
      initialRouteName="TodayScreen"
      backBehavior='none'
      tabBarOptions={{
        labelStyle: styles.label,
        style: styles.tab,
        activeTintColor: Colors.APP_GREEN,
        inactiveTintColor: 'gray',
        keyboardHidesTabBar: true,

      }}

      screenOptions={({ route }) => ({
        tabBarButton: [
          "Profile",
          'Notification'
        ].includes(route.name)
          ? () => {
            return null;
          }
          : undefined,
      })}
    >

      <BottonTab.Screen
        name="Home"
        component={HomeStackConfig}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Image
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_home_icon.png') : require('../../assets/images/tab-home_1.png')}
              resizeMode='contain'
              style={{ ...styles.image, tintColor: color }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Home',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="Offers"
        component={OffersStackConfig}
        options={{
          tabBarLabel: 'Offers',
          tabBarIcon: ({ color }) => (
            <Image
              resizeMode='contain'
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_trophy_icon.png') : require('../../assets/images/tab-offer_1.png')}
              style={{ ...styles.image, tintColor: color }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Offers',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="More"
        component={MoreStackConfig}
        options={{
          tabBarLabel: 'More',
          headerTitleStyle: { fontFamily: fonts.bold },
          tabBarIcon: ({ color }) => (
            <Image
              resizeMode='contain'
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_more_icon.png') : require('../../assets/images/more.png')}
              style={{ width: 25, height: 25, tintColor: color }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'More',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="Profile"
        component={ProfileStackConfig}
        options={{
          tabBarLabel: '',


        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'More',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="Notification"
        component={NotificationConfig}
        options={{
          tabBarLabel: '',


        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Notification',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />
    </BottonTab.Navigator>
  );
}


export const TabNavigatorForCCSInactivePrimaryUser = () => {
  return (
    <BottonTab.Navigator
      initialRouteName="Gifts"
      backBehavior='none'
      tabBarOptions={{
        labelStyle: styles.label,
        style: styles.tab,
        activeTintColor: Colors.APP_GREEN,
        inactiveTintColor: 'gray',
        keyboardHidesTabBar: true,

      }}

      screenOptions={({ route }) => ({
        tabBarButton: [
          "Profile",
          'Notification'
        ].includes(route.name)
          ? () => {
            return null;
          }
          : undefined,
      })}
    >

      <BottonTab.Screen
        name="Home"
        component={HomeStackConfig}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Image
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_home_icon.png') : require('../../assets/images/tab-home_1.png')}
              resizeMode='contain'
              style={{ ...styles.image, tintColor: color }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            return null
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Home',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="Gifts"
        component={GiftStackConfig}
        options={{
          tabBarLabel: 'Gifts',
          tabBarIcon: ({ color }) => (
            <Image
              resizeMode='contain'
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_gift_icon.png') : require('../../assets/images/tab-gift_1.png')}
              style={{ ...styles.image, tintColor: color }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Gifts',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="Offers"
        component={OffersStackConfig}
        options={{
          tabBarLabel: 'Offers',
          tabBarIcon: ({ color }) => (
            <Image
              resizeMode='contain'
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_trophy_icon.png') : require('../../assets/images/tab-offer_1.png')}

              style={{ ...styles.image, tintColor: color }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            return null
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Offers',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="More"
        component={MoreStackConfig}
        options={{
          tabBarLabel: 'More',
          headerTitleStyle: { fontFamily: fonts.bold },
          tabBarIcon: ({ color }) => (
            <Image
              resizeMode='contain'
              source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? require('../../assets/images/grey_more_icon.png') : require('../../assets/images/more.png')}
              style={{ width: 25, height: 25, tintColor: color }}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'More',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="Profile"
        component={ProfileStackConfig}
        options={{
          tabBarLabel: '',


        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'More',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />

      <BottonTab.Screen
        name="Notification"
        component={NotificationConfig}
        options={{
          tabBarLabel: '',


        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Notification',
                  params: { someParam: 'Param1' },
                },
              ],
            })
          },
        })}
      />
    </BottonTab.Navigator>
  );
}



const styles = StyleSheet.create({
  tab: {
    // height: Configuration.home.tab_bar_height,
    // backgroundColor: TAB_COLOR,
    overflow: 'hidden',
  },
  label: {
    fontSize: 11,
    // padding: 0,
    fontFamily: fonts.bold
  },
  image: {
    width: 28,
    height: 28
  },
  header: {
    backgroundColor: Colors.APP_GREEN,

  },
  rightBarButtonHolder: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  menu_img: { width: 30, height: 30, marginLeft: 8 }
});





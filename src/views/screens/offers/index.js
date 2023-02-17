import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, TextInput, ScrollView,
KeyboardAvoidingView,Platform,TouchableOpacity,Linking } from 'react-native';
import Colors from  '../../../utils/colors'
import YellowButton from '../../../components/button';
import { heightToDp, widthToDp, getDeviceWidth } from '../../../utils';
import * as Labels from '../../../constants'
import Modal from 'react-native-modal';


import { connect } from 'react-redux';
import ActivityIndicatorComponent from '../../../components/activityIndicator';
import fonts from '../../../assets/fonts';
import Offers from '../../../components/offers/offers';
import Saved from '../../../components/offers/saved';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import {OffersActionCreator} from '../../../redux/actionCreators/app/offers'
import ActivityIndicatorModal from '../../../components/activityIndicator/activityIndicatorModel';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import NoDataView from '../../../components/noData/noDataView';
import Offers2 from '../../../components/offers/offers2';
import Config from "react-native-config";
import OTPTimer from '../../../components/auth/otpTimer';
import { DashboardActionCreator } from '../../../redux/actionCreators/app/dashboard';
import { CheckAccessTokenExpiryTime } from '../../../redux/actionCreators/checkAccessTokenExpiry';
import NotificationBell from '../../../components/notificationBell/notificationBell';
import RoundImage from '../../../components/roundImage';
import { ProfileActionCreator } from '../../../redux/actionCreators/app/profile';
import { CCSActionCreator } from '../../../redux/actionCreators/app/ccs';


const mapStateToProps =(state) => ({
    loading:state.GetCateogoriesReducer.loading,
    request:state.GetCateogoriesReducer.request,
    response:state.GetCateogoriesReducer.response,

    getHeroTilesLoading:state.GetHeroTilesOffersReducer.loading,
    getHeroTilesRequest:state.GetHeroTilesOffersReducer.request,
    getHeroTilesResponse:state.GetHeroTilesOffersReducer.response,
  })

class OffersPage extends Component {

static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('Title', 'All'),
    };
  };

    constructor(props){
        super(props)
        this.state = {
          isOffersSelected:true,
          isActivatedSelected:false
        }
    }

    async componentDidMount(){
      // this._unsubscribe = this.props.navigation.addListener('focus', () => {
         
      // })

      await CheckAccessTokenExpiryTime('OffersTab')

      this.fetchCategory()

      this.props.navigation.setOptions({
        title: 'All',
        headerRight: () => (
            <View style={styles.rightBarButtonHolder}>
                <TouchableOpacity style={{ marginRight: 12 }} >
                    <RoundImage
                        navigation={this.props.navigation} />
                </TouchableOpacity>

            </View> 

        )
    })
         
    }

    componentWillUnmount() {
      // this._unsubscribe();
    }

     handleDynamicLink = link => {
      // Handle dynamic link inside your own application
      alert('DYNAMIC: '+JSON.stringify(link))
    };

    fetchCategory = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
             // this.props.dispatch(OffersActionCreator.resetGetCategoriesWithOffers2())
                this.props.dispatch(OffersActionCreator.getCategoriesWithOffers2(res))
                this.props.dispatch(DashboardActionCreator.getHeroTiles(false))
                this.props.dispatch(ProfileActionCreator.getProfileDetails(res))
                this.props.dispatch(CCSActionCreator.offerWithCategoryName(null))
            }
        })
    }

    pulledToRefresh = () => {
      this.fetchCategory()
    }

    onCategoryTapped = (item) => {
        
        this.props.navigation.setOptions({ title: item.Category_Name })
        
    }

    renderOffersAndSaved = () => {
      if(this.state.isOffersSelected){
        if(typeof(this.props.response) != 'undefined'){
          const res = this.props.response
          if(res.length > 0){
              return(
                <Offers2 
                navig ={this.props.navigation}
                categories={this.props.response}
                isFromSaved={false}
                onCategoryTapped={this.onCategoryTapped}
                pulledToRefresh={this.pulledToRefresh}
                heroTiles={this.props.getHeroTilesResponse}
                getCategoriesLoading={this.props.loading}
                getHeroTilesLoading={this.props.getHeroTilesLoading}
                />
              )
          }else{
            if(!this.props.loading){
              return(
                <View style={{justifyContent:'center',flex:1}}>
                  <Text style={{alignSelf:'center',fontFamily:fonts.bold,fontSize:13}}>Currently there are no offers to display</Text>

                </View>
                
            )
            }
            
          }
        }
      }else{
        return(
          <Saved
          navig ={this.props.navigation}/>
        )
      }
      
    }

    render() {

        return (
            <View style={styles.container}>
              
                <ActivityIndicatorModal isVisible={this.props.getHeroTilesLoading || this.props.loading}/>
                {!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd') &&
                <View style={styles.tabViewHolder}>
                    <TouchableOpacity 
                    style={this.state.isOffersSelected ? styles.touchableOpacitySelectedOffers : styles.touchableOpacityUnselectedOffers}
                    onPress = {() =>{
                        this.setState({isOffersSelected:true},() => {
                          this.fetchCategory()
                        })
                        
                    }}
                    >
                        <Text style={this.state.isOffersSelected ? styles.textSelected : styles.textUnselected}>{Labels.OFFERS.offers}</Text>
                    </TouchableOpacity>
  
                    <TouchableOpacity 
                    style={!this.state.isOffersSelected ? styles.touchableOpacitySelectedActivated : styles.touchableOpacityUnselectedActivated}
                    onPress={() => {
                        this.setState({isOffersSelected:false})
                    }}
                    >
                        <Text style={!this.state.isOffersSelected ? styles.textSelected : styles.textUnselected}>{Labels.OFFERS.saved}</Text>
                    </TouchableOpacity>
                </View>}

                {this.renderOffersAndSaved()}              
  
          </View>
      );
    }
}
export default connect(mapStateToProps)(OffersPage);


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:Colors.BACKGROUND_COLOR
    },
    tabViewHolder:{
      flexDirection:'row',
      width:'100%',    
    },
    touchableOpacityUnselectedOffers:{
      justifyContent:'center',
      alignItems:'center',
      width:'50%',
      height:45,
      backgroundColor:Colors.TOP_TAB_UNSELECTED,
    },
    touchableOpacitySelectedOffers:{
      justifyContent:'center',
      alignItems:'center',
      width:'50%',
      height:50,
      backgroundColor:Colors.YELLOW,
      shadowColor:Colors.YELLOW,
        shadowOffset:{width:2,height:2},
        shadowRadius:10,
        shadowOpacity:0.5,
        elevation:5
    },
    touchableOpacityUnselectedActivated:{
      justifyContent:'center',
      alignItems:'center',
      width:'50%',
      height:45,
      backgroundColor:Colors.TOP_TAB_UNSELECTED,
    },
    touchableOpacitySelectedActivated:{
      justifyContent:'center',
      alignItems:'center',
      width:'50%',
      height:50,
      backgroundColor:Colors.YELLOW,
      shadowColor:Colors.YELLOW,
        shadowOffset:{width:2,height:2},
        shadowRadius:10,
        shadowOpacity:0.5,
        elevation:5
    },
    textSelected:{
      fontSize:16,
      fontFamily:fonts.bold,
      color:'black',
      color:Colors.BUTTON_TEXT_COLOUR
    },
    textUnselected:{
      fontSize:12,
      fontFamily:fonts.bold,
      color:Colors.APP_GREEN
    },
    rightBarButtonHolder: {
      flexDirection: 'row',
      alignItems: 'center',

  },
  });
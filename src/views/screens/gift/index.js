import React, {Component} from 'react'
import { StyleSheet, Text, View,TouchableOpacity, Alert } from 'react-native'

import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import Colors from  '../../../utils/colors'
import ActivityIndicatorModal from '../../../components/activityIndicator/activityIndicatorModel';
import { RewardsActionCreator } from '../../../redux/actionCreators/app/rewards';
import GiftComponent from '../../../components/rewards/giftComponent';
import { CheckAccessTokenExpiryTime } from '../../../redux/actionCreators/checkAccessTokenExpiry';
import { ProfileActionCreator } from '../../../redux/actionCreators/app/profile';
import NotificationBell from '../../../components/notificationBell/notificationBell';
import RoundImage from '../../../components/roundImage';
import { CCSActionCreator } from '../../../redux/actionCreators/app/ccs';

const mapStateToProps =(state) => ({
    
    loading:state.GetRewardCategoriesReducer.loading,
    request:state.GetRewardCategoriesReducer.request,
    response:state.GetRewardCategoriesReducer.response,
    
    balanceLoading:state.GetPointsBalanceReducer.loading,
    balanceRequest:state.GetPointsBalanceReducer.request,
    balanceResponse:state.GetPointsBalanceReducer.response,

    shouldMoveToRewardsLoading: state.ShouldnavigateToRewardsReducer.loading,
    shouldMoveToRewardsRequest: state.ShouldnavigateToRewardsReducer.request,
    shouldMoveToRewardsResponse: state.ShouldnavigateToRewardsReducer.response,

    shouldMoveToMasterCardLoading: state.ShouldnavigateToMasterCardReducer.loading,
    shouldMoveToMasterCardRequest: state.ShouldnavigateToMasterCardReducer.request,
    shouldMoveToMasterCardResponse: state.ShouldnavigateToMasterCardReducer.response,
  
  })

class Gift extends Component {

    async componentDidMount(){
        // this._unsubscribe = this.props.navigation.addListener('focus', () => {
            
        //   });

        await CheckAccessTokenExpiryTime('GiftsTab')
        this.fetchRewardCategories()
        this.props.dispatch(CCSActionCreator.shouldNavigateToDigitalMasterCard(null))
        this.props.navigation.setOptions({
            title: '',
            headerShown : false,
            headerRight: () => (
                <></>
                // <View style={styles.rightBarButtonHolder}>
                //     <TouchableOpacity style={{ marginRight: 12 }} >
                //         <RoundImage
                //             navigation={this.props.navigation} />
                //     </TouchableOpacity>

                // </View> 

            )
        })
    }

    componentDidUpdate(){
        const rewardRes = this.props.shouldMoveToRewardsResponse
        if(typeof(rewardRes) != 'undefined'){
            this.props.dispatch(CCSActionCreator.resetResponse('18'))
            
            if(rewardRes != null){
                if(rewardRes){
                    this.props.dispatch(CCSActionCreator.shouldNavigateToRewards(false))
                    
                }
            }
        }

        const masterCardRes = this.props.shouldMoveToMasterCardResponse

        if(typeof(masterCardRes) != 'undefined'){
            this.props.dispatch(CCSActionCreator.resetResponse('19'))
            
            if(masterCardRes != null){
                if(masterCardRes){
                    this.props.dispatch(CCSActionCreator.shouldNavigateToDigitalMasterCard(false))
                    this.props.navigation.navigate('TransferToMasterCard',{balance:this.props.balanceResponse})
                }
            }
        }
    }

    componentWillUnmount() {
        // this._unsubscribe();
    }

    fetchRewardCategories = () => {
        this.props.dispatch(RewardsActionCreator.getRewardsCategories())
        EncryptedStorage.getItem('userId',(res,err) => {
            console.log("🚀 ~ file: index.js ~ line 98 ~ Gift ~ EncryptedStorage.getItem ~ res", res)
            if(res){
                console.log("🚀 ~ file: index.js ~ line 100 ~ Gift ~ EncryptedStorage.getItem ~ res", res)
                this.props.dispatch(RewardsActionCreator.getPointsBalance(res))
                this.props.dispatch(ProfileActionCreator.getProfileDetails(res))
            }
        })
    }

    renderCategories = () => {
        console.log('22222',this.props.response)
        if(typeof(this.props.response) != 'undefined'){
            if(this.props.response.length > 0){
                return(
                    <GiftComponent
                    categories={this.props.response}
                    navigation={this.props.navigation}
                    balance={this.props.balanceResponse}
                    />
                )
            }
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <ActivityIndicatorModal isVisible={this.props.loading}/>
                {this.renderCategories()}
            </View>
        )
    }
    
}

export default connect(mapStateToProps)(Gift);


const styles = StyleSheet.create({
    container: {
        flex:1,
        // backgroundColor:Colors.BACKGROUND_COLOR
      },
      rightBarButtonHolder: {
        flexDirection: 'row',
        alignItems: 'center',

    },
})

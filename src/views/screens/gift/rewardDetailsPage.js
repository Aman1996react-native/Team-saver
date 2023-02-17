import React, { Component } from "react";
import { 
    View,
    Text,
    FlatList,
    Image,
    StyleSheet
} from "react-native";

import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import Colors from  '../../../utils/colors'
import ActivityIndicatorModal from '../../../components/activityIndicator/activityIndicatorModel';
import { RewardsActionCreator } from '../../../redux/actionCreators/app/rewards';
import CategoryRow from "../../../components/offers/categoryRow";
import { getDeviceWidth } from "../../../utils";
import fonts from "../../../assets/fonts";
import MerchantsRow from "../../../components/rewards/merchantsRow";
import { SearchBar } from 'react-native-elements';
import BalanceView from "../../../components/rewards/balanceView";
import RedeemRewardsGiftCard from "../../../components/rewards/redeemRewardsGiftCard";
import { CheckAccessTokenExpiryTime } from "../../../redux/actionCreators/checkAccessTokenExpiry";


const mapStateToProps =(state) => ({
    
    loading:state.GetRewardDetailsReducer.loading,
    request:state.GetRewardDetailsReducer.request,
    response:state.GetRewardDetailsReducer.response,

    balanceLoading:state.GetPointsBalanceReducer.loading,
    balanceRequest:state.GetPointsBalanceReducer.request,
    balanceResponse:state.GetPointsBalanceReducer.response,

    foodAndWineLoading:state.GetFoodAndWineListReducer.loading,
    foodAndWineRequest:state.GetFoodAndWineListReducer.request,
    foodAndWineResponse:state.GetFoodAndWineListReducer.response,
  
  })

class RewardDetailsPage extends Component {

    constructor(props){
        super(props)
        this.state = {
            selectedCatIndex:0,
            searchText:'',
            filteredArray:[],
            shouldRerender:false,
            categories:[],
            shouldMoveUp:false
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', async() => {
            await CheckAccessTokenExpiryTime('RewardDetailsPage')
            this.fetchRewardDetails()
          });
        
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    componentDidUpdate(prevProps){
        if(!this.props.loading && this.state.shouldRerender){
            if(typeof(this.props.response) != 'undefined'){
                if(this.props.response.length > 0){
                    this.setState({categories:this.props.response.slice(0)},() => {
                        this.setState({shouldRerender:false})
                    })
                    
                }else{
                    this.setState({categories:[]},() => {
                        this.setState({shouldRerender:false})
                    })
                }
            }else{
                this.setState({categories:[]},() => {
                    this.setState({shouldRerender:false})
                })
            }
        }
    }

    fetchRewardDetails = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                if(this.props.route.params.item.RewardID == 'R05'){
                    this.setState({shouldRerender:true})
                    this.props.dispatch(RewardsActionCreator.getRewardDetails(this.props.route.params.item.RewardID))
                }
                if(this.props.route.params.item.RewardID == 'R02'){
                    this.props.dispatch(RewardsActionCreator.getFoodAndWine(res,this.props.route.params.item.RewardID))
                }
                this.props.dispatch(RewardsActionCreator.getPointsBalance(res))
            }
        })
    }

    
    renderAllRewards = () => {
        if(this.props.route.params.isGiftCard){
            const res = this.props.response
            if(typeof(res) != 'undefined'){
                if(typeof(res.merchants) != 'undefined' && typeof(res.categories) != 'undefined'){
                    if(res.merchants.length > 0 && res.categories.length > 0){
                        return(
                            <RedeemRewardsGiftCard
                            merchants={res.merchants}
                            categories={res.categories}
                            navigation={this.props.navigation}
                            balance={this.props.balanceResponse}
                            isGiftCard={this.props.route.params.isGiftCard}
                            isFoodAndWine={this.props.route.params.isFoodAndWine}
                            />
                        )
                    }
                }
            }
        }
        if(this.props.route.params.isFoodAndWine){
            const res = this.props.foodAndWineResponse
            if(typeof(res) != 'undefined'){
                    if(res.length > 0){
                        return(
                            <RedeemRewardsGiftCard
                            cafes={res}
                            navigation={this.props.navigation}
                            balance={this.props.balanceResponse}
                            isGiftCard={this.props.route.params.isGiftCard}
                            isFoodAndWine={this.props.route.params.isFoodAndWine}
                            info={this.props.route.params.info}
                            />
                        )
                    }
            }
        }
        
    }


    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicatorModal isVisible={this.props.loading || this.props.balanceLoading}/>
                {this.renderAllRewards()}
            </View>
        );
    }
}
export default connect(mapStateToProps)(RewardDetailsPage);


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width:'100%',
        height:'100%',
  

    },
});
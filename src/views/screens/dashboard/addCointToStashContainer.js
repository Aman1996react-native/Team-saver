import React, { Component } from "react";
import { 
    View,
    Text,
    SafeAreaView,
    StyleSheet
} from "react-native";
import ChallengeComponent from "../../../components/dashboard/challenge";
import {connect} from 'react-redux'
import { RewardsActionCreator } from "../../../redux/actionCreators/app/rewards";
import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';

const mapStateToProps =(state) => ({
    

    balanceLoading:state.GetPointsBalanceReducer.loading,
    balanceRequest:state.GetPointsBalanceReducer.request,
    balanceResponse:state.GetPointsBalanceReducer.response,

  })

class AddCoinToStashContainer extends Component {

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getPointsBalance()
          });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    getPointsBalance = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(RewardsActionCreator.getPointsBalance(res))
            }
        })
    }

    render() {
        if(typeof(this.props.balanceResponse) != 'undefined'){
            if(typeof(this.props.balanceResponse.Amount) != 'undefined'){
                return (
                    <SafeAreaView style={styles.container}>
                        <ChallengeComponent
                        isChallenge={false}
                        navigation={this.props.navigation}
                        balance={this.props.balanceResponse}/>
                    </SafeAreaView>
                );
            }
        }
        
    }
}
export default connect(mapStateToProps) (AddCoinToStashContainer);


const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
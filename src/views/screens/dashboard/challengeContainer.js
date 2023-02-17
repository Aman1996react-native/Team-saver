import React, { Component } from "react";
import { 
    View,
    Text,
    SafeAreaView,
    StyleSheet
} from "react-native";
import ChallengeComponent from "../../../components/dashboard/challenge";
import {connect} from 'react-redux'
import { DashboardActionCreator } from "../../../redux/actionCreators/app/dashboard";
import fonts from "../../../assets/fonts";
import ActivityIndicatorModal from '../../../components/activityIndicator/activityIndicatorModel'

const mapStateToProps =(state) => ({
    
    loading:state.GetChallengesReducer.loading,
    request:state.GetChallengesReducer.request,
    response:state.GetChallengesReducer.response,

  })

class ChallengeContainer extends Component {

    constructor(props){
        super(props)
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.props.dispatch(DashboardActionCreator.getChallenges())
        })
    }

    componentWillUnmount() {
        this._unsubscribe()
    }

    render() {
        const res = this.props.response
        if(typeof(res) != 'undefined'){
            if(res.length > 0){
                return (
                    <SafeAreaView style={styles.container}>
                        <ActivityIndicatorModal
                        isVisible={this.props.loading}
                        />
                        <ChallengeComponent
                        balance={this.props.route.params.balance}
                        navigation={this.props.navigation}
                        challengeResponse={res}
                        isChallenge={true}/>
                    </SafeAreaView>
                );
            }
        }
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicatorModal
                isVisible={this.props.loading}
                />
                <Text style={{fontFamily:fonts.bold,fontSize:15}}>No challenges to show</Text>
            </View>
        )
        
    }
}
export default connect(mapStateToProps) (ChallengeContainer);


const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
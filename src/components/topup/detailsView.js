import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    RefreshControl,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from "react-native";
import {connect} from 'react-redux'
import fonts from "../../assets/fonts";
import { ProfileActionCreator } from "../../redux/actionCreators/app/profile";
import { RewardsActionCreator } from "../../redux/actionCreators/app/rewards";
import { TopUpActionCreator } from "../../redux/actionCreators/app/topup";
import { getDeviceWidth } from "../../utils";
import colors from "../../utils/colors";
import ActivityIndicatorModal from "../activityIndicator/activityIndicatorModel";
import ImageComponent from "../imageComponent/imageComponent";


const mapStateToProps =(state) => ({
    
    loading:state.GetProfileDetailsReducer.loading,
    request:state.GetProfileDetailsReducer.request,
    response:state.GetProfileDetailsReducer.response,

    balanceLoading:state.GetPointsBalanceReducer.loading,
    balanceRequest:state.GetPointsBalanceReducer.request,
    balanceResponse:state.GetPointsBalanceReducer.response,

    bankDetailsLoading:state.GetBankDetailsReducer.loading,
    bankDetailsRequest:state.GetBankDetailsReducer.request,
    bankDetailsResponse:state.GetBankDetailsReducer.response,
})

class DetailsView extends Component {

    constructor(props){
        super(props)
        this.state = {
            sendTapped:null
        }
    }

    componentDidMount(){
        this.setState({sendTapped:null})
          this.getProfileData()
    }

    getProfileData = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(ProfileActionCreator.getProfileDetails(res))
                this.props.dispatch(RewardsActionCreator.getPointsBalance(res))
                this.props.dispatch(TopUpActionCreator.getBankDetails(res))
            }
        })
    }

    renderBalance = () => {
        const res = this.props.balanceResponse
        if(typeof(res) != 'undefined'){
            if(typeof(res.Amount) != 'undefined'){
                return(
                    <View style={{margin:10}}>
                        {res.Amount != null ?
                        <Text style={[styles.descText,{fontSize:30,color:colors.APP_GREEN}]}>${Number(res.Amount).toFixed(2)}</Text>
                        :
                        <Text style={[styles.descText,{fontSize:30,color:colors.APP_GREEN}]}>$0.00</Text>
                        }
                    </View>
                )
            }
        }
    }

    renderImage = () => {
        const res = this.props.response
        if(typeof(res) != 'undefined'){
            if(typeof(res.Image) != 'undefined'){
                if(res.Image != null){
                    return(
                        <ImageComponent
                        resizeMode={'cover'}
                        style={styles.image}
                        imageUrl={res.Image}
                        />
                    )
                }
            }
        }
        return(
            <View style={{alignSelf:'center',justifyContent:'center',alignItems:'center',marginBottom:20,padding:5,borderRadius:40,width:80,height:80,borderWidth:2,borderColor:colors.APP_GREEN}}>
                <Text style={[styles.name,{fontSize:20,color:colors.APP_GREEN}]}>{this.props.response.nameToDisplay}</Text>
            </View>
        )
    }

    renderMobile = () => {
        const res = this.props.response
        if(typeof(res) != 'undefined'){
            if(typeof(res.Mobile) != 'undefined'){
                if(res.Mobile != null){
                    return(
                        <View style={{margin:2}}>
                            <Text style={[styles.descText]}>{res.Mobile}</Text>
                        </View>
                    )
                }
            }
        } 
    }

    renderOptionView = () => {
        if(this.props.topUpScreen == 1){
            return(
                <View style={styles.optionsHolder}>
                <TouchableOpacity style={styles.touchableOpacity}
                onPress={() => {
                    this.setState({sendTapped:null})
                    this.props.onAddMoneyTapped()
                }}>
                    <View style={styles.buttonImage}>
                        <Image 
                        style={{width:20,height:20,tintColor:colors.BLACK}}
                        source={require('../../assets/images/plus.png')}/>
                    </View>
                    <Text style={[styles.descText,{fontSize:10}]}>Add Money</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.touchableOpacity}
                onPress={() => {
                    this.setState({sendTapped:true})
                    this.props.sendMoneyTapped()
                }}>
                    <View style={(this.state.sendTapped && this.state.sendTapped != null) ? styles.buttonImageActivated : styles.buttonImage}>
                        <Image 
                        style={{width:20,height:20,tintColor:colors.BLACK}}
                        source={require('../../assets/images/send.png')}/>
                    </View>
                    <Text style={[styles.descText,{fontSize:10}]}>Send Money</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.touchableOpacity}
                onPress={() => {
                    this.setState({sendTapped:false})
                    this.props.requestMoneyTapped()
                }}>
                    <View style={(!this.state.sendTapped && this.state.sendTapped != null) ? styles.buttonImageActivated : styles.buttonImage}>
                        <Image 
                        style={{width:20,height:20,tintColor:colors.BLACK}}
                        source={require('../../assets/images/hand.png')}/>
                    </View>
                    <Text style={[styles.descText,{fontSize:10}]}>Request Money</Text>
                </TouchableOpacity>
            </View>
            )
        }
    }

    renderText = () => {
        if(this.props.topUpScreen == 2){
            return(
                <View style={{margin:5,marginBottom:15}}>
                    <Text style={styles.descText}>Copy all details including the reference number to ensure your account is updated correctly with your mWallet funds.</Text>
                </View>
            )
        }
    }

    renderAccountDetails = () => {
        if(this.props.topUpScreen == 2){
            const res = this.props.bankDetailsResponse
            if(typeof(res) != 'undefined'){
                if(typeof(res.AccountNumber) != 'undefined' && typeof(res.BSB) != 'undefined'
                && typeof(res.GUID) != 'undefined'){
                    return(
                        <View style={{marginBottom:10,alignItems:'center',justifyContent:'center'}}>
                            <Text style={styles.descText}>BSB: {res.BSB}</Text>
                            <Text style={styles.descText}>Account Number: {res.AccountNumber}</Text>
                            <Text style={styles.descText}>Account Name: {res.Name}</Text>
                            <Text style={[styles.descText,{fontSize:11}]}>Reference Number: {res.GUID}</Text>
                            <View style={[styles.optionsHolder,{flexDirection:'column'}]}>

                                <TouchableOpacity style={[styles.touchableOpacity,{width:(getDeviceWidth() - 50)/2,alignSelf:'center'}]}
                                onPress={() => {
                                    const res = this.props.bankDetailsResponse
                                    this.props.onCopyDetailsPressed(res)
                                }}>
                                    <View style={styles.buttonImage}>
                                        <Image 
                                        style={{width:20,height:20,tintColor:colors.BLACK}}
                                        source={require('../../assets/images/plus.png')}/>
                                    </View>
                                    <Text style={[styles.descText,{fontSize:12}]}>Copy details</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
            }
        }
    }

    render() {
        return (
            <ScrollView
            refreshControl={
                <RefreshControl refreshing={false}
                tintColor='transparent'
                onRefresh={() => {this.getProfileData()}} />
            }>
                <View style={styles.detailsView}>
                    {this.renderText()}
                    <Text style={styles.descText}>Available Balance</Text>
                    {this.renderBalance()}
                    {this.renderImage()}
                    {this.renderAccountDetails()}
                    {this.renderOptionView()}                   
                </View>
            </ScrollView>
        );
    }
}
export default connect(mapStateToProps) (DetailsView);


const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        
    },
    descText:{
        fontFamily:fonts.bold,
        textAlign:'center',
        fontSize:14
    },
    detailsView:{
        marginTop:10,
        marginLeft:15,
        marginRight:15,
        width:getDeviceWidth() - 30,
        backgroundColor:colors.White,
        paddingTop:10
    },
    image:{
        width:100,
        height:100,
        borderRadius:50,
        alignSelf:'center',
        marginBottom:20
    },
    name:{
        color:colors.White,
        fontSize:16,
        fontFamily:fonts.bold,
        textAlign:'center'
      },
    optionsHolder:{
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        padding:5,
        alignSelf:'center'
    },
    touchableOpacity:{
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        width:(getDeviceWidth() - 50)/3,
        marginRight:5
    },
    touchableOpacitySelected:{
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        width:(getDeviceWidth() - 50)/3,
        marginRight:5,
        borderWidth:1,
        borderColor:colors.APP_GREEN
    },
    buttonImage:{
        width:40,
        height:40,
        borderRadius:20,
        marginBottom:5,
        backgroundColor:colors.LightGray,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonImageActivated:{
        width:40,
        height:40,
        borderRadius:20,
        marginBottom:5,
        backgroundColor:colors.LightGray,
        justifyContent:'center',
        alignItems:'center',
    },
    refreshText:{
        fontFamily:fonts.bold,
        fontSize:14
    }
});
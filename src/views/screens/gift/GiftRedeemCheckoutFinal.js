import React, { Component } from "react";
import { 
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet
} from "react-native";
import fonts from "../../../assets/fonts";
import YellowButton from "../../../components/button";
import { getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import { RewardsActionCreator } from "../../../redux/actionCreators/app/rewards";
import {showAlertWithCallBack} from '../../../utils/'
import ActivityIndicatorComponent from "../../../components/activityIndicator";
import TransactionSuccessModal from "../../../components/rewards/transactionSuccessModal";
import { AuthActionCreator } from "../../../redux/actionCreators/auth";
import ImageComponent from "../../../components/imageComponent/imageComponent";
import Config from "react-native-config";
import ConfirmationModal from "../../../components/ccs/confirmationModal";




const mapStateToProps =(state) => ({
    
    loading:state.RedeemGiftCardReducer.loading,
    request:state.RedeemGiftCardReducer.request,
    response:state.RedeemGiftCardReducer.response,
  
  })

class GiftRedeemCheckoutFinal extends Component {

    constructor(props){
        super(props)
        this.state = { 
            showTransactionModal:false
        }
    }

    componentDidUpdate(prevProps){
        const res = this.props.response
        
        if(typeof(res) != 'undefined' && !this.props.loading){
            if(Object.keys(res).length > 0){
                if(typeof(res.Status) != 'undefined'){
                    if(res.Status == 'Success'){
                        this.setState({showTransactionModal:true})
                        this.props.dispatch(RewardsActionCreator.resetRedeemgiftCard())

                      }else{
                        showAlertWithCallBack('Failed to redeem Gift Card. Please try again.',() => {
                            this.props.navigation.goBack()
                            this.props.dispatch(RewardsActionCreator.resetRedeemgiftCard())
                        })
                      }
                }else{
                    showAlertWithCallBack('Failed to redeem Gift Card. Please try again.',() => {
                        this.props.navigation.goBack()
                        this.props.dispatch(RewardsActionCreator.resetRedeemgiftCard())
                    })
                }
            }
        }else{
           
        }
    }

    renderRewardView = () => {
        return(
            <View style={styles.rewardView}>
                <TouchableOpacity
                onPress={() => {
                    this.props.navigation.goBack()
                }}
                style={styles.touchableOpacity}>
                    <Image style={{width:20,height:20,tintColor:colors.APP_GREEN}} resizeMode='contain' source={require('../../../assets/images/edit.png')}/>
                </TouchableOpacity>

                <View style={styles.imageAndDetailsHolderView}>
                    <View style={styles.imageHolderView}>
                        <ImageComponent
                        resizeMode={'contain'}
                        style={{width:60,height:60}}
                        imageUrl={this.props.route.params.item.Merchant_Image}
                        />
                    </View>

                    <View style={styles.detailsView}>
                    <Text style={styles.nameText}>{this.props.route.params.item.Merchant_Name}</Text>
                    {this.props.route.params.item.OfferDetails[0].Details != null &&
                    <Text numberOfLines={10} style={styles.descText}>{this.props.route.params.item.OfferDetails[0].Details}</Text>
                    }
                    </View>
                </View>

                <View style={styles.valueHolderView}>
                    {this.props.route.params.selectedContact != null &&
                        <View>
                            <Text style={[styles.descText,{fontSize:14}]}>To: {this.props.route.params.selectedContact.Name}</Text>
                            <Text style={[styles.descText,{fontSize:14}]}>Description: {this.props.route.params.desc}</Text>
                            {this.props.route.params.delivery == 'Later' &&
                            <Text style={[styles.descText,{fontSize:14}]}>Delivery Date: {this.props.route.params.date}</Text>
                            }
                        </View>
                    }
                    {this.props.route.params.isPlusTapped &&
                        <View>
                            <Text style={[styles.descText,{fontSize:14}]}>To: {this.props.route.params.name}</Text>
                            <Text style={[styles.descText,{fontSize:14}]}>Mobile Number: {this.props.route.params.mobile}</Text>
                            <Text style={[styles.descText,{fontSize:14}]}>Description: {this.props.route.params.desc}</Text>
                            {this.props.route.params.delivery == 'Later' &&
                            <Text style={[styles.descText,{fontSize:14}]}>Delivery Date: {this.props.route.params.date}</Text>
                            }
                        </View>
                    }
                    {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 
                        <View>
                            <Text style={[styles.descText,{fontSize:14}]}>Total Payment: ${this.props.route.params.selectedItem.Amount}</Text>
                        </View>
                    :
                        <View>
                            <Text style={[styles.descText,{fontSize:14,marginTop:15}]}>Value: ${this.props.route.params.selectedItem.Amount}</Text>
                            <Text style={[styles.descText,{fontSize:14}]}>Total Payment: {this.props.route.params.selectedItem.Points} points</Text>
                        </View>
                    }
                    
                </View>
            </View>
        )
    }

    onRedeemtapped = () => {
        if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
            const param = this.props.route.params
            const catId = param.item.Category_ID
            const merId = param.item.Merchant_ID
            const amount = param.selectedItem.Amount


            EncryptedStorage.getItem('userId',(res,err) => {
                if(res){
                    this.props.dispatch(RewardsActionCreator.redeemGiftCard(
                        res,catId,merId,amount + '.00','','','','','',true,'','',true,param.selectedItem.Offer_ID
                    ))
                }
            })


        }else{
            const param = this.props.route.params
            const catId = param.item.Category_ID
            const merId = param.item.Merchant_ID
            const amount = param.selectedItem.Amount
            const points = param.selectedItem.Points
            const date =  (param.selectedContact != null || param.isPlusTapped) ? param.delivery == 'Later' ? param.date : null  : null
            const datemmddyyyy =  (param.selectedContact != null || param.isPlusTapped) ? param.delivery == 'Later' ? param.datemmddyyyy : null  : null
            const desc = (param.selectedContact != null || param.isPlusTapped) ? param.desc : null
            const name = (param.selectedContact != null || param.isPlusTapped) ? param.name : 'Me'
            const number = param.mobile
            const self = param.selectedContact == null && !param.isPlusTapped
            const fromName = param.fromName
            const fromMobile = param.fromMobile


             EncryptedStorage.getItem('userId',(res,err) => {
                if(res){
                    this.props.dispatch(RewardsActionCreator.redeemGiftCard(
                        res,catId,merId,amount + '.00',points,datemmddyyyy,desc,name,number,self,fromName,fromMobile,false,param.selectedItem.Offer_ID
                    ))
                }
            })

        }
         
    }

    onOkayTapped = () => {
        this.setState({showTransactionModal:false},() => {
            // this.props.navigation.goBack()
            this.props.dispatch(AuthActionCreator.isFirstTime(false))
            this.props.dispatch(AuthActionCreator.isLoggedIn(true))
        })
        
    }


    render() {
        const param = this.props.route.params
        const name = (param.selectedContact != null || param.isPlusTapped) ? param.name : 'Me'

        if(this.props.loading){
            return(
                <ActivityIndicatorComponent/>
            )
        }
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <ActivityIndicatorModal isVisible={this.props.loading}/>
                {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                
                    <ConfirmationModal
                    isVisible={this.state.showTransactionModal}
                    title={'Your reward has now been delivered and your TS mWallet balance has been updated.'}
                    buttonText={'Okay'}
                    onClose={this.onClose}
                    showCloseButton={false}
                    onButtonTapped={this.onOkayTapped}
                    />
                }
                {(!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) &&
                    <TransactionSuccessModal 
                    isVisible= {this.state.showTransactionModal}
                    item={param.item}
                    selectedContactName={name}
                    response={param.response}
                    isMe={param.selectedContact == null && !param.isPlusTapped}
                    selectedItem={param.selectedItem}
                    isPlusTapped={param.isPlusTapped}
                    onOkayTapped={this.onOkayTapped}
                    isFoodAndWine={this.props.route.params.isFoodAndWine}
                    isGiftCard={this.props.route.params.isGiftCard}
                    selectedContact={param.selectedContact}
                    isTransfer={false}
                    />
                }
               {this.renderRewardView()}
               <View style={styles.btnContainer} >
                    <YellowButton title='Redeem' navigate={() => { this.onRedeemtapped() }} />
                </View>
            </ScrollView>
        );
    }
}
export default connect(mapStateToProps)(GiftRedeemCheckoutFinal);


const styles = StyleSheet.create({
    container: {
        // alignItems: 'center',
        // height:'100%'
        flex:1,
        justifyContent:'flex-start'
    },
    rewardView:{
        width:getDeviceWidth() - 30,
        margin:15,
        backgroundColor:colors.White,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        shadowColor:colors.BLACK,
        shadowOffset:{width:1,height:1},
        shadowRadius:4,
        shadowOpacity:0.5,
        elevation:5
    },
    touchableOpacity:{
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'flex-end',
        padding:5
    },
    imageAndDetailsHolderView:{
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        padding:5
    },
    imageHolderView:{
       width:'30%',
       justifyContent:'center',
       alignItems:'center' 
    },
    detailsView:{
        width:'70%',
        justifyContent:'center',
    },
    valueHolderView:{
        justifyContent:'center',
        // alignItems:'center',
        width:'100%',
        padding:10
    },
    nameText:{
        fontFamily:fonts.bold,
        color:colors.APP_GREEN,
        fontSize:18,
        // width:getDeviceWidth() - 40,
    },
    descText:{
        fontFamily:fonts.medium,
        color:colors.BLACK,
        fontSize:12,
        marginTop:5,
        marginBottom:5,
        marginRight:10
    },
    btnContainer: {
        width: getDeviceWidth(),
        alignItems: "center",
        alignSelf:'flex-end',
        marginTop:50,
        marginBottom:10,
    },

});
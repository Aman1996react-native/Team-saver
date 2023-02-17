import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import React, { Component } from "react";
import { 
    View,
    Text,
    Platform,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
} from "react-native";
import {connect} from 'react-redux'
import fonts from "../../../assets/fonts";
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import YellowButton from "../../../components/button";
import ImageComponent from "../../../components/imageComponent/imageComponent";
import ContactsView from "../../../components/rewards/contactsView";
import DetailsView from "../../../components/topup/detailsView";
import { ChatActionCreator } from "../../../redux/actionCreators/app/chat";
import { RewardsActionCreator } from "../../../redux/actionCreators/app/rewards";
import { TopUpActionCreator } from "../../../redux/actionCreators/app/topup";
import { getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";

const mapStateToProps =(state) => ({
    loading:state.GetMatchedContactsReducer.loading,
    request:state.GetMatchedContactsReducer.request,
    response:state.GetMatchedContactsReducer.response,

    balanceLoading:state.GetPointsBalanceReducer.loading,
    balanceRequest:state.GetPointsBalanceReducer.request,
    balanceResponse:state.GetPointsBalanceReducer.response,

    sendMoneyLoading:state.SendMoneyToUserReducer.loading,
    sendMoneyRequest:state.SendMoneyToUserReducer.request,
    sendMoneyResponse:state.SendMoneyToUserReducer.response,

    makePaymentLoading:state.MakePaymentReducer.loading,
    makePaymentRequest:state.MakePaymentReducer.request,
    makePaymentResponse:state.MakePaymentReducer.response,
})

class TopUpSendMoney extends Component {

    constructor(props){
        super(props)
        this.state = {
            contacts:this.props.route.params.contacts,
            selectedContact:this.props.route.params.selectedContact,
            isPlusTapped:null,
            totalPay:'',
            isMe:this.props.route.params.isMe,
            accountName:'',
            accountBSB:'',
            accountNumber:'',
            referenceId:''
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.fetchMatchedContacts()
          });
    }

    componentWillUnmount() {
        this.setState({selectedContact:null})
        this._unsubscribe();
    }

    onBack = () => {
        this.props.navigation.goBack()
    }

    componentDidUpdate(prevProps){
        const res = this.props.sendMoneyResponse
        if(typeof(res) != 'undefined' && !this.props.sendMoneyLoading){
            if(Object.keys(res).length > 0){
                if(typeof(res.Status) != 'undefined'){
                    if(res.Status == 'Success'){
                        if(typeof(res.Contacts) != 'undefined'){
                            if(res.Contacts.length > 0){
                                if(res.Contacts[0].Mobile_Number != null){
                                    this.props.dispatch(ChatActionCreator.resetGetChat())
                                    this.props.navigation.navigate('ChatMessagePage',{mobileNumber:res.Contacts[0].Mobile_Number,onBack:this.onBack})
                                }
                            }
                        }
                    }else{
                        alert('Failed to send money. Please try again.')
                    }
                }
                this.props.dispatch(TopUpActionCreator.resetSendMoney())
            }
        }

        const response = this.props.makePaymentResponse
        if(typeof(response) != 'undefined' && !this.props.makePaymentLoading){
            if(Object.keys(response).length > 0){
                if(typeof(response.Status) != 'undefined'){
                    if(response.Status == 'Success'){
                        
                    }
                }
                this.props.navigation.goBack()
                this.props.dispatch(TopUpActionCreator.resetmakePayment())
            }
        }
    }

    fetchMatchedContacts = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(RewardsActionCreator.getPointsBalance(res))
                this.props.dispatch(RewardsActionCreator.getMatchedContacts(res,this.props.route.params.contacts))
            }
        })
    }

    onContactSelected = (item,isMe) => {
        if(item != null && !isMe){
            this.setState({selectedContact:item,isMe:false})
        }
        if(isMe){
            this.setState({isMe:true,selectedContact:null})
        }
    }

    onPlusTapped = (item) => {
        
    }

    renderMatchedContacts = () => {
        const response = this.props.response
        
        if(typeof(response) != 'undefined'){
            if(typeof(response.contactDetails) != 'undefined'){
                if(response.contactDetails != null){
                        return(
                            <ContactsView
                            contacts={response.contactDetails}
                            onContactSelected={this.onContactSelected}
                            onPlusTapped={this.onPlusTapped}
                            myContact={response}
                            isCheckout={false}
                            isSendMoney={true}
                            isRequestMoney={false}
                            />
                        )
                    
                }
            }
        }
        
    }

    onPayTapped = () => {
        if(this.state.totalPay != '' && Number(this.state.totalPay) > 0){
            const res = this.props.balanceResponse
            if(typeof(res) != 'undefined'){
                if(typeof(res.Amount) != 'undefined'){
                    if(res.Amount > Number(this.state.totalPay)){
                        EncryptedStorage.getItem('userId',(res,err) => {
                            if(res){
                                let contacts = []
                                let ele = {
                                    Amount:this.state.totalPay,
                                    Name:this.state.selectedContact.Name,
                                    Mobile_Number:this.state.selectedContact.contactNumber
                                }
                                contacts.push(ele)
                                this.props.dispatch(TopUpActionCreator.sendMoney(res,this.state.totalPay,contacts))
                            }
                        })
                    }else{
                        alert('No sufficient funds')
                    }
                }
            }
        }
    }

    rendeBalanceView = () => {
        const res = this.props.balanceResponse
        if(typeof(res) != 'undefined'){
            if(typeof(res.Amount) != 'undefined'){
                return(
                    <View style={{margin:10}}>
                        <Text style={[styles.descText,{fontSize:12,color:colors.BLACK}]}>Available Balance:</Text>
                        <Text style={[styles.descText,{fontSize:30,color:colors.APP_GREEN}]}>${Number(res.Amount).toFixed(2)}</Text>
                    </View>
                )
            }
        }
    }


    onPaySelfTapped = () => {
        if(this.state.accountName.length > 0 && this.state.accountBSB.length > 0 &&
            this.state.accountNumber.length > 0 && Number(this.state.totalPay) > 0){
                EncryptedStorage.getItem('userId',(res,err) => {
                    if(res){
                        const response = this.props.balanceResponse
                        if(typeof(response) != 'undefined'){
                            if(typeof(response.Amount) != 'undefined'){
                                if(response.Amount > Number(this.state.totalPay)){
                                    this.props.dispatch(TopUpActionCreator.makePayment(res,this.state.accountName,this.state.accountNumber,
                                        this.state.accountBSB,this.state.totalPay))
                                }else{
                                    alert('Insufficient funds')
                                }
                            }
                        }
 
                    }
                })
            }else{
                alert('Please enter missing details')
            }
    }

    renderSelectedContactImage = (con) => {
        if(typeof(con.Image) != 'undefined'){
            if(con.Image != null){
                return(
                    <ImageComponent
                    resizeMode={null}
                    style={{width:60,height:60,borderRadius:30}}
                    imageUrl={con.Image}
                    />
                )
            }
        }
        return(
            <Text style={[styles.name,{color:colors.APP_GREEN,fontSize:20}]}>{con.nameToDisplay}</Text>
        )

    }

    renderSelectedContactImageSelf = (con) => {
        if(typeof(con.Image) != 'undefined'){
            if(con.Image != null){
                return(
                    <ImageComponent
                    resizeMode={null}
                    style={{width:60,height:60,borderRadius:30}}
                    imageUrl={con.Image}
                    />
                )
            }
        }
        return(
            <Text style={[styles.name,{color:colors.APP_GREEN,fontSize:20}]}>Me</Text>
        )
    }

    renderSendMoneyView = () => {
        if(this.state.selectedContact != null){
            return(
                <View style={styles.detailsView}>
                    {this.rendeBalanceView()}
                    <View style={{width:60,height:60,borderRadius:30,alignSelf:'center',margin:10,justifyContent:'center',alignItems:'center',backgroundColor:colors.LightGray}}>
                        {this.renderSelectedContactImage(this.state.selectedContact)}
                    </View>
                    <View>
                        <View style={styles.valuesView}>
                            <Text style={styles.payText}>PAY</Text>
                            <Text style={[styles.payText,{color:colors.BLACK}]}>{this.state.selectedContact.Name}</Text>
                        </View>
                        <View style={styles.valuesView}>
                            <Text style={styles.payText}>MOBILE</Text>
                            <Text style={[styles.payText,{color:colors.BLACK}]}>{this.state.selectedContact.contactNumber}</Text>
                        </View>
                        <View style={styles.valuesView}>
                            <Text style={styles.payText}>TOTAL PAY $</Text>
                            <TextInput
                            style={{width:'40%',height:40,textAlign:'right',fontFamily:fonts.bold,fontSize:16}}
                            value={this.state.totalPay.toString()}
                            keyboardType='numeric'
                            placeholder='Amount...'
                            onChangeText={(text) => {
                                this.setState({totalPay:text})
                            }}
                            />
                        </View>
                    </View>
                    
                    <View style={styles.btnContainer} >
                        <YellowButton title={'Pay'} navigate={() => { this.onPayTapped() }} />
                    </View>

                </View>
            )
        }

        if(this.state.isMe && this.state.selectedContact == null){
            return(
                <View style={styles.detailsView}>
                    {this.rendeBalanceView()}
                    <View style={{width:60,height:60,borderRadius:30,alignSelf:'center',margin:10,justifyContent:'center',alignItems:'center',backgroundColor:colors.LightGray}}>
                        {this.renderSelectedContactImageSelf(this.props.response)}
                    </View>
                    <View>
                        <View style={styles.valuesView}>
                            <Text style={styles.payText}>Name on Account</Text>
                            <TextInput
                            style={{width:'40%',height:40,textAlign:'right',fontFamily:fonts.bold,fontSize:16}}
                            value={this.state.accountName}
                            placeholder='Name'
                            onChangeText={(text) => {
                                this.setState({accountName:text})
                            }}
                            />
                        </View>

                        <View style={styles.valuesView}>
                            <Text style={styles.payText}>Account BSB</Text>
                            <TextInput
                            style={{width:'40%',height:40,textAlign:'right',fontFamily:fonts.bold,fontSize:16}}
                            value={this.state.accountBSB}
                            placeholder='BSB'
                            onChangeText={(text) => {
                                this.setState({accountBSB:text})
                            }}
                            />
                        </View>

                        <View style={styles.valuesView}>
                            <Text style={styles.payText}>Account Number</Text>
                            <TextInput
                            style={{width:'40%',height:40,textAlign:'right',fontFamily:fonts.bold,fontSize:16}}
                            value={this.state.accountNumber}
                            placeholder='Acc Number'
                            onChangeText={(text) => {
                                this.setState({accountNumber:text})
                            }}
                            />
                        </View>

                        <View style={styles.valuesView}>
                            <Text style={styles.payText}>TOTAL PAY $</Text>
                            <TextInput
                            style={{width:'40%',height:40,textAlign:'right',fontFamily:fonts.bold,fontSize:16}}
                            value={this.state.totalPay}
                            placeholder='Amount'
                            keyboardType='numeric'
                            onChangeText={(text) => {
                                this.setState({totalPay:text})
                            }}
                            />
                        </View>

                    </View>
                    
                    <View style={styles.btnContainer} >
                        <YellowButton title={'Pay'} navigate={() => { this.onPaySelfTapped() }} />
                    </View>

                </View>
            )
        }
    }

    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS == 'ios' && 'padding'} style={styles.container}>
                <ScrollView 
                contentContainerStyle={{justifyContent:'center'}}>
                    <ActivityIndicatorModal 
                    isVisible={this.props.loading || this.props.balanceLoading || 
                        this.props.sendMoneyLoading || this.props.makePaymentLoading}
                    />

                    {this.state.selectedContact == null && !this.state.isMe &&
                    <View style={{justifyContent:'center',marginTop:30}}>
                        <DetailsView/>
                    </View>
                    }
                    {this.renderSendMoneyView()}
                </ScrollView>
                
            </KeyboardAvoidingView>
        );
    }
}
export default connect(mapStateToProps) (TopUpSendMoney);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop:10,
        backgroundColor:colors.White,
    },
    detailsView:{
        marginTop:10,
        marginLeft:15,
        marginRight:15,
        width:getDeviceWidth() - 30,
        backgroundColor:colors.White,
        paddingTop:10
    },
    valuesView:{
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        justifyContent:'space-between',
        padding:5,
        marginBottom:10,
        marginTop:10,
        borderBottomWidth:1,
        borderBottomColor:colors.APP_GREEN
    },
    payText:{
        fontFamily:fonts.bold,
        color:colors.APP_GREEN,
        opacity:0.7,
        fontSize:14
    },
    btnContainer: {
        width: getDeviceWidth() - 30,
        alignItems: "center",
        marginBottom:20,
        marginTop:20
    },
    descText:{
        fontFamily:fonts.bold,
        textAlign:'center',
        fontSize:14
    },
    name:{
        color:colors.White,
        fontSize:16,
        fontFamily:fonts.bold,
        textAlign:'center'
      }
});
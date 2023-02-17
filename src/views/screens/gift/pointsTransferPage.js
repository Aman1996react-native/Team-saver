import React, { Component } from "react";
import { 
    View,
    Text,
    Platform,
    ScrollView,
    TextInput,
    Image,
    StyleSheet,
    KeyboardAvoidingView
} from "react-native";

import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RewardsActionCreator } from "../../../redux/actionCreators/app/rewards";
import BalanceView from "../../../components/rewards/balanceView";
import { getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";
import fonts from "../../../assets/fonts";
import ContactsView from "../../../components/rewards/contactsView";
import YellowButton from "../../../components/button";
import ActivityIndicatorComponent from "../../../components/activityIndicator";
import { CheckAccessTokenExpiryTime } from "../../../redux/actionCreators/checkAccessTokenExpiry";

const mapStateToProps =(state) => ({

    loading:state.GetMatchedContactsReducer.loading,
    request:state.GetMatchedContactsReducer.request,
    response:state.GetMatchedContactsReducer.response,

    balanceLoading:state.GetPointsBalanceReducer.loading,
    balanceRequest:state.GetPointsBalanceReducer.request,
    balanceResponse:state.GetPointsBalanceReducer.response,
  
  })

class PointsTransferPage extends Component {

    constructor(props){
        super(props)
        this.state = {
            selectedContact:null,
            points:'',
            message:'',
            reload:false
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', async() => {
            await CheckAccessTokenExpiryTime('PointstransferPage')
            this.fetchMatchedContacts()
          });
    }

    componentDidUpdate(prevProps){
        const res = this.props.response
        if(typeof(res) != 'undefined'){
            if(this.state.reload){
                this.setState({reload:false})
            }
        }
    }

    componentWillUnmount() {
        this.setState({selectedContact:null})
        this._unsubscribe();
    }

    fetchMatchedContacts = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.setState({reload:true})
                this.props.dispatch(RewardsActionCreator.getMatchedContacts(res,this.props.route.params.contacts))
                this.props.dispatch(RewardsActionCreator.getPointsBalance(res))
            }
        })
    }

    renderBalanceView = () => {
        
        if(typeof(this.props.balanceResponse) != 'undefined'){
            if(typeof(this.props.balanceResponse.Balance) != 'undefined'){
                return(
                    <BalanceView
                    balance={this.props.balanceResponse}/>
                )
            }
        }
        return(
            null
        )
    }

    renderContactsList = () => {
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
                            isSendMoney={false}
                            isRequestMoney={true}
                            />
                        )
                }
            }
        }
        
    }

    onContactSelected = (item,isMe) => {
        this.setState({selectedContact:item})
    }

    renderDetailsView = () => {
        if(this.state.selectedContact != null){
            return(
                <View>
                    <View style={styles.eachDetailView}>
                        <Text style={styles.labelText}>TO</Text>
                        <Text style={styles.valueText}>{this.state.selectedContact.Name}</Text>
                    </View>

                    <View style={styles.eachDetailView}>
                        <Text style={styles.labelText}>MOBILE</Text>
                        <Text style={styles.valueText}>{this.state.selectedContact.contactNumber}</Text>
                    </View>

                    <View style={styles.eachDetailView}>
                        <Text style={styles.labelText}>POINTS</Text>
                        <TextInput
                        value={this.state.points}
                        onChangeText={(text) => {
                            this.setState({points:text})
                        }}
                        keyboardType='numeric'
                        style={[styles.valueText,{width:'70%',textAlign:'right',height:40}]}
                        placeholder='Enter points'
                        />
                    </View>

                    <View style={styles.eachDetailView}>
                        <Text style={styles.labelText}>MESSAGE</Text>
                        <TextInput
                        value={this.state.message}
                        onChangeText={(text) => {
                            this.setState({message:text})
                        }}
                        style={[styles.valueText,{width:'70%',textAlign:'right',height:40}]}
                        placeholder='Enter message'
                        />
                    </View>

                    <View style={styles.btnContainer} >
                        <YellowButton title='Transfer' navigate={() => { this.onTransferTapped() }} />
                    </View>

                </View>
            )
            
        }
    }

    onTransferTapped = () => {
        if(this.state.selectedContact != null){
            if(Number(this.state.points) > 0 && this.state.message.length > 1){
                const res = this.props.balanceResponse
                if(typeof(res) != 'undefined'){
                    if(typeof(res.Balance) != 'undefined'){
                        if(res.Balance != null){
                            if(Number(res.Balance) > this.state.points){
                                this.props.navigation.navigate('PointsTransferReview',{
                                    to:this.state.selectedContact.Name,
                                    mobile:this.state.selectedContact.contactNumber,
                                    points:this.state.points,
                                    message:this.state.message,
                                    item:this.state.selectedContact
                                })
                            }else{
                                alert(`You don't have sufficient balance`)
                            }
                        }
                    }
                }
            }else{
                alert('Pleas enter missing details')
            }
        }
    }


    render() {
        if(this.props.loading || this.props.balanceLoading){
            return(
                <ActivityIndicatorComponent></ActivityIndicatorComponent>
            )
        }
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS == 'ios' && 50}  behavior={Platform.OS == 'ios' && 'position'} style={styles.container}>
                
                <ScrollView contentContainerStyle={{width:'100%'}}>
                    {this.renderBalanceView()}
                    <View style={styles.messageHolder}>
                        <Text style={styles.messageText}>Reward a collegue for a job well done or simply help a friend to their reward quicker with Points Transfer.</Text>
                    </View>
                    <Text style={[styles.messageText,{marginLeft:20}]}>Send points to someone's mWallet</Text>
                    <View style={{marginTop:10}}>
                        {this.renderContactsList()}
                    </View>

                    {this.renderDetailsView()}
                    
                </ScrollView>
            </KeyboardAvoidingView>
                    
        );
    }
}
export default connect(mapStateToProps)(PointsTransferPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    messageHolder:{
        margin:15,
        width:getDeviceWidth() - 30,
        backgroundColor:colors.White,
        padding:10,
        borderWidth:1,
        borderColor:colors.APP_GREEN
    },
    messageText:{
        fontFamily:fonts.bold,
        fontSize:14
    },
    eachDetailView:{
        width:getDeviceWidth() - 20,
        marginLeft:10,
        marginRight:10,
        height:50,
        backgroundColor:colors.White,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:10,
        paddingRight:10,
        marginBottom:2,
        shadowOffset:{width:1,height:1},
        shadowRadius:1,
        shadowOpacity:0.2,
        elevation:5
    },
    labelText:{
        fontFamily:fonts.bold,
        fontSize:15,
        color:colors.APP_GREEN,
        opacity:0.5
    },
    valueText:{
        fontFamily:fonts.bold,
        fontSize:15,
        color:colors.APP_GREEN,
    },
    btnContainer: {
        width: getDeviceWidth(),
        alignItems: "center",
        marginTop:20,
        marginBottom:10
    },
});
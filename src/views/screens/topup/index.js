import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    StyleSheet
} from "react-native";
import fonts from "../../../assets/fonts";
import { getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";
import {connect} from 'react-redux'
import { ProfileActionCreator } from "../../../redux/actionCreators/app/profile";
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import { RewardsActionCreator } from "../../../redux/actionCreators/app/rewards";
import DetailsView from "../../../components/topup/detailsView";
import Contacts from 'react-native-contacts';
import ContactsView from "../../../components/rewards/contactsView";


const mapStateToProps =(state) => ({
    balanceLoading:state.GetPointsBalanceReducer.loading,
    balanceRequest:state.GetPointsBalanceReducer.request,
    balanceResponse:state.GetPointsBalanceReducer.response,

    loading:state.GetMatchedContactsReducer.loading,
    request:state.GetMatchedContactsReducer.request,
    response:state.GetMatchedContactsReducer.response,
})

class TopUp extends Component {

    constructor(props){
        super(props)
        this.state = {
            contacts:[],
            showIndicator:false,
            selectedContact:null,
            isMe:false,
            isPlusTapped:null,
            isSendMoneyTapped:null,
            isRequestMoneyTapped:null
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({selectedContact:null,isMe:false,isSendMoneyTapped:null,isRequestMoneyTapped:null})
            if(Platform.OS == 'ios'){
                Contacts.checkPermission().then(permission => {
                    // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
                    if (permission === 'undefined') {
                      Contacts.requestPermission().then(permission => {
                        if (permission === 'authorized') {
                            this.fetchContacts()
                          }
                          if (permission === 'denied') {
                              alert('Please allow contacts permission from settings')
                          }
                      })
                    }
                    if (permission === 'authorized') {
                        this.fetchContacts()
                    }
                    if (permission === 'denied') {
                        alert('Please allow contacts permission from settings')
                    }
                  })
            }else{
                this.requestContactPermissionAndroid()
            }
            

              this.fetchbalance()

          });
    }

    fetchbalance = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(RewardsActionCreator.getPointsBalance(res))
            }
        })
    }

    requestContactPermissionAndroid = async() => {
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
              {
                title: "mWallt App needs Contact Permission",
                message:
                  "mWallt App needs Contact Permission " +
                  "so you can send gifts to your contacts",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.fetchContacts()
            } else {
              alert("Contacts permission denied");
            }
          } catch (err) {
            console.warn(err);
          }
    }

    fetchContacts = () => {
        let contactDetails = []
        this.setState({showIndicator:true})
        Contacts.getAll().then(contacts => {
            if(typeof(contacts) != 'undefined'){
                if(contacts.length > 0){
                    this.setState({showIndicator:false}) 
                    contacts.forEach(contact => {
                        let numbers = []
                        if(typeof(contact.phoneNumbers) != 'undefined'){
                            if(contact.phoneNumbers.length > 0){
                                contact.phoneNumbers.forEach(number => {
                                    let num = number.number.replace(/\D/g,'')
                                    if(num.length < 4){
                                        num = num + '1234'
                                    }
                                    if(num != ''){
                                        numbers.push(num)
                                    }
                                    
                                })
                            }
                        }

                        let name = contact.givenName + " " + contact.middleName + " " + contact.familyName
                        const element = {
                            Name:name.trim(),
                            contactNumber:numbers
                        }

                        contactDetails.push(element)                        
                    })
                    this.setState({contacts:contactDetails},() => {
                        this.fetchMatchedContacts()
                    })
                }
            }

          })
    }

    fetchMatchedContacts = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(RewardsActionCreator.getMatchedContacts(res,this.state.contacts))
            }
        })
    }

    onAddMoneyTapped = () => {
        this.props.navigation.navigate('TopUpAddMoney')
    }

    sendMoneyTapped = () => {
        // this.props.navigation.navigate('TopUpSendMoney',{contacts:this.state.contacts})
        this.setState({isSendMoneyTapped:true,isRequestMoneyTapped:false})
    }

    requestMoneyTapped = () => {
        //this.props.navigation.navigate('TopUpRequestMoney',{contacts:this.state.contacts})
        this.setState({isRequestMoneyTapped:true,isSendMoneyTapped:false})
    }

    onContactSelected = (item,isMe) => {
        if(item != null && !isMe){
            this.setState({selectedContact:item,isMe:false},() => {
                if(this.state.isSendMoneyTapped){
                    this.props.navigation.navigate('TopUpSendMoney',
                    {
                        contacts:this.state.contacts,
                        selectedContact:item,
                        isMe:false
    
                    })
                }else{
                    this.props.navigation.navigate('TopUpRequestMoney',
                    {
                        contacts:this.state.contacts,
                        selectedContact:item,
                        isMe:false
    
                    })
                }
                
            })
        }
        if(isMe){
            this.setState({isMe:true,selectedContact:null},() => {
                this.props.navigation.navigate('TopUpSendMoney',
                {
                    contacts:this.state.contacts,
                    selectedContact:null,
                    isMe:true

                })
            })
        }
    }

    onPlusTapped = (item) => {
        
    }

    renderMatchedContacts = () => {
        const response = this.props.response
        
        if(typeof(response) != 'undefined'){
            if(typeof(response.contactDetails) != 'undefined'){
                if(response.contactDetails != null && (this.state.isSendMoneyTapped || this.state.isRequestMoneyTapped)){
                        return(
                            <ContactsView
                            contacts={response.contactDetails}
                            onContactSelected={this.onContactSelected}
                            onPlusTapped={this.onPlusTapped}
                            myContact={response}
                            isCheckout={false}
                            isSendMoney={this.state.isSendMoneyTapped}
                            isRequestMoney={this.state.isRequestMoneyTapped}
                            />
                        )
                    
                }
            }
        }
        
    }

    render() {
        return (
            <View style={styles.container}>

                <ActivityIndicatorModal
                isVisible={this.props.balanceLoading || this.state.showIndicator || this.props.loading}/>

                <View style={{padding:10}}>
                    {this.renderMatchedContacts()}
                </View>
                <View style={{justifyContent:'center',flex:1}}>
                    <DetailsView
                    topUpScreen={1}
                    onAddMoneyTapped={this.onAddMoneyTapped}
                    sendMoneyTapped={this.sendMoneyTapped}
                    requestMoneyTapped={this.requestMoneyTapped}/>
                </View>
                    
            </View>
        );
    }
}
export default connect(mapStateToProps) (TopUp);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor:colors.White,
        paddingTop:30
    },
    descText:{
        fontFamily:fonts.bold,
        textAlign:'center',
        fontSize:14,
        color:'grey'
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
    buttonImage:{
        width:40,
        height:40,
        borderRadius:20,
        marginBottom:5,
        backgroundColor:colors.LightGray,
        justifyContent:'center',
        alignItems:'center'
    }
});
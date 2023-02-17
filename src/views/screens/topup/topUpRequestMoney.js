import React, { Component } from "react";
import { 
    View,
    Text,
    Platform,
    Image,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet
} from "react-native";
import {connect} from 'react-redux'
import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import { RewardsActionCreator } from "../../../redux/actionCreators/app/rewards";
import colors from "../../../utils/colors";
import fonts from "../../../assets/fonts";
import { getDeviceWidth } from "../../../utils";
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import ContactsView from "../../../components/rewards/contactsView";
import DetailsView from "../../../components/topup/detailsView";
import YellowButton from "../../../components/button";
import ContactsViewMultiSelect from "../../../components/rewards/contactsViewMultiSelect";
import { FlatList } from "react-native-gesture-handler";
import { TopUpActionCreator } from "../../../redux/actionCreators/app/topup";
import ImageComponent from "../../../components/imageComponent/imageComponent";
import { ChatActionCreator } from "../../../redux/actionCreators/app/chat";


const mapStateToProps =(state) => ({
    loading:state.GetMatchedContactsReducer.loading,
    request:state.GetMatchedContactsReducer.request,
    response:state.GetMatchedContactsReducer.response,

    balanceLoading:state.GetPointsBalanceReducer.loading,
    balanceRequest:state.GetPointsBalanceReducer.request,
    balanceResponse:state.GetPointsBalanceReducer.response,

    requestMoneyLoading:state.RequestMoneyTopUpReducer.loading,
    requestMoneyRequest:state.RequestMoneyTopUpReducer.request,
    requestMoneyResponse:state.RequestMoneyTopUpReducer.response,
})

class TopUpRequestMoney extends Component {

    constructor(props){
        super(props)
        this.state = {
            contacts:this.props.route.params.contacts,
            selectedContact:this.props.route.params.selectedContact,
            selectedContactsMulti:[],
            isPlusTapped:null,
            shouldReload:false,
            matchedContacts:[],
            totalPay:'',
            isSplitTapped:false,
            textInputs:[]
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({shouldReload:true})
            this.fetchMatchedContacts()
          });
    }

    componentWillUnmount() {
        this.setState({selectedContact:null})
        this._unsubscribe();
    }

    componentDidUpdate(prevProps){
        const res = this.props.response
        if(typeof(res) != 'undefined' && this.state.shouldReload){
            
                if(typeof(res.contactNumber) != 'undefined'){
                    if(typeof(res.contactDetails) != 'undefined'){
                        if(res.contactDetails.length > 0){
                            res.contactDetails.forEach(con => {
                                con.selected = false
                            })
                        }
                        this.setState({matchedContacts:res.contactDetails,shouldReload:false})
                    }
                }
        }

        const response = this.props.requestMoneyResponse
        if(typeof(response) != 'undefined' && !this.props.requestMoneyLoading){
            if(Object.keys(response).length > 0){
                if(typeof(response.Status) != 'undefined'){
                    if(response.Status == 'Requested'){
                        if(typeof(response.Contacts) != 'undefined'){
                            if(response.Contacts != null){
                                if(response.Contacts.length > 0){
                                    let mobileArray = []
                                    response.Contacts.forEach(con => {
                                        
                                        const mob = {
                                            Mobile:con.Mobile_Number
                                        }
                                        mobileArray.push(mob)
                                    })
                                    this.props.dispatch(ChatActionCreator.resetGetChat())
                                    this.props.dispatch(TopUpActionCreator.resetRequestMoney())
                                    this.props.navigation.navigate('ChatMessagePage',{ReceiversArray:mobileArray,isFromRequestMoney:true,onBack:this.onBack})
                                }
                            }
                        }
                        this.props.dispatch(TopUpActionCreator.resetRequestMoney())
                    }
                }
            }
        }
    }

    onBack = () => {
        this.props.navigation.goBack()
    }

    fetchMatchedContacts = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(RewardsActionCreator.getMatchedContacts(res,this.props.route.params.contacts))
            }
        })
    }

    onContactSelected = (item) => {
        if(item != null){
            this.setState({selectedContact:item,isSplitTapped:false})
        }
    }

    onRequestTapped = () => {
        //alert(JSON.stringify(this.state.selectedContactsMulti) + '\n\n' + JSON.stringify(this.state.selectedContact))
        if(Number(this.state.totalPay) > 0){
            let contacts = []
            if(this.state.isSplitTapped){
                if(this.state.selectedContactsMulti.length > 0){
                    this.state.selectedContactsMulti.forEach(con => {
                        const ele = {
                            Name:con.Name,
                            Mobile_Number:con.contactNumber,
                            Amount: this.state.textInputs[this.state.selectedContactsMulti.indexOf(con)].Amount //(Number(this.state.totalPay)) / this.state.selectedContactsMulti.length
                        }
                        contacts.push(ele)
                    })
                }

            }else{
                if(this.state.selectedContact != null){
                    const ele = {
                        Name: this.state.selectedContact.Name,
                        Mobile_Number: this.state.selectedContact.contactNumber,
                        Amount:this.state.totalPay
                    }
                    contacts.push(ele)
                }
            }

            //alert(JSON.stringify(contacts) + '     \n\n' + this.state.totalPay)

            if(contacts.length > 0){
                EncryptedStorage.getItem('userId',(res,err) => {
                    if(res){
                        this.props.dispatch(TopUpActionCreator.requestMoney(res,this.state.totalPay,contacts))
                    }
                })
                
            }
        }
    }

    renderSingleRequest = () => {
        if(this.state.selectedContact != null && !this.state.isSplitTapped){
            return(
                <View>
                    <View style={styles.valuesView}>
                        <Text style={styles.payText}>REQUEST</Text>
                        <Text style={[styles.payText,{color:colors.BLACK}]}>{this.state.selectedContact.Name}</Text>
                    </View>
                    <View style={styles.valuesView}>
                        <Text style={styles.payText}>MOBILE</Text>
                        <Text style={[styles.payText,{color:colors.BLACK}]}>{this.state.selectedContact.contactNumber}</Text>
                    </View>
                </View>
            )
        }
    }

    _keyExtractor = (item,index) => item.contactNumber.toString()
    _renderItem = ({item,index}) => {
        //alert(JSON.stringify(this.state.textInputs))
        return(
            <View style={{padding:5,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={[styles.descText,{width:'50%',textAlign:'left'}]}>{item.Name}</Text>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                    <Text style={[styles.descText,{marginRight:5}]}>$</Text>
                    {  typeof(this.state.textInputs[index]) != 'undefined' &&
                    <TextInput
                    keyboardType='decimal-pad'
                    style={[styles.descText,{borderBottomWidth:1,borderBottomColor:colors.APP_GREEN,width:'50%',height:40}]}
                    //value={(Number(this.state.totalPay) / this.state.selectedContactsMulti.length).toFixed(2).toString()}
                    value={
                        this.state.textInputs[index].isEditing ? Number(this.state.textInputs[index].Amount).toString() :  Number(this.state.textInputs[index].Amount).toString()
                    }
                    onChangeText={(text) => {
                        let inputs = this.state.textInputs
                        let ele = inputs[index]
                        ele.isEditing = true
                        ele.Amount = Number(text)
                        this.setState({textInputs:inputs},() => {
                            if(inputs.length > 0){
                                let totalAmount = 0
                                inputs.forEach(input => {
                                    totalAmount = totalAmount + Number(input.Amount)
                                })
                                this.setState({totalPay:totalAmount.toFixed(2)})
                            }
                        })
                    }}
                    /> }
                </View>
                
            </View>
        )
    }

    renderSelectedContactImageMulti = (item) => {
        if(typeof(item.Image) != 'undefined'){
            if(item.Image != null){
                return(
                    <ImageComponent
                    resizeMode={null}
                    style={{width:30,height:30,borderRadius:15}}
                    imageUrl={item.Image}
                    />
                )
            }
        }
        return(
                <Text style={[styles.name,{color:colors.White,fontSize:16}]}>{item.nameToDisplay}</Text>
        )
    }

    renderMultiRequest = () => {
        if(this.state.selectedContactsMulti.length > 0 && this.state.isSplitTapped && Number(this.state.totalPay) > 0){
            return(
                <View style={{alignSelf:'center',width:'100%'}}>
                    <ScrollView horizontal 
                    contentContainerStyle={{justifyContent:'center',alignItems:'center',alignSelf:'center'}} 
                    style={{maxHeight:50,paddingLeft:15,paddingRight:15,alignSelf:'center',}}>
                        {this.state.selectedContactsMulti.map((item,index) => {
                            return(
                                <View style={{justifyContent:'center',alignItems:'center',marginTop:5,height:30,width:30,borderRadius:15,backgroundColor:colors.BLUE,marginLeft:-10}}>
                                    {this.renderSelectedContactImageMulti(item)}
                                </View>
                            )
                        })}
                     </ScrollView>

                    <FlatList
                    style={{margin:5,borderWidth:1,borderColor:colors.APP_GREEN}}
                    data={this.state.selectedContactsMulti}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    />
                </View>
            )
        }
    }

    renderPerson = () => {
        if(!this.state.isSplitTapped && this.state.selectedContact != null){
            if(typeof(this.state.selectedContact.Image) != 'undefined'){
                if(this.state.selectedContact.Image != null){
                    return(
                        <View style={{width:40,height:40,borderRadius:20,alignSelf:'center',margin:10,justifyContent:'center',alignItems:'center',backgroundColor:colors.BLUE}}>
                            <ImageComponent
                            resizeMode={null}
                            style={{width:40,height:40,borderRadius:20}}
                            imageUrl={this.state.selectedContact.Image}
                            />
                        </View>
                    ) 
                }
            }
            return(
                <View style={{width:40,height:40,borderRadius:20,alignSelf:'center',margin:10,justifyContent:'center',alignItems:'center',backgroundColor:colors.BLUE}}>
                    <Text style={[styles.name,{color:colors.White,fontSize:18}]}>{this.state.selectedContact.nameToDisplay}</Text>
                </View>
            )
        }
    }

    renderSendMoneyView = () => {
            return(
                <View style={styles.detailsView}>
                    {this.renderPerson()}
                    <View style={styles.buttonHolder}>
                        <TouchableOpacity
                        onPress={() => {
                            this.setState({isSplitTapped:true,totalPay:''})
                        }}
                        style={this.state.isSplitTapped != null ? this.state.isSplitTapped ? styles.splitButtonSelected : styles.splitButton  : styles.splitButton}>
                            <Text style={this.state.isSplitTapped != null ? this.state.isSplitTapped ? [styles.descText,{color:colors.WHITE}] : [styles.descText,{color:colors.APP_GREEN}] : [styles.descText,{color:colors.APP_GREEN}]}>Split</Text>
                        </TouchableOpacity>
                    </View>

                    {this.renderSingleRequest()}

                    <View style={[styles.valuesView]}>
                        <Text style={styles.payText}>TOTAL PAY $</Text>
                        <TextInput
                        style={{width:'40%',height:40,textAlign:'right',fontFamily:fonts.bold,fontSize:16}}
                        value={this.state.totalPay.toString()}
                        keyboardType='numeric'
                        placeholder='Amount...'
                        onChangeText={(text) => {
                            this.setState({totalPay:text},() => {
                                let selectedContacts = this.state.selectedContactsMulti.slice(0)
                                if(selectedContacts.length > 0){
                                    const total = this.state.totalPay
                                    let textInputs = []
                                    if(selectedContacts.length > 0){
                                        selectedContacts.forEach(con => {
                                            const ele = {
                                                Amount: (Number(total) / selectedContacts.length).toFixed(2),
                                                isEditing:false
                                            }
                                            textInputs.push(ele)
                                        })
                                        this.setState({textInputs:textInputs})
                                    }
                                }
                            })
                            //this.setState({shouldReload:true,matchedContacts:[],textInputs:[],selectedContactsMulti:[]})
                        }}
                        onBlur={() => {
                            //this.setState({shouldReload:true,matchedContacts:[],textInputs:[],selectedContactsMulti:[]})
                        }}
                        />
                    </View>

                    
                    {this.renderMultiRequest()}

                    
                    <View style={styles.btnContainer} >
                        <YellowButton title={'Request'} navigate={() => { this.onRequestTapped() }} />
                    </View>

                </View>
            )
    }

    onMultiContactSelected = (item,value) => {
        if(item != null){
            let selectedContacts = []
            let contacts = this.state.matchedContacts.slice(0)
            if(contacts.length > 0){
                contacts.forEach(contact => {
                    if(contact.contactNumber == item.contactNumber){
                        contact.selected = value
                    }
                    if(contact.selected){
                        selectedContacts.push(contact)
                    }
                })

                if(selectedContacts.length > 0){
                    const total = this.state.totalPay
                    let textInputs = []
                    if(selectedContacts.length > 0){
                        selectedContacts.forEach(con => {
                            const ele = {
                                Amount: (Number(total) / selectedContacts.length).toFixed(2),
                                isEditing:false
                            }
                            textInputs.push(ele)
                        })
                        this.setState({textInputs:textInputs})
                    }
                }

                this.setState({matchedContacts:contacts,selectedContactsMulti:selectedContacts},() => {
                    
                    
                })
            }
        }
    }

    renderMultiSelectMatchedContacts = () => {
        const response = this.props.response
        if(typeof(response) != 'undefined'){
            if(typeof(response.contactDetails) != 'undefined'){
                if(response.contactDetails != null){
                    if(response.contactDetails.length > 0){
                        if(this.state.matchedContacts.length > 0 && this.state.isSplitTapped && Number(this.state.totalPay) > 0){
                            return(
                                <ContactsViewMultiSelect
                                contacts={this.state.matchedContacts}
                                onMultiContactSelected={this.onMultiContactSelected}
                                onPlusTapped={this.onPlusTapped}
                                myContact={response}
                                isCheckout={false}
                                isSendMoney={true}
                                isRequestMoney={true}
                                />
                            )
                        }
                        
                    }
                }
            }
        }
        
    }

    renderMatchedContacts = () => {
        if(!this.state.isSplitTapped){
            const response = this.props.response
        if(typeof(response) != 'undefined'){
            if(typeof(response.contactDetails) != 'undefined'){
                if(response.contactDetails != null){
                        if(Number(this.state.totalPay) > 0){
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
        }
    }

    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={100} behavior={Platform.OS == 'ios' && 'padding'} style={styles.container}>
                <ScrollView>
                    <ActivityIndicatorModal 
                    isVisible={this.props.loading || this.props.balanceLoading || 
                        this.props.requestMoneyLoading}
                    />

                    {this.renderMultiSelectMatchedContacts()}
                    {this.renderSendMoneyView()}
                </ScrollView>
                
            </KeyboardAvoidingView>
        );
    }
}
export default connect(mapStateToProps) (TopUpRequestMoney);


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
        fontSize:16
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
    buttonHolder:{
        padding:10,
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
    },
    splitButton:{
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        backgroundColor:colors.White,
        borderColor:colors.APP_GREEN,
        borderWidth:1,
        width:'49%'
    },
    splitButtonSelected:{
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        backgroundColor:colors.YELLOW,
        width:'49%'
    },
    name:{
        color:colors.White,
        fontSize:16,
        fontFamily:fonts.bold,
        textAlign:'center'
      }
});
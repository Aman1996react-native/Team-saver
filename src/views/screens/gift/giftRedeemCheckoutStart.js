import { NetInfoCellularGeneration } from "@react-native-community/netinfo";
import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    StyleSheet,
    Modal
} from "react-native";
import fonts from "../../../assets/fonts";
import BalanceView from "../../../components/rewards/balanceView";
import ContactsView from "../../../components/rewards/contactsView";
import DenominationModal from "../../../components/rewards/denominationModal";
import { getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RewardsActionCreator } from "../../../redux/actionCreators/app/rewards";
import YellowButton from "../../../components/button";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import TermsAndConditionsModal from "../../../components/termsAndConditionsModal";
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import TransactionSuccessModalPOS from "../../../components/rewards/transactionSuccessModalPOS";
import { AuthActionCreator } from "../../../redux/actionCreators/auth";
import ActivityIndicatorComponent from "../../../components/activityIndicator";
import Geolocation from '@react-native-community/geolocation';
import ImageComponent from "../../../components/imageComponent/imageComponent";
import Config from "react-native-config";
import { CheckAccessTokenExpiryTime } from "../../../redux/actionCreators/checkAccessTokenExpiry";





const mapStateToProps =(state) => ({
    
    loading:state.GetMatchedContactsReducer.loading,
    request:state.GetMatchedContactsReducer.request,
    response:state.GetMatchedContactsReducer.response,

    balanceLoading:state.GetPointsBalanceReducer.loading,
    balanceRequest:state.GetPointsBalanceReducer.request,
    balanceResponse:state.GetPointsBalanceReducer.response,

    purchaseFoodPosLoading:state.PurchaseFoodPOSReducer.loading,
    purchaseFoodPosRequest:state.PurchaseFoodPOSReducer.request,
    purchaseFoodPosResponse:state.PurchaseFoodPOSReducer.response,
  
  })



class GiftRedeemCheckoutStart extends Component {

    constructor(props){
        super(props)
        this.state = {
            isDenominationModalVisible:false,
            selectedItem:null,
            isMe: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? true :null,
            isDeliverySelector:false,
            delivery:'Select delivery',
            desc:'',
            isPlusTapped:false,
            mobileNumber:'',
            name:'',
            selectedContact:null,
            selectedDate:'',
            selectedDatemmddyyy:'',
            showDatePicker:false,
            initialTime:new Date(),
            showTCModal:false,
            selectedMenu: this.props.route.params.selectedMenu,
            showTransactionModal:false
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', async() => {
            await CheckAccessTokenExpiryTime('GiftCheckoutStartPage')
            this.fetchMatchedContacts()
          });
          

    }

    componentDidUpdate(prevProps){
        const res = this.props.purchaseFoodPosResponse
        if(typeof(res) != 'undefined' && !this.props.purchaseFoodPosLoading){
            if(Object.keys(res).length > 0){
                if(typeof(res.Status) != 'undefined'){
                    if(res.Status == 'Success'){
                        this.setState({showTransactionModal:true})
                        this.props.dispatch(RewardsActionCreator.resetPurchaseFoodAndWine())

                      }else{
                        showAlertWithCallBack('Failed to purchase. Please try again.',() => {
                            this.props.navigation.goBack()
                            this.props.dispatch(RewardsActionCreator.resetPurchaseFoodAndWine())
                        })
                      }
                }
            }
        }else{
           
        }
    }

    componentWillUnmount() {
        this.setState({selectedContact:null})
        this._unsubscribe();
    }

    fetchMatchedContacts = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(RewardsActionCreator.getMatchedContacts(res,this.props.route.params.contacts))
                this.props.dispatch(RewardsActionCreator.getPointsBalance(res))
            }
        })
    }

    renderBalanceView = () => {
        if(this.state.showDatePicker){
            return null
        }
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

    renderSelectedMenu = () => {
        const selectedMenus = this.state.selectedMenu
        if(typeof(selectedMenus) != 'undefined'){
            if(selectedMenus.length > 0){
                return(
                    <ScrollView>
                        {selectedMenus.map((item,index) => {
                            return(
                                <TouchableOpacity>
                                    <TouchableOpacity
                                    style={{alignSelf:'flex-end',paddingRight:10,}}
                                    onPress={() => {
                                        let menus = this.state.selectedMenu
                                        menus.splice(index,1)
                                        this.props.route.params.onComingBack(menus)
                                        this.setState({selectedMenu:menus},() => {
                                            if(this.state.selectedMenu.length < 1){
                                                this.props.navigation.goBack()
                                            }
                                        })
                                        
                                    }}>
                                    <Image style={{width:25,height:25,marginBottom:-3,tintColor:colors.APP_GREEN}} source={require('../../../assets/images/clear.png')}/>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                style={[styles.touchableOpacity,{width:getDeviceWidth() - 40,marginLeft:20,marginRight:20,marginBottom:3,paddingLeft:5}]}
                                onPress={() => {
                                }}>
                                    
                                    <View style={{width:'80%',flexDirection:'row',alignItems:'center'}}>
                                        {/*<Image style={{width:30,height:30,borderRadius:15,marginLeft:5,marginRight:5,borderColor:colors.APP_GREEN,backgroundColor:'white'}}/> */}
                                        <View style={{alignItems:'flex-start',justifyContent:'center'}}>
                                            <Text numberOfLines={4} style={styles.points}>{item.Title}</Text>
                                            {item.Description != null &&
                                            <Text numberOfLines={10} style={[styles.descriptionText,{width:getDeviceWidth()/1.5}]}>{item.Description}</Text>}
                                        </View>
                                    </View>

                                    <View style={{width:'20%',paddingRight:5,alignItems:'flex-end'}}>
                                        <Text style={{fontFamily:fonts.heavy,color:colors.APP_GREEN,fontSize:14,}}>{item.Points.toString()} Points</Text>
                                    </View>
                
                                </TouchableOpacity>
                                </TouchableOpacity>
                                
                            )
                        })}
                        <TouchableOpacity 
                        onPress={() => {
                            this.props.navigation.goBack()
                        }}
                        style={{backgroundColor:colors.White,margin:20,width:getDeviceWidth() - 40,height:60,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                            <Image resizeMode='center' style={{width:15,marginRight:5,tintColor:colors.APP_GREEN,height:15}} source={require('../../../assets/images/plus.png')}/>
                            <Text style={{textAlign:'center',fontFamily:fonts.bold,color:colors.APP_GREEN,fontSize:14}}>Add More</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )
            }
        }
        
    }

    renderMerchantCard = () => {
        if(this.state.showDatePicker){
            return null
        }
        if(this.props.route.params.isFoodAndWine){
            return(
                <View>
                    {this.renderSelectedMenu()}
                </View>
            )
            
        }
        if(typeof(this.props.route.params.item.OfferDetails) != 'undefined'){
            if(this.props.route.params.item.OfferDetails.length > 1){
                return(
                    <View style={styles.merchantCard}>
                        <View style={styles.nameAndImageHolder}>
                            <ImageComponent
                            resizeMode={'contain'}
                            style={{margin:10,width:80,height:80,marginRight:20}}
                            imageUrl={this.props.route.params.item.Merchant_Image}
                            />
                            
                            <Text numberOfLines={10} style={[styles.nameText,{marginRight:100}]}>{this.props.route.params.item.Merchant_Name}</Text>
                        </View>
                        <Text numberOfLines={10} style={styles.descText}>{this.props.route.params.item.OfferDetails[0].Details}</Text>
                        <View style={{width:getDeviceWidth() - 20,padding:10}}>
                            <YellowButton title='Terms'
                            navigate={() => {
                                if(this.props.route.params.item.OfferDetails[0].Terms != null){
                                    this.setState({showTCModal:true})
                                }
                                
                            }}
                            textStyle={{fontSize:14}}
                            style={{width:'20%',height:30,alignSelf:'flex-end'}}
                            />
                        </View>
                    </View>
                )
            }
        }
        
    }

    renderDenominationView = () => {
        if(this.props.route.params.isFoodAndWine){
            return null
        }
        return(
            <TouchableOpacity style={styles.denominationHolder}
            onPress={() => {
                this.setState({isDenominationModalVisible:true,isDeliverySelector:false})
            }}>
                <TextInput
                style={[styles.textInput,{textAlign:'left'}]}
                onTouchStart={() => {
                    this.setState({isDenominationModalVisible:true,isDeliverySelector:false})
                }}
                editable={false}
                value={this.state.selectedItem == null ? '' : '$' + this.state.selectedItem.Amount}
                placeholder='Select an amount'
                />
                {/* <Text style={styles.textInput}>${this.state.selectedAmount}</Text> */}
                <Image style={{width:18,height:18}} source={require('../../../assets/images/down_arrow.png')}/>
            </TouchableOpacity>
        )
    }

    onBackdropPressed = () => {
        this.setState({isDenominationModalVisible:false,showTCModal:false})
    }

    onAmountSelected = (item,isDelivery) => {
        this.setState({showDatePicker:false})
        this.setState({isDenominationModalVisible:false},() => {
            if(isDelivery){
                this.setState({delivery:item})
            }else{
                this.setState({selectedItem:item})
            }
            
        })
    }

    renderDemominationModal = () =>{
        if(this.props.route.params.isFoodAndWine){
            return(
                <DenominationModal 
                onBackdropPressed={this.onBackdropPressed}
                isDelivery={true}
                deliveryArray={['Later','Now']}
                isGiftCard={this.props.route.params.isGiftCard}
                isFoodAndWine={this.props.route.params.isFoodAndWine}
                onAmountSelected={this.onAmountSelected}
                isVisible={this.state.isDenominationModalVisible}/>
            )
        }
        return(
            <DenominationModal 
            onBackdropPressed={this.onBackdropPressed}
            denominationArray={this.props.route.params.denominationArray}
            onAmountSelected={this.onAmountSelected} 
            isDelivery={this.state.isDeliverySelector}
            deliveryArray={['Later','Now']}
            isGiftCard={this.props.route.params.isGiftCard}
            isFoodAndWine={this.props.route.params.isFoodAndWine}
            isVisible={this.state.isDenominationModalVisible && this.props.route.params.denominationArray.length > 0}/>
        )
    }

    renderContactsList = () => {
        if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
            return null
        }
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
                            isCheckout={true}
                            isSendMoney={false}
                            isRequestMoney={false}
                            />
                        )
                }
            }
        }
        
    }

    onContactSelected = (item,isMe) => {
        this.setState({isMe:isMe,isPlusTapped:false})
        this.setState({showDatePicker:false})
        if(isMe){
            this.setState({selectedContact:null})
        }else{
            this.setState({selectedContact:item})
        }
    }

    onPlusTapped = () => {
        this.setState({isPlusTapped:true,isMe:false,selectedContact:null})
        this.setState({showDatePicker:false})
    }

    renderDeliveryView = () => {
        if(this.props.route.params.isGiftCard){
            if(this.state.isMe || this.state.isMe == null || this.state.selectedItem == null){
                return null
            }
        }

        if(this.props.route.params.isFoodAndWine){
            if(this.state.isMe || this.state.isMe == null){
                return null
            }
        }
        
        return(
            <TouchableOpacity style={[styles.pointsView,{marginBottom:20}]}
            onPress={() =>{
                this.setState({isDenominationModalVisible:true,isDeliverySelector:true})
            }}>
                <Text style={styles.totalPayText}>Delivery</Text>
                <View style={{justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
                    <Text style={styles.pointsText}>{this.state.delivery}</Text>
                    <Image style={{width:18,height:18,marginLeft:5}} source={require('../../../assets/images/down_arrow.png')}/>
                </View>
                
            </TouchableOpacity>
        )
    }

    rendeDateView = () => {
        if(this.props.route.params.isGiftCard){
            if(this.state.isMe || this.state.isMe == null || this.state.selectedItem == null || this.state.delivery != 'Later'){
                return null
            }
        }
        if(this.props.route.params.isFoodAndWine){
            if(this.state.isMe || this.state.isMe == null || this.state.delivery != 'Later'){
                return null
            }
        }
        
        return(
            <TouchableOpacity style={styles.pointsView}
            onPress={() => {
                this.setState({showDatePicker:true})
            }}
            >
                <Text style={styles.totalPayText}>Date</Text>
                <TextInput
                onTouchStart={() => {
                    this.setState({showDatePicker:true})
                }}
                style={[styles.textInput,{fontSize:15,width:'60%',borderColor:'black',borderBottomWidth:0}]}
                value={this.state.selectedDate}
                editable={false}
                onChangeText={(text) => {
                    this.setState({desc:text})
                }}
                placeholder='Select Date..'
                />

                {/* <Text style={styles.pointsText}>{this.state.selectedDate.toString()}</Text> */}
            </TouchableOpacity>
        )
    }

    renderDescriptionView = () => {
        
        if(this.props.route.params.isGiftCard){
            if(this.state.isMe || this.state.isMe == null || this.state.selectedItem == null){
                return null
            }
        }
        if(this.props.route.params.isFoodAndWine){
            if(this.state.isMe || this.state.isMe == null || this.state.selectedMenu.length < 1){
                return null
            }
        }

        
        return(
            <View style={[styles.pointsView]}>
                <Text style={styles.totalPayText}>Description</Text>
                <TextInput
                style={[styles.textInput,{fontSize:15,width:'60%',borderColor:'black',borderBottomWidth:0}]}
                value={this.state.desc}
                onChangeText={(text) => {
                    this.setState({desc:text})
                }}
                placeholder='Add description here..'
                />
            </View>
        )
    }

    renderMobileNumberView = (isMobile) => {
        if(this.state.isPlusTapped){
            return(
                <View style={styles.pointsView}>
                    {isMobile ? <Text style={styles.totalPayText}>Mobile Number</Text>
                    :
                    <Text style={styles.totalPayText}>Gift to</Text>
                    }
                    
                    <TextInput
                    keyboardType={isMobile ? 'numeric' : 'default'}
                    returnKeyLabel='Done'
                    returnKeyType='default'
                    maxLength={11}
                    style={[styles.textInput,{fontSize:15,width:'60%',borderColor:'black',borderBottomWidth:0}]}
                    value={isMobile ? this.state.mobileNumber : this.state.name}
                    onChangeText={(text) => {
                        if(isMobile){
                            this.setState({mobileNumber:text.replace('.','')})
                        }else{
                            this.setState({name:text})
                        }
                        
                    }}
                    placeholder={isMobile ? 'Enter Mobile Number' : 'Enter Name'}
                />
                </View>
            )
        }
        return null
    }

    renderNameView = () => {
        return this.renderMobileNumberView(false)
    }

    renderPointsView = () => {
        if(this.props.route.params.isFoodAndWine){
            if(typeof(this.state.selectedMenu) != 'undefined'){
                if(this.state.selectedMenu.length > 0){
                    let points = 0
                    this.state.selectedMenu.forEach(menu => {
                        if(typeof(menu.Points) != 'undefined'){
                            points = points + menu.Points
                        }
                    })
                    return(
                        <View style={styles.pointsView}>
                            <Text style={styles.totalPayText}>Total Pay</Text>
                            <Text style={[styles.pointsText,{fontFamily:fonts.bold}]}>{points} Points</Text>
                        </View>
                    )
                }
            }
        }
        if(this.state.selectedItem == null){
            return null
        }
        return(
            <View style={styles.pointsView}>
                <Text style={styles.totalPayText}>Total Pay</Text>
                {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ?
                <Text style={[styles.pointsText,{fontFamily:fonts.bold}]}>${this.state.selectedItem.Amount}</Text>
                :
                <Text style={[styles.pointsText,{fontFamily:fonts.bold}]}>{this.state.selectedItem.Points} Points</Text>
                }
                
                
            </View>
        )
    }


    onRedeemtapped = () => {
        const item = this.props.route.params.item
        const selectedItem = this.state.selectedItem
        const selectedContact = this.state.selectedContact
        const response = this.props.response
        const delivery = this.state.delivery
        const date = this.state.selectedDate
        const datemmddyyyy = this.state.selectedDatemmddyyy
        const desc = this.state.desc
        const mobile = this.state.selectedContact != null ? this.state.selectedContact.contactNumber : this.state.isMe ? this.props.response.contactNumber : this.state.mobileNumber
        const name = selectedContact != null ? selectedContact.Name  : this.state.name
        let fromName = ''
        let fromMobile = ''

        if(typeof(response.contactNumber) != 'undefined'){
            fromMobile = response.contactNumber
        }
        if(typeof(response.Name) != 'undefined'){
            fromName = response.Name
        }

        let allowNavigation = false
        

        if(this.state.selectedItem != null || this.props.route.params.isFoodAndWine){
            
            if(this.state.isMe){
                allowNavigation = true
            }else{
                if(delivery != 'Select delivery'){
                    if(delivery == 'Later'){
                        if(this.state.isPlusTapped){
                            if(date.length > 3 && desc.length > 0 && mobile.length > 9 && name.length > 0){
                                allowNavigation = true
                            }
                        }else{
                            if(date.length > 3 && desc.length > 0){
                                allowNavigation = true
                            }
                        }
                    }else{
                        if(this.state.isPlusTapped){
                            if(desc.length > 0 && mobile.length > 9 && name.length > 0){
                                allowNavigation = true
                            }
                        }else{
                            if(desc.length > 0){
                                allowNavigation = true
                            }
                        }
                        
                    }
                }
            }
            
            if(this.state.isMe == null){
                allowNavigation = false
                alert('Please select a contact')
                return
            }

            if(typeof(this.props.balanceResponse) != 'undefined'){
                if(typeof(this.props.balanceResponse.Balance) != 'undefined'){
                    if(this.props.balanceResponse.Balance != null){
                        if(this.props.route.params.isFoodAndWine){
                            let selectedPoints = 0
                            let selectedPrice = 0
                            let selectedMenu = []
                            let cafeId = 0
                            if(this.state.selectedMenu.length > 0) {
                                cafeId = this.state.selectedMenu[0].CafeId
                                this.state.selectedMenu.forEach(men => {
                                    let ele = {
                                        MenuID:men.MenuID,
                                        Points:men.Points,
                                        Amount:men.Price
                                    }
                                    selectedMenu.push(ele)
                                    if(typeof(men.Points) != 'undefined'){
                                        selectedPoints = selectedPoints + men.Points
                                    }
                                    if(typeof(men.Price) != 'undefined'){
                                        selectedPrice = selectedPrice + men.Price
                                    }
                                })

                                if(selectedPoints > 0 && selectedPrice > 0 && selectedMenu.length > 0){
                                    if(Number(this.props.balanceResponse.Balance) > selectedPoints){
                                        if(allowNavigation){
                                            EncryptedStorage.getItem('userId',(res,err) => {
                                                if(res){
                                                    this.props.dispatch(RewardsActionCreator.purchaseFoodAndWine
                                                        (res,this.state.isMe,fromName,fromMobile,cafeId,selectedPoints,selectedPrice,datemmddyyyy,name,mobile,desc,selectedMenu))
                                                }
                                            })
                                            
                                        }else{
                                            alert('Please enter the missing details')
                                        }
                                    }else{
                                        alert(`You don't have sufficient balance to purchase gift card`)
                                    }
                                }else{

                                }

                            }
                        }else{
                            
                        if(Number(this.props.balanceResponse.Balance) > Number(selectedItem.Points)){
                            if(allowNavigation){
                                
                                this.props.navigation.navigate('GiftRedeemCheckoutFinal',
                                {
                                    item:item,
                                    selectedItem:selectedItem,
                                    selectedContact:selectedContact,
                                    response:response,
                                    delivery:delivery,
                                    date:date,
                                    datemmddyyyy:datemmddyyyy,
                                    desc:desc,
                                    mobile:mobile,
                                    name:name,
                                    isMe:this.state.isMe,
                                    isPlusTapped:this.state.isPlusTapped,
                                    fromMobile:fromMobile,
                                    fromName:fromName,
                                    isFoodAndWine:this.props.route.params.isFoodAndWine,
                                    isGiftCard:this.props.route.params.isGiftCard
                                })
                            }else{
                                alert('Please enter the missing details.')
                            }
                        }else{
                            alert(`You don't have sufficient balance to purchase gift card`)
                        }
                    }                        
                    }else{
                        alert(`You don't have sufficient balance to purchase gift card`)
                    }
                }else{
                    alert(`You don't have sufficient balance to purchase gift card`)
                }
            }else{
                alert(`You don't have sufficient balance to purchase gift card`)
            }
        }

        
        
    }


   onChange = (event, selectedDate) => {
    const day = selectedDate.getDate()
    const month = selectedDate.getMonth() + 1 
    const year = selectedDate.getFullYear()

    const dateSelected = `${String(day.toString()).padStart(2,'0')}/${String(month.toString()).padStart(2,'0')}/${year.toString()}`
    const dateSelectedmmddyyyy = `${String(month.toString()).padStart(2,'0') }/${String(day.toString()).padStart(2,'0') }/${year.toString()}`

    if(Platform.OS == 'ios'){
        this.setState({selectedDate:dateSelected,selectedDatemmddyyy:dateSelectedmmddyyyy,initialTime: selectedDate})
    }else{
        this.setState({showDatePicker:false},() => {
            this.setState({selectedDate:dateSelected,selectedDatemmddyyy:dateSelectedmmddyyyy,initialTime: selectedDate})
        })
    }
    
  };

  renderTCModal = () => {
      if(this.props.route.params.isFoodAndWine){
          return null
      }
      return(
          <TermsAndConditionsModal
          isVisible={this.state.showTCModal}
          onBackdropPressed={this.onBackdropPressed}
          item={this.props.route.params.item.OfferDetails[0]}
          />
      )
  }

  onOkayTapped = () => {
    this.setState({showTransactionModal:false},() => {
        // this.props.navigation.goBack()
        this.props.dispatch(AuthActionCreator.isFirstTime(false))
        this.props.dispatch(AuthActionCreator.isLoggedIn(true))
    })
  }

  onProceedTapped = () => {
    this.props.navigation.navigate('OfferPreview',{
         item: {TargetURL:'woolworths',LogoUrl:this.props.route.params.item.Merchant_Image},
         LogoUrl:this.props.route.params.item.Merchant_Image
        })
  }

    render() {
        
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={Platform.OS == 'ios' && 50}  behavior={Platform.OS == 'ios' && 'position'} style={styles.container}>
                <TransactionSuccessModalPOS 
                isVisible= {this.state.showTransactionModal}
                selectedContactName={this.state.selectedContact != null ? this.state.selectedContact.Name  : this.state.name}
                isMe={this.state.isMe}
                isPlusTapped={this.state.isPlusTapped}
                onOkayTapped={this.onOkayTapped}
                isFoodAndWine={this.props.route.params.isFoodAndWine}
                isGiftCard={this.props.route.params.isGiftCard}
                selectedMenu={this.state.selectedMenu}
                selectedContact={this.state.selectedContact}
                response={this.props.response}
                />
                {this.renderDemominationModal()}
                {this.renderTCModal()}

                
                <ScrollView contentContainerStyle={{width:'100%'}}>
                
                    {this.renderBalanceView()}
                    {this.renderMerchantCard()}
                    {this.props.route.params.isGiftCard &&
                    <Text style={[styles.descText,{fontFamily:fonts.bold}]}>Denomination</Text>}
                    {this.renderDenominationView()}
                    {this.renderContactsList()}
                    {this.renderDeliveryView()}
                    {this.rendeDateView()}
                    {this.state.showDatePicker &&
                    <View>
                        {Platform.OS == 'ios' &&
                        <TouchableOpacity
                        onPress={() => {
                            if(this.state.selectedDate == ''){
                                alert('Please select a date')
                            }else{
                                this.setState({showDatePicker:false})
                            }
                            
                        }}
                        style={{backgroundColor:colors.White,width:getDeviceWidth() - 20,marginRight:10,marginLeft:10,justifyContent:'center',alignItems:'flex-end',padding:10}}>
                            <Text style={styles.nameText}>Done</Text>
                        </TouchableOpacity>}
                        <DateTimePicker
                        minimumDate={new Date()}
                        
                        testID="dateTimePicker"
                        value={this.state.initialTime}
                        mode={'date'}
                        is24Hour={true}
                        display='calendar'
                        onChange={this.onChange}
                        />
                    </View>
                    
                    }
                    {this.renderNameView()}
                    {this.renderMobileNumberView(true)}
                    {this.renderDescriptionView()}                    
                    {this.renderPointsView()}
        
                    <View style={styles.btnContainer} >
                        <YellowButton title='Redeem' navigate={() => { this.onRedeemtapped() }} />
                    </View>
                </ScrollView>
                

                
                
            </KeyboardAvoidingView>
        );
    }
}
export default connect(mapStateToProps)(GiftRedeemCheckoutStart);


const styles = StyleSheet.create({
    container: {
        // alignItems: 'center',
        flex:1
    },
    merchantCard:{
        margin:10,
        width:getDeviceWidth() - 20,
        // height:150,
        paddingTop:10,
        backgroundColor:colors.White,
        borderRadius:5,
        // justifyContent:'flex-end',
        shadowOffset:{width:1,height:1},
        shadowRadius:2,
        shadowOpacity:0.5,
        elevation:5
    },
    nameText:{
        fontFamily:fonts.bold,
        color:colors.APP_GREEN,
        fontSize:18,
        
    },
    descText:{
        fontFamily:fonts.medium,
        color:colors.BLACK,
        fontSize:12,
        margin:5,
        margin:10
    },
    nameAndImageHolder:{
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        // justifyContent:'space-between',
    },
    denominationHolder:{
        margin:10,
        marginTop:0,
        width:getDeviceWidth() - 20,
        height:50,
        backgroundColor:colors.White,
        padding:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    textInput:{
        width:'80%',
        fontSize:16,
        // height:35,
        color:colors.APP_GREEN,
        fontFamily:fonts.bold,
        borderBottomColor:colors.BLACK,
        textAlign:'right'
        // borderBottomWidth:1
    },
    pointsView:{
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
    totalPayText:{
        fontSize:14,
        color:colors.APP_GREEN,
        fontFamily:fonts.bold,
        opacity:0.6
    },
    pointsText:{
        fontSize:18,
        fontFamily:fonts.regular,
        color:colors.APP_GREEN,
    },
    btnContainer: {
        width: getDeviceWidth(),
        alignItems: "center",
        marginTop:20,
        marginBottom:10
    },
    tAndC:{
        padding:6,
        // width:50,
        backgroundColor:colors.APP_GREEN,
        justifyContent:'center',
        alignItems:'center',
        margin:5,
        marginRight:5,
        alignSelf:'flex-end'
    },
    touchableOpacity:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:10,
        height:80,
        backgroundColor:colors.White,
        width:getDeviceWidth() - 30,
        marginLeft:15,
        marginRight:15,
        
    },
    points:{
        fontFamily:fonts.bold,
        color:colors.APP_GREEN,
        fontSize:14,
        width:'75%'
    },
    descriptionText:{
        fontFamily:fonts.medium,
        color:colors.BLACK,
        fontSize:10,
        marginTop:5,
        width:'75%'
    }
});
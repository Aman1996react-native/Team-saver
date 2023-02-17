import React, { Component } from "react";
import { 
    View,
    Text,
    FlatList,
    Platform,
    PermissionsAndroid,
    LogBox,
    StyleSheet
} from "react-native";
import CategoryRow from "../offers/categoryRow";
import { SearchBar } from 'react-native-elements';
import MerchantsRow from "./merchantsRow";
import BalanceView from "./balanceView";
import Contacts from 'react-native-contacts';
import colors from "../../utils/colors";
import fonts from "../../assets/fonts";
import { getDeviceWidth } from "../../utils";
import Config from "react-native-config";





class RedeemRewardsGiftCard extends Component {

    constructor(props){
        super(props)
        this.state = {
            searchText:'',
            shouldMoveUp:false,
            filteredArray:[],
            categories:this.props.categories,
            merchants:this.props.merchants,
            selectedCatIndex:null,
            contacts:[],
            cafes:this.props.cafes,
            selectedMenu:[]
        }
    }

    componentDidMount(){
        if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
            
        }else{
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
        }
        
        
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
        Contacts.getAll().then(contacts => {
            if(typeof(contacts) != 'undefined'){
                if(contacts.length > 0){
                    // alert(JSON.stringify(contacts[21].phoneNumbers))
                    // 
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
                    this.setState({contacts:contactDetails})
                }
            }

          })
    }


    merchantsHeader = () => {
        return(
            <View style={styles.searchHolder}>
                <SearchBar
                placeholder= {this.props.isFoodAndWine ? "Search cafes/resturants" : "Search rewards..."}
                lightTheme={true}
                inputStyle={styles.searchTextInput}
                inputContainerStyle={{backgroundColor:colors.LightGray,}}
                containerStyle={Platform.OS == 'ios' && styles.searchContainer}
                platform={Platform.OS == 'ios' ? 'ios' : 'android'}
                onChangeText={(text) => {
                    this.setState({searchText:text})
                }}
                value={this.state.searchText}
                onTouchStart={() => {
                    this.setState({shouldMoveUp:true})
                }}
                onSubmitEditing={() => {
                    this.setState({shouldMoveUp:false})
                }}
                onBlur={() =>{
                    this.setState({shouldMoveUp:false})
                }}
                
                returnKeyType='search'
                onSubmitEditing={() => {
                    
                }}
                onChangeText={(text) => {
                    this.setState({searchText:text},() => {
                        let array = this.state.filteredArray.slice(0)

                        let merchants = this.state.selectedCatIndex == null ? this.state.merchants : this.state.categories[this.state.selectedCatIndex].MerchantDetails
                        let cafes = this.state.cafes
                        
                        if(this.props.isGiftCard){
                            if(merchants.length > 0){
                                array = merchants.filter(merchant =>{ 
                                    return merchant.Merchant_Name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1
                                });
                                this.setState({filteredArray:array})
                            }
                        }

                        if(this.props.isFoodAndWine){
                            if(cafes.length > 0){
                                array = cafes.filter(merchant =>{ 
                                    return merchant.Merchant_Name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1
                                });
                                this.setState({filteredArray:array})
                            }
                        }
                        
                        if(this.state.searchText == ''){
                            this.setState({filteredArray:[]})
                        } 
                        
                    })
                }}
                />
            </View>
            
        )
    }

    categoryKeyExtractor = (item, index) => item.Category_ID.toString()

    renderCategory = ({ item, index }) => {
                return(
                    <CategoryRow
                    item={item}
                    index={index}
                    Categories={this.state.categories}
                    onCategoryTapped={this.onCategoryTapped}
                    isFromRewards={true}
                    />
                )
           
        
    }

    renderMerchants = () => {
        if(this.props.isGiftCard){
            return(
                <FlatList
                style={{ marginTop: 10,width:'100%',marginBottom:10}}
                data={
                    this.state.selectedCatIndex == null ? this.state.searchText == '' ? this.state.merchants : this.state.filteredArray : this.state.searchText == '' ? this.state.categories[this.state.selectedCatIndex].MerchantDetails :
                                this.state.filteredArray}
                renderItem={this.renderMerchantItems}
                keyExtractor={this.merchantsKeyExtractor}
                />
            )
        }
        
    }

    merchantsKeyExtractor = (item, index) => item.Merchant_ID.toString()

    renderMerchantItems = ({ item, index }) => {
        if(typeof(item.OfferDetails) != 'undefined'){
            if(item.OfferDetails.length > 0){
                return(
                    <MerchantsRow
                    item={item}
                    index={index}
                    onMerchantSelected={this.onMerchantSelected}
                    isGiftCard={true}
                    isFoodAndWine={false}
                    />
                )
            }
        }
        
    }

    onMerchantSelected = (item,index) => {
        // alert(JSON.stringify(item))
        let denominationArray = []
        if(typeof(item)!= 'undefined'){
            if(typeof(item.OfferDetails) != 'undefined'){
                if(item.OfferDetails.length > 0){
                    item.OfferDetails.forEach(offer => {
                        if(offer.Amount){
                            const element = {
                                Amount:offer.Amount,
                                Points: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? '0' : offer.Points,
                                Rate:offer.Rate,
                                Offer_ID:offer.Offer_ID
                            }
                            denominationArray.push(element)
                        }
                    })
                }
            }
        }
        // alert(item.Category_ID)
        this.props.navigation.navigate('GiftRedeemCheckoutStart',{item:item,denominationArray:denominationArray,contacts:this.state.contacts,isGiftCard:true})

    }

    onCategoryTapped = (item,index) => {
        this.setState({selectedCatIndex:index,searchText:'',filteredArray:[]},() => {
            let array = this.state.categories.slice(0)
            if(array.length > 0){
                array.forEach(cat => {
                    if(cat.Category_ID == item.Category_ID){
                        cat.selected = true
                    }else{
                        cat.selected = false
                    }
                })
                this.setState({categories:array})
        }
        })
    }

    renderCategories = () => {
        if(this.props.isGiftCard){
            return(
                <FlatList
                horizontal
                style={{ marginBottom: 10,minHeight:70,maxHeight:70}}
                data={this.state.categories}//{this.props.categories}
                renderItem={this.renderCategory}
                keyExtractor={this.categoryKeyExtractor}
                />
            )
        }
        
    }

    renderBalanceView = () => {
        if(this.state.shouldMoveUp){
            return null
        }
        if(typeof(this.props.balance) != 'undefined'){
            if(typeof(this.props.balance) != 'undefined'){
                return(
                    <BalanceView
                    balance={this.props.balance}/>
                )
            }
        }
        return(
            null
        )
    }

    cafeKeyExtractor = (item, index) => item.MerchantID.toString()

    renderCafeItems = ({ item, index }) => {
        
        if(typeof(item.Menu) != 'undefined'){
            if(item.Menu.length > 1){
                return(
                    <MerchantsRow
                    item={item}
                    index={index}
                    onCafetapped={this.onCafetapped}
                    isGiftCard={false}
                    isFoodAndWine={true}
                    onMenuTapped={this.onMenuTapped}
                    info={this.props.info}
                    />
                )
            }
        }
    }

    onMenuTapped = (item,cafe) => {
        if(typeof(item) != 'undefined'){
            let menuItems = this.state.selectedMenu.slice(0)
            if(menuItems.length > 0){
                if(menuItems[0].CafeId == cafe.MerchantID){
                    menuItems.push(item)
                    this.setState({selectedMenu:menuItems},() => {
                        this.props.navigation.navigate('GiftRedeemCheckoutStart',{selectedMenu:this.state.selectedMenu,contacts:this.state.contacts,isGiftCard:false,isFoodAndWine:true,item:cafe,onComingBack:this.onComingBack})
        
                    }) 
                }
            }else{
                menuItems.push(item)
                this.setState({selectedMenu:menuItems},() => {
                    this.props.navigation.navigate('GiftRedeemCheckoutStart',{selectedMenu:this.state.selectedMenu,contacts:this.state.contacts,isGiftCard:false,isFoodAndWine:true,item:cafe,onComingBack:this.onComingBack})
    
                })
            }
            
            
        }
    }

    onComingBack = (menus) => {
        this.setState({selectedMenu:menus})
    }

    onCafetapped = (selected,index,item) => {
        let cafes = []
        let selectedCafe = []
        if(this.state.searchText == ''){
            cafes = this.state.cafes
        }else{
            cafes = this.state.filteredArray
        }
        if(selected){
            if(cafes.length > 0){
                cafes.forEach(cafe => {
                    if(cafe.MerchantID == item.MerchantID){
                        selectedCafe.push(item)
                    }
                })
                if(this.state.searchText == ''){
                    this.setState({cafes:selectedCafe})
                }else{
                    this.setState({filteredArray:selectedCafe})
                }
                
            }
        }else{
            this.setState({cafes:this.props.cafes,searchText:''})
        }
        

    }

    renderFoodAndWine = () => {
        if(this.props.isFoodAndWine){
            return(
                <FlatList
                style={{ marginTop: 10,width:'100%',marginBottom:10}}
                data={this.state.searchText == '' ? this.state.cafes : this.state.filteredArray}
                renderItem={this.renderCafeItems}
                keyExtractor={this.cafeKeyExtractor}
                />
            )
        }
    }


    render() {
        
        return (
            <View style={styles.container}>
                {this.renderBalanceView()}
                {this.renderCategories()}
                {this.merchantsHeader()}
                {this.renderMerchants()}
                {this.renderFoodAndWine()}
            </View>
        );
    }
}
export default RedeemRewardsGiftCard;

const styles = StyleSheet.create({
    container: {
        // width:'100%',
        // height:'100%',
        flex:1,
        alignItems: 'center',
    },
    searchTextInput:{
        width:'90%',
        marginLeft:5,
        height:'100%',
        color:colors.APP_GREEN,
        fontFamily:fonts.bold,
        fontSize:14,
        backgroundColor:colors.LightGray
    },
    searchHolder:{
        width:getDeviceWidth() - 10,
        marginLeft:5,
        marginRight:5,
        marginBottom:5,
    },
    searchContainer:{
        height:40,
        margin:0,
        padding:0,
        backgroundColor:colors.LightGray,
        borderRadius:10
    }
});
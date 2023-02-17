import React, { Component } from "react";
import { 
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    StyleSheet
} from "react-native";
import fonts from "../../assets/fonts";
import colors from "../../utils/colors";
import RoundImage from "../roundImage";
import { SearchBar } from 'react-native-elements';
import GiftRow from "./giftRow";
import { getDeviceWidth } from "../../utils";
import BalanceView from "./balanceView";
import Geolocation from '@react-native-community/geolocation';
import Contacts from 'react-native-contacts';
import AsyncStorage from "@react-native-community/async-storage"
import AppHeader from "../AppHeader";
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from "react-native-config";





class GiftComponent extends Component {

    constructor(props){
        super(props)
        this.state={
            categories: this.props.categories,
            searchText:'',
            shouldMoveUp:false,
            filteredArray:[],
            contacts:[],
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

    renderPointsView = () => {
        if(this.state.shouldMoveUp){
            return null
        }
        if(typeof(this.props.balance) != 'undefined'){
            if(typeof(this.props.balance.Balance) != 'undefined'){
                return(
                    <BalanceView
                    balance={this.props.balance}/>
                        
                    
                )
            }
        }
        
    }

    offersHeader = () => {
        if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
            return null
        }
        return(
            <View style={styles.searchHolder}>
                <SearchBar
                lightTheme={true}
                placeholder="Search Rewards Here..."
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
                placeholder='Search rewards...'
                onSubmitEditing={() => {
                    
                }}
                onChangeText={(text) => {
                    this.setState({searchText:text},() => {
                        let array = this.state.filteredArray.slice(0)
                        let rewards = this.props.categories
                       
                        if(rewards.length > 0){
                            array = rewards.filter(reward =>{ 
                                return reward.Name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1
                            });
                            console.log(JSON.stringify(array.length))
                            console.log('array: ' +array)
                            this.setState({filteredArray:array})
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

    onCategoryTapped = (item,index) => {
        if(typeof(item) != 'undefined'){
            if(typeof(item.Name) != 'undefined' && typeof(item.RewardID) != 'undefined'){
                if(item.Name.toLowerCase() == 'gift cards' || item.RewardID == 'R05'){
                    this.props.navigation.navigate('RewardDetails',{item:item,isGiftCard:true,isFoodAndWine:false})
                }else if(item.Name.toLowerCase() == 'food and wine' || item.RewardID == 'R02'){
                    EncryptedStorage.getItem('isLocationEnabled',(res,err) => {
                        
                        if(res == 'true'){
                            Geolocation.getCurrentPosition(info => {
                                if(info){
                                    this.props.navigation.navigate('RewardDetails',{item:item,isGiftCard:false,isFoodAndWine:true,info:info})
                                }
                            })
                        }else{
                            this.props.navigation.navigate('RewardDetails',{item:item,isGiftCard:false,isFoodAndWine:true,info:null})
                        
                        }
                    })
                    
                }else if(item.Name.toLowerCase() == 'points' || item.RewardID == 'R04'){
                    this.props.navigation.navigate('PointsTransfer',{item:item,isPoints:true,contacts:this.state.contacts,isGiftCard:false,isFoodAndWine:false})
                }
                // else if(item.Name.toLowerCase() == 'transfer to bank' || item.RewardID == 'R06'){
                //     this.props.navigation.navigate('TransferToBankCCS',{balance:this.props.balance})
                // }
                else if(item.Name.toLowerCase() == 'transfer to prepaid card' || item.RewardID == 'R07'){
                    this.props.navigation.navigate('TransferToMasterCard',{balance:this.props.balance})

                }
                
                else{
                    this.props.navigation.navigate('ComingSoon')
                }
            }
        }
    }

    rewardsKeyExtractor = (item, index) => item.RewardID.toString()
    renderRewards = ({ item, index }) => {
        return(
            <GiftRow
            item={item}
            index={index}
            onCategoryTapped={this.onCategoryTapped}
            />
        )
        
    }

    rendercategories = () => {
        console.log('Categories gift',this.props.categories)
        return(
            <FlatList
            scrollEnabled={false}
            numColumns={(!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) && 2}
            style={{ marginTop: 10,width:'100%',marginBottom:10,}}
            contentContainerStyle={{alignItems:'center'}}
            data={this.state.searchText == '' ? this.props.categories : this.state.filteredArray} 
            renderItem={this.renderRewards}
            keyExtractor={this.rewardsKeyExtractor}
            />
        )
        
    }

    render() {
        return (
            <>
           
           <AppHeader hideBackButton = {true} imageHide = {true} rightHeaderHide = {true}/>
            <View style={styles.container}>
            
                {this.renderPointsView()}
                {this.offersHeader()}
                {this.rendercategories()}
            </View>
           
            </>
        );
    }
}
export default GiftComponent;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent:'flex-start',
        height:'100%'
        // backgroundColor:colors.BACKGROUND_COLOR
    },
    pointsView:{
        width:'100%',
        paddingLeft:20,
        paddingRight:20,
        // backgroundColor:colors.BACKGROUND_COLOR
        
    },
    profileImageHolderView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding:10,
        // backgroundColor:colors.BACKGROUND_COLOR
    },
    topUpButton:{
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        backgroundColor:colors.YELLOW
    },
    topUpText:{
        fontFamily:fonts.bold
    },
    searchTextInput:{
        width:'95%',
        marginLeft:5,
        height:'100%',
        color:colors.APP_GREEN,
        fontFamily:fonts.bold,
        fontSize:14,
        backgroundColor:colors.LightGray
    },
    searchHolder:{
        width:getDeviceWidth() - 20,
        marginLeft:10,
        marginRight:10,
        // borderColor:colors.APP_GREEN,
    },
    searchContainer:{
        height:40,
        margin:0,
        padding:0,
        backgroundColor:colors.LightGray,
        borderRadius:10
    }
});
import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, ScrollView,
FlatList,Platform,TouchableOpacity,TextInput,KeyboardAvoidingView } from 'react-native';
import Colors from '../../utils/colors'
import { heightToDp, widthToDp, getDeviceWidth } from '../../utils';
import Icons from '../../assets/icons'
import * as Labels from '../../constants'
import Modal from 'react-native-modal';

import { connect } from 'react-redux';
import ActivityIndicatorModal from '../activityIndicator/activityIndicatorModel';
import fonts from '../../assets/fonts';
import colors from '../../utils/colors';
import NoDataView from '../noData/noDataView';
import CategoryRow from './categoryRow';
import OfferRow from './offerRow';
import OfferSaveShopModal from './offerSaveShopModal';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { OffersActionCreator } from '../../redux/actionCreators/app/offers';
import { SearchBar } from 'react-native-elements';



const mapStateToProps =(state) => ({
    loading:state.SaveOffersReducer.loading,
    request:state.SaveOffersReducer.request,
    response:state.SaveOffersReducer.response
  })

class Offers extends Component {

    constructor(props){
        super(props)
        this.state={
            selectedCatIndex:0,
            categoriesWithOffers:this.props.categories.slice(0),
            isVisible:false,
            selectedOffer:null,
            searchText:'',
            filteredArray:[],
            shouldMoveUp:false
        }
    }

    categoryKeyExtractor = (item, index) => item.Category_ID.toString()
    offersKeyExtractor = (item, index) => item.OfferID.toString()


    renderCategory = ({ item, index }) => {
        return(
            <CategoryRow
            item={item}
            index={index}
            Categories={this.state.categoriesWithOffers}
            onCategoryTapped={this.onCategoryTapped}
            isFromRewards={false}
            />
        )
        
    }

    renderOffers = ({ item, index }) => {
        return(
            <OfferRow
            item={item}
            index={index}
            onOfferTapped={this.onOfferTapped}
            />
        )
        
    }

    offersHeader = () => {
        return(
            <View style={styles.searchHolder}>
                <SearchBar
                lightTheme={true}
                placeholder="Search offers..."
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
                        let offers = this.props.categories[this.state.selectedCatIndex].OfferDetails
                       
                        if(offers.length > 0){
                            array = offers.filter(offer =>{ 
                                return offer.OfferTitle.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1
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
        // alert(item.Category_ID)
        this.setState({selectedCatIndex:index,searchText:'',filteredArray:[]},() => {
            let array = this.state.categoriesWithOffers.slice(0)
            if(array.length > 0){
                array.forEach(cat => {
                    if(cat.Category_ID == item.Category_ID){
                        cat.selected = true
                    }else{
                        cat.selected = false
                    }
                })
                this.setState({categoriesWithOffers:array})
        }
        })

    }

    onOfferTapped = (item,index) => {
        this.setState({selectedOffer:item},() => {
            this.setState({isVisible:true})
        })

    }

    onSaveTapped = (item) => {
        this.setState({isVisible:false},() => {
            EncryptedStorage.getItem('userId',(res,err) => {
                if(res){
                    const cat = this.props.categories[this.state.selectedCatIndex]
                    // alert(cat.Category_ID + '  ' + item.OfferID)
                    this.props.dispatch(OffersActionCreator.saveOffer(res,cat.Category_ID,item.OfferID))
                }
            })
        })
        
    }

    onShopTapped = (item) => {
     
        this.setState({isVisible:false})
        this.props.navig.navigate('OfferPreview',{ item: item })
    }

    componentDidUpdate(prevPros){
        const res = this.props.response
        if(typeof(res) != 'undefined'){
            if(typeof(res.Status) != 'undefined' && typeof(res.saved_status) != 'undefined'){
                if(res.Status == 'Success' && res.saved_status == 'true'){
                    alert('Offer Saved successfully')
                    this.props.dispatch(OffersActionCreator.resetSaveOffers())
                }
            }
        }
    }

    onBackdropPressed = () => {
        this.setState({isVisible:false})
    }


    render() {
        const categories = this.props.categories
        if(typeof(categories) == 'undefined' || categories == null){
            return(
                <NoDataView
                label='No Offers to display'/>
            )
        }

        if(categories.length < 1){
            return(
                <NoDataView
                label='No Offers to display'/>
            )
        }

        if(typeof(categories[0].OfferDetails) == 'undefined'){
            return(
                <NoDataView
                label='No Offers to display'/>
            )
        }

        return (
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' && 'padding'} style={styles.container}>
               <ActivityIndicatorModal isVisible={this.props.loading}/>
                {this.state.selectedOffer != null  &&
                <OfferSaveShopModal
                selectedOffer={this.state.selectedOffer}
                isVisible={this.state.isVisible}
                onSaveTapped={this.onSaveTapped}
                onShopTapped={this.onShopTapped}
                isFromSaved={this.props.isFromSaved}
                onBackdropPressed={this.onBackdropPressed}
                />
                }

                <FlatList
                horizontal
                style={{ marginBottom: 10,backgroundColor: colors.BACKGROUND_COLOR,minHeight:70,maxHeight:70}}
                data={this.state.categoriesWithOffers}//{this.props.categories}
                renderItem={this.renderCategory}
                keyExtractor={this.categoryKeyExtractor}
                />

                {this.offersHeader()}
                <FlatList
                style={{ marginTop: 10,backgroundColor: colors.BACKGROUND_COLOR ,}}
                data={
                    this.state.filteredArray.length > 0 || this.state.searchText != '' ? this.state.filteredArray :this.props.categories[this.state.selectedCatIndex].OfferDetails
                }
                renderItem={this.renderOffers}
                keyExtractor={this.offersKeyExtractor}
                // ListHeaderComponent={this.offersHeader}
                />
            </KeyboardAvoidingView>
            
        );
    }
}
export default connect(mapStateToProps)(Offers);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'flex-start',
        // backgroundColor:colors.BACKGROUND_COLOR
    },
    referAFriendView: {
        margin: 20,
        marginTop:12,
        marginBottom:5,
        backgroundColor:colors.White,
        justifyContent: 'center',
        alignItems: 'center',
        padding:10,
        borderWidth:0.3,
        borderColor:colors.APP_GREEN
        // shadowColor:colors.BLACK,
        // shadowOffset:{width:2,height:2},
        // shadowRadius:10,
        // shadowOpacity:0.5,
        // elevation:5

    },
    descText: {
        fontSize: 12,
        fontFamily: fonts.medium,
        textAlign: 'center'
    },
    textAndIconHolder: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10
    },
    refereAFriendText: {
        fontSize: 14,
        fontFamily: fonts.bold,
        color: colors.APP_GREEN,
        marginLeft: 10
    },
    buttonText: {
        fontSize: 14,
        color: colors.White,
        fontFamily: fonts.medium,
    },
    button: {
        backgroundColor: colors.NEW_BUTTON_BLUE,
        height: 40,
        borderRadius: 2,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    searchHolder:{
        width:getDeviceWidth() - 20,
        marginLeft:10,
        marginRight:10,
        borderColor:colors.APP_GREEN,
        marginBottom:5,
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
    searchContainer:{
        height:40,
        margin:0,
        padding:0,
        backgroundColor:colors.LightGray,
        borderRadius:10
    }
});

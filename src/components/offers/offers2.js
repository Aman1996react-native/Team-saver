import React, { Component } from 'react';
import {
    StyleSheet, View, Image, Text, ScrollView,
    FlatList, Platform, TouchableOpacity, TextInput, KeyboardAvoidingView, RefreshControl, ActivityIndicator, Dimensions
} from 'react-native';
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
import OfferRow2 from './offersRow2';
import OfferSaveShopModal2 from './offerSaveShopModal2';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ImageBackgroundComponent from '../imageComponent/imageBackgroundComponent';
import ImageComponent from '../imageComponent/imageComponent';
import { CCSActionCreator } from '../../redux/actionCreators/app/ccs';
import { CheckAccessTokenExpiryTime } from '../../redux/actionCreators/checkAccessTokenExpiry';
import Config from "react-native-config";
import moment from 'moment';


let interval

const mapStateToProps = (state) => ({
    loading: state.SaveOffersReducer.loading,
    request: state.SaveOffersReducer.request,
    response: state.SaveOffersReducer.response,

    shopClickedLoading: state.ShopClickedReducer.loading,
    shopClickedRequest: state.ShopClickedReducer.request,
    shopClickedResponse: state.ShopClickedReducer.response,

    offerWithRetailerNameLoading: state.OfferWithRetailerNameReducer.loading,
    offerWithRetailerNameRequest: state.OfferWithRetailerNameReducer.request,
    offerWithRetailerNameResponse: state.OfferWithRetailerNameReducer.response,

    offerWithCategoryNameLoading: state.OfferWithCategoryNameReducer.loading,
    offerWithCategoryNameRequest: state.OfferWithCategoryNameReducer.request,
    offerWithCategoryNameResponse: state.OfferWithCategoryNameReducer.response,

CategorysData : state.GetCateogoriesReducer.response,
GetAllOffers : state.GetCateogoriesReducer.Alloffers,
Other50Data : state.GetCateogoriesReducer.Other50Data,

GetProfileDetailsReducer: state.GetProfileDetailsReducer.response

})

let data = {}

class Offers2 extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedCatIndex: 0,
            categoriesWithOffers: this.props.CategorysData.slice(0),
            isVisible: false,
            selectedMerchant: null,
            searchText: '',
            filteredArray: [],
            shouldMoveUp: false,
            catToBeSelected: 'All',
            AllCat:[],
            AllOffersData:[],
            LoginReducerData:"",
            StartIndex : 0,
            TotalCount:"",
            itemsLength:1,
            Sec_Image:""
            
        }
    }

    componentDidMount() {
        let Offerprops = {
                PageSize : 100,
                StartIndex : this.state.StartIndex,
                Timestamp: new Date(),
        }
    // this.props.navigation.addListener('focus', this._onFocus);
        this.props.dispatch(CCSActionCreator.offerWithRetailerName(null)),
       this.props.dispatch(OffersActionCreator.getAllOffer(Offerprops))
this.reHitFunction()
      
     
      
    }

    reHitFunction = () => {
        interval =  setInterval(() => {
            this.newFunction()
           }, 2000);
    }

    categoryKeyExtractor = (item, index) => item.Category_ID.toString()
    offersKeyExtractor = (item, index) => item.Merchant_ID.toString()

    

    renderCategory = ({ item, index }) => {
        return (
            <CategoryRow
                item={item}
                index={index}
                Categories={this.state.categoriesWithOffers}
                onCategoryTapped={this.onCategoryTapped}
                Sec_Image = {this.state.Sec_Image}
                isFromRewards={false}
                selectedIndex={this.state.selectedCatIndex}
                catToBeSelected={this.state.catToBeSelected}
            />
        )

    }

    renderOffers = ({ item, index }) => {
        return (
            <OfferRow2
                item={item}
                index={index}
                onOfferTapped={this.onOfferTapped}
            />
        )

    }

    filterArray = (text) => {
    //     console.log("text.length",text.length)
    //     let arr = [...this.state.AllOffersData]
    //    let  array = arr.filter(mer => {
    //                 return text.length > 1 ?  mer.Merchant_Name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1 : arr
    //             });
    //         this.setState({AllOffersData : array})
        let array = this.state.filteredArray.slice(0)
        let merchants = this.state.AllOffersData

        if (merchants.length > 0) {
            array = merchants.filter(mer => {
                return mer.Merchant_Name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1
            });
            console.log(JSON.stringify(array.length))
            console.log('array: ' + array)
            this.setState({ filteredArray: array })
        }
        if (this.state.searchText == '') {
            this.setState({ filteredArray: [] })
        }
    }

    offersHeader = () => {

        return (
            <View style={styles.searchHolder}>
                <SearchBar
                    lightTheme={true}
                    placeholder="Search offers..."
                    inputStyle={styles.searchTextInput}
                    inputContainerStyle={{ backgroundColor: colors.LightGray, }}
                    containerStyle={Platform.OS == 'ios' && styles.searchContainer}
                    platform={Platform.OS == 'ios' ? 'ios' : 'android'}
                    onChangeText={(text) => {
                        this.setState({ searchText: text })
                    }}
                    value={this.state.searchText}
                    onTouchStart={() => {
                        this.setState({ shouldMoveUp: true })
                    }}
                    onSubmitEditing={() => {
                        this.setState({ shouldMoveUp: false })
                    }}
                    onBlur={() => {
                        this.setState({ shouldMoveUp: false })
                    }}

                    returnKeyType='search'

                    onSubmitEditing={() => {

                    }}
                    onChangeText={(text) => {
                        this.setState({ searchText: text }, () => {
                            this.filterArray(text)

                        })
                    }}
                />
            </View>

        )
    }

    onCategoryTapped = (item, index) => {
        console.log("item.Image-------",item)
        if (item.Category_ID == "C017"){
            this.setState({StartIndex : 0,AllOffersData : [],Sec_Image : item.Image},()=>{
            let Offerprops = {
                PageSize : 100,
                StartIndex : this.state.StartIndex,
                Timestamp: new Date(),
        }
        this.props.dispatch(OffersActionCreator.getAllOffer(Offerprops))
        this.reHitFunction()
            
        })
        } else {
            this.setState({AllOffersData : []},()=>{
        this.props.dispatch(OffersActionCreator.GetAggMerchantsByCat(item.Category_ID))
            })
        }
        this.setState({ selectedCatIndex: index, searchText: '', filteredArray: [],AllOffersData:[],Sec_Image : item.Image}, () => {
            let array = this.state.categoriesWithOffers.slice(0)
            if (array.length > 0) {
                array.forEach(cat => {
                    if (cat.Category_ID == item.Category_ID) {
                        cat.selected = true
                        // this.props.onCategoryTapped(cat)
                    } else {
                        cat.selected = false
                    }
                })
                // this.setState({ categoriesWithOffers: array })
            }
        })

    }

    onOfferTapped = (item, index) => {
        this.setState({ selectedMerchant: item, isVisible: true }, () => {
            // this.setState({isVisible:true})
            if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
                this.props.navig.navigate('CCSOfferPreview', { selectedMerchant: item, selectedCatIndex: this.state.selectedCatIndex })
            }
        })

    }

    onSaveTapped = (item) => {

        this.setState({ isVisible: false }, () => {
            EncryptedStorage.getItem('userId', (res, err) => {
                if (res) {
                    const cat = this.props.categories[this.state.selectedCatIndex]
                    // alert(cat.Category_ID + '  ' + item.OfferID)
                    this.props.dispatch(OffersActionCreator.saveOffer(res, cat.Category_ID, item.Offer_ID))
                }
            })
        })

    }

    onShopTapped = (item) => {

        this.setState({ isVisible: false })
        if (typeof (item.TargetURL) != 'undefined') {
            if (item.TargetURL != null) {
                if (item.TargetURL != '') {

                    EncryptedStorage.getItem('userId', async (res, err) => {
                        if (res) {
                            await CheckAccessTokenExpiryTime('Offers2Page')
                            this.props.dispatch(OffersActionCreator.shopClickApi(res, item.Offer_ID, item.Name))
                        }
                    })
                    this.props.navig.navigate('OfferPreview', { item: item, LogoUrl: this.state.selectedMerchant.Merchant_Image })
                }
            }
        }

    }

    componentDidUpdate(prevPros) {
        const res = this.props.response
        if (typeof (res) != 'undefined') {
            if (typeof (res.Status) != 'undefined' && typeof (res.saved_status) != 'undefined') {
                if (res.Status == 'Success' && res.saved_status == 'true') {
                    alert('Offer Saved successfully')
                    this.props.dispatch(OffersActionCreator.resetSaveOffers())
                }
            }
        }

        const resdata = this.props.CategorysData
        // console.log("resdata",resdata)
        if (prevPros.CategorysData !== this.props.CategorysData){
            this.setState({AllCat : this.props.CategorysData },()=>{
                console.log("AllCat",this.state.AllCat)
            })
        }

        
        
        if (prevPros.GetAllOffers !== this.props.GetAllOffers){
            var d = new Date();
            var n = d.getTime();
            console.log("nnnnn",moment(n).format("DD-MM-YYYY hh:mm:ss"))
            this.setState({AllOffersData : this.props?.GetAllOffers.AggMerchants,TotalCount :  this.props?.GetAllOffers.TotalCounts },()=>{
                console.log("AllOffersData",this.props?.GetAllOffers)
            })  
        }

        // Other50Data

        if (prevPros.Other50Data !== this.props.Other50Data){
            // console.log("Other50Data====",this.props.Other50Data.AggMerchants)
        const arr = [...this.state.AllOffersData] 
        const newData = arr.concat(this.props.Other50Data.AggMerchants)
        // console.log("newDatanewDatanewData",newData)
        this.setState({AllOffersData : newData,itemsLength : this.props.Other50Data.AggMerchants.length},()=>{
            // console.log("newData",newData.length)
            if (newData.length > 600){
                clearInterval(interval)
               }
        })
        }

        if (prevPros.LoginReducer !== this.props.LoginReducer){
            this.setState({LoginReducerData : this.props.LoginReducer},()=>{
                console.log(LoginReducerData,this.props.LoginReducer)
            })
        }

        if (!this.props.getCategoriesLoading && !this.props.getHeroTilesLoading) {
            if (typeof (this.props.offerWithRetailerNameResponse) != 'undefined') {
                if (this.props.offerWithRetailerNameResponse != null) {
                    if (typeof (this.state.categoriesWithOffers) != 'undefined') {
                        if (this.state.categoriesWithOffers != null) {
                            if (this.state.categoriesWithOffers.length > 0) {
                                this.props.dispatch(CCSActionCreator.offerWithRetailerName(''))
                                this.props.dispatch(CCSActionCreator.resetResponse('15'))
                                if (this.props.offerWithRetailerNameResponse == 'gotooffers') {

                                }
                                this.setState({
                                    searchText:
                                        this.props.offerWithRetailerNameResponse == 'gotooffers' ?
                                            '' :
                                            this.props.offerWithRetailerNameResponse

                                },

                                    () => {
                                        this.filterArray('')
                                    })
                            }
                        }
                    }

                }
            }
        }



        if (typeof (this.props.offerWithCategoryNameResponse) != 'undefined') {
            if (this.props.offerWithCategoryNameResponse != null) {
                // console.warn('ILLIG BARLE BEKU')
                if (typeof (this.state.categoriesWithOffers) != 'undefined') {
                    if (this.state.categoriesWithOffers != null) {
                        if (this.state.categoriesWithOffers.length > 0) {
                            this.props.dispatch(CCSActionCreator.offerWithCategoryName(''))
                            this.props.dispatch(CCSActionCreator.resetResponse('24'))
                            console.warn('HERE IS THE CAT NAME: ' + this.props.offerWithCategoryNameResponse)

                            let array1 = this.state.categoriesWithOffers.slice(0)
                            let index = 0
                            if (array1.length > 0) {

                                array1.forEach(cat => {
                                    if (cat.Category_Name.toLowerCase().trim() == this.props.offerWithCategoryNameResponse.toLowerCase().trim()) {
                                        index = array1.indexOf(cat)
                                        this.setState({ selectedCatIndex: index, catToBeSelected: cat.Category_Name }, () => {
                                            console.warn('INDEX: ' + index)
                                            this.onCategoryTapped(cat, index)
                                            this.flatListRef.scrollToIndex({
                                                animated: true,
                                                index: index,
                                            });
                                        })


                                    }
                                })



                            }

                            // this.setState({selectedCatIndex:index,searchText:'',filteredArray:[]},() => {
                            //     let array = this.state.categoriesWithOffers.slice(0)
                            //     if(array.length > 0){
                            //         array.forEach(cat => {
                            //             if(cat.Category_Name == this.props.offerWithCategoryNameResponse){
                            //                 cat.selected = true
                            //                 this.props.onCategoryTapped(cat)
                            //             }else{
                            //                 cat.selected = false
                            //             }
                            //         })
                            //         this.setState({categoriesWithOffers:array})
                            // }
                            // })

                        }
                    }
                }





            }
        }
    }

    onScrollToIndexFailed = error => {
        this.flatListRef.scrollToOffset({
            offset: error.averageItemLength * error.index,
            animated: true,
        });

        setTimeout(() => {
            if (this.flatListRef !== null) {
                this.flatListRef.scrollToIndex({
                    index: error.index,
                    animated: true
                });
            }
        }, 100);
    }

    onBackdropPressed = () => {
        this.setState({ isVisible: false })
    }

    _renderItemHeroTileOffers = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.hpViewContainer}
                onPress={() => {
                    if (typeof (item.URL) != 'undefined') {
                        if (item.URL != null) {
                            if (item.MerchantID == 0) {
                                this.props.navigation.navigate('Profile')
                                return
                            }

                            EncryptedStorage.getItem('userId', (res, err) => {
                                if (res) {
                                    this.props.dispatch(OffersActionCreator.shopClickApi(res, item.MerchantID, item.MerchantName))
                                }
                            })
                            this.props.navig.navigate('ProductSite', {
                                targetUrl: item.URL,
                                ClientID: null,
                                MemberclientTokenId: null
                            })
                        }
                    }
                   
                }}>
                <ImageComponent
                Sec_Image ={this.state.Sec_Image}
                    imageUrl={item.Image + `?${new Date()}`}
                    resizeMode='stretch'
                    style={{ width: '100%',height: 170, marginRight: 5, borderTopLeftRadius: 15, borderTopRightRadius: 15,resizeMode:"contain" }}
                />
                <Text style={[styles.hpEarnText, { alignSelf: 'center' }]}>{item.RewardDescription}</Text>
            </TouchableOpacity>
        )

    }

    renderHeroTiles = () => {
        return null
        if (this.state.shouldMoveUp) {
            return null
        }
        if (this.state.selectedCatIndex == 0) {
            const heroTiles = this.props.heroTiles
            if (typeof (heroTiles) != 'undefined') {
                if (heroTiles.length > 0) {
                    return (
                        <View style={[styles.dailyOffersContainer1, { width: getDeviceWidth() - 20 }]}>

                            <View style={{ width: '100%' }}>
                                <Carousel
                                    activeSlideAlignment={'start'}
                                    inactiveSlideOpacity={1}
                                    inactiveSlideScale={1}
                                    containerCustomStyle={{ backgroundColor: 'transparent' }}
                                    contentContainerCustomStyle={{}}
                                    ref={(c2) => { this._carousel = c2; }}
                                    data={heroTiles}
                                    renderItem={this._renderItemHeroTileOffers}
                                    sliderWidth={getDeviceWidth() - 20}
                                    itemWidth={getDeviceWidth() - 20}
                                />

                            </View>


                        </View>
                    )
                }
            }


        }
    }

    EmptyComponent = () => {
        let Loader = true
        setTimeout(() => {
            Loader = false
        }, 2000);
        return <View style={{marginTop:50,alignItems:'center'}}>
          {Loader && !this.state.searchText ? <ActivityIndicator size={"large"} color={"red"}></ActivityIndicator> : <Text style={{color:"red"}}>No data found</Text>}
            </View>
    }

    newFunction = async (index) => {
       console.log("index",index)
        this.setState({StartIndex : this.state.StartIndex + 1},()=>{
        let Offerprops = {
            PageSize : 100,
            StartIndex : this.state.StartIndex * 100,
            Timestamp: new Date(),
    }
        // let arr = [...this.state.AllOffersData]
        this.props.dispatch(OffersActionCreator.getAllOffer(Offerprops))
   
    //     let Data = this.state.AllOffersData.map((item,index)=> {return {...item,id :1}})
    //   let mydata = await arr.concat(Data)
    //     this.setState({AllOffersData : mydata},()=>{
    //         console.log("AllOffersData==",this.state.AllOffersData)
    //     })
})
    }



    render() {
        const categories = this.props.categories
        const Cat_data = this.props.CategorysData
        if (typeof (categories) == 'undefined' || categories == null || Cat_data == null ) {
            return (
                <NoDataView
                    label='No Offers to display' />
            )
        }

        if (categories.length < 1 || Cat_data.length < 1) {
            return (
                <NoDataView
                    label='No Offers to display' />
            )
        }

        // if (typeof (categories[0].MerchantDetails) == 'undefined') {
        //     return (
        //         <NoDataView
        //             label='No Offers to display' />
        //     )
        // }
        // console.log("AllCat",AllCat)

        return (
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' && 'padding'} style={styles.container}>
                <ActivityIndicatorModal isVisible={this.props.loading} />
                {this.state.selectedMerchant != null && (!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) &&
                    <OfferSaveShopModal2
                        selectedMerchant={this.state.selectedMerchant}
                        isVisible={this.state.isVisible}
                        onSaveTapped={this.onSaveTapped}
                        onShopTapped={this.onShopTapped}
                        isFromSaved={this.props.isFromSaved}
                        onBackdropPressed={this.onBackdropPressed}
                        selectedCatIndex={this.state.selectedCatIndex}
                    />
                }

                {/* <FlatList
                    horizontal
                    data={this.state.AllCat}
                    renderItem={(item,index)=>{return <View style={{height:100,width:100}}>
                        <Text>{item.Category_Name}</Text>
                    </View>}}
                    /> */}

                <FlatList
                showsHorizontalScrollIndicator={false}
                    horizontal
                    style={{ marginBottom: 10, backgroundColor: colors.BACKGROUND_COLOR, minHeight: 70, maxHeight: 70, marginTop: 20 }}
                    data={this.state.categoriesWithOffers}//{this.props.categories}
                    renderItem={this.renderCategory}
                    extraData={this.state}
                    keyExtractor={this.categoryKeyExtractor}
                    ref={(ref) => this.flatListRef = ref}
                    onScrollToIndexFailed={this.onScrollToIndexFailed}
                />

                {/* {this.renderHeroTiles()} */}
                {this.offersHeader()}
                <FlatList
                    style={{ marginTop: 10, backgroundColor: colors.BACKGROUND_COLOR, }}
                    data={
                        this.state.filteredArray.length > 0 || this.state.searchText != '' ? this.state.filteredArray : this.state.AllOffersData
                        // this.state.filteredArray.length > 0 || this.state.searchText != '' ? this.state.filteredArray : this.props.categories[this.state.selectedCatIndex].MerchantDetails
                    }
                    renderItem={this.renderOffers}
                    keyExtractor={this.offersKeyExtractor}
                    // extraData={this.state.AllOffersData}
                    refreshControl={
                        <RefreshControl refreshing={false}
                            tintColor='transparent'
                            onRefresh={() => { this.props.pulledToRefresh() }} />
                    }
                    ListHeaderComponent={this.renderHeroTiles()}
                    ListEmptyComponent={
                        this.EmptyComponent
                        // ()=>{return <View style={{marginTop:50,alignItems:'center'}}><Text style={{color:"red"}}>No data found</Text></View>}
                    }
                    onEndReachedThreshold={0.10}
                    onEndReached={(index)=>{this.state.itemsLength == 0 ? null : this.newFunction(index)}}
                    maxToRenderPerBatch={100}
                    decelerationRate="normal"
                    // windowSize={30}
                    initialNumToRender = {10}
                    scrollEventThrottle={400}
                    legacyImplementation = {true}
                    removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        snapToInterval={Dimensions.get('window').height}
        snapToAlignment="start"
        ListFooterComponent={(item,index)=>{return this.state.itemsLength == 0 || this.state.itemsLength == 1 ? null : <View style={{marginTop:10,alignItems:"center"}}>
            {/* <ActivityIndicator size={"large"} color={"red"}></ActivityIndicator> */}
        </View>}}
                    
                    
                    // onMomentumScrollEnd={e => this.scroll(e.nativeEvent.contentOffset)}
                />
            </KeyboardAvoidingView>

        );
    }
}
export default connect(mapStateToProps)(Offers2);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'flex-start',
        // backgroundColor:colors.BACKGROUND_COLOR
    },
    referAFriendView: {
        margin: 20,
        marginTop: 12,
        marginBottom: 5,
        backgroundColor: colors.White,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderWidth: 0.3,
        borderColor: colors.APP_GREEN
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
    searchHolder: {
        width: getDeviceWidth() - 20,
        marginLeft: 10,
        marginRight: 10,
        borderColor: colors.APP_GREEN,
        marginBottom: 5,
    },
    searchTextInput: {
        width: '90%',
        marginLeft: 5,
        height: '100%',
        color: colors.APP_GREEN,
        fontFamily: fonts.bold,
        fontSize: 14,
        backgroundColor: colors.LightGray
    },
    searchContainer: {
        height: 40,
        margin: 0,
        padding: 0,
        backgroundColor: colors.LightGray,
        borderRadius: 10
    },
    dailyOffersuptoText: {
        fontFamily: fonts.medium,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5
    },
    dailyOffersContainer1: {
        height: 210,
        margin: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        alignItems: 'flex-start',
        backgroundColor: colors.DASHBOARD_PAGIING_VIEW
    },
    hpCoinOfferView: {
        flexDirection: 'row',
        backgroundColor: colors.DASHBOARD_CONTENT_VIEW,
        height: 40,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        width: '100%'
    },
    hpCoinOfferText: {
        fontFamily: fonts.bold,
        fontSize: 14,
        textAlign: 'left',
        width: '70%'
    },
    dailyOffersOffText: {
        fontFamily: fonts.heavy,
        fontSize: 12,
        color: colors.WHITE,
        textAlign: 'center'
    },
    hpViewContainer: {
        height: 210,
        // margin:10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: colors.DASHBOARD_CONTENT_VIEW
    },
    hpDescriptionText: {
        fontFamily: fonts.regular,
        fontSize: 12,
        textAlign: 'left',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },
    hpEarnText: {
        fontFamily: fonts.regular,
        fontSize: 14,
        textAlign: 'left',
        color: colors.APP_GREEN,
        margin: 10
    },
});
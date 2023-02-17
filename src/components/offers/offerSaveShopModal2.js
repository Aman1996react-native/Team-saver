import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, ScrollView,
FlatList,Platform,TouchableOpacity,TextInput,KeyboardAvoidingView } from 'react-native';
import { heightToDp, widthToDp, getDeviceWidth, getDeviceHeight } from '../../utils';
import Icons from '../../assets/icons'
import * as Labels from '../../constants'
import Modal from 'react-native-modal';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts';
import ImageComponent from '../imageComponent/imageComponent';
import Carousel , { Pagination }from 'react-native-snap-carousel';
import YellowButton from '../button';
import Config from "react-native-config";




class OfferSaveShopModal2 extends Component {

    constructor(props){
        super(props)
        this.state={
            activeSlide:0,
            selectedMerchant:this.props.selectedMerchant,
            selectedCatIndex:this.props.selectedCatIndex,
            showTerms:false

        }
    }

    renderDots = (merchant) => {
        if(typeof(merchant) != 'undefined'){
            if(typeof(merchant.OfferDetails) != 'undefined'){
                if(merchant.OfferDetails.length > 0){
                    return(
                        <FlatList
                        scrollEnabled={false}
                        numColumns={Math.floor((getDeviceWidth())/15)}
                        contentContainerStyle={{justifyContent:'center',alignItems:'center',width:getDeviceWidth() - 40,marginBottom:5}}
                        data={merchant.OfferDetails}
                        keyExtractor={(item,index) => item.Offer_ID.toString()}
                        renderItem={({item,index}) => {
                        return(
                            <View style={this.state.activeSlide == index ?
                                {width:8,height:8,backgroundColor:colors.APP_GREEN,borderRadius:4,margin:2} 
                                :
                                {width:8,height:8,backgroundColor:colors.APP_GREEN,borderRadius:4,margin:2,opacity:0.2}
                            }>
                                
                            </View>
                        )
                        }}
                        />
                    )
                }
            }
        }
    }

    renderCoins = (item) => {
        if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
            return null
        }
        if(typeof(item.Points) != 'undefined'){
            if(item.Points != null){
                return(
                    <TouchableOpacity style={{height: 18,marginTop:2,marginRight:2, alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                    {[...Array(item.Points != null ? item.Points : 0)].map((elementInArray, index) => ( 
                        <Image resizeMode='cover' style={{ width: 18, height: 18,marginLeft:-5,borderWidth:0.3,borderRadius:9,borderColor:colors.BLUE }} source={require('../../assets/images/coin_tier_gold.png')} /> 
                        ) 
                    )}
                </TouchableOpacity>
                )
            }
        }
    }

    renderDollarToPoints = (item) => {
        if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
            return null
        }
        if(typeof(item.Amount) != 'undefined'){
            if(item.Amount != null){
                return(
                    <TouchableOpacity style={{marginTop:2,marginRight:2, alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={styles.text}>$1 = {item.Amount} Points</Text>
                    </TouchableOpacity>
                )
            }
        }
    }

    _renderCarouselItem = ({item, index}) => {

        return (
            <View style={{justifyContent:'flex-start',alignItems:'center',padding:5,}}>
                
                {this.renderCoins(item)}
                {this.renderDollarToPoints(item)}

                <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                    <ImageComponent
                    resizeMode={'contain'}
                    style={{ width: 50, height: 50,marginRight:10 }}
                    imageUrl={this.props.selectedMerchant.Merchant_Image}
                    />
                    <Text style={[styles.titleText,{color:colors.BLACK,textAlign:'left',marginBottom:2}]}>{item.Name}</Text>
                </View>

                <YellowButton
                    title='Terms'
                    style={{width:'20%',margin:5,height:30}}
                    textStyle={{fontSize:12}}
                    navigate={() => {
                        if(typeof(this.props.selectedMerchant.OfferDetails[this.state.activeSlide].Terms) != 'undefined'){
                            if(this.props.selectedMerchant.OfferDetails[this.state.activeSlide].Terms != null){
                                if(this.props.selectedMerchant.OfferDetails[this.state.activeSlide].Terms.length > 0){
                                    this.setState({showTerms:true})
                                }
                            }
                        }
                    }}
                    />
                {typeof(this.props.selectedMerchant.OfferDetails[this.state.activeSlide].Rate) != 'undefined'
                ?
                <View>
                    {this.props.selectedMerchant.OfferDetails[this.state.activeSlide].Rate != null &&
                    <Text style={[styles.titleText,{color:colors.APP_GREEN,textAlign:'left',fontSize:12,marginTop:10}]}>Cashback: {this.props.selectedMerchant.OfferDetails[this.state.activeSlide].Rate}%</Text>
                    }
                </View>

                :
                <Text></Text>
                }
                
                <Text numberOfLines={8} style={styles.descriptionText}>{item.Description}</Text>
                
            </View>
        )
               
    }

    renderOffers = (merchant) => {
        if(typeof(this.state.selectedMerchant) != 'undefined'){
            if(typeof(this.props.selectedMerchant) != 'undefined'){
                if(this.state.selectedMerchant.Merchant_Name != this.props.selectedMerchant.Merchant_Name
                    || this.state.selectedCatIndex != this.props.selectedCatIndex){
                    this.setState({selectedMerchant:this.props.selectedMerchant,selectedCatIndex:this.props.selectedCatIndex,activeSlide:0})
                }
            }
        }
        if(typeof(merchant) != 'undefined'){
            if(typeof(merchant.OfferDetails) != 'undefined'){
                if(merchant.OfferDetails.length > 0){
                    return(
                    <View style={{}}>
                        <Carousel
                        //autoplay={true}
                        // loop={true}
                        activeSlideAlignment='center'
                        inactiveSlideOpacity={1.0}
                        containerCustomStyle={{maxHeight:200}}
                        contentContainerCustomStyle={{maxHeight:180,justifyContent:'flex-start',alignItems:'flex-start',paddingTop:10}}
                        ref={(c) => { this._carousel = c; }}
                        data={merchant.OfferDetails}
                        renderItem={this._renderCarouselItem}
                        sliderWidth={getDeviceWidth() - 30}
                        itemWidth={getDeviceWidth() - 30}
                        onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                        />
                            
                    </View>
                    )
                }
            }
        }
    }

    render() {

        return (
            <Modal 
            isVisible={this.props.isVisible}
            style={{ justifyContent: 'center', alignItems: 'center' }}
            backdropOpacity={0.5}
            backdropColor={'#000000'}
            onBackdropPress={() => { 
                this.setState({activeSlide:0})
                this.props.onBackdropPressed() 
                }}>
                {this.props.selectedMerchant != null &&
                    <View style={{ width: getDeviceWidth() - 30, backgroundColor: colors.White, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ height: 60, marginTop: 0, width: '100%', backgroundColor: colors.APP_GREEN, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.titleText,{fontSize:20}]}>{this.props.selectedMerchant.Merchant_Name}</Text>
                        </View>

                        {this.renderOffers(this.props.selectedMerchant)}
                        {this.renderDots(this.props.selectedMerchant)}
                        <View style={{width:'100%',justifyContent:'center',alignItems:'center',marginBottom:10}}>
                            <YellowButton title='Shop' style={{width:'80%'}}
                            navigate={() => {
                                const self = this
                                setTimeout(function() { 
                                    self.props.onShopTapped(self.props.selectedMerchant.OfferDetails[self.state.activeSlide])
                                    self.setState({activeSlide:0})
                                 }, 500)
                                
                            }}/>
                        </View>

                        

                        {!this.props.isFromSaved &&
                        <View style={{width:'100%',justifyContent:'center',alignItems:'center',marginBottom:10}}>
                           {!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd') &&
                            <YellowButton 
                            title='Save' 
                            style={{width:'80%',backgroundColor:colors.White,borderWidth:1,borderColor:colors.APP_GREEN}}
                            textStyle={{color:colors.APP_GREEN}}
                            navigate={() => {
                                const self = this
                                setTimeout(function() { 
                                    self.props.onSaveTapped(self.props.selectedMerchant.OfferDetails[self.state.activeSlide])
                                    self.setState({activeSlide:0})
                                }, 500)
                            
                            }}/>}
                        </View>
                        }
                    </View>
                    }
                    <Modal isVisible={this.state.showTerms}
                    
                    >
                        <View style={{margin:15,backgroundColor:colors.White,alignItems:'center',padding:20,borderWidth:1,borderColor:colors.APP_GREEN,borderRadius:5}}>
                            <Text style={[styles.titleText,{color:colors.APP_GREEN,textAlign:'center',fontSize:14,marginTop:10}]}>Terms</Text>
                            <Text style={[styles.titleText,{color:colors.BLACK,textAlign:'center',fontSize:14,marginTop:10}]}>{this.props.selectedMerchant.OfferDetails[this.state.activeSlide].Terms}</Text>
                            <YellowButton
                            title='Okay'
                            style={{width:'60%',margin:20,height:35}}
                            navigate={() => {
                                this.setState({showTerms:false})
                            }}
                            />
                        </View>
                    </Modal>

            </Modal>
        );
    }
}
export default OfferSaveShopModal2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
        fontSize: 14,
        color: colors.White,
        fontFamily: fonts.medium,
        textAlign:'center'
    },
    descriptionText: {
        fontSize: 12,
        fontFamily: fonts.regular,
        textAlign:'center',
        marginRight:10,
        marginLeft:10,
        marginTop:15
    },
    text: {
        fontSize: 16,
        fontFamily: fonts.medium,
    },
});
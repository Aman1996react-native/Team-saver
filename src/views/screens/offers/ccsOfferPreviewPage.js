import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import fonts from '../../../assets/fonts';
import colors from '../../../utils/colors';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ImageComponent from '../../../components/imageComponent/imageComponent';
import { getDeviceHeight, getDeviceWidth } from '../../../utils';
import YellowButton from '../../../components/button';
import EncryptedStorage from 'react-native-encrypted-storage';
import Modal from 'react-native-modal';
import { connect } from 'react-redux'
import { CheckAccessTokenExpiryTime } from '../../../redux/actionCreators/checkAccessTokenExpiry';
import { OffersActionCreator } from '../../../redux/actionCreators/app/offers';
import { OtherAPIActionCreator } from '../../../redux/actionCreators/app/otherAPIs';
import DeviceSecurity from 'react-native-device-security';
import RNExitApp from 'react-native-exit-app';
import usbDubbingCheck, {UsbDubbingFunction} from '../maintainanceAndForceUpdate/usbDubbingCheck';


const mapStateToProps = (state) => ({

    loading: state.GetWoolworthDetailsReducer.loading,
    request: state.GetWoolworthDetailsReducer.request,
    response: state.GetWoolworthDetailsReducer.response,

})


class CcsOfferPreviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0,
            selectedMerchant: this.props.route.params.selectedMerchant,
            selectedCatIndex: this.props.route.params.selectedCatIndex,
            showTerms: false,
            woolWorthTargetUrl: null,
            isVisible: false,
            terms: '',
            termstitle: '',
            specialCashbackTerms: '',
            specialCashbackTermsTitle: ''
        };
    }

    componentDidMount(){
        this.props.navigation.addListener('focus', this._onFocus);
    }

    _onFocus = async () =>{
        UsbDubbingFunction()
    //     let data =  await DeviceSecurity.isAdbEnabled()
    //     if (data){
    //        Alert.alert(
    //            "Confirmation",
    //            "Please disable your device usb dubbing mode.",
    //            [
    //              { text: "OK", onPress: () => RNExitApp.exitApp()
    //            }
    //            ]
    //          );
    //    }
       
              
    }

    componentDidUpdate(prevProps) {
        const res = this.props.response

        if (typeof (res) != 'undefined') {
            if (Object.keys(res).length > 0) {
                if (typeof (res.ClientID) != 'undefined') {
                    if (typeof (res.MemberclientTokenId) != 'undefined' && typeof (res.UniqueID) != 'undefined') {
                        if (typeof (res.Status) != 'undefined') {
                            if (res.Status == 'Success') {
                                if (this.state.woolWorthTargetUrl != null) {
                                    this.props.navigation.navigate('ProductSite', {
                                        targetUrl: this.state.woolWorthTargetUrl,
                                        ClientID: res.ClientID,
                                        MemberclientTokenId: res.MemberclientTokenId,
                                        UniqueID: res.UniqueID
                                    })
                                    this.props.dispatch(OtherAPIActionCreator.resetWoolworthDetails())
                                }


                            }
                        }
                    }
                }
            }
        }
    }

    checkHowToRenderTersmsButtons = () => {
        const viewStyle = { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }
        const buttonStyle = { width: '46%', marginBottom: 10, marginTop: 10 }
        const buttonTextStyle = {
            fontSize: 15,
            margin: 5,
            fontWeight: '400',
            lineHeight: 22,
            color: colors.BUTTON_TEXT_COLOUR,
            alignSelf: "center",
            fontFamily: fonts.buttonTextFont
        }

        const singleButtonTextStyle = {
            fontSize: 18,
            margin: 5,
            fontWeight: '400',
            lineHeight: 22,
            color: colors.BUTTON_TEXT_COLOUR,
            alignSelf: "center",
            fontFamily: fonts.buttonTextFont
        }
        const singleButtonStyle = { width: '60%', marginBottom: 10, marginTop: 10, alignSelf: 'center' }

        if (typeof (this.props.route) != 'undefined') {
            if (typeof (this.props.route.params) != 'undefined') {
                if (typeof (this.props.route.params.selectedMerchant.OfferDetails[this.state.activeSlide].Terms) != 'undefined') {
                    if (this.props.route.params.selectedMerchant.OfferDetails[this.state.activeSlide].Terms != null) {
                        if (this.props.route.params.selectedMerchant.OfferDetails[this.state.activeSlide].Terms.length > 0) {
                            return (
                                <View>
                                    {this.renderTermsButtons(viewStyle, true, buttonStyle, buttonTextStyle)}
                                </View>
                            )
                        }
                    }
                }
            }
        }

        return (
            <View>
                {this.renderTermsButtons(viewStyle, false, singleButtonStyle, singleButtonTextStyle)}
            </View>
        )
    }

    renderTermsButtons = (viewStyle, shouldShowOfferTermsButton, buttonStyle, buttonTextStyle) => {
        return (
            <View style={viewStyle}>
                <YellowButton
                    title='CASHBACK TERMS'
                    style={buttonStyle}
                    textStyle={buttonTextStyle}
                    navigate={() => {
                        if (typeof (this.props.route) != 'undefined') {
                            if (typeof (this.props.route.params) != 'undefined') {
                                if (typeof (this.props.route.params.selectedMerchant.CashbackTerms) != 'undefined') {
                                    if (this.props.route.params.selectedMerchant.CashbackTerms != null) {
                                        if (this.props.route.params.selectedMerchant.CashbackTerms.length > 0) {
                                            let cashbackTerms = this.props.route.params.selectedMerchant.CashbackTerms
                                            let specialCashbackTermsTitle = ''
                                            let specialCashbackTerms = ''

                                            if (typeof (this.props.route.params.selectedMerchant.SplCashbackTerms) != 'undefined') {
                                                if (this.props.route.params.selectedMerchant.SplCashbackTerms != null) {
                                                    if (this.props.route.params.selectedMerchant.SplCashbackTerms.length > 0) {
                                                        specialCashbackTerms = this.props.route.params.selectedMerchant.SplCashbackTerms
                                                        specialCashbackTermsTitle = 'Special Cashback Terms'
                                                    }
                                                }
                                            }

                                            this.setState({
                                                terms: this.props.route.params.selectedMerchant.CashbackTerms,
                                                termstitle: 'Cashback Terms', specialCashbackTermsTitle: specialCashbackTermsTitle, specialCashbackTerms: specialCashbackTerms
                                            }, () => {
                                                this.setState({ isVisible: true })
                                            })
                                        }
                                    }
                                }
                            }
                        }


                    }}
                />
                {shouldShowOfferTermsButton &&
                    <YellowButton
                        title='OFFER TERMS'
                        style={buttonStyle}
                        textStyle={buttonTextStyle}
                        navigate={() => {
                            if (typeof (this.props.route) != 'undefined') {
                                if (typeof (this.props.route.params) != 'undefined') {
                                    if (typeof (this.props.route.params.selectedMerchant.OfferDetails[this.state.activeSlide].Terms) != 'undefined') {
                                        if (this.props.route.params.selectedMerchant.OfferDetails[this.state.activeSlide].Terms != null) {
                                            if (this.props.route.params.selectedMerchant.OfferDetails[this.state.activeSlide].Terms.length > 0) {
                                                this.setState({ terms: this.props.route.params.selectedMerchant.OfferDetails[this.state.activeSlide].Terms, termstitle: 'Offer Terms' }, () => {
                                                    this.setState({ isVisible: true })
                                                })
                                            }
                                        }
                                    }
                                }
                            }


                        }}
                    />}
            </View>
        )
    }

    renderCashbackRate = () => {
        const item = this.props.route.params.selectedMerchant.OfferDetails[this.state.activeSlide]
        console.warn('CLICKED: ' +JSON.stringify(item))
        if (typeof (item) != 'undefined') {
            if (item != null) {
                if (typeof (item.Rate) != 'undefined') {
                    if (item.Rate != null) {
                        if (typeof (item.CommissionType) != 'undefined') {
                            if (item.CommissionType != null) {
                                if (item.CommissionType == '' || item.CommissionType == 'PERCENT') {
                                    return (
                                        <Text style={[styles.titleText, { color: colors.APP_GREEN, textAlign: 'left', fontSize: 16, marginTop: 10 }]}>Cashback: Up to {item.Rate}%</Text>
                                    )
                                } else {
                                    return (
                                        <Text style={[styles.titleText, { color: colors.APP_GREEN, textAlign: 'left', fontSize: 16, marginTop: 10 }]}>Cashback: Up to ${item.Rate}</Text>
                                    )
                                }
                            } else {

                            }
                        }
                    }
                }
            }
        }
    }


    _renderCarouselItem = ({ item, index }) => {

        return (
            <View style={{
                justifyContent: 'flex-start', width: getDeviceWidth() - 20, margin: 10, backgroundColor: colors.WHITE,
                borderTopRightRadius: 10, borderTopLeftRadius: 10
            }}>
                <ImageComponent
                    style={{ width: 150, height: 150, marginTop: 10, marginBottom: 15, alignSelf: 'center' }}
                    resizeMode={'contain'}
                    imageUrl={this.props.route.params.selectedMerchant.Merchant_Image}
                />
                <View style={{ width: '100%', paddingLeft: 10, paddingRight: 10, marginBottom: 15 }}>
                    <Text style={
                        [styles.titleText, { color: colors.BLACK, textAlign: 'left', marginBottom: 2, marginTop: 10, marginBottom: 10 }
                        ]}>{this.props.route.params.selectedMerchant.Merchant_Name}</Text>

                    {this.checkHowToRenderTersmsButtons()}
                    <Text style={[styles.titleText, { textAlign: 'left', fontSize: 16, marginTop: 10, fontFamily: fonts.regular, marginBottom: 15 }]}>
                        {item.Description}
                    </Text>


                    {typeof (this.props.route.params.selectedMerchant.OfferDetails[this.state.activeSlide].Rate) != 'undefined'
                        ?
                        <View>
                            {this.renderCashbackRate()}
                            {/* {this.props.route.params.selectedMerchant.OfferDetails[this.state.activeSlide].Rate != null &&
                                <Text style={[styles.titleText, { color: colors.APP_GREEN, textAlign: 'left', fontSize: 12, marginTop: 10 }]}>Cashback: Up to {this.props.route.params.selectedMerchant.OfferDetails[this.state.activeSlide].Rate}%</Text>
                            } */}
                        </View>

                        :
                        null
                    }

                </View>


                <YellowButton
                    title='SHOP NOW'
                    style={{ width: '60%', alignSelf: 'center', marginTop: 20, marginBottom: 20 }}
                    navigate={() => {
                        const self = this
                        setTimeout(() => {
                            const item = self.props.route.params.selectedMerchant.OfferDetails[self.state.activeSlide]
                            console.warn(JSON.stringify(item))
                            if (typeof (item.TargetURL) != 'undefined') {
                                if (item.TargetURL != null) {
                                    if (item.TargetURL != '') {

                                        EncryptedStorage.getItem('userId', async (res, err) => {
                                            if (res) {
                                                await CheckAccessTokenExpiryTime('Offers2Page')
                                                self.props.dispatch(OffersActionCreator.shopClickApi(res, item.Offer_ID, item.Name))
                                            }
                                        })
                                        if (item.TargetURL.includes('woolworths')) {
                                            EncryptedStorage.getItem('userId', (res, err) => {
                                                if (res) {
                                                    this.setState({ woolWorthTargetUrl: item.TargetURL })
                                                    self.props.dispatch(OtherAPIActionCreator.getWoolworthDetails(res))
                                                }
                                            })

                                        } else {
                                            self.props.navigation.navigate('ProductSite', {
                                                targetUrl: item.TargetURL,
                                                ClientID: null,
                                                MemberclientTokenId: null,
                                                UniqueID: null
                                            })
                                        }
                                        // self.props.navigation.navigate('OfferPreview',{ item: item,LogoUrl:self.state.selectedMerchant.Merchant_Image })
                                    }
                                }
                            }
                        }, 500);
                    }}
                />

            </View>
        )

    }

    renderOffers = (merchant) => {
        if (typeof (this.state.selectedMerchant) != 'undefined') {
            if (typeof (this.props.route.params.selectedMerchant) != 'undefined') {
                if (this.state.selectedMerchant.Merchant_Name != this.props.route.params.selectedMerchant.Merchant_Name
                    || this.state.selectedCatIndex != this.props.route.params.selectedCatIndex) {
                    this.setState({ selectedMerchant: this.props.route.params.selectedMerchant, selectedCatIndex: this.props.route.params.selectedCatIndex, activeSlide: 0 })
                }
            }
        }
        if (typeof (merchant) != 'undefined') {
            if (typeof (merchant.OfferDetails) != 'undefined') {
                if (merchant.OfferDetails.length > 0) {
                    return (
                        // <View style={{}}>
                        <Carousel
                            activeSlideAlignment='center'
                            inactiveSlideOpacity={1.0}
                            containerCustomStyle={{}}
                            contentContainerCustomStyle={{ justifyContent: 'flex-start', alignItems: 'center', }}
                            ref={(c) => { this._carousel = c; }}
                            data={merchant.OfferDetails}
                            renderItem={this._renderCarouselItem}
                            sliderWidth={getDeviceWidth()}
                            itemWidth={getDeviceWidth()}
                            onSnapToItem={(index) => this.setState({ activeSlide: index })}
                        />

                        // </View>
                    )
                }
            }
        }
    }

    renderDots = (merchant) => {
        if (typeof (merchant) != 'undefined') {
            if (typeof (merchant.OfferDetails) != 'undefined') {
                if (merchant.OfferDetails.length > 0) {
                    return (
                        <FlatList
                            scrollEnabled={false}
                            numColumns={Math.floor((getDeviceWidth()) / 15)}
                            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', width: getDeviceWidth() - 40, marginBottom: 5 }}
                            data={merchant.OfferDetails}
                            keyExtractor={(item, index) => item.Offer_ID.toString()}
                            contentContainerStyle={{ alignItems: 'center' }}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={this.state.activeSlide == index ?
                                        { width: 10, height: 10, backgroundColor: colors.GREY, borderRadius: 5, margin: 2 }
                                        :
                                        { width: 10, height: 10, backgroundColor: colors.WHITE, borderRadius: 5, margin: 2, borderWidth: 1 }
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

    renderCashbacktimeframe = (merchant) => {
        if (typeof (merchant) != 'undefined') {
            if (typeof (merchant.CashbackTimeframe) != 'undefined') {
                if (merchant.CashbackTimeframe != null) {
                    if (merchant.CashbackTimeframe.length > 0) {
                        return (
                            <View style={{
                                width: getDeviceWidth() - 40, margin: 20, borderWidth: 2,
                                borderRadius: 10, borderStyle: 'dashed', borderColor: colors.GREY, padding: 15,
                            }}>
                                <Text style={[styles.timeframeText, { fontFamily: fonts.bold, marginBottom: 10 }]}>Cashback Timeframe</Text>
                                <Text style={styles.timeframeText}>{merchant.CashbackTimeframe}</Text>
                            </View>
                        )
                    }

                }
            }
        }
    }



    render() {
        const item = this.props.route.params.selectedMerchant
        console.warn(JSON.stringify(item))
        // return null
        return (
            <View style={styles.container}>
                <Modal
                    isVisible={this.state.isVisible}>

                    <View style={{
                        backgroundColor: colors.WHITE, padding: 15, maxHeight: getDeviceHeight() / 1.5,
                        borderRadius: 15
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ isVisible: false })
                            }}>
                            <Image
                                resizeMode='contain'
                                style={{ width: 32, height: 32, alignSelf: 'flex-end', marginBottom: 10 }}
                                source={require('../../../assets/images/close_round.png')}
                            />
                        </TouchableOpacity>

                        <ScrollView>
                            <Text style={[styles.titleText, { fontSize: 16, marginBottom: 10, color: colors.APP_GREEN }]}>{this.state.termstitle}</Text>
                            <Text>
                                {/* {this.props.route.params.selectedMerchant.OfferDetails[this.state.activeSlide].Terms} */}
                                {this.state.terms}

                            </Text>
                            <Text style={[styles.titleText, { fontSize: 16, marginBottom: 10, color: colors.APP_GREEN, marginTop: 15 }]}>{this.state.specialCashbackTermsTitle}</Text>
                            <Text>
                                {/* {this.props.route.params.selectedMerchant.OfferDetails[this.state.activeSlide].Terms} */}
                                {this.state.specialCashbackTerms}

                            </Text>
                        </ScrollView>

                    </View>
                </Modal>
                <ScrollView contentContainerStyle={{}}>
                    {this.renderOffers(item)}
                    {this.renderDots(item)}
                    {this.renderCashbacktimeframe(item)}
                </ScrollView>
            </View>
        );
    }
}
export default connect(mapStateToProps)(CcsOfferPreviewPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    titleText: {
        fontSize: 18,
        color: colors.BLACK,
        fontFamily: fonts.bold,
        textAlign: 'center'
    },
    descriptionText: {
        fontSize: 13,
        fontFamily: fonts.regular,
        textAlign: 'center',
        marginRight: 10,
        marginLeft: 10,
        marginTop: 15
    },
    timeframeText: {
        fontSize: 13,
        fontFamily: fonts.regular,
        textAlign: 'left',
    },
    text: {
        fontSize: 16,
        fontFamily: fonts.medium,
    },
});

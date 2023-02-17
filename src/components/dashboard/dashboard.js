import React, { Component } from "react";
import {
    View,
    Text,
    FlatList,
    SectionList,
    Image,
    Easing,
    TouchableOpacity,
    Platform,
    ImageBackground,
    StyleSheet,
    Settings,
    DevSettings
} from "react-native";

import Carousel, { Pagination } from 'react-native-snap-carousel';
import fonts from "../../assets/fonts";
import { getDeviceWidth, widthToDp } from "../../utils";
import colors from "../../utils/colors";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icons from "../../assets/icons/Icons"

import DashboardJson from '../../helpers/dashboard.json'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import Config from "react-native-config";
import YellowButton from "../button";
import ImageComponent from "../imageComponent/imageComponent";
import ImageBackgroundComponent from "../imageComponent/imageBackgroundComponent";
import Modal from 'react-native-modal';
import DeviceSecurity from "react-native-device-security";




class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeSlide: 0,
            showProgressBarDetails: false,
            viewWidth : 0

        }
    }

  async  componentDidMount() {
   
    }
    
    _renderItemDailyOffers = ({ item, index }) => {
      
        return (
            <TouchableOpacity
                onPress={() => {
                    if (typeof (item.URL) != 'undefined') {
                        if (item.URL != null) {
                            this.props.onTilesTapped(item)

                        }
                    }
                }}
                style={{ alignItems: 'center', backgroundColor: colors.WHITE, borderRadius: 10, height: 250, marginRight: 10 }}>

                {/* <ImageBackgroundComponent
                    resizeMode='stretch'
                    resizeMethod={'auto'}
                    imageUrl={item.Image + `?${new Date()}`}
                    style={{width:'100%',overflow:'hidden',height:125,borderTopLeftRadius:10,borderTopRightRadius:10,
                    justifyContent:'flex-end',}}
                    >
                        <View style={{paddingBottom:5,justifyContent:'flex-end',position: 'absolute', top: 0,left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
                            <Text style={styles.dailyOffersOffText}>{item.Title}</Text>
                        </View>
                    </ImageBackgroundComponent> */}
                {/* <View style={{justifyContent:'center',alignItems:'center',padding:10}}> */}
                <ImageComponent
                    // resizeMode='stretch'
                    imageUrl={item.Image + `?${new Date()}`}
                    style={{ width: '100%', height: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                // style={{ width: undefined, height: undefined, borderTopLeftRadius: 10, borderTopRightRadius: 10, }}
                />
                {/* <Text style={styles.dailyOffersuptoText}>{item.Description}</Text> */}
                {/* </View> */}

            </TouchableOpacity>
        )

        return (
            <TouchableOpacity
                onPress={() => {
                }}
                style={{ alignItems: 'center', backgroundColor: colors.WHITE, borderRadius: 10, height: 250, marginRight: 10 }}>
                <ImageBackground resizeMethod={'resize'}
                    source={Icons[item.backgroundImage]}
                    style={{
                        width: '100%', overflow: 'hidden', height: 125, borderTopLeftRadius: 10, borderTopRightRadius: 10,
                        justifyContent: 'flex-end',
                    }}>
                    <View style={{ paddingBottom: 5, justifyContent: 'flex-end', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center' }}>
                        <Text style={styles.dailyOffersOffText}>{item.off_text}</Text>
                    </View>
                </ImageBackground>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                    <Image style={{ width: 70, height: 35, marginTop: 10, marginBottom: 5 }} resizeMode="stretch" source={Icons[item.image]} />
                    <Text style={styles.dailyOffersuptoText}>{item.earn_upto}</Text>
                </View>

            </TouchableOpacity>
        )

    }

    _renderItemCommunities = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    EncryptedStorage.getItem('userId', (res, err) => {
                        if (res) {
                            if (res.toString() == item.user_id.toString()) {
                                this.props.navigation.navigate('CommunityDesc', { item: item, fromProfile: false, isEditable: true })
                            } else {
                                this.props.navigation.navigate('CommunityDesc', { item: item, fromProfile: false, isEditable: false })
                            }
                        }
                    })

                }}
                style={{ alignItems: 'center', backgroundColor: colors.WHITE, borderRadius: 10, height: 200, marginRight: 10 }}>
                <ImageBackground resizeMethod={'resize'}
                    source={{ uri: `data:image/png;base64,${item.CoverImage}` }}
                    style={{
                        width: '100%', overflow: 'hidden', height: 125, borderTopLeftRadius: 10, borderTopRightRadius: 10,
                        justifyContent: 'flex-end',
                    }}>
                    <View style={{ paddingBottom: 5, justifyContent: 'flex-end', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center' }}>
                        <Text style={[styles.dailyOffersOffText, { color: colors.BLACK }]}>{item.Name}</Text>
                    </View>
                </ImageBackground>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                    <Text style={styles.dailyOffersuptoText}>{item.Description}</Text>
                </View>

            </TouchableOpacity>
        )

    }

    renderHeroTiles = (heroTiles) => {
        console.log('HERO TILES?', heroTiles)
        // const heroTiles = this.props.heroTiles1
        if (typeof (heroTiles) != 'undefined') {
            if (heroTiles.length > 0) {
                return (
                    // <View style={[styles.hpViewContainer]}>

                    <Carousel
                        activeSlideAlignment={'start'}
                        inactiveSlideOpacity={1}
                        inactiveSlideScale={1}
                        containerCustomStyle={{ backgroundColor: 'transporaarent' }}
                        contentContainerCustomStyle={{ justifyContent: 'flex-start' }}
                        ref={(c2) => { this._carousel = c2; }}
                        data={heroTiles}
                        renderItem={this._renderItemHeroTiles}
                        sliderWidth={getDeviceWidth()}
                        itemWidth={getDeviceWidth()}
                    />



                    // </View>
                )
            }
        }


    }

    _renderItemHeroTiles = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.hpViewContainer}
                onPress={() => {
                    this.props.onTilesTapped(item)
                }}>
                <ImageComponent
                 imageUrl={item.Image + `?${new Date()}`}
                // imageUrl = {}
                    // resizeMode='stretch'
                    resizeMethod='resize'
                    style={{ width: '100%', height: '100%', borderTopLeftRadius: 15, borderTopRightRadius: 15, }}
                />
            </TouchableOpacity>
        )

    }

    keyExtractor = (item, index) => index.toString()

    renderSectionItem = ({ item, index }) => {

        const isDashboard = this.props.isDashboard

        if (item.id == 1) {
            if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
                return null
            }
            return (
                <View style={isDashboard ? styles.savingsView : [styles.savingsView, { marginTop: 30 }]}>
                    <View style={styles.savingsView1}>
                        <Image style={{ width: 28, height: 28, tintColor: colors.APP_GREEN }} source={require('../../assets/images/newicons/dollar.png')} />
                        <Text style={styles.savingsText}>Savings:</Text>
                    </View>
                    <View style={styles.savingView2}>
                        <Text style={isDashboard ? styles.dollarText : [styles.dollarText, { color: BLUISH }]}>{DashboardJson.savings_resource.saved_money}</Text>
                        <Text style={styles.savedWithWalletText}>saved with wallet</Text>
                    </View>
                </View>
            )
        }

        if (item.id == 2) {
            if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
                return null
            }
            return (
                <TouchableOpacity style={!Config.ENV.includes('ccs') ? styles.howDoiIncreaseButton : styles.howDoiIncreaseButton2}
                    onPress={() => {
                        this.props.navigation.navigate('AddCoin')
                    }}>
                    {!Config.ENV.includes('ccs') &&
                        <Image style={[{ width: 50, height: 50 },]} source={require('../../assets/images/coin_tier_gold.png')} />}
                    <Text style={!Config.ENV.includes('ccs') ? styles.howDoIText : [styles.howDoIText, { color: colors.APP_GREEN }]}>HOW DO I INCREASE MY POINTS?</Text>
                    {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                        <Image resizeMode='contain' style={{ width: 30, height: 30 }} source={require('../../assets/images/bird_green.png')} />}
                    <Image style={!Config.ENV.includes('ccs') ? { tintColor: colors.White } : { tintColor: colors.APP_GREEN }} source={require('../../assets/images/right-arrow.png')} />
                </TouchableOpacity>
            )
        }

        if (item.id == 10) {
            const heroTile = this.props.heroTile1
            if (typeof (heroTile) != 'undefined') {
                if (heroTile != null) {
                    if (heroTile.length > 0) {
                        if (typeof (heroTile[0]) != 'undefined') {
                            return (
                                <View>
                                    {this.renderHeroTiles(heroTile)}
                                </View>
                            )
                        }

                    }
                }
            }
            return null
        }

        if (item.id == 4) {
            let dailyOffersData = []

            const dailyOffers = this.props.dailyOffers
            if (typeof (dailyOffers) != 'undefined') {
                if (dailyOffers != null) {
                    if (dailyOffers.length > 0) {
                        dailyOffersData = dailyOffers
                    }
                }
            }

            // console.warn(getDeviceWidth())


            return (
                <View style={[styles.dailyOffersContainer1, { width: getDeviceWidth() - 20 }]}>
                    <View style={styles.hpCoinOfferView}>
                        <Text style={[styles.hpCoinOfferText, { color: colors.WHITE }]}>FEATURED OFFERS</Text>
                    </View>
                    <View style={{ width: '100%' }}>
                        {dailyOffersData.length < 1
                            ?
                            <View style={{ marginTop: 40, alignSelf: 'center', width: '100%', height: '50%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[styles.hpCoinOfferText, { textAlign: 'center' }]}>No Daily Offers to display</Text>
                            </View>
                            :
                            <Carousel
                                activeSlideAlignment={'start'}
                                inactiveSlideOpacity={1}
                                loop={true}
                                inactiveSlideScale={1}
                                containerCustomStyle={{ backgroundColor: 'transparent' }}
                                contentContainerCustomStyle={{ marginLeft: 10, marginTop: 10 }}
                                ref={(c2) => { this._carousel = c2; }}
                                data={dailyOffersData}
                                renderItem={this._renderItemDailyOffers}
                                sliderWidth={getDeviceWidth() - 20}
                                itemWidth={190}
                            />
                        }
                    </View>


                </View>
            )
        }

        if (item.id == 7) {
            let popularOffersData = []

            const popularOffers = this.props.popularOffers
            if (typeof (popularOffers) != 'undefined') {
                if (popularOffers != null) {
                    if (popularOffers.length > 0) {
                        popularOffersData = popularOffers
                    }
                }
            }

            return (
                <View style={[styles.dailyOffersContainer1, { width: getDeviceWidth() - 20 }]}>
                    <View style={styles.hpCoinOfferView}>
                        <Text style={[styles.hpCoinOfferText, { color: colors.WHITE }]}>POPULAR OFFERS</Text>
                    </View>
                    <View style={{ width: '100%' }}>
                        {popularOffersData.length < 1
                            ?
                            <View style={{ marginTop: 40, alignSelf: 'center', width: '100%', height: '50%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[styles.hpCoinOfferText, { textAlign: 'center' }]}>No Popular Offers to display</Text>
                            </View>
                            :
                            <Carousel
                                activeSlideAlignment={'start'}
                                loop={true}
                                inactiveSlideOpacity={1}
                                inactiveSlideScale={1}
                                containerCustomStyle={{ backgroundColor: 'transparent' }}
                                contentContainerCustomStyle={{ marginLeft: 10, marginTop: 10 }}
                                ref={(c2) => { this._carousel = c2; }}
                                data={popularOffersData}
                                renderItem={this._renderItemDailyOffers}
                                sliderWidth={getDeviceWidth() - 20}
                                itemWidth={190}
                            />
                        }
                    </View>


                </View>
            )
        }

        if (item.id == 11) {
            const heroTile = this.props.heroTile2
            if (typeof (heroTile) != 'undefined') {
                if (heroTile != null) {
                    if (heroTile.length > 0) {
                        if (typeof (heroTile[0]) != 'undefined') {
                            return (
                                <View>
                                    {this.renderHeroTiles(heroTile)}
                                </View>
                            )
                        }

                    }
                }
            }
            return null
        }





        if (item.id == 5) {
            if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
                return null
            }
            return (
                <TouchableOpacity style={styles.hpViewContainer}
                    onPress={() => {
                        this.props.navigation.navigate('Challenge', { balance: this.props.balanceRes })
                    }}>
                    <View style={styles.hpCoinOfferView}>
                        <Text style={styles.hpCoinOfferText}>CHALLENGE ACCEPTED!</Text>
                    </View>
                    <Image style={{ width: '100%', height: 170, marginRight: 5 }} source={Icons[DashboardJson.challenge_accepted_resource.image]} />
                    <Text style={styles.hpDescriptionText}>{DashboardJson.challenge_accepted_resource.description}</Text>
                </TouchableOpacity>
            )
        }

        if (item.id == 6) {
            if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
                return null
            }
            return (
                <View style={[styles.dailyOffersContainer1, { height: 280 }]}>
                    <View style={styles.hpCoinOfferView}>
                        <Text style={styles.hpCoinOfferText}>COMMUNITIES</Text>
                    </View>
                    <Carousel
                        activeSlideAlignment={'start'}
                        inactiveSlideOpacity={1}
                        inactiveSlideScale={1}
                        containerCustomStyle={{ backgroundColor: 'transparent' }}
                        contentContainerCustomStyle={{ marginLeft: 10, marginTop: 10 }}
                        ref={(c2) => { this._carousel = c2; }}
                        data={this.props.communities}
                        renderItem={this._renderItemCommunities}
                        sliderWidth={getDeviceWidth()}
                        itemWidth={getDeviceWidth() / 2.2}
                    />
                </View>
            )
        }

        return null

    }

    _renderCarouselItem = ({ item, index }) => {

        var balance = this.props.balance

        let pendingBalance = this.props.pending

        if (typeof (balance) != 'undefined') {
            if (balance == null || balance == '0') {
                balance = '1'
            }
        } else {
            balance = '1'
        }

        if (typeof (pendingBalance) != 'undefined') {
            if (pendingBalance == null || pendingBalance == '0') {
                pendingBalance = '0'
            }
        } else {
            pendingBalance = '0'
        }


        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <View style={styles.pagingView}>
                    {item.id == 1
                        ?
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                this.props.navigation.navigate('Gifts')
                            }}>
                            <AnimatedCircularProgress
                                size={getDeviceWidth() / 2}
                                easing={Easing.circle}
                                duration={1000}
                                width={14}
                                fill={(this.props.balance != null && this.props.balance != '0.00') ? 100 * (Number(balance)) / (Number(balance) + Number(pendingBalance)) : 0}
                                lineCap={'round'}
                                rotation={360}
                                tintColor={colors.TAB_COLOR}
                                onAnimationComplete={() => console.log('onAnimationComplete')}
                                backgroundColor={colors.CIRCULAR_PROGRESSBAR_BACKGROUND}>
                                {
                                    () => (
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={styles.coinBalanceText}>BALANCE</Text>
                                            {this.props.balance != null ?
                                                <Text style={styles.coinBalanceValue}>{this.props.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                                :
                                                <Text style={styles.coinBalanceValue}>0</Text>
                                            }

                                            {pendingBalance == '1' ?
                                                <Text style={styles.pending}>0 Pending</Text>
                                                :
                                                <Text style={styles.pending}>{this.props.pending} Pending</Text>
                                            }
                                        </View>

                                    )
                                }
                            </AnimatedCircularProgress>
                        </TouchableOpacity>

                        :

                        <TouchableOpacity style={styles.pagingView}
                            onPress={() => {
                                this.props.navigation.navigate('TopUp')
                            }}>
                            <Text style={styles.coinBalanceText}>mWallet BALANCE</Text>
                            {this.props.amount != null ?
                                <Text style={styles.coinBalanceValue}>${Number(this.props.amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                :
                                <Text style={styles.coinBalanceValue}>$0.00</Text>
                            }
                        </TouchableOpacity>
                    }
                </View>
            </View>
        );
    }

    get pagination() {
        return (
            <View style={{
                height: 10, marginTop: 2,
                marginBottom: 5,
            }}>
                <Pagination
                    dotsLength={2}
                    activeDotIndex={this.state.activeSlide}
                    containerStyle={{ width: 10, marginTop: -35 }}
                    dotContainerStyle={{ height: 10, width: 10 }}
                    dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginHorizontal: 0,
                        backgroundColor: colors.APP_GREEN
                    }}
                    inactiveDotStyle={{

                    }}
                    inactiveDotOpacity={0.2}
                    inactiveDotScale={1}
                />
            </View>
        );
    }

    renderProgressBarForCCS = (balance, pendingBalance, isPrimary) => {

        const targetAmt = this.props.balanceRes.TargetAmount
        let targetAmount = 1
        let remainingPercentage = 0
        let remainingTargetText = 'You are 0% towards achieving \n your goal.'
        let remainingFill = 0
        let pending = '0'
        if (typeof (pendingBalance) != 'undefined') {
            if (pendingBalance != null) {
                pending = `${pendingBalance}`
            }
        }

        if (typeof (targetAmt) != 'undefined') {
            if (targetAmt != null) {
                targetAmount = Number(targetAmt.toString())
                if (this.props.balance != null && this.props.balance != '0.00') {
                    remainingPercentage = parseFloat((100 * Number(this.props.balance) / targetAmount)).toFixed(0)
                    remainingFill = parseFloat((100 * Number(this.props.balance) / targetAmount))
                    if (remainingPercentage >= 100) {
                        remainingTargetText = 'You have achieved your target. Increase the target again and aim for it.'
                    } else {
                        remainingTargetText = `You are ${remainingPercentage}% towards achieving your goal.`
                    }
                }
            }
        }

        const onLayout =(event) => {
            const {x, y, height, width} = event.nativeEvent.layout;
            console.log('width is', width)
            
            this.setState({viewWidth : width})
            
        }

        return (
            <View style={{ backgroundColor: 'transaprent', width: '100%', alignItems: 'center', }}>
                <View style={{ width: '100%', height: 120, backgroundColor: colors.APP_GREEN }}>

                </View>
                <View onLayout={onLayout} style={{ width: '70%',paddingBottom:30, backgroundColor: colors.WHITE, marginTop: -40, borderRadius: 15, height : 220 }}>
                    <Image
                        source={require('../../assets/images/coins.png')}
                        style={{ width: 100, height: 100, marginLeft: -20, marginTop: -20, position : 'absolute', left : '40%', top : -60}}
                        resizeMode='contain'
                    />
                    {!isPrimary &&
                        <View>
                            {this.props.balance != null
                                ?
                                <View style = {{}}>
                                    <Text style={[styles.coinBalanceValue, { marginTop: 5, textAlign: 'center',fontFamily:fonts.buttonTextFont,fontSize:40 }]}>${this.props.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                    <Text style={[styles.coinBalanceValue, { marginTop: 10, fontSize: 17, color: Config.pendingBalanceColour, textAlign: 'center' }]}>${pending.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Pending</Text>
                                </View>


                                :
                                <Text style={[styles.coinBalanceValue, { marginTop: 5 }]}>$0</Text>
                            }
                        </View>
                    }
                    {isPrimary &&
                        <View>
                            {this.props.balanceRes.TargetAmount != null
                                ?
                                <View style={{ justifyContent: 'center', alignItems: 'center',marginTop: 30 }}>
                                    <Text style={[styles.coinBalanceText,{fontFamily:fonts.regular,fontSize:14}]}>{this.props.balanceRes.GoalName}</Text>
                                    <Text style={[styles.coinBalanceText,{fontFamily:fonts.regular,fontSize:14,marginTop:10}]}>${this.props.balanceRes.TargetAmount}</Text>
                                    {this.props.balance != null
                                        ?
                                        <View>
                                            <Text style={[styles.coinBalanceValue, { marginTop: 5, textAlign: 'center',fontFamily:fonts.buttonTextFont,fontSize:40 }]}>${this.props.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                            <Text style={[styles.coinBalanceValue, { marginTop: 10, fontSize: 17, color: '#69CAD9', textAlign: 'center' }]}>${pending.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Pending</Text>
                                        </View>


                                        :
                                        <Text style={[styles.coinBalanceValue, { marginTop: 5, textAlign: 'center',fontFamily:fonts.buttonTextFont,fontSize:40 }]}>$0.00</Text>
                                    }

                                    {this.props.balance != null
                                        ?
                                        <View>
                                            <Text style={[styles.coinBalanceValue, {color: colors.BLACK, fontSize: 15, textAlign: 'center',margin:5,marginTop:15, lineHeight : 20 }]}>{remainingTargetText}</Text>
                                        </View>

                                        :
                                        <Text style={[styles.coinBalanceValue, {color: colors.BLACK, fontSize: 15, textAlign: 'center',margin:5,marginTop:15 }]}>{remainingTargetText}</Text>
                                    }
                                </View>
                                :
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <YellowButton
                                        title='Add Target'
                                        style={{ alignSelf: 'center', width: 120, height: 35,marginTop:-20 }}
                                        textStyle={{ fontSize: 15 }}
                                        navigate={() => {
                                            this.props.navigation.reset({
                                                index: 0,
                                                routes: [
                                                    {
                                                        name: 'Profile',
                                                        params: { someParam: 'Param1' },
                                                    },
                                                ],
                                            })
                                        }}
                                    />
                                </View>

                            }
                        </View>
                    }
                </View>

            </View>
        )



        return (
            <View style={styles.ccsProgressBarHolder}>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        this.props.navigation.navigate('Gifts')
                    }}>
                    <TouchableOpacity
                        style={{ alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', width: 24, height: 24, borderRadius: 12, backgroundColor: colors.GREY }}
                        onPress={() => {
                            this.setState({ showProgressBarDetails: true })
                        }}
                    >
                        <Image resizeMode='contain' style={{ width: 15, height: 15 }} source={Icons['CCS_Question_Mark']} />
                    </TouchableOpacity>

                </TouchableOpacity>

                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}
                    onPress={() => {
                        this.props.navigation.navigate('Gifts')
                    }}>

                    <AnimatedCircularProgress
                        style={{ backgroundColor: 'transparent' }}
                        size={getDeviceWidth() / 1.35}
                        easing={Easing.circle}
                        duration={1000}
                        width={10}
                        fill={100 * (Number(pending)) / targetAmount}
                        lineCap={'square'}
                        rotation={360}
                        tintColor={colors.PendingBalanceColour}
                        onAnimationComplete={() => console.log('onAnimationComplete')}
                        backgroundColor={'transparent'}>
                        {
                            () => (
                                <AnimatedCircularProgress
                                    size={getDeviceWidth() / 1.5}
                                    easing={Easing.circle}
                                    duration={1000}
                                    width={10}
                                    fill={(this.props.balance != null && this.props.balance != '0.00') ? 100 * (Number(balance)) / targetAmount : 0}
                                    lineCap={'square'}
                                    rotation={360}
                                    tintColor={colors.TAB_COLOR}
                                    onAnimationComplete={() => console.log('onAnimationComplete')}
                                    backgroundColor={colors.DASHBOARD_CONTENT_VIEW}>
                                    {
                                        () => (
                                            <View style={{ justifyContent: 'center', alignItems: 'center', width: getDeviceWidth() / 2 }}>
                                                <Image
                                                    resizeMode='contain'
                                                    style={{ width: 32, height: 32, marginTop: -20 }}
                                                    source={require('../../assets/images/bird_yellow.png')}
                                                />
                                                {!isPrimary &&
                                                    <View>
                                                        {this.props.balance != null
                                                            ?
                                                            <View>
                                                                <Text style={[styles.coinBalanceValue, { marginTop: 5, textAlign: 'center' }]}>${this.props.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                                                <Text style={[styles.coinBalanceValue, { marginTop: 5, fontSize: 13, color: Config.pendingBalanceColour, textAlign: 'center' }]}>${pending.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Pending</Text>
                                                            </View>


                                                            :
                                                            <Text style={[styles.coinBalanceValue, { marginTop: 5 }]}>$0</Text>
                                                        }
                                                    </View>
                                                }
                                                {isPrimary &&
                                                    <View>
                                                        {this.props.balanceRes.TargetAmount != null
                                                            ?
                                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={styles.coinBalanceText}>{this.props.balanceRes.GoalName}</Text>
                                                                <Text style={styles.coinBalanceText}>${this.props.balanceRes.TargetAmount}</Text>
                                                                {this.props.balance != null
                                                                    ?
                                                                    <View>
                                                                        <Text style={[styles.coinBalanceValue, { marginTop: 5, textAlign: 'center' }]}>${this.props.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                                                        <Text style={[styles.coinBalanceValue, { marginTop: 5, fontSize: 13, color: Config.pendingBalanceColour, textAlign: 'center' }]}>${pending.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Pending</Text>
                                                                    </View>


                                                                    :
                                                                    <Text style={[styles.coinBalanceValue, { marginTop: 5 }]}>$0</Text>
                                                                }

                                                                {this.props.balance != null
                                                                    ?
                                                                    <View>
                                                                        <Text style={[styles.coinBalanceValue, { marginTop: 5, color: colors.BLACK, fontSize: 12, textAlign: 'center' }]}>{remainingTargetText}</Text>
                                                                    </View>

                                                                    :
                                                                    <Text style={[styles.coinBalanceValue, { marginTop: 5 }]}>{remainingTargetText}</Text>
                                                                }
                                                            </View>
                                                            :
                                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                                <YellowButton
                                                                    title='Add Target'
                                                                    style={{ alignSelf: 'center', width: 120, height: 35 }}
                                                                    textStyle={{ fontSize: 15 }}
                                                                    navigate={() => {
                                                                        this.props.navigation.reset({
                                                                            index: 0,
                                                                            routes: [
                                                                                {
                                                                                    name: 'Profile',
                                                                                    params: { someParam: 'Param1' },
                                                                                },
                                                                            ],
                                                                        })
                                                                    }}
                                                                />
                                                            </View>

                                                        }
                                                    </View>
                                                }
                                            </View>

                                        )
                                    }
                                </AnimatedCircularProgress>
                            )
                        }

                    </AnimatedCircularProgress>
                </TouchableOpacity>


            </View>

        )
    }

    renderHeaderForCCS = (balance, pendingBalance) => {
        const isPrimary = this.props.isPrimaryUser
        if (typeof (isPrimary) != 'undefined') {
            // if(isPrimary){
            return (
                <View>
                    {this.renderProgressBarForCCS(balance, pendingBalance, isPrimary)}
                </View>
            )
        }
    }


    renderHeader = () => {
        if (typeof (this.props.balance) != 'undefined') {
            if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
                let balance = this.props.balance
                let pendingBalance = this.props.pending

                if (typeof (balance) != 'undefined') {
                    if (balance == null || balance == '0') {
                        balance = '1'
                    }
                } else {
                    balance = '1'
                }

                if (typeof (pendingBalance) != 'undefined') {
                    if (pendingBalance == null || pendingBalance == '0') {
                        pendingBalance = '0'
                    }
                } else {
                    pendingBalance = '0'
                }
                return (
                    <View>
                        {this.renderHeaderForCCS(balance, pendingBalance)}
                    </View>

                )
            }

            return (
                <ImageBackground style={styles.imageBackground}>
                    <Carousel
                        //autoplay={true}
                        // loop={true}
                        activeSlideAlignment='center'
                        inactiveSlideOpacity={1.0}
                        containerCustomStyle={{ backgroundColor: 'transparent' }}
                        contentContainerCustomStyle={{ justifyContent: 'center', alignItems: 'center' }}
                        ref={(c) => { this._carousel = c; }}
                        data={[{ id: 1 }, { id: 2 }]}
                        renderItem={this._renderCarouselItem}
                        sliderWidth={getDeviceWidth()}
                        itemWidth={getDeviceWidth() / 1.6}
                        onSnapToItem={(index) => this.setState({ activeSlide: index })}
                    />
                    {this.pagination}
                </ImageBackground>
            )
        }

    }


    render() {
        return (
            <View style={styles.container}>

                <Modal
                    isVisible={this.state.showProgressBarDetails}
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                    backdropOpacity={0.5}
                    backdropColor={'#000000'}
                    onBackdropPress={() => { this.setState({ showProgressBarDetails: false }) }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: colors.White, margin: 20, width: getDeviceWidth() - 40, height: getDeviceWidth() }}>
                        <Image
                            resizeMode='contain'
                            style={{ width: '85%', height: getDeviceWidth() / 1.5 }}
                            source={Icons['CCS_Progressbar_Details']} />
                        <View style={{ width: '100%' }}>
                            <YellowButton style={{ width: '80%', alignSelf: 'center' }} title='OK' navigate={() => {
                                this.setState({ showProgressBarDetails: false })
                            }} />
                        </View>
                    </View>
                </Modal>

                <SectionList
                    style={{ width: '100%', height: '100%' }}
                    ListHeaderComponent={this.renderHeader}
                    renderSectionHeader={({ section: { title } }) => (
                        null
                    )}
                    bounces={false}
                    sections={this.props.dashboardArray}
                    renderItem={this.renderSectionItem}
                    keyExtractor={this.keyExtractor}
                />
                {console.log('DASHBOARD ARRAY', this.props.dashboardArray.data)}
            </View>
        );
    }
}
export default Dashboard;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    imageBackground: {
        justifyContent: 'center',
        alignItems: 'center',
        height: getDeviceWidth() / 1.4,
        width: getDeviceWidth(),
        backgroundColor: colors.LightGray,
        marginBottom: 10,
        marginTop: -5,
    },
    browseRewardsButton: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 5,
        height: 45,
        marginBottom: 10,
        backgroundColor: colors.BLUE,

    },
    browseRewardsText: {
        color: colors.White,
        fontFamily: fonts.bold,
        alignSelf: 'center',
        fontSize: 13,
        marginRight: 5,
        marginLeft: 5,

    },
    pagingView: {
        width: getDeviceWidth() / 1.8,
        height: getDeviceWidth() / 1.8,
        borderRadius: getDeviceWidth() / 3.6,
        backgroundColor: '#ECEFF0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    coinBalanceText: {
        fontFamily: fonts.medium,
        fontSize: widthToDp('3.5%'),
        marginTop: 5,

    },
    coinBalanceValue: {
        fontFamily: fonts.medium,
        fontSize: widthToDp('8%'),
        color: colors.APP_GREEN
    },
    pending: {
        fontFamily: fonts.heavy,
        fontSize: 14,
        color: colors.CIRCULAR_PROGRESSBAR_BACKGROUND
    },


    ////////////////////////////////////////////////////
    savingsView: {
        backgroundColor: colors.DASHBOARD_CONTENT_VIEW,
        height: 70,
        margin: 10,
        borderRadius: 10,
        flexDirection: 'row'
    },
    savingsView1: {
        flexDirection: 'row',
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center'

    },
    savingView2: {
        width: '40%',
        justifyContent: 'center',
        // alignItems:'center'
    },
    savingsText: {
        fontFamily: fonts.bold,
        fontSize: 18,
        marginLeft: 10,
    },
    dollarText: {
        fontFamily: fonts.bold,
        fontSize: 22,
        textAlign: 'left'
    },
    savedWithWalletText: {
        fontFamily: fonts.medium,
        fontSize: 12,
        color: colors.APP_GREEN,
        textAlign: 'left'
    },

    howDoiIncreaseButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 80,
        backgroundColor: colors.YELLOW,
        margin: 10,
        borderRadius: 10,
        padding: 10
    },
    howDoiIncreaseButton2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 80,
        backgroundColor: 'transparent',
        margin: 10,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: colors.YELLOW,
        padding: 10
    },
    howDoIText: {
        fontFamily: fonts.bold,
        fontSize: 13,
        color: colors.BUTTON_TEXT_COLOUR
    },
    hpViewContainer: {
        height: getDeviceWidth() - 20,
        margin: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: colors.WHITE
    },
    dailyOffersContainer: {
        height: 330,
        margin: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        alignItems: 'flex-start',
        backgroundColor: '#ECEFF0' //DASHBOARD_PAGIING_VIEW
    },
    hpCoinOfferView: {
        flexDirection: 'row',
        backgroundColor: '#414042',
        height: 60,
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
    hpDescriptionText: {
        fontFamily: fonts.regular,
        fontSize: 16,
        textAlign: 'left',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },
    hpEarnText: {
        fontFamily: fonts.bold,
        fontSize: 18,
        textAlign: 'left',
        color: colors.APP_GREEN,
        marginLeft: 10,
        marginRight: 10
    },
    dailyOffersuptoText: {
        fontFamily: fonts.medium,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5
    },
    dailyOffersOffText: {
        fontFamily: fonts.heavy,
        fontSize: 12,
        color: colors.WHITE,
        textAlign: 'center'
    },
    dailyOffersContainer1: {
        height: 330,
        margin: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        alignItems: 'flex-start',
        backgroundColor: colors.DASHBOARD_PAGIING_VIEW
    },
    ccsProgressBarHolder: {
        backgroundColor: colors.White,
        padding: 20
    }
});
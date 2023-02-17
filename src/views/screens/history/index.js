import React, { Component } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    Alert
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import { connect } from 'react-redux'
import { HistoryActionCreator } from "../../../redux/actionCreators/app/history";
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import { getDeviceHeight, getDeviceWidth } from "../../../utils";
import fonts from "../../../assets/fonts";
import colors from "../../../utils/colors";
import Config from "react-native-config";
import ClickHistoryRow from '../../../components/history/clickHistoryRow'
import { SearchBar } from 'react-native-elements';
import { CCSActionCreator } from "../../../redux/actionCreators/app/ccs";
import { CheckAccessTokenExpiryTime } from "../../../redux/actionCreators/checkAccessTokenExpiry";
import ActivityIndicatorComponent from "../../../components/activityIndicator";
import ConfirmationModal from '../../../components/ccs/confirmationModal'
import DeviceSecurity from "react-native-device-security";
import RNExitApp from "react-native-exit-app";
import UsbDubbingFunction,{usbDubbingCheck} from "../maintainanceAndForceUpdate/usbDubbingCheck";



const mapStateToProps = (state) => ({

    loading: state.GetPointsHistoryReducer.loading,
    request: state.GetPointsHistoryReducer.request,
    response: state.GetPointsHistoryReducer.response,

    moneyLoading: state.GetMoneyHistoryReducer.loading,
    moneyRequest: state.GetMoneyHistoryReducer.request,
    moneyResponse: state.GetMoneyHistoryReducer.response,

    getClickHistoryLoading: state.GetClickHistoryReducer.loading,
    getClickHistoryRequest: state.GetClickHistoryReducer.request,
    getClickHistoryResponse: state.GetClickHistoryReducer.response,

    isPrimaryUserLoading: state.IsPrimaryUserReducer.loading,
    isPrimaryUserRequest: state.IsPrimaryUserReducer.request,
    isPrimaryUserResponse: state.IsPrimaryUserReducer.response,
})

let segmentWidth = getDeviceWidth() / 3
let segmentWidthSelected = (getDeviceWidth() - 20) / 3



class History extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: 0,
            searchText: '',
            showConfirmationModal:false
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await CheckAccessTokenExpiryTime('HistoryPage')
            this.fetchHistory()
        });
        this.props.navigation.addListener('focus', this._onFocus);
    }

    _onFocus = async () =>{
        UsbDubbingFunction()
    //     let data = Config.ENV.includes('ccsDev') ? await DeviceSecurity.isAdbEnabled() : null
    //     if (data){
    //        Alert.alert(
    //            "Confirmation",
    //            "Please off your device usb Dubbing.",
    //            [
    //              { text: "OK", onPress: () => RNExitApp.exitApp()
    //            }
    //            ]
    //          );
    //    }       
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    fetchHistory = () => {
        EncryptedStorage.getItem('userId', (res, err) => {
            if (res) {
                this.props.dispatch(HistoryActionCreator.getPointsHistory(res))
                this.props.dispatch(HistoryActionCreator.getMoneyHistory(res))
                this.props.dispatch(HistoryActionCreator.getClickHistory(res, this.state.searchText))
                this.props.dispatch(CCSActionCreator.isPrimaryUser())
            }
        })
    }
    fetchClickHistory = (searchText) => {
        EncryptedStorage.getItem('userId', (res, err) => {
            if (res) {
                this.props.dispatch(HistoryActionCreator.getClickHistory(res, searchText))
            }
        })
    }


    renderApprovedTick = (item) => {
        if (typeof (item.Status) != 'undefined') {
            if (item.Status == 'Approved') {
                return (
                    <Image resizeMode='contain' style={{ width: 12, height: 12, marginRight: 5, tintColor: 'green' }} source={require('../../../assets/images/check_mark.png')} />
                )
            }
        }
        return (
            <Image resizeMode='contain' style={{ width: 12, height: 12, marginRight: 5, tintColor: 'green' }} />
        )
    }

    renderSecUser = (item) => {
        const res = this.props.isPrimaryUserResponse
        if (typeof (res) != 'undefined') {
            if (!res) {
                return (
                    <View style={styles.secUserNameHolder}>
                    </View>
                )
            }
        }
        if (typeof (item.IsPrimary) != 'undefined') {
            if (!item.IsPrimary) {
                let name = ''
                if (typeof (item.UserName) != 'undefined') {
                    if (item.UserName.length > 0) {
                        let splittedName = item.UserName.split(' ')
                        if (splittedName.length > 0) {
                            if (splittedName.length > 1) {
                                name += splittedName[0].charAt(0)
                                name += splittedName[1].charAt(0)
                            } else {
                                name += splittedName[0].charAt(0)
                            }
                            return (
                                <View style={[styles.secUserNameHolder, { borderWidth: 1, borderColor: colors.APP_GREEN }]}>
                                    <Text style={{ fontFamily: fonts.bold, fontSize: 8 }}>{name}</Text>
                                </View>
                            )
                        }
                    }
                }
            }
        }
        return (
            <View style={styles.secUserNameHolder}>
            </View>
        )
    }

    renderPointsEarned = () => {
        const res = this.props.response
        let item = (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Retailer' : 'Item'
        let points = (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Dollars' : 'Points'
        if (this.state.selectedIndex == 0) {
            if (typeof (res) != 'undefined') {
                if (typeof (res.pointsEarned) != 'undefined') {
                    if (res.pointsEarned.length > 0) {
                        return (
                            <View style={[styles.listHolder, { marginTop: 10 }]}>
                                <View style={{}}>
                                    <View style={[styles.labelHolder, { backgroundColor: colors.WHITE, height: 30, borderTopRightRadius: 5, borderTopLeftRadius: 5 }]}>
                                        <Text style={[styles.valueText2, { color: colors.greenColourCode }]}>{item}</Text>
                                        <Text style={[styles.valueText2, { color: colors.greenColourCode }]}>Date</Text>
                                        <Text style={[styles.valueText2, { color: colors.greenColourCode }]}>{points}</Text>
                                    </View>
                                    <ScrollView nestedScrollEnabled={true}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.scrollViewContentStyle}
                                        style={styles.scrollViewStyle}>

                                        {res.pointsEarned.map((item, index) => {
                                            return (
                                                <View>
                                                    <View style={{ height: 1, backgroundColor: colors.LightGray, width: '90%', alignSelf: 'center' }} />

                                                    <TouchableOpacity style={[styles.labelHolder, { marginBottom: 5, marginTop: 5 }]}
                                                        onPress={() => {

                                                        }}>
                                                        {this.renderSecUser(item)}
                                                        <View>
                                                            <Text style={styles.valueText}>{item.Description}</Text>
                                                            <Text style={styles.valueText}>Tran Id: {item.TransactionID}</Text>
                                                        </View>

                                                        <Text style={styles.valueText}>{item.Date}</Text>
                                                        <Text style={[styles.valueText, { width: (getDeviceWidth() - 20) / 4 }]}>{item.Points}</Text>
                                                        {this.renderApprovedTick(item)}
                                                    </TouchableOpacity>
                                                </View>

                                            )
                                        })}
                                    </ScrollView>
                                </View>

                            </View>

                        )
                    }
                }
            }
            return (
                <View style={[styles.listHolder, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={[styles.valueText, { width: '80%', fontSize: 14 }]}>You currently have no cashback earned</Text>
                </View>
            )
        }

    }

    renderPointsRedemmed = () => {
        const res = this.props.response
        if (this.state.selectedIndex == 1) {
            if (typeof (res) != 'undefined') {
                if (typeof (res.pointsRedeemed) != 'undefined') {
                    if (res.pointsRedeemed.length > 0) {
                        return (
                            <View style={styles.listHolder}>
                                <View style={{}}>
                                    <View style={[styles.labelHolder, { backgroundColor: colors.APP_GREEN, height: 30 }]}>
                                        <Text style={styles.valueText2}>Item</Text>
                                        <Text style={styles.valueText2}>Date</Text>
                                        <Text style={styles.valueText2}>Points</Text>
                                    </View>
                                    <ScrollView
                                        nestedScrollEnabled={true}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.scrollViewContentStyle}
                                        style={styles.scrollViewStyle}>

                                        {res.pointsRedeemed.map((item, index) => {
                                            return (
                                                <TouchableOpacity style={[styles.labelHolder, { marginBottom: 5, marginTop: 5, borderWidth: 0.5, borderColor: colors.APP_GREEN }]}
                                                    onPress={() => {

                                                    }}>
                                                    <Text style={styles.valueText}>{item.Description}</Text>
                                                    <Text style={styles.valueText}>{item.Date}</Text>
                                                    <Text style={styles.valueText}>{item.Points}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </ScrollView>
                                </View>

                            </View>

                        )
                    }
                }
            }
            return (
                <View style={styles.listHolder}>
                    <Text style={styles.valueText}>No Records</Text>
                </View>
            )
        }

    }

    renderTransactions = () => {

        const res = this.props.moneyResponse
        if (this.state.selectedIndex == 2) {
            if (typeof (res) != 'undefined') {
                if (typeof (res) != 'undefined') {
                    if (res.length > 0) {
                        return (
                            <View style={[styles.listHolder, { marginTop: 10 }]}>
                                <View style={{}}>
                                    <View style={[styles.labelHolder, { backgroundColor: colors.WHITE, height: 30, borderTopRightRadius: 5, borderTopLeftRadius: 5 }]}>
                                        <Text style={styles.valueText2}>Item</Text>
                                        <Text style={styles.valueText2}>Date</Text>
                                        <Text style={styles.valueText2}>Amount</Text>
                                    </View>
                                    {/* <View style={{ height: 1, backgroundColor: colors.LightGray, width: '90%', alignSelf: 'center' }} /> */}
                                    <ScrollView
                                        nestedScrollEnabled={true}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.scrollViewContentStyle} style={styles.scrollViewStyle}>

                                        {res.map((item, index) => {
                                            return (
                                                <View>
                                                    <View style={{ height: 1, backgroundColor: colors.LightGray, width: '90%', alignSelf: 'center' }} />

                                                    <TouchableOpacity style={[styles.labelHolder, { marginBottom: 5, marginTop: 5, height: 40 }]}
                                                        onPress={() => {

                                                        }}>
                                                        <Text style={styles.valueText}>{item.ContactName}</Text>
                                                        <Text style={styles.valueText}>{item.Date}</Text>
                                                        <Text style={styles.valueText}>${Number(item.Amount).toFixed(2)}</Text>
                                                    </TouchableOpacity>
                                                </View>

                                            )
                                        })}
                                    </ScrollView>
                                </View>

                            </View>

                        )
                    }
                }
            }
            return (
                <View style={[styles.listHolder, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={[styles.valueText, { width: '80%', fontSize: 14 }]}>You currently have no transactions</Text>
                </View>
            )
        }


    }

    getClickHistoryKeyExtractor = (item, index) => index.toString()

    renderClickHistoryItem = ({ item, index }) => {

        return (
            <ClickHistoryRow
                item={item}
                index={index}
                navigation={this.props.navigation}
                onSubmitClaimTapped={this.onSubmitClaimTapped}
            />
        )

    }

    onSubmitClaimTapped = (item) => {
        // this.setState({searchText:''})
        if(typeof(item) != 'undefined'){
            if(typeof(item.IsEligibleForClaim) != 'undefined'){
                if(item.IsEligibleForClaim != null){
                    if(item.IsEligibleForClaim == 'No'){
                        this.setState({showConfirmationModal:true})
                    }
                }
            }
        }

    }

    renderClickHistoryFlatList = () => {
        const res = this.props.getClickHistoryResponse
        if (typeof (res) != 'undefined') {
            if (res != null) {
                if (res.length > 0 && this.state.selectedIndex == 3) {
                    return (
                        <FlatList
                            data={res}
                            style={{ width: getDeviceWidth() - 20, margin: 10, backgroundColor: colors.White, borderRadius: 5 }}
                            renderItem={this.renderClickHistoryItem}
                            keyExtractor={this.getClickHistoryKeyExtractor}
                            ItemSeparatorComponent={() => {
                                return (
                                    <View style={{ height: 1, backgroundColor: colors.LightGray, width: '90%', alignSelf: 'center' }} />
                                )
                            }}
                        />
                    )
                }
            }
        }
        return (
            <View style={[styles.listHolder, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={[styles.valueText, { width: '80%', fontSize: 14 }]}>You currently have no click history</Text>
            </View>
        )
    }

    renderClickHistory = () => {

        if (this.state.selectedIndex == 3) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={styles.searchHolder}>
                        <SearchBar
                            lightTheme={true}
                            placeholder="Search any reward transactions..."
                            inputStyle={styles.searchTextInput}
                            inputContainerStyle={{ backgroundColor: colors.LightGray, }}
                            containerStyle={Platform.OS == 'ios' && styles.searchContainer}
                            platform={Platform.OS == 'ios' ? 'ios' : 'android'}

                            value={this.state.searchText}
                            returnKeyType='search'
                            onSubmitEditing={() => {
                                this.fetchClickHistory(this.state.searchText)
                            }}
                            onChangeText={(text) => {
                                this.setState({ searchText: text }, () => {

                                    // this.fetchClickHistory(this.state.searchText)

                                })
                            }}
                            onClear={() => {
                                this.fetchClickHistory('')
                            }}
                            onCancel={() => {
                                this.fetchClickHistory('')
                            }}
                        />
                    </View>
                    {this.renderClickHistoryFlatList()}
                </View>

            )

        }
    }

    renderTransactionHeading = () => {
        if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
            const res = this.props.isPrimaryUserResponse
            if (typeof (res) != 'undefined') {
                if (res) {
                    return (
                        <TouchableOpacity style={this.state.selectedIndex == 2 ? styles.buttonSelected : styles.button}
                            onPress={() => {
                                this.setState({ selectedIndex: 2 },()=>{
                                    this._onFocus()
                                })
                               
                            }}>
                            <Text style={this.state.selectedIndex == 2 ? styles.buttonTextSelected : styles.buttonText}>Transactions</Text>
                        </TouchableOpacity>
                    )
                }
            }
        }
        return null

    }

    onClose = () => {
        this.setState({showConfirmationModal:false})
    }

    render() {
        let pointsEarned = (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Cashback' : 'Points'
        let pointsRedeemed = ''
        let transactions = ''
        let clickHistory = ''

        if (this.props.loading || this.props.moneyLoading) {
            return (
                <ActivityIndicatorComponent />
            )
        }

        if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
            const res = this.props.isPrimaryUserResponse
            if (typeof (res) != 'undefined') {
                if (!res) {

                    segmentWidthSelected = (getDeviceWidth() - 20) / 2
                    segmentWidth = getDeviceWidth() / 2
                } else {
                    segmentWidthSelected = (getDeviceWidth() - 20) / 3
                    segmentWidth = getDeviceWidth() / 3
                }
            }
        }

        return (
            <View style={styles.container}>
                <ConfirmationModal
                    isVisible={this.state.showConfirmationModal}
                    title={'You can submit a claim for a transaction after 7 days. Please check back soon.'}
                    buttonText={'Okay'}
                    onClose={this.onClose}
                    onButtonTapped={this.onClose} />
                <View style={styles.buttonHolder}>
                    <TouchableOpacity style={this.state.selectedIndex == 0 ? [styles.buttonSelected, { width: segmentWidthSelected, backgroundColor: colors.greenColourCode }] : [styles.button, { width: segmentWidth }]}
                        onPress={() => {
                            this.setState({ selectedIndex: 0 })
                        }}>
                        <Text style={this.state.selectedIndex == 0 ? styles.buttonTextSelected : styles.buttonText}>{pointsEarned}</Text>
                        <Text style={this.state.selectedIndex == 0 ? styles.buttonTextSelected : styles.buttonText}>Earned</Text>
                    </TouchableOpacity>

                    {
                        (!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) &&
                        <TouchableOpacity style={this.state.selectedIndex == 1 ? styles.buttonSelected : styles.button}
                            onPress={() => {
                                this.setState({ selectedIndex: 1 })
                            }}>
                            <Text style={this.state.selectedIndex == 1 ? styles.buttonTextSelected : styles.buttonText}>Points</Text>
                            <Text style={this.state.selectedIndex == 1 ? styles.buttonTextSelected : styles.buttonText}>Redeemed</Text>
                        </TouchableOpacity>
                    }

                    {
                        this.renderTransactionHeading()
                    }

                    <TouchableOpacity style={this.state.selectedIndex == 3 ? [styles.buttonSelected, { width: segmentWidthSelected, backgroundColor: '#FF9D6E' }] : [styles.button, { width: segmentWidth }]}
                        onPress={() => {
                            this.setState({ selectedIndex: 3 })
                            this.fetchClickHistory('')
                            this._onFocus()
                        }}>
                        <Text style={this.state.selectedIndex == 3 ? styles.buttonTextSelected : styles.buttonText}>Click History</Text>
                    </TouchableOpacity>

                </View>
                {this.renderPointsEarned()}
                {this.renderPointsRedemmed()}
                {this.renderTransactions()}
                {this.renderClickHistory()}
            </View>

        )
        return (
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled={true}>
                <ActivityIndicatorModal isVisible={this.props.loading || this.props.moneyLoading} />
                {this.renderPointsEarned()}
                {this.renderPointsRedemmed()}
                {this.renderTransactions()}
            </ScrollView>
        );
    }
}
export default connect(mapStateToProps)(History);


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listHolder: {
        flex: 1,
        width: getDeviceWidth() - 10,
        marginLeft: 5,
        marginRight: 5,
        // marginTop:-2,
        marginBottom: 20,
    },
    labelText: {
        fontFamily: fonts.heavy,
        color: colors.BLUE,
        fontSize: 16,
        marginBottom: 10
    },
    scrollViewStyle: {
        marginBottom: 30,
        backgroundColor: colors.White,
    },
    scrollViewContentStyle: {
        // borderWidth:1,borderColor:colors.APP_GREEN,width:getDeviceWidth() - 20,marginBottom:10,
    },
    labelHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        marginBottom: 0,
        backgroundColor: colors.White,
        height: 40,
    },
    valueText: {
        fontFamily: fonts.medium,
        fontSize: 12,
        textAlign: 'center',
        width: (getDeviceWidth() - 40) / 3
    },
    valueText2: {
        fontFamily: fonts.bold,
        fontSize: 16,
        color: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? '#71C5E8' : colors.WHITE,
        textAlign: 'center',
        width: (getDeviceWidth() - 40) / 3
    },
    buttonHolder: {
        width: getDeviceWidth() - 5,
        margin: 2.5,
        height: 60,
        paddingBottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // borderWidth:1,
        // borderColor:colors.APP_GREEN,
        backgroundColor: colors.White
    },
    button: {
        width: getDeviceWidth() / 3,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: colors.DASHBOARD_CONTENT_VIEW,

        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: colors.WHITE,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    buttonSelected: {
        width: (getDeviceWidth() - 20) / 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#71C5E8',
        height: '100%',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: colors.WHITE,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    buttonText: {
        fontFamily: fonts.buttonTextFont,
        fontSize: 14,
        color: colors.BLACK,
    },
    buttonTextSelected: {
        fontFamily: fonts.buttonTextFont,
        fontSize: 16,
        color: colors.White,
    },
    searchHolder: {
        width: getDeviceWidth() - 20,
        marginLeft: 10,
        marginRight: 10,
        borderColor: colors.APP_GREEN,
        marginBottom: 5,
        marginTop: 10
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
    secUserNameHolder: {
        width: 20,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 20,
        borderRadius: 10
    }
});
import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import { connect } from 'react-redux'
import fonts from '../../../../assets/fonts';
import { getDeviceWidth } from '../../../../utils';
import colors from "../../../../utils/colors";
import Config from "react-native-config";
import YellowButton from '../../../../components/button';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { CCSActionCreator } from '../../../../redux/actionCreators/app/ccs';
import ActivityIndicatorComponent from '../../../../components/activityIndicator';
import ConfirmationModal from "../../../../components/ccs/confirmationModal";
import { RewardsActionCreator } from '../../../../redux/actionCreators/app/rewards';
import { CheckAccessTokenExpiryTime } from '../../../../redux/actionCreators/checkAccessTokenExpiry';


let title = ''
let body = ''

const mapStateToProps = (state) => ({

    loading: state.TransferToBankReducer.loading,
    request: state.TransferToBankReducer.request,
    response: state.TransferToBankReducer.response,

    balanceLoading: state.GetPointsBalanceReducer.loading,
    balanceRequest: state.GetPointsBalanceReducer.request,
    balanceResponse: state.GetPointsBalanceReducer.response,

    masterCardLoading: state.TransferToMasterCardReducer.loading,
    masterCardRequest: state.TransferToMasterCardReducer.request,
    masterCardResponse: state.TransferToMasterCardReducer.response,
})


class TransferToBankConfirmationPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showConfirmationModal: false
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
        if (this.props.route.params.isMasterCard) {
            const res = this.props.masterCardResponse
            if (typeof (res) != 'undefined') {
                if (Object.keys(res).length > 0) {
                    if (typeof (res.Status) != 'undefined') {
                        this.props.dispatch(RewardsActionCreator.resetTransferToMasterCard())
                        if (res.Status == 'Success') {
                            title = `Your transaction is now processed. $${this.props.route.params.amountToBeDeducted} has been deducted from your account balance.\n`
                            body = `You will receive an SMS within 24 hours with instructions on how to download your Digital Mastercard`
                            this.setState({ showConfirmationModal: true })
                        } else {
                            this.setState({ showConfirmationModal: true })
                            title = 'Problem occured while processing the transaction. Please try again.'

                        }
                    }
                }
            }

        }

        else {
            const res = this.props.response
            if (typeof (res) != 'undefined') {
                if (Object.keys(res).length > 0) {
                    if (typeof (res.Status) != 'undefined') {
                        this.props.dispatch(CCSActionCreator.resetResponse('9'))
                        if (res.Status == 'Success') {
                            title = 'Your withdrawal has been submitted. Please wait between 1-4 days for it to appear in your nominated account.'
                            this.setState({ showConfirmationModal: true })
                        } else {
                            this.setState({ showConfirmationModal: true })
                            title = 'Problem occured while processing the transaction. Please try again.'

                        }
                    }
                }
            }
        }

    }

    onClose = () => {
        this.setState({
            showConfirmationModal: false
        })
        // this.props.navigation.goBack()
        // this.props.route.params.onBack()
        this.props.navigation.reset({
            index: 0,
            routes: [
                {
                    name: 'Gifts',
                    params: { someParam: 'Param1' },
                },
            ],
        })
        this.props.navigation.navigate('Gifts')
    }

    render() {
        const param = this.props.route.params

        const name = param.name
        const bsb = param.bsb
        const accountNumber = param.accountNumber
        const amount = param.amount

        if (this.props.loading || this.props.masterCardLoading) {
            return (
                <ActivityIndicatorComponent />
            )
        }

        return (
            <View style={styles.container}>
                <ConfirmationModal
                    isVisible={this.state.showConfirmationModal}
                    title={title}
                    body={this.props.route.params.isMasterCard ? body : ''}
                    buttonText={'Okay'}
                    onClose={this.onClose}
                    onButtonTapped={this.onClose} />
                {/* {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                    <Image
                        resizeMode='contain'
                        source={require('../../../../assets/images/ccs_reg_image3.png')}
                        style={{ width: 120, height: 80, alignSelf: 'center', marginBottom: 20 }}
                    />} */}
                <View>
                    {!this.props.route.params.isMasterCard ?
                        <Text style={[styles.titleText, { marginRight: 10, marginLeft: 10, marginBottom: 10 }]}>You wish to withdraw ${amount} to your bank account:</Text>
                        :
                        <Text style={[styles.titleText, { marginRight: 10, marginLeft: 10, marginBottom: 20 }]}>Confirmation</Text>
                    }


                    <View style={[styles.detailsHolder]}>
                        
                        {!this.props.route.params.isMasterCard ?
                            <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                                <View style={styles.splittedView}>
                                    <Text style={[styles.titleText, { textAlign: 'right', width: (getDeviceWidth() - 80) / 2 }]}>Account Name:</Text>
                                    <View style={{width:'100%',height:1,backgroundColor:colors.LightGray}}/>
                                    <Text style={[styles.titleText, { textAlign: 'right', width: (getDeviceWidth() - 80) / 2 }]}>Account BSB:</Text>
                                    <View style={{width:'100%',height:1,backgroundColor:colors.LightGray}}/>
                                    <Text style={[styles.titleText, { textAlign: 'right', width: (getDeviceWidth() - 80) / 2 }]}>Account Number:</Text>
                                </View>

                                <View style={styles.splittedView}>
                                    <Text style={[styles.titleText, { textAlign: 'left', marginLeft: 5 }]}>{name}</Text>
                                    <View style={{width:'100%',height:1,backgroundColor:colors.LightGray}}/>
                                    <Text style={[styles.titleText, { textAlign: 'left', marginLeft: 5 }]}>{bsb}</Text>
                                    <View style={{width:'100%',height:1,backgroundColor:colors.LightGray}}/>
                                    <Text style={[styles.titleText, { textAlign: 'left', marginLeft: 5 }]}>{accountNumber}</Text>
                                </View>
                            </View>
                            :

                            <View style={{ width: '100%' }}>
                                <Image
                                    style={{ width: 40, height: 40, marginTop:-30,alignSelf: 'center' }}
                                    source={require('../../../../assets/images/dollar_green.png')}
                                />
                                <Text style={styles.confirmationText}>You are withdrawing your Team Saver Reward to a ${this.props.route.params.amount} Digital Mastercard</Text>
                            </View>

                        }
                    </View>
                </View>
                <View style={[styles.detailsHolder, { flexDirection: 'column', backgroundColor: 'transparent', justifyContent: 'space-around' }]}>
                    <YellowButton
                        title='Yes'
                        navigate={() => {
                            EncryptedStorage.getItem('userId', async (res, err) => {
                                if (res) {
                                    if (this.props.route.params.isMasterCard) {
                                        await CheckAccessTokenExpiryTime('TransferToBankPage')
                                        this.props.dispatch(RewardsActionCreator.transferToMasterCard(res, param.amountToBeDeducted))
                                    } else {
                                        EncryptedStorage.getItem('email', async (email, err) => {
                                            if (email) {
                                                await CheckAccessTokenExpiryTime('TransferToBankPage')
                                                const param = this.props.route.params
                                                this.props.dispatch(CCSActionCreator.transferToBank(param.amount))
                                            }
                                        })
                                    }

                                }
                            })
                        }}
                        style={{ width: '90%', alignSelf: 'center', marginTop: 5 }}
                    />

                    <YellowButton
                        title='No'
                        navigate={() => {
                            this.props.navigation.goBack()
                        }}
                        style={{ width: '90%', alignSelf: 'center', marginBottom: 5, marginTop: 15 }}
                    />
                </View>
            </View>
        )
    }
}
export default connect(mapStateToProps)(TransferToBankConfirmationPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        justifyContent: 'space-between'
    },
    titleText: {
        fontFamily: fonts.bold,
        fontSize: 14,
        marginBottom: 20,
        marginTop: 20,
        textAlign: 'center',
    },
    confirmationText: {
        fontFamily: fonts.regular,
        fontSize: 13,
        marginBottom: 20,
        marginTop: 20,
        margin: 20,
        textAlign: 'center',
    },
    detailsHolder: {
        flexDirection: 'row',
        width: getDeviceWidth() - 40,
        margin: 20,
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: colors.White,
        justifyContent: 'center',
    },
    splittedView: {
        width: (getDeviceWidth() - 80) / 2,
        justifyContent: 'center',
        alignItems: 'center'

    }
})
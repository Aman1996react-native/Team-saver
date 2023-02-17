import React, { Component } from "react";
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
import { getDeviceWidth } from "../../../../utils";
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RewardsActionCreator } from "../../../../redux/actionCreators/app/rewards";
import BalanceView from "../../../../components/rewards/balanceView";
import colors from "../../../../utils/colors";
import fonts from "../../../../assets/fonts";
import YellowButton from "../../../../components/button";
import ConfirmationModal from "../../../../components/ccs/confirmationModal";
import Config from "react-native-config";
import CheckBox from '@react-native-community/checkbox';
import { CCSActionCreator } from "../../../../redux/actionCreators/app/ccs";
import { TopUpActionCreator } from "../../../../redux/actionCreators/app/topup";

import DenominationModal from "../../../../components/rewards/denominationModal";
import AppHeader from "../../../../components/AppHeader";

const mapStateToProps = (state) => ({

    balanceLoading: state.GetPointsBalanceReducer.loading,
    balanceRequest: state.GetPointsBalanceReducer.request,
    balanceResponse: state.GetPointsBalanceReducer.response,

    getbankDetailsLoading: state.GetBankDetailsReducer.loading,
    getbankDetailsRequest: state.GetBankDetailsReducer.request,
    getbankDetailsResponse: state.GetBankDetailsReducer.response,
})

let title = ''

class TransferToMasterCardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDenominationModalVisible: false,
            selectedItem: null,
            showConfirmationModal: false
        };
    }

    componentDidMount(){
        
            this.props.navigation.setOptions({
                headerShown:false,
                title:(
                    <View 
                    style = {{justifyContent:'center',alignItems:'center'}}>
                </View>
                )
              });
        
        
    }

    onBackdropPressed = () => {
        this.setState({ isDenominationModalVisible: false })

    }

    onAmountSelected = (item) => {
        this.setState({ selectedItem: item, isDenominationModalVisible: false })
    }

    onClose = () => {
        this.setState({
            showConfirmationModal: false, isDenominationModalVisible: false
        })
    }

    renderPointsView = () => {
        const res = this.props.balanceResponse

        if (typeof (res) != 'undefined') {
            if (typeof (res.Balance) != 'undefined') {
                return (
                    <BalanceView
                        balance={res} />

                )
            }
        }
    }

    selectAmountError = (isAmount) => {

        title = isAmount ? 'Please select an amount' : 'You don’t have sufficient funds in your balance.'
        this.setState({ showConfirmationModal: true })
    }

    render() {
        return (
            <>
            <AppHeader rightHeaderHide = {true}/>
            <View style={styles.container}>
                <ConfirmationModal
                    isVisible={this.state.showConfirmationModal}
                    title={title}
                    buttonText={'Okay'}
                    onClose={this.onClose}
                    onButtonTapped={this.onClose} />
                {this.renderPointsView()}
                {/* {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                    <Image
                    resizeMode='contain'
                    source={require('../../../../assets/images/ccs_reg_image3.png')}
                    style={{width:120,height:80,alignSelf:'center',margin:20}}
                    />} */}
                <View style={{  width: '100%',flex: 1, marginTop : 30 }}>
                    <Text style={styles.text}>Select the value of your Digital Mastercard</Text>
                    <TouchableOpacity style={styles.denominationHolder}
                        onPress={() => {
                            this.setState({ isDenominationModalVisible: true })
                        }}>
                        <TextInput
                            style={[styles.textInput, { textAlign: 'left' }]}
                            onTouchStart={() => {
                                this.setState({ isDenominationModalVisible: true })
                            }}
                            editable={false}
                            value={this.state.selectedItem == null ? '' : '$' + this.state.selectedItem.Amount}
                            placeholder='Select an amount'
                            placeholderTextColor='gray'
                        />
                        <View style = {{marginRight : 20}}>
                        <Image style={
                            
                                { width: 24, height: 22}

                               
                        }
                        

                            source={   require('../../../../assets/images/down_arrow_new.png') } />
                                    
                                    </View>
                    </TouchableOpacity>

                    <DenominationModal
                        onBackdropPressed={this.onBackdropPressed}
                        denominationArray={[{ Offer_ID: 1, Amount: '10' }, { Offer_ID: 2, Amount: '20' }, { Offer_ID: 3, Amount: '30' }, { Offer_ID: 4, Amount: '40' }, { Offer_ID: 5, Amount: '50' },]}
                        isDelivery={false}
                        deliveryArray={['Later', 'Now']}
                        onAmountSelected={this.onAmountSelected}
                        isVisible={this.state.isDenominationModalVisible} />

                    <Text style={[styles.text, { fontSize: 14, marginTop: 200, marginBottom: 30 }]}>A $2.00 transaction fee will be  charged on your transaction</Text>
                    <YellowButton
                        title='Proceed'
                        disabled={typeof (this.state.selectedItem) == 'undefined' || this.state.selectedItem == null}
                        navigate={() => {
                            if (this.state.selectedItem != null) {
                                if (typeof (this.state.selectedItem.Amount) != 'undefined') {
                                    const bal = this.props.route.params.balance.Balance
                                    const amt = this.state.selectedItem.Amount
                                    if (typeof (bal) != 'undefined') {
                                        if (bal != null) {
                                            if ((Number(bal) >= 12) && (Number(amt.replace(/\D/g, '')) >= 10)) {
                                                const amountTobeTransferred = Number(amt.replace(/\D/g, ''))
                                                if (Number(amt.replace(/\D/g, '')) + 2 <= Number(bal)) {
                                                    this.props.navigation.navigate('TransferToBankConfirmationCCS', {
                                                        name: '',
                                                        bsb: '',
                                                        accountNumber: '',
                                                        amount: amountTobeTransferred,
                                                        amountToBeDeducted: amountTobeTransferred + 2,
                                                        onBack: this.onClose,
                                                        isMasterCard: true
                                                    })
                                                } else {
                                                    title = 'Selected amount is more than the balance.'
                                                    this.setState({ showConfirmationModal: true })
                                                }

                                            } else {
                                                this.selectAmountError(false)
                                            }
                                        } else {
                                            this.selectAmountError(false)
                                        }
                                    } else {
                                        this.selectAmountError(false)
                                    }

                                } else {
                                    this.selectAmountError(true)
                                }
                            } else {
                                this.selectAmountError(true)
                            }
                        }}
                        style={{ margin: 30, alignSelf: 'center' }}
                    />
                </View>

            </View>
            </>
        );
    }
}

export default connect(mapStateToProps)(TransferToMasterCardPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BACKGROUNG_COLOR_GIFT,
        // justifyContent:'space-around',
    },
    text: {
        fontSize: 16,
        fontFamily: fonts.bold,
        margin: 20,
        textAlign: 'center'
    },
    denominationHolder: {
        margin: 10,
        width: getDeviceWidth() - 40,
        height: 70,
        backgroundColor: colors.White,
        paddingLeft: 20,
        alignSelf : 'center',
        marginHorizontal : 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius : 20,
        marginTop : 30
        // borderTopRightRadius:10,
        // borderBottomRightRadius:10
    },
    textInput: {
        width: '80%',
        fontSize: 16,
        // height:35,
        color: colors.APP_GREEN,
        fontFamily: fonts.bold,
        borderBottomColor: colors.BLACK,
        textAlign: 'right'
        // borderBottomWidth:1
    },
})

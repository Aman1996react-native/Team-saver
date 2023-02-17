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
import {connect} from 'react-redux'
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
import { CheckAccessTokenExpiryTime } from "../../../../redux/actionCreators/checkAccessTokenExpiry";
import UnderlineText from "../../../../components/underlineText";


const mapStateToProps =(state) => ({

    balanceLoading:state.GetPointsBalanceReducer.loading,
    balanceRequest:state.GetPointsBalanceReducer.request,
    balanceResponse:state.GetPointsBalanceReducer.response,

    getbankDetailsLoading:state.GetBankDetailsReducer.loading,
    getbankDetailsRequest:state.GetBankDetailsReducer.request,
    getbankDetailsResponse:state.GetBankDetailsReducer.response,
})

let title = ''
let successTitle = 'Your withdrawal has been submitted. Please wait between 1-4 days for it to appear in your nominated account'

class TransferToBankPage extends Component {

    constructor(props){
        super(props)
        const balance = props.route.params.balance
        let amountToTransfer = 0
        if(typeof(balance) != 'undefined'){
            if(balance != null) {
                if(typeof(balance.Balance) != 'undefined'){
                    if(balance.Balance != '' && balance.Balance != '0.00' && balance.Balance != null){
                         
                        if(Number(balance.Balance) > 0){
                            amountToTransfer = balance.Balance
                        }
                    }
                }
            }
        }
        this.state={
            name:'',
            accountBSB:'',
            accountNumber:'',
            totalTransfer:amountToTransfer.toString(),
            totalTransferAmountUnchanged: amountToTransfer.toString(),
            doYouAgree:true,
            shouldMoveUp:false,
            showConfirmationModal:false,
            loadGetBankdetails:false
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', async() => {
            await CheckAccessTokenExpiryTime('TransferToBankPage')
            this.fetchPointsBalance()
          });
    }

    componentDidUpdate(prevProps){
        const res = this.props.getbankDetailsResponse
        if(this.state.loadGetBankdetails){
            if(typeof(res) != 'undefined'){
                if(Object.keys(res).length > 0){
                    // this.props.dispatch(CCSActionCreator.resetResponse('12'))
                    if(typeof(res.BankName) != 'undefined' && typeof(res.AccountNumber) != 'undefined' && typeof(res.BranchCode) != 'undefined'){
                        if(res.BankName != null && res.BranchCode != null && res.AccountNumber != null){
                            this.setState({name:res.BankName,accountBSB:res.BranchCode,accountNumber:res.AccountNumber,loadGetBankdetails:false})
                        }
                    }
                }
            }
        }
    }

    fetchPointsBalance = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(RewardsActionCreator.getPointsBalance(res))
                this.setState({loadGetBankdetails:true})
                this.props.dispatch(TopUpActionCreator.getBankDetails(res))
            }
        })
    }

    renderPointsView = () => {
        const res = this.props.balanceResponse
        
        if(this.state.shouldMoveUp){
            return null
        }
        if(typeof(res) != 'undefined'){
            if(typeof(res.Balance) != 'undefined'){
                return(
                    <BalanceView
                    balance={res}/> 
                    
                )
            }
        }
    }

    onClose = () => {
        this.setState({
            showConfirmationModal:false
        })
    }

    renderNoBankDetailsText = () => {
        if(this.state.name == '' || this.state.accountBSB == '' || this.state.accountNumber == ''){
            return(
                <Text style={{fontFamily:fonts.regular,fontSize:13,textAlign:'center',margin:15}}>
                    You currently have no bank account details saved, please go to manage bank details in settings to set up your bank account.
                    </Text>
            )
        }
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' && 'padding'} keyboardVerticalOffset={Platform.OS == 'ios' && 120} style={styles.container}>
                {this.renderPointsView()}
                <ConfirmationModal
                    isVisible={this.state.showConfirmationModal}
                    title={title}
                    buttonText={'Okay'}
                    onClose={this.onClose}
                    onButtonTapped={this.onClose}/>
                
                <ScrollView contentContainerStyle={{backgroundColor:colors.BACKGROUND_COLOR_CCS}}>
                    {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                    <Image
                    resizeMode='contain'
                    source={require('../../../../assets/images/bird_with_edit_page.png')}
                    style={{width:120,height:80,alignSelf:'center',marginBottom:10}}
                    />}
                    {this.renderNoBankDetailsText()}
                    <Text style={styles.titleText}>Account Name</Text>
                    <View style={styles.textInputHolder}>
                        <TextInput
                        placeholder='Name on Account'
                        placeholderTextColor={colors.GREY}
                        style={styles.textInput}
                        onChangeText={(text) => {
                            this.setState({name:text})
                        }}
                        value={this.state.name}
                        maxLength={50}
                        editable={false}
                        />
                    </View>

                    <Text style={styles.titleText}>Account BSB</Text>
                    <View style={styles.textInputHolder}>
                        <TextInput
                        placeholder='Account BSB'
                        placeholderTextColor={colors.GREY}
                        style={styles.textInput}
                        onChangeText={(text) => {
                            this.setState({accountBSB:text})
                        }}
                        value={this.state.accountBSB}
                        maxLength={6}
                        keyboardType={'number-pad'}
                        returnKeyType='done'
                        returnKeyLabel='Done'
                        editable={false}

                        />
                    </View>

                    <Text style={styles.titleText}>Account Number</Text>
                    <View style={styles.textInputHolder}>
                        <TextInput
                        placeholder='Account Number'
                        placeholderTextColor={colors.GREY}
                        style={styles.textInput}
                        onChangeText={(text) => {
                            this.setState({accountNumber:text})
                        }}
                        value={this.state.accountNumber}
                        maxLength={10}
                        keyboardType={'number-pad'}
                        returnKeyType='done'
                        returnKeyLabel='Done'
                        editable={false}

                        />
                    </View>

                    <Text style={styles.titleText}>Amount</Text>
                    <View style={styles.textInputHolder}>
                        <TextInput
                        placeholder='Total transfer'
                        placeholderTextColor={colors.GREY}
                        style={styles.textInput}
                        keyboardType='decimal-pad'
                        onChangeText={(text) => {
                            this.setState({totalTransfer:text})
                        }}
                        value={this.state.totalTransfer}
                        />
                    </View>

                    {/* <View style={{flexDirection:'row',marginLeft:15,alignItems:'center',marginTop:10}}>
                        <CheckBox
                        disabled={false}
                        style={{width:20,height:20,marginRight:10,}}
                        value={this.state.doYouAgree}
                        onValueChange={(newValue) => {
                            this.setState({doYouAgree:newValue})
                        }}
                        boxType={'square'}
                        onCheckColor={colors.APP_GREEN}
                        tintColor={colors.APP_GREEN}
                        onTintColor={colors.APP_GREEN}
                        />
                        <Text style={styles.text}>Save my bank details for next time</Text>
                    </View> */}

                    <YellowButton
                    title='Pay'
                    disabled={this.state.name.length < 1 || this.state.accountBSB.length < 6 || this.state.accountNumber.length < 1 || this.state.totalTransfer.length < 1}
                    navigate={() => {
                        // if(this.state.totalTransfer != this.state.totalTransferAmountUnchanged){
                            const balance = this.props.route.params.balance
                            if(typeof(balance) != 'undefined'){
                                if(balance != null) {
                                    if(typeof(balance.Balance) != 'undefined'){
                                        if(balance.Balance != '' && balance.Balance != '0.00' && balance.Balance != null){
                                            console.warn('Sent: '+this.state.totalTransfer)
                                          
                                            if((Number(this.state.totalTransfer)) <= Number(balance.Balance)){
                                                if((Number(this.state.totalTransfer) < 10)){
                                                    title = 'Please enter an amount greater than or equal to $10'
                                                    this.setState({showConfirmationModal:true})
                                                    return
                                                }
                                                let amt = this.state.totalTransfer
                                                if(Number(this.state.totalTransfer) != Number(this.state.totalTransferAmountUnchanged)){
                                                    amt = Number(this.state.totalTransfer)
                                                }
                                                if(this.state.name != '' && this.state.accountBSB != '' && this.state.accountNumber != ''){
                                                    if(this.state.doYouAgree){
                                                        EncryptedStorage.getItem('userId',(res,err) => {
                                                            if(res){
                                                                EncryptedStorage.getItem('email',async(email,err) => {
                                                                    if(email){
                                                                        // await CheckAccessTokenExpiryTime('TransferToBankPage')
                                                                        // this.props.dispatch(CCSActionCreator.addUpdateBankDetails(res,this.state.name,this.state.accountNumber,this.state.accountBSB,email))
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                    
                                                    this.props.navigation.navigate('TransferToBankConfirmationCCS',{
                                                        name:this.state.name,
                                                        bsb:this.state.accountBSB,
                                                        accountNumber:this.state.accountNumber,
                                                        amount:amt,//this.state.totalTransfer,
                                                        onBack:this.onClose,
                                                        isMasterCard:false
                                                    })
                                                }else{
                                                     title = `Please enter all the details.`
                                                     this.setState({showConfirmationModal:true})
                                                }
                                                
                                                
                                            }else{
                                                console.warn('Hello')
                                                title = `You don’t have sufficient funds in your balance.`
                                                    this.setState({showConfirmationModal:true})
                                                    return
                                            }
                                        }else{
                                            console.warn('Welcome')
                                            title = `You don’t have sufficient funds in your balance.`
                                                    this.setState({showConfirmationModal:true})
                                                    return
                                        }
                                    }
                                }
                            }
                        // }
                        
                    }}
                    style={{alignSelf:'center',width:'80%',marginTop:15,marginBottom:15}}
                    />

                    <YellowButton
                    style={{alignSelf:'center',width:'80%',marginTop:15,marginBottom:15}}
                    title='Settings'
                    navigate={() => {
                        this.props.dispatch(CCSActionCreator.shouldNavigateToSettings(true))
                    this.props.navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'More',
                                params: { someParam: 'Param1' },
                            },
                        ],
                    })
                    this.props.navigation.navigate('More')
                    }}

                    />

                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
export default connect(mapStateToProps) (TransferToBankPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:colors.BACKGROUND_COLOR_CCS
    },
    textInputHolder:{
        width:getDeviceWidth() - 30,
        margin:15,
        borderRadius:10,
        height:60,
        justifyContent:'center',
        padding:10,
        backgroundColor:colors.White,
        // borderWidth:1,
        borderColor:colors.APP_GREEN
    },
    textInput:{
        fontFamily:fonts.regular,
        fontSize:14,
        height:'100%',
        width:'100%'
    },
    filled:{
        width:25,
        height:25,
        backgroundColor:colors.APP_GREEN,
        marginRight:10
    },
    notFilled:{
        width:25,
        height:25,
        backgroundColor:'transparent',
        borderWidth:2,
        borderColor:colors.APP_GREEN,
        marginRight:10
    },
    text:{
        fontFamily:fonts.bold,
        fontSize:14
    },
    transFeeText:{
        fontFamily:fonts.bold,
        fontSize:11,
        color:colors.APP_GREEN,
        margin:10,
        textAlign:'center' 
    },
    titleText:{
        fontFamily:fonts.bold,
        fontSize:16,
        marginLeft:20
    }
});
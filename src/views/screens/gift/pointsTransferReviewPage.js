import React, { Component } from "react";
import { 
    View,
    Text,
    Platform,
    ScrollView,
    TextInput,
    Image,
    StyleSheet,
    KeyboardAvoidingView
} from "react-native";

import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RewardsActionCreator } from "../../../redux/actionCreators/app/rewards";
import BalanceView from "../../../components/rewards/balanceView";
import { getDeviceWidth, showAlertWithCallBack } from "../../../utils";
import colors from "../../../utils/colors";
import fonts from "../../../assets/fonts";
import ContactsView from "../../../components/rewards/contactsView";
import YellowButton from "../../../components/button";
import ActivityIndicatorComponent from "../../../components/activityIndicator";
import TransactionSuccessModal from "../../../components/rewards/transactionSuccessModal";
import { AuthActionCreator } from "../../../redux/actionCreators/auth";

const mapStateToProps =(state) => ({

    balanceLoading:state.GetPointsBalanceReducer.loading,
    balanceRequest:state.GetPointsBalanceReducer.request,
    balanceResponse:state.GetPointsBalanceReducer.response,

    transferLoading:state.PointsTransferReducer.loading,
    transferRequest:state.PointsTransferReducer.request,
    transferResponse:state.PointsTransferReducer.response,
  
  })

class PointsTransferReviewPage extends Component {

    constructor(props){
        super(props)
        this.state={
            showTransactionModal:false
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.fetchBalance()
          });
          

    }

    componentWillUnmount() {
        this.setState({selectedContact:null})
        this._unsubscribe();
    }

    fetchBalance = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(RewardsActionCreator.getPointsBalance(res))
            }
        })
    }

    componentDidUpdate(prevProps){
        const res = this.props.transferResponse
        if(typeof(res) != 'undefined' && !this.props.transferLoading){
            if(Object.keys(res).length > 0){
                if(typeof(res.Status) != 'undefined'){
                    if(res.Status == 'Success'){
                        this.setState({showTransactionModal:true})
                        this.props.dispatch(RewardsActionCreator.resetPointsTransfer())

                      }else{
                        this.props.dispatch(RewardsActionCreator.resetPointsTransfer())
                        showAlertWithCallBack('Failed to transfer points. Please try again.',() => {
                            this.props.navigation.goBack()
                            this.props.dispatch(RewardsActionCreator.resetPointsTransfer())
                        })
                      }
                }
            }
        }
    }

    onOkayTapped = () => {
        this.setState({showTransactionModal:false},() => {
            // this.props.navigation.goBack()
            this.props.dispatch(AuthActionCreator.isFirstTime(false))
            this.props.dispatch(AuthActionCreator.isLoggedIn(true))
        })
        
    }

    renderBalanceView = () => {
        
        if(typeof(this.props.balanceResponse) != 'undefined'){
            if(typeof(this.props.balanceResponse.Balance) != 'undefined'){
                return(
                    <BalanceView
                    balance={this.props.balanceResponse}/>
                )
            }
        }
        return(
            null
        )
    }

    renderReviewView = () => {
        const param = this.props.route.params
        return(
            <View style={{paddingTop:10,paddingBottom:10,borderWidth:1,borderColor:colors.APP_GREEN,width:getDeviceWidth() - 30,margin:15}}>
                <View style={styles.eachDetailView}>
                    <Text style={styles.labelText}>TO</Text>
                    <Text style={styles.valueText}>{param.to}</Text>
                </View>

                <View style={styles.eachDetailView}>
                    <Text style={styles.labelText}>MOBILE</Text>
                    <Text style={styles.valueText}>{param.mobile}</Text>
                </View>

                <View style={styles.eachDetailView}>
                    <Text style={styles.labelText}>POINTS</Text>
                    <Text style={styles.valueText}>{param.points.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Points</Text>
                </View>

                <View style={styles.eachDetailView}>
                    <Text style={styles.labelText}>MESSAGE</Text>
                    <Text style={styles.valueText}>{param.message}</Text>
                </View>
            </View>
        )
    }

    onTransferTapped = () => {
        const param = this.props.route.params
        let contacts = []
        let ele = {
            Points:param.points,
            Name:param.to,
            Mobile_Number:param.mobile
        }
        contacts.push(ele)
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(RewardsActionCreator.pointsTransfer(res,param.points,contacts))
            }
        })

    }

    render() {
        if(this.props.balanceLoading || this.props.transferLoading){
            return(
                <ActivityIndicatorComponent></ActivityIndicatorComponent>
            )
        }
        return (
            <View style={styles.container}>
                <TransactionSuccessModal 
                isVisible= {this.state.showTransactionModal}
                selectedContactName={this.state.selectedContact != null ? this.state.selectedContact.Name  : this.state.name}
                isMe={false}
                isPlusTapped={false}
                onOkayTapped={this.onOkayTapped}
                isFoodAndWine={false}
                isGiftCard={false}
                isTransfer={true}
                selectedMenu={null}
                selectedContact={this.props.route.params.item}
                />
                {this.renderBalanceView()}
                {this.renderReviewView()}
                <View style={styles.btnContainer} >
                    <YellowButton title='Transfer' navigate={() => { this.onTransferTapped() }} />
                </View>
            </View>
        );
    }
}
export default connect(mapStateToProps)(PointsTransferReviewPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    eachDetailView:{
        
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:10,
        paddingRight:10,
        marginBottom:5,
        
    },
    labelText:{
        fontFamily:fonts.bold,
        fontSize:15,
        color:colors.BLACK,
        opacity:0.5
    },
    valueText:{
        fontFamily:fonts.bold,
        fontSize:15,
        color:colors.BLACK,
    },
    btnContainer: {
        width: getDeviceWidth(),
        alignItems: "center",
        marginTop:20,
        marginBottom:10
    },
});
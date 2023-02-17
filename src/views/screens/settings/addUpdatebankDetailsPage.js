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
import colors from "../../../utils/colors";
import {connect} from 'react-redux'
import Config from "react-native-config";
import YellowButton from "../../../components/button";
import fonts from "../../../assets/fonts";
import { getDeviceWidth } from "../../../utils";
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { CCSActionCreator } from "../../../redux/actionCreators/app/ccs";
import ConfirmationModal from "../../../components/ccs/confirmationModal";
import ActivityIndicatorComponent from "../../../components/activityIndicator";



const mapStateToProps =(state) => ({

    addUpdateBankDetailsLoading:state.AddUpdatebankDetailsReducer.loading,
    addUpdateBankDetailsRequest:state.AddUpdatebankDetailsReducer.request,
    addUpdateBankDetailsResponse:state.AddUpdatebankDetailsReducer.response,

    getbankDetailsLoading:state.GetBankDetailsReducer.loading,
    getbankDetailsRequest:state.GetBankDetailsReducer.request,
    getbankDetailsResponse:state.GetBankDetailsReducer.response,

    deleteBankDetailsLoading:state.DeleteBankdetailsReducer.loading,
    deleteBankDetailsRequest:state.DeleteBankdetailsReducer.request,
    deleteBankDetailsResponse:state.DeleteBankdetailsReducer.response,
})

let title = ''
let buttonText = 'Okay'



class AddUpdateBankDetails extends Component {

    constructor(props){
        super(props)
        const item = props.route.params.item
        this.state = {
            name:'',//item.BankName,
            accountNumber:'',//item.AccountNumber,
            accountBSB:'',//item.BranchCode,
            showConfirmationModal:false,
            isEditTapped:false,
            
        }
    }

    componentDidMount(){

    }

    componentWillUnmount(){
        this.props.route.params.goBack()
    }

    componentDidUpdate(prevProps){
        const res = this.props.deleteBankDetailsResponse
        if(typeof(res) != 'undefined'){
            if(res != null){
                if(Object.keys(res).length > 0){
                    if(typeof(res.Status) != 'undefined'){
                        this.setState({isEditTapped:false})
                        this.props.dispatch(CCSActionCreator.resetResponse('14'))
                        
                        if(res.Status == 'Success'){
                            this.setState({name:'',accountBSB:'',accountNumber:''})
                        }
                        // }else{
                        //     title = 'Problem occured while updating the bank details. Please try again'
                        // }
                    }
                }
            }
        }
        
    }

    onClose = () => {
        this.setState({showConfirmationModal:false})
    }
    onButtonConfirmationTapped = () => {
        this.setState({showConfirmationModal:false})
        if(buttonText == 'Yes'){
            EncryptedStorage.getItem('userId',(res,err) => {
                if(res){
                    this.props.dispatch(CCSActionCreator.deleteBankDetails(res))
                }
            })
        }
    }

    renderBankDetails = () => {
        const res = this.props.getbankDetailsResponse
        if(!this.state.isEditTapped){
            if(typeof(res) != 'undefined'){
                if(typeof(res.BankName) != 'undefined' && typeof(res.AccountNumber) != 'undefined' && typeof(res.BranchCode) != 'undefined'){
                    if(res.BankName != null && res.AccountNumber != null && res.BranchCode != null){
                        if(!this.state.isEditTapped){
                            return(
                                <View>
                                    <Text style={styles.titleText}>Account Name</Text>
                                    <View style={styles.textInputHolder1}>
                                        
                                        <Text style={styles.textInput1}>{res.BankName}</Text>
                                    </View>

                                    <Text style={styles.titleText}>Account BSB</Text>
                                    <View style={styles.textInputHolder1}>
                                        <Text style={styles.textInput1}>{res.BranchCode}</Text>
                                    </View>
                                    
                                    <Text style={styles.titleText}>Account Number</Text>
                                    <View style={styles.textInputHolder1}>
                                        <Text style={styles.textInput1}>{res.AccountNumber}</Text>
                                    </View>

                                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:10}}>
                                        <YellowButton
                                        title='Edit'
                                        navigate={() => {
                                            this.setState({isEditTapped:true,name:'',accountBSB:'',accountNumber:''})
                            
                                        }}
                                        style={{alignSelf:'center',width:'45%',marginTop:15,marginBottom:15}}
                                        />
                                        <YellowButton
                                        title='Delete'
                                        navigate={() => {
                                            this.setState({showConfirmationModal:true})
                                            title = 'Are you sure you want to delete the bank details?'
                                            buttonText = 'Yes'                            
                                        }}
                                        style={{alignSelf:'center',width:'45%',marginTop:15,marginBottom:15}}
                                        />
                                    </View>
                                    
                                </View>
                                
                            )
                        }
                    }
                }
            }
            return(
                <View>
                    
                    <Text style={{fontFamily:fonts.bold,fontSize:16,textAlign:'center',margin:30}}>You don't have any bank details saved.</Text>
                    <YellowButton
                    title='Add Bank details'
                    navigate={() => {
                        this.setState({isEditTapped:true,name:'',accountNumber:'',accountBSB:''})
                            
                    }}
                    style={{alignSelf:'center',width:'80%',marginTop:30,marginBottom:15}}
                    />
                </View>
            )
        }
       
    }



    render() {
        if(this.props.addUpdateBankDetailsLoading || this.props.deleteBankDetailsLoading || this.props.getbankDetailsLoading){
            return(
                <ActivityIndicatorComponent/>
            )
        }
        return (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' && 'padding'} keyboardVerticalOffset={Platform.OS == 'ios' && 120} style={styles.container}>
                <ConfirmationModal
                    isVisible={this.state.showConfirmationModal}
                    title={title}
                    buttonText={buttonText}
                    onClose={this.onClose}
                    onButtonTapped={this.onButtonConfirmationTapped}/>

                    {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                    <Image
                    resizeMode='contain'
                    source={require('../../../assets/images/ccs_reg_image3.png')}
                    style={{width:120,height:80,alignSelf:'center',margin:15}}
                    />}
                    {this.renderBankDetails()}
                    
                    {this.state.isEditTapped &&
                <ScrollView contentContainerStyle={{backgroundColor:colors.BACKGROUND_COLOR_CCS}}>
                    <Text style={styles.titleText}>Account Name</Text>
                    <View style={styles.textInputHolder}>
                        <TextInput
                        placeholder='Account Name'
                        placeholderTextColor={colors.GREY}
                        style={styles.textInput}
                        onChangeText={(text) => {
                            this.setState({name:text})
                        }}
                        value={this.state.name}
                        maxLength={50}
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
                        />
                    </View>
                    
                    <View style={{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <YellowButton
                        title='Update'
                        disabled={this.state.accountNumber.length < 1 || this.state.accountBSB.length < 6 || this.state.name.length < 1}
                        navigate={() => {
                            const item = this.props.route.params.item
                            const state = this.state
                            
                            // if(item.AccountNumber == state.accountNumber && item.BranchCode == state.accountBSB && item.BankName == state.name){
                            //     this.setState({showConfirmationModal:true})
                            //     buttonText = 'Okay'
                            //     title = 'Please change any of the fields to continue.'
                            // }else{
                                if(state.accountNumber != '' && state.accountBSB != '' && state.name != ''){
                                   this.setState({isEditTapped:false})
                                    EncryptedStorage.getItem('userId',(res,err) => {
                                        if(res){
                                            EncryptedStorage.getItem('email',(email,err) => {
                                                if(email){
                                                    // console.warn(email)
                                                    this.props.navigation.navigate('UpdateBankConfirmation',{
                                                        name:state.name,
                                                        accountNumber:state.accountNumber,
                                                        accountBSB:state.accountBSB,
                                                        email:email,
                                                        userId:res,
                                                    
                                                    })
                                                    // this.props.dispatch(CCSActionCreator.addUpdateBankDetails(res,state.name,state.accountNumber,state.accountBSB,email))
                                                }
                                            })
                                        }
                                    })
                                }else{
                                    this.setState({showConfirmationModal:true})
                                    buttonText = 'Okay'
                                    title = 'Please make sure none of the field is empty.'
                                }
                            // }
                        
                        }}
                        style={{alignSelf:'center',width:'45%',marginTop:15,marginBottom:15,marginRight:5}}
                        />
                        <YellowButton
                        title='Cancel'
                        navigate={() => {
                            this.setState({isEditTapped:false})
                        }}
                        style={{alignSelf:'center',width:'45%',marginTop:15,marginBottom:15,marginLeft:5}}
                        />
                    </View>

                    

                </ScrollView>}
            </KeyboardAvoidingView>
        );
    }
}
export default connect(mapStateToProps) (AddUpdateBankDetails);

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
    textInputHolder1:{
        width:getDeviceWidth() - 30,
        margin:15,
        borderRadius:10,
        height:60,
        justifyContent:'center',
        padding:10,
        backgroundColor:colors.White,
    },
    textInput:{
        fontFamily:fonts.regular,
        fontSize:14,
        height:'100%',
        width:'100%'
    },
    textInput1:{
        fontFamily:fonts.regular,
        fontSize:16,
        // height:'45%',
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
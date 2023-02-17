import React, { Component } from "react";
import { 
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Share,
    SafeAreaView,
    Image,
    StyleSheet
} from "react-native";
import fonts from "../../../assets/fonts";
import YellowButton from "../../../components/button";
import ConfirmationModal from "../../../components/ccs/confirmationModal";
import { getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";
import {connect} from 'react-redux'
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { CCSActionCreator } from "../../../redux/actionCreators/app/ccs";
import ActivityIndicatorComponent from "../../../components/activityIndicator";
import Config from "react-native-config";

let modalText = ''
let buttonText = ''

const mapStateToProps =(state) => ({
    
    loading:state.AddSecondaryUsersReducer.loading,
    request:state.AddSecondaryUsersReducer.request,
    response:state.AddSecondaryUsersReducer.response,
})

class AddSecondaryUsersPage extends Component {

    constructor(props){
        super(props)
        this.state={
            fName:'',
            lName:'',
            mobile:'',
            email:'',
            showConfirmationModal:false,
            shouldShow:false,
            referralLinkToBeCopied:'',
            referralCode:''
        }
    }

    componentDidMount(){

    }

    onShare = async () => {
        try {
          const result = await Share.share({
            message:`Use this Referral Code while registering to the application. Referral Code: ${this.state.referralCode}`,
          });
    
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
      }


    componentDidUpdate(prevPros){
        const res = this.props.response
        
        if(typeof(res) != 'undefined'){
            if(Object.keys(res).length > 0){
                if(typeof(res.SecondaryUserList) != 'undefined'){
                    if(res.SecondaryUserList.length > 0){
                        if(typeof(res.SecondaryUserList[0].Status) != 'undefined'){
                            if(res.SecondaryUserList[0].Status == 'Created'){
                                if(res.SecondaryUserList[0].Refferallink != null){
                                    modalText = 'Family member/Friend is added successfully. Please copy the link and share with him/her. You can see members added in MANAGE MEMBERS section of Profile page once they register.'
                                    if(typeof(res.ReferralCode) != undefined){
                                        this.setState({referralCode:res.ReferralCode})
                                    }
                                    
                                }else{
                                    modalText = 'Family member/Friend is added successfully. You can see members added in MANAGE MEMBERS section of Profile page once they register.'
                                }
                                
                                buttonText = 'COPY CODE AND SHARE'
                                this.setState({shouldShow:false,showConfirmationModal:true})
                            }else if(res.SecondaryUserList[0].Status == 'Nominated'){
                                
                                modalText = 'Family member/Friend is already nominated. Please try adding a different user.'
                                buttonText = 'Okay'
                                this.setState({shouldShow:false,showConfirmationModal:true})
                            }else{
                                modalText = 'The member you are trying add is already registered. Please try to add other member.'
                                buttonText = 'Okay'
                                this.setState({shouldShow:false,showConfirmationModal:true})
                            }
                            this.props.dispatch(CCSActionCreator.resetResponse('4'))
                        }
                        
                    }
                }
            }
        }
    }

    onCopyButtonTapped = () => {
        
        if(modalText.includes('Please copy the link and share')){
            this.setState({fName:'',
            lName:'',
            mobile:'',
            email:''})
            this.setState({showConfirmationModal:false},() => {
                const self = this
                setTimeout(function() { 
                    self.onShare()
                 }, 1000)
                
            })
        }else{
            this.props.navigation.goBack()
        }
        
    }

    onAddTapped = (fname,lname,mobile,email) => {
        if(fname != '' && lname != '' && mobile != '' && email != ''){
            EncryptedStorage.getItem('userId',(res,err) => {
                if(res){
                    this.setState({shouldShow:true})
                    this.props.dispatch(CCSActionCreator.addSecondaryUsers(res,fname,lname,email,mobile))
                }
            })
        }else{
            alert('Please fill all the required details')
        }
    }


    render() {
        if(this.props.loading){
            return(
                <ActivityIndicatorComponent></ActivityIndicatorComponent>
            )
        }
        return (
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' && 'padding'}>
                    
                    <ConfirmationModal
                    isVisible={this.state.showConfirmationModal}
                    title={modalText}
                    buttonText={buttonText}
                    onClose={this.onClose}
                    showCloseButton={false}
                    onButtonTapped={this.onCopyButtonTapped}
                    />
                    <ScrollView contentContainerStyle={{height:'100%'}}>
                        <View style={styles.textInputHolder}>
                            <TextInput
                            style={styles.textInputName}
                            placeholder='First Name'
                            placeholderTextColor={colors.GREY}
                            value={this.state.fName}
                            onChangeText={(text) => {
                                this.setState({fName:text})
                            }}
                            />
                        </View>

                        <View style={styles.textInputHolder}>
                            <TextInput
                            style={styles.textInputName}
                            placeholder='Last Name'
                            placeholderTextColor={colors.GREY}
                            value={this.state.lName}
                            onChangeText={(text) => {
                                this.setState({lName:text})
                            }}
                            />
                        </View>

                        <View style={styles.textInputHolder}>
                            <TextInput
                            style={styles.textInputName}
                            placeholder='Mobile Number'
                            placeholderTextColor={colors.GREY}
                            keyboardType='phone-pad'
                            returnKeyLabel='Done'
                            returnKeyType='done'
                            value={this.state.mobile}
                            maxLength={11}
                            onChangeText={(text) => {
                                this.setState({mobile:text})
                            }}
                            />
                        </View>

                        <View style={styles.textInputHolder}>
                            <TextInput
                            style={styles.textInputName}
                            placeholder='Email address'
                            placeholderTextColor={colors.GREY}
                            keyboardType='email-address'
                            value={this.state.email}
                            onChangeText={(text) => {
                                this.setState({email:text})
                            }}
                            />
                        </View>
                        {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                        <Image
                        resizeMode='contain'
                        style={{width:150,height:100,alignSelf:'center'}}
                        source={require('../../../assets/images/ccs_reg_image3.png')}
                        />}

                        <YellowButton
                        title={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Add' : 'Refer'}
                        navigate={() => {
                            this.onAddTapped(this.state.fName,this.state.lName,this.state.mobile,this.state.email)
                        }}
                        style={{alignSelf:'center',width:'80%',marginBottom:15,marginTop:15}}
                        />
                        
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}
export default connect(mapStateToProps) (AddSecondaryUsersPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:colors.BACKGROUND_COLOR_CCS,
        paddingTop:20
    },
    textInputName:{
        fontFamily:fonts.bold,
        fontSize:16,
        height:'100%',
        width:'90%'
    },
    textInputHolder:{
        width:getDeviceWidth() - 20,
        margin:10,
        backgroundColor:colors.White,
        borderRadius:5,
        height:70,
        justifyContent:'center',
        padding:10,
        marginBottom:10
    }
});
import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    Platform,
    StyleSheet,
    Keyboard,
    Alert
} from "react-native";

import { connect } from 'react-redux';
import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import { CCSActionCreator } from "../../../redux/actionCreators/app/ccs";
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import ModalDropdown from 'react-native-modal-dropdown';
import colors from "../../../utils/colors";
import { getDeviceWidth } from "../../../utils";
import fonts from "../../../assets/fonts";
import YellowButton from "../../../components/button";
import ConfirmationModal from "../../../components/ccs/confirmationModal";
import ActivityIndicatorComponent from "../../../components/activityIndicator";
import DeviceSecurity from "react-native-device-security";
import RNExitApp from "react-native-exit-app";
import Config from "react-native-config";
import UsbDubbingFunction,{usbDubbingCheck} from "../maintainanceAndForceUpdate/usbDubbingCheck";


const mapStateToProps =(state) => ({

    feedbackLoading:state.SubmitFeedbackReducer.loading,
    feedbackRequest:state.SubmitFeedbackReducer.request,
    feedbackResponse:state.SubmitFeedbackReducer.response,
  
  })

  let modalText = ''

class CCSFeedback extends Component {

    constructor(props){
        super(props)
        this.state={
            desc:'',
            selectedTitle:null,
            showConfirmationModal:false
        }
    }

    componentDidMount(){
        this.props.navigation.addListener('focus', this._onFocus);
    }

    _onFocus = async () =>{
        UsbDubbingFunction()
              
    }


    componentDidUpdate(prevProps){
        const res = this.props.feedbackResponse
        if(typeof(res) != 'undefined'){
            if(Object.keys(res).length > 0){
                if(typeof(res.Status) != 'undefined'){
                    if(res.Status == 'Success'){
                        modalText = 'Thanks for your message. We will get back to you as soon as we can.'
                        this.setState({showConfirmationModal:true,desc:'',selectedTitle:null})
                    }else{
                        modalText = 'Problem occured while submitting the feedback. Please try again'
                        this.setState({showConfirmationModal:true})
                    }
                    this.props.dispatch(CCSActionCreator.resetResponse('8'))
                }
            }
        }
    }

    renderRightComponent = () => {
        return(
            <View 
            style={{backgroundColor:'#F39C6D',width:'15%',
            height:50,borderTopRightRadius:10,borderBottomRightRadius:10,
            justifyContent:'center',alignItems:'center'}}>
                <Image
                style={{width:28,height:28}}
                resizeMode='contain'
                source={require('../../../assets/images/down-arrow_round.png')}
                />
            </View>
        )
    }

    onClose = () => {
        this.setState({showConfirmationModal:false})
        this.props.navigation.goBack()
    }

    render() {
        // const feedBackTitlesRes = this.props.route.params.feedbackRes
        // let titles = []
        // if(typeof(feedBackTitlesRes) != 'undefined'){
        //     if(feedBackTitlesRes.length > 0){
        //         feedBackTitlesRes.forEach(title => {
        //             titles.push(title.Title)
        //         })
        //     }
        // }         

        if(this.props.feedbackLoading){
            return(
                <ActivityIndicatorComponent/>
            )
        }
        
        return (
            <KeyboardAvoidingView 
            style={styles.container} behavior={Platform.OS === 'ios' && 'padding'}>
                <ConfirmationModal
                    isVisible={this.state.showConfirmationModal}
                    title={modalText}
                    buttonText={'Okay'}
                    onClose={this.onClose}
                    showCloseButton={false}
                    onButtonTapped={this.onClose}
                    />
                <ScrollView contentContainerStyle={{flex:1}}>
                    <Text style={[styles.dropdownTextStyle,{margin:20}]}>Contact G8 Team Saver</Text>
                {/* <ModalDropdown 
                isFullWidth={true}
                options={titles}
                textStyle={styles.dropdownTextStyle}
                style={styles.dropDownButton}
                dropdownStyle={styles.dropDown}
                dropdownTextStyle={styles.dropdownTextStyle}
                dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
                renderRightComponent={this.renderRightComponent}
                onSelect={(index,val) => {
                    this.setState({selectedTitle:index})
                }}
                >
                </ModalDropdown> */}

                <TextInput
                placeholder='Enter your message'
                multiline={true}
                onChangeText={(text) => {
                    this.setState({desc:text})
                }}
                value={this.state.desc}
                maxLength={1000}
                style={[styles.textInput, {paddingTop : 20, paddingHorizontal : 20}]}
                blurOnSubmit={true}
                />
                <Text 
                style={{fontFamily:fonts.bold,fontSize:14,alignSelf:'flex-end',marginRight:20}}>
                    {this.state.desc.length}/1000 characters</Text>
                    
                    <YellowButton 
               title='SUBMIT ENQUIRY'
               navigate={() => {
                    // if(this.state.selectedTitle != null && this.state.desc != ''){
                    if(this.state.desc != ''){
                        // const selectedTitleId = feedBackTitlesRes[this.state.selectedTitle].ID
                        EncryptedStorage.getItem('userId',(res,err) => {
                            if(res){
                                this.props.dispatch(CCSActionCreator.submitFeedback(res,'',this.state.desc))
                            }
                        })
                    }else{
                        alert('Please enter missing details')
                    }
               }}
               style={{width:getDeviceWidth() - 50 ,margin:30,alignSelf:'center'}}
               />
             
                </ScrollView>
            
            </KeyboardAvoidingView>
        );
    }
}
export default connect(mapStateToProps)(CCSFeedback);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:20,
        backgroundColor:colors.BACKGROUNG_COLOR_GIFT
    },
    dropDownButton:{
        backgroundColor:colors.White,
        margin:20,
        width:getDeviceWidth() - 40,
        height:50,
        borderRadius:10,
        justifyContent:'center',
        paddingLeft:10
    },
    dropDown:{
        width:getDeviceWidth() - 60,
        padding:10
    },
    dropdownTextStyle:{
        fontSize:16,
        fontFamily:fonts.bold,
        width:'85%'
    },
    dropdownTextHighlightStyle:{
        fontFamily:fonts.bold,
        color:colors.APP_GREEN
    },
    textInput:{
        width:getDeviceWidth() - 40,
        margin:20,
        fontFamily:fonts.bold,
        fontSize:14,
        height:'65%',
        backgroundColor:colors.White,
        borderRadius:10,
        padding:10
    }
});
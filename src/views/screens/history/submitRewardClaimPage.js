import React, { Component } from 'react';
import { 
  View, 
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Platform,
  StyleSheet
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import moment from "moment";
import { getDeviceWidth } from '../../../utils';
import fonts from '../../../assets/fonts';
import colors from '../../../utils/colors';
import YellowButton from '../../../components/button'
import ConfirmationModal from '../../../components/ccs/confirmationModal'
import {connect} from 'react-redux'
import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import { HistoryActionCreator } from '../../../redux/actionCreators/app/history';
import Config from "react-native-config";
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";

import ActivityIndicatorComponent from "../../../components/activityIndicator";
import { ProfileActionCreator } from '../../../redux/actionCreators/app/profile';



var RNFS = require('react-native-fs');


const mapStateToProps =(state) => ({

  loading:state.SubmitRewardClaimReducer.loading,
  request:state.SubmitRewardClaimReducer.request,
  response:state.SubmitRewardClaimReducer.response,

  profileLoading:state.GetProfileDetailsReducer.loading,
  profileRequest:state.GetProfileDetailsReducer.request,
  profileResponse:state.GetProfileDetailsReducer.response,
})

let title = 'Please attach an invoice to submit the claim'
const expectedPoints = (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Expected Cashback' : 'Expected Points'

class SubmitRewardClaimPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateOfPurchase:moment(props.route.params.item.CreatedDate).format('MM/DD/yyyy'),
      saleValue:'',
      invoiceOrOrderId:'',
      expectedPoints:'',
      fileToUpload:null,
      showConfirmationModal:false,
      shouldShowSpinner:false
    };
  }

  componentDidMount(){
    EncryptedStorage.getItem('userId',(res,err) => {
      if(res){
        this.props.dispatch(ProfileActionCreator.getProfileDetails(res))
      }
    })
    
  }

  componentDidUpdate(prevProps){
    const res = this.props.response
    if(typeof(res) != 'undefined' && !this.props.loading){
      if(Object.keys(res).length > 0){
        if(typeof(res.Status) != 'undefined'){
          if(res.Status != null){
            this.props.dispatch(HistoryActionCreator.resetSubmitClaim())
            if(res.Status == 'Success'){
               title = 'Your reward claim is submitted for enquiry.'
              this.setState({showConfirmationModal:true})
            }else{
                title = 'Problem occured while submitting the reward claim. Please try again.'
              this.setState({showConfirmationModal:true})
            }
            
          }
        }
      }
    }
  }

  onAttachTapped = async() => {
    try {
            
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      // console.warn(
      //   res.uri,
      //   res.type, // mime type
      //   res.name,
      //   res.size
      // );
      this.setState({fileToUpload:res})
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  onSubmitTapped = () => {
    if (this.state.fileToUpload != null) {
      if (typeof(this.state.fileToUpload.uri) != 'undefined') {
        
        if (this.state.fileToUpload.uri != null) {
          if(Platform.OS == 'android'){
            console.warn(JSON.stringify(this.state.fileToUpload.uri.split('%20')))
            // RNFS.exists(this.state.fileToUpload.uri)
            //   .then(success => {
            //     if (success) {
                  // this.setState({shouldShowSpinner:true})
                  RNFS.readFile(this.state.fileToUpload.uri.split('%20').join(' '), 'base64').then((content) => {
                    if(content){
                      EncryptedStorage.getItem('userId',(res,err) => {
                        if(res){
                          EncryptedStorage.getItem('email',(email,err) => {
                            if(email){
                              const itm = this.props.route.params.item
                              let type = ''
                              if(typeof(this.state.fileToUpload.type) != 'undefined'){
                                  
                                  if(this.state.fileToUpload.type.includes('pdf')){
                                    type = 'pdf'
                                  }else if(this.state.fileToUpload.type.includes('png')){
                                    type = 'png'
                                  }else if(this.state.fileToUpload.type.includes('jpeg')){
                                    type = 'jpeg'
                                  }else if(this.state.fileToUpload.type.includes('jpg')){
                                    type = 'jpg'
                                  }else{
      
                                  }
                              }
                              // this.setState({shouldShowSpinner:false})
                              const profile = this.props.profileResponse
                              if(typeof(profile) != 'undefined'){
                                if(profile != null){
                                  if(typeof(profile.MemberID) != 'undefined'){
                                    if(profile.MemberID != null){
                                      this.props.dispatch(HistoryActionCreator.submitRewardClaim(res,itm.OfferID,itm.OfferName,
                                        this.state.invoiceOrOrderId,this.state.saleValue,this.state.dateOfPurchase,this.state.expectedPoints,
                                        content,type,email,profile.MemberID.toString()))
                                    }
                                  }
                                }
                              }
                                
                            }
                          })
                          
                        }
                    })
                    }
                    })
                    .catch((err) => {
                      console.warn('Error Occured: '+ err.toString())
                    })
                // } else {
                //   console.warn('Did not go through')
                // }
              // })
              .catch(err => {
                console.log(err.message, err.code);
              });
          }else{

            console.warn(JSON.stringify(this.state.fileToUpload.uri.split('%20')))
          RNFS.exists(this.state.fileToUpload.uri.split('%20').join(' '))
            .then(success => {
              if (success) {
                this.setState({shouldShowSpinner:true})
                RNFS.readFile(this.state.fileToUpload.uri.split('%20').join(' '), 'base64').then((content) => {
                  if(content){
                    EncryptedStorage.getItem('userId',(res,err) => {
                      if(res){
                        EncryptedStorage.getItem('email',(email,err) => {
                          if(email){
                            const itm = this.props.route.params.item
                        let type = ''
                        if(typeof(this.state.fileToUpload.type) != 'undefined'){
                            
                            if(this.state.fileToUpload.type.includes('pdf')){
                              type = 'pdf'
                            }else if(this.state.fileToUpload.type.includes('png')){
                              type = 'png'
                            }else if(this.state.fileToUpload.type.includes('jpeg')){
                              type = 'jpeg'
                            }else if(this.state.fileToUpload.type.includes('jpg')){
                              type = 'jpg'
                            }else{

                            }
                        }
                        const profile = this.props.profileResponse
                              if(typeof(profile) != 'undefined'){
                                if(profile != null){
                                  if(typeof(profile.MemberID) != 'undefined'){
                                    if(profile.MemberID != null){
                                      this.props.dispatch(HistoryActionCreator.submitRewardClaim(res,itm.OfferID,itm.OfferName,
                                        this.state.invoiceOrOrderId,this.state.saleValue,this.state.dateOfPurchase,this.state.expectedPoints,
                                        content,type,email,profile.MemberID.toString()))
                                    }
                                  }
                                }
                              }
                        
                          }
                        })
                        
                      }
                  })
                  }
                  })
                  .catch((err) => {
                    console.warn('Error Occured: '+ err.toString())
                  })
              } else {
                console.warn('Did not go through')
              }
            })
            .catch(err => {
              console.log(err.message, err.code);
            });

          }
          
  
        } else {
          this.setState({
            showConfirmationModal: true
          })
        }
      }
    }
  
  }

  onClose = () => {
    this.setState({
        showConfirmationModal:false
    },() => {
      if(title == 'Your reward claim is submitted for enquiry.'){
        this.props.navigation.goBack()
      }
    })
    
}

  render() {
    if(this.props.loading){
      return(
        <ActivityIndicatorComponent/>
      )
    }
    return (
      <KeyboardAvoidingView behavior={Platform.OS == 'ios' && 'padding'} style={styles.container}>
        {/* <ActivityIndicatorModal
        isVisible={this.props.loading}
        /> */}
        <ConfirmationModal
        isVisible={this.state.showConfirmationModal}
        title={title}
        buttonText={'Okay'}
        onClose={this.onClose}
        onButtonTapped={this.onClose}/>
        <ScrollView
        contentContainerStyle={{borderWidth:1,borderColor:colors.APP_GREEN,margin:5}}>
          <View style={styles.textInputHolder}>
            <View style={{width:'40%'}}>
              <Text style={[styles.lableText,{width:'100%'}]}>Date of Purchase</Text>
              <Text style={[styles.lableText,{fontSize:10,width:'70%',textAlign:'center'}]}>(MM/DD/YYYY)</Text>
            </View>
            
            <TextInput
            style={styles.textInput}
            placeholder='mm/dd/yyyy'
            keyboardType='numbers-and-punctuation'
            value={this.state.dateOfPurchase}
            onChangeText={(text) => {
              this.setState({dateOfPurchase:text})
            }}
            />
          </View>

          <View style={styles.textInputHolder}>
            <Text style={styles.lableText}>Sale Value</Text>
            <TextInput
            style={styles.textInput}
            placeholder='Sale Value'
            keyboardType='numbers-and-punctuation'
            value={this.state.saleValue}
            onChangeText={(text) => {
              this.setState({saleValue:text})
            }}
            />
          </View>

          <View style={styles.textInputHolder}>
            <Text style={styles.lableText}>Invoice/Order ID</Text>
            <TextInput
            style={styles.textInput}
            placeholder='Invoice/Order ID'
            keyboardType='numbers-and-punctuation'
            value={this.state.invoiceOrOrderId}
            onChangeText={(text) => {
              this.setState({invoiceOrOrderId:text})
            }}
            />
          </View>

          <View style={[styles.textInputHolder,{height:80}]}>
            <View style={{width:'60%'}}>
              <View style={{width:'100%',flexDirection:'row'}}>
                <Text style={{fontFamily:fonts.bold,fontSize:13}}>Upload Invoice</Text>
                <Text style={{color:'red',fontFamily:fonts.bold,fontSize:13}}>*</Text>
              </View>
              <Text style={{fontFamily:fonts.bold,fontSize:10,margin:2}}>(pdf,png,jpeg,jpg)</Text>
            </View>
            
            {this.state.fileToUpload == null
            ?
              <View style={{width:'60%',height:'100%',alignItems:'flex-start',
              justifyContent:'center'}}>
                <YellowButton
                title='Attach'
                navigate={() => {
                  this.onAttachTapped()
                }}
                style={{width:80,height:40}}
                textStyle={{fontSize:15}}
                />
              </View>

              
            :
            <View style={{width:'100%',height:'100%'}}>
              <Text style={[styles.lableText,{width:'70%',marginRight:80,fontSize:10,marginBottom:5,textAlign:'center'}]}>{this.state.fileToUpload.name}</Text>
              <YellowButton
                title='Change'
                navigate={() => {
                  this.onAttachTapped()
                }}
                style={{width:80,height:40}}
                textStyle={{fontSize:15}}
                />
            </View>
            
            
            }
          </View>

          <View style={styles.textInputHolder}>
            <Text style={styles.lableText}>{expectedPoints}</Text>
            <TextInput
            style={styles.textInput}
            placeholder={expectedPoints}
            keyboardType='numbers-and-punctuation'
            value={this.state.expectedPoints}
            onChangeText={(text) => {
              this.setState({expectedPoints:text})
            }}
            />
          </View>

          
          
        </ScrollView>

        <YellowButton
        title='Submit'
        style={{margin:20,alignSelf:'center'}}
        navigate={() => {
            this.onSubmitTapped()
          }}
        />
        <View style={{flexDirection:'row',width:getDeviceWidth() - 20,justifyContent:'center',margin:10,marginBottom:30}}>
          <Text style={{fontFamily:fonts.bold,fontSize:12,color:'red'}}>*</Text>
          <Text style={{fontFamily:fonts.bold,fontSize:12}}>Please provide the invoice to enable process of claim.</Text>
        </View>
        
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps) (SubmitRewardClaimPage);


const styles = StyleSheet.create({
  container:{
    justifyContent:'center',
    flex:1,
    
  },
  textInputHolder:{
    width:getDeviceWidth() - 20,
    margin:10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    height:45,
  },
  lableText:{
    fontFamily:fonts.bold,
    fontSize:13,
    width:'40%'
  },
  textInput:{
    fontFamily:fonts.bold,
    fontSize:13,
    width:'58%',
    marginRight:5,
    height:'90%',
    borderBottomWidth:1,
    borderBottomColor:colors.APP_GREEN
  }
});

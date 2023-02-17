import React, { Component } from 'react';
import { View, Text,StyleSheet,Image, ActivityIndicator } from 'react-native';

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
})

let title = ''

class UpdateBankConfirmationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showConfirmationModal:false
    };
  }

  componentDidUpdate(){
    const res = this.props.addUpdateBankDetailsResponse
    if(typeof(res) != 'undefined'){
        if(res != null){
            if(Object.keys(res).length > 0){
                if(typeof(res.Status) != 'undefined'){
                    this.setState({showConfirmationModal:true})
                    this.props.dispatch(CCSActionCreator.resetResponse('11'))
                    
                    if(res.Status == 'Success'){
                        title = 'Your bank details updated successfully.'
                    }else{
                        title = 'Problem occured while updating the bank details. Please try again'
                    }
                }
            }
        }
    }
    
  }

  onClose = () => {
    this.setState({showConfirmationModal:false})
    this.props.navigation.goBack()
}

  render() {
      const item = this.props.route.params
      if(this.props.addUpdateBankDetailsLoading){
          return(
              <ActivityIndicatorComponent/>
          )
      }
    return (
        <View style={styles.container}>
        <ConfirmationModal
            isVisible={this.state.showConfirmationModal}
            title={title}
            body={''}
            buttonText={'Okay'}
            onClose={this.onClose}
            onButtonTapped={this.onClose}/>
        {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
            <Image
            resizeMode='contain'
            source={require('../../../assets/images/ccs_reg_image3.png')}
            style={{width:120,height:80,alignSelf:'center',marginBottom:20}}
            />}
            <Text style={[styles.titleText,{marginRight:10,marginLeft:10,marginBottom:10}]}>Please confirm you are updating your bank account details to:</Text>
            
        
        
        <View style={styles.detailsHolder}>
        
            <View style={{flexDirection:'row',justifyContent:'center',width:'100%'}}>
            <View style={styles.splittedView}>
                <Text style={[styles.titleText,{textAlign:'right',width:(getDeviceWidth() - 80) /2}]}>Account Name:</Text>
                <Text style={[styles.titleText,{textAlign:'right',width:(getDeviceWidth() - 80) /2}]}>Account BSB:</Text>
                <Text style={[styles.titleText,{textAlign:'right',width:(getDeviceWidth() - 80) /2}]}>Account Number:</Text>
            </View>

            <View style={styles.splittedView}>
                <Text style={[styles.titleText,{textAlign:'left',marginLeft:5}]}>{item.name}</Text>
                <Text style={[styles.titleText,{textAlign:'left',marginLeft:5}]}>{item.accountBSB}</Text>
                <Text style={[styles.titleText,{textAlign:'left',marginLeft:5}]}>{item.accountNumber}</Text>
            </View>
            </View>
        
        </View>
        <View style={[styles.detailsHolder,{backgroundColor:'transparent',justifyContent:'space-around'}]}>
            <YellowButton
            title='Yes'
            navigate={() => {
                this.props.dispatch(CCSActionCreator.addUpdateBankDetails(item.userId,item.name,item.accountNumber,item.accountBSB,item.email))
            }}
            style={{width:'45%'}}
            />

            <YellowButton
            title='No'
            navigate={() => {
                this.props.navigation.goBack()
            }}
            style={{width:'45%'}}
            />
        </View>
    </View>
    );
  }
}

export default connect(mapStateToProps) (UpdateBankConfirmationPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:20
    },
    titleText:{
        fontFamily:fonts.bold,
        fontSize:15,
        marginBottom:20,
        marginTop:20,
        textAlign:'center',
    },
    confirmationText:{
        fontFamily:fonts.regular,
        fontSize:16,
        marginBottom:20,
        marginTop:20,
        margin:20,
        textAlign:'center',
    },
    detailsHolder:{
        flexDirection:'row',
        width:getDeviceWidth() - 40,
        margin:20,
        borderRadius:10,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:colors.White,
        justifyContent:'center',
    },
    splittedView:{
        width:(getDeviceWidth() - 80) /2,
        justifyContent:'center',
        alignItems:'center'

    }
})
import React, { Component } from 'react';
import { View, Text,StyleSheet,TextInput,TouchableOpacity } from 'react-native';
import fonts from '../../../assets/fonts';
import YellowButton from '../../../components/button';
import { isValidEmail, widthToDp } from '../../../utils';
import colors from '../../../utils/colors';
import {connect} from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { ProfileActionCreator } from '../../../redux/actionCreators/app/profile';
import { DYNAMIC_LINK } from '../../../constants';

const mapStateToProps =(state) => ({
    
  loading:state.EditMobileReducer.loading,
  request:state.EditMobileReducer.request,
  response:state.EditMobileReducer.response,

})

class EditMobileNumberPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile:''
    };
  }

  componentDidUpdate(){
    const verifyMobile = this.props.response
    if(typeof(verifyMobile) != 'undefined'){
      if(Object.keys(verifyMobile).length > 0){
          this.props.dispatch(ProfileActionCreator.resetVerifyMobile())
          if(typeof(verifyMobile.Status) != 'undefined'){
              if(verifyMobile.Status == 'Success'){
                  // if(typeof(this.props.response) != 'undefined'){
                  //     if(typeof(this.props.response.Mobile) != 'undefined'){
                  //         if(this.props.response.Mobile != null){
                  //             if(this.props.response.Mobile.length > 8){
                                  this.props.navigation.navigate('VerifyMobile',{mobile:this.state.mobile,isStep2:true})
                  //             }
                  //         }
                  //     }
                  // }
                   
              }
          }
      }
  }
  }

  render() {
    return (
      <View style={styles.container}>
          <Text style={{fontFamily:fonts.bold,fontSize:16}}>Enter New Mobile Number:</Text>
        <View style={styles.InputContainer}>
            <TextInput
            style={styles.textInput}
            placeholder="Mobile Number"
            placeholderTextColor={colors.TEXT_INPUT_PLACEHOLDER}
            underlineColorAndroid="transparent"
            value={this.state.mobile}
            onChangeText={(text) => {
                this.setState({ mobile: text })
            }}
            autoCapitalize="none"
            keyboardType='phone-pad'
            maxLength={14}
            onTouchStart={() => {
                                    
            }}
                                
            />
        </View>
        <YellowButton
        title='Proceed'
        disabled={this.state.mobile.length < 9}
        style={{margin:20}}
        navigate={() => {
          EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(ProfileActionCreator.editMobile(res,this.state.mobile,'2'))
            }
        })
        }}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps) (EditMobileNumberPage);


const styles = StyleSheet.create({
  container: {
      justifyContent:'center',
      alignItems:'center',
      flex:1
  },
  text: {
      color: colors.APP_GREEN,
      fontSize: widthToDp('5%'),
      fontFamily:fonts.medium,
      textAlign:'center'
  },
  InputContainer: {
      width: widthToDp('70%'),
      marginTop: 10,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: Colors.APP_GREEN,
      borderRadius: 3,
      overflow: 'hidden'
  },
  textInput: {
      height: 42,
      color: colors.TEXT_INPUT,
      backgroundColor: colors.WHITE,
      paddingLeft: 10,
      fontFamily:fonts.medium
  },
})

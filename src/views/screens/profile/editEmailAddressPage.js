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
    
    loading:state.EditEmailReducer.loading,
    request:state.EditEmailReducer.request,
    response:state.EditEmailReducer.response,

})

class EditEmailAddressPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email:''
    };
  }

  componentDidUpdate(){
    const verifyEmail = this.props.response

    if(typeof(verifyEmail) != 'undefined'){
        if(Object.keys(verifyEmail).length > 0){
            this.props.dispatch(ProfileActionCreator.resetVerifyEmail())
            if(typeof(verifyEmail.Status) != 'undefined'){
                if(verifyEmail.Status == 'Success'){
                 EncryptedStorage.getItem('email',(email,err) => {
                     if(email){
                         this.props.navigation.navigate('VerifyEmail',{email:this.state.email,isStep2:true})
                     }
                 })
                     
                }
            }
        }
    }
  }

  render() {
    return (
      <View style={styles.container}>
          <Text style={{fontFamily:fonts.bold,fontSize:16}}>Enter New Email:</Text>
        <View style={styles.InputContainer}>
            <TextInput
            style={styles.textInput}
            placeholder="Email*"
            placeholderTextColor={colors.TEXT_INPUT_PLACEHOLDER}
            underlineColorAndroid="transparent"
            value={this.state.email}
            onChangeText={(text) => {
                this.setState({ email: text })
            }}
            autoCapitalize="none"
            maxLength={80}
            keyboardType='email-address'
            onTouchStart={() => {
                                    
            }}
                                
            />
            {!isValidEmail(this.state.email) && this.state.email != '' &&
                <Text style={{fontFamily:fonts.regular,color:colors.APP_GREEN,fontSize:12,textAlign:'center'}}>Enter a valid email</Text>}
        </View>
        <YellowButton
        title='Next'
        style={{margin:20}}
        navigate={() => {
            if(isValidEmail){
                EncryptedStorage.getItem('userId',(res,err) => {
                    if(res){
                        this.props.dispatch(ProfileActionCreator.editEmail(res,this.state.email,DYNAMIC_LINK,'2'))
                    }
                })
            }
        }}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps) (EditEmailAddressPage);


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

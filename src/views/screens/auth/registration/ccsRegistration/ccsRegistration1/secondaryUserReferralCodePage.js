import React, { Component } from "react";
import { 
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    KeyboardAvoidingView,
    StyleSheet
} from "react-native";
import fonts from "../../../../../../assets/fonts";
import { getDeviceWidth, widthToDp } from "../../../../../../utils";
import colors from "../../../../../../utils/colors";
import Icons from "../../../../../../assets/icons";
import YellowButton from "../../../../../../components/button";
import {connect} from 'react-redux'
import { CCSActionCreator } from "../../../../../../redux/actionCreators/app/ccs";
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import ActivityIndicatorComponent from "../../../../../../components/activityIndicator";
import ConfirmationModal from "../../../../../../components/ccs/confirmationModal";


const mapStateToProps =(state) => ({
    
    loading:state.ReferralCodeVerificationReducer.loading,
    request:state.ReferralCodeVerificationReducer.request,
    response:state.ReferralCodeVerificationReducer.response,
})


class SecondaryUserReferralVerificationPage extends Component {

    constructor(props){
        super(props)
        this.state = {
            referralCode:'',
            showConfirmationModal:false
        }
    }

    componentDidUpdate(prevProps){
        const res = this.props.response
        if(Object.keys(res).length > 0){
            if(typeof(res.Status) != 'undefined'){
                this.props.dispatch(CCSActionCreator.resetResponse('10'))
                if(res.Status == 'Success'){
                    this.props.navigation.navigate('SignUp4')
                }else{
                    this.setState({showConfirmationModal:true})
                }
            }
        }
    }

    onClose = () =>{
        this.setState({showConfirmationModal:false})
    }



    render() {
        if(this.props.loading){
            return(
                <ActivityIndicatorComponent/>
            )
        }
        return (
            <KeyboardAvoidingView style={styles.container}>
                <ConfirmationModal
                    isVisible={this.state.showConfirmationModal}
                    title={'Please enter the correct referral code. If you have entered the correct code and still seeeing this error, please try again. '}
                    buttonText={'Okay'}
                    onClose={this.onClose}
                    showCloseButton={false}
                    onButtonTapped={this.onClose}
                    />
                <Image style={styles.image} source={Icons['CCS_REG3']} resizeMode='contain'/>
                <Text style={styles.titleText}>Please enter the Referral Code that you got from the one who nominated you below</Text>
                <View style={styles.textInputHolder}>
                    <TextInput
                    maxLength={10}
                    returnKeyType='done'
                    returnKeyLabel='Done'
                    placeholderTextColor={colors.GREY}
                    style={styles.textInput}
                    placeholder='Referral Code'
                    value={this.state.referralCode}
                    onChangeText={(text) => {
                        this.setState({referralCode:text})
                    }}
                    />       
                </View>
                <YellowButton
                title='Submit'

                navigate={() => {
                    
                    if(this.state.referralCode.length > 5){

                        EncryptedStorage.getItem('userId',(res,err) => {
                            if(res){
                                EncryptedStorage.getItem('email',(email,err) => {
                                    if(email){
                                        this.props.dispatch(CCSActionCreator.verifyReferralCode(res,email,this.state.referralCode))
                                    }
                                })
                            }
                        })

                    }
                }}
                />
                
            </KeyboardAvoidingView>
        );
    }
}
export default connect(mapStateToProps) (SecondaryUserReferralVerificationPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:colors.BACKGROUND_COLOR_CCS,
        alignItems: 'center',
        paddingTop:80
    },
    titleText:{
        fontFamily:'Graphik-Medium',
        fontSize:18,
        textAlign:'center',
        marginLeft:15,
        marginRight:15,
        marginTop:20,
        marginBottom:20,
        fontWeight:'500',
    },
    image:{
        width:getDeviceWidth()/1.3, 
        height:100,
        marginTop:20,
    },
    textInput:{
        fontFamily:'Graphik-Medium',
        fontSize:18,
        textAlign:'center',
        fontWeight:'500',
        height:'100%'
    },
    textInputHolder:{
        width:getDeviceWidth() - 20,
        margin:10,
        backgroundColor:colors.White,
        borderRadius:5,
        height:70,
        justifyContent:'center',
        padding:10,
        marginBottom:20,
        borderWidth:1,
        borderColor:colors.APP_GREEN
    }


});
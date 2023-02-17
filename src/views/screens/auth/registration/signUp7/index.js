import React, {Component} from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import Colors from '../../../../../utils/colors'
import { SIGNUP_7, NEXT, SIGNUP_8 } from '../../../../../constants'
import { widthToDp, getDeviceWidth } from '../../../../../utils';
import CheckBox from '@react-native-community/checkbox';
import YellowButton from '../../../../../components/button';

import ActivityIndicatorComponent from '../../../../../components/activityIndicator';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RegistrationActionCreator } from '../../../../../redux/actionCreators/registration';
import fonts from '../../../../../assets/fonts';
import Config from "react-native-config";
import { CCSActionCreator } from '../../../../../redux/actionCreators/app/ccs';
import { WebView } from 'react-native-webview';
import colors from '../../../../../utils/colors';



const mapStateToProps =(state) => ({
    
    loading:state.GetTCRegReducer.loading,
    request:state.GetTCRegReducer.request,
    response:state.GetTCRegReducer.response,

    ppLoading:state.GetPrivacyPolicyRegReducer.loading,
    ppRequest:state.GetPrivacyPolicyRegReducer.request,
    ppResponse:state.GetPrivacyPolicyRegReducer.response,

    acceptLoading:state.AcceptTCRegReducer.loading,
    acceptRequest:state.AcceptTCRegReducer.request,
    acceptResponse:state.AcceptTCRegReducer.response,

    isPrimaryUserLoading:state.IsPrimaryUserReducer.loading,
    isPrimaryUserRequest:state.IsPrimaryUserReducer.request,
    isPrimaryUserResponse:state.IsPrimaryUserReducer.response,


  })

class SignUpStep7 extends Component {

    constructor(props){
        super(props)
        this.state={
            checkbox1:false,
            checkbox2:false,
            tc:true
        }
    }

    componentDidMount(){
        this.fetchTCAndPP()
        if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
            this.props.navigation.setOptions({
                headerShown:true,
                title:(
                    <View 
                    style = {{justifyContent:'center',alignItems:'center'}}
                >
                    <Text 
                        numberOfLines = {3}
                        style={{fontSize: 12,color:colors.White,fontFamily:fonts.medium}} 
                        
                    >
                        {SIGNUP_7.lbl_1}
                    </Text>
                </View>
                )
              });
        }
        
    }

    componentDidUpdate(prevProps){
        const res = this.props.acceptResponse
        if(typeof(res) != 'undefined'){
            if(Object.keys(res).length > 0){
                console.warn(JSON.stringify(this.props.acceptResponse))
                if(typeof(res.Status) != 'undefined'){
                    if(res.Status == 'Success'){
                        // if(res.saved_status == 'true'){
                            if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
                                this.props.navigation.navigate('SignUp11')
                            }else{
                                this.props.navigation.navigate('SignUp9')
                            }
                                 
                        // }
                    }else{
                        alert('Please try again.')
                    }
                }
                this.props.dispatch(RegistrationActionCreator.resetResponse('7'))
            }
        }
    }

    fetchTCAndPP = () => {
        EncryptedStorage.getItem('email',(res,err) => {
            if(res){
                this.props.dispatch(CCSActionCreator.isPrimaryUser())
            }
        })
        this.props.dispatch(RegistrationActionCreator.getTCAndPP(false))
        this.props.dispatch(RegistrationActionCreator.getTCAndPP(true))
    }
    

    onNextbuttonTapped = () => {
        //props.navigation.navigate('SignUp9')
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(RegistrationActionCreator.acceptTC(res,true))
            }
        })
        
    }

    renderHtml = (content) => {
        return(
            <WebView
                    source={{ uri: content }}
                    //Enable Javascript support
                    javaScriptEnabled={true}
                    //For the Cache
                    domStorageEnabled={true}
                    //View to show while loading the webpage
                    //Want to show the view or not
                    //startInLoadingState={true}
                    onLoadStart={() => console.warn('Loaded..')}
                    onLoad={() => console.warn('Loaded Done..')}
                // style={{ marginTop: 20 }}
                />
        )
    }

    loadTC = () => {
        if(typeof(this.props.response) != 'undefined'){
            if(typeof(this.props.response.Status) != 'undefined'){
                if(this.props.response.Status == 'Success'){
                    return(
                        <View style={{flex: 1,width:getDeviceWidth() - 30,margin:15}}>
                            {/* <Text style={styles.textBlack} >{this.props.response.TNC}</Text> */}
                            {this.renderHtml('https://reward360.optus.invia.com.au/home/TNC')}
                        </View>
                    )
                }
            }
        }
    }

    loadPP = () => {
        if(typeof(this.props.ppResponse) != 'undefined'){
            if(typeof(this.props.ppResponse.Status) != 'undefined'){
                if(this.props.ppResponse.Status == 'Success'){
                    return(
                        <View style={{flex: 1,width:getDeviceWidth() - 30,margin:15}}>
                            {/* <Text style={styles.textBlack} >{this.props.ppResponse.PP}</Text> */}
                            {this.renderHtml('https://reward360.optus.invia.com.au/home/PrivacyPolicy')}
                        </View>
                    )
                }
            }
        }
    }

    render(){
        
        if(this.props.loading || this.props.acceptLoading || this.props.ppLoading){
            return(
                <ActivityIndicatorComponent/>
            )
        }
    return (
        <View style={styles.container}>
            <View style={styles.textContainer} >
            {(!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) &&
                <Text style={styles.textGreen} >{SIGNUP_7.lbl_1}</Text>}
                {/* <ScrollView contentContainerStyle={{padding:10,marginTop:10}}
                pagingEnabled={true}> */}
                    {this.state.tc
                    ?
                    <View style={{flex: 1,}}>
                        <Text style={[styles.textBlack,{fontFamily:fonts.bold,fontSize:18,textAlign:'left',marginLeft:15}]}>Terms and Conditions</Text>
                        {/* {this.loadTC()} */}
                    </View>
                    :
                    <View style={{flex: 1,}}>
                        <Text style={[styles.textBlack,{fontFamily:fonts.bold,fontSize:18,textAlign:'left',marginLeft:15}]}>Privacy Policy</Text>
                        {/* {this.loadPP()} */}
                    </View>
                    }
                {/* </ScrollView> */}
                
                <View style={{justifyContent:'flex-start'}}>
                <View style={styles.checkBoxContainer}>
                    <CheckBox
                    disabled={false}
                    style={{width:20,height:20,marginRight:10}}
                    value={this.state.checkbox1}
                    onValueChange={(newValue) => {
                        this.setState({checkbox1:newValue,tc:true})
                    }}
                    />
                    <Text style={styles.checkBoxText} >{SIGNUP_7.lbl_3}</Text>
                </View>
                <View style={styles.checkBoxContainer}>
                    <CheckBox
                        disabled={false}
                        style={{width:20,height:20,marginRight:10}}
                        value={this.state.checkbox2}
                        onValueChange={(newValue) => {
                            this.setState({checkbox2:newValue,tc:false})
                        }}
                    />
                    <Text style={styles.checkBoxText} >{SIGNUP_7.lbl_4}</Text>

                </View>
                </View>
            </View>

            <View style={styles.btnContainer} >
                <YellowButton 
                disabled={!this.state.checkbox1 || !this.state.checkbox2}
                title={NEXT} 
                navigate={() => {this.onNextbuttonTapped()}} />
            </View>
        </View>
    );
    }
}

export default connect(mapStateToProps)(SignUpStep7);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        // paddingVertical: 30,
        backgroundColor: Colors.BG_LIGHT_BLUE
    },
    textContainer: {
        width: "80%",
        alignItems: "center",
        justifyContent: 'center',
        alignContent: "center",
        flex: 1
    },
    textGreen:
    {
        color: Colors.APP_GREEN,
        fontSize: widthToDp('4%'),
        fontFamily:fonts.medium,
        marginBottom:10,
        marginTop:30
    },
    textBlack:
    {
        color: Colors.BLACK,
        fontSize: widthToDp('3.5%'),
        margin: 4,
        textAlign:'center',
        fontFamily:fonts.medium
    },
    checkBoxContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:10,
        marginTop:10
    },
    checkBoxText: {
        color: Colors.APP_GREEN,
        fontSize: widthToDp('4%'),
        fontFamily:fonts.medium
    },
    btnContainer:
    {
        width: getDeviceWidth(),
        marginVertical: 40,
        alignItems: "center"
    }


});
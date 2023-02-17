import React, {Component} from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import YellowButton from '../../../../../components/button';
import UnderlineText from '../../../../../components/underlineText';
import Colors from '../../../../../utils/colors'
import { SIGNUP_9, SKIP, CONTINUE } from '../../../../../constants'
import {  widthToDp, getDeviceWidth,heightToDp } from '../../../../../utils';
import Icons from '../../../../../assets/icons'
// import ImagePicker from 'react-native-image-crop-picker';
import ActivityIndicatorComponent from '../../../../../components/activityIndicator';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RegistrationActionCreator } from '../../../../../redux/actionCreators/registration';
import fonts from '../../../../../assets/fonts';
import Config from "react-native-config";


const mapStateToProps =(state) => ({
    
    loading:state.UploadImageRegReducer.loading,
    request:state.UploadImageRegReducer.request,
    response:state.UploadImageRegReducer.response,

  })

class SignUpStep9 extends Component {


    constructor(props){
        super(props)
        this.state = {
            image:null
        }
    }

    componentDidUpdate(prevPros){
        const res = this.props.response
        if(typeof(res) != 'undefined'){
            if(Object.keys(res).length > 0){
                if(typeof(res.Status) != 'undefined'){
                    // alert(JSON.stringify(res))
                    if(res.Status == 'Success'){
                        // if(res.saved_status == 'true'){
                            this.moveToNextScreen()
                        // }
                    }else{
                        alert('Problem occured while uploading the image.')
                        this.moveToNextScreen()
                    }
                }
                
                this.props.dispatch(RegistrationActionCreator.resetResponse('8'))
            }
        }
    }

    moveToNextScreen = () => {
        if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
            this.props.navigation.navigate('SignUp11')
        }else{
            this.props.navigation.navigate('SignUp10')
        }
    }

    onNextButtonTaped = () => {
        if(this.state.image != null){
            EncryptedStorage.getItem('userId',(res,err) => {
                if(res){
                    this.props.dispatch(RegistrationActionCreator.uploadImage(res,this.state.image.data,false))
                }
            })
        }else{
            this.moveToNextScreen()
        }
    }

    render(){
        if(this.props.loading){
            return(
                <ActivityIndicatorComponent/>
            )
        }
        return(
            <View style={styles.container}>
                <View style={styles.textContainer} >
                    <Text style={styles.text} >{SIGNUP_9.lbl_1}</Text>
                    <Text style={styles.text} >{SIGNUP_9.lbl_2}</Text>
                    <View style={styles.ImageCircle}>
                        {this.state.image != null 
                        ?
                        <Image source={{uri: `data:${this.state.image.mime};base64,${this.state.image.data}`}} resizeMode='cover' style={styles.image} />
                        :
                        <Image source={Icons['CAMERA']} resizeMode='contain' style={styles.imagenull} />
                        }
                    </View>

                    <TouchableOpacity 
                    style={styles.touchableOpacity}
                    onPress={() => {
                        // ImagePicker.openPicker({
                        // // width: 300,
                        // // height: 400,
                        // includeBase64:true,
                        // cropping: true
                        // }).then(image => {
                        //     this.setState({image:image})
                        // });
                    }}>
                        <Text style={styles.imagText} >{SIGNUP_9.lbl_3}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                    style={styles.touchableOpacity}
                    onPress={() => {
                        // ImagePicker.openCamera({
                        // width: 300,
                        // height: 400,
                        // includeBase64:true,
                        // cropping: true
                        // }).then(image => {
                        //     this.setState({image:image})
                        // });
                    }}>
                        <Text style={styles.imagText} >{SIGNUP_9.lbl_4}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.btnContainer} >
                    <YellowButton title={CONTINUE} navigate={() => {this.onNextButtonTaped()}} />
                    <UnderlineText title={SKIP} navigate={() => { this.moveToNextScreen() }} />
                </View>
            </View>
        )
    }
    
}

export default connect(mapStateToProps)(SignUpStep9);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 30,
        backgroundColor: Colors.BG_LIGHT_BLUE
    },
    text:
    {
        color: Colors.APP_GREEN,
        fontSize: widthToDp('9%'),
        fontFamily:fonts.medium
    },
    textContainer: {
        width: getDeviceWidth(),
        alignItems: "center",
        justifyContent: 'center',
        alignContent: "center",
        flex: 1
    },
    ImageCircle: {
        width: 180,
        height: 180,
        marginTop: 30,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: Colors.APP_GREEN,
        borderRadius: 90,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 170,
        height: 170,
        borderRadius:85,
        overflow: 'hidden',
        // tintColor: Colors.APP_GREEN
    },
    imagenull: {
        width: 70,
        height: 70,
        overflow: 'hidden',
        tintColor: Colors.APP_GREEN
    },
    imagText: {
        color: Colors.WHITE,
        fontSize: widthToDp('4%'),
        fontFamily:fonts.medium
      
    },
    btnContainer: {
        width: getDeviceWidth(),
        alignItems: "center",
        marginBottom: 10
    },
    touchableOpacity:{
        backgroundColor:Colors.APP_GREEN,
        marginTop:10,
        height:35,
        padding:8,
        alignItems:'center',
        justifyContent:'center'}
});
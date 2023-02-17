import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Colors from '../../../../../utils/colors'
import { SIGNUP_11, CONTINUE, EXPLORE_MYSELF } from '../../../../../constants'
import { widthToDp, getDeviceWidth } from '../../../../../utils';
import YellowButton from '../../../../../components/button';
import UnderlineText from '../../../../../components/underlineText';
import Icons from '../../../../../assets/icons'
import { AuthActionCreator } from '../../../../../redux/actionCreators/auth'
import { connect } from 'react-redux'
import fonts from '../../../../../assets/fonts';
import Config from "react-native-config";
import colors from '../../../../../utils/colors';


const mapStateToProps = (state) => ({
    loading: state.IsFirstTimeCheckReducer.loading,
    request: state.IsFirstTimeCheckReducer.request,
    response: state.IsFirstTimeCheckReducer.response,

    loginLoading: state.IsLoggedInReducer.loading,
    loginRequest: state.IsLoggedInReducer.request,
    loginResponse: state.IsLoggedInReducer.response,
})

const mapDispatchToProps = dispatch => ({
    isFirstTime: () => dispatch(AuthActionCreator.isFirstTime(false)),
    isLoggedIn: () => dispatch(AuthActionCreator.isLoggedIn(true))
})

const SignUpStep11 = (props) => (
    <View style={styles.container}>
        <View style={styles.textContainer} >

            {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd'))
                ?
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Text style={[styles.greenText,{fontSize:25,color:colors.BLACK}]} >{SIGNUP_11.lbl_1}</Text>
                    <Text style={[styles.greenText,{fontSize:25,color:colors.BLACK}]} >{SIGNUP_11.lbl_2}</Text>
                    <Text style={[styles.greenText,{fontSize:25,color:colors.BLACK}]} >{SIGNUP_11.lbl_3}</Text>
                    <Image source={require('../../../../../assets/images/ccs_reg_image3_1.png')} resizeMode='cover' style={[styles.image, { width: getDeviceWidth(), height: getDeviceWidth()+55 }]} />

                </View>
                :
                <Image source={Icons['SMILE']} resizeMode='contain' style={[styles.image, { tintColor: colors.YELLOW }]} />
            }
            {(!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) &&
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Text style={styles.greenText} >{SIGNUP_11.lbl_1}</Text>
                    <Text style={styles.greenText} >{SIGNUP_11.lbl_2}</Text>
                    <Text style={styles.greenText} >{SIGNUP_11.lbl_3}</Text>
                </View>}

        </View>

        <View style={styles.btnContainer} >
            <YellowButton title={CONTINUE} navigate={() => { props.navigation.navigate('SignUp2'); props.isFirstTime(); props.isLoggedIn(); }} />
        </View>
    </View>
);

export default connect(mapStateToProps, mapDispatchToProps)(SignUpStep11);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        paddingVertical: 30,
        backgroundColor: Colors.BG_LIGHT_BLUE
    },
    textContainer: {
        width: getDeviceWidth(),
        alignItems: "center",
        justifyContent: 'center',
        alignContent: "center",
        flex: 1
    },
    btnContainer: {
        width: getDeviceWidth(),
        alignItems: "center"
    },
    image: {
        width: widthToDp('16%'),
        height: widthToDp('16%'),

        marginBottom: 15
    },
    greenText: {
        color: Colors.APP_GREEN,
        fontSize: widthToDp('10%'),
        fontFamily: fonts.medium
    }

});
import React, {useState} from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native'
import  Colors  from '../../utils/colors'
import {  widthToDp } from '../../utils';
import fonts from '../../assets/fonts';
import Config from "react-native-config";
import colors from '../../utils/colors';


const YellowButton = (props) => {



    const checkTrigger = () => {
        props.disabled ? Alert.alert('disabled')  :null
    }

    return (
        <TouchableOpacity 
        style={
            props.disabled ?

            typeof(props.style) != 'undefined' ? 
            [styles.btnContainerDisabled,props.style] : 
            styles.btnContainerDisabled

            :

            typeof(props.style) != 'undefined' ? 
            [styles.btnContainer,props.style] : 
            styles.btnContainer
        } 
        onPress={(props.navigate)} 
        disabled={props.disabled}>
            <Text style={
                props.disabled ?

                typeof(props.textStyle) != 'undefined' ? 
                [styles.btnTextDisabled,props.textStyle] : 
                styles.btnTextDisabled

                :

                typeof(props.textStyle) != 'undefined' ? 
                [styles.btnText,props.textStyle] : 
                styles.btnText}
            
            >{props.title}</Text>

        </TouchableOpacity>
    )
}

export default YellowButton

const styles = StyleSheet.create({
    btnContainer: {
        backgroundColor: Colors.YELLOW,
        borderRadius: Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd') ? widthToDp('45%') : 3,
        alignItems:'center',
        justifyContent:'center',
        width: widthToDp('90%'),
        height:Number(Config.buttonHeight)
    },
    btnContainerDisabled: {
        backgroundColor: Colors.White,
        borderRadius: Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd') ? widthToDp('45%') : 3,
        alignItems:'center',
        justifyContent:'center',
        width: widthToDp('90%'),
        height:Number(Config.buttonHeight),
        borderWidth:2,
        borderColor:colors.APP_GREEN
    },
    btnText: {
        fontSize: 18,
        margin: 5,
        fontWeight:'400',
        lineHeight:22,
        color: Colors.BUTTON_TEXT_COLOUR,
        alignSelf: "center",
        fontFamily:fonts.buttonTextFont
    },
    btnTextDisabled: {
        fontSize: 18,
        margin: 5,
        fontWeight:'400',
        lineHeight:22,
        color: Colors.APP_GREEN,
        alignSelf: "center",
        fontFamily:fonts.buttonTextFont
    }
})



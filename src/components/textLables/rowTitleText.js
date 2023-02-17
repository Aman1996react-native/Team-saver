import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import Config from "react-native-config";
import fonts from "../../assets/fonts";

const RowTitleText = (props) => {
    return(
        <Text numberOfLines={3} style={[props.style,{fontSize:Number(fonts.rowTitleFontSize),fontFamily:fonts.bold}]}>{props.text}</Text>
    )
}
export default RowTitleText;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
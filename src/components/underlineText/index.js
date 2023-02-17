import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import  Colors  from '../../utils/colors'
import { widthToDp } from '../../utils';
import fonts from '../../assets/fonts';

const UnderlineText = (props) => {
    return (
        <TouchableOpacity style={{alignSelf:'center'}} onPress={props.navigate} >
        <Text style={styles.text}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default UnderlineText

const styles = StyleSheet.create({
    text: {
        color: Colors.BLACK,
        fontSize: 16,
        // textDecorationLine: 'underline',
        marginTop: 15,
        fontFamily:fonts.medium,
        marginBottom:10
    }

})



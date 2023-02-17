import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import fonts from "../../assets/fonts";
import { getDeviceWidth } from "../../utils";
import colors from "../../utils/colors";

class NoDataView extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.props.label}</Text>
            </View>
        );
    }
}
export default NoDataView;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf:'center',
        backgroundColor:colors.White,
        width:getDeviceWidth() - 20,
        margin:10,
        height:100,
        shadowColor:colors.BLACK,
        shadowOffset:{width:2,height:2},
        shadowRadius:10,
        shadowOpacity:0.5,
        elevation:5
    },
    text:{
        fontFamily:fonts.bold,
        fontSize:18,

    }
});
import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { getDeviceWidth } from "../../utils";
import Icons from "../../assets/icons";
import ImageComponent from "../imageComponent/imageComponent";
import colors from "../../utils/colors";
import fonts from "../../assets/fonts";

class ReceiptsSummaryRow extends Component {
    render() {
        const item = this.props.item
        return (
            <TouchableOpacity style={styles.container}
            onPress={() => {
                this.props.onReceiptTapped(item)
            }}>
                <View style={styles.holder}>
                    <Image 
                    resizeMode='center'
                    style={styles.image}
                    source={Icons[item.image]}
                    />
                </View>
                    
                <View>
                    <Text style={styles.text}>{item.dateAndTime}</Text>
                    <Text style={styles.textNormal}>Total Paid: ${item.totalPaid}</Text>
                    <Text style={styles.textNormal}>{item.totalPaid}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
export default ReceiptsSummaryRow;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection:'row',
        width:getDeviceWidth() - 30,
        margin:15,
        backgroundColor:colors.White,
        height:80,
        padding:10,
        borderWidth:0.5,
        borderColor:colors.APP_GREEN,
        marginBottom:5
    },
    image:{
        width:60,
        height:50
    },
    text:{
        fontFamily:fonts.bold,
        fontSize:13,
        color:colors.APP_GREEN
    },
    textNormal:{
        fontFamily:fonts.regular,
        fontSize:12,
    },
    holder:{
        justifyContent:'center',
        alignItems:'center',
        marginRight:10
    }
});
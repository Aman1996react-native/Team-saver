import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import fonts from "../../assets/fonts";
import { getDeviceWidth } from "../../utils";
import colors from "../../utils/colors";
import ImageComponent from "../imageComponent/imageComponent";

class RewardsRow extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View>
                    <ImageComponent
                    resizeMode={'contain'}
                    style={{width:50,height:50,marginLeft:5}}
                    imageUrl={this.props.item.Image}
                    />
                </View>
                <View>
                    <Text numberOfLines={10} style={styles.name}>{this.props.item.MerchantName}</Text>
                    
                </View>
                <TouchableOpacity style={styles.redeemButton}
                onPress={() => {
                    this.props.onRedeemTapped(this.props.item)
                }}>
                    <Text style={styles.redeemButtonText}>Redeem</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
export default RewardsRow;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height:90,
        backgroundColor:colors.WHITE,
        width:getDeviceWidth() - 50,
        flexDirection:'row',
        marginBottom:10,
        justifyContent:'space-between'
    },
    name:{
        fontFamily:fonts.bold,
        color:colors.APP_GREEN,
        fontSize:14,
        width:180,
        marginLeft:5,
        marginRight:2,
        marginTop:2,
        marginBottom:2,
    },
    redeemButton:{
        backgroundColor:colors.APP_GREEN,
        justifyContent:'center',
        alignItems:'center',
        padding:5,
        marginRight:7,
        
    },
    redeemButtonText:{
        fontFamily:fonts.bold,
        color:colors.White,
        fontSize:12,
    },

});
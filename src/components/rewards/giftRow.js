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
import Config from "react-native-config";


class GiftRow extends Component {
    render() {
        return (
            <TouchableOpacity style={styles.container}
            onPress={() => {
                this.props.onCategoryTapped(this.props.item,this.props.item.index)
            }}>
                <ImageComponent
                resizeMode={'contain'}
                style={styles.image}
                imageUrl={this.props.item.Image}
                />
                
                <Text style={styles.nameText}>{this.props.item.Name}</Text>
            </TouchableOpacity>
        );
    }
}
export default GiftRow;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'transparent' :colors.White,
        marginTop:30,
        marginBottom:30,
        width:(getDeviceWidth() - 40) / 2,
        // height:(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 50 : 120,
        borderWidth: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 0 : 0.5,
        borderColor:colors.APP_GREEN

    },
    image:{
        height:70,
        width:70
    },
    nameText:{
        fontFamily: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? fonts.buttonTextFont :fonts.bold,
        marginTop:10,
        textAlign:'center',
        fontSize:16
        
    }
});
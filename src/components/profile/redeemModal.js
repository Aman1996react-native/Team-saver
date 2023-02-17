import React, { Component } from "react";
import { 
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet
} from "react-native";
import Modal from 'react-native-modal';
import fonts from "../../assets/fonts";
import colors from "../../utils/colors";
import Clipboard from '@react-native-community/clipboard';
import { getDeviceWidth } from "../../utils";
import ImageComponent from "../imageComponent/imageComponent";



class RedeemModal extends Component {
    render() {
        return (
            <Modal
            isVisible={this.props.isVisible}
            style={{justifyContent:'center',alignItems:'center'}}
            onShow={() => {
                
            }}
            >
                {this.props.response != null &&
                <View style={{justifyContent:'center',alignItems:'center',padding:20,backgroundColor:colors.White,width:getDeviceWidth() - 30}}>
                    <ImageComponent
                    resizeMode={'contain'}
                    style={{width:150,height:150}}
                    imageUrl={this.props.response.Image}
                    />
                    
                    {this.props.response.MerchantName.includes('Uber') &&
                        <View>
                            <Text style={[styles.valText,{textAlign:'center',marginBottom:5,fontSize:16}]}>To redeem this gift card:</Text>
                            <Text style={styles.valText}>1. Go to the Payment section in the Uber app</Text>
                            <Text style={styles.valText}>2. Tap Add Payment Method and select Gift Card</Text>
                            <Text style={styles.valText}>3. Enter Gift Code</Text>
                            <Text style={styles.valText}>Gift Code: {this.props.response.Response}</Text>
                        </View>
                    
                    }
                    
                    {!this.props.response.MerchantName.includes('Uber') &&
                    <Text style={styles.text}>Code:</Text>}

                    {!this.props.response.MerchantName.includes('Uber') &&
                    <Text style={styles.text}>{this.props.response.Response}</Text>}
                    <TouchableOpacity style={styles.copyButton}
                    onPress={() => {
                        Clipboard.setString(this.props.response.Response)
                        this.props.onCopyCodeTapped()
                    }}>
                        <Text style={styles.text}>Copy Code</Text>
                    </TouchableOpacity>
                </View>}
            </Modal>
        );
    }
}
export default RedeemModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text:{
        fontFamily:fonts.bold,
        fontSize:14,
        textAlign:'center',
        marginBottom:10,
        marginTop:10
    },
    copyButton:{
        justifyContent:'center',
        alignItems:'center',
        padding:5,
        borderWidth:1,
        borderColor:colors.APP_GREEN,
        margin:10,
        backgroundColor:colors.YELLOW
    },
    valText:{
        fontFamily:fonts.bold,
        fontSize:14,
        marginBottom:5,
    }
});
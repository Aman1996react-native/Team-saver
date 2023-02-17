import React, { Component } from "react";
import { 
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet
} from "react-native";
import Modal from 'react-native-modal';
import fonts from "../assets/fonts";
import colors from "../utils/colors";


class TermsAndConditionsModal extends Component {
    render() {
        return (
            <Modal 
            isVisible={this.props.isVisible}
            style={{ justifyContent: 'center', alignItems: 'center' }}
            backdropOpacity={0.5}
            backdropColor={'#000000'}
            onBackdropPress={() => { this.props.onBackdropPressed() }}>
                <View style={{justifyContent:'flex-start',paddingLeft:10,paddingRight:10,paddingBottom:10,backgroundColor:colors.White,borderWidth:1,borderRadius:5,borderColor:colors.APP_GREEN}}>
                    <TouchableOpacity
                    onPress={() => { this.props.onBackdropPressed() }}>
                        <Image style={styles.closeBtn} source={require('../assets/images/clear.png')}/>
                    </TouchableOpacity>
                    <Text style={[styles.terms,{fontSize:18,color:colors.APP_GREEN,marginBottom:10,textAlign:'center',alignSelf:'center'}]}>Terms</Text>
                    <Text style={styles.terms}>{this.props.item.Terms}</Text>
                </View>
            
            </Modal>
        );
    }
}
export default TermsAndConditionsModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    terms:{
        fontFamily:fonts.bold,
        fontSize:14
    },
    closeBtn:{
        height:35,
        width:32,
        alignSelf:'flex-end',
        marginRight:-11,
        marginTop:-6,
        tintColor:colors.APP_GREEN
    }
});
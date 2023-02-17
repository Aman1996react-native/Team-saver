import React, { Component } from "react";
import { 
    View,
    Text,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import Modal from 'react-native-modal';
import fonts from "../../assets/fonts";
import colors from "../../utils/colors";


class ActivityIndicatorModal extends Component {
    render() {
        return (
            <Modal backdropOpacity={0.3} isVisible={this.props.isVisible} style={styles.container}>
                <View style={styles.view}>
                    <ActivityIndicator
                    animating={true}
                    color={colors.WHITE}
                    size='large'
                    />
                        {/* <Text style={styles.text}>Loading...</Text> */}
                </View>
                
            </Modal>
        );
    }
}
export default ActivityIndicatorModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        opacity:1,
    },
    view:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'transparent',//colors.LightGray,
        // width:'70%',
        padding:20,
        height:100,
        borderRadius:5
    },
    text:{
        fontFamily:fonts.bold,
        color:colors.White,
        fontSize:16,
        marginTop:10
    }
});
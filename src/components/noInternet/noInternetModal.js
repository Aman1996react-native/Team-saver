import React, { Component } from "react";
import { 
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import Modal from 'react-native-modal';
import fonts from "../../assets/fonts";
import { getDeviceHeight, getDeviceWidth } from "../../utils";
import colors from "../../utils/colors";
import YellowButton from "../button";
import NetInfo from "@react-native-community/netinfo";



class NoInternetModal extends Component {

    constructor(props){
        super(props)
        this.state={
            status:'Not Connected'
        }
    }

    componentDidMount(){
    }
    onPressed = () => {
        NetInfo.fetch().then(state => {
            if(state.isConnected){
                this.setState({status:'Connected'})
            }else{
                this.setState({status:'Not Connected'})
            }
            
          });
    }

    render() {
        if(!this.props.isVisible){
            return null
        }
        return (
            <Modal 
            isVisible={this.props.isVisible}
            style={styles.modalStyle}
            backdropOpacity={0.5}
            backdropColor={'#000000'}
            onBackdropPress={() => {  }}>
                <View style={styles.textHolder}>
                    <Text style={styles.labelText}>No Internet</Text>
                    <Text style={styles.text}>Please check your internet connection.</Text>
                    <Text style={styles.text}>Status: {this.state.status}</Text>
                    <YellowButton
                    title='Check Status'
                    navigate={() => {this.onPressed()  }}
                    />
                </View>
            </Modal>
        );
    }
}
export default NoInternetModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalStyle:{
        justifyContent:'center',
        alignItems:'center',
    },
    textHolder:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.White,
        margin:10,
        width:getDeviceWidth() - 20,
        height:getDeviceHeight() - 20,
    },
    labelText:{
        fontFamily:fonts.heavy,
        fontSize:20,
        margin:10,
        color:colors.APP_GREEN
    },
    text:{
        fontFamily:fonts.bold,
        fontSize:16,
        margin:10,
        marginBottom:20,
        color:colors.BLACK
    }
});
import React, { Component } from "react";
import { 
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import {AuthActionCreator} from '../../../../../redux/actionCreators/auth'
import Config from "react-native-config";



class SignUpStep8 extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>SignUpStep8</Text>
                <TouchableOpacity style={{backgroundColor:'red',width:120,marginTop:20,padding:20}}
                onPress={() => {
                    this.props.navigation.navigate('SignUp9')
                }}
                >
                    <Text>Continue</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:'red',width:120,marginTop:20,padding:20}}
                onPress={() => {
                    this.props.navigation.navigate('SignUp11')
                }}
                >
                    <Text>Skip</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
export default SignUpStep8;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
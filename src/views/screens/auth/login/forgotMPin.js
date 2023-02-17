import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import SignUp6 from "../registration/signUp6";

class ForgotMPinPage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <SignUp6
                isFromLogin={this.props.route.params.isFromLogin}
                />
            </View>
        );
    }
}
export default ForgotMPinPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
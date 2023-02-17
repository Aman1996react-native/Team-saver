import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import SignUp2 from "../registration/signUp2";

class NameEmailPage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <SignUp2
                isFromLogin={true}
                />
            </View>
        );
    }
}
export default NameEmailPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
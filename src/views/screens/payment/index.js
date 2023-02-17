import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import ComigSoonPage from "../gift/comingSoonPage";

class Payment extends Component {
    render() {
        return (
            <View style={styles.container}>
                <ComigSoonPage></ComigSoonPage>
            </View>
        );
    }
}
export default Payment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class DashboardOfferTileLandingPage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>DashboardOfferTileLandingPage</Text>
            </View>
        );
    }
}
export default DashboardOfferTileLandingPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class Wizard6 extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Wizard6</Text>
            </View>
        );
    }
}
export default Wizard6;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
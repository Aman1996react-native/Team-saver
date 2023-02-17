import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class Wizard5 extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Wizard5</Text>
            </View>
        );
    }
}
export default Wizard5;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class Wizard3 extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Wizard3</Text>
            </View>
        );
    }
}
export default Wizard3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
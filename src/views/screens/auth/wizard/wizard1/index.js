import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class Wizard1 extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Wizard1</Text>
            </View>
        );
    }
}
export default Wizard1;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
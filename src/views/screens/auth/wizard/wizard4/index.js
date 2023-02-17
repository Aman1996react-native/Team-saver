import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class Wizard4 extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Wizard4</Text>
            </View>
        );
    }
}
export default Wizard4;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
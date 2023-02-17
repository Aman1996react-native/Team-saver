import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

class Wizard2 extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Wizard2</Text>
            </View>
        );
    }
}
export default Wizard2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
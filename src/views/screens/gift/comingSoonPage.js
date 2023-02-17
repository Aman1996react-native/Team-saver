import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import fonts from "../../../assets/fonts";
import colors from "../../../utils/colors";

class ComigSoonPage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
        );
    }
}
export default ComigSoonPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    comingSoonText:{
        fontFamily:fonts.bold,
        fontSize:25,
        textAlign:'center',
        color:colors.APP_GREEN
    }
});
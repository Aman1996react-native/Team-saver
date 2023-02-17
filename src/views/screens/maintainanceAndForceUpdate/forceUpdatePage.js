import React, { Component } from "react";
import { 
    View,
    Text,
    Platform,
    StyleSheet,
    Linking
    
} from "react-native";
import fonts from "../../../assets/fonts";
import YellowButton from "../../../components/button";
import colors from "../../../utils/colors";
import Config from "react-native-config";

class ForceUpdatePage extends Component {
    render() {
        const store = Platform.OS == 'ios' ? 'AppStore' : 'PlayStore'
        return (
            <View style={styles.container}>
                <Text style={styles.text}>New Version Available</Text>
                <Text style={styles.desc}>A new version of the app is now available. Please update Childcare Saver to ensure you have the latest features.</Text>
                <YellowButton
                title='Update'
                navigate={() => {
                    const urlToOpen = Platform.OS == 'ios' ?
                    Config.storelinkiOS
                    :
                    Config.storeLinkAndroid
                    Linking.openURL(urlToOpen)

                }}/>
            </View>
        );
    }
}
export default ForceUpdatePage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text:{
        fontFamily:fonts.buttonTextFont,
        color:colors.APP_GREEN,
        fontSize:18,
        marginBottom:20
    },
    desc:{
        fontFamily:fonts.regular,
        fontSize:13,
        margin:10,
        marginBottom:20,
        textAlign:'center',
        marginBottom:30
    }
});
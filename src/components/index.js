import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview';
import { heightToDp, widthToDp } from '../../utils';
import { ARIAL_FONT } from '../../styles/Typograpghy'
import Colors from '../utils/colors'

export default class WView extends Component {
    constructor(props) {
        super(props);
        const { route } = this.props;
        const { itemid } = route.params

        if (itemid === 100) {
            this.state = { visible: true, url:"https://azurarunway.com/",itemID:itemid };
        } else if (itemid === 101) {
            this.state = { visible: true, url:"https://www.jbhifi.com.au",itemID:itemid };
        }
    }

    showSpinner() {
        console.log('Show Spinner');
        this.setState({...this.state, visible: true });
    }

    hideSpinner() {
        console.log('Hide Spinner');
        this.setState({ ...this.state,visible: false });
    }

    render() {
        return (
            <View style={this.state.visible === true ? styles.stylOld : styles.styleNew}>
                {this.state.visible ? (
                    <ActivityIndicator
                        color={YELLOW}
                        size="large"
                        style={styles.ActivityIndicatorStyle}
                    />
                ) : null}
                <WebView
                    source={{ uri: this.state.url }}
                    //Enable Javascript support
                    javaScriptEnabled={true}
                    //For the Cache
                    domStorageEnabled={true}
                    //View to show while loading the webpage
                    //Want to show the view or not
                    //startInLoadingState={true}
                    onLoadStart={() => this.showSpinner()}
                    onLoad={() => this.hideSpinner()}
                // style={{ marginTop: 20 }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }, appButtonContainer: {
        backgroundColor: Colors.APP_GREEN,
        borderRadius: 3,
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: '90%',
        // fontFamily: ARIAL_FONT.regular
    },
    appButtonText: {
        fontSize: widthToDp('4%'),
        margin: 5,
        color: Colors.BLACK,
        alignSelf: "center",
        // fontFamily: ARIAL_FONT.bold
    },
    stylOld: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    styleNew: {
        flex: 1,
    },
    WebViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: 40,
    },
    ActivityIndicatorStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
})
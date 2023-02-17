import React, { useState, Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TextInput,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Pressable,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import Colors from '../../utils/colors'

import { WebView } from 'react-native-webview';
import { Overlay } from 'react-native-elements';

export default class CommonWebView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            openOverlay: false,
            nav_url: "",
            SOS_Email: "",
            openWebView:""
        }


    }

    componentDidMount() {   
        console.log("data", typeof this.state.openWebView)
        this.setState({ openOverlay: true })

    }
    handleNavigationStateChanged = (navState) => {
        // this.props.hitSOSApi()
        const { url, title } = navState;
        console.log("onclickdat--", navState);
        this.setState({ nav_url: navState.url }, () => {
            // console.log(this.state.nav_url.indexOf("login_hint"))
            const temp = this.state.nav_url.indexOf("username")
            const login_hint = this.state.nav_url.slice(temp, this.state.nav_url.length)
            const mydata = login_hint.split("=")[1]
            const finaldata = mydata?.replace('%40', "@")
            const finaldata2 = finaldata?.replace('&mkt', "")
            if (finaldata2 != undefined) {
                this.setState({ SOS_Email: finaldata2 })
                console.log("finaldata===", finaldata2)
            }
           
            if (navState?.url == this.props.URLdata.ResponseURL && this.state.SOS_Email != "") {
                this.props.hitSOSApi(this.state.SOS_Email)
                this.setState({openWebView : this.props.URLdata.ResponseURL})
            }
        })
    };

    onMessage(data) {
        console.log("onMessage==-=", data.nativeEvent.data);
    }

    openSosView = (data) => {
        setTimeout(() => {
            this.setState({ openOverlay: true })  
        }, 1000);
     
    }

    //   handleMessageFromBuilder=()=>{

    //   }

    // https://reward360.ts.invia.com.au/api/Partners/ActiveDirectory
    // https://reward360.optus.invia.com.au/api/Partners/ActiveDirectory
    renderHtml = () => {
        return (
            this.state.StartLoader ? <View style={styles.Container}>
                <ActivityIndicator size={"large"} color={"red"}></ActivityIndicator>
            </View> :
                <WebView
                    source={{ uri: this.state.openWebView == "" || this.state.openWebView == null ? this.props.URLdata.RequestURL :  this.state.openWebView }}
                    //Enable Javascript support
                    // javaScriptEnabled={true}
                    // ignoreSslError={true}
                    //For the Cache
                    // domStorageEnabled={false}
                    mixedContentMode="compatibility"
                    //View to show while loading the webpage
                    //Want to show the view or not
                    startInLoadingState={true}
                    // onLoadStart={() => this.setState({StartLoader : true})}
                    // onLoadEnd={()=> this.setState({StartLoader : false})}
                    // onLoad={() => alert("load")}
                    // ref={r => (this.webref = r)}
                    requestFocus={(data) => { console.log("requestFocus--", data) }}
                    scalesPageToFit={false}
                    onNavigationStateChange={(navState) => { this.handleNavigationStateChanged(navState) }}
                    onMessage={this.handleMessageFromBuilder}
                    // on={(event)=>{console.log("onMessage--",event)}}
                    // onMessage={() => { this.onMessage() }}
                    incognito={true}
                    cacheEnabled={false}    
                    cookiesEnabled={false}
                    useWebkit={true}
                    style={styles.WebViewStyle}
                />
        )
    }
    render() {

        return (
            <>
            <Overlay isVisible={this.state.openOverlay}
                onBackdropPress={() => { this.setState({ openOverlay: false }) }}
                overlayStyle={styles.OverlayConatiner}>
                <View style={styles.hearderView}>
                    <View style={styles.HeaderViewdata}>
                        <View style={styles.EmptyView}></View>
                        <View style={styles.SsoLoginView}>
                            <Text style={{ color: "white" }}>SSO Login</Text>
                        </View>
                        <TouchableOpacity style={styles.cancelTouchable}
                            onPress={() => { this.setState({ openOverlay: false }) }}>
                            <Image style={styles.ImageStyle} source={require("../../assets/images/crossIcon.png")}></Image>
                        </TouchableOpacity>
                    </View>
                    {/* <Text>{this.props.URLdata.ResponseURL}</Text> */}
                    {/* {this.props.URLdata.ResponseURL == ('' || undefined || null) ? Alert.alert('I AM BLANK') : Alert.alert("I AM NOT BLANK")} */}
                    {this.renderHtml()}
                   
                </View>
         </Overlay> 
            </>
        )
    }
}
const styles = StyleSheet.create({
    Container: {
        flex: 1,
        marginTop: 50, alignItems: 'center'
    },
    WebViewStyle: {
        marginTop: 20,
        alignSelf: 'center',
        width: '100%',
        height: 200
    },
    OverlayConatiner: {
        height: "90%",
        width: "90%",
        borderRadius: 20,
        backgroundColor: "transparent",
        shadowColor: "transparent",
        shadowOpacity: 0,
        elevation: 0,
        position: "absolute"
    },
    hearderView: {
        height: "100%",
        width: "100%",
        backgroundColor: "white",
        borderRadius: 20
    },
    HeaderViewdata: {
        height: "8%",
        width: "100%",
        backgroundColor: Colors.G8Red,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: "center",
        justifyContent: 'center',
        flexDirection: "row"
    },
    EmptyView: {
        width: "20%",
        height: "100%"
    },
    SsoLoginView: {
        width: "60%",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    },
    cancelTouchable: {
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    ImageStyle: {
        height: 30,
        width: 30,
        resizeMode: "contain"
    },
})
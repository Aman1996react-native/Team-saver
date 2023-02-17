import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview';
import { heightToDp, widthToDp } from '../../utils';
import Colors from '../../utils/colors'
import {GetHtmlScript} from './htmlScript.js'

export default class WView extends Component {
    constructor(props) {
        super(props);
        this.state = { visible: true, url:this.props.targetUrl };
      
    }

    showSpinner() {
        console.log('Show Spinner');
        this.setState({...this.state, visible: true });
    }

    hideSpinner() {
        console.log('Hide Spinner');
        this.setState({ ...this.state,visible: false });
    }

    renderWebView = () => {
        const props = this.props
        console.warn('WOOLWORTH TO WEBVIEW: '+JSON.stringify(props))
        if(this.state.url.includes('woolworths')){
            if(typeof(props.ClientID) != 'undefined'){
                if(typeof(props.MemberclientTokenId) != 'undefined' && typeof(props.UniqueID) != 'undefined'){
                    if(props.ClientID != null && props.MemberclientTokenId != null && props.UniqueID != null){
                        return(
                            <WebView
                            cacheEnabled={false}
                                originWhitelist={['*']}
                                source={{html:
                                `<html>
                                    <head>
                                    <meta charset="ISO-8859-1">
                                    <title>Test</title>
                                    
                                    <script type="text/javascript">
                                    window.onload = function () {
                                        document.getElementById("clickMe").addEventListener("click", () => {
                                    
                                        });
                                    
                                        window.gfs = window.gfs || {};
                                        window.gfs.post = window.gfs.post || {};
                                        window.console = window.console || {};
                                    
                                        gfs.post.url = 'https://giftcards.woolworths.com.au/memberRedirect';
                                        gfs.post.method = 'POST';
                                        gfs.member = (function () {
                                            var today = new Date();
                                            var isDevMode = false;
                                            var formOptions = {
                                                formId: 'form_' + today.getDate() + today.getMonth() + today.getFullYear() + today.getMinutes() + today.getMilliseconds(),
                                                inputId: 'data'
                                            };
                                    
                                            var isTestEnvironment = false;
                                    
                                            var init = function (init_options) {
                                                if (typeof init_options !== "undefined" && typeof init_options.targetDiv !== "undefined" && isDataValid(init_options)) {
                                                    defineURL(init_options);
                                                    createForm(init_options, true);
                                                    bindElementForEvent(init_options.element, init_options.event, init_options.callback, init_options);
                                                } else {
                                                    if (isDevMode && isDataValid(init_options)) {
                                                        console.log("An error occured: the target container has not been specified.");
                                                    }
                                                }
                                            };
                                    
                                            function defineURL(init_options) {
                                                if (isTestEnvironment) {
                                                    gfs.post.url = 'https://uat-giftcards.woolworths.com.au/memberRedirect';
                                                }
                                            }
                                    
                                    
                                            function bindElementForEvent(element, event, callback, init_options) {
                                                var domElement = document.getElementById(element);
                                                if (domElement) {
                                                    if (domElement.addEventListener) {
                                                        domElement.addEventListener(event, function () {
                                                            submitForm(element, event, callback, init_options);
                                                        }, false);
                                                    } else if (domElement.attachEvent) {
                                                        domElement.attachEvent(event, function () {
                                                            submitForm(element, event, callback, init_options);
                                                        });
                                                    }
                                                }
                                                submitForm(element, event, callback, init_options);
                                            }
                                    
                                            function submitForm(element, event, callback, init_options) {
                                                if (callback) {
                                                    createForm(init_options, true);
                                                    eval(callback)(formOptions.formId, formOptions.inputId);
                                                }
                                                var formToSubmit = document.getElementById(formOptions.formId);
                                                formToSubmit.submit();
                                            }
                                    
                                            function createForm(init_options, populateData) {
                                                var form = document.createElement('form');
                                                form.setAttribute('action', gfs.post.url);
                                                form.setAttribute('method', gfs.post.method);
                                                form.setAttribute('id', formOptions.formId);
                                                if (init_options.newWindow) {
                                                    form.setAttribute('target', '_blank');
                                                }
                                                var input = document.createElement('input');
                                                input.setAttribute('type', 'hidden');
                                                input.setAttribute('name', 'data');
                                                if (populateData) {
                                                    input.setAttribute('value', JSON.stringify(init_options.member_info));
                                                }
                                                input.setAttribute('id', formOptions.inputId);
                                    
                                                form.appendChild(input);
                                    
                                                if (document.getElementById(init_options.targetDiv)) {
                                                    var clearingElement = document.getElementById(init_options.targetDiv);
                                                    clearingElement.innerHTML = '';
                                                }
                                    
                                                if (document.getElementById(init_options.targetDiv)) {
                                                    document.getElementById(init_options.targetDiv).appendChild(form);
                                                } else {
                                                    var div = document.createElement('div');
                                                    div.setAttribute('id', init_options.targetDiv);
                                                    div.setAttribute('style', 'display: none');
                                                    div.appendChild(form);
                                                    document.body.appendChild(div);
                                                }
                                            }
                                    
                                            function isDataValid(init_options) {
                                                var isValid = false;
                                                if (init_options && init_options.devMode) {
                                                    isDevMode = true;
                                                }
                                                if (init_options && init_options.staging) {
                                                    isTestEnvironment = true;
                                                }
                                                if (init_options.member_info) {
                                                    if (init_options.member_info.clientId) {
                                                        if (init_options.member_info.memberId) {
                                                            if (init_options.member_info.memberClientTokenId) {
                                                                isValid = true;
                                                            } else {
                                                                if (isDevMode) {
                                                                    console.log("Missing \'memberClientTokenId\' in member_info object");
                                                                }
                                                            }
                                                        } else {
                                                            if (isDevMode) {
                                                                console.log("Missing \'memberId\' in member_info object");
                                                            }
                                                        }
                                                    } else {
                                                        if (isDevMode) {
                                                            console.log("Missing \'clientId\' in member_info object");
                                                        }
                                                    }
                                                } else {
                                                    if (isDevMode) {
                                                        console.log("member_info object not mentioned");
                                                    }
                                                }
                                                return isValid;
                                            }
                                    
                                            return {
                                                init: init,
                                            };
                                        })();
                                        gfs.member.init({
                                            'targetDiv': 'test',
                                            'member_info': {
                                                'memberClientTokenId': '${this.props.MemberclientTokenId}',
                                                'clientId': '${this.props.ClientID}',
                                                'memberId': '${this.props.UniqueID}',
                                            },
                                            'devMode': true,
                                            //'callback' : 'woah', //Optional
                                            'staging': false,
                                            'newWindow': false
                                        })
                                    
                                    }
                                        
                                    </script>
                                    </head>
                                    <body>
                                        <button id="clickMe" >On Click</button>
                                    </body>
                                </html>`
                            } }
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
                        )
                    }
                }
            }
            
        }else{
            return(
                <WebView
                cacheEnabled={false}
                    originWhitelist={['*']}
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
            )
        }
    }

    render() {
        return (
            <View style={this.state.visible === true ? styles.stylOld : styles.styleNew}>
                {this.state.visible ? (
                    <ActivityIndicator
                        color={Colors.APP_GREEN}
                        size="large"
                        style={styles.ActivityIndicatorStyle}
                    />
                ) : null}
                {this.renderWebView()}
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
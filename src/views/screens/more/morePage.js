import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet
} from "react-native";
import { getDeviceWidth } from "../../../utils";
import Icons from "../../../assets/icons";
import colors from "../../../utils/colors";
import fonts from "../../../assets/fonts";
import { connect } from 'react-redux';
import { AuthActionCreator } from "../../../redux/actionCreators/auth";
import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import Config from "react-native-config";
import { CCSActionCreator } from "../../../redux/actionCreators/app/ccs";



let screeArray = [
    { name: 'Shop', icon: 'SHOP', navigation: 'MarketPlace' }, { name: 'Help', icon: 'HELP', navigation: 'Help' },
    { name: 'Payment', icon: 'PAYMENT', navigation: 'Payment' }, { name: 'Receipt', icon: 'RECEIPT', navigation: 'Receipt' },
    { name: 'History', icon: 'HISTORY', navigation: 'History' },
    { name: 'Settings', icon: 'SETTINGS', navigation: 'Settings' }, { name: 'Notification', icon: 'NOTIFICATION', navigation: 'Notification' },
    { name: 'Chat', icon: 'CHAT', navigation: 'Chat' }

]

const screeArrayCCS = [
    { name: 'Help', icon: 'HELP', navigation: 'Help' },
    { name: 'History', icon: 'HISTORY', navigation: 'History' },
    { name: 'Settings', icon: 'SETTINGS', navigation: 'Settings' }, { name: 'Notification', icon: 'NOTIFICATION', navigation: 'Notification' }

]

const mapStateToProps = (state) => ({

    profileLoading: state.GetProfileDetailsReducer.loading,
    profileRequest: state.GetProfileDetailsReducer.request,
    profileResponse: state.GetProfileDetailsReducer.response,

    shouldMoveToHelpLoading: state.ShouldnavigateToHelpReducer.loading,
    shouldMoveToHelpRequest: state.ShouldnavigateToHelpReducer.request,
    shouldMoveToHelpResponse: state.ShouldnavigateToHelpReducer.response,

    shouldMoveToHistoryLoading: state.ShouldnavigateToHistoryReducer.loading,
    shouldMoveToHistoryRequest: state.ShouldnavigateToHistoryReducer.request,
    shouldMoveToHistoryResponse: state.ShouldnavigateToHistoryReducer.response,

    shouldMoveToSettingsLoading: state.ShouldnavigateToSettingsReducer.loading,
    shouldMoveToSettingsRequest: state.ShouldnavigateToSettingsReducer.request,
    shouldMoveToSettingsResponse: state.ShouldnavigateToSettingsReducer.response,

    shouldMoveToPrivacyPolicyLoading: state.ShouldnavigateToPrivacyPolicyReducer.loading,
    shouldMoveToPrivacyPolicyRequest: state.ShouldnavigateToPrivacyPolicyReducer.request,
    shouldMoveToPrivacyPolicyResponse: state.ShouldnavigateToPrivacyPolicyReducer.response,

    shouldMoveToTermsLoading: state.ShouldnavigateToTermsReducer.loading,
    shouldMoveToTermsRequest: state.ShouldnavigateToTermsReducer.request,
    shouldMoveToTermsResponse: state.ShouldnavigateToTermsReducer.response,

})

class MorePage extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.dispatch(CCSActionCreator.shouldNavigateToHelp(null))
        this.props.dispatch(CCSActionCreator.shouldNavigateToHistory(null))
        this.props.dispatch(CCSActionCreator.shouldNavigateToSettings(null))
        this.props.dispatch(CCSActionCreator.shouldNavigateToPrivacyPolicy(null))
        this.props.dispatch(CCSActionCreator.shouldNavigateToTerms(null))
    }

    componentDidUpdate() {
        const res = this.props.shouldMoveToHelpResponse
        const resHistory = this.props.shouldMoveToHistoryResponse
        if (typeof (res) != 'undefined') {
            this.props.dispatch(CCSActionCreator.resetResponse('16'))

            if (res != null) {
                if (res) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToHelp(false))
                    this.props.navigation.navigate('Help')
                }
            }
        }

        if (typeof (resHistory) != 'undefined') {
            this.props.dispatch(CCSActionCreator.resetResponse('20'))

            if (resHistory != null) {
                if (resHistory) {
                    this.props.dispatch(CCSActionCreator.shouldNavigateToHistory(false))
                    this.props.navigation.navigate('History')
                }
            }
        }

        const settingsRes = this.props.shouldMoveToSettingsResponse
        const privacyPolicyRes = this.props.shouldMoveToPrivacyPolicyResponse
        const termsRes = this.props.shouldMoveToTermsResponse

        if(typeof(settingsRes) != 'undefined'){
            this.props.dispatch(CCSActionCreator.resetResponse('21'))
            
            if(settingsRes != null){
                if(settingsRes){
                    this.props.dispatch(CCSActionCreator.shouldNavigateToSettings(false))
                    this.props.navigation.navigate('Settings')
                }
            }
        }

        if(typeof(privacyPolicyRes) != 'undefined'){
            // this.props.dispatch(CCSActionCreator.resetResponse('22'))
            
            if(privacyPolicyRes != null){
                if(privacyPolicyRes){
                    // this.props.dispatch(CCSActionCreator.shouldNavigateToPrivacyPolicy(false))
                    this.props.navigation.navigate('Settings')
                }
            }
        }

        if(typeof(termsRes) != 'undefined'){
            // this.props.dispatch(CCSActionCreator.resetResponse('23'))
            
            if(termsRes != null){
                if(termsRes){
                    // this.props.dispatch(CCSActionCreator.shouldNavigateToTerms(false))
                    this.props.navigation.navigate('Settings')
                }
            }
        }
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.itemView}
                onPress={() => {
                    if (item.name != 'Signout') {
                        if (item.name == 'Settings') {
                            EncryptedStorage.getItem('email', (res, err) => {
                                if (res) {
                                    this.props.navigation.navigate('Settings', { email: res })
                                }
                            })

                        } else {
                            this.props.navigation.navigate(item.navigation)
                        }

                    } else {
                        const { dispatch } = this.props
                        dispatch(AuthActionCreator.isLoggedIn(false))
                        dispatch(AuthActionCreator.isFirstTime(false))
                    }
                }}>
                <Image resizeMode='contain'
                    style={item.name == 'Signout' || item.name == 'Receipt' || item.name == 'Notification' || item.name == 'Chat' ? styles.icons2 : styles.icons} source={Icons[item.icon]} />
                <Text style={styles.text}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item, index) => item.name

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    numColumns={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 1 : 3}
                    data={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? screeArrayCCS : screeArray}
                    renderItem={this._renderItem}
                    style={{ alignSelf:'center' }}
                    contentContainerStyle={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? { alignItems: 'center', justifyContent: 'center',alignSelf:'center',flexGrow:1  } : { alignItems: 'flex-start' }}
                    keyExtractor={this._keyExtractor}
                />
            </View>
        );
    }
}
export default connect(mapStateToProps)(MorePage);


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        // height:'100%'
        // paddingTop: 10,
        
    },
    itemView: {
        width: (getDeviceWidth() - 60) / 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        borderColor: colors.APP_GREEN,
        margin: 10,
        marginBottom: 30,
    },
    icons: {
        width: 42,
        height: 42,
        tintColor: colors.APP_GREEN
    },
    icons2: {
        width: 22,
        height: 22,
        tintColor: colors.APP_GREEN,
        marginBottom: 10,
        marginTop: 8
    },
    text: {
        fontFamily: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? fonts.buttonTextFont : fonts.bold,
        fontSize: 13
    }
});
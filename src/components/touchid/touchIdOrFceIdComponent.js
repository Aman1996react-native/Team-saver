import React, { Component } from 'react';
import { View, Text, Platform, Switch } from 'react-native';

import ReactNativeBiometrics from 'react-native-biometrics'
import fonts from '../../assets/fonts';
import { getDeviceWidth } from '../../utils';
import colors from '../../utils/colors';
import YellowButton from '../button';
import EncryptedStorage from 'react-native-encrypted-storage';
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({

    isTouchIdEnabledLoading: state.IsTouchIdEnabledReducer.loading,
    isTouchIdEnabledRequest: state.IsTouchIdEnabledReducer.request,
    isTouchIdEnabledResponse: state.IsTouchIdEnabledReducer.response,
})


class TouchIdOrFceIdComponent extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
            biometricType: null,
            isBioMetricsEnabled: false,
            shouldShowEnableTouchId: true
        };
    }

    async componentDidMount() {
        // const savedPassword = await EncryptedStorage.getItem(this.props.email.toString())

        // if (typeof (savedPassword) != 'undefined') {
        //     if (savedPassword != null) {
        //       if (savedPassword.length > 1) {
        //           this.setState({isBioMetricsEnabled:true})
        //       }else{
        //         this.setState({isBioMetricsEnabled:false})
        //     }
        //     }else{
        //         this.setState({isBioMetricsEnabled:false})
        //     }
        // }else{
        //     this.setState({isBioMetricsEnabled:false})
        // }


        ReactNativeBiometrics.isSensorAvailable()
            .then((resultObject) => {
                const { available, biometryType } = resultObject

                if (available && biometryType === ReactNativeBiometrics.TouchID) {
                    this.setState({ biometricType: 'TouchID' })
                } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
                    this.setState({ biometricType: 'FaceID' })
                } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
                    this.setState({ biometricType: 'TouchID' })
                } else {
                    this.setState({ biometricType: null })
                }
            })

    }

    renderSwitch = () => {
        return (
            <Switch
                trackColor={{ true: colors.APP_GREEN }}
                value={this.state.isBioMetricsEnabled}
                onValueChange={async (status) => {
                    if (status) {
                        const result = await ReactNativeBiometrics.simplePrompt({ promptMessage: `Confirm ${this.state.biometricType}` })
                        console.warn(JSON.stringify(result))
                        if (typeof (result) != 'undefined') {
                            if (typeof (result.success) != 'undefined') {
                                if (result.success) {
                                    this.setState({ isBioMetricsEnabled: true }, async () => {
                                        this.props.onSwitchTapped(true)
                                    })
                                } else {
                                    this.setState({ isBioMetricsEnabled: false }, async () => {

                                    })
                                }
                            }
                        }
                    } else {
                        this.setState({ isBioMetricsEnabled: status }, async () => {
                            this.props.onSwitchTapped(false)
                        })
                    }

                }}

            />
        )
    }

    render() {

        if (this.state.biometricType != null) {

            if (this.props.isLogin && this.props.shouldPromptTouchId) {
                return (
                    <YellowButton
                        style={{ marginBottom: 10 }}
                        title={`Use ${this.state.biometricType} to Sign In`}
                        navigate={async () => {
                            const result = await ReactNativeBiometrics.simplePrompt({ promptMessage: `Confirm ${this.state.biometricType} to Sign In` })
                            if (typeof (result) != 'undefined') {
                                if (typeof (result.success) != 'undefined') {
                                    if (result.success) {
                                        this.props.onSignInWithTouchIdTapped()
                                    }
                                }
                            }

                        }}
                    />
                )
            }

            if (this.props.shouldShowEnableTouchId) {
                if (this.props.isSettings) {
                    return (
                        <View>
                            {this.renderSwitch()}
                        </View>
                    )
                }
                return (
                    <View style={{ width: getDeviceWidth() - 20, margin: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View>
                            <Text style={{ fontFamily: fonts.buttonTextFont, fontSize: 16, marginRight: 10 }}>Enable {this.state.biometricType}</Text>
                        </View>
                        {this.renderSwitch()}

                    </View>
                )
            }


        }

        return (
            null
        );
    }
}

export default connect(mapStateToProps)(TouchIdOrFceIdComponent);


import React, { Component } from "react";
import {
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    SectionList,
    Image,
    Text,
    StyleSheet
} from "react-native";

import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import fonts from "../../../assets/fonts";
import YellowButton from "../../../components/button";
import CheckBox from '@react-native-community/checkbox';
import colors from "../../../utils/colors";
import { CCSActionCreator } from "../../../redux/actionCreators/app/ccs";
import { AuthActionCreator } from "../../../redux/actionCreators/auth";
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";



const mapStateToProps = (state) => ({

    loading: state.PermanentlyDeleteUserReducer.loading,
    request: state.PermanentlyDeleteUserReducer.request,
    response: state.PermanentlyDeleteUserReducer.response,

    balanceLoading: state.GetPointsBalanceReducer.loading,
    balanceRequest: state.GetPointsBalanceReducer.request,
    balanceResponse: state.GetPointsBalanceReducer.response,

    isPrimaryUserLoading: state.IsPrimaryUserReducer.loading,
    isPrimaryUserRequest: state.IsPrimaryUserReducer.request,
    isPrimaryUserResponse: state.IsPrimaryUserReducer.response,
})

class PermanentlyDeleteAccountConfirmationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isIdonotWishTapped: false,
            isIUnderstandChecked: false
        };
    }

    componentDidUpdate() {
        const apiResponse = this.props.response
        if (typeof (apiResponse) != 'undefined') {
            if (Object.keys(apiResponse).length > 0) {
                this.props.dispatch(CCSActionCreator.resetResponse('13'))
                if (typeof (apiResponse.Status) != 'undefined') {
                    if (apiResponse.Status == 'Success') {
                        this.props.dispatch(AuthActionCreator.isLoggedIn(false))
                        this.props.dispatch(AuthActionCreator.isFirstTime(true))
                    } else {

                    }
                }
            }

        }
    }

    renderWordings = () => {
        const res = this.props.balanceResponse
        if (this.state.isIdonotWishTapped) {
            return null
        }
        if (typeof (res) != 'undefined') {
            if (typeof (res.Balance) != 'undefined') {
                if (Number(res.Balance) > 9) {
                    return (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.text}>You currently have a credit in your Childcare Saver Reward balance.{'\n'} {'\n'} Please checkout your balance before deleting Childcare Saver.</Text>
                            <YellowButton
                                title='Withdraw My Balance'
                                style={{ margin: 15 }}
                                navigate={() => {
                                    this.props.navigation.navigate('Gifts')
                                }}
                            />

                            <YellowButton
                                style={{ margin: 15 }}
                                textStyle={{ fontSize: 16 }}
                                title='I do not wish to withdraw my credit'
                                navigate={() => {
                                    this.setState({ isIdonotWishTapped: true })
                                }}
                            />
                        </View>
                    )
                } else {
                    this.setState({ isIdonotWishTapped: true })
                }
            } else {
                this.setState({ isIdonotWishTapped: true })
            }
        } else {
            this.setState({ isIdonotWishTapped: true })
        }
        return (
            <View>
                {this.renderConfirmation()}
            </View>
        )
    }

    renderConfirmation = () => {
        if (this.state.isIdonotWishTapped) {
            return (
                <View style={{ margin: 10, justifyContent: 'space-between', alignItems: 'center', flex: 1,paddingTop:30 }}>
                    <View>
                        <Text style={styles.text}>Deleting Team Saver will mean you no longer receive cashback on your rewards{'\n'} </Text>
                        {/* {typeof (this.props.isPrimaryUserResponse) != 'undefined' && this.props.isPrimaryUserResponse &&
                            <Text style={styles.text}>Any other members that are linked to your account  will also be deleted.</Text>} */}
                        <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center', marginTop: 15 }}>
                            <CheckBox
                                disabled={false}
                                style={{ width: 20, height: 20, marginRight: 10 }}
                                value={this.state.isIUnderstandChecked}
                                onValueChange={(newValue) => {
                                    this.setState({ isIUnderstandChecked: newValue })
                                }}
                                boxType={'circle'}
                                onCheckColor={colors.APP_GREEN}
                                tintColor={colors.APP_GREEN}
                                onTintColor={colors.APP_GREEN}
                            />
                            <Text style={styles.text2}>I understand I will lose my current balance when I delete Team Saver</Text>
                        </View>
                    </View>


                    <View style={{}}>
                        <YellowButton
                            style={{ margin: 20,marginBottom:5 }}
                            title='Cancel'
                            navigate={() => {
                                this.props.navigation.goBack()
                            }}
                        />
                        <YellowButton
                            disabled={!this.state.isIUnderstandChecked}
                            style={{ margin: 15,marginTop:5 }}
                            title='Delete Team Saver'
                            navigate={() => {
                                if (this.state.isIUnderstandChecked) {
                                    EncryptedStorage.getItem('userId', (res, err) => {
                                        if (res) {
                                            this.props.dispatch(CCSActionCreator.permanentlyDeleteUser(res))
                                        }
                                    })
                                }
                            }}
                        />

                    </View>

                </View>
            )
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicatorModal
                    isVisible={this.props.loading}
                />
                {this.renderWordings()}
                {this.renderConfirmation()}

            </SafeAreaView>
        );
    }
}

export default connect(mapStateToProps)(PermanentlyDeleteAccountConfirmationPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    text: {
        fontFamily: fonts.bold,
        fontSize: 14,
        margin: 10,
        // textAlign:'center'
    },
    text2: {
        fontFamily: fonts.bold,
        fontSize: 14,
        margin: 10,
        // textAlign: 'center'
    }

})


import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    Linking,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Share,
    ScrollView,
    StyleSheet
} from "react-native";
import { getDeviceHeight, getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import { ProfileActionCreator } from "../../../redux/actionCreators/app/profile";
import fonts from "../../../assets/fonts";
// import ImagePicker from 'react-native-image-crop-picker';
import { RegistrationActionCreator } from "../../../redux/actionCreators/registration";
import RewardsRow from "../../../components/profile/rewardsRow";
import BrandsListModal from "../../../components/profile/brandsListModal";
import RedeemModal from "../../../components/profile/redeemModal";
import ImageComponent from "../../../components/imageComponent/imageComponent";
import { CommunityActionCreator } from "../../../redux/actionCreators/app/community";
import Config from "react-native-config";
import YellowButton from "../../../components/button";
import { CCSActionCreator } from "../../../redux/actionCreators/app/ccs";
import { RewardsActionCreator } from "../../../redux/actionCreators/app/rewards";
import ConfirmationModal from "../../../components/ccs/confirmationModal";
import Icons from "../../../assets/icons";
import { DYNAMIC_LINK } from "../../../constants";
import { CheckAccessTokenExpiryTime } from "../../../redux/actionCreators/checkAccessTokenExpiry";

let dataArray = []
let inviateYourFriends = `Invite your friends and family to help you save on your Childcare. Once they register with your code, they will appear in the list below`

const achievementsList = [
    { id: 1, icon: Icons['ACH1'] }, { id: 1, icon: Icons['ACH2'] }, { id: 1, icon: Icons['ACH3'] }, { id: 1, icon: Icons['ACH4'] }, { id: 1, icon: Icons['ACH5'] }
]

const mapStateToProps = (state) => ({

    loading: state.GetProfileDetailsReducer.loading,
    request: state.GetProfileDetailsReducer.request,
    response: state.GetProfileDetailsReducer.response,

    editProfileLoading: state.EditProfileReducer.loading,
    editProfileRequest: state.EditProfileReducer.request,
    editProfileResponse: state.EditProfileReducer.response,

    updateImageLoading: state.UploadImageRegReducer.loading,
    updateImageRequest: state.UploadImageRegReducer.request,
    updateImageResponse: state.UploadImageRegReducer.response,

    getBrandsLoading: state.GetTopBrandsRegReducer.loading,
    getBrandsRequest: state.GetTopBrandsRegReducer.request,
    getBrandsResponse: state.GetTopBrandsRegReducer.response,

    saveBrandsLoading: state.SaveFavouritesRegReducer.loading,
    saveBrandsRequest: state.SaveFavouritesRegReducer.request,
    saveBrandsResponse: state.SaveFavouritesRegReducer.response,

    getFavBrandsLoading: state.GetFavBrandsReducer.loading,
    getFavBrandsRequest: state.GetFavBrandsReducer.request,
    getFavBrandsResponse: state.GetFavBrandsReducer.response,

    getGiftsAndRewardsLoading: state.GetGiftsAndRewardsReducer.loading,
    getGiftsAndRewardsRequest: state.GetGiftsAndRewardsReducer.request,
    getGiftsAndRewardsResponse: state.GetGiftsAndRewardsReducer.response,

    getCommunitiesLoading: state.GetCommunitiesByUserReducer.loading,
    getCommunitiesRequest: state.GetCommunitiesByUserReducer.request,
    getCommunitiesResponse: state.GetCommunitiesByUserReducer.response,

    isPrimaryUserLoading: state.IsPrimaryUserReducer.loading,
    isPrimaryUserRequest: state.IsPrimaryUserReducer.request,
    isPrimaryUserResponse: state.IsPrimaryUserReducer.response,

    balanceLoading: state.GetPointsBalanceReducer.loading,
    balanceRequest: state.GetPointsBalanceReducer.request,
    balanceResponse: state.GetPointsBalanceReducer.response,

    setTargetLoading: state.SetTargetReducer.loading,
    setTargetRequest: state.SetTargetReducer.request,
    setTargetResponse: state.SetTargetReducer.response,

    getSecondaryUsersLoading: state.GetSecondaryUsersReducer.loading,
    getSecondaryUsersRequest: state.GetSecondaryUsersReducer.request,
    getSecondaryUsersResponse: state.GetSecondaryUsersReducer.response,

    removeSecondaryUsersLoading: state.RemoveSecondaryUsersReducer.loading,
    removeSecondaryUsersRequest: state.RemoveSecondaryUsersReducer.request,
    removeSecondaryUsersResponse: state.RemoveSecondaryUsersReducer.response,

    generateReferralCodeLoading: state.GenerateReferralCodeReducer.loading,
    generateReferralCodeRequest: state.GenerateReferralCodeReducer.request,
    generateReferralCodeResponse: state.GenerateReferralCodeReducer.response,

    getReferralCodeLoading: state.GetReferralCodeReducer.loading,
    getReferralCodeRequest: state.GetReferralCodeReducer.request,
    getReferralCodeResponse: state.GetReferralCodeReducer.response,

    verifyEmailLoading: state.EditEmailReducer.loading,
    verifyEmailRequest: state.EditEmailReducer.request,
    verifyEmailResponse: state.EditEmailReducer.response,

    verifyMobileLoading: state.EditMobileReducer.loading,
    verifyMobileRequest: state.EditMobileReducer.request,
    verifyMobileResponse: state.EditMobileReducer.response,

    shouldMoveToProfileLoading: state.ShouldnavigateToProfileReducer.loading,
    shouldMoveToProfileRequest: state.ShouldnavigateToProfileReducer.request,
    shouldMoveToProfileResponse: state.ShouldnavigateToProfileReducer.response,
})


class Profile extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isEditTapped: false,
            name: null,
            middleName: null,
            lastName: null,
            place: null,
            selectedImage: null,
            refresh: false,
            selectedButton: 1,
            isVisible: false,
            showRedeemModal: false,
            redeemItem: null,
            goalName: '',
            targetAmount: '',
            moveUp: false,
            editTargetTapped: false,
            showConfirmationModal: false,
            itemToRemove: null,
            image: null

        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await CheckAccessTokenExpiryTime('ProfilePage')
            this.getProfileData()
            if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
                this.props.dispatch(CCSActionCreator.isPrimaryUser())
                EncryptedStorage.getItem('userId', (res, err) => {
                    if (res) {
                        this.props.dispatch(RewardsActionCreator.getPointsBalance(res))
                        this.props.dispatch(CCSActionCreator.getSecondaryUsers(res))
                        this.props.dispatch(CCSActionCreator.getReferralCode(res))
                        this.props.dispatch(CCSActionCreator.shouldNavigateToProfile(null))
                    }
                })

            }
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    componentDidUpdate(prevProps) {
        const res = this.props.saveBrandsResponse
        if (typeof (res) != 'undefined') {
            if (Object.keys(res).length > 0) {
                this.props.dispatch(RegistrationActionCreator.resetResponse("10"))
                EncryptedStorage.getItem('userId', (res, err) => {
                    if (res) {
                        this.props.dispatch(ProfileActionCreator.getFavBrands(res))
                    }
                })

            }
        }

        const verifyEmail = this.props.verifyEmailResponse
        const verifyMobile = this.props.verifyMobileResponse

        if (typeof (verifyEmail) != 'undefined') {
            if (Object.keys(verifyEmail).length > 0) {
                this.props.dispatch(ProfileActionCreator.resetVerifyEmail())
                if (typeof (verifyEmail.Status) != 'undefined') {
                    if (verifyEmail.Status == 'Success') {
                        EncryptedStorage.getItem('email', (email, err) => {
                            if (email) {
                                this.props.navigation.navigate('VerifyEmail', { email: email, isStep2: false })
                            }
                        })

                    }
                }
            }
        }

        if (typeof (verifyMobile) != 'undefined') {
            if (Object.keys(verifyMobile).length > 0) {
                this.props.dispatch(ProfileActionCreator.resetVerifyMobile())
                if (typeof (verifyMobile.Status) != 'undefined') {
                    if (verifyMobile.Status == 'Success') {
                        if (typeof (this.props.response) != 'undefined') {
                            if (typeof (this.props.response.Mobile) != 'undefined') {
                                if (this.props.response.Mobile != null) {
                                    if (this.props.response.Mobile.length > 8) {
                                        this.props.navigation.navigate('VerifyMobile', { mobile: this.props.response.Mobile, isStep2: false })
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }

        const shouldNavigateToProfile = this.props.shouldMoveToProfileResponse

        if (typeof (shouldNavigateToProfile) != 'undefined') {
            if (shouldNavigateToProfile != null) {
                if (shouldNavigateToProfile) {
                    this.props.dispatch(CCSActionCreator.resetResponse('17'))
                    this.props.dispatch(CCSActionCreator.shouldNavigateToProfile(false))
                    this.setState({ selectedButton: 2 })
                }

            }
        }

    }

    getProfileData = () => {
        EncryptedStorage.getItem('userId', (res, err) => {
            if (res) {
                this.props.dispatch(ProfileActionCreator.getProfileDetails(res))
                this.props.dispatch(ProfileActionCreator.getFavBrands(res))
                this.props.dispatch(ProfileActionCreator.getGiftsAndRewards(res))
                if (!Config.ENV.includes('ccsDev') && !Config.ENV.includes('ccsProd')) {
                    this.props.dispatch(CommunityActionCreator.getCommunitiesByUser(res))
                }

            }
        })
    }

    renderProfileImage = () => {
        const res = this.props.response
        if (typeof (res) != 'undefined') {
            if (typeof (res.Image) != 'undefined') {
                if (res.Image != null) {
                    if (this.state.image == null) {
                        return (
                            <ImageComponent
                                resizeMode={'cover'}
                                style={styles.image}
                                imageUrl={res.Image}
                            />
                        )
                    }

                }
            }
        }

        if (this.state.image != null) {
            return (
                <Image style={styles.image}
                    resizeMode='cover'
                    source={{ uri: `data:${this.state.image.mime};base64,${this.state.image.data}` }} />
            )
        }

        if (typeof (res) != 'undefined') {
            if (typeof (res.nameToDisplay) != 'undefined') {
                return (
                    <View style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center', padding: 5, borderRadius: 40, width: 80, height: 80, borderWidth: 2, borderColor: colors.White }}>
                        <Text style={[styles.name, { fontSize: 16, }]}>{this.props.response.nameToDisplay}</Text>
                    </View>
                )
            }
        }

    }

    renderUpdateImageView = () => {
        if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
            return null
        }

        if (this.state.isEditTapped) {
            return (
                <View style={styles.updateImageHolder}>
                    <TouchableOpacity style={styles.takeSnapButton}
                        onPress={() => {
                            // ImagePicker.openCamera({
                            //     width: 300,
                            //     height: 400,
                            //     includeBase64: true,
                            //     cropping: true
                            // }).then(image => {
                            //     this.setState({ image: image })
                            // });
                        }}>
                        <Text style={styles.takeSnaptext}>Snap</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.takeSnapButton}
                        onPress={() => {
                            // ImagePicker.openPicker({
                            //     includeBase64: true,
                            //     cropping: true
                            // }).then(image => {
                            //     this.setState({ image: image })
                            // });
                        }}>
                        <Text style={styles.takeSnaptext}>Gallery</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    renderName = () => {
        const res = this.props.response
        if (typeof (res) != 'undefined') {
            if (typeof (res.FirstName) != 'undefined') {
                if (typeof (res.MiddleName) != 'undefined' && typeof (res.LastName) != 'undefined') {
                    if (!this.state.isEditTapped) {
                        return (
                            <View style={styles.nameTextFieldHolder}>

                                <Text style={styles.nameText}>{res.FirstName}</Text>
                                <Text> </Text>
                                <Text style={styles.nameText}>{res.MiddleName}</Text>
                                <Text> </Text>
                                <Text style={styles.nameText}>{res.LastName}</Text>
                            </View>
                        )
                    }
                    return (
                        <View style={[styles.nameTextFieldHolder, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                            <View style={styles.nameTextFieldHolder}>

                                <Text style={styles.nameText}>{res.FirstName}</Text>
                                <Text> </Text>
                                <Text style={styles.nameText}>{res.MiddleName}</Text>
                                <Text> </Text>
                                <Text style={styles.nameText}>{res.LastName}</Text>
                            </View>
                            {this.state.isEditTapped && (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                                <View>
                                    <Image
                                        resizeMode='contain'
                                        style={{ width: 100, height: 60 }}
                                        source={require('../../../assets/images/bird_yellow.png')} />

                                    <View style={styles.bottomBorderView} />
                                </View>
                            }
                            <View style={[styles.nameTextFieldHolder2, { flexDirection: 'row', marginBottom: 5, marginTop: 10,paddingLeft:10 }]}>
                                {this.state.isEditTapped &&
                                    <Text style={styles.firstNameTextLabel}>First Name:</Text>}
                                <TextInput
                                    autoFocus={false}
                                    placeholder='First Name'
                                    style={this.state.isEditTapped ? styles.nameTextFieldEnabled : styles.nameTextField}
                                    editable={this.state.isEditTapped}
                                    value={this.state.isEditTapped ? this.state.name == null ? typeof (res.FirstName) != 'undefined' ? res.FirstName : '' : this.state.name : typeof (res.FirstName) != 'undefined' ? res.FirstName : ''}
                                    onChangeText={(text) => {
                                        this.setState({ name: text })
                                    }}
                                />
                            </View>

                            {this.state.isEditTapped &&
                                <View style={styles.bottomBorderView} />
                            }

                            <View style={[styles.nameTextFieldHolder2, { flexDirection: 'row', marginTop: 10, marginBottom: 5,paddingLeft:10 }]}>
                                {this.state.isEditTapped &&
                                    <Text style={styles.firstNameTextLabel}>Last Name:</Text>}
                                <TextInput
                                    autoFocus={false}
                                    placeholder='Last Name'
                                    style={this.state.isEditTapped ? styles.nameTextFieldEnabled : styles.nameTextField}
                                    editable={this.state.isEditTapped}
                                    value={this.state.isEditTapped ? this.state.lastName == null ? typeof (res.LastName) != 'undefined' ? res.LastName : '' : this.state.lastName : typeof (res.LastName) != 'undefined' ? res.LastName : ''}
                                    onChangeText={(text) => {
                                        this.setState({ lastName: text })
                                    }}
                                />
                            </View>
                            {this.state.isEditTapped &&
                                <View style={styles.bottomBorderView} />
                            }
                        </View>


                    )

                }
            }
        }

    }

    renderPlace = () => {

        const res = this.props.response
        if (typeof (res.Place) != 'undefined') {
            if (!this.state.isEditTapped) {
                return (
                    <Text style={[styles.nameText, { fontSize: 16 }]}>{res.Place}</Text>
                )
            }
            return (
                <View style={[styles.nameTextFieldHolder2, { marginTop: 5 }]}>
                    {this.state.isEditTapped &&
                        <Text style={styles.firstNameTextLabel}>Place:</Text>}
                    <TextInput
                        autoFocus={false}
                        placeholder='Place'
                        style={this.state.isEditTapped ? styles.nameTextFieldEnabled : styles.nameTextField}
                        editable={this.state.isEditTapped}
                        value={this.state.isEditTapped ? this.state.place == null ? typeof (res.Place) != 'undefined' ? res.Place : '' : this.state.place : typeof (res.Place) != 'undefined' ? res.Place : ''}
                        onChangeText={(text) => {
                            this.setState({ place: text })
                        }}
                    />
                </View>
            )

        }
    }

    renderMobile = () => {
        const res = this.props.response
        if (!this.state.isEditTapped) {
            if (typeof (res.Mobile) != 'undefined') {
                if (res.Mobile != null) {
                    return (
                        <Text style={styles.nameText}>{res.Mobile}</Text>
                    )

                }
            }
        }

    }

    renderPlan = () => {
        const res = this.props.response
        if (!this.state.isEditTapped) {
            if (typeof (res.PlanName) != 'undefined') {
                if (res.PlanName == null) {
                    return (
                        null
                    )

                }
            }
        }

    }

    renderBottomViewButtons = () => {
        const isPrimary = this.props.isPrimaryUserResponse
        if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
            if (typeof (isPrimary) != 'undefined') {
                if (isPrimary) {
                    return (
                        <View>
                            {this.renderOverViewGitsAndRewardsView()}
                        </View>
                    )
                } else {
                    return (
                        <View>

                        </View>
                    )
                }
            }
        } else {
            return (
                <View>
                    {this.renderOverViewGitsAndRewardsView()}
                </View>
            )
        }
    }

    renderOverViewGitsAndRewardsView = () => {
        return (
            <View style={styles.overViewGiftsRewardsHolder}>
                <View style={styles.topView}>
                    <TouchableOpacity style={
                        this.state.selectedButton == 1 ?
                            Config.ENV.includes('ccsProd') ?
                                [styles.overViewButtonSelectedCCSProd, {}]
                                :
                                styles.overViewButtonSelected :
                            Config.ENV.includes('ccsProd') ?
                                [styles.overViewButtonCCSProd, {}]
                                :
                                styles.overViewButton
                    }
                        onPress={() => {
                            this.setState({ selectedButton: 1 })
                        }}>
                        {/* {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ?
                            <View style={
                                this.state.selectedButton == 1 ?
                                    styles.viewOnTopOfButtonSelectedCCS

                                    :
                                    styles.viewOnTopOfButtonCCS
                            }>
                                <Text style={this.state.selectedButton == 1 ? styles.overViewTextSelected : styles.overViewText}>OVERVIEW</Text>
                            </View>
                            :
                            <Text style={this.state.selectedButton == 1 ? styles.overViewTextSelected : styles.overViewText}>OVERVIEW</Text>

                        } */}
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={this.state.selectedButton == 2 ?
                        Config.ENV.includes('ccsProd') ?
                            styles.overViewButtonSelectedCCSProd
                            :
                            [styles.overViewButtonSelected, { width: '64%'}] :

                        Config.ENV.includes('ccsProd') ?
                            styles.overViewButtonCCSProd
                            :
                            [styles.overViewButton, { width: '64%'}]}
                        onPress={() => {
                            this.setState({ selectedButton: 2 })
                        }}>
                        {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ?
                            <View style={
                                this.state.selectedButton == 2 ?
                                    [, { alignSelf: 'center' , width : '80%'  }]

                                    :
                                    [styles.viewOnTopOfButtonCCS, { alignSelf: 'flex-end' }]
                            }>
                                <Text style={this.state.selectedButton == 2 ? [styles.overViewTextSelected] : styles.overViewText} >MANAGE MEMBERS</Text>
                            </View>
                            :
                            <Text style={this.state.selectedButton == 2 ? styles.overViewTextSelected : styles.overViewText} >GIFTS</Text>
                        }

                    </TouchableOpacity> */}
                    {/* {(!Config.ENV.includes('ccsProd')) &&
                        <TouchableOpacity style={this.state.selectedButton == 3 ? styles.overViewButtonSelected : styles.overViewButton}
                            onPress={() => {
                                this.setState({ selectedButton: 3 })
                            }}>
                            <Text style={this.state.selectedButton == 3 ? styles.overViewTextSelected : styles.overViewText}>REWARDS</Text>
                        </TouchableOpacity>} */}
                </View>
            </View>
        )
    }

    keyy = (item, index) => item.id.toString()

    rend = ({ item, index }) => {
        return (
            <View>
                {this.renderFavourites(item)}
            </View>
        )
    }

    giftsRewardsKey = (item, index) => item.Response

    renderRewardsItem = (item, index) => {
        if (this.state.selectedButton == 3) {
            return (
                <RewardsRow
                    item={item}
                    index={index}
                    onRedeemTapped={this.onRedeemTapped}
                />
            )
        }
        return null
    }

    onRedeemTapped = (item, index) => {
        try {

            if (item.Response.includes('https://') || item.Response.includes('http://')) {
                Linking.canOpenURL(item.Response).then(supported => {
                    if (supported) {
                        Linking.openURL(item.Response).then((isDone, rejected) => {
                        })
                    } else {

                    }

                })
            } else {
                if (item.Response.length > 1) {
                    this.setState({ showRedeemModal: true, redeemItem: item })

                }
            }


        } catch (e) {

        }


    }

    renderGiftsItem = ({ item, index }) => {
        if (this.state.selectedButton == 2) {
            return (
                <RewardsRow
                    item={item}
                    index={index}
                    onRedeemTapped={this.onRedeemTapped}
                />
            )
        }
        return null
    }

    giftsKey = (item, index) => item.Response


    renderRewards = () => {
        const res = this.props.getGiftsAndRewardsResponse
        if (typeof (res.rewards) != 'undefined' && this.state.selectedButton == 3) {
            if (res.rewards.length > 0) {
                return (
                    <View style={{ flex: 1 }}>
                        <ScrollView>
                            {res.rewards.map((item, index) => {
                                return (
                                    <View>
                                        {this.renderRewardsItem(item, index)}
                                    </View>
                                )
                            })}
                        </ScrollView>

                    </View>

                )
            }
        }
        return (
            <View>
                <Text style={[styles.overViewText, { color: colors.BLACK, textAlign: 'center' }]}>No Rewards</Text>
            </View>
        )
    }

    onBack = () => {
        alert('Hello')
    }

    onShare = async (code) => {
        try {
            const result = await Share.share({
                message: `Use this Referral Code while registering to the application. Referral Code: ${code}`,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    }

    renderGeneratedCodeView = () => {
        const res = this.props.getReferralCodeResponse
        if (typeof (res) != 'undefined') {
            if (typeof (res.ReferralCode) != 'undefined') {
                if (res.ReferralCode != null && res.ReferralCode != '') {
                    return (
                        <View style={{ alignItems: 'center', justifyContent: 'space-around', paddingTop: 25, paddingBottom: 15, borderRadius: 10, backgroundColor: colors.WHITE }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.overViewText, { fontFamily: fonts.bold }]}>Code Generated</Text>
                                <Text style={[styles.overViewText, { marginTop: 5, marginBottom: 10, fontFamily: fonts.bold }]}>{res.ReferralCode}</Text>
                            </View>
                            <YellowButton
                                style={{ width: '80%', alignSelf: 'center', marginBottom: 10, marginTop: 10 }}
                                title='Share'
                                navigate={() => {
                                    this.onShare(res.ReferralCode)
                                }}
                            />
                        </View>
                    )
                }
            }
        }
        return (
            null
        )
    }


    styleGenerateCodeButton = (isStyle) => {
        const res = this.props.getReferralCodeResponse
        if (typeof (res) != 'undefined') {
            if (typeof (res.ReferralCode) != 'undefined') {
                if (res.ReferralCode != null && res.ReferralCode != '') {
                    if (isStyle) {
                        return
                        (
                            {
                                width: '80%',
                                alignSelf: 'center',
                                marginBottom: 20,
                                marginTop: 15,
                                opacity: 0.5

                            })
                    } else {
                        return true
                    }

                }
            }
        }
        if (!isStyle) {
            return false
        } else {
            return (
                {
                    width: '80%',
                    alignSelf: 'center',
                    marginBottom: 20,
                    marginTop: 15,
                    opacity: 1
                }
            )
        }
    }

    generateCode = () => {
        EncryptedStorage.getItem('userId', async (res, err) => {
            if (res) {
                await CheckAccessTokenExpiryTime('ProfilePage')
                this.props.dispatch(CCSActionCreator.generateReferralCode(res))
            }
        })
    }

    renderManageMembersHeader = () => {
        return (
            <View style={{ justifyContent: 'center', width: getDeviceWidth() - 50 }}>
                <YellowButton
                    navigate={() => {
                        this.generateCode()
                    }}
                    style={{
                        width: '80%',
                        alignSelf: 'center',
                        marginBottom: 20,
                        marginTop: 15,

                    }}
                    // disabled={this.styleGenerateCodeButton(false)} 
                    title='Generate Code' />
                <Text style={[styles.secUserName, { fontSize: 13, textAlign: 'center', fontFamily: fonts.regular }]}>{inviateYourFriends}</Text>
                {this.renderGeneratedCodeView()}
            </View>
        )
    }

    renderSecUsersRow = ({ item, index }) => {
        return (
            <View style={styles.secUsersRow}>
                <View style={styles.secUserNameHolder}>
                    <Text style={styles.secUserName}>{item.FirstName} {item.LastName}</Text>
                    <Text style={[styles.secUserName, { fontSize: 13, fontWeight: '400' }]}>{item.Email}</Text>
                    <Text style={[styles.secUserName, { fontSize: 13, fontWeight: '400' }]}>{item.Mobile}</Text>
                </View>
                <View style={[styles.secUserNameHolder, { width: '20%', justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ itemToRemove: item }, () => {
                                this.setState({ showConfirmationModal: true })
                            })

                        }}
                    >
                        <Image
                            resizeMode='contain'
                            source={require('../../../assets/images/close_round.png')}
                            style={{ width: 32, height: 32 }} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    secUserKeyExtractor = (item, index) => item.SecondaryUserID.toString()

    renderSecondaryUsersList = () => {
        const res = this.props.getSecondaryUsersResponse

        if (typeof (res) != 'undefined') {
            if (res != null) {
                if (typeof (res.SecondaryUserList) != 'undefined') {
                    if (res.SecondaryUserList != null) {
                        if (res.SecondaryUserList.length > 0) {
                            return (
                                <FlatList
                                    contentContainerStyle={{ width: getDeviceWidth() - 50 }}
                                    data={res.SecondaryUserList}
                                    renderItem={this.renderSecUsersRow}
                                    ListHeaderComponent={this.renderManageMembersHeader}
                                    keyExtractor={this.secUserKeyExtractor} />
                            )
                        }
                    }
                }
            }
        }
        return (
            <View style={{ justifyContent: 'center', width: getDeviceWidth() - 50 }}>
                {/* <YellowButton
                    navigate={() => {
                        this.generateCode()
                    }}
                    style={{
                        width: '80%',
                        alignSelf: 'center',
                        marginBottom: 20,
                        marginTop: 15,

                    }}
                    // disabled={this.styleGenerateCodeButton(false)}
                    title='Generate Code' /> */}
                {/* <Text style={[styles.secUserName, { fontSize: 12, textAlign: 'center', fontFamily: fonts.regular }]}>{inviateYourFriends}</Text>
                {this.renderGeneratedCodeView()} */}
            </View>

        )
    }

    renderGifts = () => {
        if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
            return (
                <View>
                    {this.renderSecondaryUsersList()}
                </View>
            )
        } else {
            const res = this.props.getGiftsAndRewardsResponse
            if (typeof (res.gifts) != 'undefined' && this.state.selectedButton == 2) {
                if (res.gifts.length > 0) {
                    return (
                        <View style={{ flex: 1 }}>
                            <FlatList
                                indicatorStyle='black'
                                data={res.gifts}
                                renderItem={this.renderGiftsItem}
                                keyExtractor={this.giftsKey}
                            />
                        </View>

                    )
                }
            }
            return (
                <View>
                    <Text style={[styles.overViewText, { color: colors.BLACK, textAlign: 'center' }]}>No Gifts</Text>
                </View>
            )
        }

    }


    renderEachView = () => {
        if (this.state.selectedButton == 1) {
            return (
                <View behavior={Platform.OS == 'ios' && 'padding'} style={[styles.eachView, { flex: 1 }]}>
                    <FlatList
                        data={dataArray}
                        keyExtractor={this.keyy}
                        renderItem={this.rend}
                        extraData={this.props}
                    />
                </View>
            )
        }
        if (this.state.selectedButton == 2) {
            return (
                <View style={[styles.eachView, { flex: 1 }]}>
                    {this.renderGifts()}
                </View>
            )
        }
        return (
            <View style={[styles.eachView, { flex: 1 }]}>
                {this.renderRewards()}
            </View>
        )

    }

    favBrandsKeyExtractor = (item, index) => item.id.toString()

    renderFavBrands = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.favBrandItem}
                onPress={() => {
                    // this.props.navigation.navigate('ReceiptMerchant',{item:item})
                }}
            >
                <ImageComponent
                    resizeMode={'contain'}
                    style={{ width: 35, height: 35, borderRadius: 20 }}
                    imageUrl={item.image}
                />

            </TouchableOpacity>
        )
    }

    renderFavList = () => {
        const res = this.props.getFavBrandsResponse
        if (typeof (res) != 'undefined') {
            if (res.length > 0) {
                return (
                    <FlatList
                        horizontal
                        contentContainerStyle={{ minHeight: 70, maxHeight: 70, alignItems: 'center' }}
                        data={res}//{this.props.categories}
                        renderItem={this.renderFavBrands}
                        keyExtractor={this.favBrandsKeyExtractor}
                    />
                )

            }
        }
    }

    renderSetTargetView = () => {
        const balanceRes = this.props.balanceResponse

        if (typeof (balanceRes) != 'undefined' && !this.state.editTargetTapped) {
            if (typeof (balanceRes.TargetAmount) != 'undefined' && typeof (balanceRes.GoalName) != 'undefined') {
                if (balanceRes.TargetAmount != null && balanceRes.GoalName != null) {
                    return (
                        <View>
                            {this.renderEditGoalNameView(balanceRes.TargetAmount, balanceRes.GoalName)}
                        </View>
                    )
                }
            }
        }
        return (
            <View>
                {this.renderSetTargetAndGoalNameView()}
            </View>
        )
    }

    renderEditGoalNameView = (target, name) => {
        return (
            <View style={[styles.favDataView, { marginBottom: 10, flexDirection: 'column', height: 210, alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={[styles.overViewText, { color: colors.BLACK, marginBottom: 10, marginTop: 10, fontSize: 13, fontFamily: fonts.bold }]}>Goal Name</Text>
                <Text style={[styles.overViewText, { color: colors.APP_GREEN, marginBottom: 5, marginBottom: 15, fontSize: 16, fontFamily: fonts.buttonTextFont }]}>{name}</Text>
                <View style={{ height: 1, backgroundColor: colors.DASHBOARD_CONTENT_VIEW, width: '80%', marginBottom: 15 }} />
                <Text style={[styles.overViewText, { color: colors.BLACK, marginBottom: 5, fontSize: 13, fontFamily: fonts.bold }]}>Target Amount</Text>
                <Text style={[styles.overViewText, { color: colors.APP_GREEN, marginBottom: 5, marginBottom: 15, fontSize: 16, fontFamily: fonts.buttonTextFont }]}>${target}</Text>
                <YellowButton
                    navigate={() => {
                        this.setState({ editTargetTapped: true })
                    }}
                    title='Edit'
                    style={{ width: '80%', alignSelf: 'center', marginTop: 5, marginBottom: 5 }}
                />
            </View>
        )
    }

    renderSetTargetAndGoalNameView = () => {
        return (
            <View>
                {/* <Text style={styles.favouritesText}>Set Target:</Text> */}
                <View style={[styles.favDataView, {
                    marginBottom: 10, flexDirection: 'column', height: 200,
                    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.DASHBOARD_PAGIING_VIEW
                }]}>
                    <View style={styles.setTargetTextInputHolder}>
                        <TextInput
                            style={styles.goalNameTextInput}
                            placeholder='Enter Goal Name'
                            placeholderTextColor={colors.GREY}
                            onChangeText={(text) => {
                                this.setState({ goalName: text })
                            }}
                            value={this.state.goalName}
                            maxLength={50}
                        />
                    </View>

                    <View style={[styles.setTargetTextInputHolder, { marginTop: 10, marginBottom: 10 }]}>
                        <TextInput
                            style={styles.goalNameTextInput}
                            placeholder='Enter Target Amount'
                            placeholderTextColor={colors.GREY}
                            keyboardType='decimal-pad'
                            returnKeyType='done'
                            onChangeText={(text) => {
                                this.setState({ targetAmount: text })
                            }}
                            value={this.state.targetAmount}
                            maxLength={7}
                        />
                    </View>
                    <YellowButton
                        disabled={this.state.goalName.length < 1 || this.state.targetAmount.length < 1}
                        navigate={() => {
                            this.setState({ editTargetTapped: false, goalName: '', targetAmount: '' })
                            const name = this.state.goalName
                            const target = this.state.targetAmount
                            if (name != '' && target != '') {
                                if (Number(target) > 0) {
                                    EncryptedStorage.getItem('userId', async (res, err) => {
                                        if (res) {
                                            await CheckAccessTokenExpiryTime('ProfilePage')
                                            this.props.dispatch(CCSActionCreator.settarget(res, target, name))
                                        }
                                    })

                                }
                            }
                        }}
                        style={{ alignSelf: 'center', width: '90%', marginTop: 10 }}
                        title='Done' />
                </View>
            </View>
        )
    }

    renderFavourites = (item) => {
        if (item.id == 1) {
            return (
                <View>
                    <Text style={[styles.favouritesText]}>{item.name}</Text>
                    <View style={styles.favDataView}>
                        {this.renderFavList()}
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ isVisible: true })

                            }}
                            style={
                                (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ?
                                    [styles.favBrandItem, { backgroundColor: colors.White, marginLeft: 10, width: 40, height: 40, borderWidth: 0 }]
                                    :
                                    [styles.favBrandItem, { backgroundColor: colors.YELLOW, marginLeft: 10, width: 40, height: 40 }]
                            }>
                            {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ?
                                <Image style={{ width: 32, height: 32 }} source={require('../../../assets/images/green_plus_icon.png')} />
                                :
                                <Image style={{ width: 25, height: 25, tintColor: colors.White }} source={require('../../../assets/images/plus.png')} />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }

        if (item.id == 2) {
            if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
                return (
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        {this.renderSetTargetView()}
                    </View>

                )
            }
            return (
                <View style={{ marginTop: 20, marginBottom: 20 }}>
                    {this.renderAchievements()}
                </View>
            )

        }

        if (item.id == 3) {
            if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
                return null
            }
            return (
                <View>
                    {this.renderCommunities()}
                </View>
            )
        }

        if (item.id == 4) {
            if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
                return null
            }
            return (
                <View>
                    {this.renderReferAFriend()}
                </View>
            )
        }


    }

    fachievementsKeyExtractor = (item, index) => item.id.toString()

    renderAchievementsItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={[styles.favBrandItem, { borderWidth: 0 }]}>
                <Image resizeMode='contain' source={item.icon} style={{ width: 35, height: 35 }} />
            </TouchableOpacity>
        )
    }

    renderAchievementsList = () => {
        return (
            <FlatList
                horizontal
                contentContainerStyle={{ minHeight: 70, maxHeight: 70, alignItems: 'center' }}
                data={achievementsList}//{this.props.categories}
                renderItem={this.renderAchievementsItem}
                keyExtractor={this.fachievementsKeyExtractor}
            />
        )
    }

    renderAchievements = () => {
        return (
            <View>
                <Text style={styles.favouritesText}>Achievements:</Text>
                <View style={styles.favDataView}>
                    {this.renderAchievementsList()}
                </View>
            </View>
        )
    }

    communitiesKeyExtractor = (item, index) => index.toString()

    renderCommunitiesRowItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.favBrandItem}
                onPress={() => {
                    EncryptedStorage.getItem('userId', (res, err) => {
                        if (res) {
                            if (res.toString() == item.user_id.toString()) {
                                this.props.navigation.navigate('CommunityDesc', { item: item, fromProfile: true, isEditable: true })
                            } else {
                                this.props.navigation.navigate('CommunityDesc', { item: item, fromProfile: true, isEditable: false })
                            }
                        }
                    })
                }}
            >
                <ImageComponent
                    resizeMode={'contain'}
                    style={{ width: 35, height: 35, borderRadius: 20 }}
                    imageUrl={item.CoverImage}
                />

            </TouchableOpacity>
        )
    }

    renderCommunitiesList = () => {
        const res = this.props.getCommunitiesResponse
        if (typeof (res) != 'undefined') {
            if (res.length > 0) {
                return (
                    <FlatList
                        horizontal
                        contentContainerStyle={{ minHeight: 70, maxHeight: 70, alignItems: 'center' }}
                        data={res}//{this.props.categories}
                        renderItem={this.renderCommunitiesRowItem}
                        keyExtractor={this.communitiesKeyExtractor}
                    />
                )

            }
        }
    }

    renderCommunities = () => {
        return (
            <View>
                <Text style={styles.favouritesText}>Communities:</Text>
                <View style={[styles.favDataView, { marginBottom: 10 }]}>
                    {this.renderCommunitiesList()}
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('CreateCommunity', { isPlusTapped: true, item: null })
                        }}
                        style={[styles.favBrandItem, { backgroundColor: colors.YELLOW, marginLeft: 10, width: 40, height: 40 }]}>
                        <Image style={{ width: 25, height: 25, tintColor: colors.WHITE }} source={require('../../../assets/images/plus.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderReferAFriend = () => {
        return (
            <View>
                <Text style={styles.favouritesText}>Refer A Friend:</Text>
                <View style={[styles.favDataView, { marginBottom: 10, justifyContent: 'center', flexDirection: 'column', height: 100 }]}>
                    <Text style={[styles.favouritesText, { textAlign: 'center', margin: 5 }]}>You can refer a friend to get any of the insurances to earn points</Text>

                    <YellowButton
                        style={{
                            justifyContent: 'center', alignItems: 'center',
                            backgroundColor: colors.APP_GREEN, alignSelf: 'center', width: '50%', height: 40
                        }}
                        textStyle={[styles.favouritesText, { color: colors.White }]}
                        title='Refer A Friend'
                        navigate={() => {
                            this.props.navigation.navigate('AddSecondaryUsers')
                        }}
                    />
                </View>
            </View>
        )
    }

    renderEditButtonAfterCheck = () => {
        return (
            <View style={this.state.isEditTapped ? [styles.nameTextFieldHolder, { marginTop: 10, marginBottom: 5 ,justifyContent:'space-around'}] : [styles.nameTextFieldHolder, { marginTop: 10, marginBottom: 5 }]}>

                <TouchableOpacity style={!this.state.isEditTapped ? [styles.editIconHolder, { borderWidth: 0 }] : [styles.editIconHolder, { borderRadius: 25, backgroundColor: colors.White, height: 45,width:'45%' }]}
                    onPress={() => {
                        this.setState({ isEditTapped: !this.state.isEditTapped }, () => {
                            if (this.state.isEditTapped) {
                                this.setState({ name: null, middleName: null, lastName: null, image: null })
                            }
                            if (!this.state.isEditTapped) {
                                const res = this.props.response
                                if (res.FirstName != this.state.name || res.MiddleName != this.state.middleName || res.LastName != this.state.lastName) {
                                    EncryptedStorage.getItem('userId', async (result, err) => {
                                        if (result) {
                                            if (this.state.image != null) {
                                                this.props.dispatch(RegistrationActionCreator.uploadImage(result, this.state.image.data, true))
                                                this.setState({ image: null })
                                            }

                                            const fName = this.state.name != null ? this.state.name : res.FirstName
                                            const mName = this.state.middleName != null ? this.state.middleName : res.MiddleName
                                            const lName = this.state.lastName != null ? this.state.lastName : res.LastName
                                            const place = this.state.place != null ? this.state.place : res.Place
                                            await CheckAccessTokenExpiryTime('ProfilePage')
                                            this.props.dispatch(ProfileActionCreator.editProfileDetails(
                                                result, fName, mName, lName, place
                                            ))

                                        }
                                    })
                                }



                            }
                        })
                    }}>
                    {this.state.isEditTapped ?
                        <Text style={[styles.nameText, { fontSize: 16, fontFamily: fonts.buttonTextFont, color: colors.APP_GREEN, marginTop: 0 }]}>Save</Text>
                        :
                        <Text style={[styles.nameText, { fontSize: 14, fontFamily: fonts.heavy, color: colors.BUTTON_TEXT_COLOUR, marginTop: 0 }]}>Edit Profile</Text>
                    }
                    {!this.state.isEditTapped &&
                        <Image resizeMode='contain' style={{ width: 16, height: 16, tintColor: colors.White, marginLeft: 5 }}
                            source={require('../../../assets/images/edit_2.png')} />}
                </TouchableOpacity>

                {this.state.isEditTapped &&
                    <TouchableOpacity style={[styles.editIconHolder, { borderRadius: 25, backgroundColor: colors.White, height: 45,width:'45%' }]}
                        onPress={() => {
                            this.setState({ isEditTapped: false, image: null })
                        }}>
                        <Text style={[styles.nameText, { fontSize: 16, fontFamily: fonts.buttonTextFont, color: colors.APP_GREEN, marginTop: 0 }]}>Cancel</Text>
                    </TouchableOpacity>}
            </View>
        )
    }

    renderEditButton = () => {

        const isPrimary = this.props.isPrimaryUserResponse

        if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
            if (typeof (isPrimary) != 'undefined') {
                if (isPrimary) {
                    return null
                } else {
                    return (
                        <View>
                            {this.renderEditButtonAfterCheck()}
                        </View>
                    )
                }
            }
        }
        return (
            <View>
                {this.renderEditButtonAfterCheck()}
            </View>
        )



    }

    renderEditEmailAndMobile = () => {
        if (this.state.isEditTapped) {
            if (typeof (this.props.isPrimaryUserResponse) != 'undefined') {
                if (!this.props.isPrimaryUserResponse) {
                    return (
                        <View style={[styles.nameTextFieldHolder, { marginTop: 10, marginBottom: 5 ,justifyContent:'space-around'}]}>
                            <TouchableOpacity style={[styles.editIconHolder, { borderRadius: 25, backgroundColor: colors.White, height: 45,width:'45%' }]}
                                onPress={() => {
                                    EncryptedStorage.getItem('userId', (res, err) => {
                                        if (res) {
                                            EncryptedStorage.getItem('email', (email, err) => {
                                                if (email) {
                                                    this.props.dispatch(ProfileActionCreator.editEmail(res, email, DYNAMIC_LINK, '1'))
                                                }
                                            })
                                        }
                                    })
                                }}
                            >
                                <Text style={[styles.nameText, { fontSize: 16, fontFamily: fonts.buttonTextFont, color: colors.APP_GREEN, marginTop: 0 }]}>Edit Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.editIconHolder, { borderRadius: 25, backgroundColor: colors.White, height: 45,width:'45%' }]}
                                onPress={() => {
                                    EncryptedStorage.getItem('userId', (res, err) => {
                                        if (res) {
                                            const response = this.props.response
                                            if (typeof (response) != 'undefined') {
                                                if (typeof (response.Mobile) != 'undefined') {
                                                    if (response.Mobile != null) {
                                                        if (response.Mobile.length > 8) {
                                                            this.props.dispatch(ProfileActionCreator.editMobile(res, response.Mobile, '1'))
                                                        }
                                                    }
                                                }
                                            }


                                        }
                                    })
                                }}
                            >
                                <Text style={[styles.nameText, { fontSize: 16, fontFamily: fonts.buttonTextFont, color: colors.APP_GREEN, marginTop: 0 }]}>Edit Mobile</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            }
        }
    }

    renderHeader = () => {
        return (
            <View style={{}}>
                <ScrollView 
                bounces={false}
                contentContainerStyle={[styles.profileData]}>
                    <TouchableOpacity
                        onPress={() => {
                        }}>
                    </TouchableOpacity>
                    {this.renderProfileImage()}
                    {this.renderUpdateImageView()}
                    {this.renderName()}
                    {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) &&
                        <Image
                            resizeMode='contain'
                            style={this.state.isEditTapped ? { width: 0, height: 0 } : { width: 113, height: 82, position : 'absolute', top : "110%" }}
                            source={require('../../../assets/images/piggy_bank.png')} />
                    }
                    {/* {this.renderPlace()} */}
                    {/* {this.renderPlan()} */}

                    {this.renderEditButton()}

                    {this.renderEditEmailAndMobile()}



                </ScrollView>

            </View>
        )
    }

    onSaveTapped = (selectedBrands) => {
        if (typeof (selectedBrands) != 'undefined') {

            EncryptedStorage.getItem('userId', (res, err) => {
                if (res) {
                    this.props.dispatch(RegistrationActionCreator.saveFavourites(res, selectedBrands))
                    this.setState({ isVisible: false })
                }
            })
        }
    }

    onCancelTapped = () => {
        this.setState({ isVisible: false })
    }

    renderBrandsListModal = () => {
        return (
            <BrandsListModal
                isVisible={this.state.isVisible}
                onCancelTapped={this.onCancelTapped}
                onSaveTapped={this.onSaveTapped}
                navigation={this.props.navigation} />
        )
    }

    onCopyCodeTapped = () => {
        this.setState({ showRedeemModal: false })
    }

    onRemoveUserTapped = () => {
        this.setState({ showConfirmationModal: false })
        EncryptedStorage.getItem('userId', async (res, err) => {
            if (res) {
                await CheckAccessTokenExpiryTime('ProfilePage')
                this.props.dispatch(CCSActionCreator.removeSecondaryUsers(res, this.state.itemToRemove.SecondaryUserID))
            }
        })
    }

    onClose = () => {
        this.setState({ showConfirmationModal: false })
    }


    render() {

        const props = this.props
        const isPrimary = this.props.isPrimaryUserResponse

        if (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) {
            if (typeof (isPrimary) != 'undefined') {
                if (isPrimary) {
                    dataArray = [{ id: 1, name: 'Favourites:' }, { id: 2, name: 'Achievements:' }, { id: 3, name: 'Communities:' }]
                } else {
                    dataArray = [{ id: 1, name: 'Favourites:' }]
                }
            }
        }
        else if (Config.ENV.includes('suncorpDev') || Config.ENV.includes('suncorpProd')) {
            dataArray = [{ id: 1, name: 'Favourites:' }, { id: 2, name: 'Achievements:' }, { id: 3, name: 'Communities:' }, { id: 4, name: 'Refer A Friend:' }]
        }
        else {
            dataArray = [{ id: 1, name: 'Favourites:' }, { id: 2, name: 'Achievements:' }, { id: 3, name: 'Communities:' }]
        }

        return (
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' && 'padding'} style={{ flex: 1 }}>
                <ActivityIndicatorModal
                    isVisible={props.loading || props.updateImageLoading || props.getGiftsAndRewardsLoading || props.getBrandsLoading ||
                        props.getFavBrandsLoading || props.saveBrandsLoading || props.editProfileLoading || props.balanceLoading || props.setTargetLoading ||
                        props.getSecondaryUsersLoading || props.removeSecondaryUsersLoading || props.getReferralCodeLoading ||
                        props.verifyEmailLoading || props.verifyMobileLoading
                    } />
                <ConfirmationModal
                    isVisible={this.state.showConfirmationModal}
                    title={'Removing this user from your account will remove their access from Childcare Saver. Are you sure that you want to delete the user?'}
                    buttonText={'Yes'}
                    onClose={this.onClose}
                    removeUser={true}
                    onButtonTapped={this.onRemoveUserTapped}
                />

                <RedeemModal
                    response={this.state.redeemItem}
                    isVisible={this.state.showRedeemModal}
                    onCopyCodeTapped={this.onCopyCodeTapped} />

                {this.renderBrandsListModal()}
                {this.renderHeader()}
                {this.renderBottomViewButtons()}
                {this.renderEachView()}
            </KeyboardAvoidingView>


        );
    }
}
export default connect(mapStateToProps)(Profile);


const styles = StyleSheet.create({
    container: {
        marginBottom: 10
    },
    profileData: {
        backgroundColor: colors.APP_GREEN,
        width: getDeviceWidth(),
        paddingTop: 80,
        paddingBottom: 20,
        paddingLeft: 10,
        marginBottom: 5
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    nameText: {
        fontFamily: fonts.bold,
        color: colors.White,
        fontSize: 20,
        textAlign: 'center',
        marginTop: 5
    },
    name: {
        color: colors.White,
        fontSize: 16,
        fontFamily: fonts.bold,
        textAlign: 'center'
    },
    planView: {
        backgroundColor: colors.YELLOW,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 5,
        borderRadius: 2
    },
    editIconHolder: {
        alignSelf: 'center',
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.YELLOW,
        marginRight: 10,
        marginLeft: 10,
        width: 120,
        justifyContent: 'center'
    },
    nameTextFieldHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        width: getDeviceWidth() - 20,
        marginTop: 5,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    nameTextFieldHolder2: {
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    nameTextField: {
        fontFamily: fonts.bold,
        color: colors.White,
        fontSize: 18,
        textAlign: 'center',

    },
    nameTextFieldEnabled: {
        fontFamily: fonts.regular,
        color: colors.White,
        fontSize: 14,
        // textAlign: 'center',
        // borderWidth: 1,
        borderColor: colors.White,
        width: (getDeviceWidth() - 26) / 2,
        marginRight: 2,
        marginLeft: 10
    },
    updateImageHolder: {
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
        flexDirection: 'row'
    },
    takeSnapButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        backgroundColor: colors.YELLOW,
        marginBottom: 5,
        width: 70,
        marginRight: 10
    },
    takeSnaptext: {
        fontFamily: fonts.bold,
        fontSize: 15,
        color: colors.BUTTON_TEXT_COLOUR
    },
    overViewGiftsRewardsHolder: {
        width: getDeviceWidth() - 20,
        marginLeft: 10,
        marginRight: 10,
    },
    topView: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overViewButton: {
        width: (getDeviceWidth() - 50) / 3,
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },

    overViewButtonCCSProd: {
        width: (getDeviceWidth() - 30) / 2,
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    overViewButtonSelected: {
        width: (getDeviceWidth() - 50) / 3,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: colors.DASHBOARD_PAGIING_VIEW,
        height: '100%'
    },

    overViewButtonSelectedCCSProd: {
        width: (getDeviceWidth() - 50) / 2,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.DASHBOARD_PAGIING_VIEW,
        height: '100%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    viewOnTopOfButtonSelectedCCS: {
        height: '100%',
        backgroundColor: 'transparent',
        width: '100%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        flex : 1
    },

    viewOnTopOfButtonCCS: {
        height: '100%',
        backgroundColor: colors.LightGray,
        width: '100%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center'
    },


    overViewText: {
        fontFamily: fonts.buttonTextFont,
        fontSize: 15,
        color: colors.BLACK,
        textAlign: 'center'
    },
    overViewTextSelected: {
        fontFamily: fonts.buttonTextFont,
        fontSize: 15,
        color: colors.APP_GREEN,
        textAlign: 'center',
  
    },
    eachView: {
        width: getDeviceWidth() - 30,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: colors.DASHBOARD_PAGIING_VIEW,
        paddingTop: 10,
        paddingBottom: 5,
        paddingLeft: 10,

    },
    favouritesText: {
        fontFamily: fonts.bold,
        fontSize: 14,
    },
    favDataView: {
        backgroundColor: colors.White,
        height: 70,
        marginRight: 10,
        marginTop: 5,
        paddingLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10
    },
    firstNameTextLabel: {
        fontFamily: fonts.medium,
        fontSize: 13,
        color: colors.White
    },
    favBrandItem: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: colors.YELLOW,
    },
    goalNameTextInput: {
        fontFamily: fonts.bold,
        fontSize: 13,
        // marginTop: 15,
        // marginBottom: 15,
        borderRadius: 10,
        width: '80%',
        color:"black"
    },
    secUsersRow: {
        width: '100%',
        backgroundColor: colors.White,
        height: 80,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    secUserNameHolder: {
        width: '80%',
        height: '100%',
        justifyContent: 'space-evenly',
        padding: 5,

    },
    secUserName: {
        fontFamily: fonts.bold,
        fontSize: 16,
        margin: 5
    },
    setTargetTextInputHolder: {
        backgroundColor: colors.WHITE,
        borderRadius: 10,
        paddingLeft: 10,
        justifyContent: 'center',
        paddingTop: Platform.OS == 'ios' ? 15 : 0,
        paddingBottom: Platform.OS == 'ios' ? 15 : 0,
        width: '90%'
    },
    bottomBorderView:{ 
        width: getDeviceWidth() - 40, 
        height: 1, 
        backgroundColor: colors.DASHBOARD_CONTENT_VIEW, 
        marginRight: 20, 
        marginLeft: 10 
    }
});
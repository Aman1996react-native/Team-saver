import {combineReducers} from 'redux'

import IsFirstTimeCheckReducer from '../reducers/auth/isFirstTimeCheckReducer'
import IsLoggedInReducer from '../reducers/auth/isLoggedInReducer'
import SendNameAndEmailRegReducer from '../reducers/registration/signUp2Reducer'
import SendMobileNumberRegReducer from '../reducers/registration/sendMobileNumberReducer'   
import VerifyEmailReducer from '../reducers/registration/verifyEmailReducer'
import MobileNumberVerifiedRegReducer from '../reducers/registration/mobileNumberVerifiedReducer'
import CreateMPinRegReducer from '../reducers/registration/createMPinReducer'
import GetTCRegReducer from '../reducers/registration/getTCReducer'
import AcceptTCRegReducer from '../reducers/registration/acceptTCReducer'
import UploadImageRegReducer from '../reducers/registration/uploadImageReducer'
import GetTopBrandsRegReducer from '../reducers/registration/getTopBrandsReducer'
import SaveFavouritesRegReducer from '../reducers/registration/saveFavouritesReducer'
import LoginReducer from '../reducers/login/loginReducer'
import ForgotMPINReducer from '../reducers/login/forgotMPINReducer'
import GetPrivacyPolicyRegReducer from '../reducers/registration/getPrivacyPolicyReducer'
import GetCateogoriesReducer from '../reducers/app/offers/getCategoriesReducer'
import SaveOffersReducer from '../reducers/app/offers/saveOffersReducer'
import GetSaveOffersReducer from '../reducers/app/offers/getSaveOffersReducer'
import GetRewardCategoriesReducer from '../reducers/app/rewards/getRewardCategoriesReducer'
import GetRewardDetailsReducer from '../reducers/app/rewards/getRewardDetailsReducer'
import GetMatchedContactsReducer from '../reducers/app/rewards/getMatchedContactsReducer'
import GetPointsBalanceReducer from '../reducers/app/rewards/getPointsBalanceReducer'
import RedeemGiftCardReducer from '../reducers/app/rewards/redeemGiftCardReducer'
import GetProfileDetailsReducer from '../reducers/app/profile/getProfileDetailsReducer'
import GetFavBrandsReducer from '../reducers/app/profile/getFavBrandsReducer'
import GetGiftsAndRewardsReducer from '../reducers/app/profile/getGiftsAndRewardsReducer'
import EditProfileReducer from '../reducers/app/profile/editProfileReducer'
import GetFoodAndWineListReducer from '../reducers/app/rewards/pos/getFoodAndWineListReducer'
import PurchaseFoodPOSReducer from '../reducers/app/rewards/pos/purchaseFoodPosReducer'
import GetBankDetailsReducer from '../reducers/app/topup/getbankDetailsReducer'
import SendMoneyToUserReducer from '../reducers/app/topup/sendMoneyToUserReducer'
import RequestMoneyTopUpReducer from '../reducers/app/topup/requestMoneyTopUpReducer'
import GetNotificationsReducer from '../reducers/app/notifications/getNotificationsReducer'
import UpdateNotificationStatusReducer from '../reducers/app/notifications/updateNotificationSeenStatusReducer'
import ApproveRequestedMoneyReducer from '../reducers/app/notifications/approveRequestedMoneyReducer'
import MakePaymentReducer from '../reducers/app/topup/makePaymentReducer'
import GetMoneyHistoryReducer from '../reducers/app/history/getMoneyHistoryReducer'
import GetPointsHistoryReducer from '../reducers/app/history/getPointsHistoryReducer'
import PointsTransferReducer from '../reducers/app/rewards/pointsTransfer/pointsTransferReducer'
import UpdateFCMTokenReducer from '../reducers/app/otherAPIs/updateFCMTokenReducer'
import ForceUpdateReducer from '../reducers/app/otherAPIs/forceUpdateReducer'
import GetmaintainanceReducer from '../reducers/app/otherAPIs/getMaintainanceStatusReducer'
import GetWoolworthDetailsReducer from '../reducers/app/otherAPIs/getWoolworthDetailsReducer'
import GetDevicesReducer from '../reducers/app/marketPlace/getDevicesReducer'
import GetAccessoriesReducer from '../reducers/app/marketPlace/getAccessoriesReducer'
import DeleteNotificationsReducer from '../reducers/app/notifications/deleteNotificationReducer'
import GetEmailAddressReducer from '../reducers/login/getEmailAddressReducer'
import CreateCommunityReducer from '../reducers/app/community/createCommunityReducer'
import GetCommunitiesByUserReducer from '../reducers/app/community/getCommunitiesByUserReducer'
import GetAllCommunitiesReducer from '../reducers/app/community/getAllCommunitiesReducer'
import GetAlertStatusReducer from '../reducers/app/consent/getAlertStatusReducer'
import RequestTimeBasedConsentReducer from '../reducers/app/consent/requestTimeBasedConsentReducer'
import SaveAlertStatusReducer from '../reducers/app/consent/saveAlertStatusReducer'
import GetLocatonServicesStatusReducer from '../reducers/app/consent/getLocationServicesStatusReducer'
import PostCommentsReducer from '../reducers/app/community/postCommentsReducer'
import JoinCommunityReducer from '../reducers/app/community/joinCommunityReducer'
import EditCommunityReducer from '../reducers/app/community/editCommunityReducer'
import GetTimeReducer from '../reducers/app/consent/getTimeReducer'
import SetTimeConsentStatusReducer from '../reducers/app/consent/setTimeConsentStatusReducer'
import GetTimeConsentStatusReducer from '../reducers/app/consent/getTimeConsentStatusReducer'
import SendMessageReducer from '../reducers/app/chat/sendMessageReducer'
import GetChatReducer from '../reducers/app/chat/getChatReducer'
import GetChatIdReducer from '../reducers/app/chat/getChatIdReducer'
import GetChatThreadReducer from '../reducers/app/chat/getChatThreadReducer'
import SetTargetReducer from '../reducers/app/ccs/setTargetReducer'
import IsPrimaryUserReducer from '../reducers/app/ccs/isPrimaryUserReducer'
import GetSecondaryUsersReducer from '../reducers/app/ccs/getSecondaryUsersReducer'
import RemoveSecondaryUsersReducer from '../reducers/app/ccs/removeSecondaryUserReducer'
import AddSecondaryUsersReducer from '../reducers/app/ccs/addSecondaryUsersReducer'
import GetFeedbackTitlesReducer from '../reducers/app/ccs/getFeedbackTitleReducer'
import SubmitFeedbackReducer from '../reducers/app/ccs/submitFeedbackReducer'
import GetCallDetailsReducer from '../reducers/app/ccs/getCallDetailsReducer'
import GetHeroTilesReducer from '../reducers/app/dashboard/getHeroTilesReducer'
import GetDailyOffersReducer from '../reducers/app/dashboard/getDailyOffers'
import ShopClickedReducer from '../reducers/app/offers/shopClickedReducer'
import GetClickHistoryReducer from '../reducers/app/history/getClickHistoryReducer'
import SubmitRewardClaimReducer from '../reducers/app/history/submitRewardClaimReducer'
import GetChallengesReducer from '../reducers/app/dashboard/getChallengesReducer'
import TransferToBankReducer from '../reducers/app/ccs/transferToBankReducer';
import ChangePinReducer from '../reducers/login/changePinReducer';
import ReferralCodeVerificationReducer from '../reducers/app/ccs/referralCodeVerificationReducer'
import GenerateReferralCodeReducer from '../reducers/app/ccs/generateReferralCodeReducer'
import GetReferralCodeReducer from '../reducers/app/ccs/getReferralCodeReducer'
import AddUpdatebankDetailsReducer from '../reducers/app/ccs/addUpdateBankDetailsReducer'
import DeleteBankdetailsReducer from '../reducers/app/ccs/deleteBankDetailsReducer'
import EditEmailReducer from '../reducers/app/profile/editEmailReducer'
import EditMobileReducer from '../reducers/app/profile/editMobileReducer'
import TransferToMasterCardReducer from '../reducers/app/rewards/pointsTransfer/transferToMasterCardReducer'
import PermanentlyDeleteUserReducer from '../reducers/app/ccs/permanentlyDeleteUserReducer'
import VerifyEmailAndMobileReducer from '../reducers/registration/verifyEmailAndMobileReducer'
import GetUserStatusReducer from '../reducers/app/ccs/checkuserStatusReducer'
import GetPopularOffersReducer from '../reducers/app/dashboard/getPopularOffersReducer'
import GetHeroTilesOffersReducer from '../reducers/app/offers/getHeroTilesOffersReducer'
import OfferWithRetailerNameReducer from '../reducers/app/ccs/offerWithRetailerNameReducer'
import ShouldnavigateToHelpReducer from '../reducers/app/ccs/shouldNavigateTohelpReducer'
import ShouldnavigateToProfileReducer from '../reducers/app/ccs/shouldnavigatetoProfileReducer'
import HasAppSwitchedToForegroundAfterSpecifiedTimeReducer from '../reducers/app/ccs/hasAppSwitchedToForegroundAfterSpecifiedTimeReducer'

import ShouldnavigateToSettingsReducer from '../reducers/app/ccs/shouldNavigateToSettingsReducer'
import ShouldnavigateToPrivacyPolicyReducer from '../reducers/app/ccs/shouldNavigateToPrivacyPolicyReducer'
import ShouldnavigateToTermsReducer from '../reducers/app/ccs/shouldNavigateToTermsReducer'
import ShouldnavigateToMasterCardReducer from '../reducers/app/ccs/shouldNavigateToMasterCardReducer'
import ShouldnavigateToHistoryReducer from '../reducers/app/ccs/shouldNavigateToHistoryReducer'
import ShouldnavigateToRewardsReducer from '../reducers/app/ccs/shouldNavigateToRewardsReducer'
import OfferWithCategoryNameReducer from '../reducers/app/ccs/offerWithcategoryNameReducer'
import IsTouchIdEnabledReducer from '../reducers/auth/isTouchIdEnabledReducer'


export default combineReducers(
    {
        IsFirstTimeCheckReducer,
        IsLoggedInReducer,
        SendNameAndEmailRegReducer,
        SendMobileNumberRegReducer,
        VerifyEmailReducer,
        MobileNumberVerifiedRegReducer,
        CreateMPinRegReducer,
        GetTCRegReducer,
        GetPrivacyPolicyRegReducer,
        AcceptTCRegReducer,
        UploadImageRegReducer,
        GetTopBrandsRegReducer,
        SaveFavouritesRegReducer,
        LoginReducer,
        ForgotMPINReducer,
        GetCateogoriesReducer,
        SaveOffersReducer,
        GetSaveOffersReducer,
        GetRewardCategoriesReducer,
        GetRewardDetailsReducer,
        GetMatchedContactsReducer,
        GetPointsBalanceReducer,
        RedeemGiftCardReducer,
        GetProfileDetailsReducer,
        GetFavBrandsReducer,
        GetGiftsAndRewardsReducer,
        EditProfileReducer,
        GetFoodAndWineListReducer,
        PurchaseFoodPOSReducer,
        GetBankDetailsReducer,
        SendMoneyToUserReducer,
        RequestMoneyTopUpReducer,
        GetNotificationsReducer,
        ApproveRequestedMoneyReducer,
        MakePaymentReducer,
        GetMoneyHistoryReducer,
        GetPointsHistoryReducer,
        PointsTransferReducer,
        UpdateFCMTokenReducer,
        ForceUpdateReducer,
        GetmaintainanceReducer,
        UpdateNotificationStatusReducer,
        GetWoolworthDetailsReducer,
        GetDevicesReducer,
        GetAccessoriesReducer,
        DeleteNotificationsReducer,
        GetEmailAddressReducer,
        CreateCommunityReducer,
        GetCommunitiesByUserReducer,
        GetAllCommunitiesReducer,
        GetAlertStatusReducer,
        RequestTimeBasedConsentReducer,
        SaveAlertStatusReducer,
        GetLocatonServicesStatusReducer,
        PostCommentsReducer,
        JoinCommunityReducer,
        EditCommunityReducer,
        GetTimeReducer,
        SetTimeConsentStatusReducer,
        GetTimeConsentStatusReducer,
        SendMessageReducer,
        GetChatReducer,
        GetChatIdReducer,
        GetChatThreadReducer,
        SetTargetReducer,
        IsPrimaryUserReducer,
        GetSecondaryUsersReducer,
        RemoveSecondaryUsersReducer,
        AddSecondaryUsersReducer,
        GetFeedbackTitlesReducer,
        SubmitFeedbackReducer,
        GetCallDetailsReducer,
        GetHeroTilesReducer,
        GetDailyOffersReducer,
        ShopClickedReducer,
        GetClickHistoryReducer,
        SubmitRewardClaimReducer,
        GetChallengesReducer,
        TransferToBankReducer,
        ChangePinReducer,
        ReferralCodeVerificationReducer,
        GenerateReferralCodeReducer,
        GetReferralCodeReducer,
        AddUpdatebankDetailsReducer,
        DeleteBankdetailsReducer,
        EditEmailReducer,
        EditMobileReducer,
        TransferToMasterCardReducer,
        PermanentlyDeleteUserReducer,
        VerifyEmailAndMobileReducer,
        GetUserStatusReducer,
        GetPopularOffersReducer,
        GetHeroTilesOffersReducer,
        OfferWithRetailerNameReducer,
        ShouldnavigateToHelpReducer,
        ShouldnavigateToProfileReducer,
        HasAppSwitchedToForegroundAfterSpecifiedTimeReducer,
        ShouldnavigateToSettingsReducer,
        ShouldnavigateToPrivacyPolicyReducer,
        ShouldnavigateToTermsReducer,
        ShouldnavigateToMasterCardReducer,
        ShouldnavigateToHistoryReducer,
        ShouldnavigateToRewardsReducer,
        OfferWithCategoryNameReducer,
        IsTouchIdEnabledReducer,

    }
)
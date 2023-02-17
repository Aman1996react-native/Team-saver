import Config from "react-native-config";


//URL
export const BASE_URL =  'https://gateway.invia.com.au/api/ts/' 
export const GET= 'GET'
export const POST= 'POST'
export const PUT= 'PUT'
export const DELETE= 'DELETE'
export const DYNAMIC_LINK= Config.dynamicLinkEmail


// Button 
export const SIGN_ME_UP = "Sign me up";
export const ALREADY_HAVE_AN_ACCOUNT = "Already have an account";
export const NEXT = "Next";
export const CONTINUE = "Continue";
export const BACK = "Back";
export const AGREE = "Agree";
export const SKIP = "Skip";
export const EXPLORE_MYSELF = "I'll explore myself";

// SIGNUP_1
export const SIGNUP_1 = {
    lbl_1:"Congratulations!",
    lbl_2:"You're only a few steps away" ,
    lbl_3:"from saving and getting rewarded",
    lbl_4:"mWallet.",
  }

  // SIGNUP_2
export const SIGNUP_2 = {
    lbl_1:"You're only a",
    lbl_2:"few steps away" ,
    lbl_3:"from joining",
    lbl_4:Config.appName,
    lbl_5:"To join you need to complete",
    lbl_6:"your profile details:",
    lbl_7:"Please enter the below details before proceeding to Login",
    ccs_lbl:'To join Childcare Saver, simply complete the below form and we will check your eligibility.'
  }

  // SIGNUP_3
export const SIGNUP_3 = {
    lbl_1:"We have sent you an email with a verification link.",
    lbl_2:"Please check your email on the mobile device you" ,
    lbl_3:"have downloaded Childcare Saver on",
    lbl_4:"Please remember to check your Junk mail",
  }

  // SIGNUP_4
export const SIGNUP_4 = {
    lbl_1:"Your email",
    lbl_2:"address is verified" ,
    lbl_3:"Please enter your mobile number"
  }

  // SIGNUP_5
export const SIGNUP_5 = {
    lbl_1:"Please enter the 6 digit verification",
    lbl_2:"code which has been sent to" ,
    lbl_3:"your mobile",
    lbl_4:"Didn't get a code? Resend Code"
  }

  // SIGNUP_6
export const SIGNUP_6 = {
    lbl_1:(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Create Password' : "Create 6 digit Pin",
    lbl_2:(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'Reset Password' : "Reset 6 digit Pin"
  }

  // SIGNUP_7
export const SIGNUP_7 = {
    lbl_1:"By creating an account you agree to our Terms of Service and Privacy Policy",
    lbl_2:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    lbl_3:"Terms and conditions",
    lbl_4:"Privacy Policy"
}

  // SIGNUP_8
export const SIGNUP_8 = {
    lbl_1:"mWallet",
    lbl_2:"VISA" ,
    lbl_3:"Connect your credit card or",
    lbl_4:"bank account to mWallet and.",
    lbl_5:"start saving today",
  }

    // SIGNUP_9
export const SIGNUP_9 = {
    lbl_1:"Choose a",
    lbl_2:"profile picture",
    lbl_3:"Choose from Gallery",
    lbl_4:"Take a snap"
  }

    // SIGNUP_10
export const SIGNUP_10 = {
    lbl_1:"Let us help tailor your",
    lbl_2:"shopping experience" ,
    lbl_3:"Add your favourite brands from",
    lbl_4:"this list below:",
  }

    // SIGNUP_11
export const SIGNUP_11 = {
    lbl_1:"Finished!",
    lbl_2:"Lets take a look" ,
    lbl_3:"around."
  }

  //offers
  export const OFFERS = {
    offers:'Offers',
    saved:'Saved',
    referAFriend:'Refer A Friend',
    looksLike:`It looks like you don't have any friends or family added yet. Earn bonus Points by referring a friend`,
    findFriends:'Find friends and family',
    onYourWay:`Taking you to your offer`,
    afeterYouHave: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 
    `After you complete your purchase, your cash back will appear in your account within 7 days.\n\nYou can view your latest balance from your Childcare Saver Reward Home Screen.`
    :
    `After you have completed your purchase,\Your Reward Points will appear in your account within 7 days.\nYou can view your latest points balance from your mWallet home screen.`

  }

  export const OFFERSCATEGORIES = {
    All:'All',
    Arts_Photography:'Arts & Photography',
    Auto_Accessories:'Auto & Accessories',
    Baby_Childern:'Baby & Children',
    Business_Work:'Business & Work',
    Cosmetics:'Cosmetics',
    Entertainment:'Entertainment',
    Fashion:'Fashion',
    Fitness_Sports:'Fitness & Sports',
    Flower_Gift:'Flower & Gifts',
    Food_Wine:'Food & Wine',
    Health_Beauty:'Health & Beauty',
    Home_Lifestyle:'Home and Lifestyle',
    Pet:'Pet',
    Technology:'Technology',
    Travel_Accomodation:'Travel & Accommodation'
  }

  export const OFFERSCATEGORIESDYNAMICLINK = {
    All:'All',
    Arts_Photography:'gotoarts',
    Auto_Accessories:'gotoauto',
    Baby_Childern:'gotobaby',
    Business_Work:'gotobusiness',
    Cosmetics:'gotocosmetics',
    Entertainment:'gotoentertainment',
    Fashion:'gotofashion',
    Fitness_Sports:'gotofitness',
    Flower_Gift:'gotogifts',
    Food_Wine:'gotofood',
    Health_Beauty:'gotohealth',
    Home_Lifestyle:'gotohome',
    Pet:'gotopet',
    Technology:'gototech',
    Travel_Accomodation:'gototravel'
  }

 // ERROR MSG
export const ERROR_MSG = {
    NO_INTERNET:"No Internet, please try later",
  }


 
/*
* Defining Utils
* src/utils directory to add all utility/helper methods that can be shared across our entire project.
*
* All repeating code is kept in utils to avoid code duplication..
*/
import { Platform, Alert } from "react-native";
import { APP_NAME } from "../constants";
import { Dimensions, PixelRatio } from "react-native";



const { width, height } = Dimensions.get('window');


export const widthToDp = number => {
  let givenWidth = typeof number === 'number' ? number : parseFloat(number);
  return PixelRatio.roundToNearestPixel((width * givenWidth) / 100);
};

export const heightToDp = number => {
  let givenHeight = typeof number === 'number' ? number : parseFloat(number);
  return PixelRatio.roundToNearestPixel((height * givenHeight) / 100);
};

export const getDeviceWidth = () => {
  return Math.round(width);
};


export const getDeviceHeight = () => {
  return Math.round(height);
};

export const getPageLimit = () => {
  return 10;
};

export const isFieldEmpty = text => {
  if (text == "") {
    return true;
  }
  return false;
};

export const popUpHeight = () => {
  const tempHeight = Math.round(height) * (0.9)
 return  tempHeight
}

export const isValidEmail = email => {
  const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (reg.test(email) === true) {
    return true;
  }
  return false;
};

export const isValidPassword = email => {
  // const reg = /^(?=.*[0-9])(?=.*[!@#$%^&_.*])[a-zA-Z0-9!@#$%^&_.*]{8,20}$/;
  const reg = /^(?=.*?[A-Z]{1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,20}$/
  if (reg.test(email) === true) {
    return true;
  }
  return false;
};

export const isValidPhoneNumber = phoneNo => {
  if (phoneNo.length < 8) {
    return false;
  }
  return true;
};

export const isValidComparedPassword = (password, confirmPassword) => {
  if (password == confirmPassword) {
    return true;
  }
  return false;
};
export const getOS = () => {
  if (Platform.OS === "ios") {
    return "ios";
  }
  return "android";
};

export const showAlert = message => {
  Alert.alert(
    APP_NAME,
    message,
    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
    { cancelable: false }
  );
};

export const showAlertWithCallBack = (msg, onOkClick) => {
  Alert.alert(
    "",
    msg,
    [
      {
        text: "OK",
        onPress: () => {
          console.log(" CLICK CALLED ");
          onOkClick() ;
        }
      }
    ],
    {
      cancelable: false
    }
  );
};
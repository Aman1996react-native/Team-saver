import React ,{ useEffect } from 'react';
import { Alert, StatusBar,View} from "react-native";
import {Provider} from 'react-redux'
import CongigureStore from './src/redux/store'
import Start from './src/appStart/start';

import SplashScreen from  "react-native-splash-screen";
import DeviceSecurity from 'react-native-device-security';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import RNExitApp from 'react-native-exit-app';
import UsbDubbingFunction,{usbDubbingCheck} from './src/views/screens/maintainanceAndForceUpdate/usbDubbingCheck';

const store = CongigureStore()

const App =() =>{
  // console.disableYellowBox = true
  useEffect( async () => {
    SplashScreen.hide();
    //  x()
  }, [])



  const CheckDebbuger = async () => {
    UsbDubbingFunction()

  }



    return (
        <View style={{ flex: 1 }}>
          <StatusBar translucent backgroundColor="transparent" />
          <Provider store={store}>
            <Start />
          </Provider>
        </View>
    )
}

export default App

import EncryptedStorage from 'react-native-encrypted-storage';
import { AuthActionCreator } from './auth';


//Is user inactive when app is in foreground
export const isUserInactiveWhenAppIsInForeground= async (val, endpoint,dispatch) => {
    try {

        if (val != null) {
            let today = new Date();
            let date = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
            let time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
            let dateTime = date + 'T' + time;
            await EncryptedStorage.setItem('timeWhenLastApiCallMade', today.toISOString())
        }

        const timeWhenLastApiCallMade = await EncryptedStorage.getItem('timeWhenLastApiCallMade')
        // console.warn(endpoint +' timeWhenLastApiCallMade: ' + timeWhenLastApiCallMade)
        

        const isLoggedIn = await EncryptedStorage.getItem('isLoggedIn')

        if (typeof (isLoggedIn) != 'undefined') {
            if (isLoggedIn != null) {
                if (isLoggedIn == 'true') {
                    // if (isForeground) {
                        if (typeof (timeWhenLastApiCallMade) != 'undefined') {
                            if(timeWhenLastApiCallMade != null){
                                if (timeWhenLastApiCallMade.length > 1) {

                                    const timeWhenLastApiCallMadeDateTime = new Date(timeWhenLastApiCallMade)

                                    // console.warn('Last API: ' + timeWhenLastApiCallMadeDateTime + ' ISO string: '+ timeWhenLastApiCallMadeDateTime.toISOString() )
                                    // console.warn('DATE NOW: '+ new Date().toISOString() )


                                    let date = timeWhenLastApiCallMadeDateTime.getFullYear() + '-' + (timeWhenLastApiCallMadeDateTime.getMonth() + 1).toString().padStart(2, '0') + '-' + timeWhenLastApiCallMadeDateTime.getDate().toString().padStart(2, '0');
                                    let time = timeWhenLastApiCallMadeDateTime.getHours().toString().padStart(2, '0') + ":" + timeWhenLastApiCallMadeDateTime.getMinutes().toString().padStart(2, '0') + ":" + timeWhenLastApiCallMadeDateTime.getSeconds().toString().padStart(2, '0');
                                    let dateTime = date + 'T' + time;

                                    let today = new Date();
                                    let dateNow = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
                                    let timeNow = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
                                    let dateTimeNow = dateNow + 'T' + timeNow;


                                    const difference = Math.abs(timeWhenLastApiCallMadeDateTime - new Date(today.toISOString())) / 1000
                                    const secondsElapsed = Math.floor(difference / 60 * 60)

                                    // console.warn(endpoint +': DIFFERENCE BETWEEN LAST API MADE: ' + secondsElapsed)
                                    if (secondsElapsed >= 1800) {
                                        // console.warn('LOGGING OUT HERE')
                                        dispatch(AuthActionCreator.isLoggedIn(false))
                                        dispatch(AuthActionCreator.isFirstTime(false))
                                        return
                                    }

                                } else {

                                }
                            }
                            
                        } else {

                        }
                    // }

                }
            }
        }
    }
    catch (e) {
        //console.warn('ERROR: '+e.toString())
    }
}
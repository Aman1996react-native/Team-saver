import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { GetAccessToken } from './getAccessToken';


export const CheckAccessTokenExpiryTime = async (endpoint) => {

    try {

        const res = await EncryptedStorage.getItem('sessionToken')

        if (typeof (res) != 'undefined') {
            if (res != null) {
                if (res) {
                    const tokenJson = JSON.parse(res)

                    if (typeof (tokenJson) != 'undefined') {
                        if (typeof (tokenJson.expires_in) != 'undefined' && typeof (tokenJson.refresh_expires_in) != 'undefined' &&
                            typeof (tokenJson.access_token) != 'undefined' && typeof (tokenJson.refresh_token) != 'undefined') {

                            if (tokenJson.expires_in != null && tokenJson.refresh_expires_in != null
                                && tokenJson.access_token != null && tokenJson.refresh_token != null) {

                                if (tokenJson.expires_in && tokenJson.refresh_expires_in && tokenJson.access_token && tokenJson.refresh_token) {
                                    let today = new Date();
                                    let date = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
                                    let time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
                                    let dateTime = date + 'T' + time;

                                    const timeWhenSaved = await EncryptedStorage.getItem('timeWhenGotAccessToken')

                                    // console.warn('SAVED TIME: '+timeWhenSaved)
                                    
                                    let secondsToCompare = 0
                                    if(tokenJson.expires_in > 0){
                                        secondsToCompare = tokenJson.expires_in - 30
                                    }
                                    const difference = Math.abs(new Date(dateTime) - new Date(timeWhenSaved)) / 1000
                                    const secondsElapsed = Math.floor(difference / 60 * 60)

                                    // console.warn('SECONDS ELAPSED: '+secondsElapsed)
                                    //console.warn('SECONDS TO COMPARE: '+secondsToCompare)

                                    if (secondsElapsed < secondsToCompare) {
                                        return tokenJson.access_token
                                    } else {
                                        let secondsToCompareRefresh = 0
                                        if(tokenJson.refresh_expires_in > 0){
                                            secondsToCompareRefresh = tokenJson.refresh_expires_in - 30
                                        }
                                        const differenceRefresh = Math.abs(new Date(dateTime) - new Date(timeWhenSaved)) / 1000
                                        const secondsElapsedRefresh = Math.floor(differenceRefresh / 60 * 60)

                                        //console.warn('REFRESH SECONDS ELAPSED: '+secondsElapsedRefresh)
                                        //console.warn('REFRESH SECONDS TO COMPARE: '+secondsToCompareRefresh)

                                        // if (secondsElapsedRefresh < secondsToCompareRefresh) {
                                            const accessToken = await GetAccessToken(endpoint)
                                            return accessToken
                                        // }
                                    }
                                }
                            }
                        }
                    }


                }
            }
        }
        return null

        if (res) {



            const dateWhenSaved = new Date(res)

            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
            var time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
            var dateTime = date + 'T' + time;

            const difference = Math.abs(new Date(dateTime) - dateWhenSaved) / 1000
            const minutesElapsed = Math.floor(difference / 60)
            // //console.warn('Minutes: '+minutesElapsed)
            if (minutesElapsed >= 59) {
                await EncryptedStorage.setItem('accessToken', '')
                await EncryptedStorage.setItem('timeWhenGotAccessToken', '')
                const token = await GetAccessToken()
                return token
            } else {

                const token = await EncryptedStorage.getItem('accessToken')
                if (token) {
                    if (typeof (token) != 'undefined') {
                        if (token != null) {
                            if (token.length > 0) {
                                return token
                            }
                        }
                    }
                }

                return null
            }
        } else {
            //console.warn('Calling....')
            const token = await GetAccessToken()
            return token
        }
        return null


    } catch (error) {
        //console.warn('Error: ' + error.toString())
        return null
    }


}
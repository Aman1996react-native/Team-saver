import * as Endpoints from '../../services/endPoints'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios'
import moment from "moment";
import { GetSignature } from './generateSignature';
import { Fail400, ServerError500, Success200 } from '../../services/statusCodes';



export const GetAccessToken = async (endpoint) => {

    try {

        const res = await EncryptedStorage.getItem('sessionToken')
        console.warn(endpoint + ': TOKEN SAVED: ' + res)

        if (typeof (res) != 'undefined') {
            if (res != null) {
                if (res) {
                    //console.warn('TOKEN SAVED: '+res)
                    const tokenJson = JSON.parse(res)

                    if (typeof (tokenJson) != 'undefined') {
                        if (typeof (tokenJson.access_token) != 'undefined' && typeof (tokenJson.refresh_token) != 'undefined') {

                            if (tokenJson.access_token != null && tokenJson.refresh_token != null) {

                                if (tokenJson.access_token && tokenJson.refresh_token) {

                                    if (
                                        false
                                        // endpoint != 'Home' && endpoint != 'LoginPage' && endpoint != 'GiftsTab' && endpoint != 'OffersTab'
                                        // && endpoint != 'ConsentDetailsPage' && endpoint != 'ProfilePage' && endpoint != 'NotificationsPage'
                                        // && endpoint != 'HistoryPage' && endpoint != 'GiftCheckoutStartPage' && endpoint != 'PointstransferPage'
                                        // && endpoint != 'RewardDetailsPage' && endpoint != 'TransferToBankPage'

                                    ) {
                                        setTimeout(async () => {
                                            const savedToken = await EncryptedStorage.getItem('sessionToken')
                                            console.warn('SAVED TOKEN ACCESS: ' + endpoint)
                                            if (typeof (savedToken) != 'undefined') {
                                                if (savedToken != null) {
                                                    const savedTokenJson = JSON.parse(res)
                                                    if (typeof (savedTokenJson) != 'undefined') {
                                                        if (savedToken != null) {
                                                            if (typeof (savedTokenJson.access_token) != 'undefined') {
                                                                if (savedTokenJson.access_token != null) {
                                                                    console.warn('SAVED TOKEN RETURN: ' + endpoint)
                                                                    return savedTokenJson.access_token
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }, 2500);
                                    }
                                    else {
                                        const body = {
                                            access_token: tokenJson.access_token,
                                            refresh_token: tokenJson.refresh_token,
                                            Timestamp: new Date().getTime()
                                        }
                                        const signature = await GetSignature(Endpoints.CreateToken, JSON.stringify(body), tokenJson.refresh_token)

                                        const response = await fetch(Endpoints.BaseUrl + Endpoints.CreateToken, {
                                            method: 'POST',
                                            headers: {
                                                Accept: 'application/json',
                                                'Content-Type': 'application/json',
                                                Signature: signature
                                            },
                                            body: JSON.stringify(body),
                                        })

                                        console.warn(Endpoints.CreateToken + ': ' + endpoint + '   ' + response.status)

                                        if (response.status == Success200) {
                                            const apiResponse = await response.json()
                                            if (typeof (apiResponse) != 'undefined') {
                                                if (apiResponse != null) {
                                                    await EncryptedStorage.setItem('sessionToken', JSON.stringify(apiResponse))
                                                    let today = new Date();
                                                    let date = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
                                                    let time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
                                                    let dateTime = date + 'T' + time;
                                                    await EncryptedStorage.setItem('timeWhenGotAccessToken', dateTime)

                                                    if (typeof (apiResponse.access_token) != 'undefined') {
                                                        if (apiResponse.access_token != null) {
                                                            if (apiResponse.access_token) {
                                                                return apiResponse.access_token
                                                            }
                                                        }
                                                    }
                                                    console.warn('STEP:1: ' + endpoint)
                                                    return null
                                                }
                                            }
                                        }
                                        else if (response.status == ServerError500) {
                                            const res = await EncryptedStorage.getItem('sessionToken')
                                            if (typeof (res) != 'undefined') {
                                                if (res != null) {
                                                    if (res) {
                                                        const tokenJson = JSON.parse(res)
                                                        if (typeof (tokenJson) != 'undefined') {
                                                            if (typeof (tokenJson.access_token) != 'undefined') {
                                                                if (tokenJson.access_token != null) {
                                                                    if (tokenJson.access_token) {
                                                                        return tokenJson.access_token
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }

                                                }
                                            }
                                        }
                                        else {
                                            console.warn('STEP:2: ' + endpoint)
                                            return null
                                        }

                                    }

                                } else {
                                    console.warn('STEP:94: ' + endpoint)
                                }
                            } else {
                                console.warn('STEP:95: ' + endpoint)
                            }
                        } else {
                            console.warn('STEP:96: ' + endpoint)
                        }
                    } else {
                        console.warn('STEP:97: ' + endpoint)
                    }
                } else {
                    console.warn('STEP:98: ' + endpoint)
                }
            } else {
                console.warn('STEP:99: ' + endpoint)
            }
        } else {
            console.warn('STEP:100: ' + endpoint)
        }

        //console.warn('TOKEN IS NULLLLLLLLLL')
        console.warn('STEP:3: ' + endpoint)

        return null




        let response = await axios({
            method: 'GET',
            url: `https://gateway.invia.com.au/api/access_token`,
            // timeout: 1000 * 20, // Wait for 20 seconds
            // withCredentials: true,
            headers: {
                'content-type': 'application/json', "Access-Control-Allow-Origin": "*",
                'client_id': clienId, 'client_secret': clientSecret, 'Accept': 'application/json'
            }
        })


        if (typeof (response) != 'undefined') {
            if (response != null) {
                if (typeof (response.data) != undefined) {
                    // //console.warn(response.data)
                    if (typeof (response.data.access_token) != 'undefined') {
                        if (typeof (response.data.expires_in) != 'undefined') {
                            await EncryptedStorage.setItem('accessToken', response.data.access_token)

                            var today = new Date();
                            var date = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
                            var time = today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0') + ":" + today.getSeconds().toString().padStart(2, '0');
                            var dateTime = date + 'T' + time;

                            await EncryptedStorage.setItem('timeWhenGotAccessToken', dateTime)
                            return response.data.access_token
                        }
                    }
                }
            }
        }

        return null
    } catch (error) {
        console.warn(error.toString())
        console.warn('STEP:4: ' + endpoint)
        return null
    }

}
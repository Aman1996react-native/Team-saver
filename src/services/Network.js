import NetInfo from "@react-native-community/netinfo";
import axios from 'axios'
import { BASE_URL,ERROR_MSG } from '../constants';
import base64 from 'react-native-base64';



//Main method for network calls using axios
export const Network = (method, endpoint, dataSent = {}) => {
 const username= '32jkhkh324hg324bnm354mj34bj4m'
 const password= 'Rj845klj4K45Ml45mPO9852GHhm34'
  const authHeader = 'Basic ' + base64.encode(`${username}:${password}`);
  return fetch = new Promise((resolve, reject) => {
    //cheking network connection
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        axios({
          method,
          url: `${BASE_URL}${endpoint}`,
          timeout: 1000 * 10, // Wait for 10 seconds
          dataSent,
          withCredentials: true,
          headers: { 'Authorization': authHeader,'content-type': 'application/json',"Access-Control-Allow-Origin" : "*"  }
        }).then(response => {
          // handle success error here
          console.log(response)
          resolve(response)
        }).catch(err => {
          // handle  error here
          console.log("====================error==========="+err)
          reject(err)
        });
      } else {
        // No internet error handling here
        var error = new Error(ERROR_MSG.NO_INTERNET);
        reject(error);
      }
    });
  })
}




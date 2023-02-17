import { Network } from './Network'
import { ChkNameEmail, POST, PUT, DELETE,GET } from './endPoints'
//Network will recieve 4 Arguments
// "method(type of request)",
// "endpoint ()", 
// "body (if POST method)"
// See the main function at ./network.js

export default class Apis {
  //add new geofence
  static checkEmail = (data) => {
    return Network(POST, ChkNameEmail, data)
  }

}
import Config from "react-native-config";
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { sha256 } from 'react-native-sha256';
import * as Endpoints from '../../services/endPoints'




export const GetSignature = async(endpoint,body,clientSecret) => {
    try{

        const splitted = Endpoints.BaseUrl.split('/')

        if(body == null){
            if(endpoint == Endpoints.MaintenanceStatus){
                clientSecret = ''
            }
            const sig = await sha256(`/${splitted[3]}/${endpoint}${clientSecret}`)
            // console.warn(`/${splitted[3]}/${endpoint}${clientSecret}`)
            // console.warn(endpoint+':   '+sig)
            if(typeof(sig) != 'undefined'){
                if(sig != null){
                    if(sig.length > 0){
                        return sig
                    }
                }
            }
    
            return 'No Signature Generated'
        }
        const jsonFromBody = JSON.parse(body.toLocaleLowerCase())

        sortedObject = Object.keys(jsonFromBody) 
            .sort().reduce(function(Obj, key) { 
                Obj[key] = jsonFromBody[key]; 
                return Obj; 
            }, {});


        const sig = await sha256(`/${splitted[3]}/${endpoint}${JSON.stringify(sortedObject)}${clientSecret}`)

        // console.warn(endpoint+': '+sig)
        // console.warn(`/${splitted[3]}/${endpoint}${JSON.stringify(sortedObject)}${clientSecret}`)
        
        if(typeof(sig) != 'undefined'){
            if(sig != null){
                if(sig.length > 0){
                    return sig
                }
            }
        }

        return 'No Signature Generated'

    }catch(error){
        console.warn('Error: ' + error.toString())
        return 'Error Occured'
    }
}
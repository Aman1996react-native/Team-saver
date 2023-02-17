import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';

export default SelectedColor = () => {
    try{
        var clr = ''
         EncryptedStorage.getItem('userId',(res,err) => {
             if(res){
                 alert('hi')
                 clr = '#27b0b8'
             }
         })
         setTimeout(() => {
             return clr
         }, 5000);

    }catch(error){

    }        
}

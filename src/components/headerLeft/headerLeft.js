import React, { Component } from 'react';
import { View, Text,Image } from 'react-native';
import Icons from '../../assets/icons'
import Config from "react-native-config";


export default class HeaderLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
      if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
        return (
            // <Image
            // source={Icons['CCS_BIRDS_GROUP']}
            // resizeMode='contain'
            // style={{width:100,height:50,marginBottom:-5,marginLeft:15}}
            // />
            <></>
          );

      }else{
          null
      }

    
  }
}

import React, { Component } from 'react';
import { View, Text,Image } from 'react-native';
import Icons from '../../assets/icons'
import Config from "react-native-config";
import colors from '../../utils/colors';
import HeaderLeft from './headerLeft';

export default class HeaderBackImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
        return (
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
              <Image resizeMode='contain' style={{width:40,height:20,tintColor:colors.White}} source={require('../../assets/images/back.png')} />
              <HeaderLeft />
            </View>
    
          )
    }
    return null

    
  }
}

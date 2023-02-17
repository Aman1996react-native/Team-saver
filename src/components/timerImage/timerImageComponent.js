import React, { Component } from 'react';
import { View, Text,Image } from 'react-native';

export default class TimerImageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{flexDirection:'row',alignItems:'center',marginTop:40}}>
        <Image style={{width:70,height:70}}
        // source={require('../../assets/images/bird_red.png')}
        source={require('../../assets/images/piggy_bank.png')}
        resizeMode='contain'
        />
        <Image style={{width:50,height:50,marginTop:-60}}
        source={require('../../assets/images/timer.png')}
        resizeMode='contain'
        />
      </View>
    );
  }
}

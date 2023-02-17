import React, { Component } from 'react';
import { View, Text,AppState } from 'react-native';
import fonts from '../../assets/fonts';
import colors from '../../utils/colors';
import { connect } from 'react-redux'
import { CCSActionCreator } from '../../redux/actionCreators/app/ccs';
import EncryptedStorage from 'react-native-encrypted-storage';
import UnderlineText from '../underlineText';
import { SIGNUP_5 } from '../../constants';


var interval = null


const mapStateToProps = (state) => ({
  

})

class OTPTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        timeLeft:'',
        backgroundTime:'',
        timer:0
    };
  }

  componentDidMount(){
      this.startTimer(60*10)
      AppState.addEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if(nextAppState === 'background'){
        this.setState({backgroundTime:new Date().toISOString()})
    }
    if(nextAppState === 'active'){
      let today = new Date();
      
      const difference = Math.abs(new Date(this.state.backgroundTime) - new Date(today.toISOString())) / 1000
      const secondsElapsed = Math.floor(difference / 60 * 60)
      console.warn('SECONDS: '+secondsElapsed)
      clearInterval(interval)
      this.setState({backgroundTime:''})
      try{
        const newTimer = parseInt(this.state.timer) - parseInt(secondsElapsed)
        if(typeof(newTimer) != 'undefined'){
          if(newTimer != null){
            if(newTimer > 0){
              this.startTimer(newTimer)
            }
          }
        }

      }catch(e){

      }
        
    }
  }

  componentDidUpdate(){
      if(this.state.timeLeft == '00:00'){
        clearInterval(interval)
      }
  }

  componentWillUnmount(){
    // clearInterval(interval)
    AppState.removeEventListener('change', this._handleAppStateChange);
}

   startTimer = (duration) => {
     console.warn('Hello')
    var timer = duration, minutes, seconds;
    var that = this
     interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        that.setState({timeLeft: `${minutes}:${seconds}`,timer:timer})
        
        // console.warn(timer)

        if (--timer < 0) {
            clearInterval(interval)
        }
    }, 1000);
}

  render() {
    return (
      <View style={{alignItems:'center',justifyContent:'center',margin:20}}>
          <Text style={{fontFamily:fonts.bold,fontSize:16,color:colors.BLACK}}>Time Left: </Text>
        <Text style={{fontFamily:fonts.buttonTextFont,fontSize:20,color:colors.APP_GREEN}}> {this.state.timeLeft}</Text>
        {/* {typeof (this.props.isFromLogin) == 'undefined' &&
        <UnderlineText title={SIGNUP_5.lbl_4} navigate={() => { 
          clearInterval(interval)
          this.startTimer(60*10)
          this.props.onResendOtpTapped() 
          }} />} */}
      </View>
    );
  }
}

export default connect(mapStateToProps)(OTPTimer);


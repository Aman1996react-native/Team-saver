import React, { Component } from "react";
import { 
    View,
    Text,
    Animated,
    TouchableOpacity,
    ActionSheetIOS,
    Platform,
    Easing,
    Image,
    StyleSheet
} from "react-native";
import fonts from "../../assets/fonts";
import colors from "../../utils/colors";
import {connect} from 'react-redux'
import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import { OtherAPIActionCreator } from "../../redux/actionCreators/app/otherAPIs";
import { NotificationsActionCreator } from "../../redux/actionCreators/app/notifications";
import Modal from 'react-native-modal';
import Geolocation from '@react-native-community/geolocation';
import ActionSheet from "../actionSheet/actionsheet";
import moment from "moment";
import { ConsentActionCreator } from "../../redux/actionCreators/app/consent";
import Config from "react-native-config";





const mapStateToProps =(state) => ({
    loading:state.GetNotificationsReducer.loading,
    request:state.GetNotificationsReducer.request,
    response:state.GetNotificationsReducer.response,

    timeBasedLoading:state.RequestTimeBasedConsentReducer.loading,
    timeBasedRequest:state.RequestTimeBasedConsentReducer.request,
    timeBasedResponse:state.RequestTimeBasedConsentReducer.response,

    timeLoading:state.GetTimeReducer.loading,
    timeRequest:state.GetTimeReducer.request,
    timeResponse:state.GetTimeReducer.response,
})

class NotificationBell extends Component {

    constructor(props) {
        super(props)
        this.animatedValue = new Animated.Value(0)
        this.state = {
            isVisible:false,
            lat:0,
            long:0
        }

      }

      componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
          let self = this
          setTimeout(() => {
            EncryptedStorage.getItem('userId',(res,err) => {
              if(res){
                  // self.props.dispatch(NotificationsActionCreator.getNotifications(res))
              }
          })
          }, 1000);           
          });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

      handleAnimation = () => {
        // A loop is needed for continuous animation
        Animated.loop(
          // Animation consists of a sequence of steps
          Animated.sequence([
            // start rotation in one direction (only half the time is needed)
            Animated.timing(this.animatedValue, {toValue: 1.0, duration: 150, easing: Easing.linear, useNativeDriver: true}),
            // rotate in other direction, to minimum value (= twice the duration of above)
            Animated.timing(this.animatedValue, {toValue: -1.0, duration: 300, easing: Easing.linear, useNativeDriver: true}),
            // return to begin position
            Animated.timing(this.animatedValue, {toValue: 0.0, duration: 150, easing: Easing.linear, useNativeDriver: true})
          ])
        ).start(); 
      }
    
          
        renderBell = () => {
            const res = this.props.response
            let animate = false
            if(typeof(res) != 'undefined'){
              if(typeof(res.RequestList) != 'undefined'){
                  if(res.RequestList.length > 0){
                    res.RequestList.forEach(notification => {
                      if(typeof(notification.Read) != 'undefined'){
                        if(!notification.Read){
                          animate = true
                        }
                      }
                    })
                  }
                }
              }


            if(typeof(res) != 'undefined'){
                if(typeof(res.RequestList) != 'undefined'){
                    if(res.RequestList.length > 0){
                      if(animate){
                        return(
                          <View>
                              <Animated.Image 
                              resizeMode='contain'
                              style={{
                                  width:25,height:25,marginRight:5,tintColor:colors.White,marginTop:-5,
                                  transform: [{
                                      rotate: this.animatedValue.interpolate({
                                          inputRange: [-1, 1],
                                          outputRange: ['-0.5rad', '0.5rad']
                                          })
                                      }]
                              }}
                              source={require('../../assets/images/notification_ccs.png')}/>

                          </View>
                          
                      )
                      }
                        
                    }
                }
            }
            return(
                <Image 
                resizeMode='contain'
                style={{width:25,height:25,marginRight:5,tintColor:colors.White,marginTop:-5}}
                source={require('../../assets/images/notification_ccs.png')}/>
            )
          }

          renderCount = () => {
            const res = this.props.response
            let count = 0

            if(typeof(res) != 'undefined'){
              if(typeof(res.RequestList) != 'undefined'){
                  if(res.RequestList.length > 0){
                    res.RequestList.forEach(notification => {
                      if(typeof(notification.Read) != 'undefined'){
                        if(!notification.Read){
                          count = count + 1
                        }
                      }
                    })
                  }
                }
              }
              

            if(typeof(res) != 'undefined'){
                if(typeof(res.RequestList) != 'undefined'){
                    if(res.RequestList.length > 0){
                      if(count > 0){
                        return(
                          <View style={styles.count}>
                            {count != 0 &&
                              <Text style={styles.countText}>{count}</Text>}
                          </View>
                      )
                      }
                        
                    }
                }
            }
          }

          closeActionSheet = () => {
            this.setState({isVisible:false})
          }

          setTimeConsentStatus = () => {
            EncryptedStorage.getItem('userId',(res,err) => {
              if(res){
                  this.props.dispatch(ConsentActionCreator.setTimeConsentStatus(res,true))
              }
          })
          }

          timeBasedRequest = (lat,long,duration) => {
            EncryptedStorage.getItem('userId',(res,err) => {
              if(res){
                  this.props.dispatch(ConsentActionCreator.timeBasedRequest(res,duration,lat,long))
                  this.props.navigation.navigate('Notification')

              }
          })
          }

          sowAlertSheetIos = (info) => {
            EncryptedStorage.getItem('isLocationEnabled',(res,err) => {
              if(res == 'true'){
                if(typeof(info) != 'undefined'){
                  if(typeof(info.coords) != 'undefined'){
                      let lat2 = info.coords.latitude
                      let lon2 = info.coords.longitude
                      if(Platform.OS == 'ios'){
                          ActionSheetIOS.showActionSheetWithOptions(
                              {
                                options: ['Cancel','Share for One Hour','Share Until End of Day','Share Indefinitely'],
                                cancelButtonIndex: 0
                              },
                              buttonIndex => {
                                if (buttonIndex === 0) {
                                  // cancel action
                                }
                                if (buttonIndex === 1) {
                                  let d = new Date()
                                  this.props.dispatch(ConsentActionCreator.getOrSetTime(moment(d.setHours(d.getHours() + 1)).format('hh:mm A')))
                                  this.setTimeConsentStatus()
                                  this.timeBasedRequest(lat2,lon2,1)
                                }
                                if (buttonIndex === 2) {
                                  let d = new Date()
                                  this.props.dispatch(ConsentActionCreator.getOrSetTime(moment(d.setHours(d.getHours() + 12)).format('hh:mm A')))
                                  this.setTimeConsentStatus()
                                  this.timeBasedRequest(lat2,lon2,2)
                                }
                                if (buttonIndex === 3) {
                                  this.props.dispatch(ConsentActionCreator.getOrSetTime(null))
                                  this.setTimeConsentStatus()
                                  this.timeBasedRequest(lat2,lon2,3)
                                }
                                
                              }
                            );
                        }else{
                          this.setState({isVisible:true,lat:lat2,long:lon2})
                        }
                  }else{
  
                  }
              }else{
  
              }
              }else{
                this.props.navigation.navigate('Notification')

              }
            })
            
            
          }

          error = (e) => {
            this.props.navigation.navigate('Notification')
          }

          success = () => {

          }


    render() {
        this.handleAnimation()

        const actionItems = [
            {id: 1,label: 'Share for One Hour',
              onPress: () => {
                this.setState({isVisible:false})
                let d = new Date()
                this.props.dispatch(ConsentActionCreator.getOrSetTime(moment(d.setHours(d.getHours() + 1)).format('hh:mm A')))
                this.setTimeConsentStatus()
                this.timeBasedRequest(this.state.lat,this.state.long,1)
              }
            },
            {id: 2,label: 'Share Until End of Day',
              onPress: () => {
                this.setState({isVisible:false})
                let d = new Date()
                this.props.dispatch(ConsentActionCreator.getOrSetTime(moment(d.setHours(d.getHours() + 12)).format('hh:mm A')))
                this.setTimeConsentStatus()
                this.timeBasedRequest(this.state.lat,this.state.long,2)
              }
            },
            {id: 3,label: 'Share Indefinitely',
              onPress: () => {
                this.setState({isVisible:false})
                this.setTimeConsentStatus()
                this.timeBasedRequest(this.state.lat,this.state.long,3)
              }
            }
          ];

        return (
            <View style={styles.container}>
                {Platform.OS == 'android' &&
                <Modal isVisible={this.state.isVisible}
                style={{justifyContent:'flex-end',margin:0}}>
                    <ActionSheet
                    actionItems={actionItems}
                    onCancel={this.closeActionSheet}
                    />
            </Modal>
                }
                
                {this.renderCount()}                
                <TouchableOpacity
                onPress={() => {
                  if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
                    this.props.navigation.navigate('Notification')
                    return
                  }
                  try{
                    Geolocation.getCurrentPosition(info => {
                      if(info){
                          this.sowAlertSheetIos(info)
                      }
                  })
                  }catch(e){
                   
                  }
                    
                  Geolocation.getCurrentPosition(this.success, this.error)
                    
                    EncryptedStorage.getItem('isLocationEnabled',(res,err) => {
                      if(res != 'true' ){
                        this.props.navigation.navigate('Notification')
                      }})
                    
                }}>
                    {this.renderBell()}
                </TouchableOpacity>
                
            </View>
        );
    }
}
export default connect(mapStateToProps) (NotificationBell);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    count:{
        backgroundColor:(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? colors.greenColourCode :'red',
        width:18, 
        height:18,
        borderRadius:9,
        marginLeft:10,
        justifyContent:'center',
        alignItems:'center'
    },
    countText:{
        fontFamily:fonts.heavy,
        color:colors.White,
        fontSize:9
    }
});
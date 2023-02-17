import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import React, { Component } from "react";
import { 
    View,
    Text,
    FlatList,
    Image,
    RefreshControl,
    TouchableOpacity,
    Animated,
    StyleSheet
} from "react-native";
import {connect} from 'react-redux'
import fonts from "../../../assets/fonts";
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import { NotificationsActionCreator } from "../../../redux/actionCreators/app/notifications";
import { RewardsActionCreator } from "../../../redux/actionCreators/app/rewards";
import { getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";
import NetInfo from "@react-native-community/netinfo";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { not } from "react-native-reanimated";
import Config from "react-native-config";
import { CheckAccessTokenExpiryTime } from "../../../redux/actionCreators/checkAccessTokenExpiry";




const mapStateToProps =(state) => ({
    loading:state.GetNotificationsReducer.loading,
    request:state.GetNotificationsReducer.request,
    response:state.GetNotificationsReducer.response,

    approveLoading:state.ApproveRequestedMoneyReducer.loading,
    approveRequest:state.ApproveRequestedMoneyReducer.request,
    approveResponse:state.ApproveRequestedMoneyReducer.response,

    balanceLoading:state.GetPointsBalanceReducer.loading,
    balanceRequest:state.GetPointsBalanceReducer.request,
    balanceResponse:state.GetPointsBalanceReducer.response,

    notificationSeenLoading:state.UpdateNotificationStatusReducer.loading,
    notificationSeenRequest:state.UpdateNotificationStatusReducer.request,
    notificationSeenResponse:state.UpdateNotificationStatusReducer.response,

    notificationDeleteLoading:state.DeleteNotificationsReducer.loading,
    notificationDeleteRequest:state.DeleteNotificationsReducer.request,
    notificationDeleteResponse:state.DeleteNotificationsReducer.response,

})

class NotificationsScreen extends Component {

    constructor(props){
        super(props)
        this.state = {
            item:null,
            showBottomDeleteView:false,
            showDeleteAll:true,
            reload:false,
            reload2:false,
            notificationArray:[],
            selectedArray:[]
        }
        this.refsArray = []
        this.previouslyOpenedRow = null
    }

    renderRightAction = (text, color, x, progress,item) => {
        const trans = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [x, 0],
        });
        return (
          <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
            <RectButton
              style={[styles.rightAction, { backgroundColor: color }]}
              onPress={() => {
                  this.close()
                  let noti = []
                  let ele = {
                    NotificationType:item.NotificationType,
                    RequestID:item.RequestID
                  }
                  noti.push(ele)
                  this.setState({reload2:true})
                  //alert(item.RequestID)
                   this.deleteNotifications(noti,false)
              }}>
              <Text style={styles.actionText}>{text}</Text>
            </RectButton>
          </Animated.View>
        );
      };

      renderRightActions = (progress,item) =>{
          return(
            <View
          style={{
            width: 80,
          }}>
          {this.renderRightAction('Delete', 'red', 192, progress,item)}
        </View>
          )
        
      };

      deleteNotifications = (notifications,deleteAll) => {
          EncryptedStorage.getItem('userId',async(res,err) => {
            await CheckAccessTokenExpiryTime('NotificationsPage')
              this.props.dispatch(NotificationsActionCreator.deleteNotification(res,notifications,deleteAll))
          })
      }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', async() => {
            this.setState({reload:true})
            await CheckAccessTokenExpiryTime('NotificationsPage')
            this.fetchNotifications()
          });
          
    }

    headerRightButton = () => {
        return(
            <TouchableOpacity onPress={() => {
                this.setState({showBottomDeleteView:!this.state.showBottomDeleteView,showDeleteAll:true},() =>{
                    this.props.navigation.setOptions({
                        headerRight: () => (
                            this.headerRightButton()
                        )
                      });
                })
                let array = this.state.notificationArray.slice(0)
                if(array.length > 0){
                    array.forEach(ai => {
                        ai.Selected = false
                    })
                    this.setState({notificationArray:array})
                }
            }} >
                {!this.state.showBottomDeleteView &&
                <Text style={{fontSize:16,marginRight:10,fontFamily:fonts.bold,color:colors.White}}>Edit</Text>
                }
                {this.state.showBottomDeleteView &&
                <Text style={{fontSize:16,marginRight:10,fontFamily:fonts.bold,color:colors.White}}>Cancel</Text>
                }
            </TouchableOpacity>
        )
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    fetchNotifications = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            console.log("🚀 ~ file: index.js ~ line 162 ~ NotificationsScreen ~ EncryptedStorage.getItem ~ res", res)
            if(res){
                console.log("🚀 ~ file: index.js ~ line 163 ~ NotificationsScreen ~ EncryptedStorage.getItem ~ res", res)
                this.props.dispatch(NotificationsActionCreator.getNotifications(res))
                this.props.dispatch(RewardsActionCreator.getPointsBalance(res))
            }
        })
    }

    componentDidUpdate(prevProps){
        const res = this.props.approveResponse
        const seenRes = this.props.notificationSeenResponse
        if(typeof(res) != 'undefined' && !this.props.approveLoading){
            if(Object.keys(res).length > 0){
                if(typeof(res.Status) != 'undefined'){
                    if(res.Status == 'Success'){
                        alert('Request processed')
                        this.props.dispatch(NotificationsActionCreator.resetApproveRequest())
                    }
                }
            }
        }

        const deleteRes = this.props.notificationDeleteResponse
        if(typeof(deleteRes) != 'undefined' && !this.props.approveLoading){
            if(Object.keys(deleteRes).length > 0){
                if(typeof(deleteRes.Status) != 'undefined'){
                    if(deleteRes.Status == 'Success'){
                        alert('Notification deleted successfully.')
                        this.setState({reload2:false,reload:true})
                        this.fetchNotifications()
                        this.props.dispatch(NotificationsActionCreator.resetNotificationDelete())
                    }
                }
            }
        }

        /*if(typeof(seenRes) != 'undefined' && !this.props.approveLoading){
            if(Object.keys(seenRes).length > 0){
                if(typeof(seenRes.Status) != 'undefined'){
                    if(seenRes.Status == 'Success'){
                        alert('Request processed')
                        this.props.dispatch(NotificationsActionCreator.resetApproveRequest())
                    }
                }
            }
        } */
    }

    onApproveTapped = (item) => {
        if(item != null){
            EncryptedStorage.getItem('userId',(res,err) => {
                if(res){
                    if(typeof(this.props.balanceResponse) != 'undefined'){
                        if(typeof(this.props.balanceResponse.Amount) != 'undefined'){
                            if(this.props.balanceResponse.Amount > item.Amount){
                                this.props.dispatch(NotificationsActionCreator.approveRequestedMoney(res,item.RequestID,1))
                                this.updateNotificationSeenStatus(item)
                            }else{
                                alert('No sufficient balance')
                            }
                        }
                    }
                }
            })
        }
    }

    renderPOSNotification = (item,cardType) => {
        let contactName = item.ContactName
        if(contactName == ''){
            contactName = item.Mobile
        }
        return(
            <TouchableOpacity style={!item.Read ? styles.holder : [styles.holder,{backgroundColor:colors.DASHBOARD_PAGIING_VIEW}]}>
                {cardType == 'Gift' &&
                <Text style={styles.labelText2}>{contactName} has sent you {item.MerchantName}</Text>}

                {cardType != 'Gift' &&
                <Text style={styles.labelText2}>{contactName} has sent you {item.MerchantName} Card</Text>}                
                <Text style={styles.labelText}>{contactName} has sent you a {cardType} Card from {item.MerchantName} worth ${item.Amount}. You can redeem from GIFTS section in Profile Screen.</Text>
                {!item.Read &&
                <TouchableOpacity style={styles.button}
                disabled={this.state.showBottomDeleteView}
                    onPress={() => {
                        this.updateNotificationSeenStatus(item)
                        this.props.navigation.navigate('Profile')
                    }}>
                        <Text style={[styles.labelText,{color:colors.BUTTON_TEXT_COLOUR}]}>Click to Navigate</Text>
                    </TouchableOpacity>
                }
            </TouchableOpacity>
        )
    }

    renderPointsNotification = (item,kind,val) => {
        let contactName = item.ContactName
        if(contactName == ''){
            contactName = item.Mobile
        }
        return(
            <TouchableOpacity style={!item.Read ? styles.holder : [styles.holder,{backgroundColor:colors.DASHBOARD_PAGIING_VIEW}]}>
                {kind == '' &&
                <Text style={styles.labelText2}>{contactName} sent you Money</Text>}

                {kind != '' &&
                <Text style={styles.labelText2}>{contactName} sent you Points</Text>}
                
                <Text style={styles.labelText}>{contactName} has sent you {val} {kind}. Check your {kind} balance</Text>
                {!item.Read &&
                <TouchableOpacity style={styles.button}
                disabled={this.state.showBottomDeleteView}
                    onPress={() => {
                        this.updateNotificationSeenStatus(item)
                        this.props.navigation.reset({
                            index: 0,
                            routes: [
                              {
                                name: 'Home',
                                params: { someParam: 'Param1' },
                              },
                            ],
                          })
                    }}>
                        <Text style={[styles.labelText,{color:colors.BUTTON_TEXT_COLOUR}]}>Click to Navigate</Text>
                    </TouchableOpacity>
                }
            </TouchableOpacity>
        )
    }

    updateNotificationSeenStatus = (item) => {
        EncryptedStorage.getItem('userId',async(res,err) => {
            if(res){
                await CheckAccessTokenExpiryTime('NotificationsPage')
                this.props.dispatch(NotificationsActionCreator.updateNotificationSeenStatus(res,item.RequestID,item.NotificationType))
                this.fetchNotifications()
            }
        })
    }

    updateRef = ref => {
        this._swipeableRow = ref;
      };

      close = (index) => {
        if (this.previouslyOpenedRow && this.previouslyOpenedRow !== this.refsArray[index]) {
            this.previouslyOpenedRow.close();
        }
        this.previouslyOpenedRow = this.refsArray[index]
      };

      handleSelection = (item) => {
        let array = this.state.notificationArray.slice(0)
        let selectedArray = []
        if(array.length > 0){
            array.forEach(arrayItem => {
                
                if(item.RequestID == arrayItem.RequestID){
                    arrayItem.Selected = !arrayItem.Selected
                }
                if(arrayItem.Selected){
                    selectedArray.push(arrayItem)
                }
            })

            this.setState({notificationArray:array},() => {
                
            })
            this.setState({selectedArray:selectedArray},() => {
                if(selectedArray.length < 1){
                    this.setState({showDeleteAll:true})
                }else{
                    this.setState({showDeleteAll:false})
                }
            })
        }
        
      }

    _keyExtractor = (item,index) => item.RequestID.toString()

    _renderItem = ({item,index}) => {
        if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
            if(item != null){
                // if(item.NotificationType == 5){
                    if(this.state.showBottomDeleteView){
                        return(
                            <View style={styles.mainHolder}>
                                <TouchableOpacity style={styles.selectBtnHolder}
                                onPress={() => {
                                    this.handleSelection(item)
                                }}>
                                    {!item.Selected ?
                                    <Image resizeMode='contain' style={styles.circleImage} source={require('../../../assets/images/circle.png')}/>
                                    :
                                    <Image resizeMode='contain' style={styles.circleImage} source={require('../../../assets/images/circle_filled.png')}/>
                                    }
                                    
                                </TouchableOpacity>
                                <TouchableOpacity style={!item.Read ? styles.holder : [styles.holder,{backgroundColor:colors.DASHBOARD_PAGIING_VIEW}]}
                                onPress={() => {
                                    this.updateNotificationSeenStatus(item)
                                }}
                                >
                                    <Text style={[styles.labelText2,{alignSelf:'flex-start'}]}>{item.Title}</Text>
                                    <Text style={styles.labelText}>{item.Message}</Text>
                                    <Text style={[styles.labelText,{marginBottom:5,marginTop:5}]}>{item.RequestDate}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                        
                    }
                    return(
                        <Swipeable friction={2} 
                        ref={ref => {
                            this.refsArray[index] = ref;  
                          }}
                        onSwipeableOpen={() => {
                            this.close(index)
                        }}  
                        renderRightActions={(progress) => this.renderRightActions(progress,item)}>
                            <View style={styles.mainHolder}>
    
                                <TouchableOpacity style={!item.Read ? styles.holder : [styles.holder,{backgroundColor:colors.DASHBOARD_PAGIING_VIEW}]}
                                onPress={() => {
                                    this.updateNotificationSeenStatus(item)
                                }}
                                >
                                    <Text style={[styles.labelText2,{alignSelf:'flex-start'}]}>{item.Title}</Text>
                                    <Text style={styles.labelText}>{item.Message}</Text>
                                    <Text style={[styles.labelText,{marginBottom:5,marginTop:5}]}>{item.RequestDate}</Text>
                                </TouchableOpacity>
                            </View>
                        </Swipeable>
                    )
                // }
            }
        }

        if(item != null){
            if(item.NotificationType){
                if(item.NotificationType == 5){
                    if(this.state.showBottomDeleteView){
                        return(
                            <View style={styles.mainHolder}>
                                <TouchableOpacity style={styles.selectBtnHolder}
                                onPress={() => {
                                    this.handleSelection(item)
                                }}>
                                    {!item.Selected ?
                                    <Image resizeMode='contain' style={styles.circleImage} source={require('../../../assets/images/circle.png')}/>
                                    :
                                    <Image resizeMode='contain' style={styles.circleImage} source={require('../../../assets/images/circle_filled.png')}/>
                                    }
                                    
                                </TouchableOpacity>
                                {this.renderPOSNotification(item,'Cafe')}
                            </View>
                        )
                        
                    }
                    return(
                        <Swipeable friction={2} 
                        ref={ref => {
                            this.refsArray[index] = ref;  
                          }}
                        onSwipeableOpen={() => {
                            this.close(index)
                        }}  
                        renderRightActions={(progress) => this.renderRightActions(progress,item)}>
                            {this.renderPOSNotification(item,'Cafe')}
                        </Swipeable>
                    )
                }
                if(item.NotificationType == 4){
                    if(this.state.showBottomDeleteView){
                        return(
                            <View style={styles.mainHolder}>
                                <TouchableOpacity style={styles.selectBtnHolder}
                                onPress={() => {
                                    this.handleSelection(item)
                                }}>
                                    {!item.Selected ?
                                    <Image resizeMode='contain' style={styles.circleImage} source={require('../../../assets/images/circle.png')}/>
                                    :
                                    <Image resizeMode='contain' style={styles.circleImage} source={require('../../../assets/images/circle_filled.png')}/>
                                    }
                                </TouchableOpacity>
                                {this.renderPOSNotification(item,'Gift')}
                            </View>
                        )
                        
                    }
                    return(
                        <Swipeable friction={2}  
                        ref={ref => {
                            this.refsArray[index] = ref;  
                          }}
                        onSwipeableOpen={() => {
                            this.close(index)
                        }} 
                        renderRightActions={(progress) => this.renderRightActions(progress,item)}>
                            {this.renderPOSNotification(item,'Gift')}
                        </Swipeable>
                    )
                }

                if(item.NotificationType == 3){
                    if(this.state.showBottomDeleteView){
                        return(
                            <View style={styles.mainHolder}>
                                <TouchableOpacity style={styles.selectBtnHolder}
                                onPress={() => {
                                    this.handleSelection(item)
                                }}>
                                    {!item.Selected ?
                                    <Image resizeMode='contain' style={styles.circleImage} source={require('../../../assets/images/circle.png')}/>
                                    :
                                    <Image resizeMode='contain' style={styles.circleImage} source={require('../../../assets/images/circle_filled.png')}/>
                                    }
                                </TouchableOpacity>
                                {this.renderPointsNotification(item,'Points',`${item.Points}`)}
                            </View>
                        )
                        
                    }
                    return(
                        <Swipeable friction={2}  
                        ref={ref => {
                            this.refsArray[index] = ref;  
                          }}
                        onSwipeableOpen={() => {
                            this.close(index)
                        }}
                        renderRightActions={(progress) => this.renderRightActions(progress,item)}>
                            {this.renderPointsNotification(item,'Points',`${item.Points}`)}
                        </Swipeable>
                    )
                }

                if(item.NotificationType == 2){
                    if(this.state.showBottomDeleteView){
                        return(
                            <View style={styles.mainHolder}>
                                <TouchableOpacity style={styles.selectBtnHolder}
                                onPress={() => {
                                    this.handleSelection(item)
                                }}>
                                    {!item.Selected ?
                                    <Image resizeMode='contain' style={styles.circleImage} source={require('../../../assets/images/circle.png')}/>
                                    :
                                    <Image resizeMode='contain' style={styles.circleImage} source={require('../../../assets/images/circle_filled.png')}/>
                                    }
                                </TouchableOpacity>
                                {this.renderPointsNotification(item,'',`$${item.Amount}`)}
                            </View>
                        )
                        
                    }
                    return(
                        <Swipeable friction={2}  
                        ref={ref => {
                            this.refsArray[index] = ref;  
                          }}
                        onSwipeableOpen={() => {
                            this.close(index)
                        }}
                        renderRightActions={(progress) => this.renderRightActions(progress,item)}>
                            {this.renderPointsNotification(item,'',`$${item.Amount}`)}
                        </Swipeable>
                    )
                }
                
            }
        }
        
        let contactName = item.ContactName
        if(contactName == ''){
            contactName = item.Mobile
        }
        if(item.NotificationType == 1){
            if(this.state.showBottomDeleteView){
                return(
                    <View style={styles.mainHolder}>
                        <View style={styles.mainHolder}>
                            <TouchableOpacity style={styles.selectBtnHolder}
                            onPress={() => {
                                this.handleSelection(item)
                            }}>
                                {!item.Selected ?
                                <Image resizeMode='contain' style={styles.circleImage} source={require('../../../assets/images/circle.png')}/>
                                :
                                <Image resizeMode='contain' style={styles.circleImage} source={require('../../../assets/images/circle_filled.png')}/>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={!item.Read ? styles.holder : [styles.holder,{backgroundColor:colors.DASHBOARD_PAGIING_VIEW}]}>
                            <Text style={styles.labelText2}>{contactName} requested Money</Text>
                            <Text style={[styles.labelText,{marginBottom:5}]}>
                                {contactName} requested ${Number(item.Amount).toFixed(2)} from you. On approving, you will be sending {contactName} the requested amount. 
                            </Text>
                        
                            {!item.Read &&
                            <View style={[styles.valuesHolder,{justifyContent:'center'}]}>
                                <TouchableOpacity style={styles.button}
                                onPress={() => {
                                    this.onApproveTapped(item)
                                }}>
                                    <Text style={[styles.labelText,{color:colors.BUTTON_TEXT_COLOUR}]}>Approve</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.button}
                                onPress={() => {
                                    EncryptedStorage.getItem('userId',(res,err) => {
                                        if(res){
                                            this.props.dispatch(NotificationsActionCreator.approveRequestedMoney(res,item.RequestID,0))
                                            this.updateNotificationSeenStatus(item)
                                        }
                                    })
                                }}>
                                    <Text style={[styles.labelText,{color:colors.BUTTON_TEXT_COLOUR}]}>Decline</Text>
                                </TouchableOpacity>
                            </View>
                            }
                        </View>
                    </View>
                )
                
            }
        }
        return(
            <Swipeable friction={2}
            containerStyle={!item.Read ? styles.holder : [styles.holder,{backgroundColor:colors.DASHBOARD_PAGIING_VIEW}]}
            ref={ref => {
                this.refsArray[index] = ref;  
              }}
            onSwipeableOpen={() => {
                this.close(index)
            }}   
            renderRightActions={(progress) => this.renderRightActions(progress,item)}>
                <Text style={styles.labelText2}>{contactName} requested Money</Text>
                <Text style={[styles.labelText,{marginBottom:5}]}>
                    {contactName} requested ${Number(item.Amount).toFixed(2)} from you. On approving, you will be sending {contactName} the requested amount. 
                </Text>

                {!item.Read &&
                <View style={[styles.valuesHolder,{justifyContent:'center'}]}>
                    <TouchableOpacity style={styles.button}
                    onPress={() => {
                        this.onApproveTapped(item)
                    }}>
                        <Text style={[styles.labelText,{color:colors.BUTTON_TEXT_COLOUR}]}>Approve</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button}
                    onPress={() => {
                        EncryptedStorage.getItem('userId',(res,err) => {
                            if(res){
                                this.props.dispatch(NotificationsActionCreator.approveRequestedMoney(res,item.RequestID,0))
                                this.updateNotificationSeenStatus(item)
                            }
                        })
                    }}>
                        <Text style={[styles.labelText,{color:colors.BUTTON_TEXT_COLOUR}]}>Decline</Text>
                    </TouchableOpacity>
                </View>
                }

            </Swipeable>
        )
    }

    renderNotifications = () => {
        const res = this.props.response
        if(typeof(res) != 'undefined'){
            if(typeof(res.RequestList) != 'undefined'){
                if(res.RequestList.length > 0){
                    if((this.state.reload && !this.props.loading) || this.state.reload2){
                        this.setState({reload:false,reload2:false,notificationArray:res.RequestList})
                    }

                    if(this.state.notificationArray.length > 0){
                        this.props.navigation.setOptions({
                            headerRight: () => (
                                this.headerRightButton()
                            )
                          });
                      }

                    
                    return(
                        <FlatList
                        refreshControl={
                            <RefreshControl refreshing={false}
                            tintColor='transparent'
                            onRefresh={() => {
                                this.setState({reload:true})
                                this.fetchNotifications()
                            }} />
                        }
                        style={{width:'100%'}}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.notificationArray}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        extraData={this.state.showBottomDeleteView || 
                            this.state.notificationArray || this.state.item}
                        />
                    )
                }else{
                    if(this.state.notificationArray.length > 0){
                        this.props.navigation.setOptions({
                            headerRight: () => (
                                null
                            )
                          });
                      }
                }
            }
        }
        return(
            <View style={{justifyContent:'center',flex: 1,}}>
                <Text style={[styles.labelText,{color:colors.BLACK,margin:10,fontSize:16}]}>You currently have no notifications</Text>
            </View>
        )
    }

    renderBalance = () => {
        const res = this.props.balanceResponse
        if(typeof(res) != 'undefined'){
            if(typeof(res.Amount) != 'undefined'){
                return(
                    <View style={{backgroundColor:colors.LightGray,padding:10,width:getDeviceWidth() - 30,marginRight:15,marginLeft:15,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                        <Text style={[styles.labelText,{color:colors.BLACK}]}>Available Balance</Text>
                        {res.Amount != null ?
                        <Text style={[styles.labelText,{color:colors.APP_GREEN,fontSize:24,textAlign:'center'}]}>${res.Amount.toFixed(2)}</Text>
                        :
                        <Text style={[styles.labelText,{color:colors.APP_GREEN,fontSize:24,textAlign:'center'}]}>$0.00</Text>
                        }
                    </View>
                    
                )
            }
        }
    }

    formDeleteNotificationRequest = (deleteAll,array) => {
        let arrayToDelete = []
        if(deleteAll){
            this.setState({showBottomDeleteView:false},() => {
                this.props.navigation.setOptions({
                    headerRight: () => (
                        this.headerRightButton()
                    )
                  });
            })
            this.deleteNotifications([],true)
        }else{
            arrayToDelete = array.slice(0)
        }

        let noti = []
        if(arrayToDelete.length > 0){
            arrayToDelete.forEach(notification => {
                  let ele = {
                    NotificationType:notification.NotificationType,
                    RequestID:notification.RequestID
                  }
                  noti.push(ele)
            })
            this.setState({reload2:true,showBottomDeleteView:false},() => {
                this.props.navigation.setOptions({
                    headerRight: () => (
                        this.headerRightButton()
                    )
                  });
            })
            this.deleteNotifications(noti,false)
        }
    }

    render() {
        
        return (
            <View style={styles.container}>
                <ActivityIndicatorModal 
                isVisible={this.props.loading || this.props.notificationSeenLoading || 
                this.props.approveLoading || this.props.notificationDeleteLoading}/>
                
                
               {/* <View>
                    {this.renderBalance()}
                </View> */}
                {this.renderNotifications()}

                {this.state.showBottomDeleteView && this.state.notificationArray.length > 0 &&
                <View style={{backgroundColor:colors.White,flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:10,paddingTop:10,paddingBottom:10,width:'100%',borderTopWidth:1,borderColor:colors.BLUE}}>
                    <TouchableOpacity
                    onPress={() => {
                        this.formDeleteNotificationRequest(true,[])
                    }}
                    disabled={!this.state.showDeleteAll}>
                        <Text style={this.state.showDeleteAll ? 
                        styles.deleteAllButtonActive : styles.deleteAllButtonInActive}>Delete All</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={() => {
                        let selArray = this.state.selectedArray.slice(0)
                        if(selArray.length > 0){
                            this.formDeleteNotificationRequest(false,selArray)
                        }
                    }}
                    disabled={this.state.showDeleteAll}>
                        <Text style={!this.state.showDeleteAll ? 
                        styles.deleteAllButtonActive : styles.deleteAllButtonInActive}>Delete</Text>
                    </TouchableOpacity>
                </View>
                }
            </View>
        );
    }
}
export default connect(mapStateToProps) (NotificationsScreen);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    labelText:{
        fontFamily:fonts.bold,
        fontSize:13,
        color:colors.BLACK
    },
    labelText2:{
        fontFamily:fonts.heavy,
        fontSize:14,
        color:colors.APP_GREEN,
        alignSelf:'center',
        marginBottom:10
    },
    valuesHolder:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:'100%',
        marginBottom:5
       
    },
    holder:{
        paddingLeft:5,
        paddingRight:5,
        paddingTop:10,
        paddingBottom:10,
        width:getDeviceWidth() - 30,
        margin:15,
        marginBottom:0,
        backgroundColor:colors.White,
        borderWidth:1,
        borderColor:colors.APP_GREEN,
    },
    button:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        marginLeft:5,
        marginRight:5,
        backgroundColor:colors.YELLOW,
        padding:10
    },
    actionText:{
        fontFamily:fonts.bold,
        color:colors.White,
        fontSize:16
    },
    rightAction:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginTop:15,
        marginBottom:0,
        marginLeft:-15,
    },
    deleteAllButtonActive:{
        fontSize:16,
        color:colors.APP_GREEN,
        fontFamily:fonts.bold
    },
    deleteAllButtonInActive:{
        fontSize:16,
        color:colors.APP_GREEN,
        fontFamily:fonts.bold,
        opacity:0.3
    },
    circleImage:{
        width:25,
        height:25,
        tintColor:colors.APP_GREEN
    },
    mainHolder:{
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:5
    },
    selectBtnHolder:{
        width:22,
        height:22,
        marginLeft:2,
        
    }
});
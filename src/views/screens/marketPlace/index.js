import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import React,{ Component } from 'react'
import { StyleSheet, Text, View,TouchableOpacity,FlatList } from 'react-native'
import { connect } from 'react-redux';
import fonts from '../../../assets/fonts';
import ActivityIndicatorComponent from '../../../components/activityIndicator';
import ImageComponent from '../../../components/imageComponent/imageComponent';
import DeviceRow from '../../../components/marketPlace/deviceRow';
import { MarketPlaceActionCreator } from '../../../redux/actionCreators/app/marketPlace';
import { ProfileActionCreator } from '../../../redux/actionCreators/app/profile';
import { RewardsActionCreator } from '../../../redux/actionCreators/app/rewards';
import colors from '../../../utils/colors';
import Config from "react-native-config";
import SuncorpMarketPlace from '../../../components/marketPlace/suncorpMarketPlace';

const mapStateToProps =(state) => ({
    
    loading:state.GetDevicesReducer.loading,
    request:state.GetDevicesReducer.request,
    response:state.GetDevicesReducer.response,

    accessoriesLoading:state.GetAccessoriesReducer.loading,
    accessoriesRequest:state.GetAccessoriesReducer.request,
    accessoriesResponse:state.GetAccessoriesReducer.response,

    balanceLoading:state.GetPointsBalanceReducer.loading,
    balanceRequest:state.GetPointsBalanceReducer.request,
    balanceResponse:state.GetPointsBalanceReducer.response,

    profileLoading:state.GetProfileDetailsReducer.loading,
    profileRequest:state.GetProfileDetailsReducer.request,
    profileResponse:state.GetProfileDetailsReducer.response,
  
  })

class MarketPlace extends Component {

    constructor(props){
        super(props)
        this.state = {
            isDevicesTapped:true
        }
    }
    componentDidMount(){

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
        if(Config.ENV.includes('suncorpDev') || Config.ENV.includes('suncorpProd')){
        }else{
            this.fetchInventory()
            this.fetchBalanceAndProfile()
        }
        
      });
}

componentWillUnmount() {
    this._unsubscribe();
}

    fetchInventory = () => {
        this.props.dispatch(MarketPlaceActionCreator.getDevices())
        this.props.dispatch(MarketPlaceActionCreator.getAccessories())
    }

    fetchBalanceAndProfile = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(ProfileActionCreator.getProfileDetails(res))
                this.props.dispatch(RewardsActionCreator.getPointsBalance(res))
            }
        })
    }

    renderTopView = () => {
        return(
            <View>
                {this.renderBalanceView()}
                {this.renderProfileHolder()}
            </View>
        )
    }

    renderProfileHolder = () => {
        return(
            <View style={styles.profileHolder}>
                {this.renderProfileView()}
                {this.renderTopUpButton()}
            </View>
        )
    }

    renderBalanceView = () => {
        const res = this.props.balanceResponse
        if(typeof(res) != 'undefined'){
            if(typeof(res.Amount) != 'undefined'){
                if(res.Amount != null || res.Amount != ''){
                    return(
                        <View style={styles.balanceView}>
                            <Text style={styles.dollar}>$</Text>
                            <Text style={styles.balanceText}>{Number(res.Amount).toFixed(2)}</Text>
                        </View>
                    )
                }
            }
        }
    }

    renderProfileView = () => {
        const res = this.props.profileResponse
        if(typeof(res) != 'undefined'){
            if(typeof(res.Image) != 'undefined'){
                if(res.Image != null){
                    return(
                        <ImageComponent
                        resizeMode={'cover'}
                        style={styles.image}
                        imageUrl={res.Image}
                        />
                    )
                }
            }
        }
        return(
            <View style={{alignSelf:'center',justifyContent:'center',alignItems:'center',padding:5,borderRadius:25,width:50,height:50,borderWidth:2,borderColor:colors.APP_GREEN}}>
                <Text style={[styles.name,{fontSize:16,}]}>{res.nameToDisplay}</Text>
            </View>
        )
    }

    renderTopUpButton = () => {
        return(
            <TouchableOpacity style={styles.topUpBtn}
            onPress={() => {
                this.props.navigation.navigate('TopUp')
            }}>
                <Text style={styles.topUpText}>TOP UP</Text>
            </TouchableOpacity>
        )
    }

    renderDevices = () => {
        const res = this.props.response
        if(typeof(res) != 'undefined'){
            if(res.length > 0 && this.state.isDevicesTapped){
                return(
                    <View style={styles.flatlistHolder}>
                        {this.renderFlatList(res)}
                    </View>
                )
            }
        }
        
    }

    renderAccessories = () => {
        const res = this.props.accessoriesResponse
        if(typeof(res) != 'undefined'){
            if(res.length > 0 && !this.state.isDevicesTapped){
                return(
                    <View style={styles.flatlistHolder}>
                        {this.renderFlatList(res)}
                    </View>
                )
            }
        }
    }

    _keyExtractor = (item,index) => index.toString()

    _renderItem = ({item,index}) => {
        return(
            <DeviceRow
            onItemSelected={this.onItemSelected}
            index={index}
            item={item}/>
        )
    }

    onItemSelected = (item,index) => {
        
    }

    renderFlatList = (data) => {
        return(
            <FlatList
            style={{marginBottom:160}}
            contentContainerStyle={{justifyContent:'flex-start',}}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            data={data}
            />
        )
    }

    render() {
        const res = this.props
        if(res.loading || res.balanceLoading || res.profileLoading || res.accessoriesLoading){
            return(
                <ActivityIndicatorComponent/>
            )
        }
        if(Config.ENV.includes('suncorpDev') || Config.ENV.includes('suncorpProd')){
            return (
                <View style={styles.container}>
                    {this.renderTopView()}
                    <SuncorpMarketPlace
                    navigation={this.props.navigation}/>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                {this.renderTopView()}
                <View style={styles.devicesAndAcc}>
                    <TouchableOpacity 
                    style={this.state.isDevicesTapped ? styles.devicesBtnSelected : styles.devicesBtnUnSelected}
                    onPress={() => {
                        this.setState({isDevicesTapped:true})
                    }}
                    >
                        <Text 
                        style={this.state.isDevicesTapped ? styles.deviceText : styles.deviceTextUnselected}>DEVICE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                    style={!this.state.isDevicesTapped ? styles.devicesBtnSelected : styles.devicesBtnUnSelected}
                    onPress={() => {
                        this.setState({isDevicesTapped:false})
                    }}
                    >
                        <Text 
                        style={!this.state.isDevicesTapped ? styles.deviceText : styles.deviceTextUnselected}>ACCESSORIES</Text>
                    </TouchableOpacity>
                </View>
                {this.renderDevices()}
                {this.renderAccessories()}
            </View>
        );
    }
}

export default connect(mapStateToProps)(MarketPlace);

const styles = StyleSheet.create({
    container:{
       flex:1
    },
    balanceView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:10
    },
    dollar:{
        fontFamily:fonts.bold,
        fontSize:12,
        marginBottom:10,
        marginRight:5
    },
    balanceText:{
        fontFamily:fonts.bold,
        fontSize:28
    },
    image:{
        width:50,
        height:50,
        borderRadius:25,
        overflow:'hidden',
    },
    profileHolder:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding:10
    },
    name:{
        color:colors.APP_GREEN,
        fontSize:16,
        fontFamily:fonts.bold,
        textAlign:'center'
      },
      topUpBtn:{
        padding:10,
        paddingLeft:15,
        paddingRight:15,
        backgroundColor:colors.YELLOW
      },
      topUpText:{
        fontSize:12,
        fontFamily:fonts.bold,
        textAlign:'center',
        color:colors.BUTTON_TEXT_COLOUR
      },
      devicesAndAcc:{
          flexDirection:'row',
          width:'100%',
          height:50,
          justifyContent:'space-between',
          alignItems:'center'
      },
      devicesBtnSelected:{
        backgroundColor:colors.DASHBOARD_CONTENT_VIEW,
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        width:'50%',
        height:'100%'
      },
      devicesBtnUnSelected:{
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        width:'50%',
        height:'100%'
      },
      deviceText:{
        fontSize:15,
        fontFamily:fonts.bold,
        textAlign:'center',
        color:colors.BLACK
      },
      deviceTextUnselected:{
        fontSize:15,
        fontFamily:fonts.bold,
        textAlign:'center',
        color:'gray'
      },
      flatlistHolder:{
          width:'100%',
          backgroundColor:colors.DASHBOARD_CONTENT_VIEW,
          marginBottom:10,
          paddingTop:20
      }
})

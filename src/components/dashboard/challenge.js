import React, { Component } from "react";
import { 
    View,
    Text,
    FlatList,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet
} from "react-native";

import {getDeviceWidth,getDeviceHeight} from '../../utils/index'
import ChallengeJson from '../../helpers/challenge.json'
import DashboardJson from '../../helpers/dashboard.json'
import AddToCoinStashJson from '../../helpers/addCoinToStash.json'
import Icons from '../../assets/icons/Icons'
import fonts from "../../assets/fonts";
import colors from "../../utils/colors";
import ChallengeRow from "./challengeRow";
import Config from "react-native-config";
import BalanceView from "../rewards/balanceView";
import ImageComponent from '../imageComponent/imageComponent';


class ChallengeComponent extends Component {


    _keyExtractor = (item,index) => index.toString()

    _renderItem = ({item,index}) => {
        return(
            <ChallengeRow
            isChallenge={this.props.isChallenge}
            navigation={this.props.navigation}
            isSuncorp = {Config.ENV.includes('suncorpDev') || Config.ENV.includes('suncorpProd')}
            item={item}/>
        )
        
      }

      renderBalanceView = () => {

        const isSuncorp = Config.ENV.includes('suncorpDev') || Config.ENV.includes('suncorpProd')

          if(!this.props.isChallenge || isSuncorp){

              return(
                <BalanceView
                    balance={this.props.balance}/>
              )
          }
      }

      _renderChallengeItem = ({item,index}) => {
        return(
                <TouchableOpacity style={styles.mainContainer}
                onPress={() => {
                    if(typeof(item.URL) != 'undefined'){
                        if(item.URL != null){
                            this.props.navigation.navigate('ProductSite',{
                                targetUrl:item.URL,
                                ClientID:null,
                                MemberclientTokenId:null
                            })
                        }
                    }
                    
                }}>
                    <View style={[styles.container1,{height:'100%'}]}>
                        <View>
                            <ImageComponent
                            style={styles.image1}
                            resizeMode={'cover'}
                            imageUrl={item.Image}

                            />
                        </View>
                        <View style={styles.titleBodyHolderView}>
                            <Text  style={styles.title}>{item.Title}</Text>
                            <Text  style={styles.body}>{item.Description}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
        )
      }


    render() {

        const isChallenge = this.props.isChallenge
        const isSuncorp = Config.ENV.includes('suncorpDev') || Config.ENV.includes('suncorpProd')
       

        return (
            <View style={styles.container}>
                {isChallenge && !isSuncorp &&
                <ImageBackground style={styles.backgroundImage}>
                    <Image source={require('../../assets/images/wallet.png')} style={styles.image}/>
                    <Text style={styles.challenegUnlockedtext}>You've unlocked {'\n'} {this.props.challengeResponse.length} Challenges</Text>
                </ImageBackground>
                }
                {this.renderBalanceView()}

                {isChallenge && !isSuncorp &&
                <View style={styles.flatListContainer}>
                    <Text style={styles.doYouDareText}>Do you dare?</Text>
                    <FlatList
                    style={{backgroundColor:'#ECEFF0',marginTop:10}}
                    data={this.props.challengeResponse}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderChallengeItem}
                    />
                </View>
                }
                {(!isChallenge || isSuncorp) &&
                <View style={styles.flatListContainer}>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor:'#ECEFF0'}}>

                    <View style={{}}>
                        <Text style={styles.doYouDareText}>{AddToCoinStashJson.challnege.title}</Text>
                        <Text style={styles.subText}>{AddToCoinStashJson.challnege.desc}</Text>
                        <FlatList
                        style={{backgroundColor:'#ECEFF0'}}
                        data={isSuncorp ? ChallengeJson.challengesSuncorp : AddToCoinStashJson.challnege.challenges}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        />
                    </View>
                    
                    {!isSuncorp &&
                    <View style={{marginTop:40}}>
                        <Text style={styles.doYouDareText}>{AddToCoinStashJson.partner.title}</Text>
                        <Text style={styles.subText}>{AddToCoinStashJson.partner.desc}</Text>
                        <FlatList
                        style={{backgroundColor:'#ECEFF0'}}
                        data={AddToCoinStashJson.partner.partners}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        />
                    </View>}
                    </ScrollView>

                </View>
                }

            </View>
        );
    }
}
export default ChallengeComponent;

const styles = StyleSheet.create({
    container: {
        // width:getDeviceWidth(),
        // height:getDeviceHeight(),
        flex:1,
    },
    backgroundImage:{
        justifyContent:'center',
        alignItems:'center',
        height:'30%',
        width:getDeviceWidth(),
        backgroundColor:'#E2E9EE',
        marginBottom:10,
        marginTop:-5
    },
    image:{
        width:60,
        height:60,
        marginBottom:15,
        tintColor:colors.APP_GREEN
    },

    challenegUnlockedtext:{
        fontFamily: fonts.bold,
        color:colors.APP_GREEN,
        fontSize:16,
        textAlign:'center'
    },
    doYouDareText:{
        fontFamily:fonts.bold,
        fontSize:16,
        marginLeft:8
    },
    subText:{
        fontFamily:fonts.regular,
        fontSize:14,
        marginBottom:10,
        marginLeft:8
    },

    flatListContainer:{
        flex:1,
        padding:10,
        backgroundColor:'#ECEFF0'//BACKGROUND_COLOR,
    },
    savingsView:{
        backgroundColor:colors.DASHBOARD_PAGIING_VIEW,
        height:70,
        margin:10,
        borderRadius:10,
        flexDirection:'row',
        marginTop:10
    },
    savingsView1:{
        flexDirection:'row',
        width:'60%',
        alignItems:'center',
        justifyContent:'center'
        
    },
    savingView2:{
        width:'40%',
        justifyContent:'center',
        // alignItems:'center'
    },
    savingsText:{
        fontFamily:fonts.bold,
        fontSize:18,
        marginLeft:10
    },
    dollarText:{
        fontFamily:fonts.bold,
        fontSize:22,
        textAlign:'left',
        color:colors.BLUE
    },
    descText:{
        fontFamily:fonts.bold,
        color:colors.APP_GREEN,
        fontSize:25
    },

    mainContainer: {
        paddingLeft:10,
        paddingRight:10,
        justifyContent:'flex-start',
        // alignItems:'center',
        backgroundColor: colors.White,//ROW_BACKGROUND_COLOR,
        marginBottom:10,
        borderRadius:5,
        height:100
    },
    container1: {
        flexDirection:'row',
        // padding:10,
        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor:colors.White,//ROW_BACKGROUND_COLOR,
        // marginBottom:10,
        // borderRadius:10,
        height:100
    },
    imageHolderView:{

    },
    image1:{
        width:70,
        height:70,
        borderRadius:35,
        overflow:'hidden'
    },
    titleBodyHolderView:{
        marginLeft:10,
    },
    title:{
        fontFamily:fonts.bold,
        fontSize:14
    },
    body:{
        fontFamily:fonts.regular,
        fontSize:12,
        marginRight:70,
        marginTop:5
    },
});
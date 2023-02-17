import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
} from "react-native";
import fonts from "../../../assets/fonts";
import { getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";
import * as Labels from '../../../constants'
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import ImageComponent from "../../../components/imageComponent/imageComponent";
import {connect} from 'react-redux'
import { OtherAPIActionCreator } from "../../../redux/actionCreators/app/otherAPIs";
import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import Config from "react-native-config";
import YellowButton from "../../../components/button";



const mapStateToProps =(state) => ({
    
    loading:state.GetWoolworthDetailsReducer.loading,
    request:state.GetWoolworthDetailsReducer.request,
    response:state.GetWoolworthDetailsReducer.response,

  })

class OfferPreviewPage extends Component {

    componentDidMount(){
        const self = this
        if(self.props.route.params.item.TargetURL.includes('woolworths')){
            EncryptedStorage.getItem('userId',(res,err) => {
                if(res){
                    this.props.dispatch(OtherAPIActionCreator.getWoolworthDetails(res))       
                }
            })
           
        }else{
            if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
            }else{
                setTimeout(function() { 
                    self.props.navigation.navigate('ProductSite',{
                        targetUrl:self.props.route.params.item.TargetURL,
                        ClientID:null,
                        MemberclientTokenId:null
                    })
                 }, 2000)
            }
            
        }
        
    }

    componentDidUpdate(prevProps){
        const res = this.props.response
        
        if(typeof(res) != 'undefined'){
            if(Object.keys(res).length > 0){
                if(typeof(res.ClientID) != 'undefined'){
                    if(typeof(res.MemberclientTokenId) != 'undefined' && typeof(res.UniqueID) != 'undefined'){
                        if(typeof(res.Status) != 'undefined'){
                            if(res.Status == 'Success'){
                                
                                this.props.navigation.navigate('ProductSite',{
                                    targetUrl:this.props.route.params.item.TargetURL,
                                    ClientID:res.ClientID,
                                    MemberclientTokenId:res.MemberclientTokenId,
                                    UniqueID:res.UniqueID
                                })
                                this.props.dispatch(OtherAPIActionCreator.resetWoolworthDetails())
                            }
                        }
                    }
                }
            }
        }
    }


    render() {
        const item = this.props.route.params.item
        console.warn(JSON.stringify(item))

        if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
            return(
                <View style={[styles.container,{padding:10,}]}>
                    <ScrollView>
                    <ImageComponent
                        // resizeMode={'contain'}
                        style={[styles.offerImage,{width:getDeviceWidth() - 20,height:150,borderRadius:10}]}
                        imageUrl={this.props.route.params.LogoUrl}
                        />
                        <Text style={styles.offerTitleCCS}>{item.Name}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',width:getDeviceWidth()-20,justifyContent:'space-around'}}>
                            <YellowButton
                            style={{width:'47%'}}
                            title='CASHBACK TERMS'
                            /> 
                            <YellowButton
                            style={{width:'47%'}}
                            title='OFFER TERMS'
                            />
                        </View>
                        <Text></Text>
                    </ScrollView>
                </View>
            )

        }
        return (
            <>
           
            <View style={styles.container}>
                <View style={styles.topView}>
                    <Text style={[styles.offerTitle,{fontSize:14}]}>{Labels.OFFERS.onYourWay}</Text>
                    <Text style={styles.offerTitle}>{item.Name}</Text>
                    <View style={styles.roundView}>
                        <ImageComponent
                        resizeMode={'contain'}
                        style={styles.offerImage}
                        imageUrl={this.props.route.params.LogoUrl}
                        />
                        
                    </View>
                </View>
                
                <AnimatedEllipsis numberOfDots={4}
                  minOpacity={0.5}
                  animationDelay={100}
                  style={{
                    color: colors.APP_GREEN,
                    fontSize: 80,
                    letterSpacing: -10,
                  }}
                />
                <Text style={styles.afterText}>{Labels.OFFERS.afeterYouHave}</Text>
            </View>
            </>
        );
    }
}
export default connect(mapStateToProps) (OfferPreviewPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center'
        backgroundColor:colors.BACKGROUND_COLOR
    },
    topView:{
        backgroundColor:colors.APP_GREEN,
        height:'50%',
        // width:getDeviceWidth() * 1.5,
        // borderBottomRightRadius:getDeviceWidth(),
        // borderBottomLeftRadius:getDeviceWidth(),
        width:getDeviceWidth(),
        alignItems:'center',
        paddingTop:20
    },
    offerTitle:{
        fontFamily:fonts.bold,
        color:colors.White,
        fontSize:16,
        textAlign:'center',
        // paddingLeft:100,
        // paddingRight:100,
        // paddingTop:20,
        marginBottom:10,
    },
    offerTitleCCS:{
        fontFamily:fonts.bold,
        color:colors.BLACK,
        fontSize:18,
        textAlign:'left',
        // paddingLeft:100,
        // paddingRight:100,
        // paddingTop:20,
        marginBottom:10,
        marginTop:10,
        marginLeft:10
    },
    roundView:{
        width:170,
        height:170,
        // borderRadius:85,
        backgroundColor:'transparent',//colors.White,
        // marginTop:-85,
        justifyContent:'center',
        alignItems:'center',
        shadowColor:colors.BLACK,
        shadowOffset:{width:1,height:1},
        shadowRadius:1,
        shadowOpacity:0.5,
        elevation:5
    },
    offerImage:{
        width:80,
        height:80
    },
    afterText:{
        fontFamily:fonts.medium,
        color:colors.BLACK,
        fontSize:12,
        textAlign:'center',
        marginBottom:10,
        marginTop:80,
        marginLeft:40,
        marginRight:40
        
    }

});
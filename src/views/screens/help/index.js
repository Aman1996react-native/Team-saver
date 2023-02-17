import React, { Component } from "react";
import { 
    View,
    Text,
    Linking,
    Platform,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet
} from "react-native";
import ComigSoonPage from "../gift/comingSoonPage";
import Config from "react-native-config";
import colors from "../../../utils/colors";
import Icons from "../../../assets/icons";
import fonts from "../../../assets/fonts";

const itemsArray = [
    // {name:'Call',navigation:'Call',image:Icons['CALL'],color:'#55AF92'},
    {name:'Feedback',navigation:'Feedback',image:Icons['SMS'],color:'#F39C6D'},
    {name:'Web',navigation:'',image:Icons['WEB'],color:colors.APP_GREEN},
]

import { connect } from 'react-redux';
import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import { CCSActionCreator } from "../../../redux/actionCreators/app/ccs";
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";

const mapStateToProps =(state) => ({

    loading:state.GetCallDetailsReducer.loading,
    request:state.GetCallDetailsReducer.request,
    response:state.GetCallDetailsReducer.response,

    feedbackLoading:state.GetFeedbackTitlesReducer.loading,
    feedbackRequest:state.GetFeedbackTitlesReducer.request,
    feedbackResponse:state.GetFeedbackTitlesReducer.response,
  
  })

class Help extends Component {

    constructor(props){
        super(props)
        this.state={

        }
    }

    componentDidMount(){
        this.props.dispatch(CCSActionCreator.getCallDetails())
        // this.props.dispatch(CCSActionCreator.getFeedbackTitles())
    }

    _keyExtractor = (item,index) => item.name

    _renderItems = ({item,index}) => {
        return(
            <TouchableOpacity style={styles.button}
            onPress={() => {
                if(item.name != 'Web'){
                    if(item.name == 'Call'){
                        const res = this.props.response
                        if(typeof(res) != 'undefined'){
                            if(typeof(res.Phone) != 'undefined'){
                                if(res.Phone){
                                    Linking.openURL(`tel:${res.Phone}`)
                                }
                            }
                        }
                    }else{
                        // const feedBackRes = this.props.feedbackResponse
                        // if(typeof(feedBackRes) != 'undefined'){
                        //     if(feedBackRes != null){
                        //         if(feedBackRes.length > 0){
                                    this.props.navigation.navigate(item.navigation)
                        //         }
                        //     }
                        // }
                        
                    }
                    
                }else{
                    Linking.openURL('https://www.childcaresaver.com/faqs')
                }
                
            }}>
                <View style={{width:'100%'}}>
                    <Image style={{width:70,height:70,marginBottom:10,marginTop:20,alignSelf:'center'}} resizeMode='contain' source={item.image}/>
                    <View style={[styles.textHolder,{backgroundColor:item.color}]}>
                        <Text style={styles.text}>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderHeader = () => {
        return(
            <Image
            resizeMode='contain'
            style={{width:50,height:50,alignSelf:'center',marginLeft:50,marginBottom:-25}} 
            source={require('../../../assets/images/bird_yellow.png')}/>
        )
    }

    
    render() {
        if(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')){
            return(
                <View style={styles.container}>
                    <ActivityIndicatorModal 
                    isVisible={this.props.loading}/>
                    
                    <FlatList
                    style={{backgroundColor:colors.BACKGROUND_COLOR,}}
                    data={itemsArray}
                    ListHeaderComponent={this.renderHeader}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItems}
                    />
                </View>
                
            )
        }
        return (
            <View style={styles.container}>
                <ComigSoonPage></ComigSoonPage>
            </View>
        );
    }
}

export default connect(mapStateToProps)(Help);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:30,
        backgroundColor:colors.BACKGROUND_COLOR
    
    },
    button:{
        alignSelf:'center',
        margin:25,
        backgroundColor:colors.White,
        height:150,
        width:180,
        alignItems:'center',
        borderRadius:20,
        
    },
    textHolder:{
        backgroundColor:'#000000',
        height:40,
        justifyContent:'center',
        alignItems:'center',
        marginTop:22,
        width:'100%',
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20
    },
    text:{
        fontFamily:fonts.bold,
        fontSize:22,
        color:colors.White,
        alignSelf:'center'
    }
});
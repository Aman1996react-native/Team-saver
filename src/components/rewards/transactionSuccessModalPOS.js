import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

import Modal from 'react-native-modal';
import { color } from "react-native-reanimated";
import fonts from "../../assets/fonts";
import { getDeviceWidth } from "../../utils";
import colors from "../../utils/colors";
import YellowButton from "../button";
import ImageComponent from "../imageComponent/imageComponent";


class TransactionSuccessModalPOS extends Component {

    renderContactImage = () => {
        const contact = this.props.selectedContact
        if(typeof(contact) != 'undefined'){
            if(contact != null){
                if(typeof(contact.Image) != 'undefined'){
                    if(contact.Image != null){
                        return(
                            <ImageComponent
                            resizeMode={null}
                            style={{width:35,height:35,borderRadius:15}}
                            imageUrl={contact.Image}
                            />
                            
                            )
                    }
                }
            }
        }
        if(this.props.isMe){
            if(typeof(this.props.response) != 'undefined'){
                if(typeof(this.props.response.Image) != 'undefined'){
                    if(this.props.response.Image != null){
                        return(
                            <ImageComponent
                            resizeMode={null}
                            style={{width:35,height:35,borderRadius:15}}
                            imageUrl={this.props.response.Image}
                            />
                            
                        )
                    }
                }
            }
        }
        return(
            <View>
                {!this.props.isMe ?
                <Text style={[styles.contactName,{color:colors.White,fontSize:16}]}>{contact.nameToDisplay}</Text>
                :
                <Text style={[styles.contactName,{color:colors.White,fontSize:16}]}>Me</Text>
                }
            </View>
            )
    }


    _keyExtractor = (item,index) => item.MenuID

    _renderItems = ({ item, index }) => {
        return(
            <TouchableOpacity 
            style={[styles.touchableOpacity,{width:getDeviceWidth() - 40,marginLeft:0,marginRight:0,marginBottom:3,paddingLeft:5,paddingRight:5}]}
            onPress={() => {
                
                
            }}>
                <View style={{width:'80%',flexDirection:'row',alignItems:'center'}}>
                {/*<Image style={{width:30,height:30,borderRadius:15,marginLeft:5,marginRight:5,borderColor:colors.APP_GREEN,backgroundColor:'white'}}/> */}
                    <View style={{alignItems:'flex-start',justifyContent:'center'}}>
                        <Text numberOfLines={4} style={styles.points}>{item.Title}</Text>
                        {item.Description != null &&
                        <Text numberOfLines={10} style={[styles.descriptionText,{width:getDeviceWidth()/1.5}]}>{item.Description}</Text>}
                    </View>
                </View>

                <View style={{width:'20%',paddingRight:5,alignItems:'flex-end'}}>
                    <Text style={{fontFamily:fonts.bold,color:colors.APP_GREEN,fontSize:12,}}>{item.Points.toString()} Points</Text>
                </View>
                
            </TouchableOpacity>
        )
    }

    renderMenu = () => {
        return(
            <FlatList
            style={{maxHeight:250,minHeight:100}}
            data={this.props.selectedMenu}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItems}
            />
        )
    }



    render() {
        return (
            <Modal 
            isVisible={this.props.isVisible}
            style={{ justifyContent: 'center', alignItems: 'center' }}
            backdropOpacity={0.6}
            backdropColor={'#000000'}>
                {this.props.isVisible &&
                <View style={{justifyContent:'flex-start',backgroundColor:colors.White,width:getDeviceWidth() - 30,margin:15}}>
                    <View style={styles.blueView}>
                        <Text style={styles.successText}>Transaction Successful!</Text>
                    </View>

                    <View style={{justifyContent:'flex-start',alignItems:'center',marginTop:10,width:'100%'}}>
                        <View style={styles.contactImage}>
                            {this.renderContactImage()}
                        </View>
                        {this.props.isMe ?
                            <Text style={styles.contactName}>Me</Text>
                            :
                            <Text style={styles.contactName}>{this.props.selectedContactName}</Text>
                        
                        }
                        

                        <View style={styles.cardView}>
                                <View>
                                    {this.renderMenu()}
                                </View>
                            
                            
                            
                            
                        </View>
                        {!this.props.isMe
                        ?
                        <Text style={styles.descText}>Your gift has now been delivered to {this.props.selectedContactName}, and your mWallet balance has been updated</Text>
                        :
                        <Text style={styles.descText}>Your reward has now been delivered and your mWallet balance has been updated</Text>
                        }
                        <View style={styles.btnContainer} >
                            <YellowButton title='Okay' navigate={() => {this.props.onOkayTapped()  }} />
                        </View>
                    </View>                    
                    </View> }
            
            </Modal>
        );
    }
}
export default TransactionSuccessModalPOS;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    blueView:{
        backgroundColor:colors.APP_GREEN,
        height:60,
        width:'100%',
        padding:10,
        alignItems:'center',
        justifyContent:'center'
    },
    successText:{
        fontFamily:fonts.bold,
        color:colors.White,
        fontSize:20
    },
    contactImage:{
        width:40,
        height:40,
        backgroundColor:colors.BLUE,
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center'
    },
    contactName:{
        fontFamily:fonts.bold,
        fontSize:16
    },
    cardView:{
        flexDirection:'row',
        width:getDeviceWidth() - 40,
        marginLeft:20,
        marginRight:20,
        marginBottom:20,
        marginTop:20,
        padding:5,
        backgroundColor:colors.LightGray
    },
    cardText:{
        fontFamily:fonts.bold,
        fontSize:15,
        color:colors.APP_GREEN
    },
    pointsText:{
        fontFamily:fonts.bold,
        fontSize:12,
    },
    descText:{
        fontFamily:fonts.bold,
        fontSize:18,
        color:colors.APP_GREEN,
        textAlign:'center',
        marginBottom:20
    },
    btnContainer: {
        width: getDeviceWidth() - 60,
        alignItems: "center",
        marginTop:20,
        marginBottom:10,
        marginTop:10
    },

    touchableOpacity:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:10,
        height:100,
        backgroundColor:colors.White,
        width:getDeviceWidth() - 30,
        marginLeft:15,
        marginRight:15,
        
    },
    points:{
        fontFamily:fonts.bold,
        color:colors.APP_GREEN,
        fontSize:14,
        width:'75%'
    },
    descriptionText:{
        fontFamily:fonts.medium,
        color:colors.BLACK,
        fontSize:10,
        marginTop:5,
        width:'75%'
    }
});
import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    StyleSheet
} from "react-native";

import Modal from 'react-native-modal';
import { color } from "react-native-reanimated";
import fonts from "../../assets/fonts";
import { getDeviceWidth } from "../../utils";
import colors from "../../utils/colors";
import YellowButton from "../button";
import ImageComponent from "../imageComponent/imageComponent";


class TransactionSuccessModal extends Component {

    renderContactImage = () => {
        const contact = this.props.selectedContact
        if(typeof(contact) != 'undefined' && !this.props.isMe){
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
        if(contact != null){
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
        return(
            <View>
                {!this.props.isMe ?
                <Image resizeMode='contain' style={{width:20,height:20}} source={require('../../assets/images/user.png')}/>
                :
                <Text style={[styles.contactName,{color:colors.White,fontSize:16}]}>Me</Text>
                }
            </View>
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
                        {!this.props.isTransfer &&
                        <Text style={styles.contactName}>{this.props.selectedContactName}</Text>}

                        {this.props.isTransfer &&
                        <Text style={styles.contactName}>{this.props.selectedContact.Name}</Text>}

                        {!this.props.isTransfer &&
                        <View style={styles.cardView}>
                            <View style={{width:'30%',alignItems:'flex-end'}}>
                            <ImageComponent
                            resizeMode={'contain'}
                            style={{width:70,height:70}}
                            imageUrl={this.props.item.Merchant_Image}
                            />
                            
                            </View>
                            <View style={{justifyContent:'center',paddingLeft:10,width:'70%'}}>
                                <Text style={styles.cardText}>${this.props.selectedItem.Amount} {this.props.item.Merchant_Name}</Text>
                                <Text style={styles.pointsText}>{this.props.selectedItem.Points} Points</Text>
                            </View>
                        </View>}
                        {!this.props.isMe
                        ?
                        <View style={{marginTop:10}}>
                            {!this.props.isTransfer &&
                            <Text style={styles.descText}>Your gift has now been delivered to {this.props.selectedContactName}, and your mWallet balance has been updated</Text>}
                        
                        {this.props.isTransfer &&
                            <Text style={styles.descText}>Your Points Transfer has now been processed and your mWallet balance has been updated</Text>}
                        
                        </View>
                        :
                        <Text style={styles.descText}>Your reward has now been delivered and your mWallet balance has been updated</Text>
                        }
                        <View style={styles.btnContainer} >
                            <YellowButton title='Okay' navigate={() => {this.props.onOkayTapped()  }} />
                        </View>
                    </View>                    
                </View>
                }
            
            </Modal>
        );
    }
}
export default TransactionSuccessModal;

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
        width:getDeviceWidth() - 60,
        marginLeft:30,
        marginRight:30,
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
});
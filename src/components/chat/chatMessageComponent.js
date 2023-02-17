import React, { Component } from "react";
import { 
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Keyboard,
    TextInput,
    Image,
    StyleSheet
} from "react-native";
import fonts from "../../assets/fonts";
import { getDeviceHeight, getDeviceWidth } from "../../utils";
import colors from "../../utils/colors";
import ImageComponent from "../imageComponent/imageComponent";

class ChatMessageComponent extends Component {
    constructor(props){
        super(props)
        this.state={
            moveUp:false,
            message:''
        }
    }

    _keyExtractor = (item,index) => item.ID.toString()

    _renderItem = ({item,index}) => {
        return(
            <View style={styles.holder}>
                <View>
                    {this.renderMessageView(this.props.response,item)}
                </View>
                
            </View>
            
        )
    }

    renderMessageView = (res,item) => {
        if(typeof(res) != 'undefined'){
            return(
                    <View style={item.UserType == 'Sender' ? [styles.messageHolder,{alignSelf:'flex-end',backgroundColor:colors.APP_GREEN}]
                         : styles.messageHolder}>
                             <View style={{height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:colors.BACKGROUND_COLOR}}>
                                <ImageComponent
                                resizeMode='cover'
                                imageUrl={item.Image}
                                style={[styles.image,{marginRight:5,alignSelf:'flex-end'}]}
                                />
                             </View>
                        
                        <View>
                            <Text style={item.UserType == 'Sender' ? [styles.messages,{color:colors.White}] : styles.messages}>{item.Message}</Text>
                        </View>
                        
                    </View>
                
            )
            
        }
    }

    renderReceiverImage = (res,isName) => {
        if(typeof(res.Receivers) != 'undefined'){
            if(res.Receivers != null){
                if(res.Receivers.length > 0){
                    if(isName){
                        return(
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                        {res.Receivers.map((elementInArray, index) => ( 
                            <Text style={styles.name}> {elementInArray.ReceiverName},</Text> 
                            ) 
                        )}
                        </View>
                        )
                    }
                    return(
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                    {res.Receivers.map((elementInArray, index) => ( 
                        <View>
                            {index < 3 && 
                            <View>
                                <ImageComponent
                                resizeMode='cover'
                                imageUrl={elementInArray.ReceiverImage}
                                style={[styles.image2]}
                                />
                            </View>
                            
                            }
                            
                        </View>
                         
                        ) 
                    )}
                    </View>
                    )
                }
            }
        }
    }

    renderTopView = (res) => {
        if(typeof(res) != 'undefined'){
            return(
                <View style={styles.senderReceiverHolder}>
                    <ImageComponent
                    resizeMode='cover'
                    imageUrl={res.SenderImage}
                    style={styles.image}
                    />
                    {this.renderReceiverImage(res,false)}                    
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={styles.name}>{res.SenderName},</Text>
                        {this.renderReceiverImage(res,true)}
                        
                    </View>
                    
                    
                </View>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderTopView(this.props.response)}
                <FlatList
                ref={ref => this.flatList = ref}
                onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
                data={this.props.messages}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
                />
                <View style={this.state.moveUp ? [styles.textInputAndButtoHolder,{marginBottom:getDeviceHeight()/2.5}] :
                styles.textInputAndButtoHolder}>
                    <TextInput
                    multiline={true}
                    onChangeText={(text) => {
                        this.setState({message:text})
                    }}
                    value={this.state.message}
                    textAlignVertical='center'
                    onTouchStart={() => {
                        this.setState({moveUp:true})
                    }}
                    
                    onEndEditing={() =>{
                        this.setState({moveUp:false})
                    }}
                    placeholder='Write Message'
                    style={styles.textInput}
                    />
                    <TouchableOpacity style={styles.sendButton}
                    onPress={() => {
                        Keyboard.dismiss()
                        if(this.state.message != ''){
                            this.props.onSendtapped(this.state.message)
                        }
                        this.setState({message:''},() => {
                            
                        })
                        
                    }}>
                        <Text style={styles.sendText}>Send</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        );
    }
}
export default ChatMessageComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInput:{
        alignSelf:'flex-end',
        borderWidth:1,
        borderColor:colors.APP_GREEN,
        height:40,
        width:'75%',
        fontFamily:fonts.medium,
        fontSize:12
    },
    textInputAndButtoHolder:{
        width:getDeviceWidth() - 20,
        margin:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    sendButton:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.YELLOW,
        padding:10
    },
    sendText:{
        fontFamily:fonts.medium,
        fontSize:14,
        color:colors.BUTTON_TEXT_COLOUR
    },
    image:{
        width:30,
        height:30,
        borderRadius:15,
        borderWidth:1,
        borderColor:colors.APP_GREEN
    },
    image2:{
        width:30,
        height:30,
        borderRadius:15,
        borderWidth:1,
        borderColor:colors.APP_GREEN,
        marginLeft:-10,
    },
    senderReceiverHolder:{
        width:getDeviceWidth() - 10,
        margin:5,
        alignItems:'center',
        flexDirection:'row'
    },
    name:{
        fontFamily:fonts.medium,
        fontSize:13,
        marginLeft:2
    },
    messages:{
        fontFamily:fonts.regular,
        fontSize:12,
        marginRight:50,
        marginLeft:2,
    },
    messageHolder:{
        alignItems:'center',
        flexDirection:'row',
        marginLeft:10,
        marginRight:10,
        marginBottom:5,
        backgroundColor:colors.LightGray,
        width:getDeviceWidth() / 1.5,
        flex:1
    },
    
});
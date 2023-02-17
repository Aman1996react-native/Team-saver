import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { ChatActionCreator } from "../../../redux/actionCreators/app/chat";
import ChatMessageComponent from "../../../components/chat/chatMessageComponent";
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";

const mapStateToProps =(state) => ({
    
    loading:state.GetChatReducer.loading,
    request:state.GetChatReducer.request,
    response:state.GetChatReducer.response,

    sendloading:state.SendMessageReducer.loading,
    sendRequest:state.SendMessageReducer.request,
    sendResponse:state.SendMessageReducer.response,
  
  })

class ChatMessagePage extends Component {

    constructor(props){
        super(props)
        this.state = {
            message:''
        }
    }
    componentDidMount() {
        const self = this
        this.fetchChat()
        this.interval = setInterval(() => self.fetchChat(), 3000);

    }

    componentWillUnmount() {
        clearInterval(this.interval);
        if(typeof(this.props.route.params.mobileNumber) != 'undefined'){
            this.props.route.params.onBack()
        }
        if(typeof(this.props.route.params.isFromRequestMoney) != 'undefined'){
            this.props.route.params.onBack()
        }
      }

    fetchChat = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                if(typeof(this.props.route.params.item) != 'undefined'){
                    if(this.props.route.params.item != null){
                        this.props.dispatch(ChatActionCreator.getChat(res,null,this.props.route.params.item.ChatID))
                    }
                }
                else if(typeof(this.props.route.params.isFromRequestMoney) != 'undefined'){
                    this.props.dispatch(ChatActionCreator.getChat(res,this.props.route.params.ReceiversArray,null))
                }
                else{
                    const receiver = [
                        {
                            Mobile:this.props.route.params.mobileNumber
                        }
                    ]
                    this.props.dispatch(ChatActionCreator.getChat(res,receiver,null))
                }
            }
        })
    }

    onSendtapped = (message) => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                const response = this.props.response
                if(typeof(response) != 'undefined'){
                    if(typeof(response.Receivers) != 'undefined'){
                        if(response.Receivers != null){
                            if(response.Receivers.length > 0){
                                let recArray = []
                                
                                response.Receivers.forEach(rec => {
                                    const receiver = {
                                        Mobile:rec.ReceiverMobile
                                    }
                                    recArray.push(receiver)
                                })

                                if(recArray.length > 0){
                                    this.props.dispatch(ChatActionCreator.sendChat(res,recArray,message))
                                }
                            }
                        }
                    }
                    
                }
                
            }
        })
    }

    renderChatMessageComponent = (res) => {
        if(typeof(res) != 'undefined'){
            if(typeof(res.Messages) != 'undefined'){
                if(res.Messages != null){
                    if(res.Messages.length > 0){
                        return(
                            <ChatMessageComponent
                            messages={res.Messages}
                            response={res}
                            onSendtapped={this.onSendtapped}
                            />
                        )
                    }
                }
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderChatMessageComponent(this.props.response)}
            </View>
        );
    }
}

export default connect(mapStateToProps)(ChatMessagePage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
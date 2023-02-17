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
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import ChatThreadComponent from "../../../components/chat/chatThreadComponent";

const mapStateToProps =(state) => ({
    
    loading:state.GetChatThreadReducer.loading,
    request:state.GetChatThreadReducer.request,
    response:state.GetChatThreadReducer.response,
  
  })

class ChatPage extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.fetchChatThread()
          });
    }

    fetchChatThread = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(ChatActionCreator.getChatThread(res))
            }
        })
    }

    loadChatThreadComponent = (res) => {
        if(typeof(res) != 'undefined'){
            if(typeof(res.ChatArrray) != 'undefined'){
                if(res.ChatArrray != null){
                    if(res.ChatArrray.length > 0){
                        return(
                            <ChatThreadComponent
                            chatThread={res.ChatArrray}
                            navigation={this.props.navigation}
                            dispatch={this.props.dispatch}
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
                <ActivityIndicatorModal isVisible={this.props.loading}/>
                {this.loadChatThreadComponent(this.props.response)}
            </View>
        );
    }
}
export default connect(mapStateToProps)(ChatPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
import React, { Component } from "react";
import { 
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import fonts from "../../assets/fonts";
import { ChatActionCreator } from "../../redux/actionCreators/app/chat";
import { getDeviceWidth } from "../../utils";
import colors from "../../utils/colors";
import ImageComponent from "../imageComponent/imageComponent";

class ChatThreadComponent extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    _keyExtractor = (item,index) => item.ChatID

    _renderItem = ({item,index}) => {
        
        return(
            <TouchableOpacity style={styles.holder}
            onPress = {() => {
                this.props.dispatch(ChatActionCreator.resetGetChat())
                this.props.navigation.navigate('ChatMessagePage',{item:item})
            }}>
                {this.renderThread(item)}
            </TouchableOpacity>
            
        )
    }

    renderThread = (item) => {
        
        if(typeof(item.Receivers) != 'undefined'){
            if(item.Receivers != null){
                if(item.Receivers.length > 0){
                    if(item.Receivers.length > 1){
                        return(
                            <View style={styles.holder}>
                            {item.Receivers.map((elementInArray, index) => (
                                <View> 
                                    {index < 3 &&
                                    <View>
                                        <ImageComponent
                                        resizeMode='cover'
                                        imageUrl={elementInArray.ReceiverImage}
                                        style={item.Receivers.length > 2 ? 
                                            index == 2 ? 
                                            [styles.image] :
                                            [styles.image,{marginRight:-15}]

                                            : 
                                            
                                            index == 1 ? 
                                            [styles.image] :
                                            [styles.image,{marginRight:-15}]}
                                        />
                                        
                                    </View>
                                    }
                                </View>
                            ) 
                        )}
                        {item.Receivers.map((elementInArray, index) => (
                                <View> 
                                    {index == item.Receivers.length - 1
                                    ?
                                    <Text style={[styles.name]}>{elementInArray.ReceiverName}</Text>
                                    :
                                    <Text style={[styles.name]}>{elementInArray.ReceiverName}, </Text>
                                    }
                                    
                                </View>
                            ) 
                        )}
                        </View>
                        )
                        

                    }else{
                        return(
                            <View style={styles.holder}>
                                <ImageComponent
                                resizeMode='cover'
                                imageUrl={item.Receivers[0].ReceiverImage}
                                style={styles.image}
                                />
                                <Text style={styles.name}>{item.Receivers[0].ReceiverName}</Text>
                            </View>
                        )

                    }
                }
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                data={this.props.chatThread}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
                ItemSeparatorComponent={() => {
                    return(
                        <View style={{backgroundColor:colors.LightGray,height:1,width:getDeviceWidth() - 20,marginLeft:10,marginRight:10}}/>
                    )
                }}
                />
            </View>
        );
    }
}
export default ChatThreadComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    holder:{
        flexDirection:'row',
        alignItems:'center',
        width:getDeviceWidth() - 20,
        marginLeft:10,
        marginRight:10,
        marginTop:5,
        marginBottom:5
    },
    name:{
        fontFamily:fonts.bold,
        fontSize:12
    },
    image:{
        width:30,
        height:30,
        borderRadius:15,
        marginRight:5,
        borderWidth:1,
        borderColor:colors.APP_GREEN
    }
});
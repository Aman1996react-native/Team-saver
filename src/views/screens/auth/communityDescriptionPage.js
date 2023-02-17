import React, { Component } from "react";
import { 
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableOpacity,
    TextInput,
    ImageBackground,
    StyleSheet
} from "react-native";
import fonts from "../../../assets/fonts";
import YellowButton from "../../../components/button";
import ImageComponent from "../../../components/imageComponent/imageComponent";
import { getDeviceHeight, getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";
import {connect} from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { CommunityActionCreator } from "../../../redux/actionCreators/app/community";
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import { cos } from "react-native-reanimated";


const mapStateToProps =(state) => ({
    
    loading:state.PostCommentsReducer.loading,
    request:state.PostCommentsReducer.request,
    response:state.PostCommentsReducer.response,

    joinLoading:state.JoinCommunityReducer.loading,
    joinRequest:state.JoinCommunityReducer.request,
    joinResponse:state.JoinCommunityReducer.response,
    
})


class CommunityDescriptionPage extends Component {

    constructor(props){
        super(props)
        this.state={
            comment:'',
            postCommentCalled:false
        }
    }

    componentDidUpdate(prevProps){
        const joinRes = this.props.joinResponse
        const postCommentRes = this.props.response
        if(typeof(joinRes) != 'undefined'){
            if(Object.keys(joinRes).length > 0){
                if(typeof(joinRes.Status) != 'undefined'){
                    if(joinRes.Status == 'Success'){
                        this.props.dispatch(CommunityActionCreator.joinCommunityReset())
                        this.props.navigation.navigate('Profile')
                    }else{
                        alert('Failed to join the community')
                    }
                }
            }
        }

        if(this.state.postCommentCalled){
            if(typeof(postCommentRes) != 'undefined'){
                if(Object.keys(postCommentRes).length > 0){
                    if(typeof(postCommentRes.Status) != 'undefined'){
                        if(postCommentRes.Status == 'Success'){
                            this.props.dispatch(CommunityActionCreator.resetPostComments())
                            this.setState({comment:'',postCommentCalled:false})
                        }else{
                        }
                    }
                }
            }
        }
    }

    renderImageorName = (item) => {
        if(item.Image == null){
            if(item.Name != null){
                if(item.Name != ''){
                    
                    let disName = ''
                    const splitted = item.Name.split(' ')
                    
                    if(splitted.length > 0){
                        disName += splitted[0].charAt(0)
                        if(splitted.length > 1){
                            disName += splitted[1].charAt(0)
                        }
                        if(splitted.length > 2){
                            disName += splitted[2].charAt(0)
                        }
                    }

                    return(
                        <View style={{borderWidth:1,width:50,height:50,borderRadius:25,
                        justifyContent:'center',alignItems:'center',margin:5}}>
                            <Text style={styles.commentTitle}>{disName}</Text>
                        </View>
                    )
                }
            }
        }
        return(
            <ImageComponent
            resizeMode={'cover'}
            style={styles.commentImage}
            imageUrl={item.Image}
            />
        )
    }

    renderComments = (item) => {
        if(typeof(item) != 'undefined'){
            if(typeof(item.CommentsList) != 'undefined'){
                if(item.CommentsList != null){
                    if(item.CommentsList.length > 0){
                        return(
                            <ScrollView>
                                {item.CommentsList.map((itm,index) => {
                                    return(
                                        <View style={styles.commentsHolderView}>
                                            <View>
                                                {this.renderImageorName(itm)}
                                            </View>
                                            <View>
                                                <Text style={styles.commentTitle}>{itm.Name}</Text>
                                                <Text numberOfLines={10} style={styles.commentText}>{itm.Comment}</Text>
                                            </View>
                                            
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        )
                    }
                }
                
            }
        }
    }

    onBack = () => {
        this.props.navigation.goBack()
    }


    render() {
        const item = this.props.route.params.item
        return (
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' && 'padding'} style={styles.container}>
               <ActivityIndicatorModal isVisible={this.props.loading || this.props.joinLoading}/>
               <ScrollView contentContainerStyle={{width:getDeviceWidth(),}}>
                    <View style={{padding:5,alignItems:'center',}}>
                        {this.props.route.params.isEditable &&
                            <TouchableOpacity style={{marginBottom:5,alignItems:'center',flexDirection:'row',justifyContent:'space-around',padding:5}}
                            onPress={() => {
                                this.props.navigation.navigate('CreateCommunity',{isPlusTapped:false,item:item,onBack:this.onBack})

                            }}
                            >
                                <Text style={styles.descText}>Edit</Text>
                                <Image resizeMode='contain' style={{width:22,height:22,marginTop:8,marginLeft:5,tintColor:colors.APP_GREEN}} source={require('../../../assets/images/edit_2.png')}/>
                            </TouchableOpacity>}
                        <Text style={styles.communityName}>{item.Name}</Text>
                    </View>
                    
                    <ImageBackground resizeMethod={'resize'} 
                    source={{uri:`data:image/png;base64,${item.CoverImage}`}} 
                    style={{width:'100%',overflow:'hidden',height:200,marginTop:1,
                    justifyContent:'flex-start',}}>
                        

                        
                    </ImageBackground>
                    <Text style={styles.descText}>{item.Description}</Text>
                    {(item.IsPublic && !item.Joined) &&
                    <View style={{margin:20,width:getDeviceWidth() - 10}}>
                        <YellowButton
                        title='Join Community'
                        navigate={() => {
                            EncryptedStorage.getItem('userId',(res,err) => {
                                if(res){
                                 this.props.dispatch(CommunityActionCreator.joinCommunity(res,item.CommunityID))
                                }
                            })
                        }}
                        />
                    </View>}
                    {(item.Joined) &&
                    <View style={{width:getDeviceWidth() -20,margin:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:5}}>
                        <TextInput
                        placeholder='Add comment'
                        style={{height:40,width:'80%',fontFamily:fonts.bold,borderColor:colors.APP_GREEN,borderWidth:1}}
                        onChangeText={(text) => {
                            this.setState({comment:text})
                        }}
                        returnKeyLabel='Done'
                        returnKeyType='done'
                        />
                        <TouchableOpacity style={{padding:5,marginLeft:2,backgroundColor:colors.YELLOW,alignItems:'center',justifyContent:'center'}}
                        onPress={() => {
                            if(this.state.comment != ''){
                                EncryptedStorage.getItem('userId',(res,err) => {
                                    if(res){
                                     this.props.dispatch(CommunityActionCreator.postComments(res,item.CommunityID,this.state.comment))
                                     this.setState({comment:'',postCommentCalled:true})
                                     this.props.dispatch(CommunityActionCreator.getCommunitiesByUser(res))
                                    }
                                })
                            }
                        }}
                        >
                            <Text style={{fontFamily:fonts.bold,color:colors.BUTTON_TEXT_COLOUR}}>Comment</Text>
                        </TouchableOpacity>
                    </View>}
                    
                    {this.renderComments(item)}
               </ScrollView>
               
            </KeyboardAvoidingView>
        );
    }
}
export default connect(mapStateToProps) (CommunityDescriptionPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    communityName:{
        fontFamily:fonts.heavy,
        fontSize:16,
        color:colors.BLACK,
        textAlign:'center',
    },
    descText:{
        fontFamily:fonts.bold,
        fontSize:16,
        textAlign:'center',
        marginTop:10,
        color:colors.BLACK,
        textAlign:'center'
    },
    commentsHolderView:{
        width:getDeviceWidth() - 20,
        margin:10,
        borderWidth:0.5,
        borderColor:colors.APP_GREEN,
        height:80,
        flexDirection:'row',
        alignItems:'center'
    },
    commentTitle:{
        fontFamily:fonts.bold,
        fontSize:16
    },
    commentText:{
        fontFamily:fonts.regular,
        fontSize:13,
        marginRight:80
    },
    commentImage:{
        width:50,
        height:50,
        borderRadius:25,
        borderColor:colors.APP_GREEN,
        borderWidth:1,
        margin:5
    }
});
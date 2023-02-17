import React, { Component } from "react";
import { 
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Image,
    TextInput,
    Platform,
    Switch,
    StyleSheet
} from "react-native";
import fonts from "../../../assets/fonts";
import YellowButton from "../../../components/button";
import { getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";
// import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import { timing } from "react-native-reanimated";
import { CommunityActionCreator } from "../../../redux/actionCreators/app/community";
import { connect } from 'react-redux';
import ActivityIndicatorModal from "../../../components/activityIndicator/activityIndicatorModel";
import ImageComponent from "../../../components/imageComponent/imageComponent";


const mapStateToProps =(state) => ({
    
    loading:state.CreateCommunityReducer.loading,
    request:state.CreateCommunityReducer.request,
    response:state.CreateCommunityReducer.response,

    editLoading:state.EditCommunityReducer.loading,
    editRequest:state.EditCommunityReducer.request,
    editResponse:state.EditCommunityReducer.response,
})

class CreateCommunityPage extends Component {

    constructor(props){
        super(props)
        const isPlusTapped = this.props.route.params.isPlusTapped
        const item = this.props.route.params.item

        this.state = {
            communityName:isPlusTapped ? '' : item.Name,
            communityDesc:isPlusTapped ? '' : item.Description,
            welcomeMessage:isPlusTapped ? '' : item.Message,
            isPublic:isPlusTapped ? false : item.IsPublic,
            image:null,
            createClicked:false,
            saveClicked:false

        }
    }

    componentDidUpdate(prevProps){
        const res = this.props.response
        const saveRes = this.props.editResponse
        if(!this.props.loading){
            if(this.state.createClicked){
                if(typeof(res) != 'undefined'){
                    if(typeof(res.Status) != 'undefined'){
                        if(res.Status == 'Success'){
                            this.props.navigation.goBack()
                        }
                    }
                }
            }
        }

        if(!this.props.editLoading){
            if(this.state.saveClicked){
                if(typeof(saveRes) != 'undefined'){
                    if(typeof(saveRes.Status) != 'undefined'){
                        if(saveRes.Status == 'Success'){
                            this.props.navigation.goBack()
                            this.props.route.params.onBack()
                        }
                    }
                }
            }
        }

    }

    renderCoverImage = () => {
        const route = this.props.route.params

        if(this.state.image != null){
            return(
                <Image style={styles.image}   
                resizeMode='cover'                 
                source={{uri: `data:${this.state.image.mime};base64,${this.state.image.data}`}}/>
            )
        }

        if(!route.isPlusTapped){
            if(route.item.CoverImage != null){
                return(
                <ImageComponent
                resizeMode={'cover'}
                style={styles.image}
                imageUrl={route.item.CoverImage}
                />
                )
                
            }
        }else{
            if(this.state.image != null){
                return(
                    <Image style={styles.image}   
                    resizeMode='cover'                 
                    source={{uri: `data:${this.state.image.mime};base64,${this.state.image.data}`}}/>
                )
            }
        }
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' && 'padding'} style={styles.container}>
               <ActivityIndicatorModal
                    isVisible={this.props.loading || this.props.editLoading}/>
                    {this.renderCoverImage()}
                <ScrollView>
                    {!this.props.route.params.isPlusTapped &&
                    <Text style={styles.createYourCommunityText}>Edit your Community</Text>}
                    {this.props.route.params.isPlusTapped &&
                    <Text style={styles.createYourCommunityText}>Create your Community</Text>}
                    <View style={styles.holder}>
                        <Text style={styles.giveYourCommunityANameText}>Give your community a name</Text>
                        <TextInput
                        onChangeText={(text) => {
                            this.setState({communityName:text})
                        }}
                        value={this.state.communityName}
                        multiline={true}
                        textAlignVertical='top'
                        style={styles.textInput}
                        placeholder='Add Community name'/>
                    </View>

                    <View style={styles.holder}>
                        <Text style={styles.giveYourCommunityANameText}>Describe your community</Text>
                        <TextInput
                        onChangeText={(text) => {
                            this.setState({communityDesc:text})
                        }}
                        value={this.state.communityDesc}
                        returnKeyType='done'
                        multiline={true}
                        textAlignVertical='top'
                        style={styles.textInput}
                        placeholder='Description'/>
                    </View>

                    <View style={styles.holder}>
                        <Text style={styles.giveYourCommunityANameText}>Write a welcome message</Text>
                        <TextInput
                        onChangeText={(text) => {
                            this.setState({welcomeMessage:text})
                        }}
                        value={this.state.welcomeMessage}
                        multiline={true}
                        textAlignVertical='top'
                        style={styles.textInput}
                        placeholder='Message'/>
                    </View>

                    <View style={styles.addImageHolder}>
                        <Text style={styles.createYourCommunityText}>Add/Edit a cover image</Text>
                        <TouchableOpacity
                        onPress={() => {
                            // ImagePicker.openPicker({
                            //     includeBase64:true,
                            //     cropping: true
                            //     }).then(image => {
                            //         this.setState({image:image})
                            //     });
                        }}>
                            <Image resizeMode='contain' style={{width:32,height:32,tintColor:colors.APP_GREEN}}
                            source={require('../../../assets/images/camera.png')}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.addImageHolder}>
                        <Text style={styles.createYourCommunityText}>Public Page</Text>
                        <Switch
                        value={this.state.isPublic}
                        onValueChange={(state)=>{
                            this.setState({isPublic:state})
                        }}
                        />
                    </View>
                    
                    <View style={{margin:10,justifyContent:'center',alignItems:'center',marginTop:20,marginBottom:10}}>
                        <YellowButton
                        title={this.props.route.params.isPlusTapped  ? 'Create' : 'Save'}
                        navigate={() => {
                            const state = this.state
                            if(state.communityName != '' && state.communityDesc != '' && state.welcomeMessage != ''){
                                EncryptedStorage.getItem('userId',(res,err) => {
                                    if(res){
                                        if(this.props.route.params.isPlusTapped){
                                            this.setState({createClicked:true})
                                            this.props.dispatch(CommunityActionCreator.createCommunity(res,state.communityName,
                                                state.communityDesc,state.welcomeMessage,state.image != null ? state.image.data : null,state.isPublic))
                                        }else{
                                            this.setState({saveClicked:true})
                                            this.props.dispatch(CommunityActionCreator.editCommunity(res,this.props.route.params.item.CommunityID,state.communityName,
                                                state.communityDesc,state.welcomeMessage,state.image != null ? state.image.data : this.props.route.params.item.CoverImage,state.isPublic))
                                        }
                                        
                                    }
                                })
                            }else{
                                alert('Please enter all details')
                            }
                        }}
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
export default connect(mapStateToProps)(CreateCommunityPage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    createYourCommunityText:{
        fontFamily:fonts.bold,
        fontSize:14,
        margin:10
    },
    giveYourCommunityANameText:{
        fontFamily:fonts.regular,
        fontSize:13,
    },
    holder:{
        width:getDeviceWidth() - 20,
        margin:10
    },
    textInput:{
        fontFamily:fonts.medium,
        fontSize:14,
        borderColor:colors.APP_GREEN,
        borderWidth:1,
        height:100,
        marginTop:5,
        textAlignVertical:'top'
    },
    addImageHolder:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:getDeviceWidth() - 20,
        margin:10
    },
    image:{
        width:getDeviceWidth() - 40,
        height:120,
        margin:20,
        overflow:'hidden'
    }
});
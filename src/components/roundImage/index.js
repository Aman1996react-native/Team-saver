import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import {connect} from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { ProfileActionCreator } from "../../redux/actionCreators/app/profile";
import ActivityIndicatorComponent from "../activityIndicator";
import fonts from "../../assets/fonts";
import colors from "../../utils/colors";
import ImageComponent from "../imageComponent/imageComponent";

const mapStateToProps =(state) => ({
    
    loading:state.GetProfileDetailsReducer.loading,
    request:state.GetProfileDetailsReducer.request,
    response:state.GetProfileDetailsReducer.response,
})

class RoundImage extends Component {

    constructor(props){
        super(props)

    }

     componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getProfileData()
          });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    getProfileData = () => {
        let self = this
        setTimeout(() => {
            EncryptedStorage.getItem('userId',(res,err) => {
                if(res){
                    // self.props.dispatch(ProfileActionCreator.getProfileDetails(res))
                }
            })
        }, 1000);
        
    }

    render() {
        if(this.props.loading && this.props.loading != true){
            return(
                <ActivityIndicatorComponent></ActivityIndicatorComponent>
            )
        }
        if(typeof(this.props.response) != 'undefined'){
            if(typeof(this.props.response.Image) != 'undefined'){
                if(this.props.response.Image != null){
                    if(this.props.response.Image.length > 0){
                        return(
                            <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.reset({
                                    index: 0,
                                    routes: [
                                      {
                                        name: 'Profile',
                                        params: { someParam: 'Param1' },
                                      },
                                    ],
                                  })
                            }}>
                                <ImageComponent
                                resizeMode={'cover'}
                                style={styles.image}
                                imageUrl={this.props.response.Image}
                                />
                                
                            </TouchableOpacity>
                            
                        )
                    }
                }
            }
        }
        
        if(typeof(this.props.response) != 'undefined'){
            if(this.props.response != null){
                if(typeof(this.props.response.nameToDisplay) != 'undefined'){
                    if(this.props.response.nameToDisplay != null){
                        return(
                            <TouchableOpacity
                            style={{justifyContent:'center',alignItems:'center',padding:5,borderRadius:19,width:38,height:38,borderWidth:2,borderColor:colors.White}}
                            onPress={() => {
                                this.props.navigation.reset({
                                    index: 0,
                                    routes: [
                                      {
                                        name: 'Profile',
                                        params: { someParam: 'Param1' },
                                      },
                                    ],
                                  })
                            }}>
                                {typeof(this.props.response) != 'undefined' &&
                             <Text style={[styles.name,{color:colors.White,fontSize:11}]}>{this.props.response.nameToDisplay}</Text>}
                
                            </TouchableOpacity>
                            
                        )
                    }
                }
            }
        }

        return null
        
    }
}
export default connect(mapStateToProps) (RoundImage);


const styles = StyleSheet.create({
    image: {
        height: 40,
        width: 40,
        borderRadius: 20,
      },
      name:{
        color:colors.White,
        fontSize:16,
        fontFamily:fonts.bold,
        textAlign:'center'
      }
})

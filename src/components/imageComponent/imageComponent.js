import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    
} from "react-native";
import FastImage from "react-native-fast-image";
import { color } from "react-native-reanimated";
import colors from "../../utils/colors";
import ActivityIndicatorComponent from "../activityIndicator";

class ImageComponent extends Component {

    constructor(props){
        super(props)
        this.state={
            loading:false
        }
    }


    render() {
        // console.log("this.props.Sec_Image == this.props.imageUrl",this.props.Sec_Image, this.props.imageUrl )
        if(this.state.loading){
            return(
                <ActivityIndicatorComponent/>
            )
        }
        if(typeof(this.props.imageUrl) != 'undefined'){
            if(this.props.imageUrl != null){
                if(this.props.imageUrl.includes('https://') || this.props.imageUrl.includes('http://')){
                    return (
                        <Image
                        resizeMode={this.props.resizeMode}
                        resizeMethod={this.props.resizeMethod}
                        style={this.props.style}
                        source={{uri:this.props.imageUrl,headers: {
                            Pragma: 'no-cache',
                            cache: "force-cache"
                          },}}
                          oadingIndicatorSource={{
                            uri: require('../../assets/images/newicons/coffee.png'),
                          }}
                        
                        />
                    //     <FastImage
                    //     resizeMode={this.props.resizeMode}
                    //     resizeMethod={this.props.resizeMethod}
                    //     style={this.props.style}
                    //     source={{
                    //         uri: this.props.imageUrl,
                    //         cache: FastImage.cacheControl.immutable
                    //         // cache: FastImage.cacheControl.immutable 
                    //         // cache:"web",
                    //         // headers: { Authorization: 'someAuthToken' },
                    //         // priority: FastImage.priority.high,
                    //     }}
                    //     // resizeMode={FastImage.resizeMode.contain}
                    // />
                    );
                }else{
                    return (
                        <Image
                        tintColor={this.props.Sec_Image  ? "white" : "red" }
                        resizeMethod={this.props.resizeMethod}
                        resizeMode={this.props.resizeMode}
                        style={[this.props.style]}
                        source={{uri:`data:image/jpeg;base64,${this.props.imageUrl}`, priority: FastImage.priority.high,}}
                        // source={this.props.imageUrl}
                        />
                    );
                }
            }
        }
        return(
            <Image
            source={require('../../assets/images/no_image.png')}
            resizeMode={this.props.resizeMode}
            style={this.props.style}/>
        )
        
        
    }
}
export default ImageComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
import React, { Component } from "react";
import { 
    View,
    Text,
    ImageBackground,
    StyleSheet
} from "react-native";

class ImageBackgroundComponent extends Component {
    render() {
        if(typeof(this.props.imageUrl) != 'undefined'){
            if(this.props.imageUrl != null){
                if(this.props.imageUrl.includes('https://') || this.props.imageUrl.includes('http://')){
                    return (
                        <ImageBackground
                        resizeMode={this.props.resizeMode}
                        resizeMethod={this.props.resizeMethod}
                        style={this.props.style}
                        source={{uri:this.props.imageUrl+`?${new Date()}`,headers: {
                            Pragma: 'no-cache'
                          },}}
                        >
                            {this.props.children}

                        </ImageBackground>
    
                    );
                }else{
                    return (
                        <ImageBackground
                        resizeMode={this.props.resizeMode}
                        resizeMethod={this.props.resizeMethod}
                        style={this.props.style}
                        source={{uri:`data:image/png;base64,${this.props.imageUrl}`}}
                        >
                            {this.props.children}
                        </ImageBackground>
                    );
                }
            }
        }
        return(
            <ImageBackground
            source={require('../../assets/images/no_image.png')}
            resizeMode={this.props.resizeMode}
            resizeMethod={this.props.resizeMethod}
            style={this.props.style}
            >
                    {this.props.children}
            </ImageBackground>
        )
        
        
    }
}
export default ImageBackgroundComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
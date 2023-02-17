import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import fonts from "../../../assets/fonts";

import { getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";
import ImageComponent from "../../imageComponent/imageComponent";

class BrandsRow extends Component {

    constructor(props){
        super(props)
        this.state={
            brandsArray:this.props.brands,
            item:this.props.item
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.leftView}>
                    <ImageComponent
                    resizeMode={'contain'}
                    style={styles.image}
                    imageUrl={this.props.item.image}
                    />
                    <Text style={styles.text}>{this.props.item.name}</Text>
                </View>
                <View style={[styles.leftView,{justifyContent:'flex-end',padding:5}]}>
                    <TouchableOpacity style={styles.touchableOpacity}
                    onPress={() => {
                        
                        const val = this.props.item.Selected == 'true' ? 'false' : 'true'
                        this.props.onAddTapped(this.props.item,val)
                        

                    }}>
                        {this.props.item.Selected == 'true'
                        ?
                        <Image
                        source={require('../../../assets/images/circular_close_ccs.png')}
                        style={{width:32,height:32}}
                        resizeMode="contain"
                        />                        
                        :
                        <Image
                        source={require('../../../assets/images/green_plus_icon.png')}
                        style={{width:28,height:28}}
                        resizeMode="contain"
                        />
                        }
                        
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
export default BrandsRow;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        width:getDeviceWidth() - 20,
        marginBottom:5,
        height:50,
        borderColor:colors.APP_GREEN,
        borderBottomWidth:1,
        
    },
    leftView:{
        width:(getDeviceWidth() - 20)/2,
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:10
    },
    rightView:{
        
    },
    image:{
        width:40,
        height:40,
        borderRadius:20,
        marginRight:5
    },
    text:{
        fontSize:10,
        marginLeft:5,
        fontFamily:fonts.bold
    },
    touchableOpacity:{
        // borderWidth:2,
        // borderColor:colors.APP_GREEN,
        padding:2,
        justifyContent:'center',
        alignItems:'center',
        // height:30,
        // width:60
    }
});
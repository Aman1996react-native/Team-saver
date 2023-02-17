import React, { Component } from "react";
import { 
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from "react-native";
import fonts from "../../assets/fonts";
import { getDeviceWidth } from "../../utils";
import colors from "../../utils/colors";
import ImageComponent from "../imageComponent/imageComponent";

class DeviceRow extends Component {

    renderImage = (item) => {
        if(typeof(item.Image) != 'undefined'){
            if(item.Image != null){
                return(
                    <View style={styles.imageHolder}>
                        <ImageComponent
                        resizeMode={'cover'}
                        style={styles.image}
                        imageUrl={item.Image}
                        />
                    </View>
                )
            }
        }
    }

    renderDetails = (item) => {
        return(
            <View style={{width:'70%'}}>
                {this.renderManuFacturer(item)}
                {this.renderModel(item)}
                {this.renderPrice(item)}

            </View>
        )
    }

    renderManuFacturer = (item) => {
        if(typeof(item.Manufacturer) != 'undefined'){
            if(item.Manufacturer != null){
                return(
                    <Text style={styles.manufacturer}>{item.Manufacturer}</Text>
                )
            }
        }
    }

    renderModel = (item) => {
        if(typeof(item.Model) != 'undefined'){
            if(item.Model != null){
                return(
                    <Text numberOfLines={10} style={styles.model}>{item.Model}</Text>
                )
            }
        }
    }

    renderPrice = (item) => {
        if(typeof(item.Price_IncGST) != 'undefined'){
            if(item.Price_IncGST != null){
                return(
                    <Text style={styles.price}>${item.Price_IncGST}</Text>
                )
            }
        }
    }


    render() {
        return (
            <TouchableOpacity style={styles.container}
            onItemSelected={() => {
                const props = this.props
                props.onItemSelected(props.item,props.index)
            }}>
            
                {this.renderDetails(this.props.item)}
                {this.renderImage(this.props.item)}
                
            </TouchableOpacity>
        );
    }
}
export default DeviceRow;

const styles = StyleSheet.create({
    container: {
        height:120,
        width:getDeviceWidth() - 30,
        marginLeft:15,
        marginRight:15,
        marginBottom:10,
        backgroundColor:colors.White,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:10
    },
    image:{
        width:70,
        height:100,
    },
    imageHolder:{
        justifyContent:'center',
        alignItems:'center',

    },
    manufacturer:{
        fontFamily:fonts.bold,
        fontSize:16,
    },
    model:{
        fontFamily:fonts.regular,
        fontSize:12,
        marginRight:0,
    },
    price:{
        fontFamily:fonts.bold,
        fontSize:14,
        color:colors.APP_GREEN,
        marginTop:10
    }
});
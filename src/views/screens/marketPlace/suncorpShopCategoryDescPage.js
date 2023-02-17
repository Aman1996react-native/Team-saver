import React, { Component } from "react";
import { 
    View,
    Text,
    FlatList,
    Image,
    StyleSheet
} from "react-native";
import fonts from "../../../assets/fonts";
import { getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";
import Icons from "../../../assets/icons";


class SuncorpShopCategoryDescPage extends Component {

    constructor(props){
        super(props)
    }

    _keyExtractor = (item,index) => item.id.toString()

    _renderItem = ({item,index}) => {
        return(
            <View style={styles.rowHolder}>
                <View style={{width:'90%',flexDirection:'row',alignItems:'center',padding:5}}>
                    <Image 
                    style={{width:25,height:25,tintColor:colors.APP_GREEN,marginRight:5}}
                    source={Icons[item.icon]}/>
                    <Text style={styles.desc}>{item.desc}</Text>
                </View>
                <View style={{width:'10%'}}>
                    <Image style={{width:15,height:15,tintColor:colors.APP_GREEN}} resizeMode='contain' source={require('../../../assets/images/down_arrow.png')}/>
                </View>
                
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.name}>{this.props.route.params.item.name}</Text>
                <FlatList
                data={this.props.route.params.item.catList}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
                />
            </View>
        );
    }
}
export default SuncorpShopCategoryDescPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:colors.DASHBOARD_CONTENT_VIEW
    },
    rowHolder:{
        width:getDeviceWidth() - 10,
        marginLeft:5,
        marginRight:5,
        marginBottom:2,
        height:70,
        backgroundColor:colors.White,
        flexDirection:'row',
        alignItems:'center'
    },
    desc:{
        fontFamily:fonts.medium,
        color:colors.APP_GREEN,
        fontSize:14,
        marginRight:30
    },
    name:{
        fontFamily:fonts.bold,
        color:colors.BLACK,
        fontSize:25,
        margin:20
    }
    
});
import React, { Component } from "react";
import { 
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import fonts from "../../../assets/fonts";
import { getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";
import Icons from "../../../assets/icons";
import SuncorpShop from '../../../helpers/suncorpShop.json'


class SuncorpShopCatListPage extends Component {

    constructor(props){
        super(props)
    }

    _keyExtractor = (item,index) => item.id.toString()

    _renderItem = ({item,index}) => {
        return(
            <TouchableOpacity style={styles.touchableOpacity}
            onPress={() => {
                this.props.navigation.navigate('SuncorpShopCatDesc',{item:item})
            }}>
                <Image
                style={styles.image}
                source={Icons[item.icon]}
                resizeMode='contain'
                />
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                data={SuncorpShop.categories}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
                />
            </View>
        );
    }
}
export default SuncorpShopCatListPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:colors.BACKGROUND_COLOR,
        paddingTop:20
    },
    touchableOpacity:{
        width:getDeviceWidth() - 20,
        height:getDeviceWidth()/1.5,
        marginLeft:10,
        marginRight:10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'transparent',
    },
    image:{
        width:'100%',
        height:'100%'
    }
});
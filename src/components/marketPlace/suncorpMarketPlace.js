import React, { Component } from "react";
import { 
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import colors from "../../utils/colors";
import Icons from "../../assets/icons";
import { getDeviceWidth } from "../../utils";
import SuncorpShop from '../../helpers/suncorpShop.json'


const shopList = [
    {id:1,icon:Icons['SHOP1']},{id:2,icon:Icons['SHOP2']},{id:3,icon:Icons['SHOP3']},
    {id:4,icon:Icons['SHOP4']},{id:5,icon:Icons['SHOP5']},{id:6,icon:Icons['SHOP6']},
    {id:7,icon:Icons['SHOP7']},{id:8,icon:Icons['SHOP8']}
]

class SuncorpMarketPlace extends Component {

    constructor(props){
        super(props)
    }
    componentDidMount(){

    }

    _keyExtractor = (item,index) => item.id.toString()

    _renderItem = ({item,index}) => {
        return(
            <TouchableOpacity style={styles.touchableOpacity}
            onPress={() => {
                this.props.navigation.navigate('SuncorpShopCatList',{item:item})
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
                numColumns={2}
                data={SuncorpShop.logos}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
                />
            </View>
        );
    }
}
export default SuncorpMarketPlace;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchableOpacity:{
        width:(getDeviceWidth() - 40)/2,
        height:85,
        margin:10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:colors.White,
        borderRadius:10
    },
    image:{
        width:'60%',
        height:'50%'
    }
});
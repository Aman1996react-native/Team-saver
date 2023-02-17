import React, { Component } from "react";
import { 
    View,
    Text,

    TouchableOpacity,
    Image,
    StyleSheet
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import fonts from "../../assets/fonts";
import colors from "../../utils/colors";
import { heightToDp, widthToDp, getDeviceWidth } from '../../utils';
import ImageComponent from "../imageComponent/imageComponent";

class OfferRow2 extends Component {
    render() {
        const item = this.props.item
        const index = this.props.index
        return (
            <TouchableOpacity style={styles.touchableOpacity}
                onPress={() => {
                    this.props.onOfferTapped(item,index)
                }}
            > 
                    
                    <View
                    style={{ width:'100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', }}>
                        <View style={{ marginRight: 20, marginLeft: 20,justifyContent:'center',alignItems:'center'}}>
                            <ImageComponent
                            resizeMode={'contain'}
                            style={{ width: 60, height: 60 }}
                            imageUrl={item.Merchant_Image}
                            />
                        </View>
                        <View style={{ height: '100%', justifyContent: 'center',alignItems:'center' }}>
                            <Text minimumFontScale={0.9} allowFontScaling={true} numberOfLines={2} style={styles.titleText}>{item.Merchant_Name}</Text>
                        </View>
                    </View>
                
            </TouchableOpacity>
        );
    }
}
export default OfferRow2;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
        fontSize: 16,
        // color: colors.White,
        fontFamily: fonts.medium,
        marginRight: 110,
        textAlign:'left',
        marginBottom:5,
        
    },
    descriptionText: {
        fontSize: 12,
        fontFamily: fonts.medium,
        marginRight: 120
    },
    text: {
        fontSize: 16,
        fontFamily: fonts.medium,
    },
    touchableOpacity:{ 
        backgroundColor: colors.White, 
        height: 80, 
        marginLeft: 20, 
        marginRight: 20, 
        marginBottom: 5, 
        marginTop: 5, 
        width:getDeviceWidth() - 40,
        // borderRadius: 5, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth:0.3,
        borderColor:colors.APP_GREEN
        // shadowColor:colors.BLACK,
        // shadowOffset:{width:2,height:2},
        // shadowRadius:2,
        // shadowOpacity:0.5,
        // elevation:5
    }
});
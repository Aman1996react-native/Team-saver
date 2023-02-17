import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import YellowButton from "../../../components/button";
import { getDeviceHeight, getDeviceWidth } from "../../../utils";

class InvoicePage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image
                resizeMode='contain'
                style={styles.image}
                source={require('import colors from "../../../assets/images/newicons/invoice.png')}
                />
                <View style={{justifyContent:'center',alignItems:'center',width:getDeviceWidth()}}>
                    <YellowButton
                    title='Redeem'
                    navigate={() => {
                        //this.props.navigation.navigate('RewardDetails',{item:{RewardID:'R05'},isGiftCard:true,isFoodAndWine:false})
                        this.props.navigation.navigate('Gifts')
                    }}
                    />
                </View>

                

            </View>
        );
    }
}
export default InvoicePage;

const styles = StyleSheet.create({
    container: {
        justifyContent:'flex-start',
        flex:1
    },
    image:{
        width:getDeviceWidth() - 20,
        margin:10,
        height:'85%'
    }
});
import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    StyleSheet
} from "react-native";
import fonts from "../../assets/fonts";
import { getDeviceWidth } from "../../utils";
import colors from "../../utils/colors";
import Colors from "../../utils/colors";
import Config from "react-native-config";
import AppHeader from "../AppHeader";
const greenColourCode = '#55AF92'


class BalanceView extends Component {

    constructor(props){
        super(props)
    }

    componentDidMount() {
        // this.props.navigation.setOptions({
        //     headerShown:false,
            
        //   });
    }

    render() {
        
        return (
            <>
            {/* <AppHeader rightHeaderHide = {true}/> */}
            <View style={styles.balanceView}>
                {/* <View style={styles.balanceHolderView}> */}
                <Image style={
                        (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ?
                        {height:120,width:80,overflow : 'visible', position : 'absolute', left : 40, bottom : 10}
                        :

                        {height:35,width:35,tintColor:colors.APP_GREEN}
                    } 
                    resizeMode='contain' 
                    
                    source={(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 
                    require('../../assets/images/coins_cart.png')
                    : require('../../assets/images/coin_pile.png')}/>
                    <Text style={[styles.balanceText, {opacity : 0}]}>Cashback</Text>
                 
                    {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ?
                    <Text style={[styles.balanceText, {}]}>Cashback</Text>
                    :
                    <Text style={styles.balanceText}>Balance:</Text>
                    }
                    
                {/* </View> */}

                {/* <View style={styles.balanceHolderView}> */}
                    {this.props.balance.Balance == null
                    ?
                    <Text style={[styles.balanceText,{color:Colors.APP_GREEN,fontFamily:fonts.heavy,fontSize:22}]}>$0</Text>
                    :
                    <View style = {{justifyContent : 'flex-start'}}>
                        {(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ?
                        <Text style={[styles.balanceText,{color:Colors.WHITE,fontFamily:fonts.buttonTextFont,fontSize:18, marginHorizontal : 20, marginLeft : 50}]}>${this.props.balance.Balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                        :
                        <Text style={[styles.balanceText,{color:Colors.APP_GREEN,fontFamily:fonts.heavy,fontSize:22, marginLeft : 20}]}>{this.props.balance.Balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                    }
                    </View>                    
                    }
                {/* </View> */}
            </View>
            </>
        );
    }
}
export default BalanceView;

const styles = StyleSheet.create({
    balanceView:{
       
        backgroundColor: (Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? colors.G8Blue : Colors.LightGray,
        height:70,
        margin:(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 0 : 10,
        marginTop:(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 0 : 10,
        marginBottom:(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 10 : 0,
        width:(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? getDeviceWidth() : getDeviceWidth() - 20,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? 'space-between' : 'center'
    },
    balanceHolderView:{
        flexDirection:'row',
        width:(getDeviceWidth() - 20) / 2,
        height:'100%',
        alignItems:'center',
        justifyContent:'center',
    },
    balanceText:{
        fontFamily:(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? fonts.buttonTextFont :fonts.bold,
        fontSize:18,
        marginLeft:20,
        color:(Config.ENV.includes('ccsDev') || Config.ENV.includes('ccsProd')) ? colors.White : colors.BLACK,
      
    },
});
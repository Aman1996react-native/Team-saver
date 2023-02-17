import React, { Component } from "react";
import { 
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import Icons from '../../assets/icons/Icons'
import colors from "../../utils/colors";
import fonts from "../../assets/fonts";

class ChallengeRow extends Component {
    render() {
        const item = this.props.item
        return (
            <TouchableOpacity style={styles.mainContainer}
            onPress={() => {
                if(this.props.isSuncorp){
                    if(item.body.includes('refer a friend')){
                        
                        this.props.navigation.navigate('AddSecondaryUsers')
                    }
                }
            }}>
                {(!this.props.isChallenge || this.props.isSuncorp) &&
                <View style={styles.participantsView}>
                    <Image style={{width:18,height:18,marginRight:5}} source={require('../../assets/images/participants.png')}/>
                    <Text style={styles.participantsText}>{item.participants} participants</Text>
                </View>
                }
                <View style={(this.props.isChallenge && !this.props.isSuncorp) ? [styles.container,{height:120}] : styles.container}>
                    <View>
                        <Image style={styles.image} source={Icons[item.image]}/>
                    </View>
                    <View style={styles.titleBodyHolderView}>
                        <Text  style={styles.title}>{item.title}</Text>
                        <Text  style={styles.body}>{item.body}</Text>
                    </View>
                </View>
            </TouchableOpacity>
           
        );
    }
}
export default ChallengeRow;

const styles = StyleSheet.create({
    mainContainer: {
        paddingLeft:10,
        paddingRight:10,
        justifyContent:'flex-start',
        // alignItems:'center',
        backgroundColor: colors.White,//ROW_BACKGROUND_COLOR,
        marginBottom:10,
        borderRadius:5,
        height:125
    },
    container: {
        flexDirection:'row',
        // padding:10,
        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor:colors.White,//ROW_BACKGROUND_COLOR,
        // marginBottom:10,
        // borderRadius:10,
        height:100
    },
    imageHolderView:{

    },
    image:{
        width:70,
        height:70,
        borderRadius:35,
        overflow:'hidden'
    },
    titleBodyHolderView:{
        marginLeft:10,
    },
    title:{
        fontFamily:fonts.bold,
        fontSize:14
    },
    body:{
        fontFamily:fonts.regular,
        fontSize:11,
        marginRight:70,
    },
    participantsView:{
        height:25,
        backgroundColor:colors.APP_GREEN,
        alignSelf:'flex-end',
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        marginRight:-10,
        padding:5,
        borderBottomLeftRadius:8,
    },
    participantsText:{
        color:colors.WHITE,
        fontSize:10,
        fontFamily:fonts.medium
    }
});
import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from "react-native";
import fonts from "../../../assets/fonts";
import ImageComponent from "../../../components/imageComponent/imageComponent";
import { getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";

const activityArray = [
    {id:'1',name:'Zara',dateAndTime:'12 January 2021',totalPaid:'206.39',image:'ZARA'},
    {id:'2',name:'JB',dateAndTime:'14 January 2021',totalPaid:'143.55',image:'JB'},
    {id:'3',name:'Gormon',dateAndTime:'20 January 2021',totalPaid:'243.43',image:'GORMON'},
    {id:'4',name:'Zara',dateAndTime:'2 February 2021',totalPaid:'304.12',image:'ZARA'},
    {id:'5',name:'JB',dateAndTime:'3 February 2021',totalPaid:'100.55',image:'JB'},
    {id:'6',name:'Gormon',dateAndTime:'4 February 2021',totalPaid:'543.43',image:'GORMON'},
    {id:'7',name:'JB',dateAndTime:'6 February 2021',totalPaid:'90.55',image:'JB'},
    
]

class ReceiptMerchantPage extends Component {

    renderName = (item) => {
        return(
            <View style={styles.nameHolder}>
                <Text style={styles.nameText}>{item.name}</Text>
            </View>
        )
    }

    renderSocialMediaLinks = (item) => {
        return (
            <View style={styles.socialMediaiconsHolder}>
                <Text style={styles.yourActivity}>Connect with {item.name}</Text>
                <TouchableOpacity>
                    <Image
                    resizeMode='center'
                    style={styles.socialMediaicons}
                    source={require('../../../assets/images/newicons/facebook.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                    resizeMode='center'
                    style={styles.socialMediaicons}
                    source={require('../../../assets/images/newicons/instagram.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image
                    resizeMode='center'
                    style={styles.socialMediaicons}
                    source={require('../../../assets/images/newicons/twitter.png')}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    renderActivity = () => {
        return(
            <ScrollView>
                {activityArray.map((item,index) => {
                    return(
                        <TouchableOpacity style={styles.activityHolder}
                        onPress={() => {
                            this.props.navigation.navigate('Invoice')
                        }}>
                            <Text style={styles.yourActivity}>{item.dateAndTime}</Text>
                            <Text style={styles.yourActivity}>${item.totalPaid}</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        )
    }


    render() {
        const item = this.props.route.params.item
        return (
            <View style={styles.container}>
                <ScrollView>
                    <ImageComponent
                    resizeMode={'stretch'}
                    style={{width:getDeviceWidth() - 30,height:200,margin:15}}
                    imageUrl={item.image}
                    />
                    {this.renderName(item)}
                    {this.renderSocialMediaLinks(item)}

                    <Text style={[styles.yourActivity,{margin:10}]}>Your Activity</Text>
                    

                    {this.renderActivity()}

                </ScrollView>
                
            </View>
        );
    }
}
export default ReceiptMerchantPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    nameHolder:{
        width:getDeviceWidth() - 30,
        margin:15,
        height:50,
        borderWidth:1,
        borderColor:colors.APP_GREEN,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.White
    },
    nameText:{
        fontFamily:fonts.bold,
        fontSize:14
    },
    yourActivity:{
        fontFamily:fonts.bold,
        fontSize:12,
    },
    activityHolder:{
        width:getDeviceWidth() - 30,
        margin:15,
        marginBottom:5,
        marginTop:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderBottomColor:colors.APP_GREEN,
        height:30
    },
    socialMediaiconsHolder:{
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
        paddingRight:5,
        marginBottom:10
    },
    socialMediaicons:{
        width:20,
        height:20,
        marginLeft:5
    }
});
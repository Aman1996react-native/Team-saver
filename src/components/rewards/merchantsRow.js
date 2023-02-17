import React, { Component } from "react";
import { 
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import fonts from "../../assets/fonts";
import { getDeviceWidth } from "../../utils";
import colors from "../../utils/colors";
import ImageComponent from "../imageComponent/imageComponent";

class MerchantsRow extends Component {

    constructor(props){
        super(props)
        this.state = {
            selected:false,
            selectedMenu: [],
            selectedIndex:null
        }
    }

    offersKeyExtractor = (item, index) => item.MenuID.toString()

    renderOfferItems = ({ item, index }) => {
        return(
            <TouchableOpacity 
            style={[styles.touchableOpacity,{width:getDeviceWidth() - 50,marginLeft:5,marginRight:5,marginBottom:3,paddingLeft:5}]}
            onPress={() => {
                
                this.props.onMenuTapped(item,this.props.item)
                
            }}>
                <View style={{width:'80%',flexDirection:'row',alignItems:'center'}}>
                {/*<Image style={{width:30,height:30,borderRadius:15,marginLeft:5,marginRight:5,borderColor:colors.APP_GREEN,backgroundColor:'white'}}/> */}
                    <View style={{alignItems:'flex-start',justifyContent:'center'}}>
                        <Text numberOfLines={4} style={styles.points}>{item.Title}</Text>
                        {item.Description != null &&
                        <Text numberOfLines={10} style={[styles.descriptionText,{width:getDeviceWidth()/1.5}]}>{item.Description}</Text>}
                        
                    </View>
                </View>

                <View style={{width:'20%',paddingRight:5,alignItems:'flex-end'}}>
                    <Text style={{fontFamily:fonts.heavy,color:colors.APP_GREEN,fontSize:14,}}>{item.Points.toString()} Points</Text>
                </View>
                
            </TouchableOpacity>
        )
    }

    renderOffers = (item) => {
        if(this.props.isGiftCard){
            return null
        }
        if(this.state.selected){
            if(typeof(item.Menu) != 'undefined'){
                if(item.Menu.length > 0){
                    return(
                        <View style={{backgroundColor:colors.White,marginLeft:20,marginRight:20,width:getDeviceWidth() - 40,marginTop:-10,marginBottom:10}}>
                            <View style={{backgroundColor:colors.BLACK,height:1,marginTop:10,marginLeft:5,marginRight:5,}}/>

                            <FlatList
                            style={{ marginTop: 10,width:'100%',marginBottom:10,backgroundColor:colors.White}}
                            data={item.Menu}
                            renderItem={this.renderOfferItems}
                            keyExtractor={this.offersKeyExtractor}
                            />
                        </View>
                        
                    )
                }
            }
        }
        
    }

    renderDistance = () => {
        if(typeof(this.props.info) != 'undefined'){
            if(this.props.info != null){
                if(typeof(this.props.info.coords) != 'undefined'){
                    let lat1 = Number(this.props.item.Lat)
                    let lat2 = this.props.info.coords.latitude
                    let lon1 = Number(this.props.item.Long)
                    let lon2 = this.props.info.coords.longitude
    
                    var R = 6371; // Radius of the earth in km
                    var dLat = (lat2-lat1) * (Math.PI/180);  // deg2rad below
                    var dLon = (lon2-lon1) * (Math.PI/180); 
                    var a = 
                            Math.sin(dLat/2) * Math.sin(dLat/2) +
                            Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
                            Math.sin(dLon/2) * Math.sin(dLon/2)
                            ; 
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                    var d = R * c; // Distance in km 
                    return(
                        <View>
                            <Text style={[styles.descriptionText2,{marginRight:2}]}>{d.toFixed(1)} km -</Text>
                        </View>
                    )
                }
            }
            
        }
        return null
    }


    render() {
        return (
            <View>
                <TouchableOpacity style={styles.container}
                onPress={() => {
                    const item = this.props.item
                    if(this.props.isGiftCard){
                        this.props.onMerchantSelected(item,this.props.index)
                    }else{
                        if(typeof(item.Menu) != 'undefined'){
                            if(item.Menu.length > 0){
                                this.setState({selected:!this.state.selected},() => {
                                    this.props.onCafetapped(this.state.selected,this.props.index,this.props.item)
                                })
                            }
                        }
                    }
                    
                }}
                >
                    <View style={{marginLeft:15,marginRight:15,width:getDeviceWidth() - 50,alignItems:'center',flexDirection:'row'}}>
                        <View>
                            {this.props.isGiftCard ?
                            <ImageComponent
                            resizeMode={'contain'}
                            style={{width:60,height:60,marginRight:20}}
                            imageUrl={this.props.item.Merchant_Image}
                            />
                            
                            :
                            <ImageComponent
                            resizeMode={'contain'}
                            style={{width:60,height:60,marginRight:20}}
                            imageUrl={this.props.item.MerchantImage}
                            />
                            
                            }
                        </View>
                        {this.props.isGiftCard &&
                        <View style={{width:'100%',height:'100%',justifyContent:'center',paddingTop:5,paddingBottom:5}}>
                            <Text style={styles.merchantName}>{this.props.item.Merchant_Name}</Text>
                            {this.props.item.OfferDetails.length > 0 &&
                                <Text numberOfLines={0} style={[styles.descriptionText,{marginRight:0}]}>{this.props.item.OfferDetails[0].Description}</Text>
                            }
                        </View>}
                        {this.props.isFoodAndWine &&
                        <View style={{width:'100%'}}>
                            <Text style={styles.merchantName}>{this.props.item.Merchant_Name}</Text>
                            
                            <View style={{flexDirection:'row',alignItems:'center',width:'100%'}}>
                                {this.renderDistance()}
                                <Text numberOfLines={0} style={[styles.descriptionText2,{marginLeft:2}]}>{this.props.item.Merchant_Desc}</Text>
                                
                            </View>
                           
                        </View>}
                    </View>
                </TouchableOpacity>
                {this.renderOffers(this.props.item)}
            </View>
        );
    }
}
export default MerchantsRow;

const styles = StyleSheet.create({
    container: {
        // flexDirection:'row',
        alignItems: 'center',
        justifyContent:'center',
        padding:5,
        marginLeft:20,
        marginRight:20,
        marginBottom:10,
        width:getDeviceWidth() - 40,
        height:110,
        backgroundColor:colors.White,
        borderWidth:0.3,
        borderColor:colors.APP_GREEN
        // shadowOffset:{width:1,height:1},
        // shadowRadius:1,
        // shadowOpacity:0.2,
        // elevation:5
    },
    merchantName:{
        fontFamily:fonts.bold,
        color:colors.APP_GREEN,
        fontSize:16,
        marginRight:80
    },
    touchableOpacity:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:10,
        height:100,
        backgroundColor:colors.LightGray,
        width:getDeviceWidth() - 30,
        marginLeft:15,
        marginRight:15,
        
    },
    points:{
        fontFamily:fonts.bold,
        color:colors.APP_GREEN,
        fontSize:14,
        width:'75%'
    },
    descriptionText:{
        fontFamily:fonts.regular,
        color:colors.BLACK,
        fontSize:13,
        marginTop:5,
        width:'75%'
    },
    descriptionText2:{
        fontFamily:fonts.medium,
        color:colors.BLACK,
        fontSize:10,
        marginTop:5,
    }
});
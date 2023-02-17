import React, { Component } from "react";
import { 
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet
} from "react-native";
import Modal from 'react-native-modal';
import fonts from "../../assets/fonts";
import { getDeviceWidth } from "../../utils";
import colors from "../../utils/colors";


class DenominationModal extends Component {

    keyExtractor = (item, index) => {
        if(this.props.isDelivery){
           return item
        }
        return item.Offer_ID.toString()
    }

    renderItem = ({ item, index }) => {
        return(
            <TouchableOpacity style={styles.touchableOpacity}
            onPress={() => {
                this.props.onAmountSelected(item,this.props.isDelivery)
            }}>
                {this.props.isDelivery ?
                <Text style={styles.text}>{item}</Text>
            :
                <Text style={styles.text}>${item.Amount}</Text>
            
            }
                
            </TouchableOpacity>
        )
    }


    render() {
        return (
            <Modal 
            backdropOpacity={0.6}
            backdropColor={'#000000'}
            style={styles.container} isVisible={this.props.isVisible}
            onBackdropPress={() => {
               
                this.props.onBackdropPressed()
            }}
            >
                <View style={{padding:10,backgroundColor:'white'}}>
                    {this.props.isDelivery ?
                        <Text style={{fontFamily:fonts.bold,margin:10,textAlign:'center'}}>Select delivery kind</Text>

                    :
                    <Text style={{fontFamily:fonts.bold,margin:10,textAlign:'center'}}>Select an amount</Text>

                    }
                    <FlatList
                    style={this.props.isDelivery ?  {maxHeight:120} : {maxHeight:350}}
                    data={this.props.isDelivery ? this.props.deliveryArray : this.props.denominationArray}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    />
                </View>
                
            </Modal>
            
        );
    }
}
export default DenominationModal;

const styles = StyleSheet.create({
    container: {
        marginLeft:15,
        marginRight:15,
        width:getDeviceWidth() - 30,
        justifyContent:'center',
        alignItems:'center',
        
    },
    touchableOpacity:{
        padding:15,
        backgroundColor:colors.LightGray,
        justifyContent:'center',
        marginBottom:5,
        width:getDeviceWidth() - 30
    },
    text:{
        fontFamily:fonts.bold,
        color:colors.APP_GREEN,
        fontSize:20
    }

});
import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, ScrollView,
FlatList,Platform,TouchableOpacity,TextInput,KeyboardAvoidingView } from 'react-native';
import { heightToDp, widthToDp, getDeviceWidth } from '../../utils';
import Icons from '../../assets/icons'
import * as Labels from '../../constants'
import Modal from 'react-native-modal';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts';
import ImageComponent from '../imageComponent/imageComponent';


class OfferSaveShopModal extends Component {
    render() {
        return (
            <Modal 
            isVisible={this.props.isVisible}
            style={{ justifyContent: 'center', alignItems: 'center' }}
            backdropOpacity={0.5}
            backdropColor={'#000000'}
            onBackdropPress={() => { this.props.onBackdropPressed() }}>
                {this.props.selectedOffer != null &&
                    <View style={{ width: getDeviceWidth() - 30, backgroundColor: colors.White, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ height: 60, marginTop: 0, width: '100%', backgroundColor: colors.APP_GREEN, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.titleText,{fontSize:20}]}>$1 = {this.props.selectedOffer.Points} Points</Text>
                        </View>
                        <View style={{ width: '80%', marginTop: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <View style={{ marginRight: 20}}>
                                <ImageComponent
                                resizeMode={'center'}
                                style={{ width: 50, height: 50 }}
                                imageUrl={this.props.selectedOffer.LogoUrl}
                                />
                                
                            </View>
                            <View style={{ justifyContent: 'center', }}>
                                <Text style={[styles.titleText,{color:colors.BLACK,textAlign:'left',marginRight:50,marginBottom:5}]}>{this.props.selectedOffer.OfferTitle}</Text>
                                <Text numberOfLines={8} style={styles.descriptionText}>{this.props.selectedOffer.OfferDescription}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                        onPress={() => {
                            this.props.onShopTapped(this.props.selectedOffer)
                        }}
                        style={{ justifyContent: 'center', alignItems: 'center' ,backgroundColor: colors.YELLOW, marginBottom: 10, height: 50, width: '80%' }}>
                            <Text style={styles.text}>Shop</Text>
                        </TouchableOpacity>

                        {!this.props.isFromSaved &&
                        <TouchableOpacity
                        onPress={() => {
                            this.props.onSaveTapped(this.props.selectedOffer)
                        }}
                        style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: colors.APP_GREEN, marginBottom: 10, height: 50, width: '80%' }}>
                            <Text style={styles.text}>Save</Text>
                        </TouchableOpacity>
                        }
                    </View>
                    }

            </Modal>
        );
    }
}
export default OfferSaveShopModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
        fontSize: 14,
        color: colors.White,
        fontFamily: fonts.medium,
        textAlign:'center'
    },
    descriptionText: {
        fontSize: 12,
        fontFamily: fonts.regular,
        marginRight: 120
    },
    text: {
        fontSize: 16,
        fontFamily: fonts.medium,
    },
});
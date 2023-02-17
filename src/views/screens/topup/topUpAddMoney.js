import React, { Component } from "react";
import { 
    View,
    Text,
    ActionSheetIOS,
    Alert,
    ScrollView,
    Platform,
    TouchableOpacity,
    Image,
    StyleSheet
} from "react-native";
import DetailsView from "../../../components/topup/detailsView";
import Clipboard from '@react-native-community/clipboard';
import fonts from "../../../assets/fonts";
import Modal from 'react-native-modal';
import ActionSheet from "../../../components/actionSheet/actionsheet";
import colors from "../../../utils/colors";

class TopUpAddMoney extends Component {

    constructor(props){
        super(props)
        this.state = {
            tappedButton:null,
            isVisible:false,
            bankDetails:null
        }
    }

    onCopyDetailsPressed = (bankDetails) => {
      
      if(Platform.OS == 'ios'){
        ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ["Cancel","Copy Account Name", "Copy BSB", "Copy Account Number","Copy Reference Details"],
              cancelButtonIndex: 0
            },
            buttonIndex => {
              if (buttonIndex === 0) {
                // cancel action
              } else if (buttonIndex === 1) {
                  if(typeof(bankDetails) != 'undefined'){
                      if(typeof(bankDetails.Name) != 'undefined'){
                        Clipboard.setString(bankDetails.Name)
                      }
                  }
                  
                
              } else if (buttonIndex === 2) {
                if(typeof(bankDetails) != 'undefined'){
                    if(typeof(bankDetails.BSB) != 'undefined'){
                      Clipboard.setString(bankDetails.BSB)
                    }
                }
                
              }else if (buttonIndex === 3) {
                if(typeof(bankDetails) != 'undefined'){
                    if(typeof(bankDetails.AccountNumber) != 'undefined'){
                      Clipboard.setString(bankDetails.AccountNumber)
                    }
                }
              }else if (buttonIndex === 4) {
                if(typeof(bankDetails) != 'undefined'){
                    if(typeof(bankDetails.GUID) != 'undefined'){
                      Clipboard.setString(bankDetails.GUID)
                    }
                }
              }
              
            }
          );
      }else{
        this.setState({bankDetails:bankDetails},() => {
          this.setState({isVisible:true})
        })
      }
    }

    closeActionSheet = () =>{
      this.setState({isVisible:false})
    }


    render() {
      const actionItems = [
        {id: 1,label: 'Copy Account Name',
          onPress: () => {
            this.setState({isVisible:false},() => {
              const bankDetails = this.state.bankDetails
              if(typeof(bankDetails) != 'undefined'){
                if(bankDetails != null){
                  if(typeof(bankDetails.Name) != 'undefined'){
                    Clipboard.setString(bankDetails.Name)
                  }
                }
            }
            })
          }
        },
        {id: 2,label: 'Copy BSB',
          onPress: () => {
            this.setState({isVisible:false},() => {
              const bankDetails = this.state.bankDetails
              if(typeof(bankDetails) != 'undefined'){
                if(bankDetails != null){
                  if(typeof(bankDetails.BSB) != 'undefined'){
                    Clipboard.setString(bankDetails.BSB)
                  }
                }
            }
            })
          }
        },
        {id: 3,label: 'Copy Account Number',
          onPress: () => {
            this.setState({isVisible:false},() => {
              const bankDetails = this.state.bankDetails
              if(typeof(bankDetails) != 'undefined'){
                if(bankDetails != null){
                  if(typeof(bankDetails.AccountNumber) != 'undefined'){
                    Clipboard.setString(bankDetails.AccountNumber)
                  }
                }
            }
            })
          }
        },
        {id: 4,label: 'Copy Reference Details',
          onPress: () => {
            this.setState({isVisible:false},() => {
              const bankDetails = this.state.bankDetails
              if(typeof(bankDetails) != 'undefined'){
                if(bankDetails != null){
                  if(typeof(bankDetails.GUID) != 'undefined'){
                    Clipboard.setString(bankDetails.GUID)
                  }
                }
            }
            })
          }
        },
      ];
        return (
            <View style={styles.container}>
              {Platform.OS == 'android' &&
              <Modal
              isVisible={this.state.isVisible}
              style={{
                margin: 0,
                justifyContent: 'flex-end'
              }}
            >
              <ActionSheet
              actionItems={actionItems}
              onCancel={this.closeActionSheet}
              />
            </Modal>}

              <ScrollView contentContainerStyle={{justifyContent:'flex-end'}}>
              <View style={{justifyContent:'center',marginTop:30}}>
                <DetailsView
                topUpScreen={2}
                onCopyDetailsPressed={this.onCopyDetailsPressed}/>
              </View>                
              </ScrollView>
                
            </View>
        );
    }
}
export default TopUpAddMoney;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:colors.White,
    },
   
});
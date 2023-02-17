import React,{ Component } from 'react';
import { 
    View, 
    Animated,
    StyleSheet,
    TouchableOpacity,
    Text } from 'react-native';
import { getDeviceWidth } from '../../utils';
import moment from "moment";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import colors from '../../utils/colors';
import fonts from '../../assets/fonts';



export default class ClickHistoryRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
        prevOpenedRow:null
    };

    this.refsArray = []
    this.previouslyOpenedRow = null
  }

  close = (index) => {
      this.refsArray[index].close()
    if (this.previouslyOpenedRow && this.previouslyOpenedRow != this.refsArray[index]) {
        this.previouslyOpenedRow.close();
        
    }
    this.previouslyOpenedRow = this.refsArray[index]
    this.setState({prevOpenedRow:this.refsArray[index]})
  };


  renderRightActions = (progress,item,index) =>{
        return(
            <View
            style={{
                width: 80,
                height:80,
                marginTop:-20
            }}>
            {this.renderRightAction('SubmitClaim', 'red', 192, progress,item,index)}
            </View>
        )
  
    };

    renderRightAction = (text, color, x, progress,item,index) => {
        const trans = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [x, 0],
        });
        return (
          <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
            <RectButton
              style={[styles.rightAction, { backgroundColor: colors.APP_GREEN }]}
              onPress={() => {
                  this.close(index)
                  this.props.onSubmitClaimTapped(item)
                  console.warn(JSON.stringify(item))
                  if(typeof(item.IsEligibleForClaim) != 'undefined'){
                    if(item.IsEligibleForClaim != null){
                      if(item.IsEligibleForClaim == 'Yes'){
                        this.props.navigation.navigate('SubmitRewardClaim',{item:item})
                      }
                    }
                  }
                  
              }}>
              <Text style={styles.actionText}>Submit</Text>
              <Text style={styles.actionText}>Claim</Text>
            </RectButton>
          </Animated.View>
        );
      };


  render() {
      const item = this.props.item
      const index = this.props.index

      return(
        <Swipeable friction={2} 
        containerStyle = {{height:60,justifyContent:'center'}} 
        ref={ref => {
            this.refsArray[index] = ref;  
          }}
        onSwipeableOpen={() => {
        }}
        renderRightActions={(progress) => this.renderRightActions(progress,item,index)}>
            <Text style={[styles.text,{marginLeft:10}]}> {moment(item.CreatedDate).format('ddd, MMM, DD YYYY, h:mm a')} {item.OfferName}</Text>
        </Swipeable>
      )
    return (
      <TouchableOpacity style={styles.rowContainer}>
        <Text> {moment(item.CreatedDate).format('ddd, MMM, DD YYYY, h:mm a')} {item.OfferName}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
    rowContainer:{
        height:40,
        width:getDeviceWidth() - 20,
        margin:10
    },
    rightAction:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginTop:15,
        marginBottom:0,
        marginLeft:-15,
    },
    actionText:{
        fontFamily:fonts.medium,
        color:colors.White,
        fontSize:15,
        marginBottom:2
    },
    text:{
        fontFamily:fonts.bold,
        fontSize:13,

    }
});

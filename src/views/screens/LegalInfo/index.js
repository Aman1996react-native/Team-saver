import React, { Component } from 'react'
import { View, StyleSheet, Text, Pressable, Alert } from 'react-native'
import { getDeviceHeight, getDeviceWidth } from '../../../utils'
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';

const mapStateToProps =(state) => ({
    
    loading:state.GetTCRegReducer.loading,
    request:state.GetTCRegReducer.request,
    response:state.GetTCRegReducer.response,

    ppLoading:state.GetPrivacyPolicyRegReducer.loading,
    ppRequest:state.GetPrivacyPolicyRegReducer.request,
    ppResponse:state.GetPrivacyPolicyRegReducer.response,

    acceptLoading:state.AcceptTCRegReducer.loading,
    acceptRequest:state.AcceptTCRegReducer.request,
    acceptResponse:state.AcceptTCRegReducer.response,

    isPrimaryUserLoading:state.IsPrimaryUserReducer.loading,
    isPrimaryUserRequest:state.IsPrimaryUserReducer.request,
    isPrimaryUserResponse:state.IsPrimaryUserReducer.response,


  })

class LegalInfo extends Component{

    constructor(props) {
        super(props)
        this.state = {
        legalInfo : ''
        }
    }

    componentDidMount = async() =>{
          this.setState({ legalInfo : this.props.data})
          this.props.dispatch(RegistrationActionCreator.getTCAndPP(true))
       // this.fetchTCAndPP()
       //Alert.alert(this.props.data)
       
        
    }

  renderHtml = (content) => {
    return(
        <WebView
                source={{ uri: content }}
                //Enable Javascript support
                javaScriptEnabled={true}
                //For the Cache
                domStorageEnabled={true}
                //View to show while loading the webpage
                //Want to show the view or not
                //startInLoadingState={true}
                // onLoadStart={() => console.warn('Loaded..')}
                // onLoad={() => console.warn('Loaded Done..')}
             style={{ marginTop: 20, alignSelf : 'center', width : '100%', height : 200 }}
            />
    )
}
 loadTC = () => {
         return(
            <View style={{flex: 1,width:getDeviceWidth() - 30,margin:15}}>
                <ScrollView style = {{flex : 1 , backgroundColor : 'red'}}>
                      {/* <Text style={styles.textBlack} >TT</Text> */}
                      {this.renderHtml('https://reward360.optus.invia.com.au/home/TNC')}
                      </ScrollView>
                      <Pressable onPress={() => this.props.close() } style = {styles.buttonContainer}>
                      <Text style={styles.textBlack}>Done</Text>
                      </Pressable>
                  </View>
              )
  
}
loadPP = () => {
                return(
                    <View style={{flex: 1,width:getDeviceWidth() - 30,margin:15}}>
                        {/* <Text style={styles.textBlack} >{this.props.ppResponse.PP}</Text> */}
                        {this.renderHtml('https://reward360.optus.invia.com.au/home/PrivacyPolicy')}
                        <Pressable onPress={() => this.props.close() } style = {styles.buttonContainer}>
                      <Text style={styles.textBlack}>Done</Text>
                      </Pressable>
                    </View>
                )
}
renderTCAndPP = (isPP) => {
    const PPprops = this.props.ppResponse
    const TCprops = this.props.response
        console.warn('PPprops',PPprops)
        if(isPP) 
        {
                return (
                    <View style={{ margin: 10, flex: 1, }}>
                        {this.renderHtml('https://reward360.optus.invia.com.au/home/PrivacyPolicy')}
                    </View>
                )
      
                }
     else{
     return (
                        <View style={{ margin: 10, flex: 1, }}>
                             {this.renderHtml('https://reward360.optus.invia.com.au/home/TNC')}
                       </View>
     )
     }

    // else {
    //     if (typeof (TCprops) != 'undefined') {
    //         if (typeof (TCprops.TNC) != 'undefined') {
    //             return (
    //                 <View style={{ margin: 10, flex: 1, }}>
    //                     {this.renderHtml('https://mwallet.optus.invia.com.au/home/TNC')}
    //                 </View>
    //             )
    //         }
    //     }
    // }
}


    render() {
        {this.renderTCAndPP(true)}
        return (
        <View style = {styles.container}>
            {this.state.legalInfo == 'pp' ?   this.renderTCAndPP(true) : this.renderTCAndPP(false)}
            <Pressable onPress={() => this.props.close() } style = {styles.buttonContainer}>
                      <Text style={styles.textBlack}>Done</Text>
                      </Pressable>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        height : getDeviceHeight() * 0.85,
        width : getDeviceWidth() - 20,
        justifyContent : 'center',
       // backgroundColor : 'red',
    },
    buttonContainer : {
        height : 50, 
        width : 350, 
        borderRadius : 12, 
        alignSelf : 'center',
        justifyContent : 'center',
        backgroundColor : 'red',
        borderColor : 'red',
        borderWidth : 2
    },
    textBlack : {
        textAlign : 'center',
        fontSize : 22,
        color : 'white',
        fontWeight : 'bold'
    }
})

export default connect(mapStateToProps)(LegalInfo)
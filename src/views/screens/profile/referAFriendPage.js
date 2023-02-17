import React, { Component } from "react";
import { 
    View,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TouchableOpacity,
    TextInput,
    Text,
    StyleSheet
} from "react-native";
import fonts from "../../../assets/fonts";
import YellowButton from "../../../components/button";
import { getDeviceWidth } from "../../../utils";
import colors from "../../../utils/colors";

class ReferAFriendPage extends Component {

    constructor(props){
        super(props)
        this.state={
            fName:'',
            lName:'',
            email:'',
            mobile:''
        }
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' && 'padding'} style={styles.container}>
                <ScrollView>
                    <View style={styles.textinputCotainer}>
                        <TextInput
                        style={styles.textInput}
                        placeholderTextColor={'gray'}
                        value={this.state.fName}
                        onChangeText={(text) => {
                            this.setState({fName:text})
                        }}
                        placeholder='First Name'
                        />
                    </View>

                    <View style={styles.textinputCotainer}>
                        <TextInput
                        style={styles.textInput}
                        placeholderTextColor={'gray'}
                        value={this.state.lName}
                        onChangeText={(text) => {
                            this.setState({lName:text})
                        }}
                        placeholder='Last Name'
                        />
                    </View>

                    <View style={styles.textinputCotainer}>
                        <TextInput
                        style={styles.textInput}
                        placeholderTextColor={'gray'}
                        value={this.state.email}
                        onChangeText={(text) => {
                            this.setState({email:text})
                        }}
                        placeholder='Email Address'
                        keyboardType='email-address'
                        />
                    </View>

                    <View style={styles.textinputCotainer}>
                        <TextInput
                        style={styles.textInput}
                        placeholderTextColor={'gray'}
                        value={this.state.mobile}
                        onChangeText={(text) => {
                            this.setState({mobile:text})
                        }}
                        placeholder='Mobile Number'
                        keyboardType='phone-pad'
                        />
                    </View>

                    <YellowButton
                    style={styles.touchableOpacity}
                    title='Refer'
                    navigate={() => {

                    }}
                    />

                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
export default ReferAFriendPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:20
    },
    textinputCotainer:{
        width:getDeviceWidth() - 20,
        height:50,
        margin:10,
        backgroundColor:colors.White,
        justifyContent:'center',
        padding:5,
    },
    textInput:{
        fontFamily:fonts.bold,
        fontSize:14,
        width:getDeviceWidth() - 30
    },
    touchableOpacity:{
        alignSelf:'center',
        marginTop:20
    }
});
import React, { useState } from 'react'
import { View, StyleSheet, Pressable, Text, Image, TextInput } from 'react-native'
import { getDeviceWidth, widthToDp, isValidEmail } from '../../../../utils';
import fonts from '../../../../assets/fonts';
import Icons from '../../../../assets/icons';
import colors from '../../../../utils/colors';
import YellowButton from '../../../../components/button'



const ForgotPassword = ({
 ...props
}) => {

    const [emailIfForgottenPassword, setEmailIfForgottenPassword] = useState(false)
    const [email, setEmail] = useState('')



    return (
        <View style = {styles.container}>
            <View style = {{flex : 0.1}}></View>
             <View style={styles.componentContainer}>
                    <Text style={{ marginTop: 15, fontFamily: fonts.bold, fontSize: 22 }}>Forgot Password</Text>
                    <Image style={{ width: 120, height: 120, position : 'absolute', left : 130, top : -70 }}
                    resizeMode="contain" source={Icons['FORGOTPASSWORD']} />
                      <Image style={{ width: 18, height: 18 }}
                    resizeMode="contain" source={Icons['QUESTIONICON']} />
                  </View>
                  <View style={{ justifyContent: 'center', width: '80%', borderWidth: 1, borderColor: 'transparent', backgroundColor : 'white', borderRadius: 5, alignSelf : 'center', marginBottom : 50 }}>
                    <TextInput
                      placeholder='Email Address*'
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text)
                      }}
                      placeholderTextColor={colors.GREY}
                      keyboardType='email-address'
                      autoCapitalize="none"
                      style={[styles.numStyle, { marginTop: 10, marginBottom: 10, width: '100%', textAlign: 'left', alignSelf : 'center', paddingLeft : 20 }]}
                    />
                    {!isValidEmail(email) && email != '' &&
                      <Text style={{ fontFamily: fonts.regular, color: Colors.APP_GREEN, fontSize: 12, textAlign: 'center' }}>Invalid email address</Text>
                    }
                  </View>
                  
                <View style = {{flex : 1 , justifyContent : 'flex-end'}}>
                  <YellowButton
                            disabled={
                                //this.state.email.length < 1 || this.state.name.length < 1 || this.state.surname.length < 1 ||
                                !isValidEmail(email)
                                // || this.state.mobileNumber.length < 10
                                }
                            title={'RESET MY PASSWORD'}
                            navigate={() => { 
                              // this.moveToSignUp3() 
                            }}
                            
                            />
                            </View>
        </View>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({

    container : {
        flex : 1,
        marginVertical : 50,
        marginTop : 100,
        marginHorizontal : 20,
       
    },
    componentContainer : {
        flexDirection: 'row', 
        alignItems: 'flex-end', 
        justifyContent: 'space-between', 
        width : '80%',
        alignSelf : 'center',
        marginBottom  :20
        // width: getDeviceWidth() - 30
    }
    
})
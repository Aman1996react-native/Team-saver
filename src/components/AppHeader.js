import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View , StyleSheet, Image, Pressable } from 'react-native'
import RoundImage from "../components/roundImage";
import colors from '../utils/colors';

const AppHeader = (props) => {

    const navigation = useNavigation()

    const close = () => {
        navigation.goBack()
    }
    return (
        <View style = {styles.container}>
            {props.hideBackButton ? null :
            <Pressable style = { ({pressed}) => [{width: 30, height: 30, opacity : pressed ? 0.5 : 1}]}
                onPress = {() => close()}>
            <Image
                             source={require('../assets/images/back.png')}
                             style={[{ width: 25, height: 25,marginTop : 60,  marginLeft : 10, tintColor : 'white'}]}
                             resizeMode='contain'
                         />
           
            </Pressable>}
                
                 <Image
                             source={require('../assets/images/coins_cart.png')}
                             style={[ StyleSheet.absoluteFill,{ width: 100, height: 130, left : 30, top : 35, opacity : props.imageHide ? 0 : 1}]}
                             resizeMode='contain'
                         />
                <View style = {{marginTop : 50, marginRight : 10}}>
                    {props.rightHeaderHide ? null :
                <RoundImage
                            navigation={navigation}
                            stopLoader = {true}
                             />
                    }
                             </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
  container :
   { height : 100,
    width : '100%',
    backgroundColor : colors.G8Red,
flexDirection : 'row',
justifyContent : 'space-between',
}
})

export default AppHeader
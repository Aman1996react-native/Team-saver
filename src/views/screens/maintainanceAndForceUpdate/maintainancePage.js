import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import fonts from "../../../assets/fonts";
import YellowButton from "../../../components/button";
import colors from "../../../utils/colors";
import { connect } from 'react-redux'
import { OtherAPIActionCreator } from "../../../redux/actionCreators/app/otherAPIs";
import ActivityIndicatorComponent from "../../../components/activityIndicator";


const mapStateToProps = (state) => ({

    maintainanceLoading: state.GetmaintainanceReducer.loading,
    maintainanceRequest: state.GetmaintainanceReducer.request,
    maintainanceResponse: state.GetmaintainanceReducer.response,
})

class MaintainancePage extends Component {

    constructor(props){
        super(props)

    }

    onRefreshTapped = () => {
        this.props.dispatch(OtherAPIActionCreator.getMaintainanceStatus())
    }

    render() {
        if(this.props.maintainanceLoading){
            return(
                <ActivityIndicatorComponent></ActivityIndicatorComponent>
            )
        }
        
        return (
            <View style={styles.container}>
                <Text style={styles.text}>App is under Maintainance</Text>
                <Text style={styles.desc}>There is some maintainance activity going on. Please tap the below button to refresh.</Text>
                <YellowButton
                title='Check Maintainance Status'
                navigate={() => {this.onRefreshTapped()  }}/>
            </View>
        );
    }
}
export default connect(mapStateToProps)(MaintainancePage);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text:{
        fontFamily:fonts.heavy,
        color:colors.APP_GREEN,
        fontSize:18
    },
    desc:{
        fontFamily:fonts.bold,
        fontSize:16,
        margin:10,
        marginBottom:20,
        textAlign:'center'
    }
});
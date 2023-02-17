import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

import { connect } from 'react-redux';
import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import { CCSActionCreator } from "../../../redux/actionCreators/app/ccs";

const mapStateToProps =(state) => ({

    loading:state.GetCallDetailsReducer.loading,
    request:state.GetCallDetailsReducer.request,
    response:state.GetCallDetailsReducer.response,
  
  })

class CCSCallPage extends Component {

    constructor(props){
        super(props)
        this.state={

        }
    }

    componentDidMount() {
        this.props.dispatch(CCSActionCreator.getCallDetails())
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>CCSCallPage</Text>
            </View>
        );
    }
}
export default connect(mapStateToProps)(CCSCallPage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
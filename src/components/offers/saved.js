import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { OffersActionCreator } from '../../redux/actionCreators/app/offers';
import { connect } from 'react-redux';
import ActivityIndicatorModal from '../activityIndicator/activityIndicatorModel';
import Offers from "./offers";
import NoDataView from "../noData/noDataView";
import Offers2 from "./offers2";



const mapStateToProps =(state) => ({
    loading:state.GetSaveOffersReducer.loading,
    request:state.GetSaveOffersReducer.request,
    response:state.GetSaveOffersReducer.response
  })

class Saved extends Component {

    constructor(props){
        super(props)
    }

    componentDidMount(){
        this.fetchSavedOffers()
    }

    fetchSavedOffers = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.props.dispatch(OffersActionCreator.getSavedOffers(res))
            }
        })
    }

    renderSaved = () => {
        const res = this.props.response
        if(typeof(res) != 'undefined'){
            if(res.length > 0){
                return(
                <Offers2
                isFromSaved={true}
                categories={res}
                navig={this.props.navig}
                />
                )
            }
        }
        return(
            <NoDataView
            label='No Saved Offers to display'/>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicatorModal isVisible={this.props.loading}/>
                {this.renderSaved()}
                
            </View>
        );
    }
}
export default connect(mapStateToProps)(Saved);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center'
    }
});
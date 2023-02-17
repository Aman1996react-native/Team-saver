import React, { Component } from "react";
import { 
    View,
    Text,
    FlatList,
    LogBox,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import Modal from 'react-native-modal';
import fonts from "../../assets/fonts";
import { getDeviceWidth } from "../../utils";
import colors from "../../utils/colors";
import BrandsRow from "../auth/registration/brandsRow";
import {connect} from 'react-redux'
import AsyncStorage from "@react-native-community/async-storage"

import EncryptedStorage from 'react-native-encrypted-storage';
import { RegistrationActionCreator } from "../../redux/actionCreators/registration";
import ActivityIndicatorComponent from "../activityIndicator";
import YellowButton from "../button";


const mapStateToProps =(state) => ({

    getBrandsLoading:state.GetTopBrandsRegReducer.loading,
    getBrandsRequest:state.GetTopBrandsRegReducer.request,
    getBrandsResponse:state.GetTopBrandsRegReducer.response,

    saveBrandsLoading:state.SaveFavouritesRegReducer.loading,
    saveBrandsRequest:state.SaveFavouritesRegReducer.request,
    saveBrandsResponse:state.SaveFavouritesRegReducer.response,

    
})


class BrandsListModal extends Component {

    constructor(props){
        super(props)
        this.state={
            brandsList:this.props.brandsList,
            selectedBrands:[],
            reload:false,
            allBrands:[]
        }
    }

    componentDidUpdate(prevProps){
        const res = this.props.getBrandsResponse
        if(this.state.reload){
            
            if(typeof(res) != 'undefined'){
                    if(res.length > 0){
                        this.setState({allBrands:res},() => {
                            this.setState({reload:false})
                        })
                    }
                    
            }
        }
    }

    

    getBrands = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            if(res){
                this.setState({reload:true})
                this.props.dispatch(RegistrationActionCreator.getTopBrands(res))
            }
        })
    }

    _keyExtractor = (item,index) => index.toString()

    _renderItem = ({item,index}) => {
      return(
          <BrandsRow
          item={item}
          brands={this.state.brandsList}
          onAddTapped={this.onAddTapped}
          />
          )
      }

      onAddTapped = (item,val) => {
        
        let allBrands = this.state.allBrands.slice(0)
        if(allBrands.length > 0){
            
            allBrands.forEach(brand => {
                if(brand.id == item.id){
                    
                    brand.Selected = val
                    
                }
            })
        }

          

          this.setState({reload:false})
          this.setState({allBrands:allBrands})
      }

      renderList = () => {
        if(typeof(this.props.getBrandsResponse) != 'undefined' && !this.props.getBrandsLoading){
            if(this.props.getBrandsResponse.length > 0){
                return(
                    <FlatList
                    style={styles.flatList}
                    data={this.state.allBrands}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    />
                )
            }
        }
      }

    render() {
        const props = this.props
        return (
            <Modal
            isVisible={props.isVisible}
            style={{justifyContent:'center',alignItems:'center'}}
            onShow={() => {
                this.getBrands()
            }}
            >
                {this.props.getBrandsLoading
                &&
                <ActivityIndicatorComponent/>
                }
                {!this.props.getBrandsLoading &&
                <View style={styles.flatListContainer}>
                    <Text style={{fontFamily:fonts.bold,textAlign:'center'}}>Select Favourite brands:</Text>
                    {this.renderList()}
                    
                    <View style={[styles.buttonHolder,{flexDirection:'column'}]}>
                        <YellowButton
                        title='Save'
                        style={{width:'65%',alignSelf:'center'}}
                        navigate={() => {
                            let selBrands = []
                            this.state.allBrands.forEach(brand => {
                                if(brand.Selected == 'true'){
                                    selBrands.push(brand)
                                   
                                }
                            })
                            this.props.onSaveTapped(selBrands)
                        }}
                        />
                        {/* <TouchableOpacity style={styles.button}
                        onPress={() => {
                            
                            
                        }}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity> */}
                        <YellowButton
                        title='Cancel'
                        style={{width:'65%',alignSelf:'center',marginTop:10}}
                        navigate={() => {
                            this.props.onCancelTapped()
                        }}
                        />

                        {/* <TouchableOpacity style={styles.button}
                        onPress={() => {
                            this.props.onCancelTapped()
                        }}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity> */}
                    </View>
                    
                </View>}
            </Modal>
        );
    }
}
export default connect(mapStateToProps)(BrandsListModal);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    flatListContainer:{
        marginTop:10,
        marginBottom:10,
        backgroundColor:'white',
        width:getDeviceWidth() - 20,
        marginBottom:10,
        paddingTop:10
    },
    flatList:{
        marginTop:10,
        height:'80%'
    },
    buttonHolder:{
        flexDirection:'row',
        alignItems:'center',
        margin:10,
        // alignSelf:'center',
    },
    button:{
        padding:15,
        backgroundColor:colors.YELLOW,
        justifyContent:'center',
        alignItems:'center',
        marginRight:10
    },
    buttonText:{
        fontFamily:fonts.heavy,
        fontSize:14,
        color:colors.White
    }
});
import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, TextInput, ScrollView,FlatList } from 'react-native';
import { SIGNUP_10, CONTINUE,SKIP } from '../../../../../constants'
import Colors from '../../../../../utils/colors'
import YellowButton from '../../../../../components/button';
import { heightToDp, widthToDp, getDeviceWidth } from '../../../../../utils';
import UnderlineText from '../../../../../components/underlineText';
import ActivityIndicatorComponent from '../../../../../components/activityIndicator';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage';
import { RegistrationActionCreator } from '../../../../../redux/actionCreators/registration';
import BrandsRow from '../../../../../components/auth/registration/brandsRow';
import fonts from '../../../../../assets/fonts';


const mapStateToProps =(state) => ({
    
    loading:state.GetTopBrandsRegReducer.loading,
    request:state.GetTopBrandsRegReducer.request,
    response:state.GetTopBrandsRegReducer.response,

    saveLoading:state.SaveFavouritesRegReducer.loading,
    saveRequest:state.SaveFavouritesRegReducer.request,
    saveResponse:state.SaveFavouritesRegReducer.response,

  })

class SignUpStep10 extends Component {

    constructor(props){
        super(props)
        this.state = {
            selectedBrands:[],
            reload:false,
            allBrands:[]
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.fetchBrands()      
        });
        
    }

    componentDidUpdate(prevProps){
        const res = this.props.saveResponse

        const brandsRes = this.props.response
        if(this.state.reload){
            
            if(typeof(brandsRes) != 'undefined'){
                    if(brandsRes.length > 0){
                        this.setState({allBrands:brandsRes},() => {
                            this.setState({reload:false})
                        })
                    }
                    
            }
        }


        if(typeof(res) != 'undefined'){
            if(Object.keys(res).length > 0){
                if(typeof(res.Status) != 'undefined'){
                    if(res.Status == 'Success'){
                        // if(res.saved_status == 'true'){
                            alert('Favourites added.')
                            this.props.navigation.navigate('SignUp11')
                        // }
                    }else{
                        alert('There was a problem occured while adding favourites. Please try again.')
                    }
                }
                this.props.dispatch(RegistrationActionCreator.resetResponse('10'))
            }
        }
    }

    fetchBrands = () => {
        EncryptedStorage.getItem('userId',(res,err) => {
            this.setState({reload:true})
            this.props.dispatch(RegistrationActionCreator.getTopBrands(res))
        })
        
    }

    _keyExtractor = (item,index) => index.toString()

    _renderItem = ({item,index}) => {
      return(
          <BrandsRow
          item={item}
          brands={this.props.response}
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

      onNextButtonTapped = () => {
        // props.navigation.navigate('SignUp11')
        // alert(JSON.stringify(this.state.selectedBrands))

            let selBrands = []
            this.state.allBrands.forEach(brand => {
                if(brand.Selected == 'true'){
                    selBrands.push(brand)
                                   
                }
            })

            EncryptedStorage.getItem('userId',(res,err) => {
                if(res){
                    this.props.dispatch(RegistrationActionCreator.saveFavourites(res,selBrands))
                }
            })

            /* if(this.state.selectedBrands.length > 0){
            EncryptedStorage.getItem('userId',(res,err) => {
                if(res){
                    this.props.dispatch(RegistrationActionCreator.saveFavourites(res,this.state.selectedBrands))
                }
            })
        }else{
            this.props.navigation.navigate('SignUp11')
        } */
      }

      renderBrandsFlatList = () => {
          if(typeof(this.props.response) != 'undefined' && !this.props.loading){
              if(this.props.response.length > 0){
                return(
                    <View style={styles.flatListContainer}>
                        <FlatList
                        style={styles.flatList}
                        data={this.state.allBrands}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        />
                    </View>
                  )
              }
          }

          
      }

    render(){

        if(this.props.loading || this.props.saveLoading){
            return(
                <ActivityIndicatorComponent/>
            )
        }
        return(
            <View style={styles.container}>
            {/* <ScrollView showsVerticalScrollIndicator={false} style={{ width: getDeviceWidth() }} > */}
                <View style={styles.textContainer} >
                    <Text style={styles.textGreen}  >{SIGNUP_10.lbl_1}</Text>
                    <Text style={styles.textGreen} >{SIGNUP_10.lbl_2}</Text>
                    <Text style={styles.textBlack} >{SIGNUP_10.lbl_3}</Text>
                    <Text style={styles.textBlack} >{SIGNUP_10.lbl_4}</Text>
                </View>
                {this.renderBrandsFlatList()}
                    
        {/* </ScrollView> */}
            <View style={styles.btnContainer} >
                <YellowButton title={CONTINUE} navigate={() => {this.onNextButtonTapped()}} />
                <UnderlineText title={SKIP} navigate={() => {this.props.navigation.navigate('SignUp11') }} />
            </View>
        </View>
        )
    }
    
}

export default connect(mapStateToProps)(SignUpStep10);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding:40,
        alignItems: "center",
        backgroundColor: Colors.BG_LIGHT_BLUE
    }, 
    textContainer: {
        width: getDeviceWidth(),
        alignItems: "center",
        justifyContent: 'center',
        alignContent: "center",
        // height:heightToDp('70%')
    },
    InputContainer: {
        width: widthToDp('70%'),
        marginTop: 10,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: Colors.APP_GREEN,
        borderRadius: 3,
        overflow: 'hidden'
    },
    textInput: {
        height: 42,
        color: Colors.TEXT_INPUT,
        backgroundColor: Colors.WHITE,
        paddingLeft: 10
    },
    btnContainer:
    {
        width: getDeviceWidth(),
        // marginVertical: 5,
        alignItems: "center"
    },
    textGreen:
    {
        color: Colors.APP_GREEN,
        fontSize: widthToDp('6%'),
        fontFamily:fonts.medium
    },
    textBlack:
    {
        color: Colors.BLACK,
        fontSize: widthToDp('4%'),
        marginTop: 10,
        fontFamily:fonts.medium
    },
    flatList:{
        // backgroundColor:'yellow',
        height:'100%'
    },
    flatListContainer:{
        marginTop:10,
        marginBottom:10,
        backgroundColor:'white',
        height:'60%',
        width:getDeviceWidth() - 20
    }
});
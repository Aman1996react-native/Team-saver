import React, { Component } from "react";
import { 
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet
} from "react-native";
import fonts from "../../assets/fonts";
import colors from "../../utils/colors";
import ImageComponent from "../imageComponent/imageComponent";

class ContactsViewMultiSelect extends Component {

    constructor(props){
        super(props)
        this.state = {
            contacts:this.props.contacts,
            selected:false,
            headerSelected:false,
            isPlusTapped:false
        }

        // alert(JSON.stringify(this.props.contacts))
    }

    contactKeyExtractor = ( item, index ) => {
        // alert(JSON.stringify(item))
        // if(typeof(item.contactNumber) != 'undefined'){
        //     return item.contactNumber.toString()
        // }
        return item.contactNumber.toString()
        
    }

    renderContact = ({ item, index }) => {
        return(
            <TouchableOpacity style={styles.view}>
                <TouchableOpacity
                style={item.selected ? styles.touchableOpacityHorSelected : styles.touchableOpacityHorUnselected}
                onPress={() => {
                    this.setState({headerSelected:false})
                    let contacts = this.state.contacts.slice(0)
                    if(contacts.length > 0){
                        
                        const val = item.selected  ? false : true

                        this.setState({contacts:contacts,isPlusTapped:false})
                        this.props.onMultiContactSelected(item,val)
                    }
                }}>
                    {(item.Image != null && typeof(item.Image) != 'undefined') ?
                    <ImageComponent
                    resizeMode={null}
                    style={{width:40,height:40,borderRadius:20}}
                    imageUrl={item.Image}
                    /> 
                    
                    :
                    <Text style={[styles.name,{color:colors.White,fontSize:16}]}>{item.nameToDisplay}</Text>
                    }
                
                </TouchableOpacity>
                <Text numberOfLines={1} style={styles.name}>{item.Name}</Text>
            </TouchableOpacity>
            
            
        )
    }

    renderHeader = () => {
        const myContact = this.props.myContact

        if(this.props.isSendMoney ){
            return null
        }


        if(typeof(myContact.Name) != 'undefined'){
            if(typeof(myContact.contactNumber) != 'undefined'){
                if(myContact.contactNumber){
                    return(
                        <TouchableOpacity style={styles.view}>
                            <TouchableOpacity
                            style={this.state.headerSelected ? styles.touchableOpacityHorSelected : styles.touchableOpacityHorUnselected}
                            onPress={() => {
                                this.setState({headerSelected:true,isPlusTapped:false})
                                let contacts = this.state.contacts.slice(0)
                                if(contacts.length > 0){
                                    contacts.forEach(con => {
                                        con.selected = false
                                    })
                                    this.setState({contacts:contacts})
                                    this.props.onContactSelected(null,true)
                                }
                            }}>
                                {(myContact.Image != null && typeof(myContact.Image) != 'undefined') ? 
                                    <ImageComponent
                                    resizeMode={null}
                                    style={{width:40,height:40,borderRadius:20}}
                                    imageUrl={myContact.Image}
                                    /> 
                                    :
                                    <Image style={{width:20,height:20}} source={require('../../assets/images/user.png')}/>
                                }
                            
                            </TouchableOpacity>
                            <Text numberOfLines={1} style={styles.name}>Me</Text>
                        </TouchableOpacity>
                    )
                }
            }
        }
        return null
        
        
    }



    render() {
        return (
            <View style={styles.container}>
            <FlatList
            horizontal
            style={{ marginBottom: 10,minHeight:70,maxHeight:75,marginRight:5}}
            data={this.state.contacts}
            renderItem={this.renderContact}
            keyExtractor={this.contactKeyExtractor}
            ListHeaderComponent={this.renderHeader()}
            />

            {!this.props.isSendMoney && !this.props.isRequestMoney &&
            <TouchableOpacity style={this.state.isPlusTapped ? styles.plusHolderSelected : styles.plusHolder}
            onPress={() => {
                this.setState({isPlusTapped:true})
                this.setState({headerSelected:false})
                let contacts = this.state.contacts.slice(0)
                if(contacts.length > 0){
                    contacts.forEach(con => {
                        con.selected = false
                    })
                    this.setState({contacts:contacts})
                }
                this.props.onPlusTapped()
            }}>
                <Image style={this.state.isPlusTapped ? {width:25,height:25,tintColor:'white'} : {width:25,height:25}} resizeMode='contain' source={require('../../assets/images/plus.png')}/>
            </TouchableOpacity>}
        </View>
        );
    }
}
export default ContactsViewMultiSelect;

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: "space-between",
        width:'100%',
        paddingRight:10
    },
    touchableOpacityHorSelected: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 2,
        borderColor: 'red',//colors.YELLOW,
        marginBottom: 5,
        backgroundColor: colors.BLUE
    },
    touchableOpacityHorUnselected: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 3,
        borderColor:'green',
        marginBottom: 5,
        backgroundColor: colors.GREY,
        
    },
    view:{ 
        // backgroundColor: colors.BACKGROUND_COLOR, 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 75, 
        width:65,
        marginTop: 0, 
        marginHorizontal: 10 
    },
    name:{
        width:80,
        fontFamily:fonts.bold,
        fontSize:12,
        textAlign:'center'
    },
    plusHolder:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        width:42,
        height:42,
        borderRadius:21,
        marginBottom:20,
        shadowOffset:{width:1,height:1},
        shadowRadius:2,
        shadowOpacity:1,
        elevation:5
    },
    plusHolderSelected:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.BLUE,
        width:42,
        height:42,
        borderRadius:21,
        marginBottom:20,
        shadowOffset:{width:1,height:1},
        shadowRadius:2,
        shadowOpacity:1,
        elevation:5
    }
});
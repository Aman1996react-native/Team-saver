import React, { Component } from "react";
import { 
    View,
    Text,
    FlatList,
    Platform,
    StyleSheet
} from "react-native";
import ReceiptsSummaryRow from "../../../components/receipts/receiptsSummaryRow";
import { SearchBar } from 'react-native-elements';
import colors from "../../../utils/colors";


const receiptArray = [
    {id:'1',name:'Zara',dateAndTime:'12 January 2021, 2:46pm',totalPaid:'206.39',image:'ZARA'},
    {id:'2',name:'JB',dateAndTime:'14 January 2021, 10:00pm',totalPaid:'143.55',image:'JB'},
    {id:'3',name:'Gormon',dateAndTime:'20 January 2021, 11:45am',totalPaid:'243.43',image:'GORMON'},
    {id:'4',name:'Zara',dateAndTime:'2 February 2021, 5:46pm',totalPaid:'304.12',image:'ZARA'},
    {id:'5',name:'JB',dateAndTime:'3 February 2021, 11:30am',totalPaid:'100.55',image:'JB'},
    {id:'6',name:'Gormon',dateAndTime:'4 February 2021, 9:45pm',totalPaid:'543.43',image:'GORMON'},
    {id:'7',name:'JB',dateAndTime:'6 February 2021, 4:10pm',totalPaid:'90.55',image:'JB'},
]


class ReceiptsPage extends Component {

    constructor(props){
        super(props)
        this.state = {
            searchText:'',
            filteredArray:[]
        }
    }

    _keyExtractor = (item,index) => item.id

    _renderItem = ({item,index}) => {
        return(
            <ReceiptsSummaryRow
            item={item}
            index={index}
            onReceiptTapped={this.onReceiptTapped}
            />
        )
    }

    onReceiptTapped = (item) => {
        if(item != null){
            this.props.navigation.navigate('Invoice')
        }
    }

    receiptsHeader = () => {
        return(
            <View style={styles.searchHolder}>
                <SearchBar
                lightTheme={true}
                placeholder="Search receipts..."
                inputStyle={styles.searchTextInput}
                inputContainerStyle={{backgroundColor:colors.LightGray,}}
                containerStyle={Platform.OS == 'ios' && styles.searchContainer}
                platform={Platform.OS == 'ios' ? 'ios' : 'android'}
                onChangeText={(text) => {
                    this.setState({searchText:text})
                }}
                value={this.state.searchText}
                
                
                returnKeyType='search'
               
                onSubmitEditing={() => {
                    
                }}
                onChangeText={(text) => {
                    this.setState({searchText:text},() => {
                        let array = this.state.filteredArray.slice(0)
                        let receipts = receiptArray
                       
                        if(receipts.length > 0){
                            array = receipts.filter(receipt =>{ 
                                return receipt.name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1
                            });
                            this.setState({filteredArray:array})
                        }
                        if(this.state.searchText == ''){
                            this.setState({filteredArray:[]})
                        } 
                        
                    })
                }}
                />
            </View>
            
        )
    }


    render() {
        return (
            <View style={styles.container}>
                {this.receiptsHeader()}
                <FlatList
                data={this.state.filteredArray.length > 0 || this.state.searchText != '' ? this.state.filteredArray : receiptArray}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
                />
            </View>
        );
    }
}
export default ReceiptsPage;

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingTop:10
    }
});
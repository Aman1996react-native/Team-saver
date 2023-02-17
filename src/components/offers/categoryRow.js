import React, { Component } from "react";
import { 
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    StyleSheet
} from "react-native";
import fonts from "../../assets/fonts";
import colors from "../../utils/colors";
import ImageComponent from "../imageComponent/imageComponent";

class CategoryRow extends Component {
    constructor(props){
        super(props)
        this.state = {
            selectedIndex:this.props.selectedIndex,
            categories:this.props.Categories
        }
    }

    componentDidMount(){
        let categories = this.state.categories
        if(typeof(categories) != 'undefined'){
            if(categories.length > 0){
                categories.forEach(cat => {
                    if(cat.Category_Name == this.props.catToBeSelected){
                        cat.selected = true
                    }else{
                        cat.selected = false
                    }
                })
            }
        }
    }

    render() {
        const item = this.props.item
        const index = this.props.index

        if(this.props.isFromRewards && typeof(item.MerchantDetails) == 'undefined'){
            return null
        }

        if(this.props.isFromRewards && item.MerchantDetails.length < 1){
            return null
        }

        return (
            <TouchableOpacity style={styles.view}
            onPress={() => {
                this.props.onCategoryTapped(item,index)
            }}>
                <TouchableOpacity style={item.selected ? this.props.isFromRewards ? [styles.touchableOpacityHorSelected,{borderWidth:0}] : [styles.touchableOpacityHorSelected,{borderWidth:0}] : this.props.isFromRewards ? [styles.touchableOpacityHor,{borderWidth:0}] : [styles.touchableOpacityHor,{borderWidth:0}]}
                    onPress={() => {
                        this.props.onCategoryTapped(item,index)
                    }}>
                        {this.props.isFromRewards ?
                        <ImageComponent
                        Sec_Image={item.selected}
                        resizeMode={'contain'}
                        style={item.selected ? { width: 40, tintColor: colors.White, height: 40 } : { width: 40, height: 40, tintColor: colors.YELLOW }}
                        imageUrl={item.IconBig}
                        />

                        :

                        <ImageComponent
                        Sec_Image={item.selected}
                        resizeMode={'contain'}
                        style={item.selected ? { width: 40, tintColor: colors.White, height: 40 } : { width: 40, height: 40, tintColor: colors.YELLOW }}
                        imageUrl={item.IconBig}
                        />
                    
                    }
                    
                </TouchableOpacity>
                <Text numberOfLines={1} style={item.selected ? styles.titleSelected : styles.titleUnselected}>{item.Category_Name}</Text>
                {Platform.OS == 'ios' && item.selected &&
                    <View style={{ height: 2, backgroundColor: colors.YELLOW, width: 100, }} />
                }
            </TouchableOpacity>
        );
    }
}
export default CategoryRow;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:colors.BACKGROUND_COLOR
    },
    touchableOpacityHor: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.YELLOW,
        marginBottom: 5,
    },
    touchableOpacityHorSelected: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.YELLOW,
        marginBottom: 5,
        backgroundColor: colors.YELLOW
    },
    titleSelected: {
        fontFamily: fonts.bold,
        fontSize: 12,
        color: colors.YELLOW,
        borderBottomColor: colors.YELLOW,
        borderBottomWidth: 2
        // borderBottomColor:'#ffa200',
        // borderBottomWidth:1
    },
    titleUnselected: {
        fontFamily: fonts.bold,
        fontSize: 12,
        color:'black'
    },
    view:{ 
        // backgroundColor: colors.BACKGROUND_COLOR, 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 70, 
        width:85,
        marginTop: 0, 
        marginHorizontal: 10 ,
        
    }

});
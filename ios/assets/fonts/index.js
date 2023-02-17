import {Platform} from 'react-native'
import Config from "react-native-config";


export default FontFamily = {
    regular:  Config.fontRegular,
    bold:Config.fontBold,
    medium:Config.fontMedium,
    heavy:Config.fontBold,
    rowTitleFontSize:Config.rowTitleFontSize,
    rowDescFontSize:Config.rowDescFontSize,
    buttonTextFont: Platform.OS === 'ios' ? Config.buttonTextFontiOS : Config.buttonTextFontAndroid
}
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from "react";
import ForceUpdatePage from '../../views/screens/maintainanceAndForceUpdate/forceUpdatePage';

const ForceUpdateStack = createStackNavigator();
function ForceUpdateConfig({ navigation }) {
    return (
        <ForceUpdateStack.Navigator
            screenOptions={{
                headerShown:false
                
            }} >
            <ForceUpdateStack.Screen options={{
                title: '',
            }} name="ForceUpdate" component={ForceUpdatePage}></ForceUpdateStack.Screen>
        </ForceUpdateStack.Navigator>
    );
}
export default ForceUpdateConfig
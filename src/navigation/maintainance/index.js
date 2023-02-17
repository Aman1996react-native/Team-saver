import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from "react";
import MaintainancePage from '../../views/screens/maintainanceAndForceUpdate/maintainancePage';

const MaintainanceStack = createStackNavigator();
function MaintainanceConfig({ navigation }) {
    return (
        <MaintainanceStack.Navigator
            screenOptions={{
                headerShown:false
                
            }} >
            <MaintainanceStack.Screen options={{
                title: '',
            }} name="Maintainance" component={MaintainancePage}></MaintainanceStack.Screen>
        </MaintainanceStack.Navigator>
    );
}
export default MaintainanceConfig
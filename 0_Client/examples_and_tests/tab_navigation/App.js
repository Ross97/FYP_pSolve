// DESCRIPTION: Program to demonstrate how Tab Navigation
import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import{ createAppContainer} from 'react-navigation';
import{ createBottomTabNavigator } from 'react-navigation-tabs';

import HomeScreen from './HomeScreen';
import SettingScreen from './SettingScreen';
import { Ionicons } from '@expo/vector-icons';

const AppNavigator =  createBottomTabNavigator({
	Scan: {screen: HomeScreen},
	Settings: {screen: SettingScreen}
},
{
	defaultNavigationOptions: ({ navigation }) => ({
		tabBarIcon: ({ focused, tintColor }) => {
			const { routeName } = navigation.state;
			if (routeName === 'Scan') {
				return <Ionicons name='md-camera' size={25} color={tintColor} />
			} else if (routeName === 'Settings') {
				return <Ionicons name='md-settings' size={25} color={tintColor} />
			}
		}
	}) //end defaultNavigationOptions
}); //end createBottomTabNavigator

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
	return (
		<AppContainer />
	);
}

const styles = StyleSheet.create({  
	container: {
		flex: 1,
		backgroundColor: 'white'
	},

	camera: {
	    flex: 2,
	    backgroundColor: 'black',
	},

	button: {
		height: 50,
		backgroundColor: 'blue',
	},

	pic: {
		flex: 1,
	    backgroundColor: 'black',
	},
});  
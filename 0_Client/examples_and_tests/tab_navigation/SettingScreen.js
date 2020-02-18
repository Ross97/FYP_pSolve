// DESCRIPTION: Program to demonstrate how Tab Navigation works
import React from 'react';
import { View, Text, StatusBar } from 'react-native';

export default function SettingScreen() {
	return (
		<View>
			<StatusBar hidden = {true} />
			<Text>Settings...</Text>
		</View>
	);
};
// DESCRIPTION: Work-in-progress / temporary homescreen. Navigates to other pages. 
import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

export default function HomeScreen(props) {

	const {navigate} = props.navigation;

	return (
	    <View style={styles.container}>
	       <Button title="Sudoku" onPress={() => navigate('SudokuScan') } />
	       <Button title="Spot the Difference" onPress={() => navigate('DifferenceSelectImage1') } />
	       <Button title="Tic-Tac-Toe" onPress={() => navigate('TicTacToeScan') } />
	       <Button title="Word Search" onPress={() => navigate('WordSearchScan') } />
	    </View>
	); 

}; //end HomeScreen


const styles = StyleSheet.create({  
	container: {
		flex: 1,
		textAlign: 'center', 
		backgroundColor: '#b0e0e6',
		justifyContent: 'center',
		color: 'white',
	},

});  
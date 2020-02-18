// DESCRIPTION: Allows the user to correct any issues in the Tic-Tac-Toe before solving.
import React, {useState} from 'react';
import { StyleSheet, View, Text, TextInput, StatusBar, Image, Keyboard, TouchableOpacity } from 'react-native';
import { StackActions } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import {postData} from '../../CommonFunctions';

export default function TicTacToeCorrection(props) {

	const {navigate} = props.navigation;
	const {params} = props.navigation.state;
	const detected_digits = params.detected_digits;
	const current_filename = params.filename;

	// Change zeroes to blank text
	for(let i = 0; i < detected_digits.length; i++) 
		for(let j = 0; j < detected_digits.length; j++)
			if (detected_digits[i][j] === 0) 
				detected_digits[i][j] = '';

	const [matrix, setMatrix] = useState([...detected_digits]);
	const [infoText, setInfo] = useState('Please correct any misidentified digits');

	// Updates the matrix and closes the keyboard
    const updateMatrix = (row_i, col_i, value) => {
    	value = value.toUpperCase();
		if (value != 'O' && value != 'X') {
			value = '';
		}
		var temp = [...matrix];
		temp[row_i][col_i] = value;
		setMatrix(temp);
		Keyboard.dismiss();
    }

    // Solve the sudoku and move to Solve screen
	const solveTicTacToe = async () => {
		console.log("Sending to server for solving");
		setInfo("Sending to server for solving...");

		const data = {'tictactoe': [...matrix], 'filename': current_filename};

		try {
		    const response = await postData('/tictactoe/solve', data);
		    setInfo('Position the Tic-Tac-Toe in the crosshair');
			navigate('TicTacToeDisplay', {'filename': current_filename, 'winner': response.winner}); 

		} catch (e) {
		    console.log('Error', e);
		    setInfo(e);
		}

	} // end solveTicTacToe

	return (
		<View style={styles.container}>

			<StatusBar hidden={true} />
			<Text> </Text>
			<Image style={{flex:1, resizeMode: 'contain'}} source={{
				uri : 'http://ross-dev.live:5000/static/images/tictactoes/' + current_filename + '_detected.jpg',
				cache: 'reload',}}
			/>

			<View style={styles.tictactoe}>
				{matrix.map((row, row_idx) =>
				<View key={row_idx} style={styles.row}>
				  	{row.map((value, col_idx) => {
						const normal = (
							<TextInput
							key={col_idx}
							style={styles.cell}
							onChangeText={(value) => updateMatrix(row_idx, col_idx, value)}
							value={String(value)}
							/>);
						return normal;		        
					})}
				</View>
				)}
        	</View>

          <View style={styles.infoBox}>
			<Text style={styles.info}>{infoText}</Text>
          </View>

        
          <View style={styles.footer}>
            <TouchableOpacity 
                onPress={solveTicTacToe} 
                style={styles.button}>
                <Ionicons name="ios-checkmark-circle" size={40} color="white"/>
            </TouchableOpacity>
          </View>

		</View>
	);
}; // end TicTacToeCorrection


const styles = StyleSheet.create({  
	container: {
	  	flex: 1,
	    backgroundColor: '#b0e0e6',
	},

 	tictactoe: {
	    flex: 2,
	  	alignSelf: 'center',
	 	justifyContent: 'center',
	 },

	row: {
		flexDirection: 'row',
		justifyContent: 'center',
		backgroundColor: 'white',
    },

	infoBox: {
        flexDirection: 'row', 
        backgroundColor: '#2fa4d9', 
	},

  	info: {
        flex: 1,
        fontStyle: 'italic',
        textAlign: 'center', 
        margin: 5,
		color: 'white',
	},
  	
	footer: {
        flexDirection: 'row', 
        backgroundColor: '#1d7ca7',
	},

    button: {
        flex: 1,
	    justifyContent: "center", 
	    alignItems: "center",
        backgroundColor: '#2fa4d9',
        height: 50,
	},

	cell: {
		width: 80,
		height: 80,
		borderColor:'grey',
		borderWidth: 1,
		textAlign: 'center',
  	},

}); 
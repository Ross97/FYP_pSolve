// DESCRIPTION: Allows the user to correct any issues in the sudoku before solving.
import React, {useState} from 'react';
import { StyleSheet, View, Text, TextInput, StatusBar, Image, Keyboard, TouchableOpacity } from 'react-native';
import { StackActions } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import {postData} from '../../CommonFunctions';

export default function SudokuCorrection(props) {

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
    const updateMatrix = (row_i, col_i, number) => {
    	number = Number(number);
		if (number == 0) {
			number = '';
		}
		var temp = [...matrix];
		temp[row_i][col_i] = number;
		setMatrix(temp);
		Keyboard.dismiss();
    }

    // Solve the sudoku and move to Solve screen
	const solveSudoku = async () => {
		console.log("Sending to server for solving");
		setInfo("Sending to server for solving...");

		const data = {sudoku: [...matrix], filename: current_filename}

		try {
		    const response = await postData('/sudoku/solve', data);
		    setInfo('Please correct any misidentified digits');
			navigate('SudokuDisplay', {'detected': detected_digits, 'solution': response.solution, 'filename': current_filename}); 
		} catch (e) {
		    console.log('Error', e);
		    setInfo(e);
		}

	} // end solveSudoku

	return (
		<View style={styles.container}>

			<StatusBar hidden={true} />
			<Text> </Text>
			<Image style={{flex:1, resizeMode: 'contain'}} source={{
				uri : 'http://ross-dev.live:5000/static/images/sudokus/' + current_filename + '.gif',
				cache: 'reload',}}
			/>

			<View style={styles.sudoku}>
				{matrix.map((row, row_idx) =>
				<View key={row_idx} style={styles.row}>
				  	{row.map((number, col_idx) => {
				              
						const normal = (
							<TextInput
							key={col_idx}
							style={styles.cell}
							onChangeText={(number) => updateMatrix(row_idx, col_idx, number)}
							value={String(number)}
							clearTextOnFocus={true}
							keyboardType={'numeric'}
							/>);
						      
						const col_border = (
							<TextInput
							key={col_idx}
							style={[styles.cell, styles.cell_col_border]}
							onChangeText={(number) => updateMatrix(row_idx, col_idx, number)}
							value={String(number)}
							clearTextOnFocus={true}
							keyboardType={'numeric'}
							/>);
						      
						const row_border = (
							<TextInput
							key={col_idx}
							style={[styles.cell, styles.cell_row_border]}
							onChangeText={(number) => updateMatrix(row_idx, col_idx, number)}
							value={String(number)}
							clearTextOnFocus={true}
							keyboardType={'numeric'}
							/>);
						      
						const row_col_border = (
							<TextInput
							key={col_idx}
							style={[styles.cell, styles.cell_row_col_border]}
							onChangeText={(number) => updateMatrix(row_idx, col_idx, number)}
							value={String(number)}
							clearTextOnFocus={true}
							keyboardType={'numeric'}
							/>);
				           
						if ((col_idx != 3 && col_idx != 6) && (row_idx != 3 && row_idx != 6)) 
							return normal;
						else if ((col_idx == 3 || col_idx == 6) && (row_idx != 3 && row_idx != 6))
							return col_border;
						else if ((row_idx == 3 || row_idx == 6) && (col_idx != 3 && col_idx != 6))
							return row_border
						else
							return row_col_border
				        
					})}
				</View>
				)}
        	</View>

          <View style={styles.infoBox}>
			<Text style={styles.info}>{infoText}</Text>
          </View>

        
          <View style={styles.footer}>
            <TouchableOpacity 
                onPress={solveSudoku} 
                style={styles.button}>
                <Ionicons name="ios-checkmark-circle" size={40} color="white"/>
            </TouchableOpacity>
          </View>

		</View>
	);
};


const styles = StyleSheet.create({  
	container: {
	  	flex: 1,
	    backgroundColor: '#b0e0e6',
	},

 	sudoku: {
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
		width: 36,
		height: 36,
		borderColor:'grey',
		borderWidth: 1,
		textAlign: 'center',
  	},
  
  	cell_col_border: {
		borderLeftColor: 'black',
		borderLeftWidth: 3,
  	},
  
    cell_row_border: {
		borderTopColor: 'black',
		borderTopWidth: 3,
  	},

    cell_row_col_border: {
		borderTopColor: 'black',
		borderTopWidth: 3,
        borderLeftColor: 'black',
		borderLeftWidth: 3,
  	},

}); 
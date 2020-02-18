// DESCRIPTION: Allows the user to correct any issues in the wordsearch before solving.
import React, {useState} from 'react';
import { StyleSheet, View, Text, TextInput, StatusBar, Image, Keyboard, TouchableOpacity } from 'react-native';
import { StackActions } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import {postData} from '../../CommonFunctions';

export default function WordSearchCorrection(props) {

	const {navigate} = props.navigation;
	const {params} = props.navigation.state;
	const detected_digits = params.detected_digits;
	const current_filename = params.filename;
	const size = params.size;

	// Change zeroes to blank text
	for(let i = 0; i < detected_digits.length; i++) 
		for(let j = 0; j < detected_digits.length; j++)
			if (detected_digits[i][j] === 0) 
				detected_digits[i][j] = '';

	const [matrix, setMatrix] = useState([...detected_digits]);
	const [infoText, setInfo] = useState('Please correct any misidentified values');
	const [wordList, setWordList] = useState([]);
	const [value, setValue] = useState(null);


	const addWord = () => {
		if (value == null)
			return
		const temp = [...wordList];
		temp.push(value.toUpperCase());
		setWordList(temp);
		setValue('');
	}


	// Updates the matrix and closes the keyboard
    const updateMatrix = (row_i, col_i, value) => {
		if (value == 0)
			value = '';
		var temp = [...matrix];
		temp[row_i][col_i] = value;
		setMatrix(temp);
		Keyboard.dismiss();
    }


    // Solve the sudoku and move to Solve screen
	const solveWordsearch = async () => {

		if (wordList.length == 0) {
			console.log('Add some words to search for!');
			setInfo('Add some words to search for!');
			return;
		}

		// Ensure all cells are filled
		for (var i = 0; i < matrix.length; i++) {
			for (var j = 0; j < matrix.length; j++) {
				if (matrix[i][j] == '') { 
					console.log("Please fill in every cell before submitting!");
					setInfo("Please fill in every cell before submitting!");
					return;
				}
			}
		}

		console.log("Sending to server for solving");
		setInfo("Sending to server for solving...");

		const data = {wordsearch: [...matrix], filename: current_filename, size: size, words: wordList};

		try {
		    const response = await postData('/wordsearch/solve', data);
		    setInfo('Position the Word Search in the crosshair');
			navigate('WordSearchDisplay', {'filename': current_filename}); 
		} catch (e) {
		    console.log('Error', e);
		    setInfo(e);
		}
	} // end solveWordsearch


	return (
		<View style={styles.container}>

			<StatusBar hidden={true} />


			<TouchableOpacity onPress={addWord} style={styles.addword} >
				<Text style={styles.wordList}>
					Words to Find: {wordList}
				</Text>
				<TextInput style={styles.input} onChangeText={(value) => setValue(value)} value={value} clearTextOnFocus={true} />
				<Text> ADD</Text>
	        </TouchableOpacity>

			<Image style={{flex:1, resizeMode: 'contain'}} source={{
				uri : 'http://ross-dev.live:5000/static/images/wordsearches/' + current_filename + '.gif',
				cache: 'reload',}}
			/>

			<View style={styles.wordsearch}>
				{matrix.map((row, row_idx) =>
				<View key={row_idx} style={styles.row}>
				  	{row.map((value, col_idx) => {    
						return (  
							<TextInput
								key={col_idx}
								style={styles.cell}
								onChangeText={(value) => updateMatrix(row_idx, col_idx, value)}
								value={String(value)}
								clearTextOnFocus={true}
							/>);   				        
					})}
				</View>
				)}
        	</View>

          <View style={styles.infoBox}>
			<Text style={styles.info}>{infoText}</Text>
          </View>

        
          <View style={styles.footer}>
            <TouchableOpacity 
                onPress={solveWordsearch} 
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

 	wordsearch: {
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
		width: 35,
		height: 35,
		borderColor:'grey',
		borderWidth: 1,
		textAlign: 'center',
  	},

  	input: {
  		flex: 1,
  		flexDirection: 'row',
  		backgroundColor: 'whitesmoke',
  	},

  	addword: {
  		flexDirection: 'row',
  		backgroundColor: '#2fa4d9',
  		textAlign: 'center',
  		justifyContent: 'center',
  		padding: 10,
  		marginBottom: 10,
  	},

  	wordList: {
  		textAlign: 'center',
  		color: 'white',
  		backgroundColor: '#2fa4d9',
  	},

}); 
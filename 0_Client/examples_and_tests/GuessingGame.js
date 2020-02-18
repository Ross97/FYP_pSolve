// DESCRIPTION: Simple program to learn React Native input
import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View, Button, Image, Alert, TextInput} from 'react-native';

export default function App() {

	const [r, setR] = useState(Math.floor(Math.random() * 100) + 1);
	const [guess, setGuess] = useState('');
	const [guessingText, setGuessingText] = useState('Guess a number from 1 to 100');
	const [count, setCount] = useState(0);

	console.debug(r, count);

	const makeGuess = () => {
		if (guess < r) {
			setGuessingText('Too low');
			setCount( count + 1);
		} else if (guess > r) {
			setGuessingText('Too high');
			setCount( count + 1);
		} else {
			setGuessingText('Congrats!');
			Alert.alert('You won in ' + count + 'guesses!');
		}
	}  


  return (
    <View style={styles.container}>
		<Text style={styles.text}>Simple Guessing App</Text>
		<Text>{guessingText}</Text>
		<TextInput type="numeric" keyboardType="numeric" style={{width:200, borderColor:'gray',  borderWidth:1}} onChangeText={(guess) => setGuess(guess)} value={guess} />
		<Button onPress={makeGuess} title="Make Guess" />
    </View>
  );
}


const styles = StyleSheet.create({  
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},

	text: {
	    color: 'red',
	},
});  
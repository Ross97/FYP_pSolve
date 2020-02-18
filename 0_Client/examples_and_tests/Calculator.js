// DESCRIPTION: Simple calculator app to learn <TextInput>
import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, Text, View, Button, Image, Alert, TextInput} from 'react-native';

export default function App() {

	const [num_one, setNum1] = useState('');
	const [num_two, setNum2] = useState('');
	const [result, set_result] = useState('');

	const addition = () => {
		var result = Number(num_one) + Number(num_two);
		set_result(result);
	}  

	const subtraction = () => {
		var result = Number(num_one) - Number(num_two);
		set_result(result);
	}  


  return (
    <View style={styles.container}>
		<Text style={styles.text}>Simple Calculator App</Text>

		<Text>Answer: {result}</Text>

		<TextInput type="numeric" keyboardType="numeric" style={{width:200, borderColor:'gray',  borderWidth:1}} onChangeText={(num_one) => setNum1(num_one)} value={num_one} />
		<TextInput type="numeric" keyboardType="numeric" style={{width:200, borderColor:'gray',  borderWidth:1}} onChangeText={(num_two) => setNum2(num_two)} value={num_two} />
		

		<Button onPress={addition} title="ADD" />
		<Button onPress={subtraction} title="SUBTRACT" />
		
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
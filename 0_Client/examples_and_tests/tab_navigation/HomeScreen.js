// DESCRIPTION: Program to demonstrate how Tab Navigation works
import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, View, Text, StatusBar, Button, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

export default function HomeScreen() {
	const [permissionGranted, setPermissionGranted] = useState(null);
	const [photoName, setPhotoName] = useState('');
	const [photoBase64, setPhotoBase64] = useState('');
	const camera = useRef(null);

	useEffect(() => {
		askCameraPermission();
	}, []);

	const askCameraPermission = async () => {
		let { status } = await Permissions.askAsync(Permissions.CAMERA);
		setPermissionGranted( status == 'granted');
	}

	const takePicture = async () => {
		// Take picture...
	}; //end takePicture


  return (
    <View style={styles.container}>
    <StatusBar hidden = {true} />
	    { 
		    permissionGranted ? 
			(
				<View style={styles.container}>
					<Camera style={styles.camera} ref={camera}/>
					<Button style={styles.button} title="-[ Scan Puzzle ]-" onPress={takePicture} />
				
					<Image style={styles.pic} source={{uri : `data:image/gif;base64,${photoBase64}`}}/>
				
					
				</View>
			) 
			:
			( <Text>No access to camera, please allow permissions.</Text> )  
	   	}
    </View>
  ); //end render

}; //end HomeScreen



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
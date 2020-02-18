// DESCRIPTION: Allows the user to select from camera roll or capture a sudoku image.
import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import {postData} from '../../CommonFunctions';

export default function SudokuScan(props) {
	
	const {navigate} = props.navigation;
	const [infoText, setInfo] = useState('Position the Sudoku in the crosshair');
	const [permissionGranted, setPermissionGranted] = useState(null);
	const camera = useRef(null);
	useEffect(() => {askCameraPermission();}, []);


	const askCameraPermission = async () => {
		let {status} = await Permissions.askAsync(Permissions.CAMERA);
		setPermissionGranted(status == 'granted');
	}
	

	// Take a base-64 encoded picture and send via sendPicture()
	const takePicture = async () => {
		if (camera) {
			const options = { quality: 0.05, base64: true};
			const picture = await camera.current.takePictureAsync(options);
			sendPicture(picture.base64, true);
		} else {
			alert('Please allow camera permissions.');
		}
	};


	const selectFromCameraRoll = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
		  base64: true,
		  exif: true,
		});

		if (!result.cancelled)
		  	sendPicture(result.base64, false);
	}


	// Sends the picture using postData() from CommonFunctions.js
	// Navigates to SudokuCorrection if succesful
	const sendPicture = async (picture, is_rotated) => {
		setInfo("Uploading...");

		const data = {b64_data: picture, rotated: is_rotated};

		try {
		    const response = await postData('/sudoku/detect', data);
		    setInfo('Position the Sudoku in the crosshair');
			navigate('SudokuCorrection', {'detected_digits': response.digits, 'filename': response.filename}); 
		} catch (e) {
		    console.log('Error', e);
		    setInfo(e);
		}
	}


	return (
	    <View style={styles.container}>
	    <StatusBar hidden={true} />
		    { 
			    permissionGranted ? 
				(
					<View style={styles.container}>

						<Camera style={styles.camera} ref={camera}/>

						<View style={styles.crosshair} />
						
						<View style={styles.infoBox}>
							<Text style={styles.info}>{infoText}</Text>
						</View>

						<View style={styles.footer}>
							<TouchableOpacity onPress={selectFromCameraRoll} style={styles.button}>
								<Ionicons name="md-images" size={32} color="white"/>
							</TouchableOpacity>

							<TouchableOpacity onPress={takePicture} style={[styles.button, styles.borderLeft]}>
								<Ionicons name="md-camera" size={32} color="white"/>
							</TouchableOpacity>
						</View>
					</View>
				) 
				:
				( <Text>No access to camera, please allow permissions.</Text> )  
		   	}
	    </View>
	); //end return

}; //end SudokuScan


const styles = StyleSheet.create({  
	container: {
		flex: 1,
		backgroundColor: '#b0e0e6',
		justifyContent: 'center',
		color: 'white',
	},

	camera: {
	    flex: 1,
	    backgroundColor: 'black',
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
	},

    button: {
        flex: 1,
	    justifyContent: "center", 
	    alignItems: "center",
        backgroundColor: '#2fa4d9',
        height: 50,
	},

    crosshair: {
	    width: 290,
	    height: 290,
	    borderColor: 'rgba(255, 255, 255, 0.3)',
	    borderRadius: 10,
	    position: 'absolute',
	    borderWidth: 5,
	    marginLeft: 45,
  	},

});  
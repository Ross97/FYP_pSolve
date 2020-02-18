// DESCRIPTION: Allows the user to select from camera roll or capture an image.
import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, View, Text, TextInput, StatusBar, TouchableOpacity, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function DifferenceSelectImage1(props) {

	const {navigate} = props.navigation;

	const [infoText, setInfo] = useState('Select the first image');
	const [imageURIOne, setimageURIOne] = useState(null);
	const [imageB64One, setimageB64One] = useState(null);
	const [permissionGranted, setPermissionGranted] = useState(null);
	const camera = useRef(null);
	useEffect(() => {askCameraPermission();}, []);


	const askCameraPermission = async () => {
		let {status} = await Permissions.askAsync(Permissions.CAMERA);
		setPermissionGranted(status == 'granted');
	}
	

	const takePicture = async () => {
		if (imageURIOne) {
			setimageURIOne(null);
			return;
		}
		if (camera) {
			const chosen_quality = 0.001; 
			const options = { quality: chosen_quality, base64: true, exif: true};
			const picture = await camera.current.takePictureAsync(options);
			setimageURIOne(picture.uri);
			setimageB64One(picture.base64);
		} else {
	      setInfo("Camera not found...");
	      console.log("Camera not found...");
	    }
	} 


	const selectFromCameraRoll = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
		  base64: true,
		});

		if (!result.cancelled) {
		  	setimageURIOne(result.uri);
		  	setimageB64One(result.base64);
		}	
	} 


	// Navigate to next screen when finished
	const finishedSelection = () => {
		if (imageB64One) 
			navigate('DifferenceSelectImage2', {'imageB64One': imageB64One, 'imageURIOne': imageURIOne}); 
		else
			setInfo('You must select an image before continuing')
	} 


	return (
	    <View style={styles.container}>
		    <StatusBar hidden={true} />

		    <Text style={styles.selectText}>Image One</Text>

		    {imageURIOne ? (
			    <Image style={{flex:1, resizeMode: 'contain'}} source={{uri : imageURIOne, cache: 'reload',}} />
		    ):( 
		    	<Camera style={styles.camera} ref={camera}/> 
		    )}

	        <View style={styles.infoBox}>
				<Text style={styles.info}>{infoText}</Text>
			</View>

			<View style={styles.footer}>
  				<TouchableOpacity onPress={selectFromCameraRoll} style={styles.button}>
					<Ionicons name="md-images" size={32} color="white"/>
				</TouchableOpacity>

				<TouchableOpacity onPress={takePicture} style={styles.button}>
					<Ionicons name="md-camera" size={32} color="white"/>
				</TouchableOpacity>

				<TouchableOpacity onPress={finishedSelection} style={styles.button}>
					<Ionicons name="ios-checkmark-circle" size={32} color="white"/>
				</TouchableOpacity>
			</View>

	    </View>
	); //end return

} //end DifferenceSelectImage1

const styles = StyleSheet.create({  

	container: {
		flex: 1,
		backgroundColor: '#b0e0e6',
		justifyContent: 'center',
		color: 'white',
	},

	selectionBox: {
		flex: 1,
		backgroundColor: 'white',
	},

  	selectText: {
	    textAlign: 'center',
	    backgroundColor: '#53b4df',
	    color: 'white',
	    height: 30,
	    padding: 5,
	 },

	camera: {
	    flex: 1,
	    backgroundColor: 'black',
	},

	link: {
		textAlign: 'center',
		justifyContent: 'center',
	  	flexDirection: 'row',
	},

	image: {
		flex: 1,
		backgroundColor: 'lightgrey',
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
        backgroundColor: '#2fa4d9',
	},

    button: {
        flex: 1,
	    justifyContent: "center", 
	    alignItems: "center",
        backgroundColor: '#2fa4d9',
        height: 50,
	},

});  
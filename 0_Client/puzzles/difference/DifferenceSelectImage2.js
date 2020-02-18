// DESCRIPTION: Allows the user to select from camera roll or capture an image.
import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, View, Text, TextInput, StatusBar, TouchableOpacity, Image, ImageBackground } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import {postData} from '../../CommonFunctions';

export default function DifferenceSelectImage2(props) {

	const {navigate} = props.navigation;
	const {params} = props.navigation.state;
	const imageB64One = params.imageB64One;
	const imageURIOne = params.imageURIOne;

	const [infoText, setInfo] = useState('Select the second image');
	const [imageURITwo, setimageURITwo] = useState(null);
	const [imageB64Two, setimageB64Two] = useState(null);
	const [isCameraImage, setIsCameraImage] = useState(null);
	const [permissionGranted, setPermissionGranted] = useState(null);
	const camera = useRef(null);
	useEffect(() => {askCameraPermission();}, []);


	const askCameraPermission = async () => {
		let {status} = await Permissions.askAsync(Permissions.CAMERA);
		setPermissionGranted(status == 'granted');
	}
	

	const takePicture = async () => {
		if (imageURITwo) {
			setimageURITwo(null);
			return;
		}
		if (camera) {
			const chosen_quality = 0.001;
			const options = { quality: chosen_quality, base64: true, exif: true};
			const picture = await camera.current.takePictureAsync(options);
			setimageURITwo(picture.uri);
			setimageB64Two(picture.base64);
			setIsCameraImage(1);
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
		  	setimageURITwo(result.uri);
		  	setimageB64Two(result.base64);
	  		setIsCameraImage(0);
		}	
	} 


	const finishedSelection = async () => {
		if (!imageURITwo) {
			setInfo('You must select an image before continuing')
		} else {
			setInfo("Uploading...");

			const data = {image_one: imageB64One, image_two: imageB64Two, is_camera_image: isCameraImage};

			try {
			    const response = await postData('/differences/detect', data);
			    setInfo('Select the second image');
				navigate('DifferenceDisplay', {'filename': response.filename});
			} catch (e) {
			    console.log('Error', e);
			    setInfo(e);
			}
		}
	}


	return (
	    <View style={styles.container}>
		    <StatusBar hidden={true} />
			
			<Text style={styles.selectText}>Image Two</Text>

		    {imageURITwo ? (
			    <Image style={{flex:1, resizeMode: 'contain'}} source={{uri : imageURITwo, cache: 'reload'}} />
		    ):(			
			    <View style={{flex: 1}}>
	            	<ImageBackground source={{uri : imageURIOne}} style={styles.image} imageStyle={styles.image} >
	            		<Camera style={styles.camera} ref={camera}/> 
	            	</ImageBackground>
				</View>
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

} //end DifferenceSelectImage2

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
	    opacity: 0.7,
	},

	link: {
		textAlign: 'center',
		justifyContent: 'center',
	  	flexDirection: 'row',
	},

	image: {
		flex: 1,
		backgroundColor: 'lightgrey',
		resizeMode: 'contain',
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
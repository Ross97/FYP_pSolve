// DESCRIPTION: Displays the detected differences by loading <filename> from the server
import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, StatusBar, Image, TouchableOpacity, ImageBackground } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';


export default function DifferenceDisplay(props) {
	
	const {params} = props.navigation.state;
	const filename = params.filename;

	const [permissionGranted, setPermissionGranted] = useState(null);
	const [solvedImageURI, setSolvedImageURI] = useState(null);
	const [infoText, setInfoText] = useState('Here are the detected differences!');

	const [showImage, setShowImage] = useState(null);

 	// Ask for camera roll permissions
	const getCameraRollPermissions = async () => {
	    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
	    setPermissionGranted(status == 'granted');
	}
	getCameraRollPermissions();
	
	// Download the image (so it can be saved)
	const downloadFile = async () => {
		FileSystem.downloadAsync(
		  'http://ross-dev.live:5000/static/images/differences/' + filename + '.jpg',
		  FileSystem.documentDirectory + filename + '.jpg'
		)
		.then(({ uri }) => {
			console.log('Downloaded to', uri);
			setSolvedImageURI(uri);
		})
		.catch(error => {
			console.error('Error', error);
		});
	}

	const remove = async () => {
	}


	// Save the image to the camera roll
	const saveToLibrary = async () => {
		if(!permissionGranted) {
			getCameraRollPermissions();
			return;
		}

		if(!solvedImageURI) {
			downloadFile();
			setInfoText('Image downloaded, press \'Save\' to save to camera roll!')
			return;
		}
		
	  	if (permissionGranted) {
		    try {
				await MediaLibrary.saveToLibraryAsync(solvedImageURI);
				alert('Saved to Camera Roll');
		    } catch (e) {
		    	console.log(e);
		      	alert(e.message);
		    }
	  	} else {
	  		alert('Please grant permissions and try again.');
	  	}
	};

	return (
		<View style={styles.container}>
			<StatusBar hidden={true} />
		
			<View style={{flex: 1}}>
	            <ImageBackground	
	            	source={{uri : 'http://ross-dev.live:5000/static/images/differences/' + filename + '.jpg', cache: 'reload'}}
					style={styles.image}
            		imageStyle={styles.image} 
            	>

	        		{ showImage ? (<View style={{flex: 1}}></View>) : (
	        			<View style={{flex:1, flexDirection: 'row'}}>
		        			<View style={{flex: 1}}>
				        		<TouchableOpacity onPress={remove} style={styles.blocker} />
								<TouchableOpacity onPress={remove} style={styles.blocker} />
								<TouchableOpacity onPress={remove} style={styles.blocker} />
								<TouchableOpacity onPress={remove} style={styles.blocker} />
							</View>
		        			<View style={{flex: 1}}>
				        		<TouchableOpacity onPress={remove} style={styles.blocker} />
								<TouchableOpacity onPress={remove} style={styles.blocker} />
								<TouchableOpacity onPress={remove} style={styles.blocker} />
								<TouchableOpacity onPress={remove} style={styles.blocker} />
							</View>
		        			<View style={{flex: 1}}>
				        		<TouchableOpacity onPress={remove} style={styles.blocker} />
								<TouchableOpacity onPress={remove} style={styles.blocker} />
								<TouchableOpacity onPress={remove} style={styles.blocker} />
								<TouchableOpacity onPress={remove} style={styles.blocker} />
							</View>
						</View>
	        		)}

			  	</ImageBackground>
		  	</View>

			<View style={styles.infoBox}>
				<Text style={styles.info}>{infoText}</Text>
			</View>

			<View style={styles.footer}>
				<TouchableOpacity onPress={() => showImage ? setShowImage(0) : setShowImage(1)} style={styles.button}>
					{showImage ?
						(<Ionicons name="ios-eye-off" size={35} color="white" />)
						:
						(<Ionicons name="ios-eye" size={35} color="white" />)
					}
				</TouchableOpacity>

				<TouchableOpacity onPress={saveToLibrary} style={styles.button}>
					<Ionicons name="md-save" size={32} color="white" />
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

    blocker: {
	    flex: 1,
	    backgroundColor: 'rgba(255, 255, 255, 0.97)',
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
        borderColor: 'white',
        height: 50,
	},

  image: {
    	flex: 1,
    	resizeMode: 'contain',
	},
  

});  
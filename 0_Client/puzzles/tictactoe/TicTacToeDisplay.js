// DESCRIPTION: Displays the next move of the TicTacToe by loading <filename> from the server.
import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, StatusBar, Image, TouchableOpacity, ImageBackground } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { StackActions } from 'react-navigation';


export default function TicTacToeDisplay(props) {
	
	const {navigate} = props.navigation;
	const {params} = props.navigation.state;
	const filename = params.filename;
	const winner = params.winner;

	const [permissionGranted, setPermissionGranted] = useState(null);
	const [infoText, setInfoText] = useState('Next move goes here!');


 	// Ask for camera roll permissions
	const getCameraRollPermissions = async () => {
	    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
	    setPermissionGranted(status == 'granted');
	}
	getCameraRollPermissions();

	const goHome = () => {
		props.navigation.dispatch(StackActions.popToTop());
	}

	return (
		<View style={styles.container}>
			<StatusBar hidden={true} />

			{winner ? (<Text style={{textAlign: 'center', fontSize: 32}}>{winner} won the game!</Text>) : null}
		
			<View style={{flex: 1}}>
	            <ImageBackground	
	            	source={{uri : 'http://ross-dev.live:5000/static/images/tictactoes/' + filename + '_next_move.jpg' +'?'+String(Math.random()), cache: 'reload'}}
	        		style={styles.image}
            		imageStyle={styles.image}>
			  	</ImageBackground>
		  	</View>

			<View style={styles.infoBox}>
				<Text style={styles.info}>{infoText}</Text>
			</View>

			<View style={styles.footer}>
				<TouchableOpacity onPress={goHome} style={styles.button}>
					<Ionicons name="ios-home" size={32} color="white" />
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
// DESCRIPTION: Displays the solved sudoku by loading <filename> from the server. Can save to camera roll.
import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, StatusBar, Image, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

export default function SudokuDisplay(props) {
	
	const {params} = props.navigation.state;
	const solution = params.solution;
	const detected = params.detected;
	const filename = params.filename;

	const [sudoku, setSudoku] = useState([...detected]);
	const [imageFlag, setImageFlag] = useState(0);
	const [permissionGranted, setPermissionGranted] = useState(null);
	const [solvedImageURI, setSolvedImageURI] = useState(null);

    // Updates the sudoku to reveal a digit selected by the user
    const updateDigit = (row_i, col_i) => {
		var temp = [...sudoku];
		temp[row_i][col_i] = solution[row_i][col_i];
		setSudoku(temp);
    }

    // Reveals the image and fills every digit
    const showSolutionToggle = () => {

    	if (imageFlag) {
    		setImageFlag(0);
    		setSudoku([...detected]);
    		return;
    	}

    	if (!solvedImageURI) {
	    	getCameraRollPermissions();
    		downloadFile();
    	}

    	setSudoku([...solution]);
    	setImageFlag(1);
    }

 	// Ask for camera roll permissions
	const getCameraRollPermissions = async () => {
	    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
	    setPermissionGranted(status == 'granted');
	}
	
	// Download the image (so it can be saved)
	const downloadFile = () => {
		FileSystem.downloadAsync(
		  'http://ross-dev.live:5000/static/images/sudokus/' + filename + '_sudoku_solved.jpg' +'?'+String(Math.random()),
		  FileSystem.documentDirectory + 'sudoku_solved.jpg'
		)
		  .then(({ uri }) => {
		    setSolvedImageURI(uri);
		  })
		  .catch(error => {
		    console.error(error);
		  });
	}

	// Save the image to the camera roll
	const saveToLibrary = async () => {
		if (!solvedImageURI) {
			alert('You must select \'Show All\' before saving!');
			return;
		}
	  	if (permissionGranted) {
		    try {
				await MediaLibrary.saveToLibraryAsync(solvedImageURI);
				alert('Saved Sudoku to Camera Roll');
		    } catch (e) {
		      alert(e.message);
		    }
	  	} else {
	  		alert('Please grant permissions and try again.');
	  		getCameraRollPermissions();
	  	}
	};

	return (
		<View style={styles.container}>

			<StatusBar hidden={true} />
			<Text> </Text>
			{imageFlag ?

				<Image style={{flex:1, resizeMode: 'contain'}} source={{
					uri : 'http://ross-dev.live:5000/static/images/sudokus/' + filename + '_sudoku_solved.jpg' +'?'+String(Math.random()),
					cache: 'reload',}}
				/> 
				:
				null
			}

            <View style={styles.sudoku}>
		          {sudoku.map((row, row_idx) =>
		            <View key={row_idx} style={styles.row}>
		              {row.map((value, col_idx) => {
		              	const normal = (
							<TouchableOpacity 
							key={col_idx}
							onPress={(value) => updateDigit(row_idx, col_idx)} 
							style={styles.cell}>
								<Text style={{textAlign: 'center'}}> {value} </Text>
							</TouchableOpacity>);

						const col_border = (
							<TouchableOpacity 
							key={col_idx}
							onPress={(value) => updateDigit(row_idx, col_idx)} 
							style={[styles.cell, styles.cell_col_border]}>
								<Text style={{textAlign: 'center'}}> {value} </Text>
							</TouchableOpacity>);
						      
						const row_border = (
							<TouchableOpacity 
							key={col_idx}
							onPress={(value) => updateDigit(row_idx, col_idx)} 
							style={[styles.cell, styles.cell_row_border]}>
								<Text style={{textAlign: 'center'}}> {value} </Text>
							</TouchableOpacity>);
						      
						const row_col_border = (
							<TouchableOpacity 
							key={col_idx}
							onPress={(value) => updateDigit(row_idx, col_idx)} 
							style={[styles.cell, styles.cell_row_col_border]}>
								<Text style={{textAlign: 'center'}}> {value} </Text>
							</TouchableOpacity>);

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
				<Text style={styles.info}>Tap any cell to reveal a digit!</Text>
          	</View>

            <View style={styles.footer}>
              <TouchableOpacity onPress={showSolutionToggle} style={styles.button}>
				{imageFlag ?
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

	text: {
		color: 'white',
	    textAlign: 'center', 
	    justifyContent: "center", 
	    alignItems: "center",
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
  
    sudoku: {
	    flex: 2,
	  	alignSelf: 'center',
	 	justifyContent: 'center',
	 },

	row: {
		flexDirection: 'row',
		backgroundColor: 'white',
    },
  
	cell: {
		width: 36,
		height: 36,
		borderColor:'grey',
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
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
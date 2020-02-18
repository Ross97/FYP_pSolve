// DESCRIPTION: Playground program to mess with camera styles
import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'


// http://www.reactnativeexpress.com/flexbox


export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.camera} />
        <View style={styles.button}> 
             <Text style={styles.text}>
                Take Photo
              </Text>
        </View>
 
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    width: 'stretch',
    height: 480,
    backgroundColor: 'black',
    borderWidth: 2,
    borderColor: 'steelblue',
    borderRadius: 20,
  },
    button: {
    flex: 1,
    width: 'stretch',
    height: 50,
    backgroundColor: 'grey',
    borderWidth: 2,
    borderColor: 'steelblue',
    borderRadius: 20,
  },
    text: {
    color: 'white',
    textAlign: 'center',
  },
})

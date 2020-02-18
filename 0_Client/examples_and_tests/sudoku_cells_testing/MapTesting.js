// DESCRIPTION: Program to demonstrate how .map() works with React Native
import React, { Component } from 'react'
import { View, StyleSheet, TextInput, Text } from 'react-native'


export default class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
         matrix: [5,7,9, 1, 2, 3, 4, 5, 6, 7]
      };
  }
  
  editMatrix(index, value) {
    this.setState({
      matrix: this.state.matrix.map((item, i) => {
        return (i == index) ? value : item;
      })
    });
  } 

  render() {
    return (
      <View style={styles.container}>
        
        { this.state.matrix.map((item,index) => (<Text>Index {index} item is {item}</Text>)) }


        {this.state.matrix.map((item,index) => (
            <TextInput 
              onChangeText={(number) => this.editMatrix(index, number)} 
              value={item} 
              type="numeric" 
              clearTextOnFocus={true} 
              keyboardType="number-pad" />))}

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
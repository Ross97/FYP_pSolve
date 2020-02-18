// DESCRIPTION: Entrypoint for pSolve app. Creates AppContainer / StackNavigator, styles headers.
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { createAppContainer, StackActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './HomeScreen';
import SudokuScan from './puzzles/sudoku/SudokuScan';
import SudokuCorrection from './puzzles/sudoku/SudokuCorrection';
import SudokuDisplay from './puzzles/sudoku/SudokuDisplay';
import DifferenceSelectImage1 from './puzzles/difference/DifferenceSelectImage1';
import DifferenceSelectImage2 from './puzzles/difference/DifferenceSelectImage2';
import DifferenceDisplay from './puzzles/difference/DifferenceDisplay';
import TicTacToeScan from './puzzles/tictactoe/TicTacToeScan';
import TicTacToeCorrection from './puzzles/tictactoe/TicTacToeCorrection';
import TicTacToeDisplay from './puzzles/tictactoe/TicTacToeDisplay';
import WordSearchScan from './puzzles/wordsearch/WordSearchScan';
import WordSearchCorrection from './puzzles/wordsearch/WordSearchCorrection';
import WordSearchDisplay from './puzzles/wordsearch/WordSearchDisplay';


// https://reactnavigation.org/docs/en/headers.html
const nav_options_home = (props) => ({
    title: 'Home',
    headerStyle: {
      backgroundColor: '#2fa4d9',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      // fontFamily: 'Script MT Bold, Bold',
    },
});

const nav_options_scan = (props) => ({
    title: 'Scan',
    headerStyle: {
      backgroundColor: '#2fa4d9',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: () => (
      <View>
        <TouchableOpacity onPress={() => props.navigation.dispatch(StackActions.popToTop())} style={{marginRight: 10}} >
          <Ionicons name="ios-home" size={32} color="white" />
        </TouchableOpacity>
      </View>
    ),
});

const nav_options_correction = (props) => ({
    title: 'Correction',
    headerBackTitle: 'Back',
    headerStyle: {
      backgroundColor: '#2fa4d9',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: () => (
      <View>
        <TouchableOpacity onPress={() => props.navigation.dispatch(StackActions.popToTop())} style={{marginRight: 10}} >
          <Ionicons name="ios-home" size={32} color="white" iconStyle={{marginRight: 10}} />
        </TouchableOpacity>
      </View>
    ),
});

const nav_options_solved = (props) => ({
    title: 'Solved Sudoku',
    headerBackTitle: 'Back',
    // headerLeft: null,
    headerStyle: {
      backgroundColor: '#2fa4d9',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: () => (
      <View>
        <TouchableOpacity onPress={() => props.navigation.dispatch(StackActions.popToTop())} style={{marginRight: 10}} >
          <Ionicons name="ios-home" size={32} color="white" iconStyle={{marginRight: 10}} />
        </TouchableOpacity>
      </View>
    ),
});

const nav_options_difference_select = (props) => ({
    title: 'Image Selection',
    headerBackTitle: 'Back',
    // headerLeft: null,
    headerStyle: {
      backgroundColor: '#2fa4d9',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: () => (
      <View>
        <TouchableOpacity onPress={() => props.navigation.dispatch(StackActions.popToTop())} style={{marginRight: 10}} >
          <Ionicons name="ios-home" size={32} color="white" iconStyle={{marginRight: 10}} />
        </TouchableOpacity>
      </View>
    ),
});

const nav_options_difference_display = (props) => ({
    title: 'Differences',
    headerBackTitle: 'Back',
    // headerLeft: null,
    headerStyle: {
      backgroundColor: '#2fa4d9',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: () => (
      <View>
        <TouchableOpacity onPress={() => props.navigation.dispatch(StackActions.popToTop())} style={{marginRight: 10}} >
          <Ionicons name="ios-home" size={32} color="white" iconStyle={{marginRight: 10}} />
        </TouchableOpacity>
      </View>
    ),
});

const nav_options_tictactoe_display = (props) => ({
    title: 'Next Move',
    headerLeft: null,
    headerStyle: {
      backgroundColor: '#2fa4d9',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: () => (
      <View>
        <TouchableOpacity onPress={() => props.navigation.dispatch(StackActions.popToTop())} style={{marginRight: 10}} >
          <Ionicons name="ios-home" size={32} color="white" iconStyle={{marginRight: 10}} />
        </TouchableOpacity>
      </View>
    ),
});

const nav_options_wordsearch_display = (props) => ({
    title: 'Word Locations',
    headerLeft: null,
    headerStyle: {
      backgroundColor: '#2fa4d9',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: () => (
      <View>
        <TouchableOpacity onPress={() => props.navigation.dispatch(StackActions.popToTop())} style={{marginRight: 10}} >
          <Ionicons name="ios-home" size={32} color="white" iconStyle={{marginRight: 10}} />
        </TouchableOpacity>
      </View>
    ),
});

const AppNavigator =  createStackNavigator({
	Home: {screen: HomeScreen, navigationOptions: nav_options_home },

	SudokuScan: {screen: SudokuScan, navigationOptions: nav_options_scan },
	SudokuCorrection: {screen: SudokuCorrection, navigationOptions: nav_options_correction },
	SudokuDisplay: {screen: SudokuDisplay, navigationOptions: nav_options_solved },

	DifferenceSelectImage1: {screen: DifferenceSelectImage1, navigationOptions: nav_options_difference_select },
	DifferenceSelectImage2: {screen: DifferenceSelectImage2, navigationOptions: nav_options_difference_select },
	DifferenceDisplay: {screen: DifferenceDisplay, navigationOptions: nav_options_difference_display },

	TicTacToeScan: {screen: TicTacToeScan, navigationOptions: nav_options_scan },
	TicTacToeCorrection: {screen: TicTacToeCorrection, navigationOptions: nav_options_correction },
	TicTacToeDisplay: {screen: TicTacToeDisplay, navigationOptions: nav_options_tictactoe_display },
  
	WordSearchScan: {screen: WordSearchScan, navigationOptions: nav_options_scan },
	WordSearchCorrection: {screen: WordSearchCorrection, navigationOptions: nav_options_correction },
	WordSearchDisplay: {screen: WordSearchDisplay, navigationOptions: nav_options_wordsearch_display },
}); 

const AppContainer = createAppContainer(AppNavigator);

export default function App() {

	return (
		<AppContainer />
	);
}


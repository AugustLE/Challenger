import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import GamesScreen from '../screens/GamesScreen';
import MathBoxGame from '../screens/MathBoxGame';
import CountryGuesser from '../screens/CountryGuesser';
import WordGuesser from '../screens/WordGuesser';
import ScoreScreen from '../screens/ScoreScreen';
import AnimalGuesser from '../screens/AnimalGuesser';
//import SettingsScreen from '../screens/SettingsScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'User',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  )
};


const GamesStack = createStackNavigator({
  Games: GamesScreen,
  MathBoxGame: MathBoxGame,
  CountryGuesser: CountryGuesser,
  WordGuesser: WordGuesser,
  AnimalGuesser: AnimalGuesser,
  ScoreScreen: ScoreScreen
}, {
  headerMode: 'none'
});

GamesStack.navigationOptions = {
  tabBarLabel: 'Games',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  )
};

/*const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});
SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};*/

export default createBottomTabNavigator({
  HomeStack,
  GamesStack
  //SettingsStack,
});

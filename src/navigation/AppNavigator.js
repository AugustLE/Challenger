import React from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import Login from '../screens/Login';
import Register from '../screens/Register';

const startNavigator = createStackNavigator(
  {
    Login: Login,
    Register: Register
  },
  {
    headerMode: 'none'
  }
);

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Start: startNavigator,
    Main: MainTabNavigator
  })
);

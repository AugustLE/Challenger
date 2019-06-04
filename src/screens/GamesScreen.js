import React from 'react';
import { View, Image, Text, TouchableOpacity, StatusBar } from 'react-native';
import { PrimaryButton } from '../components/common';
import GlobalStyles from '../GlobalStyles';

class GamesScreen extends React.Component {
  static navigationOptions = {
    //title: 'Choose a game',
    headerMode: 'none'
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="light-content" />
        <View style={styles.topContainer}>
          <Text style={styles.titleStyle}>Games</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => this.props.navigation.navigate('CountryGuesser')}>
            <Image style={styles.imageStyle} source={require('../../assets/icons/skyline.png')} />
            <Text style={styles.textStyle}>CountryGuess</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => this.props.navigation.navigate('AnimalGuesser')}>
            <Image style={styles.imageStyle} source={require('../../assets/icons/skyline.png')} />
            <Text style={styles.textStyle}>AnimalGuess</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => this.props.navigation.navigate('MathBoxGame')}>
            <Image style={styles.imageStyle} source={require('../../assets/icons/calculator.png')} />
            <Text style={styles.textStyle}>MathGame</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => this.props.navigation.navigate('WordGuesser')}>
            <Image style={styles.imageStyle} source={require('../../assets/icons/board-game.png')} />
            <Text style={styles.textStyle}>WordGuess</Text>
          </TouchableOpacity>
        </View>
      </View>

    );
  }
}

const styles = {
  container: {
    flex: 1,
    //paddingTop: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',

  },
  menuContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flex: 4,
  },
  imageButton: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 5
  },
  imageStyle: {
    width: 80,
    height: 80
  },
  textStyle: {
    fontSize: 20,
    fontFamily: GlobalStyles.fontFamily,
    marginTop: 15,
  },
  titleStyle: {
    fontSize: 40,
    fontFamily: GlobalStyles.fontFamily,
    color: 'white',
    fontWeight: '600'
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.themeColor,
    width: '100%',
    paddingTop: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 2,
  }
};

export default GamesScreen;

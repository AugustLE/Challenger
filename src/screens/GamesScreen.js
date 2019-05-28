import React from 'react';
import { View } from 'react-native';
import { PrimaryButton } from '../components/common';

class GamesScreen extends React.Component {
  static navigationOptions = {
    title: 'Choose a game',
  };

  render() {
    return (
      <View style={styles.container}>
        <PrimaryButton
          onPress={() => this.props.navigation.navigate('CityGuesser')}
          title="CityGuesser">
          CityGuesser
          </PrimaryButton>
        <PrimaryButton
          style={{ marginTop: 10 }}
          onPress={() => this.props.navigation.navigate('MathBoxGame')}>
          MathGame
        </PrimaryButton>
        <PrimaryButton
          style={{ marginTop: 10 }}
          onPress={() => this.props.navigation.navigate('WordGuesser')}>
          WordGuesser
        </PrimaryButton>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default GamesScreen;

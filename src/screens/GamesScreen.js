import React from 'react';
import { View, Text } from 'react-native';

class GamesScreen extends React.Component {
  static navigationOptions = {
    title: '',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Games</Text>
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
  },
};

export default GamesScreen;

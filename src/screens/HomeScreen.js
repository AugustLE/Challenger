import React from 'react';
import { View, Text } from 'react-native';

class HomeScreen extends React.Component {
  static navigationOptions = {

  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>HOME</Text>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 20,

  }
};

export default HomeScreen;

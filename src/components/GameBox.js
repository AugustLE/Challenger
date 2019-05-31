import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import GlobalStyles from '../GlobalStyles';

class GameBox extends Component {

  state = { number: 0 }

  render() {
    return (
      <TouchableOpacity
        style={[styles.boxContainer, { backgroundColor: color }]}
        key={number}
        onPress={this.props.answerBox}>
        <Text style={styles.boxText}>{this.props.number}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = {
  boxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    elevation: 2,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10
  },
  boxText: {
    fontFamily: GlobalStyles.fontFamily,
    fontSize: 30
  },
}

export default GameBox;

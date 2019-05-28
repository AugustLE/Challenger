import React from 'react';
import { View, Text } from 'react-native';
import GlobalStyles from '../GlobalStyles';

const CountdownBar = (props) => {
  const barWidth = () => {
    return (((props.time_left / props.max_time) * 100).toString() + '%');
  };

  return (
    <View style={[styles.container, { width: barWidth() }]}>
      <Text style={styles.textStyle}>{props.time_left}</Text>
    </View>
  );
};

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.themeColor,
    height: 50,
    borderRadius: 5
  },
  textStyle: {
    fontFamily: GlobalStyles.fontFamily,
    fontSize: 30,
    fontWeight: '600',
    color: 'white'
  }
};

export default CountdownBar;

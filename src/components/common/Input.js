import React from 'react';
import { TextInput, View } from 'react-native';
import GlobalStyles from '../../GlobalStyles';

const Input = (props) => {
  return (
    <View style={[styles.containerStyle, props.style]}>
      <TextInput
        secureTextEntry={props.secureTextEntry}
        style={[styles.inputStyle, props.inputStyle]}
        onChangeText={props.onChangeText}
        value={props.value}
        autoCorrect={false}
        placeholder={props.placeholder}
        multiline={props.multiline}
        keyboardType={props.keyboardType}
        maxLength={props.maxLength}
        returnKeyType={props.returnKeyType}
        onSubmitEditing={props.onSubmitEditing}
      />
    </View>
  );
};

const styles = {

  inputStyle: {
    color: '#000',
    paddingLeft: 15,
    fontSize: 20,
    lineHeight: 23,
    flex: 1,
    fontFamily: GlobalStyles.fontFamily,
  },
  containerStyle: {

    padding: 10,
    marginTop: 8,
    flexDirection: 'row',
    backgroundColor: '#f7f5f5',
    width: '90%',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 1,

  }
};

export { Input };

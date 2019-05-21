import React from 'react';
import { View } from 'react-native';
import { PrimaryButton } from '../components/common';
import { setUserField, logoutUser } from '../actions';
import { connect } from 'react-redux';


class HomeScreen extends React.Component {
  static navigationOptions = {
    title: '',
  };

  handleLogout=()=>{
      this.props.logoutUser();
      this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <View style={styles.container}>
      <PrimaryButton
        style={{ width: '90%', marginTop: 15, borderRadius: 2 }}
        onPress={this.handleLogout.bind(this)}>
        Logout
      </PrimaryButton>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  textStyle: {
    fontSize: 20
  }
};

const mapStateToProps = (state) => {
  const {  } = state;
  return {  };
};

export default connect(mapStateToProps, { setUserField, logoutUser })(HomeScreen);

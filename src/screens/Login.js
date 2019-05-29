import React, { Component } from 'react';
import { View, Image, Text, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { setUserField, loginUser } from '../actions';
import { PrimaryButton, Input, Spinner, SimpleButton } from '../components/common';
import GlobalStyles from '../GlobalStyles';
import { auth} from "../../firebase";
//import ResetPassModal from './ResetPassModal';

class Login extends Component {

  state = {
    username: '',
    password: '',
    loading: false,
    errors: false,
    error_text: '',
  }


  loginUser() {
    //Kode for å logge inn brukeren
    this.setState({loading:true});
    this.props.loginUser(this.state.username,this.state.password)
    .then(()=>{
      this.setState({loading:false});
      this.props.navigation.navigate('Main');
    });
  }

  register() {
    console.log('REGISTER');
    this.props.navigation.navigate('Register');
  }

  componentDidMount() {

    auth.onAuthStateChanged((user) => {
        if (user != null) {
          this.props.navigation.navigate('CityGuesser');
          }
        }
      );
        // Do other things
  }

  renderError() {
    if (this.state.errors) {
      return (
        <Text style={{ color: 'red', fontFamily: GlobalStyles.fontFamily, marginTop: 5 }}>
          {this.state.error_text}
        </Text>
      );
    }
  }

  renderLoginButton() {
    if (this.state.loading) {
      return (
        <View style={{ alignItems: 'center', flex: 1, marginTop: 20 }}>
          <Text style={{ color: 'gray', fontFamily: GlobalStyles.fontFamily }}>Logger inn...</Text>
          <Spinner style={{ marginTop: 10 }} />
        </View>
      );
    }
    return (
      <PrimaryButton
        style={{ width: '90%', marginTop: 15, borderRadius: 2 }}
        onPress={this.loginUser.bind(this)}>
        Login
      </PrimaryButton>
    );
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.topNav}>
          <Image style={styles.logoStyle} source={require('../../assets/images/robot-dev.png')} />
        </View>

        <View style={styles.midContainer}>
          <View style={styles.input}>
            <Input
              placeholder={'Email'}
              onChangeText={(text) => this.setState({ username: text })}
              value={this.state.username.toLowerCase()}
              autoCapitalize={false}
            />
            <Input
              placeholder={'Password'}
              onChangeText={(text) => this.setState({ password: text })}
              value={this.state.password}
              secureTextEntry={true}
            />
          </View>
          {this.renderError()}
          {this.renderLoginButton()}
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.bottomTextStyle}>
            Don´t have an account?
          </Text>
          <SimpleButton
            onPress={this.register.bind(this)}>
            Register now
          </SimpleButton>
        </View>
        <StatusBar
          backgroundColor="white"
          barStyle="dark-content"
        />
      </View>
    );
  }
}

const styles = {

  topNav: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 20,


  },
  logoStyle: {
    width: 100,
    height: 100
  },

  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },

  input: {
    //flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'column'
  },

  midContainer: {
    width: '100%',
    marginTop: 25,
    alignItems: 'center',
    flex: 3
  },
  bottomContainer: {
    width: '100%',
    marginTop: 25,
    //alignItems: 'center',
    flex: 1
  },
  bottomTextStyle: {
    fontFamily: GlobalStyles.fontFamily,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  }
};

const mapStateToProps = (state) => {
  const { user } = state.user;
  return { user };
};

export default connect(mapStateToProps, { setUserField , loginUser})(Login);

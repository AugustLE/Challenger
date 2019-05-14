import React, { Component } from 'react';
import { View, Text, Image, StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { setUserField } from '../actions';
import { PrimaryButton, Input, Spinner, ErrorText, SimpleButton } from '../components/common';
import GlobalStyles from '../GlobalStyles';
import GlobalVars from '../GlobalVars';

const initial_state = {
  email: '',
  password: '',
  password_repeat: '',
  render_errors: false,
  error: true,
  loading: false,
  reg_error: null,
};

class Register extends Component {

  state = initial_state;

  back_login() {
    this.props.navigation.goBack();
  }

  register() {
    const url = GlobalVars.api_url + '/user/register/';
    this.setState({ render_errors: true });
    if (this.clear_of_errors()) {
      this.setState({ loading: true });
      // Kjør kode som registrerer
      //
    }
  }

  fc(field, check = 4) {
    if (field.length < check) {
      return false;
    }
    return true;
  }

  clear_of_errors() {
    const { email, password, password_repeat } = this.state;
    if (!this.fc(email)) {
      return false;
    }
    if (password !== password_repeat || password.length < 8) {
      return false;
    }
    return true;
  }

  renderError(text) {
    if (this.state.render_errors) {
      return (
        <ErrorText>
          {text}
        </ErrorText>
      );
    }
  }

  renderErrorFields() {
    const { email } = this.state;
    if (this.fc(email)) {
      return;
    }
    return this.renderError('All fields must be completed');
  }

  renderErrorPassword() {
    const { password, password_repeat } = this.state;
    if (password.localeCompare(password_repeat) === 0 && password.length >= 8) {
      return;
    }
    const error_string = 'Passwords must match and contain at least 8 symbols';
    return this.renderError(error_string);
  }

  renderRegError() {
    if (this.state.reg_error) {
      return (
        <ErrorText>
          {this.state.reg_error}
        </ErrorText>
      );
    }
  }

  renderRegButton() {
    if (this.state.loading) {
      return (
        <View style={{ alignItems: 'center', flex: 1, marginTop: 20 }}>
          <Text style={{ color: 'gray', fontFamily: GlobalStyles.fontFamily }}>Register and logging in...</Text>
          <Spinner style={{ marginTop: 10 }} />
        </View>
      );
    }
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        {this.renderRegError()}
        <PrimaryButton
          style={{ width: '90%', marginTop: 15, borderRadius: 2 }}
          onPress={this.register.bind(this)}>
          Register
        </PrimaryButton>
      </View>
    );
  }

  render() {
    return (
      <KeyboardAwareScrollView style={{ width: '100%', flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>

        <View style={styles.topNav}>
          <Image style={styles.logoStyle} source={require('../../assets/images/robot-dev.png')} />
        </View>

        <View style={styles.midContainer}>
          <View style={styles.input}>
            <Input
              placeholder={'Email'}
              onChangeText={(text) => this.setState({ email: text })}
              value={this.state.email.toLowerCase()}
              keyboardType='email-address'
            />
            {this.renderErrorFields()}
            <Input
              placeholder={'Password'}
              onChangeText={(text) => this.setState({ password: text })}
              value={this.state.password}
              secureTextEntry={true}
            />
            <Input
              placeholder={'Repeat password'}
              onChangeText={(text) => this.setState({ password_repeat: text })}
              value={this.state.password_repeat}
              secureTextEntry={true}
            />
            {this.renderErrorPassword()}
          </View>
          {this.renderRegButton()}


        </View>

        <View style={styles.bottomContainer}>
          <Text style={{ fontFamily: GlobalStyles.fontFamily, fontSize: 18 }}>
            Already member?
          </Text>
          <SimpleButton onPress={this.back_login.bind(this)}>
            Login
          </SimpleButton>

        </View>
        <StatusBar
          backgroundColor="white"
          barStyle="dark-content"
        />
      </View>
      </KeyboardAwareScrollView>
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
    flex: 1

  },
  logoStyle: {
    width: 100,
    height: 100
  },

  container: {
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
    flex: 4
  },

  bottomContainer: {
    width: '100%',
    marginTop: 50,
    marginBottom: 5,
    alignItems: 'center',
    flex: 1
  },
};

const mapStateToProps = (state) => {
  const { user } = state.user;
  return { user };
};

export default connect(mapStateToProps, { setUserField })(Register);

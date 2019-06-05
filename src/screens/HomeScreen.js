import React from 'react';
import { View, Text, Image } from 'react-native';
import { PrimaryButton } from '../components/common';
import { setUserField, logoutUser, getCurrentUser } from '../actions';
import { connect } from 'react-redux';
import GlobalStyles from '../GlobalStyles';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: '',
  };

  state = {
    current_user: '',
  }

  handleLogout=()=>{
      this.props.logoutUser();
      this.props.navigation.navigate('Login');
  }

  componentDidMount(){
    let user = this.props.getCurrentUser();
    this.setState({current_user:user});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logoStyle} source={require('../../assets/icons/idea.png')} />

        </View>
        <View style={styles.topContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.imageStyle}
              source={require('../../assets/icons/user_blue.png')}
              resizeMode='contain'
            />
            <Text style={styles.textStyle}>{this.state.current_user}</Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <PrimaryButton
            style={{ width: '90%', marginTop: 15, borderRadius: 2, marginTop: 20 }}
            onPress={this.handleLogout.bind(this)}>
            Logout
          </PrimaryButton>
        </View>
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
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: 40,
    height: 40
  },
  textStyle: {
    fontSize: 20,
    fontFamily: GlobalStyles.fontFamily,
    fontWeight: '600',
    color: GlobalStyles.themeColor,
    marginLeft: 15
  },
  topContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleStyle: {
    fontSize: 25,
    fontFamily: GlobalStyles.fontFamily,
    fontWeight: '600',
    marginTop: 15,
    color: GlobalStyles.themeColor
  },
  logoStyle: {
    width: 90,
    height: 90,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    flex: 2,
    backgroundColor: '#f5f5f5'
  }
};


const mapStateToProps = (state) => {
  const {  } = state;
  return {  };
};

export default connect(mapStateToProps, { setUserField, logoutUser, getCurrentUser })(HomeScreen);

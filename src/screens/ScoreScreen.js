import React, { Component } from 'react';
import { View, FlatList, Text, StatusBar } from 'react-native';
import { PrimaryButton, SecondaryButton, Spinner } from '../components/common';
import GlobalStyles from '../GlobalStyles';
import {  getHighscores,getCurrentUserHigh } from '../actions';
import { connect } from 'react-redux';


class ScoreScreen extends Component {

  static navigationOptions = {
    title: 'Highscore',
    headerMode: 'screen'
  };

  state = {
    game_type: '',
    highscores: [],
    user_highscore: 0,
    loading: false
  }

  componentDidMount() {
    const game_type = this.props.navigation.getParam('game_type', '');
    this.props.getCurrentUserHigh(game_type);
    this.getHighscores(game_type);

  }


  getHighscores(game_type) {
    this.setState({loading:true});
    this.props.getHighscores(game_type).then(()=>{
      this.setState({loading:false});
    });
  }

  renderItem(item) {
    return (

      <View style={styles.listItemStyle}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>{item.user}</Text>
          <Text style={styles.textStyle}>{item.score}</Text>
        </View>
      </View>
    );
  }

  renderList() {
    return (
      <View style={{ width: '100%', flex: 4, marginBottom: 10 }}>
        <FlatList
          data={this.props.highscores}
          renderItem={object => this.renderItem(object.item)}
          keyExtractor={item => item.pk.toString()}
          style={{ flex: 1, width: '100%' }}
          navigation={this.props.navigation}
          contentContainerStyle={styles.listContentStyle}
        />
      </View>
    );
  }

  render() {
    if (this.state.loading){
      return (
        <View style={styles.container}>
          <Spinner text="Loading highscores"/>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="dark-content" />
        <View style={styles.topContainer}>
          <Text style={styles.highscoreText}>Your highscore: {this.props.user_highscore}</Text>
          <PrimaryButton
            style={{ position: 'absolute', width: 60, left: 10, top: 40 }}
            textStyle={{ fontSize: 20, margin: 0 }}
            onPress={() => this.props.navigation.goBack()}>
            {'<--'}
          </PrimaryButton>
        </View>
        <View style={[styles.listItemStyle, { backgroundColor: GlobalStyles.themeColor, marginTop: 10 }]}>
          <View style={styles.textContainer}>
            <Text style={styles.textStyle}>User</Text>
            <Text style={styles.textStyle}>Score</Text>
          </View>
        </View>
        {this.renderList()}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContentStyle: {
    paddingBottom: 15,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listTitle: {
    fontFamily: GlobalStyles.fontFamily,
    fontSize: 30,
    padding: 4,
    paddingTop: 10,
    paddingLeft: 10,
  },
  listItemStyle: {

    width: '95%',
    borderRadius: 2,
    backgroundColor: '#fff',
    //justifyContent: 'center',
    //alignItems: 'center',
    flexDirection: 'row',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 1,
    padding: 5,
    margin: 2,
    //display: 'flex',
    //position: 'relative',
  },
  textStyle: {

    fontSize: 18,
    padding: 6,
    fontWeight: '600',
    textAlign: 'left',
    paddingLeft: 6,
    fontFamily: GlobalStyles.fontFamily,
    flex: 1
  },
  textContainer: {
    //justifyContent: 'center',
    paddingLeft: 5,
    flex: 1,
    flexDirection: 'row'
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: GlobalStyles.themeColor,
    width: '100%',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 1,
    paddingTop: 40
  },
  highscoreText: {
    fontSize: 25,
    fontWeight: '600',
    color: 'white',
    fontFamily: GlobalStyles.fontFamily,
    paddingLeft: 15,
    textAlign: 'center'
  }
}
const mapStateToProps = (state) => {
  const { highscores, user_highscore } = state.user;
  return { highscores, user_highscore };
};

export default connect(mapStateToProps, { getHighscores, getCurrentUserHigh })(ScoreScreen);

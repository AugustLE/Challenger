import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Image,TouchableOpacity } from 'react-native';
import axios from 'axios';
import timer from 'react-native-timer';
import randomColor from 'randomcolor';
import GameVars from '../constants/GameVars';
import GlobalStyles from '../GlobalStyles';
import CountdownBar from '../components/CountdownBar';
import { PrimaryButton, SecondaryButton, ErrorText } from '../components/common';
import {  updateHighscore } from '../actions';
import { connect } from 'react-redux';


String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

const gameConfig = {
  time_lvl_easy: 5,
  time_to_start: 3

}

const initial_state = {
  lives: 3,
  attempts: 1,
  game_time_remaining: 5,
  game_time_lvl: gameConfig.time_lvl_easy,
  game_running: false,
  game_over: false,
  current_shortest: '',
  current_alternatives: [],
  level_number: 0,
  time_to_start: gameConfig.time_to_start,
  show_countdown: false,
  user_points: 0,
  gave_right_answer: false,
  levelColor: '#d1fffe'
}

class ShortestGuesser extends Component {

  state = initial_state;

  componentDidMount() {
    //this.setState({ words: GameVars.words });
    ///this.startGameCountdown();
    //this.startLevelCountdown();
  }

  startLevelCountdown() {
    timer.clearInterval('LevelCountdown');
    timer.clearInterval('GameCountdown');
    let random_color = this.state.levelColor;
    if (this.state.level_number > 0) {
      random_color = randomColor({ alpha: 0.3 });
    }
    this.setState({ show_countdown: true, game_time_remaining: 5, levelColor: random_color, game_running: true });
    this.generateAlernatives();
    timer.setInterval('LevelCountdown', this.timeoutNextLevel.bind(this), 1000);
  }


  timeoutNextLevel() {
    this.setState({ time_to_start: this.state.time_to_start - 1 });
    if (this.state.time_to_start === 0) {
      timer.clearInterval('LevelCountdown');

      this.setState({
        show_countdown: false,
        level_number: this.state.level_number + 1,
        gave_right_answer: false
      });
      this.startGameCountdown();
    }
  }

  startGameCountdown() {

    this.setState({ time_to_start: gameConfig.time_to_start, show_countdown: false, game_running: true });
    timer.setInterval('GameCountdown', this.secIntervalGame.bind(this), 1000);
  }

  secIntervalGame() {
    this.setState({ game_time_remaining: this.state.game_time_remaining - 1 });
    if (this.state.game_time_remaining === 0) {
      const { lives, attempts } = this.state;

      if (lives === 1) {
        this.gameOver();
      } else {
        this.setState({ lives: lives - 1 });
        this.startLevelCountdown();
      }
      timer.clearInterval('GameCountdown');

      //this.setState({ game_over: true, game_running: false });
    }
  }


  generateAlernatives() {
    var min = 60;
    var max = 110;
    if (this.state.level_number>=40){
      max = 70;
    }
    else{
      max = max-this.state.level_number;
    }
    var altArray = [];
    while(altArray.length < 5){
      var r = Math.floor(Math.random()*(max-min+1)+min);
      if(altArray.indexOf(r) === -1) altArray.push(r);
    }
    console.log("altArray "+altArray);
    const smallest = Math.min(...altArray);
    const smallest_index = altArray.indexOf(smallest);
    var alternatives = [altArray[0],altArray[1],altArray[2],altArray[3],altArray[4]];
    this.setState({ current_shortest: smallest,current_alternatives:alternatives });
  }



  giveAnswer(answer) {
    const { current_shortest, level_number, lives, attempts, user_points } = this.state;
    if (answer === current_shortest) {
      this.setState({ attempts: 1, user_points: user_points + 1, gave_right_answer: true });
      this.startLevelCountdown();
    } else {
      let new_attempts = attempts - 1;
      this.setState({ attempts: new_attempts });
      if (lives === 1 && new_attempts === 0) {
        this.gameOver();
      } else if (lives > 1 && new_attempts === 0) {
        this.setState({ lives: lives - 1, attempts: 1, gave_right_answer: false });
        this.startLevelCountdown();
      }
    }
  }

  gameOver(){
    this.props.updateHighscore('shortest',this.state.user_points)
    this.setState({ game_over: true, lives: 3, attempts: 1, gave_right_answer: false, game_running: false });

  }

  startNew() {
    this.setState(initial_state);
    this.startLevelCountdown();
  }

  renderErrorText() {
    if (this.state.attempts < 3) {
      return (
        <ErrorText style={{ marginTop: 15, fontSize: 20 }}>
          Wrong answer! Try again...
        </ErrorText>
      );
    }
  }

  renderStartMenu(button_title) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <PrimaryButton style={{ marginTop: 20 }} onPress={this.startNew.bind(this)}>
          {button_title}
        </PrimaryButton>
        <SecondaryButton
          onPress={() => this.props.navigation.navigate('ScoreScreen', { game_type: 'shortest' })}
          style={{ marginTop: 10 }}>
          Highscore
        </SecondaryButton>
        <SecondaryButton
          onPress={() => this.props.navigation.goBack()}
          style={{ marginTop: 10 }}>
          Go back
        </SecondaryButton>
      </View>
    );
  }

  render() {
    if (this.state.game_over) {
      return (
        <View style={styles.container}>
          <Text style={[styles.levelOverText, { fontSize: 42 }]}>GAME OVER :(</Text>
          <Text style={[styles.levelOverText, { fontSize: 30, marginTop: 20 }]}>You got {this.state.user_points} points 🏅</Text>
          {this.renderStartMenu('Try again!')}
        </View>
      );
    }

    if (!this.state.game_running && !this.state.show_countdown) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
          {this.renderStartMenu('Start game!')}
        </View>
      );
    }

    if (this.state.show_countdown) {
      if (this.state.level_number > 0) {
        let lvl_text = 'You completed level ' + this.state.level_number + ' ✅';
        if (!this.state.gave_right_answer) {
          lvl_text = 'Wrong answer.. ❌'
        }
        return (
          <View style={styles.container}>
            <Text style={[styles.levelOverText, { fontSize: 30, marginBottom: 20, fontWeight: '600' }]}>{lvl_text}</Text>
            <Text style={[styles.levelOverText, { fontSize: 20, marginBottom: 20, fontWeight: '600' }]}>Remaining lives: {this.state.lives}</Text>
            <Text style={styles.levelOverText}>Next level starting in..</Text>
            <Text style={[styles.levelOverText, { fontSize: 60, marginTop: 20 }]}>{this.state.time_to_start}</Text>
          </View>
        );
      }
      return (
        <View style={styles.container}>
          <Text style={styles.levelOverText}>Starting in..</Text>
          <Text style={[styles.levelOverText, { fontSize: 60, marginTop: 20 }]}>{this.state.time_to_start}</Text>
        </View>
      );

    }
    return (
      <View style={styles.container}>

        <View style={[styles.topContainer, { backgroundColor: this.state.levelColor }]}>
          <View style={styles.horizontalContainer}>
            <Text style={styles.livesTxt}>❤️ {this.state.lives}</Text>
            <Text style={styles.scoreTxt}>🏅 {this.state.user_points}</Text>
          </View>
          <Text style={styles.levelText}>Level {this.state.level_number}</Text>
          <CountdownBar max_time={this.state.game_time_lvl} time_left={this.state.game_time_remaining} />
        </View>
        <View style={styles.bottomContainer}>
          <View style={[styles.bottomPart, { flex: 2 }]}>
            <Text style={styles.subTitle}>Guess the shortest:</Text>
            <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[styles.lineBox,{width:this.state.current_alternatives[0], backgroundColor:this.state.levelColor}]}
              onPress={() => this.giveAnswer(this.state.current_alternatives[0])}>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.lineBox,{width:this.state.current_alternatives[1], backgroundColor:this.state.levelColor}]}
              onPress={() => this.giveAnswer(this.state.current_alternatives[1])}>
            </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[styles.lineBox,{width:this.state.current_alternatives[2], backgroundColor:this.state.levelColor}]}
              onPress={() => this.giveAnswer(this.state.current_alternatives[2])}>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.lineBox,{width:this.state.current_alternatives[3], backgroundColor:this.state.levelColor}]}
              onPress={() => this.giveAnswer(this.state.current_alternatives[3])}>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.lineBox,{width:this.state.current_alternatives[4], backgroundColor:this.state.levelColor}]}
              onPress={() => this.giveAnswer(this.state.current_alternatives[4])}>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  topContainer: {
    flex: 1,
    backgroundColor: '#b4ffe8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30
  },
  bottomContainer: {
    flex: 3,
    //backgroundColor: 'white',
    width: '100%',
    alignItems: 'center'
  },
  lineBox:{
    backgroundColor: 'black',
    height: 25,
    margin: 25,
  },
  levelText: {
    fontSize: 30,
    fontFamily: GlobalStyles.fontFamily,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 2,
  },
  word: {
    fontFamily: GlobalStyles.fontFamily,
    fontSize: 45,
    textAlign: 'center',
    marginTop: 20
  },
  subTitle: {
    fontSize: 25,
    fontFamily: GlobalStyles.fontFamily,
    //color: GlobalStyles.themeColor,
    //fontWeight: '600',
    marginTop: 30,
    fontWeight: '600'
  },
  horizontalContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%'

  },
  livesTxt: {
    fontFamily: GlobalStyles.fontFamily,
    fontSize: 18,
    position: 'absolute',
    top: -5,
    left: 10,
    fontWeight: '600'
  },
  scoreTxt: {
    fontFamily: GlobalStyles.fontFamily,
    fontSize: 18,
    position: 'absolute',
    top: -5,
    right: 10,
    fontWeight: '600'
  },
  inputHeader: {
    fontSize: 20,
    fontFamily: GlobalStyles.fontFamily,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600'
  },
  bottomPart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  levelOverText: {
    fontSize: 25,
    fontFamily: GlobalStyles.fontFamily,
    textAlign: 'center'
  },
  altButton: {
    margin: 5
  }
}
const mapStateToProps = (state) => {
  const { highscores } = state.user;
  return { highscores: highscores };
};

export default connect(mapStateToProps, { updateHighscore })(ShortestGuesser);

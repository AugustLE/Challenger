import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView } from 'react-native';
import timer from 'react-native-timer';
import randomColor from 'randomcolor';
import GameVars from '../constants/GameVars';
import GlobalStyles from '../GlobalStyles';
import CountdownBar from '../components/CountdownBar';
import { Input, PrimaryButton, SecondaryButton, ErrorText } from '../components/common';


String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

const gameConfig = {
  time_lvl_easy: 20,
  time_to_start: 3

}

const initial_state = {
  words: GameVars.words,
  lives: 3,
  attempts: 3,
  game_time_remaining: 20,
  game_time_lvl: gameConfig.time_lvl_easy,
  game_running: false,
  game_over: false,
  current_word: '',
  level_number: 0,
  user_answer: '',
  time_to_start: gameConfig.time_to_start,
  show_countdown: false,
  user_points: 0,
  gave_right_answer: false,
  levelColor: '#d1fffe'
}

class WordGuesser extends Component {

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
    this.setState({ show_countdown: true, game_time_remaining: 20, levelColor: random_color, game_running: true });
    this.getRandomWord();
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

    this.setState({ time_to_start: gameConfig.time_to_start, show_countdown: false });
    timer.setInterval('GameCountdown', this.secIntervalGame.bind(this), 1000);
  }

  secIntervalGame() {
    this.setState({ game_time_remaining: this.state.game_time_remaining - 1 });
    if (this.state.game_time_remaining === 0) {
      const { lives, attempts } = this.state;

      if (lives === 1) {
        this.setState({
          game_over: true,
          lives: 3,
          attempts: 3,
          game_running: false
        });
      } else {
        this.setState({ lives: lives - 1 });
        this.startLevelCountdown();
      }
      timer.clearInterval('GameCountdown');

      //this.setState({ game_over: true, game_running: false });
    }
  }


  getRandomWord() {
    const { words } = this.state;
    if (words.length > 0) {
      console.log('NEW WORD');
      const word = words[Math.floor(Math.random() * words.length)];
      const word_index = words.indexOf(word);
      const new_words = words;
      new_words.splice(word_index, 1);
      this.setState({ words: new_words, current_word: word, user_answer: '' });
    }
  }

  getMaskedWord(current_word) {
    if (current_word.length <= 5) {
      return current_word.replaceAt(2, '_');
    } else if (current_word.length <= 8) {
      let masked_word = current_word.replaceAt(1, '_');
      masked_word = masked_word.replaceAt(4, '_');
      return masked_word;
    } else {
      let masked_word = current_word.replaceAt(1, '_');
      masked_word = masked_word.replaceAt(3, '_');
      masked_word = masked_word.replaceAt(5, '_');
      return masked_word;
    }
  }

  giveAnswer() {
    const { user_answer, current_word, level_number, lives, attempts, user_points } = this.state;
    if (user_answer === current_word) {
      this.setState({ attempts: 3, user_points: user_points + 1, gave_right_answer: true });
      this.startLevelCountdown();
    } else {
      let new_attempts = attempts - 1;
      this.setState({ attempts: new_attempts });
      if (lives === 1 && new_attempts === 0) {
        this.setState({ game_over: true, lives: 3, attempts: 3, gave_right_answer: false });
      } else if (lives > 1 && new_attempts === 0) {
        this.setState({ lives: lives - 1, attempts: 3, gave_right_answer: false });
        this.startLevelCountdown();
      }
    }
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
      <View>
        <PrimaryButton style={{ marginTop: 20 }} onPress={this.startNew.bind(this)}>
          {button_title}
        </PrimaryButton>
        <SecondaryButton
          onPress={() => this.props.navigation.navigate('ScoreScreen', { game_type: 'word' })}
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
          {this.renderStartMenu('Try again')}
        </View>
      );
    }
    if (!this.state.show_countdown && !this.state.game_running) {
      return(
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          {this.renderStartMenu('Start Game!')}
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
      <KeyboardAvoidingView
        style={{ width: '100%', flex: 1 }}
        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
        behavior="padding"
        enabled
        >

      <View style={styles.container}>
        <View style={[styles.topContainer, { backgroundColor: this.state.levelColor }]}>
          <View style={styles.horizontalContainer}>
            <Text style={styles.livesTxt}>❤️ {this.state.lives}</Text>
            <Text style={styles.scoreTxt}>🏅 {this.state.user_points}</Text>
            <Text style={styles.attemptsTxt}>#️⃣ {this.state.attempts}</Text>
          </View>
          <Text style={styles.levelText}>Level {this.state.level_number}</Text>
          <CountdownBar max_time={this.state.game_time_lvl} time_left={this.state.game_time_remaining} />
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.bottomPart}>
            <Text style={styles.subTitle}>Complete the following word:</Text>
            <Text style={styles.word}>{this.getMaskedWord(this.state.current_word)}</Text>
          </View>
          <View style={[styles.bottomPart, { backgroundColor: '#f6f5f5' }]}>
            <Text style={styles.inputHeader}>Write the whole word: </Text>
            <Input
              placeholder={'Word...'}
              onChangeText={(text) => this.setState({ user_answer: text.toLowerCase() })}
              value={this.state.user_answer}
              style={{ marginTop: 10, backgroundColor: 'white' }}
            />
            <PrimaryButton
              onPress={this.giveAnswer.bind(this)}
              style={{ marginTop: 10 }}>
              Give answer
            </PrimaryButton>
            {this.renderErrorText()}
          </View>
        </View>
      </View>
      </KeyboardAvoidingView>
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
    marginTop: 20
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
  attemptsTxt: {
    fontFamily: GlobalStyles.fontFamily,
    fontSize: 18,
    position: 'absolute',
    top: -5,
    right: 10,
    fontWeight: '600'
  },
  scoreTxt: {
    fontFamily: GlobalStyles.fontFamily,
    fontSize: 18,
    position: 'absolute',
    top: -5,
    right: '45%',
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
    width: '100%'
  },
  levelOverText: {
    fontSize: 25,
    fontFamily: GlobalStyles.fontFamily,
    textAlign: 'center'
  }
}

export default WordGuesser;

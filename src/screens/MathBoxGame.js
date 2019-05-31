import React, { Component } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Dimensions } from 'react-native';
import timer from 'react-native-timer';
import randomColor from 'randomcolor';
import { PrimaryButton, SecondaryButton } from '../components/common';
import GlobalStyles from '../GlobalStyles';
import CountdownBar from '../components/CountdownBar';

const gameConfig = {
  time_lvl_easy: 20,
  time_lvl_medium: 10,
  time_lvl_hard: 8,
  time_lvl_extreme: 5,
  time_to_start: 3,
};


const initial_state = {
  user_points: 0,
  time_to_start: gameConfig.time_to_start,
  game_running: false,
  show_countdown: false,
  game_time_remaining: gameConfig.time_lvl_easy,
  sum: 0,
  num_boxes: 0,
  answer_1: 0,
  answer_2: 0,
  level_won: false,
  level_count: 0,
  game_over: false,
  box_params: [],
  levelColor: '#d1fffe'
};

class MathBoxGame extends Component {

  static navigationOptions = {
    //title: 'MathBox',
    headerMode: 'none'
  };

  state = initial_state;

  componentDidMount() {
    console.log(Dimensions.get('window').width)
    this.startCountdown();
  }

  startCountdown() {
    timer.setInterval('StartCountdown', this.timeoutStartGame.bind(this), 1000);
    //const random_color = randomColor({ alpha: 0.3 });
    this.setState({ ...initial_state, ...{ show_countdown: true }});

  }

  timeoutStartGame() {
    this.setState({ time_to_start: this.state.time_to_start - 1 });
    if (this.state.time_to_start === 0) {
      timer.clearInterval('StartCountdown');
      this.setState({ game_running: true, show_countdown: false });
      this.startGameCountdown();
      const initial_game_vars = {
        box_count: 2,
        sum_limit_roof: 100,
        sum_limit_bottom: 30,
        random_limit_roof: 80,
        random_limit_bottom: 10,
        right_answers: 1
      }
      this.initGameMode(initial_game_vars);
    }
  }

  startLevelCountdown() {
    timer.setInterval('LevelCountdown', this.timeoutNextLevel.bind(this), 1000);
  }


  timeoutNextLevel() {
    this.setState({ time_to_start: this.state.time_to_start - 1 });
    if (this.state.time_to_start === 0) {
      timer.clearInterval('LevelCountdown');
      const random_color = randomColor({ alpha: 0.3 });
      this.setState({ ...initial_state, ...{ game_running: true, show_countdown: false, level_count: this.state.level_count + 1, levelColor: random_color }});
      this.startGameCountdown();
      const next_game_vars = this.levelGenerator(this.state.level_count);
      this.initGameMode(next_game_vars);
    }
  }


  startGameCountdown() {

    this.setState({ time_to_start: gameConfig.time_to_start });
    timer.setInterval('GameCountdown', this.secIntervalGame.bind(this), 1000);
  }

  secIntervalGame() {
    this.setState({ game_time_remaining: this.state.game_time_remaining - 1 });
    if (this.state.game_time_remaining === 0) {
      timer.clearInterval('GameCountdown');
      this.setState({ game_over: true, game_running: false });
    }
  }

  levelGenerator(lvl) {

    let box_count = 2;
    let sum_limit_roof = 100;
    let sum_limit_bottom = 30;
    let random_limit_roof = 80;
    let random_limit_bottom = 10;
    let right_answers = 2;
    if (lvl >= 1 && lvl <= 2) {
      box_count += lvl;
    } else if (lvl > 2 && lvl < 4) {
      box_count += lvl;
      right_answers = 2;

    } else if (lvl >= 4 && lvl < 9) {
      //box_count = lvl;
      right_answers = 2
      box_count = 5;
      //this.setState({ levelColor: '#94ffec' });

    } else if (lvl >= 9 && lvl < 14) {
      box_count = 6;
      right_answers = 4;

      //this.setState({ levelColor: '#ffe194' });
    } else if (lvl >= 14 && lvl < 19) {
      box_count = 4;
      right_answers = 2;

      sum_limit_roof = 150;
      sum_limit_bottom = 50;
      random_limit_roof = 130;
      random_limit_bottom = 40;
      //this.setState({ levelColor: '#f9987a' });


    } else if (lvl >= 19 && lvl < 24) {
      box_count = 5;
      right_answers = 4;

      sum_limit_roof = 150;
      sum_limit_bottom = 50;
      random_limit_roof = 130;
      random_limit_bottom = 40;
      //this.setState({ levelColor: '#ff6060' });
    } else {
      box_count = 7;
      right_answers = 2;

      sum_limit_roof = 150;
      sum_limit_bottom = 50;
      random_limit_roof = 130;
      random_limit_bottom = 40;
      //this.setState({ levelColor: '#80f97a' });
    }

    return {
      box_count: box_count,
      sum_limit_roof: sum_limit_roof,
      sum_limit_bottom: sum_limit_bottom,
      random_limit_roof: random_limit_roof,
      random_limit_bottom: random_limit_bottom,
      right_answers: right_answers
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
    // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }


  initGameMode(game_vars) {
    let box_params = [];

    const {
      box_count,
      sum_limit_bottom,
      sum_limit_roof,
      random_limit_roof,
      random_limit_bottom,
      right_answers,
    } = game_vars;

    const sum = this.getRandomInt(sum_limit_bottom, sum_limit_roof);
    let loop_start = 0;

    for (let i = 0; i < right_answers; i+=2) {
      const partsum_1a = this.getRandomInt(random_limit_bottom, random_limit_roof);
      const partsum_1b = sum - partsum_1a;
      const pobj1 = { number: partsum_1a, disabled: false, id: i, opacity: 1 };
      const pobj2 = { number: partsum_1b, disabled: false, id: i + 1, opacity: 1 };
      box_params.push(pobj1);
      box_params.push(pobj2);
      loop_start += 2;
    }


    for (let i = loop_start; i < (box_count + loop_start); i++) {
      const random_sum = this.getRandomInt(random_limit_bottom, random_limit_roof);
      const obj = { number: random_sum, disabled: false, id: i, opacity: 1 };
      box_params.push(obj);
    }

    const b_p = this.shuffleArray(box_params);
    this.setState({ sum: sum, box_params: b_p });
  }

  _boxClickState(id) {
    const new_box_params = this.state.box_params;
    const index = new_box_params.findIndex(x => x.id === id);
    new_box_params[index].disabled = true;
    new_box_params[index].opacity = 0.3;
    return new_box_params;
  }

  answerBox(obj) {
    const { answer_1, answer_2, sum } = this.state;
    const new_box_params = this._boxClickState(obj.id)
    if(answer_1 === 0) {
      this.setState({ answer_1: obj.number, box_params: new_box_params })
    }
    if(answer_1 !== 0 && answer_2 === 0) {
      this.setState({ answer_2: obj.number, box_params: new_box_params })
      timer.clearInterval('GameCountdown');
      if (answer_1 + obj.number === sum) {
        this.setState({ level_won: true, box_params: new_box_params });
        this.startLevelCountdown();
      } else {
        this.setState({ game_over: true, game_running: false, box_params: new_box_params });
      }
    }
  }


  renderGameBox(obj) {
    let color = '#acacac'
    if (!obj.disabled) {
      color = randomColor({ alpha: 0.5, format: 'rgba' });
    }
    return (
      <TouchableOpacity
        style={[styles.boxContainer, { backgroundColor: color, opacity: obj.opacity }]}
        disabled={obj.disabled}
        key={obj.id}
        onPress={this.answerBox.bind(this, obj)}>
        <Text style={styles.boxText}>{obj.number}</Text>
      </TouchableOpacity>
    );
  }

  renderBoxes() {
    LayoutAnimation.spring();
    return this.state.box_params.map(obj => {
      return (this.renderGameBox(obj));
    });
  }

  _getAnswer(answ) {
    if (answ === 0) {
      return '?';
    }
    return answ;
  }

  renderGameLevel() {
    if (this.state.game_running) {
      return (
        <View style={styles.container}>
          <View style={[styles.topContainer, { backgroundColor: this.state.levelColor }]}>
            <Text style={styles.lvlText}>Level {this.state.level_count + 1}</Text>
            <CountdownBar max_time={gameConfig.time_lvl_easy} time_left={this.state.game_time_remaining} />
            <Text style={styles.topText}>{this._getAnswer(this.state.answer_1)} + {this._getAnswer(this.state.answer_2)} = {this.state.sum}</Text>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.boxContainerHorizontal}>
              {this.renderBoxes()}
            </View>
          </View>
        </View>
      );
    }
  }


  renderGameOverText() {
    if (this.state.game_over) {
      return (
        <View>
          <Text style={{ fontFamily: GlobalStyles.fontFamily, fontSize: 40 }}>❌ Game over :(</Text>
          <Text style={{ fontFamily: GlobalStyles.fontFamily, fontSize: 20, marginTop: 20, marginBottom: 20 }}>You completed {this.state.level_count} levels!</Text>
        </View>
      )
    }
  }

  renderStartMenu() {
    if (!this.state.game_running && !this.state.show_countdown) {
      return (
        <View style={styles.container}>
          {this.renderGameOverText()}
          <PrimaryButton onPress={this.startCountdown.bind(this)}>
            Try again!
          </PrimaryButton>
          <SecondaryButton
            onPress={() => this.props.navigation.goBack()}
            style={{ marginTop: 10 }}>
            Go back
          </SecondaryButton>
        </View>
      );
    }
  }

  renderCountdownText() {
    if (this.state.show_countdown) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.countdownText, { fontSize: 25, marginBottom: 15 }]}>Starting in...</Text>
          <Text style={styles.countdownText}>{this.state.time_to_start}</Text>
        </View>
      );
    }
  }

  render() {
    if (this.state.game_over) {
      return (
        <View style={styles.container}>
          {this.renderStartMenu()}
        </View>
      )
    }
    if (this.state.level_won) {
      return (
        <View style={styles.container}>
          <Text style={{ fontFamily: GlobalStyles.fontFamily, fontSize: 40 }}>Level {this.state.level_count + 1} complete 👍</Text>
          <Text style={{ fontFamily: GlobalStyles.fontFamily, fontSize: 20, marginTop: 20, marginBottom: 20 }}>Next level starting in...</Text>
          <Text style={{ fontFamily: GlobalStyles.fontFamily, fontSize: 40 }}>{this.state.time_to_start}</Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        {this.renderStartMenu()}
        {this.renderCountdownText()}
        {this.renderGameLevel()}
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
  countdownText: {
    fontFamily: GlobalStyles.fontFamily,
    fontSize: 70
  },
  boxContainerHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
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
  topContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    width: '100%',
    backgroundColor: '#d1fffe',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 2,
  },
  bottomContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topText: {
    fontSize: 30,
    fontWeight: '600',
    fontFamily: GlobalStyles.fontFamily,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  lvlText: {
    fontSize: 30,
    fontWeight: '600',
    fontFamily: GlobalStyles.fontFamily,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 2,
  }
};

export default MathBoxGame;

import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Image } from 'react-native';
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
  time_lvl_easy: 20,
  time_to_start: 3

}

const initial_state = {
  words: GameVars.words,
  lives: 3,
  attempts: 1,
  game_time_remaining: 20,
  game_time_lvl: gameConfig.time_lvl_easy,
  game_running: false,
  game_over: false,
  countries: GameVars.countries,
  current_country: '',
  current_alternatives: [],
  image_URL: null,
  level_number: 0,
  time_to_start: gameConfig.time_to_start,
  show_countdown: false,
  user_points: 0,
  gave_right_answer: false,
  levelColor: '#d1fffe'
}

class CountryGuesser extends Component {

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
    const { countries } = this.state;
    var altArray = [];
    while(altArray.length < 4){
      var r = Math.floor(Math.random(0,countries.length)*100) + 1;
      if(altArray.indexOf(r) === -1) altArray.push(r);
    }
    console.log("Array"+altArray);
    if (countries.length > 0) {
      console.log('NEW COUNTRY');
      const country_index = altArray[Math.floor(Math.random() * altArray.length)];
      console.log("Country_index"+country_index);
      const country = countries[country_index-1];
      console.log("Current country: "+country);
      const new_countries = countries;
      new_countries.splice(country_index, 1);
      var alternatives = [countries[altArray[0]-1],countries[altArray[1]-1],countries[altArray[2]-1],countries[altArray[3]-1]];
      this.setState({ countries: new_countries, current_country: country,current_alternatives:alternatives });
      this.getImageByCountry(country);
    }
  }

  getImageByCountry(country){
    axios.get("https://images.search.yahoo.com/search/images;_ylt=Awr9DWsKEuZcYqMA"
    +"PJaJzbkF;_ylu=X3oDMTBsZ29xY3ZzBHNlYwNzZWFyY2gEc2xrA2J1dHRvbg--;_ylc=X1MDOTYwNj"
    +"I4NTcEX3IDMgRhY3RuA2NsawRjc3JjcHZpZAN0Y2lBbWpFd0xqSzM3ME5nWExRcTRBTU9Nall3TU"
    +"FBQUFBQ1l4c3FfBGZyA3NmcARmcjIDc2EtZ3AEZ3ByaWQDQmswWklDN01UdmU1akJZQVRIaDRZQQ"
    +"RuX3N1Z2cDMgRvcmlnaW4DaW1hZ2VzLnNlYXJjaC55YWhvby5jb20EcG9zAzAEcHFzdHIDBHBxc3R"
    +"ybAMEcXN0cmwDMTYEcXVlcnkDbG9uZG9uJTIwZGF5dGltZQR0X3N0bXADMTU1ODU4MjAyNg--?p="
    +country+"+flag&fr=sfp&fr2=sb-top-images.search&ei=UTF-8&n=60&x=wrt")
    .then(res => {
      var image = res.data;
      //console.log(image);
      var list = image.split("<img src=\'");
      //console.log(list);
      const image_URL = list[1].split("\'")[0];
      console.log("ImageURL of "+country+": "+image_URL);
      this.setState({image_URL:image_URL});
    }).catch(()=>{
      console.log("Unable to find image");
    });
  }


  giveAnswer(answer) {
    const { current_country, level_number, lives, attempts, user_points } = this.state;
    if (answer === current_country) {
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
    this.props.updateHighscore('country_guesser',this.state.user_points)
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
          onPress={() => this.props.navigation.navigate('ScoreScreen', { game_type: 'country' })}
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
            <Text style={styles.subTitle}>Guess the flag:</Text>
            <View style={styles.imageContainer}>
              {this.state.image_URL!=null?
                <Image
                  resizeMode='contain'
                  style={styles.imageStyle}
                  source={{
                    uri:
                      this.state.image_URL
                  }}
                />
                :
              null}
            </View>
          </View>
          <View style={[styles.bottomPart, { backgroundColor: '#f6f5f5', flex: 1 }]}>
            <View style={{ flexDirection: "row" }}>
            <SecondaryButton
              style={styles.altButton}
              onPress={() => this.giveAnswer(this.state.current_alternatives[0])}>
              {this.state.current_alternatives[0]}
            </SecondaryButton>
            <SecondaryButton
              style={styles.altButton}
              onPress={() => this.giveAnswer(this.state.current_alternatives[1])}>
              {this.state.current_alternatives[1]}
            </SecondaryButton>
            </View>
            <View style={{ flexDirection: "row" }}>
            <SecondaryButton
              style={styles.altButton}
              onPress={() => this.giveAnswer(this.state.current_alternatives[2])}>
              {this.state.current_alternatives[2]}
            </SecondaryButton>
            <SecondaryButton
              style={styles.altButton}
              onPress={() => this.giveAnswer(this.state.current_alternatives[3])}>
              {this.state.current_alternatives[3]}
            </SecondaryButton>
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
  imageContainer: {
    width: '90%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 2,
    marginTop: 15
  },
  imageStyle: {
    width: '100%',
    minHeight: 200,
    maxHeight: 300

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
    marginTop: 20,
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

export default connect(mapStateToProps, { updateHighscore })(CountryGuesser);

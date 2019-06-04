import React from "react";
import { TouchableOpacity,ScrollView, View, Text, Button, Image,KeyboardAvoidingView } from "react-native";
import axios from 'axios';
import timer from 'react-native-timer';
import randomColor from 'randomcolor';
import { PrimaryButton, SecondaryButton, ErrorText } from '../components/common';
import GameVars from '../constants/GameVars';
import CountdownBar from '../components/CountdownBar';
import GlobalStyles from '../GlobalStyles';



const initial_state = {
  score: 0,
  roundNumber:0,
  currentCity: "",
  currentAlternatives: [],
  cities: GameVars.countries,
  imageURL:null,
  loading: false,
  answersList:[],
  started:false,
  lives: 3,
  timePerLevel: 10,
  timeLevelRemaining: 10,
  gameOver: false,
  levelColor: '#d1fffe',
  timeStart: 3,
  showCountdown: false,
  gaveRightAnswer: false,

}

class CityGuesserScreen extends React.Component {
  static navigationOptions = {
    title: "CityGuesser"
  };
  constructor(props) {
    super(props);

    this.state = initial_state;
  }
/*
  var country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
*/
  componentDidMount() {
    console.log("Starting Country Guesser");
    this.initializeGame();
  }

  initializeGame = () => {
    var numberOfRounds = 4;
    this.setState(
      initial_state,
      );
    //this.generateQuestions(numberOfRounds);
  };

  startLevelCountdown() {
    timer.clearInterval('LevelCountdown');
    timer.clearInterval('GameCountdown');
    let random_color = this.state.levelColor;
    if (this.state.roundNumber > 0) {
      random_color = randomColor({ alpha: 0.3 });
    }
    this.setState({ showCountdown: true, timeLevelRemaining: 20, levelColor: random_color });
    this.newRound();
    timer.setInterval('LevelCountdown', this.timeoutNextLevel.bind(this), 1000);
  }

  timeoutNextLevel() {
    this.setState({ timeStart: this.state.timeStart - 1 });
    if (this.state.timeStart === 0) {
      timer.clearInterval('LevelCountdown');

      this.setState({
        showCountdown: false,
        roundNumber: this.state.roundNumber + 1
        ,gave_right_answer: false
      });
      this.startGameCountdown();
    }
  }

  startGameCountdown() {

    this.setState({ timeStart: this.state.timeStart, showCountdown: false });
    timer.setInterval('GameCountdown', this.secIntervalGame.bind(this), 1000);
  }

  startNew() {
    this.setState(initial_state);
    this.startLevelCountdown();
  }


  secIntervalGame() {
    this.setState({ timeLevelRemaining: this.state.timeLevelRemaining - 1 });
    if (this.state.timeLevelRemaining === 0) {
      const { lives } = this.state;

      if (lives === 1) {
        this.setState({
          game_over: true,
          lives: 3,
        });
      } else {
        this.setState({ lives: lives - 1 });
        this.startLevelCountdown();
      }
      timer.clearInterval('GameCountdown');

      //this.setState({ game_over: true, game_running: false });
    }
  }

  generateQuestions = (numberOfRounds) =>{
    var quest = [];
    while (quest.length < numberOfRounds+1){
      var altArr = [];
      while(altArr.length < 4){
        var r = Math.floor(Math.random(0,this.state.cities.length)*100) + 1;
        if(altArr.indexOf(r) === -1) altArr.push(r);
      }
      quest.push(altArr);
    }
    this.setState({
      answersList:quest,
      loading:false
    });
  };

  submitAnswer = submittedAnswer => {
    var rNumb=this.state.roundNumber;
    console.log("Answered: "+submittedAnswer);
    if (submittedAnswer===this.state.currentCity){
      this.setState({
        score:this.state.score+1,
        gaveRightAnswer: true
      })
      this.startLevelCountdown();
    }
    else{

      if (this.state.lives===1){
        this.setState({gameOver: true, lives: 3, gaveRightAnswer: false});
      }else{
        this.setState({
          lives: this.state.lives-1,gaveRightAnswer:false
        });
        this.startLevelCountdown();
      }

    }
{/*
    if (this.state.gameOver){
      console.log("Game done");
      this.props.navigation.navigate("Games");
    }
    else{
      this.setState({
        roundNumber:rNumb+1
      })
      this.newRound(rNumb+1);
    }*/}
  };

  newGame = () => {
    this.setState({
      started:false
    });
    this.initializeGame();
  };

  startGame = () =>{
    this.setState({
      started:true,
    });
    this.startNew();
  };

  newRound = () =>{
    var altArray = [];
    while(altArray.length < 4){
      var r = Math.floor(Math.random(0,this.state.cities.length)*100) + 1;
      if(altArray.indexOf(r) === -1) altArray.push(r);
    }

    //var altArray = this.state.answersList[round]
    var current = Math.floor(Math.random() * Math.floor(4));
    var currentCity = this.state.cities[altArray[current]];
    var alternatives = [this.state.cities[altArray[0]],this.state.cities[altArray[1]],this.state.cities[altArray[2]],this.state.cities[altArray[3]]];
    this.setState({
      currentCity:currentCity,
      currentAlternatives: alternatives
    });
    this.getImageByCity(currentCity);

  };


getImageByCity = (city)=>{

  axios.get("https://images.search.yahoo.com/search/images;_ylt=Awr9DWsKEuZcYqMA"
  +"PJaJzbkF;_ylu=X3oDMTBsZ29xY3ZzBHNlYwNzZWFyY2gEc2xrA2J1dHRvbg--;_ylc=X1MDOTYwNj"
  +"I4NTcEX3IDMgRhY3RuA2NsawRjc3JjcHZpZAN0Y2lBbWpFd0xqSzM3ME5nWExRcTRBTU9Nall3TU"
  +"FBQUFBQ1l4c3FfBGZyA3NmcARmcjIDc2EtZ3AEZ3ByaWQDQmswWklDN01UdmU1akJZQVRIaDRZQQ"
  +"RuX3N1Z2cDMgRvcmlnaW4DaW1hZ2VzLnNlYXJjaC55YWhvby5jb20EcG9zAzAEcHFzdHIDBHBxc3R"
  +"ybAMEcXN0cmwDMTYEcXVlcnkDbG9uZG9uJTIwZGF5dGltZQR0X3N0bXADMTU1ODU4MjAyNg--?p="
  +city+"+flag&fr=sfp&fr2=sb-top-images.search&ei=UTF-8&n=60&x=wrt")
  .then(res => {
    var image = res.data;
    //console.log(image);
    var list = image.split("<img src=\'");
    //console.log(list);
    const imageURL = list[1].split("\'")[0];
    console.log("ImageURL of "+city+": "+imageURL);

    this.setState({imageURL});
  })
};



  render() {
    if (this.state.gameOver) {
      return (
        <View style={styles.container}>
          <Text style={[styles.levelOverText, { fontSize: 42 }]}>GAME OVER :(</Text>
          <Text style={[styles.levelOverText, { fontSize: 30, marginTop: 20 }]}>You got {this.state.score} points 🏅</Text>
          <PrimaryButton style={{ marginTop: 20 }} onPress={this.startNew.bind(this)}>
            Try again
          </PrimaryButton>
          <SecondaryButton
            onPress={() => this.props.navigation.goBack()}
            style={{ marginTop: 10 }}>
            Go back
          </SecondaryButton>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={[styles.topContainer, { backgroundColor: this.state.levelColor }]}>
          <View style={styles.horizontalContainer}>
            <Text style={styles.livesTxt}>❤️ {this.state.lives}</Text>
            <Text style={styles.scoreTxt}>🏅 {this.state.score}</Text>
          </View>
          <Text style={styles.levelText}>Level {this.state.roundNumber}</Text>
          <CountdownBar max_time={this.state.timePerLevel} time_left={this.state.timeLevelRemaining} />
        </View>
        <View style={styles.imageContainer}>
          {this.state.imageURL!=null?
              <Image
                style={styles.imageStyle}
                source={{
                  uri:
                    this.state.imageURL
                }}
                resizeMode='cover'
              />
            :
          null}
        </View>

        {!this.state.loading ? null:<View>Loading</View>}
        {this.state.started?

          <View>
            <View style={{ flexDirection: 'row' }}>
              <PrimaryButton
                style={styles.buttonStyle}
                onPress={() => this.submitAnswer(this.state.currentAlternatives[0])}>
                {this.state.currentAlternatives[0]}
              </PrimaryButton>
              <PrimaryButton
                style={styles.buttonStyle}
                onPress={() => this.submitAnswer(this.state.currentAlternatives[1])}>
                {this.state.currentAlternatives[1]}
              </PrimaryButton>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <PrimaryButton
                style={styles.buttonStyle}
                onPress={() => this.submitAnswer(this.state.currentAlternatives[2])}>
                {this.state.currentAlternatives[2]}
              </PrimaryButton>
              <PrimaryButton
                style={styles.buttonStyle}
                onPress={() => this.submitAnswer(this.state.currentAlternatives[3])}>
                {this.state.currentAlternatives[3]}
              </PrimaryButton>
            </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Button
                onPress={() => this.props.navigation.goBack()}
                title="Back"
              />
              <Button onPress={() => this.newGame()} title="New Game" />
            </View>

          :
        <Button onPress={() => this.startGame()} title="Start Game" />}
      </View>

    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 2,

  },
  imageStyle: {
    width: 200,
  },
  bottomContainer: {
    flex: 3,
    width: '100%',
    alignItems: 'center'
  },
  horizontalContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%'
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
  bottomPart: {
    flex: 1,
    alignItems: 'center',
    width: '100%'
  },
  levelOverText: {
    fontSize: 25,
    fontFamily: GlobalStyles.fontFamily,
    textAlign: 'center'
  },
  buttonStyle: {
    margin: 5,
  }
};

export default CityGuesserScreen;

import React from "react";
import { View, Text, Button, Image } from "react-native";

class CityGuesserScreen extends React.Component {
  static navigationOptions = {
    title: "CityGuesser"
  };
  constructor(props) {
    super(props);

    this.state = {
      score: 0,
      currentAnswer: "paris"
    };
  }

  componentDidMount() {
    this.initializeGame();
  }

  initializeGame = () => {
    this.setState({
      score: 0
    });
  };

  submitAnswer = submittedAnswer => {
    console.log(submittedAnswer);
  };
  newGame = () => {
    this.initializeGame();
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ top: -180, right: -120 }}>
          Score: {this.state.score}
        </Text>

        <Image
          style={styles.imageContainer}
          source={{
            uri:
              "http://dinstorbyferie.no/wp-content/uploads/2017/03/topp-10-severdigheter-paris.jpg"
          }}
        />
        <View style={{ flexDirection: "row" }}>
          <Button
            style={styles.button}
            onPress={() => this.submitAnswer(this.state.currentAnswer)}
            title="Paris"
          />
          <Button
            style={styles.button}
            onPress={() => this.submitAnswer("London")}
            title="London"
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Button
            style={styles.button}
            onPress={() => this.submitAnswer("Stockholm")}
            title="Stockholm"
          />
          <Button
            style={styles.button}
            onPress={() => this.submitAnswer("Munich")}
            title="Munich"
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Button
            onPress={() => this.props.navigation.navigate("Main")}
            title="Back"
          />
          <Button onPress={() => this.newGame} title="New Game" />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  imageContainer: {
    borderWidth: 1,
    width: 300,
    height: 300
  },
  button: {
    borderWidth: 2,
    width: 100,
    height: 40,
    margin: 10
  }
};

export default CityGuesserScreen;

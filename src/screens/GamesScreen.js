import React from "react";
import { View, Text, Button, Image } from "react-native";

class GamesScreen extends React.Component {
  static navigationOptions = {
    title: "Choose a game"
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.props.navigation.navigate("CityGuesser")}
          title="CityGuesser"
        />
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
  }
};

export default GamesScreen;

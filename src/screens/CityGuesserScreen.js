import React from "react";
import { TouchableOpacity,ScrollView, View, Text, Button, Image } from "react-native";
import axios from 'axios';
import imageSearch from "react-native-google-image-search";
import { PrimaryButton } from '../components/common';


class CityGuesserScreen extends React.Component {
  static navigationOptions = {
    title: "CityGuesser"
  };
  constructor(props) {
    super(props);

    this.state = {
      score: 0,
      roundNumber:0,
      currentCity: "",
      currentAlternatives: [],
      cities: ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L\'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"],
      items: [],
      imageURL:null,
      prevCities:[]
    };
  }
/*
  var country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
*/
  componentDidMount() {
    console.log("CityGuess");
    this.initializeGame();
  }

  initializeGame = () => {
    this.setState({
      score: 0,
      roundNumber:0,
      currentCity: "",
      currentAlternatives: [],
      cities: ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L\'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"],
      items: [],
      imageURL:null,
      prevCities:[]
    });
    this.newRound();
  };

  submitAnswer = submittedAnswer => {
    console.log(submittedAnswer);
    if (submittedAnswer===this.state.currentCity){
      this.setState({
        score:this.state.score+1
      })
      console.log("correct");
    }
    else{
      console.log("wrong");
    }
    this.setState({
      roundNumber:this.state.roundNumber+1
    })
    this.newRound();

  };

  newGame = () => {
    this.initializeGame();
  };

  newRound = () =>{

    this.setState({
      prevCities: this.state.prevCities.push(this.state.currentCity)
    });
    console.log(this.state.prevCities.length);
    console.log(this.state.prevCities);
    if (this.state.roundNumber===2) {
      console.log("Game done");
      this.initializeGame();
    }
    else{
      console.log("new round");
      console.log(this.state.cities.length);
      var altArray = [];

      while(altArray.length < 4){
        console.log("iteration");
        console.log(altArray);
        var r = Math.floor(Math.random(0,this.state.cities.length)*100) + 1;
        if(altArray.indexOf(r) === -1) altArray.push(r);

      }

      var current = Math.floor(Math.random() * Math.floor(4));
      var currentCity = this.state.cities[altArray[current]];
      var alternatives = [this.state.cities[altArray[0]],this.state.cities[altArray[1]],this.state.cities[altArray[2]],this.state.cities[altArray[3]]];
      var newPrevCitiesArray = this.state.prevCities.concat(currentCity);
      this.setState({
        currentCity:currentCity,
        currentAlternatives: alternatives,
        prevCities: newPrevCitiesArray
      });
      console.log("Alternatives "+alternatives);
      console.log("CurrentCity "+currentCity);
      console.log("PrevCities "+ newPrevCitiesArray);
      this.getImageByCity(currentCity);

    }

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
    return (
      <View style={styles.container}>
        <Text style={{ top: -180, right: -120 }}>
          Score: {this.state.score}
        </Text>
        {this.state.imageURL!=null?
          <Image
            style={styles.imageContainer}
            source={{
              uri:
                this.state.imageURL
            }}
          />
        :
      null}

        {this.state.currentAlternatives.length > 0 ? <View>
          <View style={{ flexDirection: "row" }}>
          <PrimaryButton
            style={styles.button}
            onPress={() => this.submitAnswer(this.state.currentAlternatives[0])}>
            {this.state.currentAlternatives[0]}
          </PrimaryButton>
          <PrimaryButton
            style={styles.button}
            onPress={() => this.submitAnswer(this.state.currentAlternatives[1])}>
            {this.state.currentAlternatives[1]}
          </PrimaryButton>
          </View>
          <View style={{ flexDirection: "row" }}>
          <PrimaryButton
            style={styles.button}
            onPress={() => this.submitAnswer(this.state.currentAlternatives[2])}>
            {this.state.currentAlternatives[2]}
          </PrimaryButton><PrimaryButton
            style={styles.button}
            onPress={() => this.submitAnswer(this.state.currentAlternatives[3])}>
            {this.state.currentAlternatives[3]}
          </PrimaryButton>
          </View>
          </View>:null}

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

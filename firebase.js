import * as firebase from "firebase";
import '@firebase/firestore';

const config = {
  apiKey: "AIzaSyAPnfbLj1SrrGEJkjRdiHaG2duShchSaJ0",
  authDomain: "challenger-a3a87.firebaseapp.com",
  databaseURL: "https://challenger-a3a87.firebaseio.com",
  projectId: "challenger-a3a87",
  storageBucket: "challenger-a3a87.appspot.com",
  messagingSenderId: "578562324891",
  appId: "1:578562324891:web:d589cac674cc4fda"
};

firebase.initializeApp(config);
export const fsRef = firebase.firestore();
export const auth = firebase.auth();

import {
  USER_SET_FIELD,
} from './types';

import { auth, fsRef } from "../../firebase";

export const setUserField = ({ prop, value }) => {
  return {
    type: USER_SET_FIELD,
    payload: { prop, value }
  };
};

export const updateHighscore = (game,score) => dispatch =>{
  let old_score = 0;
  const ref = fsRef.collection(game).where('email','==',auth.currentUser.email);
  ref.get().then(querySnapshot => {
      querySnapshot.forEach(data => {
        old_score = data.data().score;
      });
    });
    if (score > old_score ){
      console.log("set highscore");
      fsRef.collection(game).doc(auth.currentUser.email).set({
        email:auth.currentUser.email,
        score:score,
      });
    }
};

export const getHighscores = (game) => dispatch => {
  let highscores = [];
  return fsRef
  .collection(game)
  .orderBy('score','asc')
  .get()
    .then(querySnapshot => {
      querySnapshot.forEach(data => {
        highscores.push(data.data());
      });
    });
  dispatch({
    type: "USERS",
    payload: users
  });
};

/*export const userFetch = (token) => {
  const url = GlobalVars.api_url + '/user/details/';
  return (dispatch) => {
    dispatch({ type: USER_FETCH_START, payload: true });
    const access_token = 'Token ' + token;
    axios({
      method: 'get',
      url: url,
      headers: {
        Authorization: access_token
      }
    }).then(response => {
      dispatch({ type: USER_FETCH, payload: response.data });
    }).catch(error => {
      console.log(error);
      dispatch({ type: USER_FETCH, payload: null });
    });
  };
};*/

//http://clipart-library.com/images/zcX5a56qi.jpg



export const loginUser = (email, password) => dispatch => {
  return auth
    .signInWithEmailAndPassword(email, password);
};

export const createUser = (email, password) => dispatch => {
  return auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      auth.signInWithEmailAndPassword(email, password);
    })
    .then(() => {
      fsRef
        .collection("users")
        .doc(auth.currentUser.uid)
        .set({
          email: email,
          uid: auth.currentUser.uid,
        });
        console.log("placed in firestore");
    })
    .catch(error => {
      console.log("ERRRRRRRRROR", error);
    });
};

export const logoutUser = () => dispatch => {
  auth
    .signOut();
};

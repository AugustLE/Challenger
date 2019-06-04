import {
  USER_SET_FIELD,HIGHSCORES, USER_HIGHSCORE
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
  const ref = fsRef.collection(game).where('user','==',auth.currentUser.email);
  ref.get().then(querySnapshot => {
      querySnapshot.forEach(data => {
        old_score = data.data().score;
      });
    });
    if (score > old_score ){
      fsRef.collection(game).doc(auth.currentUser.email).set({
        user:auth.currentUser.email,
        score:score,
      });
    }
};

export const getHighscores = (game) => dispatch => {
  let highscores = [];
  let counter = 1;
  return fsRef
  .collection(game)
  .orderBy('score', 'desc')
  .get()
    .then(querySnapshot => {
      querySnapshot.forEach(data => {
        let col = {user:data.data().user,score:data.data().score,pk:counter};
        counter = counter + 1;
        highscores.push(col);
      });
      dispatch({
        type: HIGHSCORES,
        payload: highscores
      })
    });
};

export const getCurrentUserHigh = (game)=>dispatch  => {
  let score = null;
  return fsRef
  .collection(game)
  .where('user','==', auth.currentUser.email)
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(data => {
      score = data.data().score;
    });
    dispatch({
      type: USER_HIGHSCORE,
      payload: score
    })
  });
};

export const getCurrentUser = () =>dispatch =>{
  return auth.currentUser.email;
}

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
    })
    .catch(error => {
      console.log("ERROR when creating user", error);
    });
};

export const logoutUser = () => dispatch => {
  auth
    .signOut();
};

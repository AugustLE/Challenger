import {
  USER_SET_FIELD,
} from './types';

import { auth, fsRef ,db} from "../../firebase";

export const setUserField = ({ prop, value }) => {
  return {
    type: USER_SET_FIELD,
    payload: { prop, value }
  };
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
    .then(() => {
      db.ref("users/"+auth.currentUser.uid)
        .set({
          email: email,
          uid: auth.currentUser.uid,
        });
        console.log("placed in databse");
    })
    .catch(error => {
      console.log("ERRRRRRRRROR", error);
    });
};

export const logoutUser = () => dispatch => {
  auth
    .signOut();
};

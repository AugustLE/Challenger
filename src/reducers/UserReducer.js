import {
  USER_SET_FIELD,
  USER_LOGOUT,
  HIGHSCORES,
  USER_HIGHSCORE
} from '../actions/types';

const INITIAL_STATE = {
  user: null,
  loading: false,
  highscores: [],
  user_highscore: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_SET_FIELD:
      return { ...state, [action.payload.prop]: action.payload.value };
    case USER_LOGOUT:
      return INITIAL_STATE;
    case HIGHSCORES:
      return {...state,highscores:action.payload};
    case USER_HIGHSCORE:
      return {...state,user_highscore:action.payload};
    default:
      return state;
  }
};

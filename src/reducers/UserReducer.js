import {
  USER_SET_FIELD,
  USER_LOGOUT,
} from '../actions/types';

const INITIAL_STATE = {
  user: null,
  loading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_SET_FIELD:
      return { ...state, [action.payload.prop]: action.payload.value };
    case USER_LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};

import { produce } from "immer";

const ADD_EMAIL = "ADD_EMAIL";

export const addEmail = (email) => {
  return {
    type: ADD_EMAIL,
    payload: email,
  };
};

const initialState = {
  email: null,
};

const loggingEmailReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EMAIL: {
      return produce(state, (draft) => {
        draft.email = action.payload;
      });
    }
    default:
      return state;
  }
};

export default loggingEmailReducer;

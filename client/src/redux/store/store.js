import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import loggingEmailReducer from "../reducers/loggingEmailReducer";

const rootReducer = combineReducers({
  logginEmail: loggingEmailReducer,
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;

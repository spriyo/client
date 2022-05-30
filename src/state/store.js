import { createStore } from "redux";
import { rootReducers } from "./reducers/index";

export const store = createStore(rootReducers /* preloadedState, */);

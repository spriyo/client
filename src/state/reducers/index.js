import { combineReducers } from "redux";
import { walletReducer } from "./wallet";
import { authReducer } from "./auth";
import { notificationReducer } from "./notifications";

export const rootReducers = combineReducers({
	walletReducer,
	authReducer,
	notificationReducer,
});

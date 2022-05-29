import { combineReducers } from "redux";
import { walletReducer } from "./wallet";
import { authReducer } from "./auth";
import { notificationReducer } from "./notifications";
import { contractReducer } from "./contracts";

export const rootReducers = combineReducers({
	walletReducer,
	authReducer,
	notificationReducer,
	contractReducer,
});

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from "react-redux";
import { store } from "./state/store";

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
			<ToastContainer position="bottom-center" pauseOnHover hideProgressBar autoClose={3000} />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

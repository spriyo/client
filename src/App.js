import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/home/home.js";
import { TestScreen } from "./screens/test/test.js";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" exact element={<Home />} />
				<Route path="/test" exact element={<TestScreen />} />
			</Routes>
		</Router>
	);
}

export default App;

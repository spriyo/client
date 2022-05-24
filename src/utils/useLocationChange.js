import React from "react";
import { useLocation } from "react-router-dom";

const usePrevious = (value) => {
	const ref = React.useRef();
	React.useEffect(() => {
		ref.current = value;
	});

	return ref.current;
};

export const useLocationChange = (action) => {
	const location = useLocation();
	const prevLocation = usePrevious(location);
	React.useEffect(() => {
		action(location, prevLocation);
	}, [action, location, prevLocation]);
};

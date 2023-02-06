import { Typography } from "@mui/material";
import { useState } from "react";

export const Timer = ({ expireAt }) => {
	const [expiringIn, setExpiringIn] = useState(null);
	var x = setInterval(function () {
		// Get today's date and time
		var now = new Date().getTime();

		// Find the distance between now and the count down date
		var distance = new Date(expireAt).getTime() - now;

		// Time calculations for days, hours, minutes and seconds
		var hours = Math.floor(
			(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		// Output the result in an element with id="demo"
		setExpiringIn(hours + "h " + minutes + "m " + seconds + "s ");

		// If the count down is over, write some text
		if (distance < 0) {
			clearInterval(x);
		}
	}, 1000);

	return <Typography variant="h6">{`(Expires in ${expiringIn})`}</Typography>;
};

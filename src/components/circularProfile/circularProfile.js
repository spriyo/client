import "./circularProfile.css";

export function CircularProfile({ userImgUrl }) {
	return (
		<div
			className="profile-icon-container"
			style={{ backgroundImage: `url(${userImgUrl})` }}
		></div>
	);
}

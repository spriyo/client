import "./sidenav.css";
import {
	AiOutlineShoppingCart,
	AiOutlineHeart,
	AiOutlineStock,
	AiOutlineProfile,
	AiOutlineWallet,
} from "react-icons/ai";
import { BsBookmarkStar } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { BiImport } from "react-icons/bi";

export function SideNav() {
	return (
		<div className="sidenav">
			<div className="sidenav-container">
				<div>
					{/* Title */}
					<p className="sidenav-title">Marketplace</p>
					<SideNavOption
						icon={<AiOutlineShoppingCart />}
						optionTitle="Explore"
						to="/explore"
					/>
					<SideNavOption
						icon={<AiOutlineStock />}
						optionTitle="My Active Bids"
					/>
					<SideNavOption
						icon={<AiOutlineHeart />}
						optionTitle="Favorite NFTs"
					/>

					<div style={{ height: "28px" }}></div>

					{/* Title */}
					<p className="sidenav-title">Account</p>
					<SideNavOption
						icon={<AiOutlineProfile />}
						optionTitle="My Portfolio"
						to="/profile"
					/>
					<SideNavOption icon={<AiOutlineWallet />} optionTitle="Wallet" />
					<SideNavOption icon={<BsBookmarkStar />} optionTitle="Wishlist" />
					<SideNavOption
						icon={<BiImport />}
						optionTitle="Import"
						to="/import"
					/>
					{/* <SideNavOption icon={<AiOutlineSetting />} optionTitle="Settings" /> */}
				</div>

				<div className="sidenav-footer">
					<div>
						<img src="spriyo.png" alt="logo" height={20} />
					</div>
					<div>
						<p>About</p>
						<p>Help</p>
						<p>Privacy Policy</p>
					</div>
					<div>
						<p>© 2022 Spriyo</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function SideNavOption({ optionTitle, icon, to }) {
	const navigate = useNavigate();
	function handleClick() {
		if (to) {
			navigate(to);
		}
	}
	return (
		<Box
			sx={{ cursor: to ? "pointer" : "no-drop" }}
			onClick={handleClick}
			className="sidenav-option"
		>
			{/* Icon */}
			<div className="sidenav-option-icon">{icon}</div>
			{/* Option Title */}
			<p className="sidenav-option-title">{optionTitle}</p>
		</Box>
	);
}

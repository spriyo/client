import "./sidenav.css";
import {
	AiOutlineShoppingCart,
	AiOutlineHeart,
	AiOutlineStock,
	AiOutlineSetting,
	AiFillProfile,
	AiOutlineProfile,
	AiOutlineWallet,
	AiOutlineLike,
} from "react-icons/ai";
import { BsBookmarkStar, BsPerson } from "react-icons/bs";

export function SideNav() {
	return (
		<div className="sidenav">
			<div className="sidenav-container">
				<div>
					{/* Title */}
					<p className="sidenav-title">Marketplace</p>
					<SideNavOption
						icon={<AiOutlineShoppingCart />}
						optionTitle="Stores"
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
					/>
					<SideNavOption icon={<AiOutlineWallet />} optionTitle="Wallet" />
					<SideNavOption icon={<BsBookmarkStar />} optionTitle="Wishlist" />
					<SideNavOption icon={<AiOutlineSetting />} optionTitle="Settings" />
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

function SideNavOption({ optionTitle, icon }) {
	return (
		<div className="sidenav-option">
			{/* Icon */}
			<div className="sidenav-option-icon">{icon}</div>
			{/* Option Title */}
			<p className="sidenav-option-title">{optionTitle}</p>
		</div>
	);
}

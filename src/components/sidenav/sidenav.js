import "./sidenav.css";
import {
	AiOutlineShoppingCart,
	AiOutlineHeart,
	AiOutlineStock,
	AiOutlineProfile,
	AiOutlineWallet,
} from "react-icons/ai";
import { BsBookmarkStar } from "react-icons/bs";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Box, Link, Stack, styled, Tooltip } from "@mui/material";
import { BiImport } from "react-icons/bi";
import instagramLogo from "../../assets/instagram.png";
import discordLogo from "../../assets/discord.png";
import twitterLogo from "../../assets/twitter.png";
import { useEffect, useState } from "react";

export function SideNav() {
	const FastLink = styled(Link)(({ theme }) => ({
		color: theme.palette.text.primary,
		textDecoration: "none",
	}));

	const [discordNotifOpen, setDiscordNotifOpen] = useState(false);
	const handleTooltipClose = () => {
		setDiscordNotifOpen(false);
	};

	useEffect(() => {
		const timer1 = setTimeout(() => {
			setDiscordNotifOpen(true);
		}, 100);
		return () => {
			clearTimeout(timer1);
		};
	}, []);

	useEffect(() => {
		const timer2 = setTimeout(() => {
			setDiscordNotifOpen(false);
		}, 5000);
		return () => {
			clearTimeout(timer2);
		};
	}, []);

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
						to="/bids"

					/>
					<SideNavOption
						icon={<AiOutlineHeart />}
						optionTitle="Favorite NFTs"
						to="/favorites"
					/>

					<div style={{ height: "28px" }}></div>

					{/* Title */}
					<p className="sidenav-title">Account</p>
					<SideNavOption icon={<AiOutlineWallet />} optionTitle="Wallet" />
					<SideNavOption icon={<BsBookmarkStar />} optionTitle="Wishlist" />
					<SideNavOption
						icon={<BiImport />}
						optionTitle="Import"
						to="/import"
					/>
					<SideNavOption
						icon={<MdOutlineEmojiEvents />}
						optionTitle="IRL"
						to="/irls"
					/>
					{/* <SideNavOption icon={<AiOutlineSetting />} optionTitle="Settings" /> */}
				</div>

				<div className="sidenav-footer">
					<Stack direction={"row"}>
						<FastLink target={"_blank"} href="https://instagram.com/spriyo.xyz">
							<img src={instagramLogo} alt="instagram" />
						</FastLink>
						<Tooltip
							PopperProps={{
								disablePortal: true,
							}}
							onClose={handleTooltipClose}
							open={discordNotifOpen}
							title="Join our socials to win a chance for amazing aidrops🎁"
							arrow
							placement="top"
							componentsProps={{
								tooltip: {
									sx: {
										textAlign: "center",
									},
								},
							}}
						>
							<FastLink href="https://twitter.com/spriyomarket">
								<img src={twitterLogo} alt="twitter" />
							</FastLink>
						</Tooltip>
						<FastLink href="https://discord.gg/pY3p7UNDd6">
							<img src={discordLogo} alt="Discord" />
						</FastLink>
					</Stack>
					<div style={{ borderTop: "1px solid #ddddeb" }}>
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

import { NATIVE_CURRENCY } from "../constants";

export function getSymbolFromAddress(address) {
	switch (address) {
		case NATIVE_CURRENCY:
			return "SHM";
		case "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889":
			return "WSHM";
		default:
			return "SHM";
	}
}

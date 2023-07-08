import React, { useEffect } from "react";
import { useAccount, useDisconnect } from 'wagmi';

// import functions for checkCount and getBalance
import { checkCount, getBalance } from "../../js/viemConnect.js";
import { buildSocialMedia } from "../functions/buildSocialMedia.jsx";
import { homeAccordion } from "../data/homeAccordion.jsx";


function editProfile(){
	console.log("edit profile");
	// navigate to edit Profile page
	return true;
}
export function DashHeader({cu, setPage}) {
	const { address, connector, isConnected } = useAccount();
	const { disconnect } = useDisconnect();

	console.log(cu);		// is OK

	useEffect(() => {
		if(isConnected){
			console.log(isConnected, cu);
			// getGameInfo(null,null,null);		// trigger data request
		}
	});

	function HeaderButtons(){
		console.log("THIS NEEDS CONDITIONAL DISPLAY if has no tokens, change button to 'Get Tokens'");
		return (	<ul className="dash-header-buttons">
			<li><button title="Coming Soon..." className="btn btn-outline-primary disabled" onClick={console.log("profile")}>Edit My Profile</button></li>
			{/* {cu.cpTokens > 0 ? 
				<li><button className="btn btn-lg btn-primary" onClick={console.log("mint")}>Let's Play</button></li>
				: 
				<li><button className="btn btn-outline-success" onClick={console.log("claim")}>Get Tokens</button></li>
			} */}
			<li><button className="btn btn-outline-danger" onClick={disconnect}>Log Out Wallet</button></li>
		</ul>)
	}

    return (<>
	{isConnected ? 
		<>
			<h3 className="headerTitle">Dashboard</h3> 
			<p>User ID:
				{address}

			</p>
			<HeaderButtons />
		</>
		: <h3>Login Please</h3>
		}
	</>);
}
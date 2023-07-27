import React, { useEffect } from "react";
import { useAccount } from 'wagmi';

// import functions for checkCount and getBalance
import { PayCPT } from "../functions/wagmiConnect.jsx";				// 

import exitVideo from "/img/mint/exitVideo.mp4";

export function MintContent({cu, cc}) {
	const { address, connector, isConnected } = useAccount();

	// console.log(cu, cc);		// OK

	// nothing consequential here yet
	useEffect(() => {
		if(isConnected){
			// console.log(isConnected);
			// getGameInfo(null,null,null);		// trigger data request

			// console.log(cc.count);		// this is next mint number

			console.log(cu.handNum, cu.handNum <= 4 ? "OK to mint" : "Too many hands to mint, go back to the dashboard and manage your hands.");
		}
	});

    return (<>
	{isConnected ? 
		<div id="mintContent" className="text-center">
			{cu.handNum <= 4 ?
				<PayCPT cc={cc} chainId={cc.chainId} mintNum={cc.count} />
				:
				<>
					<h3>Visit the Dashboard to manage your hands before minting.</h3>
					<video style={{maxWidth: "100%"}}
						title="Too many hands to mint, go back to the dashboard and manage your hands."
						controls autostart autoPlay src={exitVideo} type="video/mp4" />
				</>
			}
			<hr />
			<hr /> 
		</div>
		: 
		<h3>Login Please</h3>}
	</>);
}
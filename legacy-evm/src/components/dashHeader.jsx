import React, { useEffect } from "react";
import { useAccount, useDisconnect } from 'wagmi';

function editProfile(){
	console.log("edit profile");
	// navigate to edit Profile page
	return true;
}
export function DashHeader({cu, setPage}) {
	const { address, connector, isConnected } = useAccount();
	const { disconnect } = useDisconnect();

	// console.log(cu);		// is OK

	useEffect(() => {
		if(isConnected){
			// console.log(isConnected, cu);
			// getGameInfo(null,null,null);		// trigger data request
		}
	});

	function HeaderButtons(){
		return (	<div className="button-container">
			<button title="Coming Soon..." className="btn btn-primary disabled" onClick={() => console.log("profile")}>Edit My Profile</button>
			<button className="btn btn-danger" onClick={disconnect}>Log Out Wallet</button>
		</div>)
	}

    return (<>
	{isConnected ? 
		<>
			<h3 className="mainHeader">Dashboard</h3> 
			<p className="colorYellow">User ID:
				{address}

			</p>
			<HeaderButtons />
		</>
		: <h3 className="mainHeader">Login Please</h3>
		}
	</>);
}
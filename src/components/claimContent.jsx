import React from "react";
import { useAccount } from 'wagmi';

// import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
// read to get CPT balance of faucet contract
// write to call the faucet contract

// import { createPublicClient, createWalletClient, http, webSocket, custom, parseEther } from 'viem';
// import { polygon, optimism } from 'viem/chains'
// import { faucetContract, faucetABI } from "../../js/modules/contracts.js";	

import { cptOpAddr, cptAddress, cptArbAddr } from "../data/contracts.jsx";// this is to pull the chain-specific contracts and ABIs as needed.

import { UserClaimFive } from "./UserClaimFive.jsx";


// import functions for checkCount and getBalance
// import { getFaucetBalance, checkCount, getBalance } from "../../js/viemConnect.js";


function swapTokenModal(chainId) {

	console.log("Trigger swap token modal.");

	if(chainId === 42161){
		// OPTIMISM
		window.open("https://app.uniswap.org/#/swap?outputCurrency="+cptArbAddr, "_blank");
		return true;
	} else if(chainId === 10){
		// OPTIMISM
		window.open("https://app.uniswap.org/#/swap?outputCurrency="+cptOpAddr, "_blank");
		return true;
	} else {
		// POLYGON
		//open in new browser tab UNISWAP && CPT
		window.open("https://app.uniswap.org/#/swap?outputCurrency="+cptAddress, "_blank");
		return true;
	}
}

export function ClaimContent({cu, cc, setPage}) {

	const { address, connector, isConnected } = useAccount();
	// const [faucetBalance, setFaucetBalance] = useState();

	// this needs to generate the two buttons for claim or swap

	// let fcb = useBalance(faucetContract);

	console.log(cc.chainId); //OK

	if(isConnected){
		return (<>
			<div className='text-center'>
				<div className="button-container">

					<UserClaimFive chainId={cc.chainId} setPage={setPage} />
					{/* OR */}
					{cc.chainId === 8453 ? "NO SWAP ON BASE CHAIN (YET)" : 
						<a className='btn btn-claim' onClick={() => swapTokenModal(cc.chainId)}>
							Swap for CPT
						</a>
					}
					
				
				</div>
			</div>

			
		</>
			);
	} else {
		return (<h3>Login Please</h3>);
	}
}
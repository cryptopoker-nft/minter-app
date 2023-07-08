import React, { useEffect, useState } from "react";
import { useAccount, useBalance } from 'wagmi';

import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
// read to get CPT balance of faucet contract
// write to call the faucet contract

import { createPublicClient, createWalletClient, http, webSocket, custom, parseEther } from 'viem';
import { polygon, optimism } from 'viem/chains'
import { faucetContract, faucetABI } from "../../js/modules/contracts.js";			// this is to pull the chain-specific contracts and ABIs as needed.

// import functions for checkCount and getBalance
import { getFaucetBalance, checkCount, getBalance } from "../../js/viemConnect.js";

import { UserClaimFive } from "../functions/wagmiConnect.jsx";

function swapTokenModal() {

	console.log("Trigger swap token modal.");

	//open in new browser tab UNISWAP && CPT
	window.open("https://app.uniswap.org/#/swap?outputCurrency=0x250DA35D189e014Cd9a393F40ba0102ef7fE4102", "_blank");

	return true;
}

// async function userClaimFive(){

// 	console.log("Call user claim 5 contract");

// 	console.log("rewrite this claim contract using viem!");








// 	// build in place
// 	const publicClient = createPublicClient({
// 		chain: polygon,
// 		transport: http()
// 	  })
// 	const walletClient = createWalletClient({
// 		chain: polygon,
// 		transport: custom(window.ethereum)
// 	  })
	  
// 	const [address] = await walletClient.getAddresses();
// 	console.log(address);
	  
// 	const { request } = await publicClient.simulateContract({
// 		address: faucetContract,
// 		abi: faucetABI,
// 		functionName: 'requestTokens',
// 		account: address,
// 	  })
// 	const hash = await walletClient.writeContract(request)







// 	// console.log(myWalletClient);		// do we have this here? OK

// 	// THIS WORKS FOR METAMASK ONLY

// 	// let myProvider = new ethers.providers.Web3Provider(window.ethereum);		// assignment of provider happens here
// 	// let signer = myProvider.getSigner();
// 	// let fc_RW = new ethers.Contract(faucetContract, faucetABI, signer);

// 	// let mint5 = await fc_RW.requestTokens();		// ask for 5 tokens
// 	// console.log(mint5);	
// 	if(hash){
// 		alert("All set!");// OK
// 		window.location.reload();		// refresh the page to show the new tokens
// 	} else {
// 		alert("Something went wrong with this trasnaction. Please try again.");
// 	}
	

// }

// async function userClaimFive(){
// 	console.log("Call user claim 5 contract");

// 	return true;
// }

async function ButtonChoice(props) {

	// get faucet balance NOW
	// let faucetBalance = await useBalance(faucetContract);		// default to 0

	// console.log(props);

	// let faucetBalance = 2;

	// const currentUserTokens = props.currentUserTokens;

	return (<h1>Hello</h1>);
	 
	// if (isLoading) console.log("Fetching balance");
	// if (isError) console.log("Error fetching balance");

	console.log(currentUserTokens, data);

	if(currentUserTokens <= 1) {
		// no tokens, can claim
		if(faucetBalance >= 5) {
			// faucet has balance, can claim
			
			return (
				<div className='text-center'>
					<a class='btn btn-success btn-lg' onClick={userClaimFive}>
						Claim 5CPT From Faucet<br />FREE <small>(+gas)</small>
					</a>
				</div>);
		} else {
			// nothing in faucet, can swap (TBD)
			console.log("hello - faucet");
			return (
				<div className='text-center'>
					<a className='btn btn-success btn-lg' onClick={swapTokenModal}>
						Swap for CPT
					</a>
				</div>);
		}
	} else {
		console.log("default");
		return (
			<div className='text-center'>
				<a className='btn btn-success btn-lg' onClick={swapTokenModal}>
					Swap for CPT
				</a>
			</div>);
	}

}



// takes the number of plays and shows the user what they will pay for the next rebuy into the game
async function outputBuyinCost(numPlays) {

	if(!numPlays){ numPlays = 0; }
	console.log("Pass in number of hands held as numPlays: " + numPlays);

	let defaultFees = 0.00001;		// 0.00001 ETH
	let defaultCurrency = "ETH";
	let activeGameNum = 1;
	let myNFTmax = 5;

	let powerPlay = parseInt(numPlays);

	// console.log(Math.pow(10,powerPlay));		// expecting 100
	// console.log(parseFloat(defaultFees))			// expecting 0.00001

	let eth_cost = Math.pow(10,powerPlay) * parseFloat(defaultFees);
	let cad_cost = 1.0; //await convertETHtoCAD(eth_cost);

	console.log(powerPlay, eth_cost, cad_cost);

	// console.log(currentUserAddress);
	// //get the number of hands held by the current user ON CHAIN
	// let myNFTnum = await getBalance(currentUserAddress); //cpContract.balanceOf(currentUserAddress);

	// console.log(Number(await myNFTnum));
	// console.log(myNFTnum, myNFTmax);

	if(numPlays >= myNFTmax){
		// only can buy if not holding 5 hands
		return("Player has no space left, <a href='#' onclick='dashboard();'>discard some hands</a> first.");
	} else {

		// welcome and game number indicator

		// dataBack += "<h2>Buy-In to game #: " + activeGameNum + "</h2>";

		// console.log("Buy now buttons are generated here with labels for Buy-IN and re-Buy, numplays: " + numPlays);

		// console.log("If numPlays is 0, hands are 0, and tokens are 0");
		console.log(numPlays);

		if(!numPlays) {
			// if this is the first play, let the user know their buy-in for 5 tokens is free
			// dataBack += "<div class=text-center><a class='btn btn-success btn-lg' onclick='userClaimFive()'>Claim 5 CPT FREE!</a></div>";
			return "FREE";
		} else {
			// if this is a subsequent play

			// console.log(eth_cost, cad_cost);

			if(parseFloat(eth_cost) < defaultFees){
				eth_cost = defaultFees;
			} else {
				eth_cost = eth_cost.toFixed(5);
			}

			return eth_cost;


			if(!currentUserTotalSpend){ currentUserTotalSpend = 0; }
			
			return (<>
				<div><hr />
					Personal Total: 
						<span id='total_spend_replace'>"+currentUserTotalSpend.toFixed(5)+" "+defaultCurrency+" + gas paid</span>
						<strong> for GameNum: "+activeGameNum+"</strong><br />
				</div></>);
		}
		
		return null;
	}
	
}

export function ClaimContent({cu, setPage}) {

	const { address, connector, isConnected } = useAccount();
	const [faucetBalance, setFaucetBalance] = useState();

	// this needs to generate the two buttons for claim or swap

	// let fcb = useBalance(faucetContract);

	useEffect(() => {
		if(isConnected){
			console.log(isConnected);

			// gather whatever data is needed for the page load
			const fetchData = async () => {
				
				// TEST ONLY NOT USED

				let fcb = Number( await getFaucetBalance() )/ 1000000000000000000;
				// correction/adjustment for the faucet balance Number
				console.log(fcb);

				if(fcb > 5){
					console.log("show claim button");
				}
			}

			fetchData()
				.catch(console.error);

			// console.log(faucetBalance);

			

			// console.log(faucetBalance, fcb)
			// // update state ONLY if different
			// if(faucetBalance !== fcb){
			// 	setFaucetBalance(fcb);
			// }
			

		}

	});

	// const faucetBalance = useBalance(faucetContract);		// default to 0

	console.log(cu, faucetBalance);

	if(isConnected){
		return (<>
			<div className='text-center'>
				<ul>
				<li><a className='btn btn-success btn-lg' onClick={swapTokenModal}>
					Swap for CPT
				</a></li>
				<li><UserClaimFive setPage={setPage} /></li>
				</ul>
			</div>

			
		</>
			);
	} else {
		return (<h3>Login Please</h3>);
	}
}


// export async function ClaimContent({cu}) {
// 	const { address, connector, isConnected } = useAccount();

// 	const [user, setUser] = useState(null);

// 	// console.log(cu);
// 	// const { data, isError, isLoading } = useBalance({
// 		// address: faucetContract,
// 	// });
// 	// console.log(data, isError, isLoading);		// OK - Balance of Faucet Contract IN MATIC Should be Zero ATM

// 	// use CONTRACT CALL of getBalance to faucetContract to get the CPT balance of the faucet contract

// 	// const { data, isError, isLoading } = useContractRead({
// 	// 	address: faucetContract,
// 	// 	abi: faucetABI,
// 	// 	functionName: 'getBalance',
// 	// });

// 	let faucetBalance = await getFaucetBalance();
// 	console.log(faucetBalance);

// 	// this is the function call to the faucet contract
// 	const { config } = usePrepareContractWrite({
// 		address: faucetContract,
// 		abi: faucetABI,
// 		functionName: 'requestTokens',
// 		address: address,
// 	});
// 	const { data, isLoading, isSuccess, write } = useContractWrite(config);

// 	console.log(data, isLoading, isSuccess, write);
// 	// write?.();		// call the contract 

// 	// return await data;
	

// 	// async function claimFive(){
// 	// 	// this is the function call to the faucet contract
// 	// 	const { config } = usePrepareContractWrite({
// 	// 		address: faucetContract,
// 	// 		abi: faucetABI,
// 	// 		functionName: 'requestTokens',
// 	// 		address: address,
// 	// 	});
// 	// 	const { data, isLoading, isSuccess, write } = useContractWrite(config);
	
// 	// 	console.log(data, isLoading, isSuccess, write);
// 	// 	write?.();		// call the contract 

// 	// 	return await data;
// 	// }
	


// 	// buttons (show both, hide one if needed)
// 	// const FreeClaim = () => {

// 	// 	return (<div id="freeClaim" className='text-center'>
// 	// 		<a className='btn btn-success btn-lg' onClick={claimFive}>
// 	// 			Claim 5CPT From Faucet<br />FREE <small>(+gas)</small>
// 	// 		</a>
// 	// 	</div>)
// 	// };
	
	
// 	// const PaySwap = () => {
// 	// 	return (<div className='text-center'>
// 	// 		<a className='btn btn-success btn-lg' onClick={swapTokenModal}>
// 	// 			Swap for CPT
// 	// 		</a>
// 	// 	</div>);
// 	// }; 


// 	useEffect(() => {
// 		if(isConnected){
// 			console.log(isConnected);

// 			// console.log(cu);

// 			const fetchData = async () => {
// 				// run this here to test the function
// 				// console.log( await outputBuyinCost(cu.handNum) );
// 				console.log("async data call");

// 				// console.log(data, isLoading, isError);	// OK

// 				if(data){
// 					// console.log(data);

// 					let fcb = Number(data);

// 					// parseunitsforEther
// 					fcb = fcb / 1000000000000000000;


// 					// add correct button to the DOM
// 					let claimButton = document.getElementById("freeClaim");
// 					// buttonArea.innerHTML = "<h1>Faucet Balance "+fcb+"</h1>";

// 					console.log(cu);
// 					// // when we have it, setState for user
// 					// setUser(cu);

// 					if( fcb >=5 && cu.cpTokens < 1 ) {
// 						// show claim button
// 						// console.log();
// 						//buttonArea.innerHTML = freeClaim;
// 					} else {
// 						console.log("Swap button Only.");
// 						// buttonArea.innerHTML = paySwap;
// 						claimButton.style.display = "none";

// 					}
// 				}
				
// 				// write?.();
// 			}

// 			// call the function
// 			fetchData()
// 			// make sure to catch any error
// 			.catch(console.error);
			
// 		}
// 	});

// 	// console.log(cu);
// 	// let userTokens = cu.cpTokens;
// 	// console.log("Need to pass this in to get the proper button display.");

// 	// let faucetBalance = Number(data);
// 	// if(cu) {
// 	// 	console.log(cu.cpTokens, faucetBalance);
// 	// }

// 	// return (<h1>Hello</h1>);

// 	if(isConnected){
// 		return (<>
// 			<h2>FREE CLAIM to Buy-In to game #1<br />
// 				<small>gas only</small>
// 			</h2> 
// 			{/* <ButtonChoice based on UserTokens and Faucet Balance /> */}

// 			{/* <div id="buttonChoice">
// 				<FreeClaim /> 
// 				<PaySwap />
// 			</div> */}
			
// 			<hr />

// 			<div id="freeClaim" className='text-center'>
// 				<a className='btn btn-success btn-lg' onClick={ () => write?.() }>
// 					Claim 5CPT From Faucet<br />FREE <small>(+gas)</small>
// 				</a>
// 			</div>

// 			<div>
				
// 			{/* <button disabled={!write} onClick={() => write?.()}>
// 				balanceOf(faucetContract)
// 			</button> */}
// 			{/* {isLoading && <div>Check Wallet</div>}
// 			{isSuccess && <div>Transaction: {JSON.stringify(data)}</div>} */}
// 			</div>
// 		</>);
// 	} else {
// 		// not connected
// 		return(<h3>Login Please</h3>);
// 	}

    
		
		
// }
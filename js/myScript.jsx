// start of application CRYPTOPOKER

/***********************************************************************/


// main app

console.log("data & function import: ");

// this function to store SVG image supplied to ipfs.
import { storeImageData } from "./modules/ipfs.js";
import { cptAddress, cptABI, faucetContract, faucetABI, cpContractRinkby2, cpABIRinkby2, cpDepositContract, cpDepositABI, cpContractPolygon, cpABIPolygon } from "./modules/contracts.js";			// this is to pull the chain-specific contracts and ABIs as needed.

// this should import constant variables that will never require to be changed after application is run.
import { activeGameNum, currentHandAttr,
		defaultCurrency, defaultFees, MATICtoCAD, ownerWallet,
		walletConnectBtn, _walletConnectedBtn, mintBtn,
		mainDeckBackIpfs,
		mainDeck1Ipfs,mainDeck2Ipfs,mainDeck3Ipfs,mainDeck4Ipfs,mainDeck5Ipfs,mainDeck6Ipfs,mainDeck7Ipfs,mainDeck8Ipfs,mainDeck9Ipfs,
		mainDeck10Ipfs,mainDeck11Ipfs,mainDeck12Ipfs,mainDeck13Ipfs,mainDeck14Ipfs,mainDeck15Ipfs,mainDeck16Ipfs,mainDeck17Ipfs,mainDeck18Ipfs,mainDeck19Ipfs,
		mainDeck20Ipfs,mainDeck21Ipfs,mainDeck22Ipfs,mainDeck23Ipfs,mainDeck24Ipfs,mainDeck25Ipfs,mainDeck26Ipfs,mainDeck27Ipfs,mainDeck28Ipfs,mainDeck29Ipfs,
		mainDeck30Ipfs,mainDeck31Ipfs,mainDeck32Ipfs,mainDeck33Ipfs,mainDeck34Ipfs,mainDeck35Ipfs,mainDeck36Ipfs,mainDeck37Ipfs,mainDeck38Ipfs,mainDeck39Ipfs,
		mainDeck40Ipfs,mainDeck41Ipfs,mainDeck42Ipfs,mainDeck43Ipfs,mainDeck44Ipfs,mainDeck45Ipfs,mainDeck46Ipfs,mainDeck47Ipfs,mainDeck48Ipfs,mainDeck49Ipfs,
		mainDeck50Ipfs,mainDeck51Ipfs,mainDeck52Ipfs,
		cpImg,
		osTestPrefix, osLivePrefix

 } from "./modules/main-vars.js";

// import connections
// import { web3Modal, ethereumClient } from "./modmain.js";		// can be used to trigger show/hide modal
import { ethers } from "ethers";		// can remove? NOT YET

// WAGMI
// import { useConnect } from '@wagmi/core';
// import {readContract, watchAccount, getAccount} from '@wagmi/core';
// import { getWalletClient } from '@wagmi/core';
// import { prepareWriteContract, writeContract } from '@wagmi/core';

// VIEM
import { createPublicClient, createWalletClient, http, custom, formatEther, getContract } from 'viem'
// import { polygon } from 'viem/chains'
import { myClient, checkName, checkSymbol, checkCount, getURI, getOwner, getBalance, myWalletClient } from "./viemConnect.js";


import {
	useAccount,
	useConnect,
	useDisconnect,
  } from 'wagmi'

// NEW rainbowkit to replace all (using wagmi and viem still)
import './polyfills';
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
  ConnectButton
} from '@rainbow-me/rainbowkit';

import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { polygon, optimism } from 'wagmi/chains';		// mainnet, arbitrum
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

// data backup import 
import { cpMetaBak } from '../src/data/cpMeta.js';

import React from 'react';
import ReactDOM from 'react-dom/client';

// import { MainContent } from '../src/App.jsx';

// console.log(MainConnect.address, MainConnect.connector, MainConnect.isConnected);		// Not OK Here

/*********************************************************************************** */

// web3
 
// INTERNAL: 
async function enableWeb3events() {

	console.log("enabling web3 events - sign in with ethereum?");

	// const { address, connector, isConnected } = useAccount();
	// console.log(address, isConnected);

	// need connector first

	// const walletClientTBD = await getWalletClient();
	// console.log(walletClientTBD);

	// const [account] = await window.ethereum.request({ 
	// 	method: 'eth_requestAccounts' 
	// });
	// console.log(account);

	// console.log(currentUserAddress);
	// const account = getAccount();
	// console.log(account);

	// watch account
	const unwatch = watchAccount((currentUserAddress) => {		
		onChangeAccount(currentUserAddress);
	});

	// const data = await readContract({
	// 	address: cptAddress,
	// 	abi: cptABI,
	// 	functionName: 'balanceOf',
	// 	args: [currentUserAddress]
	// });
	// console.log(data);		// ok with readContract from wagmi

	// console.log(myWalletClient)

	// const [account] = await myWalletClient.getAddresses();
	// console.log(account);

	// const signature = await myWalletClient.signMessage({
	// 	message: "Sign in with Ethereum",
	// 	account: account,
	// })
 
	// subscribe to Web3 events
	window.ethereum.on('accountsChanged', onChangeAccount);

	// testing for which chain is connected
	window.ethereum.on('chainChanged', handleChainChanged);

}		// end of enable Web 3 enents container function

// INTERNAL: event handler
function onChangeAccount(data, error) {
	// console.log(error);
	// console.log(data);	// data[0] will display currently connected account

	// console.log(currentUserAddress);
	let alertNotice = "ACCOUNT CHANGE ALERT: You are currently signed in with: " + currentUserAddress + " Please ensure this is the correct account before proceeding.";


	// if new address is different than current address, trigger a reload of app
	if(data.address !== currentUserAddress) {

		// alert("Account address change detected.");
		// currentUserAddress = data.address
		console.log(alertNotice);

		// window.location.reload();

		// or use whenConnected()
	} else {
		// same account, stay here
	}
}

// INTERNAL: 
function handleChainChanged(data, error) {
	// console.log(error);	// nothing here when successful
	console.log(data);

	console.log("Detect Chain setting -> add connected logo to lower right.");

	let currentChain = data;

	console.log(window.ethereum.networkVersion, 'window.ethereum.networkVersion');

	// returns value in Ox
	// ETH mainnnet = 0x1
	// Polygon = 0x89
	// Rinkby = 0x4
	// Optimism = 0xa -> 10 in hex

	if(data === "0x1") {
		alert("No Contracts. 0x1 You are currently connected to the Ethereium Mainnet");
	} else if(data === "0x4") {
		alert("No Contracts. 0x4 You are currently connected to the Rinkeby Testnet.");
	} else if(data === "0x89") {
		// alert("No Contracts. 0x89 You are currently connected to the Polygon Mainnet");
		console.log("You are on 0x89, Override current contracts with addresses on Polygon.");
		currentContract = cpContractPolygon;
		//defaultCurrency = "MATIC";		// -> cannot be set here DUE TO variable Import reset for label display
		console.log('Currently prefer to change URLs for chains to keep contract calls and assignemnts consistnent.');
		console.log(currentContract);
	} else if(data === "0xa") {
		alert("No Contracts. 0x89 You are currently connected to the Optimism Mainnet");
	}
}

async function getUserTokens(addr){

	console.log("Get #tokens on chain for: " + addr);

	const myBal = await myClient.readContract({
		address: cptAddress,
		abi: cptABI,
		functionName: 'balanceOf',
		args: [addr]
	});
	console.log(formatEther(myBal));


	// old method using ethers/metamask?

	// get provider
	// let p = new ethers.providers.Web3Provider(window.ethereum);		// assignment of provider happens here

	// // The Contract object
	// const cptContract = new ethers.Contract(cptAddress, cptABI, p);

	// let myTokens = await cptContract.balanceOf(addr);
	// // console.log(myTokens);			// expecting 10K = 10000
	// 													// 000000000000000000 (trailing 0s)
	// let tokensDecimal = ethers.utils.formatUnits(myTokens, 18);
	
	// console.log("You have " + tokensDecimal + " CPT in your wallet.");

	return formatEther(myBal);

	
}

// INTERNAL:
function whenConnected() {
	// verify wallet connection and send connection request
	console.log("2. Running When Connected...");

	// cal this function to set currentUserUsername and currentUserAddress global vars (if available)
	getUserProfileData(false, false);		// false for do not supply the (total spend) mint data to the mint page

	// assigns the value of the current user balance to the currentUserToken variable
	calculateUserBalance(activeGameNum);

	// console.log('removed is logged in flag & get hands below.');
	//;				// pre-cache the js for the db storage of teh users hand data. -> LATER: use to cache user data & start chainSync

	// isLoggedIn = true;			// set global js variable for logged in to true FORCE IT

	enableWeb3events();

	home();			// default to home page

	// logged in users go to the profile page ?

}

// INTERNAL:
async function connectMetaMask() {
	// also disables DEMO MODE on successful connection
	// Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        //window.web3 = new Web3('https://rpc-mumbai.matic.today');

        try {
            // Request account access if needed

            // await ethereum.enable();
            // await window.ethereum.sendAsync('eth_requestAccounts');
            // Acccounts now exposed
            // web3.eth.sendTransaction({/* ... */});
            // window.web3 = new Web3(window.ethereum);

            // testing can we get the latest eth blocknumber?
       //      web3.eth.getBlockNumber(function (error, result) {
							// 	// console.log(result);

							// 	//good here!
							// });

			console.log("isLoggedIn: ", isLoggedIn);
			if(isLoggedIn){
				await ethereum.request({
					method: 'wallet_requestPermissions',
					params: [{
						eth_accounts: {},
					}]
				});
			} else {
				// already has a connection profile, cust need to reestablish connection
				await window.ethereum.request({method: 'eth_requestAccounts'});

			}
			

            attachContracts();
            console.log("Should attach contracts be called here as well? why not");

            // we get connected account public address using web3 API call
            let connectedAccounts = web3.eth.getAccounts();
            connectedAccounts.then(function(result) {
            	let accountNum = result[0];
            	// we got it, so we can use the connected account number when generating the user account in main database storage
            	console.log(accountNum);	// should be the result of the promise here
				console.log("Hello...");

            	createUserAccount(accountNum);		
            	currentUserAddress = accountNum;	// set global var for easy access
            	// isDemo = false;						// disable Demo mode.

            	UIloop();

            	whenConnected();					// run connection subroutine

            });


        } catch (error) {
            // User denied account access...
            alert("User denied account access...");
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});

        // test tx
        web3.eth.getBlockNumber(function (error, result) {
								console.log(result)
							});

        console.log("Account connected via MetaMask Classic");
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');

        alert("web3 availability in browser window is unavailable. Please install MetaMask or similar browser extension wallet or connect with the Wallet Connect link.");

        // alert("Application will continue in demo mode only on this browser and nothing will be saved.");

        // whenConnected();
    }
}

// INTERNAL:
// async function connectWalletConnect() {


// 	/************************************************************************/

// 	//	New test wallet connect section

// 	// import WalletConnectProvider from "./@walletconnect/web3-provider/dist/umd/index.min.js";

// 	// console.log(WalletConnectProvider);

// 	try {

// 		//  (re)Create WalletConnect Provider INFURA RPC
// 		// wcprovider = new WalletConnectProvider.default({
// 		//   infuraId: "7e89d3ea272146e1b122f30c99204f6e",		// my (Tom) infura API Key for web3
// 		//   rpc:{
// 		//   	137:"https://polygon-mainnet.g.alchemy.com/v2/H142mkJS2UCpceoBqIqldBYr-hRkDyPR"		// my (Tom) Alchemy Key for RPC Polygon mainnet
// 		//		137: "https://poly-mainnet.gateway.pokt.network/v1/lb/6a81bdeb0667d8d2e08c4fbe"			// my (Tom) POKT RPC account
// 		//   }
// 		// });



// 		console.log("NO FIX RPC HERE: - Check in modmain.js for current connection info ?!?.");
		
// 		wcprovider = new WalletConnectProvider.default({
// 			infuraId: "7e89d3ea272146e1b122f30c99204f6e",		// my (Tom) infura API Key for web3
// 			rpc:{
// 				// 137:"https://poly-mainnet.gateway.pokt.network/v1/lb/6a81bdeb0667d8d2e08c4fbe"
// 				137: "https://polygon-mainnet.g.alchemy.com/v2/H142mkJS2UCpceoBqIqldBYr-hRkDyPR"
// 			}
// 		  });

// 		console.log('successful connection via walletConnect - wcprovider set as global variable ');

// 		//  Enable session (triggers QR Code modal)
// 		await wcprovider.enable();		// if already connected, skips the QR popup

// 		web3 = new Web3(wcprovider);

// 		// what should happen here is 
// 		// if wallet connect is enabled,
// 		// then wcEthProvider replaces window.ethereum as the execution target for calls 

// 		// reset contracts first
// 		console.log("Should attach contracts be called here as well? why not");
// 		attachContracts(wcprovider);		// to use the wallet connect code as provider 
// 		// prime_conn === 'WC'

// 		let connectedAccounts = await web3.eth.getAccounts();
// 		// console.log(connectedAccounts);							// list of connected account with [0] as active
// 		let accountNum = connectedAccounts[0];

// 		alert("Welcome Back " + connectedAccounts[0]);			// welcome alert to the returning WC User

// 		if(connectedAccounts.length > 0) {					// next up, login

// 			isLoggedIn = true;		// since we have a connected account

// 			// already has a connection profile
// 			// let test = await wcprovider.request({method: 'eth_requestAccounts'});
// 			// console.log(test);

        	
//         	// we got it, so we can use the connected account number when generating the user account in main database storage
//         	// console.log(accountNum);	// should be the result of the promise here

//         	createUserAccount(accountNum);		// calls the account creation in the local databae
//         	currentUserAddress = accountNum;	// set global var for easy access
//         	// isDemo = false;						// disable Demo mode.

//         	UIloop();							// regenerate the UI area

//         	whenConnected();					// run connection subroutine

// 		}

// 		/************************************************************************/

// 	} catch(error) {

// 		console.log(error);

// 	}

// 	// also disables DEMO MODE on successful connection
// 	// Modern dapp browsers...
//    //  if (window.ethereum) {
//    //      window.web3 = new Web3(ethereum);
//    //      //window.web3 = new Web3('https://rpc-mumbai.matic.today');

//    //      try {
//    //          // Request account access if needed
//    //          console.log("Successful Attempt to Connect via MetaMask");

//    //          // await ethereum.enable();
//    //          // await window.ethereum.sendAsync('eth_requestAccounts');
//    //          // Acccounts now exposed
//    //          // web3.eth.sendTransaction({/* ... */});
//    //          // window.web3 = new Web3(window.ethereum);

//    //          // testing can we get the latest eth blocknumber?
//    //     //      web3.eth.getBlockNumber(function (error, result) {
// 			// 				// 	// console.log(result);

// 			// 				// 	//good here!
// 			// 				// });

// 			// console.log("isLoggedIn: ", isLoggedIn);
// 			// if(!isLoggedIn){
// 			// 	await ethereum.request({
// 			// 		method: 'wallet_requestPermissions',
// 			// 		params: [{
// 			// 			eth_accounts: {},
// 			// 		}]
// 			// 	});
// 			// } else {
// 			// 	// already has a connection profile
// 			// 	await window.ethereum.request({method: 'eth_requestAccounts'});

// 			// }
			

//    //          attachContracts();
//    //          console.log("Should attach contracts be called here as well? why not");

//    //          // we get connected account public address using web3 API call
//    //          let connectedAccounts = web3.eth.getAccounts();
//    //          connectedAccounts.then(function(result) {
//    //          	let accountNum = result[0];
//    //          	// we got it, so we can use the connected account number when generating the user account in main database storage
//    //          	console.log(accountNum);	// should be the result of the promise here

//    //          	createUserAccount(accountNum);		
//    //          	isDemo = false;						// disable Demo mode.

//    //          	whenConnected();					// run connection subroutine

//    //          });


//    //      } catch (error) {
//    //          // User denied account access...
//    //      }
//    //  }
//    //  // Legacy dapp browsers...
//    //  else if (window.web3) {
//    //      window.web3 = new Web3(web3.currentProvider);
//    //      // Acccounts always exposed
//    //      web3.eth.sendTransaction({/* ... */});

//    //      // test tx
//    //      web3.eth.getBlockNumber(function (error, result) {
// 			// 					console.log(result)
// 			// 				});

//    //      console.log("Account connected via MetaMask Classic");
//    //  }
//    //  // Non-dapp browsers...
//    //  else {
//    //      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');

//    //      alert("Browser Window is a no-go. Please use MetaMask Browser or Desktop with Extension.");

//    //      alert("Application will continue in demo mode only on this browser and nothing will be saved.");

//    //      // whenConnected();
//    //  }
// }

// INTERNAL: testing for depreciation of this failure as a function
async function web3AccountChangeDetect() {
	window.ethereum.on('accountsChanged', async () => {
	    // Do something (force reload)
	    location.reload();
	});
}

// INTERNAL: CORE
async function attachContracts(connection) {

	console.log('Attaching contracts and assigning control of provider to window.ethereum or wallet connect provider');

	console.log("Need to set signer and provider here - new WC method.", prime_conn);

	if(prime_conn === 'WC'){

		// console.log("FIX: ", provider, wcprovider);

		// const provider = await getProvider();
		// console.log(provider);		// OK

		// web3 = new Web3(provider);		// OK
		// console.log(web3);				// OK
		//wcprovider = provider;		// set global variable

		// set main contract var
		// cpContract = new ethers.Contract(currentContract, currentABI, provider);

		// set signer

		console.log("FIX: removed cpContract -> reeplace with viem");
		
		// const signer = await fetchSigner();
		// console.log(signer);		// address for signer is also in signer._address

			// set signer contract var for read/write
		// cpContract_rw = new ethers.Contract(currentContract, currentABI, signer);	

			// and deposit contract rw
		// depContract_rw = new ethers.Contract(cpDepositContract, cpDepositABI, signer);


		// using web3
		// cpW3contract = new web3.eth.Contract(currentABI, currentContract);		// for MM && WC
	}

	


		if(false){
			if(!connection) {
				connection = window.ethereum;		// default MetaMask
				web3 = new Web3(window.ethereum);		//
			} else {
				// it has provider passed
				web3 = new Web3(connection);
			}

			provider = new ethers.providers.Web3Provider(connection);		// assignment of provider happens here

			cpContract = new ethers.Contract(currentContract, currentABI, provider);

			let signer2 = provider.getSigner();

			console.log(signer2);
			console.log(provider);
		}
	

	

}

// INTERNAL: new - skips unnecessary wallet authentication step
async function wcConnected(myAcct) {

	// import provider via passed parameter
	//myProvider, 
	if(myAcct.isConnected){
		// then we're connected - override old code below by returning true here
		console.log("arrived connected - from reconnection");
		
		// console.log(myAcct);
		let accountNum = myAcct.address;
		// principal assignment of currentUserAddress is set here after connection
		currentUserAddress = accountNum;	    // set global var for easy access
	
		whenConnected();	            		// run connection subroutine

		return true;
	} else {
		// no connection, should not get here
	}
	
}

// INTERNAL: new - skips unnecessary wallet authentication step
// async function MetaMaskConnected() {
// 	// Modern dapp browsers...
//     if (window.ethereum) {

//         web3 = new Web3(ethereum);		// call web3 for MetaMask

//         try {
//             console.log("MetaMask already connected? - no interaction req.");
//             await window.ethereum.request({method: 'eth_requestAccounts'});		// is this needed here? to call accounts?
//             attachContracts();

//             // We get connected account public address
//             let connectedAccounts = web3.eth.getAccounts();

//             connectedAccounts.then(function(result) {
//             	let accountNum = result[0];
//             	currentUserAddress = accountNum;	    // set global var for easy access
//             	// isDemo = false;	
//             		            		// set global flag
//             	// console.log("REMOVED: Adding NEW create account call here...");
//             	// createUserAccount(accountNum);		

//             	whenConnected();	            		// run connection subroutine

//             });

//         } catch (error) {
//             // User denied account access...
//             console.log(error);
//         }
//     }
//     // Legacy dapp browsers...
//     else if (window.web3) {
//         window.web3 = new Web3(web3.currentProvider);
//         // Acccounts always exposed
//         web3.eth.sendTransaction({/* ... */});

//         // test tx
//         web3.eth.getBlockNumber(function (error, result) {
// 								console.log(result)
// 							});

//         console.log("Account connected via MetaMask Classic");
//     }
//     // Non-dapp browsers...
//     else {
//         console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');

//         alert("Browser Window is a no-go. Please use MetaMask Browser or Desktop with Extension.");

//         alert("Application will continue in demo mode only on this browser and nothing will be saved.");

//         whenConnected();
//     }
// }

// INTERNAL ONLY: on token purchase
async function sendTxAndBuy(amt) {

	// console.log(amt);

	// get the deposit contracts from local referenced sources
	// i.e. could be for Rinkeby, Polygon, etc.
	// let myProvider = new ethers.providers.Web3Provider(window.ethereum);		// assignment of provider happens here

	console.log(prime_conn);
	// if(prime_conn === "WC"){
	// 	console.log("Override sending tx. provider");

	// 	console.log(cpContract_rw);

	// 	myProvider = new ethers.providers.Web3Provider(wcprovider);
	// 	// signer = myProvider.getSigner


	// 	// call it
	// 	// cpContract_rw.

	// }

	// continue settign the local copntract specifics 
	// let depContract = new ethers.Contract(cpDepositContract, cpDepositABI, provider);
	// let signer = myProvider.getSigner();
	// let depContract_rw = new ethers.Contract(cpDepositContract, cpDepositABI, signer);

	console.log(depContract_rw);	// looking for deposit method

	// check for empty and set to float
	if(amt === '') {
		amt = parseFloat(defaultFees);
	} else {
		amt = parseFloat(amt);
	}

	console.log("Live Tx - send: " + amt.toFixed(16));

	let depositAmt = ethers.utils.parseEther(amt.toFixed(16));
	console.log(depositAmt);

	try {
	  // let dep = await testContract_rw.withdraw();
	  let deptx = await depContract_rw.deposit( depositAmt,  
			{
				value: depositAmt
			}
		);

	  alert("Transaction submitted successfully with hash: " + deptx.hash + " Click here to view this transaction on polygonscan (TBD)");

	  await deptx.wait();

	  alert("Deposit Transaction completed successfully. Proceeding to token allocation");

	  buyTokensForEth( tokenMaxNum, amt.toFixed(16) );

	  incrementPlaynum();		// send blank to initate the internal playnum counter

	  return true;
	}
	catch(err) {
	  console.log("Input is " + err);
	  alert("Transaction has been cancelled by the user. Please reload and retry.")
	}

}

// EXTERNAL TRIGGER: CLICK
async function burnBySending(tokenId) {
	console.log("Transfer to contract address to burn the token ownership.");

	alert("Ready your wallet! You're about the burn hand # "+ tokenId +" owned by: " + currentUserAddress + " You are paying only gas fees to burn this hand and open a spot in the game.");

	let myTransport = '';// custom(window.ethereum);
	if(window.ethereum) {
		myTransport = custom(window.ethereum);
	} else {
		myTransport = http('https://polygon-mainnet.g.alchemy.com/v2/H142mkJS2UCpceoBqIqldBYr-hRkDyPR');
	}

	// build in place
	const publicClient = createPublicClient({
		chain: polygon,
		transport: http()
	  })
	const walletClient = createWalletClient({
		chain: polygon,
		transport: myTransport
	  })
	  
	const [address] = await walletClient.getAddresses();
	  
	const { request } = await publicClient.simulateContract({
		address: cpContractPolygon,
		abi: cpABIPolygon,
		functionName: 'transferFrom',
		account: address,
		args: [address, currentContract, tokenId],
	  })
	const hash = await walletClient.writeContract(request);
	console.log("Send completed successfully with hash: " + hash + " Click here to view this transaction on polygonscan (TBD)");

	

	// let useConn = cpContract_rw;
	// // if no go shoudl use connected contract instead as below: cpContract - nope requires "signed"... look for web3 parallel.

	// console.log("Burn bug correction - Metamask OK - FAILS on WC");

	// // override contracts to be used
	// let provider = new ethers.providers.Web3Provider(window.ethereum);		// assignment of provider happens here
	// // cpContract = new ethers.Contract(currentContract, currentABI, provider);
	// let signer = provider.getSigner();
	// // console.log(signer);
	// let thisCpContract_rw = new ethers.Contract(currentContract, currentABI, signer);	

	// useConn = thisCpContract_rw;		// connected with provider and ethers, override for walletConnect


	// try {
	// 		console.log(currentUserAddress, tokenId)
	// 		var burnOne = await useConn.transferFrom(currentUserAddress, currentContract, tokenId);
	// 		// var burnOne = hash;

	// } catch(error) {
	// 	console.log(error);
	// }
	 

	// deploy distractor
	contentArea.innerHTML += "<h3 class='wallet-tx'>Confirm burn Transaction in wallet...</h3>";
	contentArea.innerHTML += '<iframe title="Playable Card Deck - Animation Samples" style="margin: 0 auto; width: 100%; height: 450px; border: 3px solid grey; border-radius: 20px;" src="https://tranmer.ca/tech/cards/"></iframe>';

	contentArea.innerHTML += "<h3 class='wallet-tx'>Awaiting blockchain confirmation...</h3>";

	if(hash) {

		contentArea.innerHTML += "<h2>Transaction confirmed</h2>";
		contentArea.innerHTML += "<h3>See ya!</h3>";

		foldHandDatabase(tokenId);		// obsolete - remove
		alert("Hand Folded.");

		foldHandBtn();		// this supplies the animation and the local array removal


		return true;
	} else {
		alert("There was a problem confiming your transaction! Please verify & try again.");

		return false;
	}

	// end of function

}
document.burnBySending = burnBySending;

// EXTERNAL TRIGGER: BUTTON -> contract function: withdraw from minter contract (only owner)
async function minterWD() {

	let withdrawl = await cpContract_rw.withdraw();
	alert("Transaction submitted successfully with hash: " + wd.hash + " Click here to view this transaction on polygonscan (TBD)");
	console.log(withdrawl);
	await withdrawl.wait();
	alert("WD Transaction completed successfully");

	return true;

}
document.minterWD = minterWD;

// EXTERNAL TRIGGER: BUTTON -> contract function: withdraw from the primary deposit contract (only owner)
async function depositWD() {

	let myProvider = new ethers.providers.Web3Provider(window.ethereum);		// assignment of provider happens here
	let testContract = new ethers.Contract(cpDepositContract, cpDepositABI, provider);
	let signer = myProvider.getSigner();
	let testContract_rw = new ethers.Contract(cpDepositContract, cpDepositABI, signer);

	let currentContractBalance = await provider.getBalance(currentContract);
	console.log(currentContractBalance);	// convert to ETH

	try {
	  let wd = await testContract_rw.withdraw();
	  console.log(wd);
	  alert("Transaction submitted successfully with hash: " + wd.hash + " Click here to view this transaction on polygonscan (TBD)");

	  await wd.wait();
	  console.log(wd);

	  alert("WD Transaction completed successfully for balance of :" + currentContractBalance);

	  return true;
	}
	catch(err) {
	  console.log("Input is " + err);
	}

	
	return false;

}
document.depositWD = depositWD;


async function tatumAPI_getPrice(type,data) {

	console.log("Getting external price for DATA.eth - REQUIRE CAD or USD and MATIC or ETH in function call.");

	// type is CURRENCY, etc
	// data is type PAYLOAD (basePair?)

	// need API key -> security?

	// let API_temp = '4484c02d-dd8c-42d6-a567-d2eb91b7130f';


	const currency = type;
	const settings = { 
		method: 'GET',		// or POST
        headers: {
            Accept: 'application/json',				// not needed for this GET call
            // 'Content-Type': 'application/json',
            // 'x-api-key': API_temp
        }
	};

	try {

		// get ETH and MATIC prices for CAD and USD

		const resp = await fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=matic-network,ethereum&vs_currencies=CAD,USD`,
		  // `https://api-eu1.tatum.io/v3/tatum/rate/${currency}?basePair=CAD`,
		  // 'https://api-eu1.tatum.io/v3/tatum/rate/ETH?basePair=CAD',		// hard code a test for response
		  settings
		);

		const dataOut = await resp.text();
		let jsonParseRes = JSON.parse(dataOut);

		console.log(dataOut);
		console.log(jsonParseRes);
		console.log( jsonParseRes["matic-network"]["cad"] );

		// sample coingecko return data
		// {
		// 	"matic-network": {"cad":1.16}
		// }

		// sample data return 
		/*
		{
			"id": "BTC",
			"value": "1235.56",
			"basePair": "EUR",
			"timestamp": 1572031674384,
			"source": "fixer.io"
		}
		*/	

		// use timestamp to detemine validity of data retrived (within x ticks)
		// if()

		// return price / CAD
		return jsonParseRes["matic-network"]["cad"];
	 } catch(error) {
	 	console.log(error);
	 	return "1.2";

	 }

}


/********************** END blockchain specific interaction code ****************/





// IF WE WANT TO LOOK AT EXPORTING THE APPLICATION NAVIGATION FUNCTION TO AN EXTERNAL MODULE
// import { mintPage } from "./mainNav.js";
// this makes it available for all clickable elements added to the DOM
// document.mintPage = mintPage;

/************************************************************************/

//	New test wallet connect section

//storage variables
var wcprovider;
var web3; 
var connectedAccounts;
var prime_conn;

// async function walletConnectConnection(){

// 	// import WalletConnectProvider from "./@walletconnect/web3-provider/dist/umd/index.min.js";

// 	// console.log(WalletConnectProvider);

// 	//  Create WalletConnect Provider
// 	wcprovider = new WalletConnectProvider.default({
// 	  infuraId: "7e89d3ea272146e1b122f30c99204f6e",		// my (Tom) infura API Key for web3
// 	  rpc:{
// 	  	137:"https://polygon-mainnet.g.alchemy.com/v2/Iaswg3TC6zEijCKiTMSGZnKbxYSUe47H"
// 	  }
// 	});

// 	//  Enable session (triggers QR Code modal)
// 	await wcprovider.enable();
// 	console.log("Boom");

// 	// wcprovider = wcprov;

// 	// provider.on("accountsChanged", (accounts: string[]) => {
// 	//   console.log(accounts);
// 	// });

// 	web3 = new Web3(wcprovider);

// 	// what should happen here is 
// 	// if wallet connect is enabled,
// 	// then wcEthProvider replaces window.ethereum as the execution target for calls 

// 	connectedAccounts = await web3.eth.getAccounts();
// 	console.log(connectedAccounts);

// }


// if(isLoggedIn) {
// 	walletConnectConnection();		// execute function to test connection and proceed if isLoggedIn
// }


/************************************************************************/









// NEW Themes section -  defaults here, overrides in custom function to detect themes? or bette tp handle here ?
var homeHero = '../img/home-mock.png';
var titleOverlay = '';		// blank for now
var titleSub = "<img class='tagline-image' src='../img/cp-v1-art/art-tagline-cp.png' alt='Generative Collect & Trade NFT Game' />";//'<small>Generative Collect & Trade NFT Game</small>';

function getHomeHero() {
	// console.log(homeHero);

	
		if((typeof(currentTheme) !== "undefined") && (currentTheme === 'bcard')) {
			homeHero = '../img/bcard-Cover.jpg';
			titleOverlay = "CP brought to you by <a href='https://banklesscard.xyz' target='_blank' style='color:#D02128;'>Bankless Card</a>";
		} else {
			// vanilla graphic for catch all
			homeHero = '../img/cp-v1-art/cp-card-home.png';
		}

	return "<img src='"+homeHero+"' style='max-width:100%;border-radius:5px;' alt='Cryptopoker Home Graphic' />\
	<h3 class='title-head'>"+titleOverlay+titleSub+"</h3>\
	<div style='clear:both'></div>";	// clear all floats
}

/*********************************************************************************** 
// global application variables - init variables that may change throughout the running of this program
***********************************************************************************/
var isLoggedIn = false;						// init isLoggedIn variable with false or isWalletConnected() function
var UIArea = document.getElementById("UIArea");
var contentArea = document.getElementById("contentArea");

//preset user profile function
export var userProfile = getUserProfile();		// compiles 5 of the mostcommon user variables into an object

// current user data storage
var currentUserAddress = "";
var currentUserTokens = 0; 		// getCookie('currentTokens');	// new wallets start with 0 tokens
var currentUserHands = [];		// use getHands function to access an array of the currrent user hands
var currentUserPlays = 0;		// use getHands function to access an array of the currrent user hands
var currentUserTotalSpend = 0;	// get from internal database data
var currentUserUsername = "";
var currentUserEmail = "";

var isRegistered = false;		// test on dashboard load, true if user has an email and (future) email matches verified pattern and (future) 

var isEditing = false;			// click blocker varibales for profile data editing
var isEditingEmail = false;

// internal application data cache
var fastScoreOutput = "";		// used to store the data output for the score page so it does not need to be regenerated unless reloaded
var isHandRevealed = false;		// boolean toggle for display of cards in hand, display codes.
var hideMainAlert = false;		// used to auto-hide main alerrt on mints +1 for each session

var buyNum = 1;						// default buy number - DEPRECIATED
var tokenMaxNum = 5;				// maximum number of tokens to deploy at at time - DEPRECIATED? 
var lastTokenMint = 0;				// sets the last active mint number, when minting, used as counter wehn deploying BURN last hand played.

let walletConnectedBtn = _walletConnectedBtn;		// so it can be updated with the polygon logo as per retrofit at 1729

/*** Primary access contract variables - used througth the aplication to call the current contract **/

// Default to the Polygon LIVE Contracts, unless chain change is detected.
var currentContract = cpContractPolygon;	//	cpContractRinkby2;
var currentABI = cpABIPolygon; 				//cpABIRinkby2;

var provider;		// be Global, but don't connect by default unless MetaMask has been loaded and auth
var cpContract;		// which is the read only version of the contract using ethers and provider
var cpContract_rw;	// which is the writable version of the contract using provider and signer with ethers.js.
var depContract_rw;	// which is the writable version of the deposit contract using provider and signer with ethers.js.


var cpW3contract;	// which is the web3.js implementation of the contract for cryptopoker

//NEW API CALL TO GET DATA PRE_CACHE
var cpMeta = [];		// setup storage variable
fetch('https://api.justplay.cafe/data/cpMeta', {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
	}
}).then(response => response.json())
.then(data => {
	console.log("cpMeta has been gathered from the API cache.");
	cpMeta = data;
	// console.log(cpMeta.length);
	if(cpMeta.length < 205){
		//there is a problem with the API call
		console.log("There is a problem with the API call for cpMeta. Checking Backup...",cpMetaBak);
		//load local copy
		if(cpMetaBak.length > 50){
			console.log("Backup is good. Loading...");
			cpMeta = cpMetaBak;
		}
	}
});

// which is the data sync for the on-chain metadata contract (used by displayNFTs and Scoreboard)

// application connection launch
console.log("Application Launching...");
isWalletConnected();


/************************************* BLOCKCHAIN/DATABASE ACCESS AREA ************************************/

// INTERNAL
async function callMintContract(incomingUri, mintNum, mySvg, handString) {
	console.log("Should send data to contract on chain and await response.");

	// mint an nft via contract call
	let to = currentUserAddress;				// // hc this should be currently connected address
	let uri = "ipfs://bafyreib7zxix5bk45shpsjog6hpct6foqxx5ya4emm3h7li5ablln3vn5i/metadata.json";		// hc 193
	// this will fail if it makes through as it is a duplicate URI

	if(incomingUri){
		uri = incomingUri;
	}

	// let ETH_VALUE_AS_STRING = "0.00001";		// min vakue in ETH / MATIC for payable method

	if(prime_conn === 'WC'){
		contentArea.innerHTML += "<h2 id='init_mint' class='wallet-tx'>OPEN WALLET TO CONFIRM MINT TRANSACTION</h2>";

	} else {
		contentArea.innerHTML += "<h2 id='init_mint' class='wallet-tx'>CONFIRM MINT TRANSACTION WITH WEB3 WALLET</h2>";

	}



	// try to catch minting tx errors
	try {

		console.log("CONTRACT FIX NEEDED HERE -> GET SIGNER?");

		// console.log(cpContract_rw);

		console.log(myWalletClient);
		console.log(cpABIPolygon);

		// simulate call
		const [myAccount] = await myWalletClient.getAddresses();

		let mintValue = ethers.utils.parseEther(defaultFees);
		console.log(Number(mintValue));

		// function requestTokensFromFaucet() {
		// 	return myWalletClient.writeContract({
		// 		address: faucetContract,
		// 		abi: faucetABI,
		// 		functionName: 'requestTokens',
		// 		account: myAccount
		// 	})
		// }

		function simMintHand() {
			return myClient.simulateContract({
				address: cpContractPolygon,
				abi: cpABIPolygon,
				functionName: 'payToMint',
				account: myAccount,
				args: [to, uri],
				value: mintValue,
			})
		}

		const {myReq} = await simMintHand();
		// then write
		console.log(myReq);
			// writeContract with myWalletClient
		// await myWalletClient.writeContract(myReq);

	



		// omit below for old

		let myProvider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = myProvider.getSigner();

		let mintContract = new ethers.Contract(cpContractPolygon, cpABIPolygon, signer);
		console.log(mintContract);

		// const gasPrice = signer.gasPrice();
		// console.log(gasPrice);
		// const gasLimit = await mintContract.estimateGas.payToMint(to,uri);
		// console.log(gasLimit);

		// var mintOne = await mintContract.payToMint(to, uri, {value: ethers.utils.parseEther(defaultFees)});

		// let mintValue = ethers.utils.parseEther(defaultFees);
		// console.log(mintValue);


		console.log("It's all working to mint, mm only?");
		var mintOne = await mintContract.payToMint(to, uri, {
			gasLimit: 210000,
			value: mintValue,
		  });
		console.log(mintOne);		// gas estimate?

		let init_alert = document.getElementById('init_mint');
		init_alert.remove();		// clear the first one

		contentArea.innerHTML += "<h2 class='wallet-tx'>MINT TRANSACTION CONFIRMING...<br>PLEASE WAIT</h2>";
		// deploy distractor
		contentArea.innerHTML += '<iframe title="Playable Card Deck - Animation Samples" style="margin: 0 auto; width: 100%; height: 450px; border: 3px solid grey; border-radius: 20px;" src="https://tranmer.ca/tech/cards/"></iframe>';

		let mintConf = await mintOne.wait();

		console.log(prime_conn);

		// if(prime_conn === 'WC'){
		// 		// maybe don't need this?
		// 	console.log(mintConf);
		// } else {
		// 	// mintOne = await cpContract

		// 	console.log(mintOne);

		// 	// let mintConf = await mintOne.wait();	// maybe don't need this?

		// }

		console.log(mintConf);
		

		console.log("Tx hash needs blockchain confimraiton for URL prefix: " + mintConf.transactionHash);

		let txUrlPrefix = 'https://polygonscan.com/tx/';
		let txHash = mintConf.transactionHash;

		// -> should wait for actual success before the alert triggers
		contentArea.innerHTML = "<h2>Blockchain confirms your NFT mint has been successful with tx: <a href="+txUrlPrefix+txHash+" target='_blank'><small style='font-size:8px'>"+txHash+"</small></a>";

		spendOneToken();			// db call to debit user token balance

		// console.log("...perhaps move function call to saveMintDatabase() here to avoid BUG of db entry...");
		saveMintDatabase(handString, mySvg, mintNum, incomingUri);

		afterSaveMint(mintNum);		// returns 
	} catch(error) {
		console.log(error);
		alert(error + " Please go back and retry.");
		// auto send on close
		mintPage();
	}

	// sthe work that has been already output to the DOM

}
// EXTERNAL or Triggered by navigation function
async function displayNFTs() {
	console.log("NFT OUTPUT PROFILE -> Display of all user owned NFTs");

	// console.log(cpContract);

	// if cpContract is not defined, then the user is not connected to the correct chain
	// if(typeof cpContract === "undefined") {
	// 	console.log("No contracts defined");
	// 	// initChainCheck();
	// 	// return null;
	// }

	contentArea.innerHTML += "<h3 id='temp-loading' class='wallet-tx'>STILL LOADING...</h3>";



	// let cpName = await cpContract.name();		//nan
	// let cpSymbol = await cpContract.symbol();
	// let totalCpSupply = await cpContract.count();

	// TESTING

	// console.log( await cpContract.count() + " total supply" );		// OK

	// let firstNftOwner = await cpContract.balanceOf("0x522d634b6BFfb444FdbCdE5932738995A4cfd1F1");	// gets 4, checks out
	// console.log("FIRST: " + firstNftOwner);

	// if(!cpContract.name()) {
	// 	console.log("No contract loaded yet, probably wrong chain");
	// 	// initChainCheck() 
	// 	//return;
	// }

	// console.log("Output Overide here for testing");	
	let cpName = await checkName;			//await cpContract.name();		// "NAME from contract";		//nan
	let cpSymbol = await checkSymbol;		//await cpContract.symbol();	// "SYMBOL from contract";
	let cpBalance = await getBalance(currentUserAddress);	// await cpContract.balanceOf(currentUserAddress); //	"NUM owned";
	let totalCpSupply = Number(await checkCount);			//await cpContract.count();		// an int, counted from contract

	console.log(currentUserHands, cpBalance);

	let testOutOfSync = currentUserHands.length > cpBalance || currentUserHands.length < cpBalance;	// TRUE if is longer or shorter
	console.log("testOutOfSync: ", testOutOfSync);


	// output -> indicates a good connection to the live contracts
	contentArea.innerHTML += "<hr />Contract: <strong>" + cpName + "</strong>. ";
	contentArea.innerHTML += cpBalance + " <strong>" + cpSymbol + "</strong> owned<br><strong>Fresh Mints</strong> and <Strong>Burns</strong> can take time to sync on chain...<hr>";
	contentArea.innerHTML += "<h3 style='margin-top:15px'>My Hands: </h3>";



	// window.web3 = new Web3(ethereum);		// is this needed?
	let ownerIndex = 1;
	let myHandsMintNumArray = [];

	let cpMetaLocal = [];

	//check for globally stored cpMeta
	if(cpMeta.length > 0) {
		cpMetaLocal = cpMeta;		// use the global variable
	} 

	// console.log("Code new test here: if is owned by contract address -> change owner in db and set db fold to true");

	// console.log("BUG: purchased hands are not given the correct flippable card treatment - retrofit to use MintNum to pull the correct hand from the db - this is caused by the hand stored as owned IS NOT reassigned in the database until the owner visits the dashboard page of their application.");

	// this output for each uniquely owned NFT for connected wallet.
	for(let i=0;i<totalCpSupply;i++){	

		let thisNftOwner;
		if(cpMetaLocal[i]){
			//object exisits
			if(cpMetaLocal[i].owner !== "") {
				// then we have a cache of owner data, no need to recheck
				thisNftOwner = cpMetaLocal[i].owner;

			} else {
				// check against contract and update local cache with user data
				thisNftOwner = await getOwner(i);		//await cpContract.ownerOf(i);
	
				// update it here
				cpMetaLocal[i].owner = thisNftOwner;
				cpMetaLocal[i].id = i;
			}
		} else {
			// create the object, assign the owner and id
			thisNftOwner = await getOwner(i);		//	await cpContract.ownerOf(i);

			cpMetaLocal[i] = {};
			cpMetaLocal[i].owner = thisNftOwner;
			// cpMetaLocal[i].uri = await cpContract.tokenURI(i);
			cpMetaLocal[i].id = i;
		}
		
		
		// console.log(thisNftOwner);

		let newOutput = "";
		// let cpCounter = totalCpSupply-1;

		if(thisNftOwner.toLowerCase() === currentUserAddress.toLowerCase()){			// this hand is owned by current user

			console.log(i + " Owned by " + currentUserAddress);

			// console.log("Verify ownership!");
			thisNftOwner = await getOwner(i);
			// console.log(thisNftOwner + " should match " + currentUserAddress);

			if(thisNftOwner.toLowerCase() !== currentUserAddress.toLowerCase()){
				// no longer owned by current user
				cpMetaLocal[i].owner = thisNftOwner;
			} else {
				// continue treating this one as owned
			
				myHandsMintNumArray.push(i);		// add to array of owned hands

				newOutput += "<div class='nft-pen'><h3><span style=float:right>Mint ID#:"+i+"</span></h3>";		// NFT Diplay header

				// capture the id number 
				let thisId = i;

				// get the URI => id mapping from the database
				await getURI(thisId).then( (result) => captureMeta(result) );

				async function captureMeta(result) {

					console.log("Get hand from chainData by json data for MintIdNum: " + i);

					let thisURI = result;
					// console.log(thisURI);
					// let urlTarget = "https://ipfs.io/ipfs/" + result.slice(7);
					// console.log("override in place here for json lookup");
					let urlTarget = "https://cryptopoker.mypinata.cloud/ipfs/" + result.slice(7);
					let adjust = result.slice(7,66);
					let jsonResult = await httpGet(urlTarget);
					console.log(jsonResult);		// this is the JSON data for the NFT

					console.log("use parseRes to get and store useful hand data in the meta");
					let parseRes = JSON.parse(jsonResult);

					let nftName = parseRes.name;	// contains hand data!
					// console.log(nftName);
					let nameSplit = nftName.split(" ");		// each array entry is a card in hand
					// console.log(nameSplit[4],nameSplit[5],nameSplit[6],nameSplit[7],nameSplit[8]);
					


					let soloHash = parseRes.image.slice(7,66);			// clips out just the IPFS cid for the image of the NFT
					let thisFilename = parseRes.image.slice(67)	;		// clips out just the filename for use when calling the image

					let thisImageUrl = "https://cryptopoker.mypinata.cloud/ipfs/" + soloHash+"/"+thisFilename;
					let thisImagelink = "<a class='nft-link' href='"+thisImageUrl+"' target='_blank'>";
					let thisImage = "<img src='"+thisImageUrl+"' alt="+thisFilename+" style='width: 100%;'/>";

					// shortcuts for UI (needs token ID)
					let osLink = "<p class=small><a href='"+osLivePrefix+currentContract+"/"+thisId+"' target=_blank>View NFT on OpenSea</a>";
					let burnLink = "<a href='#' onclick='burnBySending("+thisId+")' style='color:red;font-weight:bold; float:right;'>Burn Hand NFT</a></p>";

					// add to local storage for metadata
					// full data for user owned only?
					cpMetaLocal[i].jsonMeta = jsonResult;
					// update locally cached data with variables we may need for our owned tokens in the future
					cpMetaLocal[i].thisImageUrl = thisImageUrl;
					cpMetaLocal[i].thisImagelink = thisImagelink;	// shortcut link to URL
					cpMetaLocal[i].thisImageHtml = thisImage;		// shortcut to html output of NFT image.
				
					// encoded hand data for html output, no comma to remove from 8
					cpMetaLocal[i].handArrDisplay = [ 
						nameSplit[4].substring(0, nameSplit[4].length - 1),
						nameSplit[5].substring(0, nameSplit[4].length - 1),
						nameSplit[6].substring(0, nameSplit[4].length - 1),
						nameSplit[7].substring(0, nameSplit[4].length - 1),
						nameSplit[8] 
					];


					newOutput += thisImagelink + thisImage + "</a>" + osLink + burnLink + "</div><hr>";

					// console.log(currentUserHands);

					// console.log(myHandsMintNumArray);

							// use db result for single to pass to buildHandDisplayProfile function

					// console.log(" ->> getHandById() function can be removed.");
					// let this_hand = await getHandById(i) ;
					// this to convert JSON hand array to JS object for display.

					// console.log(this_hand);		// undefined is a problem here as 
					// console.log(currentUserHands[ownerIndex-1]);

					// console.log(currentUserHands, ownerIndex);

					// output each matched one to the DOM
					contentArea.innerHTML += newOutput; 			// this is the combined NFT Display and link, OpenSea and Burn Links
					// console.log("User hand loaded here: " + currentUserHands)
					let handChainData = await transformHandDataToObject(parseRes);


					contentArea.innerHTML += buildHandDisplayProfile(handChainData);		// the flip hand overlay

					// increment the owner ID for hand ID number
					console.log("ownerIndex: " + ownerIndex);
					ownerIndex++;

				}

			}		// end else

		} 
		
		// console.log("implement a cache here such that visitors to the app require to load the latest hand data from on chain only once per session. Update after X when minting or burning.");

		// cpMetaLocal.push({id:i, owner:thisNftOwner});		// push the id and owner to the local array

		// or set - better explicitly indexed IMO?
		cpMetaLocal[i] = {id:i, owner:thisNftOwner};		// push the id and owner to the local array
		

		// Loading Indicator UI - used to track speed and caching
		if(i === totalCpSupply-1) {
			//last one
			document.getElementById('temp-loading').remove();

			console.log(cpMetaLocal);
		} else {
			// append the number remainging to be processed
			document.getElementById('temp-loading').innerHTML = "SYNCING CURRENT HAND OWNERS... " + (totalCpSupply-i) + " remaining";
		}
	}		// end for loop

	console.log(myHandsMintNumArray);		// expecting a full list of NFTs, mint numbers only for current user.

	// console.log(cpMeta);
	// console.log(cpMetaLocal);

	//export/update the data cache of mintnum and owners to global variable
	cpMeta = cpMetaLocal;

	// update the servver with the latest data
	// fetch("https://api.justplay.cafe/data/setMeta", {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(cpMeta)
	// 	})
	// 	.then(response => response.json())
	// 	.then((json) => console.log(json));

}
document.displayNFTs = displayNFTs;


// INTERNAL: catch data alignment error (obsoleted?)
async function syncChainDb(i) {
	// console.log("Call DB Adjust Function... on: " + i);

	let mintNum = i;

	// use a POST to a PHP file to assign fold to true in databse storage
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/sync-chain-db.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     var response = this.responseText;

	     // console.log(response);
	     // contentArea.innerHTML += response;

	     return true;
	   }
	};
	var data = {address:currentContract, mintNum: mintNum};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));

}

// INTERNAL -> DUPLICATE WITH PRIOR
// async function syncChainUser(i) {
// 	// console.log("Call DB Adjust Function... on: " + i);

// 	let mintNum = i;
// 	let address = currentUserAddress;

// 	// use a POST to a PHP file to assign fold to FALSE in database storage
// 	var xhttp = new XMLHttpRequest();
// 	xhttp.open("POST", "query/sync-chain-db-user.php", true); 
// 	xhttp.setRequestHeader("Content-Type", "application/json");
// 	xhttp.onreadystatechange = function() {
// 	   if (this.readyState == 4 && this.status == 200) {
// 	     // Response
// 	     console.log(this.responseText);

// 	     var response = this.responseText;

// 	     return true;
// 	   }
// 	};
// 	var data = {address:address, mintNum: mintNum};
// 	// console.log(JSON.stringify(data));
// 	xhttp.send(JSON.stringify(data));

// }

// INTERNAL: utility to get data from a provided URL
async function httpGet(theUrl) {

		let xmlHttpReq = new XMLHttpRequest();
		xmlHttpReq.open("GET", theUrl, false); 
		xmlHttpReq.send(null);
		return xmlHttpReq.responseText;	
}


// INTERNAL: Master minter funtion trigger
async function saveMint(handId, hand, svg, handName, attr) {

	// submit this entry to php to handle temporary local data storage for games
	// we need to send: address, gameId, hand

	// svg is full art of NFT
	// handName is nice name of cards dealt in hand.
	// attr is traits that get passed to the generated NFT.

	// console.log( svg, handName, attr  );

	let mintNum = Number(handId);		// this is the mint number of the NFT
	let handString = hand.toString();		// NEW: obsolete? 
	// this is an array of id#s for hands owned

	let NFTStorageLink = await supplyNFTstorage(svg, mintNum, handName, attr, handString);			// save to IPFS & proceed

	console.log(NFTStorageLink);

	console.log("Consider moving this function to AFTER tx confirmation rather than syncronous");
	
	return true;		// all good if we get here
}

// INTERNAL: Save minted hand record to local database - mostly for immediate verification
async function saveMintDatabase(handString, svg, mintNum) {

	console.log("This is also required for saving the visual of the NFT image on the server ATM.");

	console.log(handString, mintNum);
	// if mintNum is not a plain number, it could be a problem.

	// JS save image to server

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/save-mint.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     var response = this.responseText;

	     console.log("This function stores the hand record in the local database.");

	     // This is determined another way, but is kept here for verification purposes
	     console.log(response);
	     let mintNum = response;

	     contentArea.innerHTML += "<h3>SVG Artwork Module: Data compiled and artwork generated.</h3>";

	   }
	};
	var data = {address:currentUserAddress,gameId: activeGameNum,hand: handString, svg:svg, handLength: currentUserHands.length, mintNum:mintNum};
	xhttp.send(JSON.stringify(data));

}

// INTERNAL: conversion function from NFT json to HAND = [card1,card2,card3,card4,card5]
async function transformHandDataToObject(jsonParseRes) {

	// get hand for display
	let thisName = jsonParseRes.name.split(" ");		// remove only last 18 characters from string for display hand
	let thisHandArray = thisName.slice(4);			// array of display cards from this hand
	let chainIdNum = thisName[2];					// pulls mint id num from name of NFT (unused)


	let checkDeck = buildDeck();

	// internal storage variables for hand scoring generation
	let str;		// take only the first card
	let fix;
	let lastChar;	// = str.substring(str.length - 1);
	let newCard;
	let chainHandObj = [];			// build an object from chain data to mimic hand object

	// this to build handInput for hand display in app
	thisHandArray.forEach(function(element) {

		str = element;		// take only the single card
		lastChar = str.substring(str.length - 1);		// assess last char

		if(lastChar === ",") {
			fix = str.slice(0,-1);				// trim trailing comma
		} else {
			fix = str.trim();					// trim whitespace
		}

		var result = checkDeck.filter(obj => {
		    return obj.display === fix;
		});

		chainHandObj.push(result[0]);

	});

	// instead return a data object with HAND data made up of 5 CARD objects
	return chainHandObj;

}

// INTERNAL: generate a hand from an array of IDs
function buildHandFromStoredData(hand) {
	// console.log(hand);

	let handId = hand.slice(1);
	let handClip = hand.slice(6, -1);
	let hand_arr = handClip.split(',');

	// for each hand, convert to card storage and push to current user hand, as per below.

	var deckDeal = buildDeck();

	let card1_id = parseInt(hand_arr[0]);
	let card2_id = parseInt(hand_arr[1]);
	let card3_id = parseInt(hand_arr[2]);
	let card4_id = parseInt(hand_arr[3]);
	let card5_id = parseInt(hand_arr[4]);

	let card1 = deckDeal.filter(obj => {
		return obj.id === card1_id;
	});
	let card2 = deckDeal.filter(obj => {
		return obj.id === card2_id;
	});
	let card3 = deckDeal.filter(obj => {
		return obj.id === card3_id;
	});
	let card4 = deckDeal.filter(obj => {
		return obj.id === card4_id;
	});
	let card5 = deckDeal.filter(obj => {
		return obj.id === card5_id;
	});
	// console.log(card1);

	// push the one hand onto the current hands stack
	currentUserHands.push({
			card1: card1[0],
			card2: card2[0],
			card3: card3[0],
			card4: card4[0],
			card5: card5[0]
		});

	let this_hand = currentUserHands[currentUserHands.length-1];
	// console.log(this_hand);


	// instead return the hand object
	return this_hand;


	// if(hand.length < 5) {
	// 	// hand is invalid
	// 	currentUserHands = [];
	// }

	// console.log("Card object added to currentUserHands");
	// return true;
}

// INTERNAL: 
function updateCurrentHands(hands) {

	console.log("1. calling update current hands");
	console.log(hands);

	//init
	// let jsonHands = null;

	// FIRST: handle a single hand being sent in

		// THEN: handle an array of objects being sent into this function

	// try {
	// 	jsonHands = JSON.parse(hands);
	// } catch(e) {
	// 	alert(e);
	// }

	// console.log(jsonHands);

	// if (hands.length < 1) {
	// 	console.log("Overriding JSON hands");
	// 	jsonHands = hands;
	// }

	hands.forEach(element => {
		console.log(element);
		buildHandFromStoredData(element);

	});

	return true;
}

// INTERNAL: 
function getHands() {

	console.log('running getHands from DB - is this needed?');

	// return false;

	// reset current.
	currentUserHands = [];

	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "query/get-hands.php?addr="+currentUserAddress, true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {

	   	  // console.log(this.responseText);
	   	  // 	e.g. ["1 => [51,25,26,10,19]","2 => [27,31,43,37,1]","3 => [20,47,22,30,49]"]

		let dumbData = [
			"1 => [18,14,46,22,19]",
			"2 => [12,35,23,51,10]",
			"3 => [45,18,17,5,30]",
			"4 => [38,36,44,2,41]"
		]

	      // use response to build/update currentPlayerHands global variable
	      updateCurrentHands(dumbData);

	      return true;

	   } else {
	   	// console.log(this.responseText);
	   	return false;
	   }
	};
	xhttp.send();
}

// INTERNAL: !better copy required here to guide the user.
function newUserOnboarding() {
	console.log("FCT: new account onboarding subroutine here");
	alert("Welcome to cryptopoker, new user "+currentUserAddress+"!");
	alert("First steps are to set your username and email address to stay in touch with the latest on the game. Tap/Click on DASHBOARD and then on your temp username of NULL to set your profile data.");

	// maybe redirect them to edit profile directly on first visit only?
}

// INTERNAL: add connected user into to database storage
function createUserAccount(account) {
	console.log('Submit Account Creation -> ' + account);

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/create-account.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     var response = this.responseText;

	     console.log(response);
	     // contentArea.innerHTML += response;

			if(response === 'true') {
				// true response indicates a new a ccount was created 
				// -> new account onboarding subroutine here TBD
				newUserOnboarding();
				// maybe go home
			} else {
				// they already have an account -> welcome back message
				// console.log("Check for extended profile information available and use username.");
				console.log("Welcome back " + account);
				alert("Welcome back " + account);
				contentArea.innerHTML += "Welcome back " + account;

				// home();
			}

	   }
	};
	var data = {address:account};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));
}

// INTERNAL: playnum counter increment
function incrementPlaynum(forcePlayNum) {
	console.log('Change PlayNum number to sync with db hands in play -> ');

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/increment-playnum.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     var response = this.responseText;

	     console.log(response);
	     // contentArea.innerHTML += response;

	   }
	};
	var data = {address:currentUserAddress, gameNum: activeGameNum, playNum: forcePlayNum};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));
}

// INTERNAL: to get the logged in user data and return it to the contentArea UI
async function getUserProfileData(getMintData, displayDOM) {

	console.log("3. getting user profile data - UPGRADED TO API CALL TO SERVER");

	
	let url = "https://api.justplay.cafe";
  	const response = await fetch(url + "/user/" + currentUserAddress);
  	const jsonData = await response.json();
  	// console.log(jsonData);

	let dumbData = {
		"username":"tranmer.eth",
		"email":"tom@tranmer.ca",
		"buyins":1,
		"hands_played":5,
		"total_spent":0.11125000000000000166533453693773481063544750213623046875

	}

	// overrides with smarter data
	if(jsonData.username !== "") {
		dumbData.username = jsonData.username;
	}
	if(jsonData.email !== "") {
		dumbData.email = jsonData.email;
	}
	if(jsonData.address !== "") {
		dumbData.address = jsonData.address;
	}
	if(jsonData.buyins !== "") {
		dumbData.buyins = jsonData.buyins;
	}
	if(jsonData.hands_played !== "") {
		dumbData.hands_played = jsonData.hands_played;
	}
	if(jsonData.total_spent !== "") {
		dumbData.total_spent = jsonData.total_spent;
	}

	let profileData = JSON.parse(JSON.stringify(dumbData));		// assign to internal variable

	// hard coded data pass for now
	if(profileData.buyins !== "") {
		currentUserPlays = dumbData.buyins;	// test hard-coded for now
	} else {
		currentUserPlays = 0;
	}

	if(profileData.username !== "") {
		currentUserTotalSpend = profileData.total_spent;
	}
	
	// set the data received in global variables
	if(profileData.username !== "") {
	   currentUserUsername = profileData.username;
   }

   if(profileData.email !== "") {
	   currentUserEmail = profileData.email;
	   // console.log("email set can set isRegistered variable with some tests here.");
   }

   // refresh profile data for export
   userProfile = getUserProfile();

   // these are only triggered on the first and second conditions
   if (getMintData === true) {
	   console.log("NEVER GET HERE!");
	   addTotalToMintPage(profileData.total_spent);

   } else if(displayDOM) {
	   // it's data captured for the main profile (editor) detail page
	   profileEditor(profileData);
   } else {
	   // console.log("Catch > both false (dashboard page load data)")
   }

}

// INTERNAL: data placement function
async function addTotalToMintPage(spendTotal) {

	console.log(" IS THIS USED ANYMORE? Adding total to mint page: " + spendTotal);

	// console.log(spendTotal);
	let CADspend = await convertETHtoCAD(spendTotal).toFixed(3);
	// add this to DOM on mint page
	// let dom_placement = document.getElementById('total_spend_replace');		//cant get this here

	// console.log(dom_placement);

	// console.log(currentUserTotalSpend);

	console.log(CADspend);

	console.log += spendTotal.toFixed(8) + " " + defaultCurrency +" ($CAD " + CADspend +")";

	// if(CADspend < 1) {
	// 	// show less than $1 
	// 	dom_placement.innerHTML = spendTotal.toFixed(8) + " ($CAD < $1.00)";
	// } else {
	// 	// show CAD actual
	// 	dom_placement.innerHTML = spendTotal.toFixed(8) + " ($CAD " + CADspend +")";
	// }
}

/** begin local profile data editing functions **/

	function profileEditor(data) {

		// add something to allow editable areas to be selectable
		if(data.username === "") {
			data.username = "Click_To_Set_Username";
		} else {
			currentUserUsername = data.username;
		}

		if(data.email === "") {
			data.email = "Click_To_Set_Email";
		} else {
			currentUserEmail = data.email;
		}

		let emailRequest = "";
		// conditonal display
		if(!isRegistered){
			emailRequest = "Sign up with your valid email to unlock Partner Themes!";
		}

		let dataOutput = "<p><strong>Username: </strong><a onClick='editUsername(this)' href='#'>" + data.username + "</a>";
		dataOutput += "<br><strong>Email Address: </strong><a onClick='editEmail(this)' href='#'>" + data.email + "</a><span class='badge bg-secondary'>" + emailRequest + "</span></p>";
		dataOutput += "<hr><p><strong>Number of buy-ins: </strong>" + data.buyins;
		dataOutput += "<br><strong>Number of Hands Played: </strong>" + data.hands_played;
		dataOutput += "<br><strong>Total Spent: </strong>" + data.total_spent + " " + defaultCurrency + "</p>";

		if(!isRegistered){
			dataOutput += "<hr /><h3>Click the link by email above and enter your address to unlock Themes Selector!</h3>";
		} else {
			dataOutput += "<hr /><h3>Themes Selector</h3><ul id='themes_badges'><li><a href='https://cryptopoker.justplay.cafe/index.html'>Cryptopoker Vanilla</a></li><li><a href='https://cryptopoker.justplay.cafe/audio.html'>Cryptopoker Audio Integration</a></li><li><a href='https://cryptopoker.justplay.cafe/bcard.html'>CP Bcard Theme (wip)</a></li><li>TBD</li></ul><hr>";
		}

		contentArea.innerHTML += dataOutput;

	}
	// INTERNAL: calls the data storage for user email
	function saveEmail(newEmail) {
		// access db storage to upload user data
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "query/update-user-profile.php", true); 
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.onreadystatechange = function() {
		   if (this.readyState == 4 && this.status == 200) {
		     // Response
		     var response = this.responseText;

		     console.log(response);
		     // contentArea.innerHTML += response;

			if(response === 'true') {
				// true response indicates a new a ccount was created 
				// -> new account onboarding subroutine here TBD
				alert("Account email successfuly updated to " + newEmail);

				//console.log("isEditingEmail reset to false");
				isEditingEmail = false;		// update click blocker variable

				// return to edit profile page
				editProfile();


			} else {
				// they already have an account -> welcome back message
				console.log("Error. " + response);
				// console.log("Welcome back " + account);
			}

		   }
		};
		var data = {address:currentUserAddress, username: "", email: newEmail};
		// console.log(JSON.stringify(data));
		xhttp.send(JSON.stringify(data));
	}

	// INTERNAL: calls the data storage for username
	function saveUsername(newUsername) {

		// access db storage to upload user data
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "query/update-user-profile.php", true); 
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.onreadystatechange = function() {
		   if (this.readyState == 4 && this.status == 200) {
		     // Response
		     var response = this.responseText;

		     // console.log(response);		// true for valid update
		     // contentArea.innerHTML += response;

			if(response === 'true') {
				// true response indicates a new a ccount was created 
				// -> new account onboarding subroutine here TBD
				alert("Account username successfuly updated to " + newUsername);

				console.log("isEditing set to false");
				isEditing = false;		// update click blocker variable

				// return to edit profile page
				editProfile();
			} else {
				// they already have an account -> welcome back message
				console.log("Error. " + response);
				// console.log("Welcome back " + account);
			}

		   }
		};
		var data = {address:currentUserAddress, username: newUsername, email: ""};
		// console.log(JSON.stringify(data));
		xhttp.send(JSON.stringify(data));
	}

	// EXTERNAL: trigger on user return key press
	function usernameSave(event) {
	  if (event.keyCode == 13) {
	     console.log("Enter key is pressed");
	     // gather the input field data and send to storage
	     let newUsername = document.getElementById("userName").value;
	     console.log(newUsername);

	     saveUsername(newUsername);

	     return true;
	  } else {
	     return false;
	  }
	}
	document.usernameSave = usernameSave;

	// EXTERNAL: trigger on user return key press
	function emailSave(event) {
		if (event.keyCode == 13) {
			console.log("Enter key is pressed");
			// gather the input field data and send to storage
			let newEmail = document.getElementById("userEmail").value;
			saveEmail(newEmail);

			return true;
		} else {
			return false;
		}
	}
	document.emailSave = emailSave;

	// EXTERNAL: trigger on user click -> enable editing on username
	function editUsername(this_element) {
		console.log(this_element, isEditing);
		// replace with an edit field to update / add username

		// let isEditingActive = this_element.hasClass('active'); 

		

		if(!isEditing) {
			let currentUsername = this_element.innerHTML;

			if(currentUsername === 'Click_To_Set_Username'){
				this_element.innerHTML = '<input type="text" title="press return/enter to save." class="form-control" id="userName" aria-describedby="emailHelp" placeholder="'+currentUsername+'" onkeypress="usernameSave(event)"><small id="emailHelp" class="form-text text-muted">We\'ll never share your email with anyone else.</small>';
			} else {
				this_element.innerHTML = '<input type="text" class="form-control" id="userName" aria-describedby="emailHelp" value="'+currentUsername+'" onkeypress="usernameSave(event)"><small id="emailHelp" class="form-text text-muted">We\'ll never share your email with anyone else.</small>';
			}

			document.getElementById("userName").focus();
			// document.getElementById("userEmail").addEventListener("keypress",  );

			// eventually this needs to be set back to false after the edits have completed.
			// editingUsername = false;

			isEditing = true;
		}

		

		// monitor for return keypress in this element and on return press, trigger the update of the data storage
	}
	document.editUsername = editUsername;

	// EXTERNAL: trigger on user click -> enable editing on email
	function editEmail(this_element) {
		console.log(this_element);

		if(!isEditingEmail) {
			let currentEmail = this_element.innerHTML;

			if(currentEmail === 'Click_To_Set_Email'){
				this_element.innerHTML = '<input type="email" class="form-control" id="userEmail" aria-describedby="emailHelp" placeholder="'+currentEmail+'" onkeypress="emailSave(event)">';
			} else {
				this_element.innerHTML = '<input type="email" class="form-control" id="userEmail" aria-describedby="emailHelp" value="'+currentEmail+'" onkeypress="emailSave(event)">';
			}

			isEditingEmail = true;		// flag set here for internal tracking

			document.getElementById("userEmail").focus();
			// monitor for return keypress in this element and on return press, trigger the update of the data storage

		}
	}
	document.editEmail = editEmail;


/** end local profile data editing functions **/

// INTERNAL: 
async function getGameInfo(gameNum, isScoreboard, isNewMint) {		// activegamenum, false
	
	console.log("Get Game Info from API server:", gameNum, isScoreboard, isNewMint);
	// console.log("Dumb data getting smarter!");

	// console.log(checkCount);

	let gameData = null;
	let dumbData = {
		"end_time":"2023-09-01 11:00:00",
		"cptoken_treasury":"10000",
		"eth_treasury":0.38936235000000085637594793297466821968555450439453125,
		"token_total":93,
		"token_sold":263,
		"token_spend":-170,
		"unique_addr":30,
		"total_hands": Number(await checkCount),
		"hands_in_play":108
	};

	console.log(dumbData);
	

	gameData = JSON.parse(JSON.stringify(dumbData));

	// const gameData = JSON.parse(this.responseText);
	if(isScoreboard){ printScoreboardData(gameData); } 
	else if(isNewMint) { 

		// let newMintNum = gameData.total_hands; 
		// lastTokenMint = newMintNum;
		// update this var to use chain rather than db to determine new mint num
		// let lastTokenMint = await checkCount;		//cpContract.count();

		console.log("New Mint Number assigned to lastTokenMint var. %d", lastTokenMint);
		// backToSvg(lastTokenMint);

	} else { 
		// pass game data to homepage for display
		buildGameHomeOuput(gameData.end_time, gameData.total_hands);		// generates the DOM for the user
	}

}

// INTERNAL:
function getBuyinCost(gameNum) {
	// console.log('Submit Account Connection -> ' + account);

	// set to always 1 for now

	outputBuyinCost("1");

	// var xhttp = new XMLHttpRequest();
	// xhttp.open("POST", "query/get-buyin-cost.php", true); 
	// xhttp.setRequestHeader("Content-Type", "application/json");
	// xhttp.onreadystatechange = function() {
	//   if (this.readyState == 4 && this.status == 200) {
	//     // Response
	//     var numPlays = this.responseText;

	//     console.log(numPlays);

	// 	// set to always 1 for now

	//     outputBuyinCost("1");

	//     //should just be a simple value for number of buyins already based on gamenum and address

	//     // const gameData = JSON.parse(this.responseText);
	// 	// if(isScoreboard){ printScoreboardData(gameData); } else 
	// 	// { setHandHome(gameData); }

	// 	// return gameData;

	//   }
	// };
	// var data = {gameNum:gameNum,address:currentUserAddress};
	// // console.log(JSON.stringify(data));
	// xhttp.send(JSON.stringify(data));
}

// INTERNAL:
function tokenClaimSuccessOutput() {
	contentArea.innerHTML = "<h3>Congrats, you got Token(s)</h3>";
	// contentArea.innerHTML += "<p>My Address: <small>"+userProfileDemo.address+"</small></p>";
	contentArea.innerHTML += "<p>My Tokens: "+currentUserTokens+"</p>";
	contentArea.innerHTML += "<div class=text-center><a class='btn btn-primary' onclick='mintPage()'><strong>Let's Play!</strong></a></div>";

	userProfile = getUserProfile();		// refresh first

	UIloop();	// to refresh the token balance indicator
}

// INTERNAL: modifications to intrnal game token treasury (DB)
function buyTokensForEth(numTokens, eth_cost) {

	console.log("likely numTokens no longer required here - better to include ETH cost.");

	console.log(numTokens, eth_cost);

	console.log("This php lookup requires override");

	tokenClaimSuccessOutput(5);		// override with 5 tokens for now


	// if we require metamask confirmation of transaction before running this function, 
	// then we're cler to proceed with the internal data update.

	// var xhttp = new XMLHttpRequest();
	// xhttp.open("POST", "query/buy-tokens-for-eth.php", true); 
	// xhttp.setRequestHeader("Content-Type", "application/json");
	// xhttp.onreadystatechange = function() {
	//    if (this.readyState == 4 && this.status == 200) {
	//      // Response
	//      var response = this.responseText;

	//      console.log(response);

	//      console.log("Add "+response+" token(s) to current user balance - db.");
	//      // console.log(response);
	//      // contentArea.innerHTML += response;

	// 	 console.log("This php lookup requires override");
	//      currentUserTokens = response;
	//      // setCookie("currentTokens", currentUserTokens);
	//      tokenClaimSuccessOutput(response);


	//    }
	// };
	// var data = {address:currentUserAddress,gameNum: activeGameNum, numTokens: numTokens, ethCost: eth_cost };
	// // console.log(JSON.stringify(data));
	// xhttp.send(JSON.stringify(data));
}

// INTERNAL: spend one token from transacting user.
function spendOneToken() {

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/spend-one-token.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     var response = this.responseText;

	     console.log("Remove one token from current user balance - db.");
	     console.log(response);
	     // contentArea.innerHTML += response;
	   }
	};
	var data = {address:currentUserAddress,gameNum: 1};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));
}

// INTERNAL: get user balance for gameNum and update UI areas
async function calculateUserBalance(gameNum) {

	// console.log("Getting User Balance from records");

	console.log("How many CP tokens do you hold for gameNum: " + gameNum + " ?");
	// console.log(currentUserTokens);

	// update with on-chain data
	currentUserTokens = await getUserTokens(currentUserAddress);
	// console.log(currentUserTokens);		// OK

	// call the UI update
	updateTokenUI(currentUserTokens);

	return currentUserTokens;
}

// INTERNAL: 
function updateTokenUI(tokenNum) {

	// Update the main UI
	UIloop();

	// update the display area with values
	let balanceUI = document.getElementsByClassName("token_balance");

	// format token number to real
	let tokenNumOut = Math.round(tokenNum);

	Array.from(balanceUI).forEach(element => {
		element.innerHTML = tokenNumOut + cpImg;
	});

	return true;
}


/************************************* MAIN PROGRAM AREA **********************************************************/


/*******************************************************/
// function farm
/*******************************************************/

// INTERNAL: generate the appropriate UI based on the logged in user status
async function UIloop() {

	console.log("Logged in UILoop() - start.");

	// generate the correct button to be displayed based on logged in status on page
	if ( isLoggedIn ){

		// console.log("Fix call with current client");
		// console.log(myClient.chain.id);

		// let currentChain;		// init empty
		// if(window.ethereum){
		// 	currentChain = window.ethereum.networkVersion;		// metamask
		// } else {
		// 	currentChain = await web3.eth.getChainId();			// walletconnect
		// }

        // only for Polygon currently
        if (myClient.chain.id === "137"){
        	console.log("On the right chain - add polygon to UI.");

        	// add polygon logo to all header elements
        	let logoNode = document.createElement('img');
        	logoNode.src = 'img/polygon.svg';
        	logoNode.style.width = '25px';
        	logoNode.style.float = 'right';
        	logoNode.style.marginRight = '10px';
        	logoNode.style.marginTop = '10px';

        }

		if(currentUserTokens > 0){
			UIArea.innerHTML = mintBtn;		// adds DEALR button to UI
			// console.log(mintBtn);
			// console.log(document.getElementById("mintBtn"))
			document.getElementById("mintBtn").addEventListener("click", mintPage);
		} else {
			UIArea.innerHTML = "<a class='btn btn-danger' onclick='addTokensPage()'><strong>BUY IN</strong></a>";
		}

		let polygonLogo = "<img src='img/polygon.svg' alt='polygonLogo' style='width:25px; float:right;margin-left:10px;' />";

		// override
		walletConnectedBtn = "<a href='#' id='connectedWallet' class='btn btn-secondary'> "+polygonLogo+"</a>";	// Wallet Connected removed

		UIArea.innerHTML += walletConnectedBtn; 
		UIArea.innerHTML += "<h2><a href='#' onclick='addTokensPage()'><span class='badge bg-secondary token_balance'>"+currentUserTokens+"</span></a></h2>"; // tokenCounter;


	} else {

		console.log("Only New and Unconnected (no web3) Users Arrive here - Generate a Connect Button as principal UI");

		UIArea.innerHTML = walletConnectBtn;		// for main homepage UI area

		home();		// non logged in users should be sent home
	}
}





// INTERNAL: test for connection
async function isWalletConnected() {
	console.log("1. Running isWalletConnected: ");

	// console.log(MainConnect.address, MainConnect.connector, MainConnect.isConnected);		// Not OK Here

	// console.log(ethereumClient.getAccount());
	let myAccount = currentUserAddress;
	console.log(myAccount);

	// const { connector: activeConnector, isConnected} = useAccount();
	// const { connect, connnectors, error, isLoading, pendingConnector } = useConnect();

	// console.log(isConnected);
	// console.log(activeConnector.name)

	if(myAccount){
		// import the key functions from wagmi
		// console.log(web3Modal);			// OK
		// console.log(ethereumClient);	// OK	-> functions to be found gere to use account

		

		// console.log("myAccount.isConnected: ", myAccount.isConnected);		// T/F
		// let myClient = ethereumClient.wagmi;
		// console.log(myClient);			
		
		// get balance in ETH to confirm the account is real and connected correctly
		// const balance = await fetchBalance({
		// 	address: myAccount.address, //'0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
		// });

		// console.log(balance);		// OK

		// set the global provider to connected account
		// const provider = getProvider();
		// console.log(provider, wcprovider);		// OK
		// wcprovider = provider;		// set global variable

		// const signer = await fetchSigner();
		// console.log(signer);		// address for signer is also in signer._address
		// console.log("BUG: not gettting signer here -> this is the likely cause of the WC connecion failure. GOAL: Set signer to global variable.")

		// set GLOBAL logged in variable
		isLoggedIn = true;

		// set GLOBAL prime_con variable
		prime_conn = "WC";

		wcConnected(myAccount);		// check this!
		
		return true;

	} else {
		console.log("Wallet not connected");
		isLoggedIn = false;
		UIloop();							// init default UI here

		return false;
	}
	
}

// EXTERNAL: manual connection button on homepage on click -> run connection subroutines
function getConnected() {

	console.log("Running getConnected");
	connectMetaMask();
	UIloop();

	return true;
}
document.getConnected = getConnected;

function connectWc() {

	console.log("Running connectWc - setting prime_conn");
	prime_conn = "WC";
	// connectWalletConnect();
	UIloop();

	return true;
}
document.connectWc = connectWc;

/** Cookie Helper functions **/
	// INTERNAL: 
	function setCookie(cname, cvalue, exdays) {
	  const d = new Date();
	  d.setTime(d.getTime() + (exdays*24*60*60*1000));
	  let expires = "expires="+ d.toUTCString();
	  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
	// INTERNAL: 
	function getCookie(cname) {
	  let name = cname + "=";
	  let decodedCookie = decodeURIComponent(document.cookie);
	  let ca = decodedCookie.split(';');
	  for(let i = 0; i <ca.length; i++) {
	    let c = ca[i];
	    while (c.charAt(0) == ' ') {
	      c = c.substring(1);
	    }
	    if (c.indexOf(name) == 0) {
	      return c.substring(name.length, c.length);
	    }
	  }
	  return "";
	}
	// INTERNAL: 
	function checkCookie() {
	  let user = getCookie("username");
	  if (user != "") {
	    alert("Welcome again " + user);
	  } else {
	    user = prompt("Please enter your name:", "");
	    if (user != "" && user != null) {
	      setCookie("username", user, 365);
	    }
	  }
	}

/** End old cookie functions **/

/** Page / internal functions **/


/********** HOME PAGE FUNCTIONS ***********/
// EXTERNAL: navigaiton trigger function
function goHome(clicked_this) {

	removeActiveMenus();

	console.log(clicked_this);
	clicked_this.classList.toggle("active");

	// any cleanup actions required to reset to get ready to handle the home page
	home();
}
document.goHome = goHome;

// INTERNAL: homepage data and build
function home() {
	/* load the home page

	this page should display:
	- list of all current games (if logged in, actively participating games on top)
		- some games may be "pinned" to the top of the list
	- button to goto profile (if logged in)
	- button to login wallet (if not logged in)

	*/ 

	var buttons = "<w3m-core-button></w3m-core-button>";		//"<a href='#' class='btn btn-outline-primary btn-lg' onclick='getConnected();'>Connect Wallet</a><a href='#' class='btn btn-outline-primary btn-lg' onclick='connectWc();'>WalletConnect QR</a>";

		// NEW code: can it dynamically be inserted into js?
		// <w3m-core-button></w3m-core-button>

	var homePageContent = '';

	// console.log(isLoggedIn);

	// Home hero image
	// homePageContent += "<img src='"+homeHero+"' style='max-width:100%;border-radius:5px;' alt='Cryptopoker Home Graphic' />";
	// homePageContent += "<h3 class='title-head'>CRYPTOPOKER <small>Generative Collect & Trade NFT Game</small></h3>";
	// homePageContent += "<div style='clear:both'></div>";	// clear all floats

	console.log("Removed home content header from old myScript.")
	// homePageContent += getHomeHero();		// main image and slider

	if(true) {
		// not logged in, just display a big connect button up front.
		homePageContent += "<div class='button-container'>"+buttons+"</div>";
		// homePageContent += <MainConnect />;

	}

	var tempCollapse = '<div class="accordion" id="accordionDisplay">\
		<div class="accordion-item">\
		    <h2 class="accordion-header" id="headingThree">\
		      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">\
		        Games In Play:\
		      </button>\
		    </h2>\
		    <div id="collapseThree" class="accordion-collapse collapse show" aria-labelledby="headingThree" data-bs-parent="#accordionExample">\
		      <div class="accordion-body">\
		      	<div class="prizes"><h2 class="prize-title">Top Hand Minted</h2><h3 class="prize-copy-link"><a href="https://bankless.community">WIN 1000 BANK.</a></h3><h4 class="prize-copy-extra">Option for second line of text</h4><h2 class="prize-title">Top Score of <strong>5 hands</strong> </h2><h3 class="prize-copy-link"><a href="https://bankless.community">WIN 10,000 BANK.</a></h3><h4 class="prize-copy-extra">Option for second line of text</h4></div>\
		        <ul class=\'gameHomeContainer\'></ul>\
		      </div>\
		    </div>\
		</div>\
		<div class="accordion-item">\
		    <h2 class="accordion-header" id="headingOne">\
		      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">\
		        Goals for Game 0\
		      </button>\
		    </h2>\
		    <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">\
		      <div class="accordion-body">\
		        <ul><li><strong>Introduce/test fundamental cryptopoker mechanics:</strong> <ul><li>Buy-in to game with Tokens (internal game counters only)</li><li>Use Tokens to Mint Hands (everyone gets 5 - gas cost + minimum fee only)</li><li>Manage/Burn Hands</li></ul></li>\
		        <li><strong>Introduce/practice fundamental web3 mechanics (in an easy environment):</strong> <ul><li>Get a web3 Address and wallet (<a href="https://app.banklessacademy.com" target="_blank">wallet onboarding guide via Bankless Academy</a>)</li><li>Connect your wallet to a dApp with your public address to sign-in and interact with the app.</li><li>Claim FREE airdrop tokens (1 per wallet address)</li><li>Spend Tokens and pay Gas to MINT NFTs for the game</li><li>Manage/Burn NFTs in dApp and TRADE NFTs on OpenSea</li><li><strong>DYOR</strong> if rebuys make sense for you</li><li><strong>HODL</strong> your hands and wait for the end of the month prizing to be announced</li></ul>\
		        <li><strong>Internal:</strong> Gather data for prizing potential of future games</li>\
		        <li><strong>Internal/external:</strong> Assess game mechanics and potential for how to compromise the simple game mechanics.</li>\
		        <li><strong>Testnet Games:</strong> Gather a "whitelist" of connected wallet addresses from players as basis for future game launches.</li>\
		        <li>Provide UI for dApp baseline</li></ul><hr />\
		        <p style="text-align:center;"><strong>BUG BOUNTY:</strong> Submit a feedback report on your use of the app and you will earn 25 BANK tokens (once per user). <a href="mailto:help@justplay.cafe?subject=Cryptopoker%20Minting%20DApp%20-%20Feeedback-Report&body=WALLET ADDRESS: FEEDBACK REPORT: ">FEEDBACK REPORT</a>.</p><hr>\
		        <p style="text-align:center;"><strong>Need help? email us at <a href="mailto:help@justplay.cafe?subject=Cryptopoker%20Minting%20DApp%20-%20Help">help@justplay.cafe</a>.</strong></p>\
		      </div>\
		    </div>\
		</div>\
		<div class="accordion-item">\
		    <h2 class="accordion-header" id="headingTwo">\
		      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">\
		        Instructions for the game\
		      </button>\
		    </h2>\
		    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">\
		      <div class="accordion-body">\
		        <ul>\
		        	<li>You may only hold a combined total of 5 hands and tokens to mint at anytime. No hoarding!</li>\
					<li>First 5 tokens per wallet address connected are free to claim. </li>\
					<li>Would like to keep the distribution phase of the game to be as broad as possible. Hopefully making possible a distribution of some percentage of the contract earnings to <strong>all players of the game</strong>.</li>\
					<li>Subsequent token claims beyond the first one will incur an increasing buy-in cost. This game payments, along with after mint trades via openSea, will form the basis for future game prizing and continued development of new games and features.</li>\
					<li>Would like to look into contract level storage of the assets into a yield-generating strategy to match the asset being depositied (i.e. ETH, MATIC, BANK, etc.)</li></ul>\
		      </div>\
		    </div>\
		</div>\
		<div class="accordion-item">\
		    <h2 class="accordion-header" id="headingFour">\
		      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">\
		        Upcoming Games\
		      </button>\
		    </h2>\
		    <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">\
		      <div class="accordion-body">\
				<ul><li><a href="#">Coming Soon...</a></li></ul>\
		      </div>\
		    </div>\
		</div>\
	</div>';


		homePageContent += tempCollapse;

		if(currentUserTokens === "0") {
			// not logged in, just display a big connect button.
			homePageContent += "<p class='center-button'><a class='btn btn-danger btn-lg' onclick='addTokensPage()'><strong>BUY IN NOW</strong></a></p>";

		}

		// override buttons to display primary navigation buttons instead
		// homePageContent += "<h2></h2>";
		// homePageContent += "<ul><li>Introduce/test fundamental cryptopoker mechanics: <ul><li>Buy Tokens</li><li>Mint Hand</li><li>Manage/Burn Hands</li></ul></li><li>Gather data for prizing potential of future games</li><li>Assess game mechanics and potential for how to attack the game.</li><li>Gather a 'whitelist' of connected wallet addresses from players as basis for future game launches.</li><li>Provide UI for profile managment for username, email for future communications.</li></ul><hr />";
		//homePageContent += "<p><strong>Instructions and information needed here about the game and rules.</strong></p>";
		//homePageContent += "<ul><li>You may only hold a combined total of 5 hands and tokens to mint at anytime. No hoarding!</li>";
		//homePageContent += "<li>First 5 tokens per wallet address connected are free to claim. </li><li>Subsequent token claims beyond the first one will incur a (simulated) cost. This (eventual) game payments, along with after mint trades, will form the basis for future game prizing and continued development of new games and features.</li></ul>";



	// homePageContent += "<hr><h3>Games In Play:</h3>";
	// homePageContent += "<ul class='gameHomeContainer'></ul>";

	// homePageContent += "<hr><h3>Upcoming Games:</h3>";
	// homePageContent += "<ul><li><a href='#'>TBD</a></li></ul>";

		// addition of extra WC button below content.
	contentArea.innerHTML = homePageContent; 
	// + "<div class='button-container'>"+buttons+"</div>";;

	// console.log(isLoggedIn);

	// call the data acquisition function
	if(isLoggedIn) {
		console.log("Real logged in. Game On!");
		getGameInfo(activeGameNum, false, false);
	} else {
		let gameContainer = document.getElementsByClassName('gameHomeContainer');
		gameContainer[0].innerHTML = "<h4 class='login-label'>Please login with buttons above to see current game data.</h4>";
	}
}

// INTERNAL: add social media links UL via HTML
function buildSocialMedia() {
	// console.log('build logo and link for social media');

	let twitterUrl = "https://twitter.com/tomtranmer";
	let twitterImage = "img/twitter-logo.png";
	let discordUrl = "https://twitter.com/tomtranmer";
	let discordImage = "img/discord-logo.png";

	let socialHtml = "<ul class='social-links'>\
						<li><a href="+twitterUrl+" target=blank><img src="+twitterImage+" /></a></li>\
						<li class='disabled'><a href="+discordUrl+" target=blank><img src="+discordImage+" /></a></li>\
					</ul>";

	return socialHtml;
}

// INTERNAL: home data display functions
async function buildGameHomeOuput(end_time, total_hands) {

	console.log("Running buildGameHomeOuput", end_time, total_hands);
	let pctNum = total_hands/100;	// 100/10000 for current percentage
	let gameContainer = document.getElementsByClassName('gameHomeContainer');

	// ALL: home page

    // add in the UI for social media
	let twitterSocial = buildSocialMedia();
	contentArea.innerHTML += twitterSocial;


	let contractChain = "Polygon ";	

	let gameData = "<div class='game-data' title='Should do a little progress bar style indicator here for each active game'>Game ID: <a href='#' onclick='scoreboard("+activeGameNum+")'>00"+activeGameNum+"</a> "+contractChain+" Contracts<br>Hands: <span id=gameTotalHands>"+total_hands+"</span>/10,000  -  Ends: <span id=gameEndTime>"+end_time+"</span><br>"

	let gameProgress = '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="'+pctNum+'" aria-valuemin="0" aria-valuemax="100" style="width: '+pctNum+'%">'+pctNum+'%</div></div>';

	let condBuyInFee = "1st Buy-In Free";
	let freePlay = "free";

	console.log("Set current user plays to hand count number: %d", await getBalance(currentUserAddress));
	currentUserPlays =  Number(await getBalance(currentUserAddress));		// set global variable

	if(currentUserPlays > 0){
		freePlay = "";		//already redeemed freeplay
		condBuyInFee = "rebuy #"+currentUserPlays;
	}

	let gameBadges = "<ul class='badge-container'>\
						<li class='badge'>baseFees: "+defaultFees+" "+defaultCurrency+"</li>\
						<li class='badge "+freePlay+"' onclick='addTokensPage()'>"+condBuyInFee+"</li>\
					</ul>";

	let gameOutput = gameData + gameProgress + gameBadges + "</div>";		// format game data and dsiplay

	// this is for output of game promotional messgage and /or link
	gameOutput += "<h4 class='sponsor-promo' title='today's sponsor or marketing promo link'>Play long term games with long term people <a href='https://nav.al/long-term' taregt='_blank'>...</a></h4>";

	gameContainer[0].innerHTML = gameOutput;
}

// INTERNAL: used for Home and Profile and Mint
function assembleDisplayCard(id, isFlipped) {
	// from card id, build up animated cardflip for css animation
	// let cardDiv = "<img src='../cards/faces/front-mock-"+id+".png' alt ='Card Image' />";

	// console.log("Return HTML for display of single flippable card, based on cardID input. is used in dashboard display? - can be optimized?");

	let cardDiv = "";

	// console.log(id);
	let frontImg = "";

	let card1ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeicm6dqkpiop65z6i2peua54chs3bk7snakajwecre4oixsmswfwym";
	//var mainDeck1Ipfs = "https://bafybeicm6dqkpiop65z6i2peua54chs3bk7snakajwecre4oixsmswfwym.ipfs.dweb.link";			


	// A - Spades
	if(id === 1) { frontImg = mainDeck1Ipfs; } else
	if(id === 2) { frontImg = mainDeck2Ipfs; } else
	if(id === 3) { frontImg = mainDeck3Ipfs; } else
	if(id === 4) { frontImg = mainDeck4Ipfs; } else
	if(id === 5) { frontImg = mainDeck5Ipfs; } else
	if(id === 6) { frontImg = mainDeck6Ipfs; } else
	if(id === 7) { frontImg = mainDeck7Ipfs; } else
	if(id === 8) { frontImg = mainDeck8Ipfs; } else
	if(id === 9) { frontImg = mainDeck9Ipfs; } else
	if(id === 10) { frontImg = mainDeck10Ipfs; } else
	if(id === 11) { frontImg = mainDeck11Ipfs; } else
	if(id === 12) { frontImg = mainDeck12Ipfs; } else
	if(id === 13) { frontImg = mainDeck13Ipfs; } else

	if(id === 14) { frontImg = mainDeck14Ipfs; } else
	if(id === 15) { frontImg = mainDeck15Ipfs; } else
	if(id === 16) { frontImg = mainDeck16Ipfs; } else
	if(id === 17) { frontImg = mainDeck17Ipfs; } else
	if(id === 18) { frontImg = mainDeck18Ipfs; } else
	if(id === 19) { frontImg = mainDeck19Ipfs; } else
	if(id === 20) { frontImg = mainDeck20Ipfs; } else
	if(id === 21) { frontImg = mainDeck21Ipfs; } else
	if(id === 22) { frontImg = mainDeck22Ipfs; } else
	if(id === 23) { frontImg = mainDeck23Ipfs; } else
	if(id === 24) { frontImg = mainDeck24Ipfs; } else
	if(id === 25) { frontImg = mainDeck25Ipfs; } else
	if(id === 26) { frontImg = mainDeck26Ipfs; } else

	if(id === 27) { frontImg = mainDeck27Ipfs; } else
	if(id === 28) { frontImg = mainDeck28Ipfs; } else
	if(id === 29) { frontImg = mainDeck29Ipfs; } else
	if(id === 30) { frontImg = mainDeck30Ipfs; } else
	if(id === 31) { frontImg = mainDeck31Ipfs; } else
	if(id === 32) { frontImg = mainDeck32Ipfs; } else
	if(id === 33) { frontImg = mainDeck33Ipfs; } else
	if(id === 34) { frontImg = mainDeck34Ipfs; } else
	if(id === 35) { frontImg = mainDeck35Ipfs; } else
	if(id === 36) { frontImg = mainDeck36Ipfs; } else
	if(id === 37) { frontImg = mainDeck37Ipfs; } else
	if(id === 38) { frontImg = mainDeck38Ipfs; } else
	if(id === 39) { frontImg = mainDeck39Ipfs; } else

	if(id === 40) { frontImg = mainDeck40Ipfs; } else
	if(id === 41) { frontImg = mainDeck41Ipfs; } else
	if(id === 42) { frontImg = mainDeck42Ipfs; } else
	if(id === 43) { frontImg = mainDeck43Ipfs; } else
	if(id === 44) { frontImg = mainDeck44Ipfs; } else
	if(id === 45) { frontImg = mainDeck45Ipfs; } else
	if(id === 46) { frontImg = mainDeck46Ipfs; } else
	if(id === 47) { frontImg = mainDeck47Ipfs; } else
	if(id === 48) { frontImg = mainDeck48Ipfs; } else
	if(id === 49) { frontImg = mainDeck49Ipfs; } else
	if(id === 50) { frontImg = mainDeck50Ipfs; } else
	if(id === 51) { frontImg = mainDeck51Ipfs; } else
	if(id === 52) { frontImg = mainDeck52Ipfs; } else

	{ frontImg = mainDeckBackIpfs; } 
	
	// test for flipped or no
	let flipped = "";
	if(isFlipped) { flipped = "flipped";}

	cardDiv = "<div class='flip-card "+flipped+"' onclick='addClick(this, "+isFlipped+")'>";
	cardDiv += "<div class='flip-card-inner'>";
	cardDiv += "<div class='flip-card-front'>";
	cardDiv += "<img class='card-back-img' src='"+mainDeckBackIpfs+"' alt='Card' />";
	cardDiv += "</div>";
	cardDiv += "<div class='flip-card-back'>";
	cardDiv += "<img class='card-front-img' id='card-face' src='"+frontImg+"' alt='Card' />";
	// cardDiv += "<img class='card-front-img' id='card-face' src='../cards/faces/front-mock-"+id+".png' alt='Card' />";
	cardDiv += "</div>";
	cardDiv += "</div>";
	cardDiv += "</div>";


	return cardDiv;
}

// EXTERNAL: click handler for flips
function addClick(a, newMint) {

	// newMint = false indicates that it is already face up -> not a new mint

	// console.log(a);
	if (a.className === "flip-card") {
		// set it
		a.className = "flip-card flipped";

		// get the card displayed in a.previousSibling and unhide the display visibility.
		a.previousSibling.classList = " shown";

		// check for is all 5 flipped and then set global handRevealed flag to true
		// console.log(a.parentNode.nextSibling);		// should get next card
		if ( testForFiveFlipped(newMint) ) {

			console.log("This should be a big animation reveal - TBD");

			isHandRevealed = true;
			document.getElementById("nft-img").classList = " shown";
			document.getElementById("playHand").classList = "btn btn-outline-success btn-lg";
			document.getElementById("foldHand").classList = "btn btn-outline-danger btn-lg";
		}
		

	} else {
		// reset it
		a.className = "flip-card";

		// wait 400ms for card to flip and then update the reverse face image
		// setTimeout(updateFace(a), 500);
	}	
}
document.addClick = addClick;

// INTERNAL: surity test to trigger reveal of NFT on mint page
function testForFiveFlipped(newMint) {

	// console.log(newMint);

	// short circuit
	if(!newMint) {

		var allCards = document.getElementsByClassName("flip-card");

		// console.log(allCards);

		for (let card of allCards) {
		    // console.log(card.classList);

		    let thisCardClassLength = card.classList.length;

		    // if classList contains only a single class, i.e. not flipped
		    if (thisCardClassLength === 1) {
		    	// not yet all flipped
		    	return false;
		    	break;
		    }

		    // if it gets here, all cards should be flipped.
		    // console.log("Trigger 5 flipped animation to reveal NFT.");
		}

		return true;
	} else {
		// not a new mint, no need to test
		return false;
	}
}

// UI -> Hand manipulation

// EXTERNAL: triggered on FODL click by user
async function foldLastHand() {

	let indexNum = currentUserHands.length-1;
	console.log(lastTokenMint, indexNum);
	await burnBySending(lastTokenMint);		// this now also trigges burn hand db 

}
document.foldLastHand = foldLastHand;

// INTERNAL: mark the hand as folded in the database and assign to currentContract address as owner.
async function foldHandDatabase(mintNum) {

	console.log("Skip the DB fold hand call to db, should only need mint num.");

	// console.log(currentContract);

	return true;

	// use a POST to a PHP file to assign fold to true in databse storage
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/fold-hand.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     var response = this.responseText;

	     console.log(response);
	     // contentArea.innerHTML += response;

	     return true;
	   }
	};
	var data = {address:currentContract,gameId: activeGameNum,mintNum: mintNum};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));
}

/** FUNCTION CLEANUP CONTINUES BEYOND THIS POINT ***/



/********** Minting page **********/
// INTERNAL: return html display hand
function buildHandDisplayMint(hand, index) {
		// console.log(hand);

		// This should grab the correct card images, and display below the card display output, with a subtle rotation animation loop.

		let intIndex = parseInt(index) + 1;

		let handOut = "<div class='hand mint'>";	// + intIndex + "#: ";
		//		handOut += "<a class='showOnSlide' onclick='foldThisHand(this)'>FOLD</a>";
		//		handOut += "<p class='pull-right' onclick='slideHandRight(this)'> << </p>";

		handOut += "<table><tr><td><div class='cardDisplay'>" + hand.card1.display  + "</div>" + assembleDisplayCard(hand.card1.id, false) + "</td>";
		handOut += "<td><div class='cardDisplay'>" + hand.card2.display + "</div>" + assembleDisplayCard(hand.card2.id, false) + "</td>"; 
		handOut += "<td><div class='cardDisplay'>" + hand.card3.display + "</div>" + assembleDisplayCard(hand.card3.id, false) + "</td>"; 
		handOut += "<td><div class='cardDisplay'>" + hand.card4.display + "</div>" + assembleDisplayCard(hand.card4.id, false) + "</td>"; 
		handOut += "<td><div class='cardDisplay'>" + hand.card5.display + "</div>" + assembleDisplayCard(hand.card5.id, false) + "</td>";
		// handOut += "<td><img src='img/400x400.png' alt ='NFT Image' style='border:2px solid black' /></td>";
		handOut += "</tr></table>";

		handOut += "</div>";


		// output to DOM
		return handOut;
}


/** Profile Functions **/
// INTERNAL: 
function buildHandDisplayProfile(chainData) {

	let c1 = chainData[0];
	let c2 = chainData[1];
	let c3 = chainData[2];
	let c4 = chainData[3];
	let c5 = chainData[4];

	let handOut = "<div class='hand profile'>";

	handOut += "<table><tr><td><div class='cardDisplay shown'>" + c1.display  + "</div>" + assembleDisplayCard(c1.id, true) + "</td>";
	handOut += "<td><div class='cardDisplay shown'>" + c2.display + "</div>" + assembleDisplayCard(c2.id, true) + "</td>"; 
	handOut += "<td><div class='cardDisplay shown'>" + c3.display + "</div>" + assembleDisplayCard(c3.id, true) + "</td>"; 
	handOut += "<td><div class='cardDisplay shown'>" + c4.display + "</div>" + assembleDisplayCard(c4.id, true) + "</td>"; 
	handOut += "<td><div class='cardDisplay shown'>" + c5.display + "</div>" + assembleDisplayCard(c5.id, true) + "</td>";
	handOut += "</tr></table>";

	handOut += "</div>";

	// output to DOM
	return handOut;
}

// EXTERNAL: navigate to edit profile page
function editProfile() {
	// load the user's profile with editable fields for:
	// username
	// email
	// etc.

	// call to db to get username, email, etc.
	console.log("Edit Profile Here - TBD");

	contentArea.innerHTML = "<h3 class='clear'><a href='#' title='back' class='badge bg-secondary' onclick='dashboard()'> < </a> Edit My Profile</h3>";
	// contentArea.innerHTML += "<h4>Edit Profile Here</h4>";

	getUserProfileData(false, true);		// true here for fist data will generate a call to determine FX price 

	// done
}
document.editProfile = editProfile;

function gotoDashboard(clicked_this) {

	// console.log("TBD: remove active status for all menu items");
	removeActiveMenus();

	// handle the menu active status
	clicked_this.classList.toggle("active");

	// nav to page
	dashboard();
}
document.gotoDashboard = gotoDashboard;

// INTERNAL: navigation -> dashboard (formerly called myProfile)
// also calls displayNFTs function
function dashboard() {

	// reset content area
	contentArea.classList = "";
    contentArea.style.opacity = 1;

    // use the global var
	userProfile = getUserProfile();
	let userTokens = userProfile.tokens;
	let userHands = userProfile.hands;
	let userID = userProfile.address
	// Do we have these here?
	
	// console.log(userProfile);
	let userName = userProfile.username;
	let userEmail = userProfile.email;

	// console.log("Better to get tokens from: " + currentUserTokens);

	if(userName !== "") {
		// only assign the override to wallet address for userID if the value for username is set in storage
		userID = userName;
	} 

	// confirm email against flag
	if(userEmail === null){
		console.log("email is Null");
		isRegistered = false;

	} else if(userEmail === "null"){
		console.log("email is Null - string");
		isRegistered = false;
	} else if(false) {
		// email does not match specified pattern
	} else if(false) {
		// email has not been verified
	} else {
		isRegistered = true;
	}


	// page header
	contentArea.innerHTML = "<h3>Dashboard</h3>";
	// conditional display if email on profile is not set

	let buttonHighlight = "<-- HEY NEW USER CLICK HERE FOR THEMES";
	let regCheck = "";

	if(isRegistered) {
		buttonHighlight = "";
		regCheck = "☑";
	}


	contentArea.innerHTML += "<p>UserID: <small><a title='Click here to edit your profile data' href='#' onclick='editProfile()'>"+userID+"</a></small> "+regCheck+"</p>";

	if(!isRegistered) {
		// this has the promotional banner 
		contentArea.innerHTML += "<p><a class='btn btn-primary disabled' href='#' title='Click here to edit your profile data' onclick='editProfile()'>Edit My Profile</a>"+buttonHighlight+"</p>";
	} else {
		// slip a clean button into the button area
		contentArea.innerHTML += "<a class='btn btn-outline-primary disabled' href='#' title='Click here to edit your profile data' onclick='editProfile()'>Edit My Profile</a>";
	}

	if (userTokens < 1) {
		// then get some tokens to play the game
		contentArea.innerHTML += "<a class='btn btn-danger' onclick='addTokensPage()'><strong>Get Some Tokens</strong></a>";
	} else {
		// then go play the game already!
		contentArea.innerHTML += "<a class='btn btn-primary' onclick='mintPage()'><strong>Let's Play!</strong></a>";

	}

	contentArea.innerHTML += "<a title='First: disconnect your wallet from the site, then click this button.' class='btn btn-outline-danger' onclick='logOut();'>Log Out Wallet</a>";

	if (currentUserAddress === ownerWallet) {
		contentArea.innerHTML += "<hr><p><i>Owner Only Functions Only.</i></p>";
		contentArea.innerHTML += "<a class='btn btn-outline-success' onclick='testDEP();'>TestDEP</a>";
		contentArea.innerHTML += "<a class='btn btn-outline-success' onclick='depositWD();'>DepositWD</a>";
		contentArea.innerHTML += "<a class='btn btn-outline-success' onclick='minterWD();'>MinterWD</a>";
	}



	// get the blockchain NFTs for the connected wallet address and display on the profile page with os links.
	displayNFTs();

	return true;
}
document.dashboard = dashboard;



async function logOut() {
	setCookie("isLoggedIn", false);		// cookie login depreciated?
	setCookie("currentTokens", 0);
	setCookie("currentUserHands", [], -1);

	isLoggedIn = false;

	console.log("Send disconnect request to metamask.");

	console.log("ADD: walletConnect disconnect request with wcprovider");

	console.log(wcprovider);
	if(wcprovider){
		console.log('disconnect wc FIX REQ');
		// Close provider session OLD
		// await wcprovider.disconnect();

		console.log(web3Modal);

	}
	

	// const permissions = await ethereum.request({
	// 		method: 'wallet_requestPermissions',
	// 		params: [{
	// 		eth_accounts: {},
	// 	}]
	// });

	alert("Your current session has been ended. To fully logout from this site, please click 'connected' in your wallet and choose the manual 'Disconnect this account' option.");

	UIloop();		// trigger UI refresh and go home

	// goHome();

	// location.reload();
}
document.logOut = logOut;

/** INTERNAL TOKEN MANAGEMENT FUNCTIONS **/
// DEPRECIATED
function handleBuyClick(selected) {
	buyNum = selected.value;
}


/** Page Content - addTokensPage **/
function addTokensPage() {

	// get current user
	userProfile = getUserProfile();
	// console.log(userProfile);

	contentArea.innerHTML = "";
	getBuyinCost(activeGameNum);

}
document.addTokensPage = addTokensPage;

async function convertETHtoCAD(amtInETH) {

	// init vars
	let ethPrice = "";
	let cad_cost = 1.0;

	console.log("ETH or MATIC");
	if(defaultCurrency === "MATIC"){
		// cad_cost = amtInETH * MATICtoCAD;
		// console.log("MATIC in CAD: " + cad_cost);
		ethPrice = await tatumAPI_getPrice("MATIC","data");

	} else {
		ethPrice = await tatumAPI_getPrice("ETH","data");
	}

	cad_cost = amtInETH * ethPrice;
	console.log("ETH in CAD: " + cad_cost);


	return cad_cost;
}

async function userClaimFive(){

	console.log("Call user claim 5 contract");

	console.log("rewrite this claim contract using viem!");
	// build in place
	const publicClient = createPublicClient({
		chain: polygon,
		transport: http()
	  })
	const walletClient = createWalletClient({
		chain: polygon,
		transport: custom(window.ethereum)
	  })
	  
	const [address] = await walletClient.getAddresses();
	console.log(address);
	  
	const { request } = await publicClient.simulateContract({
		address: faucetContract,
		abi: faucetABI,
		functionName: 'requestTokens',
		account: address,
	  })
	const hash = await walletClient.writeContract(request)







	// console.log(myWalletClient);		// do we have this here? OK

	// THIS WORKS FOR METAMASK ONLY

	// let myProvider = new ethers.providers.Web3Provider(window.ethereum);		// assignment of provider happens here
	// let signer = myProvider.getSigner();
	// let fc_RW = new ethers.Contract(faucetContract, faucetABI, signer);

	// let mint5 = await fc_RW.requestTokens();		// ask for 5 tokens
	// console.log(mint5);	
	if(hash){
		alert("All set!");// OK
		window.location.reload();		// refresh the page to show the new tokens
	} else {
		alert("Something went wrong with this trasnaction. Please try again.");
	}
	

}
document.userClaimFive = userClaimFive;

function swapTokenModal() {

	console.log("Trigger swap token modal.");

	//open in new browser tab UNISWAP && CPT
	window.open("https://app.uniswap.org/#/swap?outputCurrency=0x250DA35D189e014Cd9a393F40ba0102ef7fE4102", "_blank");

	return true;
}
document.swapTokenModal = swapTokenModal;

// takes the number of plays and shows the user what they will pay for the next rebuy into the game
async function outputBuyinCost(numPlays) {

	let powerPlay = parseInt(numPlays);

	// console.log(Math.pow(10,powerPlay));		// expecting 100
	// console.log(parseFloat(defaultFees))			// expecting 0.00001

	let eth_cost = Math.pow(10,powerPlay) * parseFloat(defaultFees);
	let cad_cost = await convertETHtoCAD(eth_cost);

	console.log(powerPlay, eth_cost, cad_cost);


	console.log(currentUserHands);		// OK getting this doubled here for some reason, not actually used

	console.log(currentUserAddress);
	//get the number of hands held by the current user ON CHAIN
	let myNFTnum = await getBalance(currentUserAddress); //cpContract.balanceOf(currentUserAddress);
	console.log(Number(await myNFTnum));

	let myNFTmax = 5;	 //ethers.BigNumber.from(5);

	console.log(myNFTnum, myNFTmax);

	if(Number(myNFTnum) >= myNFTmax){
		// only can buy if not holding 5 hands
		contentArea.innerHTML += "Player has no space left, <a href='#' onclick='dashboard();'>discard some hands</a> first.";
	} else {

		// welcome and game number indicator

		contentArea.innerHTML += "<h2>Buy-In to game #: " + activeGameNum + "</h2>";

		// console.log("Buy now buttons are generated here with labels for Buy-IN and re-Buy, numplays: " + numPlays);

		console.log("If numPlays is 0, hands are 0, and tokens are 0");
		console.log(currentUserTokens, numPlays);

		if(currentUserTokens === 0 || !numPlays) {
			// if this is the first play, let the user know their buy-in for 5 tokens is free
			contentArea.innerHTML += "<div class=text-center><a class='btn btn-success btn-lg' onclick='userClaimFive()'>Claim 5 CPT FREE!</a></div>";
		} else {
			// if this is a subsequent play

			// console.log(eth_cost, cad_cost);

			if(parseFloat(eth_cost) < defaultFees){
				eth_cost = defaultFees;
			} else {
				eth_cost = eth_cost.toFixed(5);
			}

			// console.log(currentUserTotalSpend);

			console.log("Get Balance of CPT in Faucet Contract");

			// const balData = await readContract({
			// 	address: faucetContract,
			// 	abi: faucetABI,
			// 	functionName: 'getBalance',
			// 	args: [currentUserAddress]
			// });
			// console.log(balData);	

			let myProvider = new ethers.providers.Web3Provider(window.ethereum);
			let signer = myProvider.getSigner();
			
			let fc_RW = new ethers.Contract(faucetContract, faucetABI, signer);
			let faucetBalance = await fc_RW.getBalance();
			
			// convert faucetBalance to int
			faucetBalance = ethers.utils.formatEther(faucetBalance);

			console.log(faucetBalance, currentUserTokens);		//90		OK


			// let faucetBalance = await cpContract.balanceOf(faucetContract);

			// CONDITIONAL TEMP: If the user has no tokens, show them the free buy-in button
			if(currentUserTokens < 1) {
				if(faucetBalance >= 5) {
					// can claim
					console.log("hello");
					contentArea.innerHTML += "<div class=text-center><a class='btn btn-success btn-lg' onclick='userClaimFive()'>Claim 5CPT From Faucet<br>FREE <small>(+gas)</small></a></div>";
				} else {
					// can swap (TBD)
					contentArea.innerHTML += "<div class=text-center><a class='btn btn-success btn-lg' onclick='swapTokenModal()'>Swap for CPT</a></div>";
				}
			} else {
				// if the user has tokens, show them the swap button
				contentArea.innerHTML += "<div class=text-center><a class='btn btn-success btn-lg' onclick='swapTokenModal()'>Swap for CPT</a></div>";
			}

			// catch-all placeholder (removed)
			// contentArea.innerHTML += "<div class=text-center><a class='btn btn-success btn-lg' onclick='userClaimFive()'>Claim 5CPT From Faucet - FREE</a></div>";
			

			// contentArea.innerHTML += "<div class=text-center><a class='btn btn-success btn-lg' title='Approx cost $"+cad_cost+" CAD to rebuy.' onclick='userBuyNow(5, "+powerPlay+")'>Rebuy #"+numPlays+" <br>("+eth_cost+" "+defaultCurrency+" +gas)</a><br>~$CAD "+cad_cost.toFixed(3);

			if(!currentUserTotalSpend){ currentUserTotalSpend = 0; }
			
			contentArea.innerHTML += "<hr>Personal Total: <span id='total_spend_replace'>"+currentUserTotalSpend.toFixed(5)+" "+defaultCurrency+" + gas paid</span><strong> for GameNum: "+activeGameNum+"</strong><br></div>";
		}
		// instructions area for clarity of puying process
		let instructions = "<hr><p>TBD: REWRITE THIS<strong>What you get when buying in:</strong></p>";
		instructions += "<ul><li>(Hands owned + Token Balance) Refill to 5 (CP NFTs + Hands) <br>(you cannot hold more than 5 tokens or hands together)</li><li>One <strong>CP Hand NFT</strong> can be minted for each CP Token you hold.</li><li>The game receives fees based on the number of plays (base mint fee) and rebuys.</li><li>Rebuys <strong>increase 10x with each round</strong>, so plan your folds and rebuys carefully to get the most from your buys.</li><li>Pay attention to current game specs as each CP game can have specific proceeds allocations, prizing requirements and awards. DYOR.</li></ul>";

		/**  </li><li>Players with the best hands are rewarded with game profits to their connected wallet address.</li> **/

		contentArea.innerHTML += instructions;
	}
	
}

	
// DEPRECIATED - Obsolete?
function userBuyNow(num,numPlays) {


	if(numPlays > 0) {

		// console.log(parseInt(defaultFees))

		let powerPlay = parseInt(numPlays);

		let eth_cost = Math.pow(10,powerPlay) * parseFloat(defaultFees);
		// this will require a rebuy cost too be tx and confirmed via metamask BEFORE sending the buy order

		if(parseFloat(eth_cost) < defaultFees ) {
			// console.log("Min order triggered");
			eth_cost = defaultFees;
		}

		// console.log("tx detail - eth_cost: " + eth_cost + " | Address: " + currentUserAddress);

		sendTxAndBuy(eth_cost);

	} else if(numPlays > 10) {
		let eth_cost = 1;
		console.log("MAX BUY - eth_cost: " + eth_cost + " | Address: " + currentUserAddress);

		sendTxAndBuy(eth_cost);

	} else {
		// default call for first buyin -> omit any necessity for ETH transfer
		buyTokensForEth(tokenMaxNum,0);
		incrementPlaynum(1);		// update playnum to 1 for first buyin 
		console.log("Later check for playnum === 0 to determine if free buyin is allowed");
	}

		// moved inside transaction confrmation window.
		// buyTokensForEth(num);

		// console.log("Need to trigger a send of currency as specified by eth_cost -> build a function and only trigger the function on successful database implementation of tokens tx for address.");

		// test function


	

	// calculateUserBalance(activeGameNum);	// call with gameNum
	// original legacy code below

	if(currentUserTokens <= 5) {

		// console.log("This should only trigger display after mint action has concluded. Flip for loading screen implementation here")
		// add to current page
		contentArea.innerHTML = "<h3 class='wallet-tx'>AUTHENTICATING TX...</h3>";
		// contentArea.innerHTML += "<p>My Address: <small>"+userProfileDemo.address+"</small></p>";
		// contentArea.innerHTML += "<p>My Tokens: "+currentUserTokens+"</p>";
		// contentArea.innerHTML += "<a class='btn btn-primary' onclick='mintPage()'><strong>Let's Play!</strong></a>";
	} else {
		contentArea.innerHTML = "<h3>You already have too many Tokens to buy "+num+"</h3>";
		contentArea.innerHTML += "<a class='btn btn-primary' onclick='mintPage()'><strong>Let's Play!</strong></a>";
	}

	// final entry updates the UI content area
	// UIloop();
}
document.userBuyNow = userBuyNow;

/** NFT Minting functions **/
function gotoMint(clicked_this) {

	removeActiveMenus();
	// handle the menu active status
	if(clicked_this) {
		clicked_this.classList.toggle("active");
	}

	mintPage();
}
document.gotoMint = gotoMint;

/** THIS FUNTION MOVED TO main.Nav.js module in order to test **/

// make functions available to the main program
// import { mintPage } from '/myScript.js';

// EXTERNAL: Page Content -> Mint Page **/
async function mintPage() {
	console.log("Mint page is here");
	// console.log(userProfile);		// these are getting here but are the unfinished version of the variables

	let contentArea = document.getElementById("contentArea");
	let userID = "<small>"+userProfile.address+"</small>";

	if(userProfile.username !== "") {
		// only assign the override if the value for username is set in storage
		userID = userProfile.username;
	}

	//console.log("BUG: Trigger internal token balance update...");
	calculateUserBalance(activeGameNum);		// trigger a user balance update 

	//get the number of hands held by the current user ON CHAIN
	let myNFTnum = await getBalance(currentUserAddress);
	let myNFTmax = ethers.BigNumber.from(5);

	// console.log(myNFTnum);

	contentArea.innerHTML = "<hr><hr><p><strong>Welcome</strong> "+userID+" to the DEAL/MINT Page.</p>";

	contentArea.innerHTML += "<h2>Pay the dealer 1CPT to build your hand!</h2>";
	
	// "<p>Pressing the button below to trigger the Mint action will spend one of your CP tokens, <strong>Algorithmically generate a stadard 52-card deck, and randomize draws for 5 unique cards with 5 dice rolls,</strong> then issue the NFT to be minted to your address. (will require payment from connected wallet in "+defaultCurrency+") Your 5-card hand will then be revealed for play. <strong>Flip all 5</strong> to reveal your NFT and then <strong>Choose to keep your hand (HODL) or fold (FODL)</strong>.</p><p><strong>Be advised: Burning hands is a one way process and cannot be reversed.</strong> Choose wisely!</p><hr>";

	contentArea.innerHTML += "<p>My Tokens: "+currentUserTokens+"</p>";

	// console.log(currentUserHands);

	// contentArea.innerHTML += "Test for ETH or native/gas token available to mint";
	let myBalance = await myClient.getBalance({
		address: currentUserAddress
	});
	let myBalEth = ethers.utils.formatEther(myBalance);
	console.log("Test for ETH or native/gas token available to mint", myBalEth);


	if(myBalEth <= 0.0){
		// the user does hold sufficient funds in their wallet
		console.log("Cannot mint more you have no " + defaultCurrency);
		contentArea.innerHTML += "Cannot mint more hands. <strong>You currently hodl an insufficient amount of "+defaultCurrency+" to pay for gas.</strong>. If Rinkeby, try the faucet: <a target='_blank' href='https://rinkebyfaucet.com/'>https://rinkebyfaucet.com/</a>";
	} else if (myNFTnum >= myNFTmax) {
		console.log("Cannot mint more you have too many");
		contentArea.innerHTML += "Cannot mint more hands. <strong>You currently hodl the maximum number.</strong>.";
		contentArea.innerHTML += "<a class='btn btn-info' onclick='dashboard()'><strong>DASHBOARD</strong></a>";
	} else if(userProfile.hands.length > 0 && currentUserTokens === 0) {
		console.log("Cannot mint more, you have some hands but no tokens");
		contentArea.innerHTML += "Cannot mint more hands. <strong>You currently have no tokens.</strong>.";
		contentArea.innerHTML += "<a class='btn btn-info' onclick='addTokensPage()'><strong>Go Get Some</strong></a>";

	} else if (currentUserTokens > 0) {
		contentArea.innerHTML += "<div class=text-center><a id='bigDeal' class='btn btn-lg btn-outline-primary' onclick='mintAction()'><strong>DEAL</strong></a><hr></div>";
	} else {
		contentArea.innerHTML += "<a class='btn btn-danger' onclick='addTokensPage()'><strong>BUY IN</strong></a>";
	}

}
document.mintPage = mintPage;

/********* Deck and hand building functions **********/

function buildDeck() {
	var deck = [
        {id: 1, display: "A♠️", value: 1, suit: "spades", solo: "AS", ipfs_cid:"bafybeicm6dqkpiop65z6i2peua54chs3bk7snakajwecre4oixsmswfwym"},
        {id: 2, display: "2♠️", value: 2, suit: "spades", solo: "2S", ipfs_cid:"bafybeicbh7ha56qzjc2yfrmnwhi6sy4xaougfccthyayiij3rkma3ycgte"},
        {id: 3, display: "3♠️", value: 3, suit: "spades", solo: "3S", ipfs_cid:"bafybeif64xmkdw37g3j3hbgbk6zjr652tbfnomenspn4qs2ghckvqhywsa"},
        {id: 4, display: "4♠️", value: 4, suit: "spades", solo: "4S", ipfs_cid:"bafybeibnkq7djhqw5dp67peds6jidp3dvjdxmzkucaap3y5fhqpkpchkla"},
        {id: 5, display: "5♠️", value: 5, suit: "spades", solo: "5S", ipfs_cid:"bafybeifabkwl35c7vjkk32zypzaf3mah7eakuk3zw36u7an7yxkmmygveq"},
        {id: 6, display: "6♠️", value: 6, suit: "spades", solo: "6S", ipfs_cid:"bafybeiccv32yxyi75cmyu3lyggpkul6gyedddv3q3o3mxmqa4qlvoclnfu"},
        {id: 7, display: "7♠️", value: 7, suit: "spades", solo: "7S", ipfs_cid:"bafybeiasu3edvhxjjnw65r3jrrvjessmt5pkf33ytivl2tc5jrncy37eiq"},
        {id: 8, display: "8♠️", value: 8, suit: "spades", solo: "8S", ipfs_cid:"bafybeibdiuodmblfk4ecnk6o3n2hltfg2j6nwvu6uzdby7docx22rcdd3q"},
        {id: 9, display: "9♠️", value: 9, suit: "spades", solo: "9S", ipfs_cid:"bafybeidpsqiaxnxpgockpht7ecqaeu5pb33uwca5gbodalcdihb66fyqyy"},
        {id: 10, display: "10♠️", value: 10, suit: "spades", solo: "TS", ipfs_cid:"bafybeihwnp5lbmh7hxlayygx6hl7av54dcdblbatyqblddycgtmflkya2a"},
        {id: 11, display: "J♠️", value: 11, suit: "spades", solo: "JS", ipfs_cid:"bafybeidvz3a5y55rxwcstuvys7b4g56hnrcfnmp7qdfvinwl4nde6wztja"},
        {id: 12, display: "Q♠️", value: 12, suit: "spades", solo: "QS", ipfs_cid:"bafybeic2bp2uohmqsbs3aa3sqn5olkdj43pf6g4nkc7jejfm6h74udh6gq"},
        {id: 13, display: "K♠️", value: 13, suit: "spades", solo: "KS", ipfs_cid:"bafybeibckznpp76427qsd4hf74epva445fmuloeid4jicttrgdcgkj2pmy"},
        {id: 14, display: "A♥️", value: 1, suit: "hearts", solo: "AH", ipfs_cid:"bafybeicc5ppnndblirjsvszgqbnj2cuakoladvrbdwz7dsdi47z4kcssl4"},
        {id: 15, display: "2♥️", value: 2, suit: "hearts", solo: "2H", ipfs_cid:"bafybeie7lbe7piavel4celocm4nitytkjdb4c4j6b2qvgpl2xph2up22ty"},
        {id: 16, display: "3♥️", value: 3, suit: "hearts", solo: "3H", ipfs_cid:"bafybeidlhzopv5di4i4j5pu7sh5i7hrjxmafxyrrjhaway73ebyg5qcuxu"},
        {id: 17, display: "4♥️", value: 4, suit: "hearts", solo: "4H", ipfs_cid:"bafybeigo5ng5z7rur6godmnyehbbwzpciy7gatefaavomyxhojxxnlj4qe"},
        {id: 18, display: "5♥️", value: 5, suit: "hearts", solo: "5H", ipfs_cid:"bafybeigtyxk6bsok6y7bva4rbjblghvrarb5bjpu7mrelklmwdhvcagihm"},
        {id: 19, display: "6♥️", value: 6, suit: "hearts", solo: "6H", ipfs_cid:"bafybeif3nrxgwmr4cxzayvv5q5wcvkoj2zkr7fhvgfxbiceg3ge7nctxq4"},
        {id: 20, display: "7♥️", value: 7, suit: "hearts", solo: "7H", ipfs_cid:"bafybeiatbyhy2jkssj7gfq5brfc2fklvkctewwmzaozuzktmu6nr57kxsi"},
        {id: 21, display: "8♥️", value: 8, suit: "hearts", solo: "8H", ipfs_cid:"bafybeichdgpmuzhvcalw7c3cng5hyiapl33l3mnfn5a7aien6h5n2kbwxe"},
        {id: 22, display: "9♥️", value: 9, suit: "hearts", solo: "9H", ipfs_cid:"bafybeicd6gb4c267tfebbunv7gjh2sr5syui4z5y6iheofu7wunzeplh64"},
        {id: 23, display: "10♥️", value: 10, suit: "hearts", solo: "TH", ipfs_cid:"bafybeihgkio5we23api2q6soldkjecu4qx6jc7lh7tmxoakpdjcho3g4p4"},
        {id: 24, display: "J♥️", value: 11, suit: "hearts", solo: "JH", ipfs_cid:"bafybeighdsvapdmvxkzgaqxmbsyi426oh6hx2kyh5jwumly7pldznudetm"},
        {id: 25, display: "Q♥️", value: 12, suit: "hearts", solo: "QH", ipfs_cid:"bafybeihvuvbvozmsl5ynyyby5jbt7ftlpbep3niiek7fww5xiwtdibnjbm"},
        {id: 26, display: "K♥️", value: 13, suit: "hearts", solo: "KH", ipfs_cid:"bafybeie5hsefyfvdwda6ybs5laaqvtq6iay4kwtqe4zlthh74hznaiqb7i"},
        {id: 27, display: "A♦️", value: 1, suit: "diamonds", solo: "AD", ipfs_cid:"bafybeidyyl5je3sssgu2cqtbfsiudu3uphgzwsavtjgdlum4vhuifh26bm"},
        {id: 28, display: "2♦️", value: 2, suit: "diamonds", solo: "2D", ipfs_cid:"bafybeidwksaegho7jlexc4rlnzqkppk6vl4nt5bwxta3a2ek6mvwevhrdy"},
        {id: 29, display: "3♦️", value: 3, suit: "diamonds", solo: "3D", ipfs_cid:"bafybeieyvtgq2j3ulbf6elt2z5d7exuzwfekekjntrkj7jchnwddpd5n4i"},
        {id: 30, display: "4♦️", value: 4, suit: "diamonds", solo: "4D", ipfs_cid:"bafybeibgfzlbwtmjgjaftorge5oigvut3wfcre3yv7hg6sbkuhpfk76udi"},
        {id: 31, display: "5♦️", value: 5, suit: "diamonds", solo: "5D", ipfs_cid:"bafybeigxbtmrtpvjercmh72smnfruiht7vvjqs2brbavifmxpe6j73jtk4"},
        {id: 32, display: "6♦️", value: 6, suit: "diamonds", solo: "6D", ipfs_cid:"bafybeidpswgtgldpydipzf7d6h7eyeouazbazqumtwzueeoucke3chtu5y"},
        {id: 33, display: "7♦️", value: 7, suit: "diamonds", solo: "7D", ipfs_cid:"bafybeicixdgug5kbyx74taqwabv5i33vtxqvywsxcyhin6xgc4afhoaiuu"},
        {id: 34, display: "8♦️", value: 8, suit: "diamonds", solo: "8D", ipfs_cid:"bafybeic2cwfv3iv3d7jazyc44kzn5kzsc3pyhpkabqxpyiqdbapmc322bu"},
        {id: 35, display: "9♦️", value: 9, suit: "diamonds", solo: "9D", ipfs_cid:"bafybeickwbzgnerdryvsmbnsrc6w7kgicporfa62k2hgrlbb43hqy4avgi"},
        {id: 36, display: "10♦️", value: 10, suit: "diamonds", solo: "TD", ipfs_cid:"bafybeih6vf6e3e6efv5omyygbbbs6hukyb7ixnzx76eljliqutl5q4gkve"},
        {id: 37, display: "J♦️", value: 11, suit: "diamonds", solo: "JD", ipfs_cid:"bafybeibk7tk5o5mycksi7b7o2zgarbgkphbr2yxj3vj277n7uc5cakdxtq"},
        {id: 38, display: "Q♦️", value: 12, suit: "diamonds", solo: "QD", ipfs_cid:"bafybeiczvslukdwq2eprqp5qnvfycuxco5yfiu4pe2v26ckdbuypkqmtyi"},
        {id: 39, display: "K♦️", value: 13, suit: "diamonds", solo: "KD", ipfs_cid:"bafybeidyh3qsd7qwshuyhy23l2j7r5shaak6ckvwgretthscx4ytwfut5m"},
        {id: 40, display: "A♣️", value: 1, suit: "clubs", solo: "AC", ipfs_cid:"bafybeicsl4ey6tyqm4sshs7aappbdpdx4s3mgpuhg4pf6lhg2ry5i6fypm"},
        {id: 41, display: "2♣️", value: 2, suit: "clubs", solo: "2C", ipfs_cid:"bafybeihhj3yxezzc5in7pu5gbeklrazgcse2ingafbf6xgqwedsvzhxgcy"},
        {id: 42, display: "3♣️", value: 3, suit: "clubs", solo: "3C", ipfs_cid:"bafybeied5qgvk3y5al7rtu4w6jbrkbathd44jya4hg5fgsjn2m7g2hfchm"},
        {id: 43, display: "4♣️", value: 4, suit: "clubs", solo: "4C", ipfs_cid:"bafybeih32qnsk5z3esn7r35wuk3fc5hosbwhtlefcz5jeiig7ji4p654yy"},
        {id: 44, display: "5♣️", value: 5, suit: "clubs", solo: "5C", ipfs_cid:"bafybeihgi6owbc64x2zjack2u2e2ynre5kbtzh2odvkhv3cjhbnxy5tkry"},
        {id: 45, display: "6♣️", value: 6, suit: "clubs", solo: "6C", ipfs_cid:"bafybeibu45oij4wlktc4rczhjifmtref3kpsmja5ay46f5jinri7almety"},
        {id: 46, display: "7♣️", value: 7, suit: "clubs", solo: "7C", ipfs_cid:"bafybeicam667cpvax3lxofmlcp5cp5hzdr2lut4mx3mp4h563zpneqkv5e"},
        {id: 47, display: "8♣️", value: 8, suit: "clubs", solo: "8C", ipfs_cid:"bafybeie4bvib3pgycc4me2efapmnovcuwentlahuyfu3nytnnggelfx4ny"},
        {id: 48, display: "9♣️", value: 9, suit: "clubs", solo: "9C", ipfs_cid:"bafybeig2qwartbxtv5ocb5s7cbkeywbev6qryj5udoaxeof6ykiaht4d24"},
        {id: 49, display: "10♣️", value: 10, suit: "clubs", solo: "TC", ipfs_cid:"bafybeif5ajwe6nkbvvo4lxiievscg4gt65rd7ud5fmw2psre2hsigoxwq4"},
        {id: 50, display: "J♣️", value: 11, suit: "clubs", solo: "JC", ipfs_cid:"bafybeia2ah36lsvgilaal24wv4j22n2ccwhbftpokrqgt3kofairxclzga"},
        {id: 51, display: "Q♣️", value: 12, suit: "clubs", solo: "QC", ipfs_cid:"bafybeiewpnsl2lndtm7y3drqzlz6bv3n6jdd7fvlgnfuf4wjlqtle7wue4"},
        {id: 52, display: "K♣️", value: 13, suit: "clubs", solo: "KC", ipfs_cid:"bafybeid6a6vngp2h4ucvaoqpvyshn7nz3o7oce3qv4lc3q6vw7kcinwpvm"}
    ];

	return deck;
}

async function getASampleHand(currentHandCount) {
	// GOAL: enerate a hand at random from a new deck

	var sampleHand = {};
	// get a new deck
	var deckDeal = buildDeck();

	// card 1
	let c1 = Math.floor(Math.random() * deckDeal.length);
	let card1 = deckDeal[c1-1];
	deckDeal = deckDeal.filter(function(item) {
		return item.id !== c1
	});

	// card 2
	let c2 = Math.floor(Math.random() * deckDeal.length);
	let card2 = deckDeal[c2-1];
	deckDeal = deckDeal.filter(function(item, index) {
		return index !== c2-1;
	});

	// card 3
	let c3 = Math.floor(Math.random() * deckDeal.length);
	let card3 = deckDeal[c3-1];
	deckDeal = deckDeal.filter(function(item, index) {
		return index !== c3-1;
	});

	// card 4
	let c4 = Math.floor(Math.random() * deckDeal.length);
	let card4 = deckDeal[c4-1];
	deckDeal = deckDeal.filter(function(item, index) {
		return index !== c4-1;
	});

	// card 5
	let c5 = Math.floor(Math.random() * deckDeal.length);
	let card5 = deckDeal[c5-1];
	deckDeal = deckDeal.filter(function(item, index) {
		return index !== c5-1;
	});

		// this handles all live hand generation builds
		sampleHand = {
			card1: card1,
			card2: card2,
			card3: card3,
			card4: card4,
			card5: card5
		}

	return sampleHand;
}

/********* NFT Component building functions **********/

// async function buildSvgStart(hand) {
// 	// to get mintNum and auto proceed to fct backToSvg
// 	// getGameInfo(activeGameNum, false, true);	// true for isNewMint 

// 	// let newMintNum = gameData.total_hands; 
// 	// 	lastTokenMint = newMintNum;
// 		// update this var to use chain rather than db to determine new mint num
// 		let lastTokenMint = await checkCount;		//cpContract.count();

// 		console.log("New Mint Number assigned to lastTokenMint var. %d", lastTokenMint);
// 		backToSvg(lastTokenMint);

// 	return true;

// }

async function buildSvgStart(hand) {

	lastTokenMint = await checkCount;		//cpContract.count();
	console.log("New Mint Number assigned to lastTokenMint var. %d", lastTokenMint);

	// console.log(hand);
	// let hand = currentUserHands[currentUserHands.length-1];
	hand.mintNum = lastTokenMint;		// keeping the + 1 to align with value displayed on NFT image;
	let assessment = assessHand(hand);
	buildSvg(hand, assessment[0], currentHandAttr);		// currentHandAttr is an array of attributes to pass to opensea

}

function buildSvg(hand, assessment, attr) {

	// console.log(hand);

	let mySvg = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: sans-serif; font-size: 14px; } .title { font-size: 18px; font-weight:bold; fill: #F47A1F; font-family: sans-serif; } .alert{ text-decoration:underline; fill: #E6C65B; } .small{ font-size: 12px;} .heavy{ font: italic 20px serif;}</style>';

	mySvg += '<rect width="100%" height="100%" fill="#3d3838" /><text x="10" y="25" class="title">CRYPTOPOKER HAND #: ' + hand.mintNum + ' / 10,000</text><text x="260" y="45" class="base small">gameId #: 00'+activeGameNum+'</text><text x="10" y="60" class="base">';
	mySvg += 'Card 1: ' + hand.card1.display + '</text><text x="10" y="80" class="base">Card 2: ' + hand.card2.display + '</text><text x="10" y="100" class="base">Card 3: ' + hand.card3.display + '</text><text x="10" y="120" class="base">Card 4: ' + hand.card4.display + '</text><text x="10" y="140" class="base">Card 5: ' + hand.card5.display + '</text>';
	// TO DO
	// -> Insert hand assessment here
	mySvg += '<text x="10" y="180" class="alert">';
	mySvg += assessment;
	mySvg += '</text><text x="10" y="220" class="base small">Join us at https://cryptopoker.justplay.cafe/ to play your hand.</text>';
	// mySvg += 'MOCK: So Lucky! Hand Rank Probability: 0.02401%</text><text x="10" y="200" class="alert heavy">You got a four of a kind! Hand value: Ace</text><text x="10" y="220" class="base small">Join us at https://justplay.cafe/ to play your hand.</text>';

	mySvg += '<image x="270" y="240" href="https://cryptopoker.mypinata.cloud/ipfs/'+hand.card1.ipfs_cid+'" height="100" transform="rotate(11, 290, 270)" />';
	mySvg += '<image x="210" y="240" href="https://cryptopoker.mypinata.cloud/ipfs/'+hand.card2.ipfs_cid+'" height="100" transform="rotate(-10, 240, 250)" />';
	mySvg += '<image x="150" y="240" href="https://cryptopoker.mypinata.cloud/ipfs/'+hand.card3.ipfs_cid+'" height="100" transform="rotate(5, 165, 260)" />';
	mySvg += '<image x="90" y="240" href="https://cryptopoker.mypinata.cloud/ipfs/'+hand.card4.ipfs_cid+'" height="100" transform="rotate(-8, 100, 250)" />';
	mySvg += '<image x="30" y="240" href="https://cryptopoker.mypinata.cloud/ipfs/'+hand.card5.ipfs_cid+'" height="100" transform="rotate(9, 40, 270)" />';
	mySvg += '</svg>';

	let storeHandNow = [hand.card1.id, hand.card2.id, hand.card3.id, hand.card4.id, hand.card5.id];
	let handName = hand.card1.display + ", " + hand.card2.display + ", " + hand.card3.display + ", " + hand.card4.display + ", " + hand.card5.display;

	saveMint(hand.mintNum, [storeHandNow], mySvg, handName, attr);		// gameId, hand, svg
	
	return true;		// true for successful completion
}


async function supplyNFTstorage(mySvg, mintNum, handName, attr, handString) {			// mySvg, mintNum

	if(mintNum < 0 || mintNum === ""){
		mintNum = "101";	// hard coded for now.
	}	

	contentArea.innerHTML += "<h1>Mint Transaction Progress:</h1>";

	// storeImageData function imported from ipfs.js in modules folder -> only ok if main script is defined as a module
	let thisUploadId = await storeImageData(mySvg, "cp-hand-"+mintNum+".svg", mintNum, handName, attr);		// TEST

	// set timeout 5 seconds?
	setTimeout(() => {
  		console.log(thisUploadId);

  		// try for wallet connect connected wallets.
  		console.log("BUG: wallet connect Mobile - opening app store, need to simulate user click. on call MintContract ...");
  		let isMobile = false;
  		if(isMobile) {
  			wcprovider.connector.off("call_request_sent");
  			provider.connector.on("call_request_sent", () => {
  				console.log("passing call_request_sent evet on with NOP");
  			})
  		}

  		let metadata = thisUploadId;
  		// mySvg, mintNum and handString REQUIRED for store in Database
		callMintContract(metadata.url, mintNum, mySvg, handString);
  		
  	}, 2500);
}
document.supplyNFTstorage = supplyNFTstorage;


async function afterSaveMint(mintNum) {


	let mintIndex = currentUserHands.length-1;

	// adds in the reference to the DOM now that the file data should be available.
	let allMintData = "<img id='nft-img' class='image-wide nft-img' src='img/mint/"+activeGameNum+"-"+currentUserAddress+"-"+mintNum+".svg' alt='NFT, or animated gif of NFT hand generation' />";

	allMintData += "<p class='hotCutLink'><a href='img/mint/"+activeGameNum+"-"+currentUserAddress+"-"+mintNum+".svg' target='_blank'>Just show me my NFT!</a></p>";
	allMintData += buildHandDisplayMint(currentUserHands[mintIndex], mintIndex);
	allMintData += "<div class='button-container row'><div class='col'><a id='playHand' class='btn btn-outline-success btn-lg' title='Hold this hand and move it to your dashboard.' onclick='playHandBtn();'>HODL</a></div><div class='col'><a id='foldHand' title='Fold ths hand and burn it forever' class='btn btn-outline-danger btn-lg disabled' onclick='foldLastHand();'>FODL</a></div></div>";

	// output the data to the DOM
	contentArea.innerHTML += allMintData; 

	return allMintData;
}

/*** DOM Data output - instructions ***/
function mintMainAlert() {
	let mainAlert = "<div class='alert alert-success' role='alert'><h4 class='alert-heading'>Hand Mint In Progress...</h4>  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' class='bi bi-exclamation-triangle-fill flex-shrink-0 me-2' viewBox='0 0 16 16' role='img' aria-label='Warning:'><path d='M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'/></svg>";

	mainAlert += "<h4>You have triggered a new deck to be built in the aether and five cards will be drawn at random and constructed programatically into your Hand NFT. </h4><p>Hand odds should be equivalent to any random hand drawn from a freshly shuffled deck.</p>";

	mainAlert += "<h2>Now you will be asked to pay a gas cost to store your new NFT hand on the blockchain!</h2>";
	
	mainAlert += "<hr><p><strong>Please wait for mint transaction (gas only) request to be sent by MetaMask</strong>.</p><ol><li>Your hand has been dealt and then stored to ipfs.</li><li>Your NFT and stored metadata will be sent to a contract to mint your NFT. This contract <strong>requires gas to mint</strong> as your NFT wil be permanantly associated to your address and stored in the blockchain.</li><li>After your trasaction has been confirmed, you will be able to reveal your NFT by flipping each of the five cards individually. You will then be shown a local representation of your NFT image and you will be given the option to play or fold your hand.</li><li>You can always see your hand NFT in your dashboard, even if you do not play the reveal animation.</li><li>Hands can be viewed on OpenSea for trade or selling or folded at any time from the <strong>user dashboard</strong></li><hr><p class='mb-0'>Choose wisely! You may not mint more than 5 hands if you currently hold 5+ hands in your wallet. Good luck!</p><button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close' onclick='hideMainAlertTrue()'></div>";

	return mainAlert;
}

function hideMainAlertTrue() {
	//variable assignment
	hideMainAlert = true;
}
document.hideMainAlertTrue = hideMainAlertTrue;


// import { useAccount, useConnect, useDisconnect } from 'wagmi';
// import { InjectedConnector } from 'wagmi/connectors/injected'

// import { connect, fetchEnsName } from '@wagmi/core'
// import { InjectedConnector } from '@wagmi/core/connectors/injected'

// import { mainnet, optimism, polygon } from '@wagmi/core/chains'
// import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'

// const connector = new WalletConnectConnector({
// 	chains: [mainnet, optimism, polygon],
// 	options: {
// 	  projectId: 'ac7d670d228dfe2e6e2dda56b4c7082d',
// 	},
//   })

//   //let mm = new InjectedConnector()

// const { address } = await connect({
// 	connector: connector,
//   })
// const ensName = await fetchEnsName({ address });
// console.log(ensName);

async function mintAction() {
	// this function triggers the mint action consequenses - still contains legacy code for demo mode
	console.log("Mint Action is here");

	console.log("Add in request for 1CPT token to be sent to the contract for minting");

	// console.log("Get Balance of CPT in Faucet Contract");

	console.log("rewrite this claim contract using viem!");

	

	// const { address, isConnected } = useAccount()
	// const { connect } = useConnect({
	// 	connector: new InjectedConnector(),
	// })
	// const { disconnect } = useDisconnect()

	const balData = await readContract({
		address: faucetContract,
		abi: faucetABI,
		functionName: 'getBalance',
	});
	// console.log(balData);		// shoudl return balance of CPT in faucet contract

	// console.log(ethereumClient);

	// build in place
	const publicClient = createPublicClient({
		chain: polygon,
		transport: http()
	  })
	const walletClient = createWalletClient({
		chain: polygon,
		// transport: http('https://polygon-mainnet.g.alchemy.com/v2/H142mkJS2UCpceoBqIqldBYr-hRkDyPR')
		transport: custom(window.ethereum)
		// transport: custom(ethereumClient)
	  })
	  
	const [myAddress] = await walletClient.getAddresses();
	console.log(myAddress, "Not YET ok for wallet connect");		// not OK for wallet connect?
	  

	const myCptBal = await readContract({
		address: cptAddress,
		abi: cptABI,
		functionName: 'balanceOf',
		args: [myAddress],
	});
	// console.log(myCptBal);		// OK


	  // OLD stuff
	// let myProvider = new ethers.providers.Web3Provider(window.ethereum);
	// let signer = myProvider.getSigner();

	// the faucet contract
	// let fc_RW = new ethers.Contract(faucetContract, faucetABI, signer);
	// let faucetBalance = await fc_RW.getBalance();

	// The Contract object
	// const cptContract_rw = new ethers.Contract(cptAddress, cptABI, signer);
	// let myTokens = await cptContract_rw.balanceOf(currentUserAddress);
	// console.log(myTokens, myCptBal);			// expecting 10K = 10000
														// 000000000000000000 (trailing 0s)

	// let tokensDecimal = ethers.utils.formatUnits(myTokens, 18);
	console.log("You have " + formatEther(myCptBal) + " CPT in your wallet.");
	// console.log(formatEther(myTokens))

	// send to faucet contract rather than burning for now
	let singleToken = ethers.utils.parseUnits("1", 18);
	console.log(singleToken);
	// console.log(parseEther(1))

	// OLD SEND CANCELLED FOR NOW
	// let sendCPT = await cptContract_rw.transfer(faucetContract, singleToken);
	// console.log(sendCPT);




	const { request } = await publicClient.simulateContract({
		address: cptAddress,
		abi: cptABI,
		functionName: 'Transfer',
		account: myAddress,
		args: [	faucetContract, singleToken ],
	  })
	const hash = await walletClient.writeContract(request);

	if(hash){
		console.log("Send completed successfully with hash: " + hash + " Click here to view this transaction on polygonscan (TBD)");

		//continue

	} else {
		alert("An error ocurred. Please try again.");

		return false;
	}

	// if OK


	
	// convert faucetBalance to int
	// faucetBalance = ethers.utils.formatEther(faucetBalance);
	// console.log(faucetBalance + " vs " + Number(balData));		//90		OK

	// THIS IS WHERE THE NFT HAND DATA IS GENERATED
	let currentHandCount = currentUserHands.length;
	let mintHand = await getASampleHand(currentHandCount);

	console.log(mintHand);


	console.log(currentUserHands, "This in use here -> used by SVG generator?");
	// add hand to current user hands list (this will need a hold/burn confimration first)
	currentUserHands.push(mintHand);


	// NEW FUNCTION FOR DATABASE STORAGE MOCK blockchain

	//	DEPLOY DISTRACTOR
	contentArea.innerHTML += '<iframe title="Playable Card Deck - Animation Samples" style="margin: 0 auto; width: 100%; height: 450px; border: 3px solid grey; border-radius: 20px;" src="https://tranmer.ca/tech/cards/"></iframe>';
	
	buildSvgStart(mintHand);		// this triggers the NFT art build.

	currentUserTokens--;	// this does nothign and is not tracked?
	getUserProfile();		// call to update internal storage for user profile
	UIloop();

	


	// Build the main page output components -> main alert
	if(hideMainAlert){
		// only show button to reveal
		contentArea.innerHTML = "Main alert has already been dismissed";
	} else {
		var mainAlert = mintMainAlert();		// this should be dismissable

		contentArea.innerHTML = mainAlert;
	}
	
	
}
document.mintAction = mintAction;


// DEPRECIATED -> function to generate the svg file on the fly, and save to disk
// function generateSVGonTheFly() {
// 	// create the svg element
//     const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");

//     // set width and height
//     svg1.setAttribute("width", "100");
//     svg1.setAttribute("height", "100");

//     // create a circle
//     const cir1 = document.createElementNS(
//       "http://www.w3.org/2000/svg",
//       "circle",
//     );
//     cir1.setAttribute("cx", "80");
//     cir1.setAttribute("cy", "80");
//     cir1.setAttribute("r", "30");
//     cir1.setAttribute("fill", "red");

//     // attach it to the container
//     svg1.appendChild(cir1);

//     // attach container to document
//     // return svg1;
//     console.log(svg1);

//     let mySvg = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">';
//     mySvg += '<style>.base { fill: white; font-family: sans-serif; font-size: 14px; } .title { font-size: 18px; font-weight:bold; fill: #F47A1F; font-family: sans-serif; } .alert{ text-decoration:underline; fill: #E6C65B; } .small{ font-size: 12px;} .heavy{ font: italic 20px serif;}</style>';
//     mySvg += '<rect width="100%" height="100%" fill="#3d3838" />';
//     mySvg += '<text x="10" y="25" class="title">';
//     mySvg += '	CRYPTOPOKER HAND #: 1337 / 10,000';
//     mySvg += '</text><text x="260" y="45" class="base small">';
//     mySvg += '	gameId #: 001';
//     mySvg += '</text><text x="10" y="60" class="base">';
//     mySvg += '	Card 1: A♠️';
//     mySvg += '</text><text x="10" y="80" class="base">';
//     mySvg += '</text></svg>';

//     return mySvg;
// }

// interact with minted hand

function playHandBtn() {
	console.log("PLAYING HAND -> just for navigation animation");

	let airplaneHtml = '<div id="plane-container"><div class="paperplane"><div class="plane"><div class="wingRight"></div><div class="wingLeft"></div><div class="bottom"></div><div class="top"></div><div class="middle"></div></div><div class="clouds"><div class="cloudOne"></div><div class="cloudTwo"></div><div class="cloudThree"></div></div></div></div>';

	// console.log("Fancy animation -> flying to the right, then send player to their profile page (later scoreboard?)");

	contentArea.innerHTML = airplaneHtml;

	// delay to show off the animation, then redirect
	setTimeout(() => {console.log("executing redirection after 2.5 seconds"); dashboard(); }, 2500);	

	return true;
}
document.playHandBtn = playHandBtn;

function foldHandBtn() {
	console.log("Fancy animation -> burning animation, 8s countdown then explode");

	// first add and style the flame
	contentArea.innerHTML += "<div class='burn-container'><div class='flame'></div></div>";

	// countdown and add class explode 
	var fade= document.getElementById("contentArea");
    // animation
    var intervalID = setInterval(function () {
          
        if (!fade.style.opacity) {
            fade.style.opacity = 1;
        }
          
        if (fade.style.opacity > 0) {
            fade.style.opacity -= 0.033;

            if(fade.style.opacity < 0.7) {
            	// light the fuse
	            fade.classList = "explode";
			} 

			if (fade.style.opacity < 0.5) {
				// bail
				clearInterval(intervalID);
				// location.reload();
				dashboard();		// send user back to dashboard
			}

        } else {
            clearInterval(intervalID);
        }
          
    }, 200);

	// handle the actual removal of the hand from storage
	// console.log("NEEDFIX ->Either refresh UI, or remove the correct one from the array list");
	currentUserHands.pop();

	// LATER: will need to sync this to the DB /chain
		




	return true;
}
document.foldHandBtn = foldHandBtn;

// DEPRECIATED
// function burnAction() {
// 	contentArea.innerHTML += "TBD: Display a list of current hands and burnable with an X";
// 	contentArea.innerHTML += "<br><strong>Will require confimration.</strong>";
// }

// hand value testing

function straightTest(values) {
	if(
		1+values[0] === values[1] &&
		1+values[1] === values[2] &&
		1+values[2] === values[3] &&
		1+values[3] === values[4] 
		) {
		return true;
	}

	return false;
}

function quickAssessHand(handInput, i) {

	// console.log(handInput, i);

	// just get and return the score using 

	// handInput = "XX XX XX XX XX";		// template

	const order = "23456789TJQK";

	// handInput = hand.card1.solo + " " + hand.card2.solo + " " + hand.card3.solo + " " + hand.card4.solo + " " + hand.card5.solo;
	// console.log(handInput);		// as as single string, with separators


	let myCards = handInput.split(" ");	// separate back into cards

	// console.log(myCards);

	if(myCards.length > 5) {
		//need a corrective hotfix to remove last element (blank)
		// alert("Implement fix here");
		myCards.pop();
	}

	let myFaces = myCards.map(a => String.fromCharCode([77-order.indexOf(a[0])])).sort();		// subtract to get ordernum from a = 65
	// console.log(myFaces);



	let mySuits = myCards.map(a => a[1]).sort();

	// console.log(mySuits);

	// console.log(myCards);
	// console.log(myfaces);		// not actual values, only refences
	// console.log(mySuits);


	// *********************************************************** /
	// FLUSH
	// *********************************************************** /

	let flush = mySuits[0] === mySuits[4];		// 1 and 5 match sorted, so all match

	// *********************************************************** /
	// DOUBLES, TRIPLES, 2 PAIR and FULL HOUSE in dups
	// *********************************************************** /

	// identify duplicates
	let myCounts = myFaces.reduce(counting, {});

	// console.log(myCounts);

	let duplicates = Object.values(myCounts).reduce(counting, {});

	// console.log(duplicates);

	// *********************************************************** /
	// STRAIGHT
	// *********************************************************** /

	let first = myFaces[0].charCodeAt(0);
	let isStraight = myFaces.every((f, index) => f.charCodeAt(0) - first === index);

	// *********************************************************** /
	// RANKING
	// *********************************************************** /

	// console.log(duplicates);		// check for duplicates - incorrrect quads and trips?


	 let rank = (flush && isStraight && 1) ||					// staright flush
	 			(duplicates[4] && 2) ||						// four of a kind
	 			(duplicates[3] && duplicates[2] && 3) ||	// full house
	 			(flush && 4) ||
	 			(isStraight && 5) ||
	 			(duplicates[3] && 6) ||			//	triples
	 			(duplicates[2] > 1 && 7) ||		// two pair
	 			(duplicates[2] && 8) ||			// pairs
	 			9;										// high card

	 // console.log(duplicates[3]);
	 // console.log(rank);

	 return rank;
}

/** This function is primary assessor when minting **/
function assessHand(hand) {

	let pairAttr = {
      "display_type": "boost_number", 
      "trait_type": "Pair", 
      "value": 10
    };

    let tripsAttr = {
      "display_type": "boost_number", 
      "trait_type": "Three Of A Kind", 
      "value": 25
    };
    let straightAttr = {
      "display_type": "boost_number", 
      "trait_type": "Straight", 
      "value": 50
    }
    let flushAttr = {
      "display_type": "boost_number", 
      "trait_type": "Flush", 
      "value": 80
    }
    let quadsAttr = {
      "display_type": "boost_number", 
      "trait_type": "Four Of A Kind", 
      "value": 100
    }
    let houseAttr = {
      "display_type": "boost_number", 
      "trait_type": "Full House", 
      "value": 150
    }
    let ultraAttr = {
      "display_type": "boost_number", 
      "trait_type": "StraightFlush", 
      "value": 450
    }

	var outputString = "Nothing. Don't worry, 50% of hands are like this!";

	// console.log("Working on assess Hand Function");
	// console.log(hand);

	let c1v = hand.card1.value;
	let c2v = hand.card2.value;
	let c3v = hand.card3.value;
	let c4v = hand.card4.value;
	let c5v = hand.card5.value;

	let c1s = hand.card1.suit;
	let c2s = hand.card2.suit;
	let c3s = hand.card3.suit;
	let c4s = hand.card4.suit;
	let c5s = hand.card5.suit;

	// console.log(c1v,c2v, c3v,c4v,c5v, " | ", c1s,c2s,c3s,c4s,c5s);

	const order = "23456789TJQK";
	let handInput = "XX XX XX XX XX";		// template

	handInput = hand.card1.solo + " " + hand.card2.solo + " " + hand.card3.solo + " " + hand.card4.solo + " " + hand.card5.solo;
	// console.log(handInput);		// as as single string, with separators


	let myCards = handInput.split(" ");	// separate back into cards
	let myFaces = myCards.map(a => String.fromCharCode([77-order.indexOf(a[0])])).sort();		// subrtact to get odernum from a = 65
	let mySuits = myCards.map(a => a[1]).sort();

	// console.log(myCards);
	// console.log(myfaces);		// not actual values, only refences
	// console.log(mySuits);


	// *********************************************************** /
	// FLUSH
	// *********************************************************** /

	let flush = mySuits[0] === mySuits[4];		// 1 and 5 match sorted, so all match
	// console.log(flush);


	// *********************************************************** /
	// DOUBLES, TRIPLES, 2 PAIR and FULL HOUSE in dups
	// *********************************************************** /

	// identify duplicates
	let myCounts = myFaces.reduce(counting, {})
	let duplicates = Object.values(myCounts).reduce(counting, {});

	// console.log(myCounts);
	// console.log(duplicates);


	// old method manual

	// if (c1v === c2v || c1v === c3v || c1v === c4v || c1v === c5v || c2v === c3v || c2v === c4v || c2v === c5v || c3v === c4v || c3v === c5v || c4v === c5v ) {
	// 	// more values needed ???
	// 	outputString = "You got a pair! 42.2569% Probability.";

	// 	currentHandAttr.push(pairAttr);
	// }  


	// // determine three of a kind
	// if( (c1v === c2v && (c1v === c3v || c1v === c4v || c1v === c5v)) || 
	// 	(c1v === c3v && (c1v === c4v || c1v === c5v)) ||
	// 	(c1v === c4v && c1v === c5v) ||
	// 	(c2v === c3v && (c2v === c4v || c2v === c5v)) || 
	// 	(c2v === c4v && c2v === c5v) || 
	// 	(c3v === c4v && c3v === c5v)
	// ){

	// console.log("BUG: non trips hand being flagged as triples");
		
	// }

	// // determine for 4 of a kind!
	// if(
	// 	(c1v === c2v && c3v === c4v && c3v === c2v ) ||		// 1 2 3 4
	// 	(c1v === c2v && c3v === c5v && c3v === c2v ) ||		// 1 2 3 5
	// 	(c1v === c2v && c2v === c5v && c2v === c4v ) ||		// 1 2 4 5
	// 	(c1v === c3v && c3v === c5v && c1v === c4v ) ||		// 1 3 4 5
	// 	(c3v === c2v && c3v === c4v && c3v === c5v )		// 2 3 4 5
	// ){

		

	// }


	// *********************************************************** /
	// STRAIGHT
	// *********************************************************** /

	// console.log("Testing Straight");
	// usig solo codes
	let first = myFaces[0].charCodeAt(0);
	let isStraight = myFaces.every((f, index) => f.charCodeAt(0) - first === index);
	// console.log(straight);

	

	// *********************************************************** /
	// RANKING
	// *********************************************************** /


	 let rank = (flush && isStraight && 1) ||					// staright flush
	 			(duplicates[4] && 2) ||						// four of a kind
	 			(duplicates[3] && duplicates[2] && 3) ||	// full house
	 			(flush && 4) ||
	 			(isStraight && 5) ||
	 			(duplicates[3] && 6) ||
	 			(duplicates[2] > 1 && 7) ||
	 			(duplicates[2] && 8) ||
	 			9;										// high card

	 // console.log(rank);


	 //  value resolution
	 let myValue = myFaces.sort(byCountFirst).join("");



	 // console.log(myValue);		// relative?
	 // console.log("High Card:" + myValue[0]);	// high card


	 // generate all the outputs here based on the rankings received.

	 if(rank === 8) {
	 	// one pair 
	 	// console.log("PAIR");
	 	outputString = "You got a pair! 42.2569% Probability.";
		currentHandAttr.push(pairAttr);
	 } else if(rank === 7) {
	 	// console.log("TWO PAIR");
	 	outputString = "What! You got TWO pair! 4.7539% Probability.";
		currentHandAttr.push(pairAttr);
		currentHandAttr.push(pairAttr);		// push twice?
	 } else if(rank === 6) {
	 	// console.log("TRIPLES");
	 	outputString = "Triples! Lucky! 2.1128% probability.";
		currentHandAttr.push(tripsAttr);
	 } else if(rank === 5) {
	 	// console.log("STRAIGHT");
		outputString = "Ooh Lucky! <strong>0.3925% Probability</strong>. You got a straight"; 	 //with "+myValue[0]+" high! ";
		currentHandAttr.push(straightAttr);
	 } else if(rank === 4) {
	 	// console.log("FLUSH");
		outputString = "So Lucky! <strong>0.2554% Probability</strong>. You got a flush with " + c5s;
		currentHandAttr.push(flushAttr);
	 } else if(rank === 3) {
	 	// console.log("FULL HOUSE");
	 	outputString = "Very Lucky! <strong>0.1441% Probability</strong>. You got a full house!";
		currentHandAttr.push(houseAttr);
	 } else if(rank === 2) {
	 	// console.log("Assesed: 4 of a kind");
		outputString = "Ultra Lucky! <strong>0.02401% Probability</strong>. You got a four of a kind! ";
		currentHandAttr.push(quadsAttr);
	 } else if(rank === 1) {
	 	// console.log("STRAIGHT FLUSH");
	 	outputString = "Supreme Lucky! <strong>0.02401% Probability</strong>. You got a stright flush! ";
		currentHandAttr.push(ultraAttr);
	 } else {
	 	// rank 9 or nothing
	 	outputString = "Nothing. Don't worry, 50% of hands are like this!";
	 }

	 // console.log(outputString);

	return [outputString,rank];
}

// helper functions for assesemnt
function counting(c,a) {
	c[a] = (c[a] || 0) + 1;
	return c;
}

function byCountFirst(a,b) {
 	// counts are in reverrse orderr - bigger is better
 	const countDiff = counting[b] - counting[a];

 	if (countDiff) return countDiff;		// if counts don't match, return
 	return b > a ? -1 : b === a ? 0 : 1
}

// end helper functions



function removeActiveMenus() {
	// console.log("Remove active tag from main menu links");

	let allMenus = document.getElementsByClassName('nav-link');

	Array.from(allMenus).forEach(element => {

		// console.log(element);
		// reset classList to basic
		element.classList = 'nav-link';

		// buildHandFromStoredData(element);

	});
}

/*** OpenSea Trading Window ***/
function gotoLoadOpenSea(this_link) {

	removeActiveMenus();

	if(this_link) {
		console.log(this_link);
		this_link.classList.toggle("active");
	}

	// open trading page
	loadOpenSea();
}
document.gotoLoadOpenSea = gotoLoadOpenSea;

function loadOpenSea() {
	contentArea.innerHTML = "<p><strong>Hello World</strong> - Sample of LIVE OS Trading only</p>";
	let osCollectionURL = "https://opensea.io/assets/daopunksnft/?embed=true";	// "https://testnets.opensea.io/assets/0xa8b8808F3DF67fF44aeE9F38B2DeC7FeAB56368b/?embed=true";  
	let frame = "<iframe src='"+osCollectionURL+"' width='100%' height='100%' frameborder='0' style='min-height:800px' allowfullscreen></iframe>";

	contentArea.innerHTML += frame;

	return true;
}


/*** Scoreboard ***/

function gotoScoreboard(this_link) {

	removeActiveMenus();

	if(this_link) {
		// console.log(this_link);
		this_link.classList.toggle("active");
	}

	// open score board page
	scoreboard();
}
document.gotoScoreboard = gotoScoreboard;



async function scoreDataPush(outputData, cpCount) {
		// output the results to the DOM here as one batch
	// console.log(outputData);

	// add locading graphic to the DOM


	// let cpCount = await cpContract.count();
	let numFolded = await getBalance(cpContractPolygon);		// cpContract.balanceOf(currentContract);		// this gets the number of hand owned by the contract address (i.e. folded)
	console.log(numFolded);
	let	finalScoreboard = outputData;

	let finalSbhead = '<table class="table table-dark table-striped" id="sortTable">\
						  <thead>\
						    <tr>\
						      <th scope="col">#</th>\
						      <th scope="col" title="MintID">ID</th>\
						      <th scope="col">Hand</th>\
						      <th scope="col">Score</th>\
						    </tr>\
						  </thead>\
						  <tbody>';


	// remove the loader & loading labels
	document.getElementById('loader').remove();
	let mintCounter = document.getElementById('mintCounter');
	// console.log(mintCounter);
	mintCounter.innerHTML = "loading finished";

	setTimeout(() => {
		console.log("Removing Loader after 2 seconds");
		mintCounter.remove();
	}, 2000);

	// console.log(fastScoreOutput);
	console.log("Fast score Output here for main data table... TBD other three data sets...");

	let topHandOutputArea = document.getElementById('topHandData');

	if(fastScoreOutput !== ""){
		topHandOutputArea.innerHTML = fastScoreOutput;
		// finalTableOutputArea = fastScoreOutput;
	} else {
		topHandOutputArea.innerHTML = finalSbhead + finalScoreboard + '</tbody></table>';
		fastScoreOutput = finalSbhead + finalScoreboard + '</tbody></table>';	// set here for future use

	}

	//sort final table by score order
	let finalTable = document.getElementById("sortTable");
	sortTable( finalTable );

	// trim / collapse hands to only show top 10.
	console.log("Hiding list items using CSS on tr");

	return true;
}

// is this used?
function sortTable(table) {

  console.log("Final Table sort");

  var rows, switching, i, x, y, shouldSwitch;
  // table = document.getElementById("myTable");
  switching = true;
  while (switching) {		  /* Make a loop that will continue until no switching has been done: */
    switching = false;			    // Start by saying: no switching is done:
    rows = table.rows;

    // console.log(rows);

    for (i = 1; i < (rows.length - 1); i++) {		    /* Loop through all table rows (except the first, which contains table headers): */

      shouldSwitch = false;		      // Start by saying there should be no switching:
      /* Get the two elements you want to compare, one from current row and one from the next: */
      
      x = rows[i].getElementsByTagName("td")[2];
      y = rows[i + 1].getElementsByTagName("td")[2];

      // console.log(x,y);

      // convert to INT for correct sorting
      let testX = parseInt(x.innerHTML);
      let testY = parseInt(y.innerHTML);

      // console.log(testX, testY);

      // Check if the two rows should switch place:
      if (testX < testY) {
        // If so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

async function printScoreboardData(gameData) {

	// console.log("Need to build a scoreHand function based on hand object input -> or using lookup");

	// web3 contract call
	// window.web3 = new Web3(ethereum);
	// let cpW3contract = new web3.eth.Contract(currentABI, currentContract);
	// let cpW3depContract = new web3.eth.Contract(cpDepositABI, cpDepositContract);
	let cpCount = Number (await checkCount);		//await cpContract.count();
	console.log(cpCount);

	//check against metadata storage for current
	console.log(cpMeta.length, cpCount === cpMeta.length);		// want true here

	var pairs = 0;
	var trips = 0;
	var quads = 0;
	var straights = 0;
	var flush = 0;
	var fullHouse = 0;
	var royal = 0;

	let cuCounter = 0;		// counter for the number of current user hands 

	var outputData = "";
	var tempOutputData = "";

	// add table header to myHands collection
	let allHandsScores = 0;			// take a runnning total of all hands in the game currently (omit folded hands)
	let activeHandsNum = 0;
	let myTotalScore = 0;
	let myHandsTable = '<table id="myHandsTable" class="table table-dark table-striped">\
						  <thead>\
						    <tr>\
						      <th scope="col">#</th>\
						      <th scope="col" title="MintID">ID</th>\
						      <th scope="col">Hand</th>\
						      <th scope="col">Score</th>\
						    </tr>\
						  </thead>\
						  <tbody>';

	// console.log(cpMeta);		// ok for cache

	// this for loop runs through all hands currently registered in the contract
	for(let i=0;i<cpCount;i++){

		let ownerOf = "";		// address of NFT owner

		// if the global chache has a corresponding object for the mint
		if(cpMeta[i]){
			// console.log(cpMeta[i]);

			if(cpMeta[i].owner !== ""){
				// it has a owner stored
				// console.log("owner exists");

				ownerOf = cpMeta[i].owner;	
			} else {
				// get and update owner data for this mint
				ownerOf = await getOwner(i);		//await cpContract.ownerOf(i);		// get current hand owner addr for 
		
			}

		} else {
			let ownerOf = await getOwner(i)		// await cpContract.ownerOf(i);		// get current hand owner addr for 
			// create the object
			cpMeta[i] = {};
			cpMeta[i].owner = ownerOf;

		}

		// console.log(i); 
		document.getElementById('mintCounter').innerHTML = "Reading Mint#:" + i;

		// console.log(ownerOf);


		// this if/else pertains to ALL HANDS
		if(ownerOf === currentContract) {

			// console.log(".skip.")
			// skip it, it's a burn
			triggerEndOfLoop(i,cpCount, myHandsTable, myTotalScore, outputData);		
			// check for loop completetion consequenses and output

		} else if(fastScoreOutput === "") {

			// console.log("no Fast score -> enable lookup");

			// there is no data built yet, so build it

			tempOutputData += mainChainDataCapture();		// this function TBD
			// do the full blockchain lookup

			if(cpMeta[i]) {
				// see what we have
				console.log(cpMeta[i]);

				// do we have token URI?
				if(cpMeta[i].tokenURI) {

				} else {
					// get it
					let thisURI = await getURI(i);			//cpContract.tokenURI(i);
					// set it
					cpMeta[i].tokenURI = thisURI;
				}
			} else {
				// create the object
				cpMeta[i] = {};
				cpMeta[i].id = i;
				cpMeta[i].owner = await getOwner(i);			//cpContract.ownerOf(i);
				cpMeta[i].tokenURI = await getURI(i);
			}

			// console.log(cpMeta);

			// cpW3contract.methods.tokenURI(i).call().then(async function(result){

				let thisBoosts = [];
				let result = cpMeta[i].tokenURI;

				// let thisURI = result;
				//let urlTarget = "https://ipfs.io/ipfs/" + result.slice(7);
				let urlTarget = "https://cryptopoker.mypinata.cloud/ipfs/" + result.slice(7);
				let adjust = result.slice(7,66);

				let jsonResult = await httpGet(urlTarget);		// try to avoid this ?
				// let parseRes;

				if(cpMeta[i].jsonMeta !== ""){
					// it has a owner stored
					// console.log("owner exists");
	
					// jsonResult = cpMeta[i].jsonMeta;	

					// parseRes = JSON.parse(jsonResult);	
				} else {
					// get and update json meta data for this mint 
					// jsonResult = await httpGet(urlTarget);		// this json result will be CACHED so long as the user stays in the app without reloading
					cpMeta[i].jsonMeta = jsonResult;

					// parseRes = JSON.parse(jsonResult);

			
				}

				let parseRes = JSON.parse(jsonResult);

				// get hand for display
				let thisName = parseRes.name.split(" ");		// remove only last 18 characters from string for display hand
				//console.log(thisName);
				let thisHandArray = thisName.slice(4);
				// console.log(thisHandArray);
				let thisHandint = thisHandArray.toString();
				// console.log(thisHandDisplay);
				let thisHandDisplay = thisHandint.replaceAll(",,", " | ");
				// console.log(thisHandDisplay);

				// use hand array to determine additional classification (i.e. high card)

				let checkDeck = buildDeck();

				// internal storage variables for hand scoring generation
				let str;		// take only the first card
				let fix;
				let lastChar;	// = str.substring(str.length - 1);
				let newCard;
				// console.log(lastChar);
				let handInput = "";				// = "KC KC KC KC KC";

				// this to build handInput for hand ranking assessemnt
				thisHandArray.forEach(function(element) {
					// console.log(element);

					str = element;		// take only the single card
					// fix = str;
					lastChar = str.substring(str.length - 1);		// assess last char

					if(lastChar === ",") {
						fix = str.slice(0,-1);				// trim trailing comma
					} else {
						fix = str.trim();					// trim whitespace
					}

					var result = checkDeck.filter(obj => {
						// console.log(typeof fix, typeof obj.display);
						// console.log(fix, obj.display);
						// console.log(obj.display === fix);
					    return obj.display === fix;
					});

					// console.log(result);		// shoudl return a new array of only matching cards, with all metadata for extraction/scorinnng

					newCard = result[0].solo;
					// console.log(newCard);

					handInput += newCard + " ";		// add card and space

				});

				
				// console.log(i + " HandInput: " + handInput);

				// call the assesment and scoring function
				// console.log(handInput);
				let quickRank = quickAssessHand(handInput, i);

				console.log(handInput, quickRank);

				if(cpMeta[i].handInput){
					// has a handInput
				} else {
					// needs one
					cpMeta[i].handInput = handInput;
				}

				// store in global variable for later use
				if(cpMeta[i].quickRank){
					// has a quickrank, use it
					console.log(cpMeta[i].quickRank);
					quickRank = cpMeta[i].quickRank;
				} else {
					// needs one
					cpMeta[i].quickRank = quickAssessHand(handInput, i);
				}
				
				//console.log(i, quickRank, handInput, "allHands");


				// internal variables for the trait analysis of hands based on metadata

				let attr = parseRes.attributes;

				let thisHandScore = 0;		// reset
				let thisHand = "<h5>ID#:"+i;
				let rowNum = 1;
				let thisVal = "";

				let minScore = 11;		// if the score does not meet the minimum, then do not display in the top hands
				// console.log("Dynamic minScore: Will show the hand if the score > average of all preceeding hands in active game.");

				// score the hand
				thisHandScore = scoreHand(quickRank);			// using the ranking from assesment to generate the score for the hand
				allHandsScores += thisHandScore;				// add to global score counter
				// console.log(allHandsScores);
				activeHandsNum++;								// increment by one
				minScore = allHandsScores/activeHandsNum;
				// console.log(minScore);

				// console.log("minscore overide");
				minScore = 1;		// show all

				// move counter of traits here to DYNAMIC based on current ranking
				if(quickRank === 1) { royal++ }							// 450 royal
				else if(quickRank === 2) { quads++; }					// 300 quads
				else if(quickRank === 3) { fullHouse++; }				// 150 fullhouse
				else if(quickRank === 4) { flush++; }					// 100 flush
				else if(quickRank === 5) { straights++; }				// 80 straight
				else if(quickRank === 6) { trips++; }					// 50 triples
				else if(quickRank === 7) { pairs = pairs +2; }			// 25 two pair
				else if(quickRank === 8) { pairs++; }					// 10 pair
				else if(quickRank === 9) { /* nothing */ }				// 1 nothing



				// console.log(attr);		// should not allow undefined to pass
				if(attr){
					thisHand = '<tr>\
				      <th scope="row">X</th>\
				      <td>\
				      	<a href="'+osLivePrefix+currentContract+"/"+i+'" target=_blank title="View NFT on OpenSea">'+i+'</a>\
				      <td>'+thisHandDisplay+'</td>\
				      <td title='+thisHandScore+'>'+thisHandScore+'</td>\
				    </tr>';

				    // console.log(thisHand);

				    if(ownerOf === currentUserAddress) {

					    // if is owned by current user, then also add to their personal hand storage (display)
					    let thisMyHand = '<tr>\
					      <th scope="row">'+cuCounter+'</th>\
					      <td>\
					      	<a href="'+osLivePrefix+currentContract+"/"+i+'" target=_blank title="View NFT on OpenSea">'+i+'</a>\
					      <td>'+thisHandDisplay+'</td>\
					      <td title='+thisHandScore+'>'+thisHandScore+'</td>\
					    </tr>';

					    // output variables
					    myHandsTable += thisMyHand;
					    myTotalScore += thisHandScore;

					}


					// output hand to OutputData: only once per full loop of cpData
					// if(thisVal !== "" && thisVal !== "Game" && thisVal !== "Game ID" && thisVal !== "Win Condition"){	// no hand dispaly generated for other traits
					if(thisHandScore >= minScore){		// only if the hand clears the min score, display it
						outputData += thisHand;		
					}
						// rowNum++;		// increment row header counter (Later dynamic by sort value?)
					// }

				}		// end if attr

				// TEST for completion of for loop
				triggerEndOfLoop(i,cpCount, myHandsTable, myTotalScore, outputData);

			// });
		} else {
			// test for completion
			triggerEndOfLoop(i,cpCount, myHandsTable, myTotalScore, outputData);
		}

	}		// end for loop (i++)

	let sumData = [pairs,trips,quads,straights,flush,fullHouse,royal];

	scoreboardFinalOutput(gameData, cpCount, sumData);		// gamedata for db data, cpCount for gameTotal, 

	console.log("RETROFIT THIS FUNCTION SUCH THAT IT GATHERS AS MUCH METADATA TO STORE AS POSSIBLE.");
	console.log(cpMeta);		// this should be the full object to write back to the API server here

	console.log("This call to update the metadata is successful, but needs to be corrected in storage at the API endpoint.");

	// this fetch connection call needs to be setup at the API endpoint
	// fetch("https://api.justplay.cafe/data/setMeta", {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(cpMeta)
	// 	})
	// 	.then(response => response.json())
	// 	.then((json) => console.log(json));

	// /**************************************

	return true;

}

async function triggerEndOfLoop(i,cpCount, myHandsTable, myTotalScore, outputData) {
	
	// console.log("Check for and trigger end of loop as completed.");

	// console.log( i+1 >= cpCount );	// true if completed, false otherwise
	// console.log(i+1, cpCount);		// i+1 to accomodate for the 0th value (hand 90 = 91st)

	if( i+1 >= cpCount ){		// cpCount.eq(iCompare)					

		console.log("Trigger ending of loop - only once! Outputting myHands to SCORES.");

		//if user has  full set of 5 hands, dislpay a the tail row on their user tbale with score summary
		if(currentUserHands.length > 4) {
			myHandsTable += '<tr>\
  				<th scope="row">X</th>\
			      <th scope="col"></th>\
			      <th scope="col">Total Score: </th>\
			      <th scope="col">'+myTotalScore+'</th>\
			    </tr>';
		}
		

		// output myHands first
		// console.log("Outputting myHands to SCORES. ");
		myHandsTable += "</tbody></table>";	// DOM element closer	
		let myHandDataArea = document.getElementById('myHandData');
		myHandDataArea.innerHTML =  myHandsTable;	// set user hands to DOM

		// call the output function
		// console.log("END: Output Triggered");
		scoreDataPush(outputData, cpCount);		// can this be called in parallel with the primary output function call?

	} else{
		// console.log("Still running, nothing to do yet here.")
		return false;
	}

	return true;
}

async function mainChainDataCapture() {

	// console.log("Migration here of all core data capture...");

	return "This Hand | ";

	// return true;

}

async function scoreboardFinalOutput(gameData, gameTotal, sumData) {
	/***************************************
	 * 
	 * Final table output generated here
	 * *************************************/

	//compare with gameData from the database

	// console.log(gameData);
	// console.log("BUG: Score calculation for boosts: triples (incorrect assignment), flush (fails to score anything)")

	let endTime = gameData.end_time;
	let cptokenTreasury = parseInt(gameData.cptoken_treasury) - parseInt(gameData.token_sold);
	let ethTreasury = gameData.eth_treasury;

	let tokenTotal = gameData.token_total;	// in play, not minted
	let tokenSold = gameData.token_sold;	// total out from treasury
	let tokenSpend = gameData.token_spend;	// total number minted

	//TBD - convert to contract lookup for uniques
	let activePlayers = gameData.unique_addr -1;		// -1 to account for contract ownership of burned hands
	// OLD: calculated from DB
	let in_play = gameData.hands_in_play;
	let total = gameData.total_hands;
	let fold = gameData.total_hands - gameData.hands_in_play;

	console.log("Testing for Equality - DB:" + total + " vs. Chain:" + gameTotal);		// expecting equality

	// get fold data by number of hands owned by contract address.
	let numFolded = await getBalance(currentContract);		//	cpContract.balanceOf(currentContract);		// this gets the number of hand owned by the contract address (i.e. folded)
	console.log("Num Folded: " + numFolded);

	console.log(currentContract,cpDepositContract);

	// get ETH or MATIC balances from active contracts
	let minterBalance = await myClient.getBalance({
		address: currentContract
	});		//wcprovider.getBalance(currentContract);
	let depositBalance = await myClient.getBalance({
		address: cpDepositContract
	});			// wcprovider.getBalance(cpDepositContract);

	console.log(minterBalance);
	console.log(depositBalance);

	let gameBalEth = ethers.utils.formatEther(minterBalance);
	let depBalEth = ethers.utils.formatEther(depositBalance);

	console.log("Game Contract Balance: " + gameBalEth + " " + defaultCurrency);
	console.log("Deposit Contract Balance: " + depBalEth + " " + defaultCurrency);

	let totalTreasury = +gameBalEth + +depBalEth;


	let pairs = sumData[0];
	let trips = sumData[1];
	let quads = sumData[2];
	let straights = sumData[3];
	let flush = sumData[4];
	let fullHouse = sumData[5];
	let royal = sumData[6];

	// gametotal from cpCount -> passed in
	let realInPlay = gameTotal - Number(numFolded);
	let handsRemain = 10000 - gameTotal;

	let pairsPct = 100*pairs/realInPlay;
	let tripsPct = 100*trips/realInPlay;
	let quadsPct = 100*quads/realInPlay;
	let straightPct = 100*straights/realInPlay;
	let flushPct = 100*flush/realInPlay;
	let fullHousePct = 100*fullHouse/realInPlay;
	let royalPct = 100*royal/realInPlay;

	let finalSumock = '<table class="table table-dark table-striped">\
						  <thead>\
						    <tr>\
						      <th scope="col">Game#</th>\
						      <th scope="col">Played</th>\
						      <th scope="col">Remain</th>\
						      <th scope="col">InPlay</th>\
						    </tr>\
						  </thead>\
						  <tbody>\
						    <tr>\
						      <th scope="row">'+activeGameNum+'</th>\
						      <td>'+gameTotal+'</td>\
						      <td>'+handsRemain+'</td>\
						      <td>'+realInPlay+'</td>\
						    </tr>\
						    <tr>\
						      <td colspan="2">Pairs: '+pairs+' | '+pairsPct.toFixed(2)+'%</td>\
						      <td colspan="2">2 Pairs: TBD | TBD%</td>\
						    </tr>\
						    <tr>\
						    	<td colspan="2">Triples: '+trips+' | '+tripsPct.toFixed(2)+'%</td>\
  						        <td colspan="2">Quads: '+quads+' | '+quadsPct.toFixed(2)+'%</td>\
						    </tr>\
						    <tr>\
						    	<td colspan="2">Straights : '+straights+' | '+straightPct.toFixed(2)+'%</td>\
						    	<td colspan="2">Flush: '+flush+' | '+flushPct.toFixed(2)+'%</td>\
						    </tr>\
						    <tr>\
						    	<td colspan="2">Full House : '+fullHouse+' | '+fullHousePct.toFixed(2)+'%</td>\
						        <td colspan="2">Royal: '+royal+' | '+royalPct.toFixed(2)+'%</td>\
						        <td colspan="2"><!--Nothing : '+fullHouse+' | '+fullHousePct.toFixed(2)+'% --></td>\
						    </tr>\
						  </tbody>\
						</table>';

						//<tr>\<td colspan="2">Royal Flush: (TBD)</td>\</tr>\


	// DOM OUTOUT FINAL TABLE HERE

	let finalTableOutputArea = document.getElementById('finalGameData');

	finalTableOutputArea.innerHTML += "<h3>Game: 00"+activeGameNum+"  from contract data<br/><small>ends: "+endTime+"</small></h3>";
	finalTableOutputArea.innerHTML += finalSumock;

	finalTableOutputArea.innerHTML += "<p><strong>Number of players: "+activePlayers+"</strong>";
	finalTableOutputArea.innerHTML += "<p><strong>"+defaultCurrency+" Treasury:</strong> "+totalTreasury+"</p>";
	finalTableOutputArea.innerHTML += "<h3>The Game: "+gameTotal+" / 10,000</h3><hr>";

	return true;
}


function scoreTableSorter() {
	const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

	const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
	    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
	    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

	// do the work...
	document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
	  const table = th.closest('table');
	  const tbody = table.querySelector('tbody');
	  Array.from(tbody.querySelectorAll('tr'))
	    .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
	    .forEach(tr => tbody.appendChild(tr) );
	})));
}


// DEPRECIATED het hand score value form assigned attributes asdn retrun
function getHandScore(thisVal) {

	let thisHandScore = 0;

	if(thisVal === "Pair"){
		thisHandScore += 10;
	} 
	if(thisVal === "Three Of A Kind"){
		thisHandScore += 25;
	} 
	if(thisVal === "Four Of A Kind"){
		thisHandScore += 100;
	}
	if(thisVal === "Straight") {
		thisHandScore += 80;
	}
	if(thisVal === "Flush") {
		thisHandScore += 100;
	} 
	if(thisVal === "Full House") {
		thisHandScore += 150;
	}
	if(thisVal === "StraightFlush") {
		thisHandScore += 450;
	}

	return thisHandScore;
}

function scoreHand(rank) {

	// console.log(rank);

	let thisHandScore = 0;

	if(rank === 1) { thisHandScore = 450; } 
	else if(rank === 2) { thisHandScore = 300; }	// quads
	else if(rank === 3) { thisHandScore = 150; }
	else if(rank === 4) { thisHandScore = 100; }	// flush
	else if(rank === 5) { thisHandScore = 80; }
	else if(rank === 6) { thisHandScore = 50; }		// triples
	else if(rank === 7) { thisHandScore = 25; }
	else if(rank === 8) { thisHandScore = 10; }		// pair
	else if(rank === 9) { thisHandScore = 1; }

	// console.log(rank,thisHandScore);

	return thisHandScore;
}




function scoreboard() {

	// set URL for direct linking -> display in addr only
	console.log("Scoreboard Start.");
	// window.history.pushState("", "Scoreboard Page", "/scores");

	// clear existing data
	contentArea.innerHTML = "";

	// console.log(currentUserHands);

	// setup HTML container areas to target for data entry when available

	// user specific data
	contentArea.innerHTML += "<h3 class='cb'> --- My Active Hands --- <span id='mintCounter' style='float:right;' class='wallet-tx small'>Reading MintNum</span></h3>";
	contentArea.innerHTML += "<div id='myHandData'></div>";
	contentArea.innerHTML += "<h3 class='cb'> --- Top Hands in the Game <button id='showAllHandsBtn' class='btn btn-outline-primary' onclick='showAllHands(this)'> ^ </button> ---</h3>";
	contentArea.innerHTML += "<div id='topHandData'></div>";

	contentArea.innerHTML += "<h3 id='loader' class='wallet-tx'>Loading All Game Data...<br></h3>";
	contentArea.innerHTML += "<div id='finalGameData'></div>";

	getGameInfo(activeGameNum, true, false);		// generates JSON GameData & Calls print ScoreboardData function, true for scoreboard output


}
document.scoreboard = scoreboard;

// blockchain simulator functions 

function showAllHands($this) {
	// should toggle the visual of the button 180deg. rotation animation
	// console.log("handle this click");
	// console.log($this);
	let handContainer =  document.getElementById('topHandData');

	if($this.classList.contains('active')) {

		$this.classList.remove('active');		// flip down

		// should add a class of showall to the container element.
		handContainer.classList.remove('showall'); 

	} else {

		$this.classList.add('active');		// flip down

		// should add a class of showall to the container element.
		handContainer.classList.add('showall'); 

	}

	
}
document.showAllHands = showAllHands;

function getUserProfile() {
	// get the user profile from connected wallet and store as object, 

	if(currentUserAddress === "") {
		// set a temporary address for use
		currentUserAddress = "0xPLEASE_CONNECT_WALLET";
	}


	// console.log(userProfile);


	// for example -> build the user profile from the interally generated and stored variables.
	userProfile = {
		tokens: currentUserTokens,		// is int
		address: currentUserAddress,		// is string
		hands: currentUserHands,			// should be an array of arrays
		username: currentUserUsername,
		email: currentUserEmail
	}

	return userProfile;
}




/**************************************************************************************/
/* FUNCTION GRAVEYARD - PENDING REMOVAL */
/**************************************************************************************/

// test button only
async function sendTx(amt) {

	if(amt === '') {
		amt = "0.00000001";
	}

	console.log("Test Tx - send: " + amt.toFixed(16));

    let sendTx = web3.eth.sendTransaction({from: currentUserAddress,to: ownerWallet, value: web3.utils.toWei(amt.toFixed(16), "ether")})
				.then((receipt) => {
					console.log(receipt);
					alert("Transaction completed successfully!");
				});
}
// test deposit to contract button
async function testDEP() {

	let testC = "0xAf7c1a08b99ecac8a9C7b2239159E9d973bd43Ae";
	let testABI = '[\
					{\
						"inputs": [],\
						"stateMutability": "nonpayable",\
						"type": "constructor"\
					},\
					{\
						"inputs": [],\
						"name": "balance",\
						"outputs": [\
							{\
								"internalType": "uint256",\
								"name": "balanceEth",\
								"type": "uint256"\
							}\
						],\
						"stateMutability": "view",\
						"type": "function"\
					},\
					{\
						"inputs": [\
							{\
								"internalType": "uint256",\
								"name": "amount",\
								"type": "uint256"\
							}\
						],\
						"name": "deposit",\
						"outputs": [],\
						"stateMutability": "payable",\
						"type": "function"\
					},\
					{\
						"inputs": [],\
						"name": "owner",\
						"outputs": [\
							{\
								"internalType": "address",\
								"name": "",\
								"type": "address"\
							}\
						],\
						"stateMutability": "view",\
						"type": "function"\
					},\
					{\
						"inputs": [],\
						"name": "withdraw",\
						"outputs": [],\
						"stateMutability": "nonpayable",\
						"type": "function"\
					}\
				]';

	let myProvider = new ethers.providers.Web3Provider(window.ethereum);		// assignment of provider happens here
	let testContract = new ethers.Contract(testC, testABI, provider);
	let signer = provider.getSigner();
	let testContract_rw = new ethers.Contract(testC, testABI, signer);

	// let ETH_VALUE_AS_STRING = "0.00001";

	let deptx = await testContract_rw.deposit(
		ethers.utils.parseEther(defaultFees), 
		{value: ethers.utils.parseEther(defaultFees)}
	);

	console.log(deptx);

}
document.testDEP = testDEP;


// DEPRECIATED
// async function loadImgURL(cid, mime, limit) {
// 	/** Uses `URL.createObjectURL` free returned ObjectURL with `URL.RevokeObjectURL` when done with it.
//  * 
//  * @param {string} cid CID you want to retrieve
//  * @param {string} mime mimetype of image (optional, but useful)
//  * @param {number} limit size limit of image in bytes
//  * @returns ObjectURL
//  */

//     if (cid == "" || cid == null || cid == undefined) {
//         return;
//     }
//     for await (const file of ipfs.get(cid)) {
//         if (file.size > limit) {
//             return;
//         }
//         const content = [];
//         if (file.content) {
//             for await(const chunk of file.content) {
//                 content.push(chunk);
//             }
//             return URL.createObjectURL(new Blob(content, {type: mime}));
//         }
//     }
// }



//TESTING ONLY
// async function connectToContract() {		// using ethers.js code base

// 	const provider = new ethers.providers.Web3Provider(window.ethereum)
// 	await provider.send("eth_requestAccounts", []);
// 	const signer = provider.getSigner();
// 	// console.log(signer);	//	signer is needed to get approval from web3 provider (in our case Metamask)

// 	// TEST
// 	console.log("Test sign message with MM");
// 	// signature = await signer.signMessage("Welcome back to the Cryptopoker APP " + currentUserAddress);


// 	// You can also use an ENS name for the contract address
// 	const daiAddress = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";		//"dai.tokens.ethers.eth";


// 	// The ERC-20 Contract ABI, which is a common contract interface
// 	// for tokens (this is the Human-Readable ABI format)
// 	const daiAbi = [
// 	  // Some details about the token
// 	  "function name() view returns (string)",
// 	  "function symbol() view returns (string)",

// 	  // Get the account balance
// 	  "function balanceOf(address) view returns (uint)",

// 	  // Send some of your tokens to someone else
// 	  "function transfer(address to, uint amount)",

// 	  // An event triggered whenever anyone transfers to someone else
// 	  "event Transfer(address indexed from, address indexed to, uint amount)"
// 	];

// 	// The Contract object
// 	const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);

// 	// quering the contract object
// 	// Get the ERC-20 token name
// 	let DaiName = await daiContract.name()
// 	// 'Dai Stablecoin'

// 	// Get the ERC-20 token symbol (for tickers and UIs)
// 	let DaiSymbol = await daiContract.symbol()
// 	// 'DAI'

// 	// Get the balance of an address
// 	let balance = await daiContract.balanceOf(currentUserAddress)
// 	// { BigNumber: "8501797437309328201631" }

// 	// Format the DAI for displaying to the user
// 	let balFormat = ethers.utils.formatUnits(balance, 18)
// 	// '8501.797437309328201631'

// 	console.log(balFormat);
// 	contentArea.innerHTML += "<h2>Reading contracts</h2>";
// 	contentArea.innerHTML += balFormat + " " + DaiSymbol + ": " + DaiName +"<hr>";		// 100 DAI is correct

// 	// NOW TEST THE REAL CONTRACT INTEGRATION

// 	let cpName = await cpContract.name();		//nan
// 	let cpSymbol = await cpContract.symbol();
// 	let cpBalance = await cpContract.balanceOf(currentUserAddress);
// 	let totalCpSupply = await cpContract.count();


// 	console.log("NEXT UP NOTES HERE");
// 	// make sure that contract is being called to mint on mint TX
// 	// have to pass uri from NFT storage (below is a hard coded dummy value)


// 	// mint an nft via contract call
// 	let to = "0x63bf70C967c5627B45d7B0c245781D3F04447D48";			// hc this should be currently connected address
// 	let uri = "ipfs://bafyreibrgpfzx3chrzwuqvkb5qbe554ofyoyf2iatri5zvsfi762izs3du/metadata.json";	// hc
// 	console.log("Write to contract");

// 	let ETH_VALUE_AS_STRING = "0.000001";

// 	// var signature = await signer.signMessage("Welcome back to the Cryptopoker APP " + currentUserAddress + " You are paying the minimum of " + ETH_VALUE_AS_STRING + " (plus gas fees) to mint this hand.");

// 	contentArea.innerHTML = "<h2>MINT TRANSACTION CONFIRMING...<br>PLEASE WAIT</h2>";

// 	alert("nft mint successful!");


// 	// output
// 	contentArea.innerHTML += cpName + " " + cpSymbol + ": " + cpBalance;


// 	console.log("NFT OUTPUT TEST -> replace with function call?");

// 	window.web3 = new Web3(ethereum);
// 	let contract = new web3.eth.Contract(currentABI, currentContract);

// 	// this output for each uniquely owned NFT for connected wallet.
// 	for(let i=0;i<totalCpSupply;i++){
// 		let owner = await contract.methods.ownerOf(i).call().then(function(result){
// 			let thisNftOwner = result;
// 			let newOutput = "";
// 			// console.log(currentUserAddress, thisNftOwner);
// 			// console.log(thisNftOwner == currentUserAddress)
// 			if(thisNftOwner.toLowerCase() === currentUserAddress.toLowerCase()){
// 				// console.log("Boom");
// 				newOutput += "<div class='nft-pen'><h3>#"+i+"/"+totalCpSupply+" Owned</h3>";

// 				// capture the id number 
// 				let thisId = i;

// 				// capture the metadata
// 				contract.methods.tokenURI(thisId).call().then(function(result){

// 					let thisURI = result;
// 					console.log(result);

// 					let soloHash = "bafybeiff2immtcjh5rbanzw5me7n6esd3bxtnd6w22a2z43z2n2gjswkry";	// hc
// 					let thisFilename = "cp-hand-1.svg";												// hc
// 					let osLivePrefix = "https://testnets.opensea.io/";

// 					// https://nftstorage.link/ipfs/bafybeiff2immtcjh5rbanzw5me7n6esd3bxtnd6w22a2z43z2n2gjswkry

// 					// get the image from the metadata
// 					let thisImage = "<img src='https://nftstorage.link/ipfs/" + soloHash+"/"+thisFilename+"' alt="+thisFilename+" style='width: 100%;'/>";
// 					// console.log(thisImage);
// 					let osLink = "<p class=small><a href='"+osLivePrefix+currentContract+"/"+thisId+"' target=_blank>View NFT on OpenSea</a></p>";

// 					newOutput += thisImage+osLink+"</div>";

// 					// output each matched one to the DOM
// 					contentArea.innerHTML += newOutput; 


// 				});

// 			}

			
// 		});
// 	}


// }
// document.connectToContract = connectToContract;

// this function obsoleted
async function getHandById(id) {

	console.log("eliminate this hand lookup in favour of chain data lookup by mint number.");

	// console.log('running single getHand from DB: ' +id);

	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "query/get-hand-by-id.php?addr="+currentUserAddress+"&id="+id, true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {

	   	  // console.log(this.responseText);

	   	    //init
			let jsonHand = JSON.parse(this.responseText);

			// console.log(jsonHand);
			// console.log(jsonHand[0]);

			let this_hand = buildHandFromStoredData(jsonHand[0]);

			// console.log(this_hand);


	      // use response to build/update currentPlayerHands global variable

	      return this_hand;

	   } else {
	   	// console.log(this.responseText);
	   	return false;
	   }
	};
	xhttp.send();
}


// function setHandHome(gameData) {

// 	// this is async and handles the replacemnt of the placeholder staging data for the game
// 	// -> better to reorder to output to occur after we have this data.

// 	console.log("Set Hand Home");
// 	// console.log(gameData);


// TBD Add in swipe gestures & code to handle
// function slideHandRight(this_hand) {
// 	this_hand.innerHTML = " >> ";
// 	this_hand.parentNode.classList.toggle('slide-right');
// }
// document.slideHandRight = slideHandRight;

function showThisNFT(clicked_link) {

	event.preventDefault();

	// get NFT IPFS URL and display in new window
	console.log(clicked_link);
}

import React, { useEffect, useState } from "react";
import { useAccount } from 'wagmi';

// this imported for BURN function
import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { polygon, optimism } from 'viem/chains';

import { cpContractPolygon, cpABIPolygon } from "../../js/modules/contracts.js";

//functions
import { buildDeck } from "../functions/buildDeck.jsx";
import { displayCard, getFace, getCardDisplay, displayToId, flipClick } from "../functions/displayCard.jsx";
import { getURI, getOwner } from "../../js/viemConnect.js";

import { getCpMeta } from '../functions/getCpMeta.jsx';
import { cpMetaBak } from '../data/cpMeta.jsx';
import { httpGet } from '../functions/xmlHttpReq.jsx';
import { BurnBtn } from "./BurnBtn.jsx";

function foldHandBtn(output) {
	console.log("Fancy animation -> burning animation, 8s countdown then explode");

	// expecting OUTPUT to pass in a DOM element .innerHTML to add the animation to
	// first add and style the flame
	output.innerHTML += "<div class='burn-container'><div class='flame'></div></div>";

	// countdown and add class explode 
	var fade = output;			//	document.getElementById("dash-content-area");
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
				// dashboard();		// send user back to dashboard
			}

        } else {
            clearInterval(intervalID);
        }
          
    }, 200);

	// handle the actual removal of the hand from storage
	// console.log("NEEDFIX ->Either refresh UI, or remove the correct one from the array list");
	// currentUserHands.pop();

	// FIRST WAIT, then reload the page
	setTimeout(() => {
		console.log("executing redirection after 5 seconds");
		// dashboard();

		location.reload();
	}, 5000);

	// LATER: will need to sync this to the DB /chain
		




	return true;
}

import { usePrepareContractWrite, useContractWrite } from 'wagmi'
// import { getAccount } from "@wagmi/core";


// burnBySending Function (build then move to functions)
const burnBySending = async (tokenId) => {
	console.log("Transfer to contract address to burn the token ownership. OK for MM only?");

	// const { address, connector, isConnected } = useAccount();
	// console.log(address);

	// const { config } = usePrepareContractWrite({
	// 	address: cpContractPolygon,
	// 	abi: cpABIPolygon,
	// 	functionName: 'transferFrom',
	// 	args: [address, cpContractPolygon, tokenId]
	// });
	
	// const { data, isLoading, isSuccess, write } = useContractWrite(config)

	// // console.log(data, isLoading, isSuccess, write);
	// // execute write
	// write?.();
 





	let myTransport = '';// custom(window.ethereum);
	if(window.ethereum) {
		myTransport = custom(window.ethereum);
	} else {
		myTransport = http('https://polygon-mainnet.g.alchemy.com/v2/H142mkJS2UCpceoBqIqldBYr-hRkDyPR');
	}

	console.log("Update this function to use the new viem transport method");

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

	// Game UI Alert & wait for user
	alert("Ready your Wallet. You're about to burn hand # "+ tokenId +" owned by: " + address + " You are paying only gas fees to burn this hand and open a spot in the game.");
	  
	const { request } = await publicClient.simulateContract({
		address: cpContractPolygon,
		abi: cpABIPolygon,
		functionName: 'transferFrom',
		account: address,
		args: [address, cpContractPolygon, tokenId],
	  })
	const hash = await walletClient.writeContract(request);


	// try with wagmi functions instead? -> problem calling hooks in here!?!



	  // console.log(data);

	console.log("Send completed successfully with hash: " + hash + " Click here to view this transaction on polygonscan (TBD)");


	let contentArea = document.getElementById('dash-feedback');

	contentArea.innerHTML += "<h3 class='wallet-tx'>Awaiting blockchain confirmation...</h3>";

	if(hash) {

		contentArea.innerHTML += "<h2>Transaction confirmed</h2>";
		contentArea.innerHTML += "<h3>See ya!</h3>";

		// foldHandDatabase(tokenId);		// obsolete - remove
		console.log("Hand Folded.");

		foldHandBtn(contentArea);		
		// this supplies the animation and the local array removal
		// passing content area to the function to add the animation location


		return true;
	} else {
		alert("There was a problem confiming your transaction! Please verify & try again.");

		return false;
	}

	// end of function

}
document.burnBySending = burnBySending;		// make it global for now

// INTERNAL: 
function buildHandDisplayProfile(chainData) {

	let c1 = chainData[0];
	let c2 = chainData[1];
	let c3 = chainData[2];
	let c4 = chainData[3];
	let c5 = chainData[4];

	let handOut = "<div class='hand profile'>";

	handOut += "<table><tr><td><div class='cardDisplay shown'>" + c1.display  + "</div>" + displayCard(c1.id, true) + "</td>";
	handOut += "<td><div class='cardDisplay shown'>" + c2.display + "</div>" + displayCard(c2.id, true) + "</td>"; 
	handOut += "<td><div class='cardDisplay shown'>" + c3.display + "</div>" + displayCard(c3.id, true) + "</td>"; 
	handOut += "<td><div class='cardDisplay shown'>" + c4.display + "</div>" + displayCard(c4.id, true) + "</td>"; 
	handOut += "<td><div class='cardDisplay shown'>" + c5.display + "</div>" + displayCard(c5.id, true) + "</td>";
	handOut += "</tr></table>";

	handOut += "</div>";

	// output to DOM
	return handOut;
}

// INTERNAL: conversion function from NFT json to HAND = [card1,card2,card3,card4,card5]
async function transformHandDataToObject(jsonParseRes) {

	// get hand for display
	let thisName = jsonParseRes.name.split(" ");		// remove only last 18 characters from string for display hand
	let thisHandArray = thisName.slice(4);			// array of display cards from this hand
	// let chainIdNum = thisName[2];					// pulls mint id num from name of NFT (unused)


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
			// console.log("HERE");
		    return obj.display === fix;
		});

		chainHandObj.push(result[0]);

	});

	// instead return a data object with HAND data made up of 5 CARD objects
	// return buildHandDisplayProfile(chainHandObj);
	return chainHandObj;

}

async function captureMeta(result, thisId, cpMetaLocal) {

	console.log("Get hand from chainData by json data for MintIdNum: " + thisId);

	// this begins the new output for the NFT display
	let newOutput = "<div class='nft-pen'><h3><span style=float:right>Mint ID#:"+thisId+"</span></h3>";		// NFT Diplay header

	let osLivePrefix = "https://opensea.io/assets/matic/";		// live prefix for OpenSea
	let currentContract = "0x617d4680a612CAb005223E63cB34F7dc94604C4d";		// current contract address

	let thisURI = result;
	// console.log(thisURI);
	let urlTarget = "https://cryptopoker.mypinata.cloud/ipfs/" + result.slice(7);
	let adjust = result.slice(7,66);

	if(thisId === 250){
		// Tom bugged this one with a dummy contract call:P, so need to skip it.
		console.log("Tom bugged this one with a dummy contract call:P, so need to skip it, or otherwise ensure graceful faulure.");
	}

	let jsonResult = await httpGet(urlTarget);
	// console.log(jsonResult);		// this is the JSON data for the NFT
	let parseRes = JSON.parse(jsonResult);


	//console.log("use parseRes to get and store useful hand data in the meta");
	// console.log(parseRes);
	let nftName = parseRes.name;	// contains hand data!
	// console.log(nftName);
	let nameSplit = nftName.split(" ");		// each array entry is a card in hand
	// console.log(nameSplit[4],nameSplit[5],nameSplit[6],nameSplit[7],nameSplit[8]);
	
	let hands = [];

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
	cpMetaLocal[thisId].jsonMeta = jsonResult;
	// update locally cached data with variables we may need for our owned tokens in the future
	cpMetaLocal[thisId].thisImageUrl = thisImageUrl;
	cpMetaLocal[thisId].thisImagelink = thisImagelink;	// shortcut link to URL
	cpMetaLocal[thisId].thisImageHtml = thisImage;		// shortcut to html output of NFT image.

	// encoded hand data for html output, no comma to remove from 8
	cpMetaLocal[thisId].handArrDisplay = [ 
		nameSplit[4].substring(0, nameSplit[4].length - 1),
		nameSplit[5].substring(0, nameSplit[4].length - 1),
		nameSplit[6].substring(0, nameSplit[4].length - 1),
		nameSplit[7].substring(0, nameSplit[4].length - 1),
		nameSplit[8] 
	];


	// newOutput += thisImagelink + thisImage + "</a>" + osLink + burnLink + "</div><hr>";	

	// handBundle is: DOM container with ID + w/link to + thisImageFile + "</a>" + osLink + burnLink + "</div><hr>";

	let handBundle = newOutput + thisImagelink + thisImage + "</a>" + osLink + burnLink + "</div><hr>";

	// 1

	let handChainData = await transformHandDataToObject(parseRes);
	// console.log(handChainData);		//used as input for next function, pass directly instead.

	let buildHand = buildHandDisplayProfile(
		handChainData
	);		// the flip hand overlay

	// console.log(buildHand);		// this is used to build the flippable card display

	handBundle += buildHand;		// add to hand construction

	// add to DOM relocated to displayNFTs function

	// console.log(handBundle);
	// console.log("Can we convert this into a FC?")

	return handBundle;

	// from cpMetaLocal[thisId] data

}

// async function displayNFTs(cu,cc) {
// 	console.log("NFT OUTPUT PROFILE -> Display of all user owned NFTs");

// 	let loadingArea = "<h3 id='temp-loading' class='wallet-tx'>STILL LOADING...</h3>";

// 	console.log(cc);		// OK

// 	// hard coded entries FOR NOW
// 	let dashContentArea = document.getElementById('loading-area');
// 	dashContentArea.innerHTML = loadingArea;	// set loding area

// 	// let osLivePrefix = "https://opensea.io/assets/matic/";		// live prefix for OpenSea
// 	// currentHserHands is number of current hnds owned by user
	

// 	let currentUserHands = cu.cpBalance;
// 	let currentUserAddress = cu.address;

// 	let cpBalance = cu.cpBalance;	//	"NUM owned";
// 	let totalCpSupply = Number(cc.count);			//await cpContract.count();		// an int, counted from contract

// 	// TEMP direct object here instead of cached data
// 	console.log("Using backup for cpMeta ATM..");
// 	let cpMeta = cpMetaBak;
	
// 	// console.log(currentUserHands, cpBalance);

// 	let ownerIndex = 1;
// 	let myHandsMintNumArray = [];
// 	let cpMetaLocal = [];

// 	// console.log(cc.cpMeta);

// 	if(cpMeta){

// 		//check for globally stored cpMeta
// 		if(cpMeta.length > 0) {
// 			cpMetaLocal = cpMeta;		// use the global variable, cache it locally
// 		} 

// 	}

// 	// console.log(cpMetaLocal);		//OK

// 	// console.log("Code new test here: if is owned by contract address -> change owner in db and set db fold to true");

// 	// console.log("BUG: purchased hands are not given the correct flippable card treatment - retrofit to use MintNum to pull the correct hand from the db - this is caused by the hand stored as owned IS NOT reassigned in the database until the owner visits the dashboard page of their application.");

// 	// this output for each uniquely owned NFT for connected wallet.
// 	for(let i=0;i<totalCpSupply;i++){	

// 		let thisNftOwner = "";

// 		if(cpMetaLocal[i]){
// 			//object exisits, assume we have basic ownership data for this hand
			
// 			let thisHandMeta = cpMetaLocal[i];

// 			// if owner field is invalid or empty
// 			if(cpMetaLocal[i].owner !== "") {
// 				// if local hand owner is NOT empty

// 				// console.log(thisHandMeta);
// 				// let ownerTest = thisHandMeta.owner;
// 				// console.log(thisHandMeta.owner.toLowerCase());

// 				if(thisHandMeta.owner.toLowerCase() === currentUserAddress.toLowerCase()){
// 					// if the current owner hand is owned by the user, and is stored in the DB

// 					// ONLY RETEST OWNED? - What about if bought off secondary?
// 					// verify ownership of the hand (not sold or traded)
// 					thisNftOwner = await getOwner(i);

// 					// console.log(thisNftOwner);		// owner verification

// 					if( thisNftOwner.toLowerCase() !== currentUserAddress.toLowerCase() ){
// 						// update it with a direct on-chain lookup
// 						console.log("Owner Address Change!");
// 						cpMetaLocal[i].owner = thisNftOwner;
// 					} else {
// 						// console.log("Owner Remains the Same");
// 					}


// 				} 

// 			} else {
// 				// owner is empty update it here
// 				cpMetaLocal[i] = {};
// 				cpMetaLocal[i].owner = await getOwner(i);
// 				cpMetaLocal[i].id = i;
// 			}
// 		} else {
// 			// create the object, assign the owner and id
// 			cpMetaLocal[i] = {};
// 			cpMetaLocal[i].owner = await getOwner(i);
// 			cpMetaLocal[i].id = i;

// 			thisNftOwner = cpMetaLocal[i].owner;		// assign variable to test new MINTS

// 			// cpMetaLocal[i] = {id:i, owner:thisNftOwner};
// 		}

// 		// continue on with the rest of the page load		

// 		// use the metadata we just confirmed
// 		if(thisNftOwner.toLowerCase() === currentUserAddress.toLowerCase()) {
// 			// current player owns this hand
// 			console.log(i + " Owned by " + currentUserAddress);
			
// 			// continue treating this one as owned
// 			myHandsMintNumArray.push(i);		// add to array of owned hands

// 			// capture the id number 
// 			let thisId = i;
// 			let thisHandMeta;

// 			// get the URI info and then run the CaptureMeta function (for each owned hand)
// 			await getURI(thisId).then( (result) => {
// 				thisHandMeta = captureMeta(result, i, cpMetaLocal);

// 				// currently thisHandMeta is the full output for the NFT, including the hand display, represented as an HTML string.

// 				// can we make it a DOM element?
// 			});

// 			// console.log(await thisHandMeta);		// OK for EACH OWNED hand...

// 			// add thisHandMeta to DOM in place of array index
// 			// console.log( myHandsMintNumArray.indexOf(thisId) );		//OK
// 			let arrIndex = myHandsMintNumArray.indexOf(thisId);
// 			// if it's 0



// 			console.log("If switching to react componets here rather than DOM insertion...");

// 			switch(arrIndex) {
// 				case 0:
// 					// console.log("First Hand");
// 					setHandOne(await thisHandMeta);
// 					document.getElementById('handOne').innerHTML = await thisHandMeta;
// 					break;
// 				case 1:
// 					// console.log("Second Hand");
// 					document.getElementById('handTwo').innerHTML = await thisHandMeta;
// 					break;
// 				case 2:
// 					// console.log("Third Hand");
// 					document.getElementById('handThree').innerHTML = await thisHandMeta;
// 					break;
// 				case 3:
// 					// console.log("Fourth Hand");
// 					document.getElementById('handFour').innerHTML = await thisHandMeta;
// 					break;
// 				case 4:
// 					// console.log("Fifth Hand");
// 					document.getElementById('handFive').innerHTML = await thisHandMeta;
// 					break;
// 				default:
// 					console.log("Hand is not in first five, (1-5) so it's omitted!");
// 					document.getElementById('rootTwo').innerHTML = await thisHandMeta;
// 			}



// 		}
		
// 		// CHECK UI and TAIL OF LOOP		

// 		// Loading Indicator UI - used to track speed and caching
// 		if(i === totalCpSupply-1) {
// 			//last one
// 			// if exists
// 			if(document.getElementById('temp-loading')){
// 				document.getElementById('temp-loading').remove();
// 			}
			

// 			// console.log(cpMetaLocal);
// 		} else {
// 			// first add the temp-loading div if it doesn't exist
// 			if(!document.getElementById('temp-loading')){
// 				let tempLoading = document.createElement('div');
// 				tempLoading.id = "temp-loading";
// 				tempLoading.innerHTML = "SYNCING CURRENT HAND OWNERS... " + (totalCpSupply-i) + " remaining";
// 				document.getElementById('loading-area').appendChild(tempLoading);
// 			} else {
			
// 			}
// 			// append the number remainging to be processed
// 			// document.getElementById('temp-loading').innerHTML = "SYNCING CURRENT HAND OWNERS... " + (totalCpSupply-i) + " remaining";
// 		}
// 	}		// end for loop

// 	// console.log(await myHandsMintNumArray);		// expecting a full list of NFTs, mint numbers only for current user.

// 	// OK Here, maybe now use the list of ID's to build the output from the stored collection?
// 	// console.log(cpMetaLocal[myHandsMintNumArray.length-1]);

// 	// console.log(cpMeta);
// 	console.log(cpMetaLocal);
// 	console.log("To update the cpMeta object, data needs to be sent up to the API server?")
	

// 	// update the server with the latest data
// 	// fetch("https://api.justplay.cafe/data/setMeta", {
// 	// 	method: 'POST',
// 	// 	headers: {
// 	// 		'Content-Type': 'application/json'
// 	// 		},
// 	// 		body: JSON.stringify(cpMeta)
// 	// 	})
// 	// 	.then(response => response.json())
// 	// 	.then((json) => console.log(json));


// 	let NFT_Page_Data = "<h1>Hi There</h1>";
// 	return NFT_Page_Data;

// }

// function getFace(id){

// 	switch(id){
// 	case 1: return mainDeck1Ipfs; break;
// 	case 2: return mainDeck2Ipfs; break;
// 	case 3: return mainDeck3Ipfs; break;
// 	case 4: return mainDeck4Ipfs; break;
// 	case 5: return mainDeck5Ipfs; break;
// 	case 6: return mainDeck6Ipfs; break;
// 	case 7: return mainDeck7Ipfs; break;
// 	case 8: return mainDeck8Ipfs; break;
// 	case 9: return mainDeck9Ipfs; break;
// 	case 10: return mainDeck10Ipfs; break;
// 	case 11: return mainDeck11Ipfs; break;
// 	case 12: return mainDeck12Ipfs; break;
// 	case 13: return mainDeck13Ipfs; break;

// 	case 14: return mainDeck14Ipfs; break;
// 	case 15: return mainDeck15Ipfs; break;
// 	case 16: return mainDeck16Ipfs; break;
// 	case 17: return mainDeck17Ipfs; break;
// 	case 18: return mainDeck18Ipfs; break;
// 	case 19: return mainDeck19Ipfs; break;
// 	case 20: return mainDeck20Ipfs; break;
// 	case 21: return mainDeck21Ipfs; break;
// 	case 22: return mainDeck22Ipfs; break;
// 	case 23: return mainDeck23Ipfs; break;
// 	case 24: return mainDeck24Ipfs; break;
// 	case 25: return mainDeck25Ipfs; break;
// 	case 26: return mainDeck26Ipfs; break;

// 	case 27: return mainDeck27Ipfs; break;
// 	case 28: return mainDeck28Ipfs; break;
// 	case 29: return mainDeck29Ipfs; break;
// 	case 30: return mainDeck30Ipfs; break;
// 	case 31: return mainDeck31Ipfs; break;
// 	case 32: return mainDeck32Ipfs; break;
// 	case 33: return mainDeck33Ipfs; break;
// 	case 34: return mainDeck34Ipfs; break;
// 	case 35: return mainDeck35Ipfs; break;
// 	case 36: return mainDeck36Ipfs; break;
// 	case 37: return mainDeck37Ipfs; break;
// 	case 38: return mainDeck38Ipfs; break;
// 	case 39: return mainDeck39Ipfs; break;
		
// 	case 40: return mainDeck40Ipfs; break;
// 	case 41: return mainDeck41Ipfs; break;
// 	case 42: return mainDeck42Ipfs; break;
// 	case 43: return mainDeck43Ipfs; break;
// 	case 44: return mainDeck44Ipfs; break;
// 	case 45: return mainDeck45Ipfs; break;
// 	case 46: return mainDeck46Ipfs; break;
// 	case 47: return mainDeck47Ipfs; break;
// 	case 48: return mainDeck48Ipfs; break;
// 	case 49: return mainDeck49Ipfs; break;
// 	case 50: return mainDeck50Ipfs; break;
// 	case 51: return mainDeck51Ipfs; break;
// 	case 52: return mainDeck52Ipfs; break;
// 	default: return mainDeckBackIpfs; break;
// 	}
// }

function Card(props){

	// console.log(props);		// just take ID

	let id = props.cardId;
	let frontImg = getFace(parseInt(id));		// this is not working, need to pass in the id as int?
	let backImg = getFace(0);		// get default of back face
	let cardDisplay = getCardDisplay(parseInt(id)).display;
	// console.log(cardDisplay, backImg, frontImg);
	
	// test for flipped or no
	let flipped = "";
	if(props.isFlipped) { flipped = "flipped";}

	return( <><div className="cardDisplay shown">{cardDisplay}</div>
			<div className="flip-card flipped" onClick={(e) => flipClick(e.target)}>
				<div className="flip-card-inner">
					<div className="flip-card-front">
						<img className="card-back-img" src={backImg} alt="Card" />
					</div>
					<div className="flip-card-back">
						<img className="card-front-img" id="card-face" src={frontImg} alt="Card" />
					</div>
				</div>
			</div>
			</>);
}


function HandContainer(props){

	// console.log(props);
	console.log(props.handData);

	let intArr = props.handData.handArrDisplay;
	// console.log(intArr);

	// we have: 5 card array of display cards
		// function: convert display hand to card id# for card component call

	let cardOne = 1;
	let cardTwo = 2;
	let cardThree = 3;
	let cardFour = 4;
	let cardFive = 5;

	if(intArr){
		cardOne = displayToId(intArr[0]);		// convert display to id
		// console.log(cardOne);
		cardTwo = displayToId(intArr[1]);
		// console.log(cardTwo);
		cardThree = displayToId(intArr[2]);
		// console.log(cardThree);
		cardFour = displayToId(intArr[3]);
		// console.log(cardFour);
		cardFive = displayToId(intArr[4]);
		// console.log(cardFive);
	} 

	// id: is mintId
	// thisImageUrl: is the image url for the NFT

	let thisId = props.handData.id;
	let thisIPFSsvg = props.handData.thisImageUrl;
	// let soloHash = props.handData.soloHash;
	// let thisFilename = thisIPFSsvg.;		// clip from imagename

	let contractAddress = cpContractPolygon;
	let osLink = "https://opensea.io/assets/matic/"+contractAddress+"/"+thisId;

	return (
		<div className="hand-container">
			{/* this is art and links */}
			<div className="nft-pen">
				<h3>
					<span style={{float:"right"}}>Mint ID#:{thisId}</span>
				</h3>
				<a className="nft-link" href={thisIPFSsvg} target="_blank">
					<img src={thisIPFSsvg} alt={thisIPFSsvg} style={{ "width": "100%;"}} />
				</a>
				<div className="small">
					<a href={osLink} target="_blank">
						View NFT on OpenSea</a>
					{/* <a href="#" onclick={() => burnBySending(thisId)} style={{color:"red","fontWeight":"bold", float:"right"}}>
						Burn Hand NFT
					</a> */}
					<BurnBtn tokenId={thisId} />
				</div>
			</div>
			<hr />
			{/* this is flippable cards */}
			<div className="hand profile">
				<table>
					<tbody>
						<tr>
							<td>
								<Card cardId={cardOne} />
								
							</td>

							<td>
								<Card cardId={cardTwo} />
								
							</td>
							<td>
								<Card cardId={cardThree} />
								
							</td>
							<td>
								<Card cardId={cardFour} />
								
							</td>
							<td>
								<Card cardId={cardFive} />
								
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			{/* end handContainer */}
		</div>);

}



export function DashContent({cu, cc}) {
	const { address, connector, isConnected } = useAccount();

	const [handOne, setHandOne] = useState([]);
	const [handTwo, setHandTwo] = useState([]);
	const [handThree, setHandThree] = useState([]);
	const [handFour, setHandFour] = useState([]);
	const [handFive, setHandFive] = useState([]);

	// console.log(cu, cc);		// current user, current contract

	let DisplayMyNFTs;		// = displayNFTs();

	useEffect(() => {
		if(isConnected && cc.name){
			// console.log(isConnected, cc);



			// declare the data fetching function
			const fetchData = async () => {

				// get CP Meta
				// let dataCap = await getCpMeta();		// loads last...
				// console.log(dataCap);
				// assign contract data calls to cc object
				DisplayMyNFTs = await displayNFTs(cu,cc);
				// console.log(DisplayMyNFTs);
			}
		  
			// call the function
			fetchData()
				// make sure to catch any error
				.catch(console.error);
			

			

		}
	});

	async function displayNFTs(cu,cc) {
		console.log("NFT OUTPUT PROFILE -> Display of all user owned NFTs");
	
		let loadingArea = "<h3 id='temp-loading' class='wallet-tx'>STILL LOADING...</h3>";
	
		// console.log(cc);		// OK
	
		// hard coded entries FOR NOW
		let dashContentArea = document.getElementById('loading-area');
		dashContentArea.innerHTML = loadingArea;	// set loding area
	
		// let osLivePrefix = "https://opensea.io/assets/matic/";		// live prefix for OpenSea
		// currentHserHands is number of current hnds owned by user
		
	
		let currentUserHands = cu.cpBalance;
		let currentUserAddress = cu.address;
	
		let cpBalance = cu.cpBalance;	//	"NUM owned";
		let totalCpSupply = Number(cc.count);			//await cpContract.count();		// an int, counted from contract
	
		// TEMP direct object here instead of cached data
		console.log("Using backup for cpMeta ATM..");
		let cpMeta = cpMetaBak;
		
		// console.log(currentUserHands, cpBalance);
	
		let ownerIndex = 1;
		let myHandsMintNumArray = [];
		let cpMetaLocal = [];
	
		// console.log(cc.cpMeta);
	
		if(cpMeta){
	
			//check for globally stored cpMeta
			if(cpMeta.length > 0) {
				cpMetaLocal = cpMeta;		// use the global variable, cache it locally
			} 
	
		}
	
		// console.log(cpMetaLocal);		//OK
	
		// console.log("Code new test here: if is owned by contract address -> change owner in db and set db fold to true");
	
		// console.log("BUG: purchased hands are not given the correct flippable card treatment - retrofit to use MintNum to pull the correct hand from the db - this is caused by the hand stored as owned IS NOT reassigned in the database until the owner visits the dashboard page of their application.");
	
		// this output for each uniquely owned NFT for connected wallet.
		for(let i=0;i<totalCpSupply;i++){	
	
			let thisNftOwner = "";

			let thisHandMeta = cpMetaLocal[i];
	
			if(cpMetaLocal[i]){
				//object exisits, assume we have basic ownership data for this hand
				
				// let thisHandMeta = cpMetaLocal[i];
	
				// if owner field is invalid or empty
				if(cpMetaLocal[i].owner !== "") {
					// if local hand owner is NOT empty
	
					// console.log(thisHandMeta);
					// let ownerTest = thisHandMeta.owner;
					// console.log(thisHandMeta.owner.toLowerCase());
	
					if(thisHandMeta.owner.toLowerCase() === currentUserAddress.toLowerCase()){
						// if the current owner hand is owned by the user, and is stored in the DB
	
						// ONLY RETEST OWNED? - What about if bought off secondary?
						// verify ownership of the hand (not sold or traded)
						thisNftOwner = await getOwner(i);
	
						// console.log(thisNftOwner);		// owner verification
	
						if( thisNftOwner.toLowerCase() !== currentUserAddress.toLowerCase() ){
							// update it with a direct on-chain lookup
							console.log("Owner Address Change!");
							cpMetaLocal[i].owner = thisNftOwner;
						} else {
							// console.log("Owner Remains the Same");
						}
	
	
					} 
	
				} else {
					// owner is empty update it here
					cpMetaLocal[i] = {};
					cpMetaLocal[i].owner = await getOwner(i);
					cpMetaLocal[i].id = i;
				}
			} else {
				// create the object, assign the owner and id
				cpMetaLocal[i] = {};
				cpMetaLocal[i].owner = await getOwner(i);
				cpMetaLocal[i].id = i;
	
				thisNftOwner = cpMetaLocal[i].owner;		// assign variable to test new MINTS
	
				// cpMetaLocal[i] = {id:i, owner:thisNftOwner};
				thisHandMeta = cpMetaLocal[i];
			}
	
			// continue on with the rest of the page load		
	
			// use the metadata we just confirmed
			if(thisNftOwner.toLowerCase() === currentUserAddress.toLowerCase()) {
				// current player owns this hand
				console.log(i + " Owned by " + currentUserAddress);
				
				// continue treating this one as owned
				myHandsMintNumArray.push(i);		// add to array of owned hands
	
				// capture the id number 
				let thisId = i;
				let thisHandData;
	
				// get the URI info and then run the CaptureMeta function (for each owned hand)
				await getURI(thisId).then( (result) => {
					thisHandData = captureMeta(result, i, cpMetaLocal);
	
					// currently thisHandMeta is the full output for the NFT, including the hand display, represented as an HTML string.
	
					// can we make it a DOM element?
				});
	
				// console.log(await thisHandMeta);		// OK for EACH OWNED hand...
	
				// add thisHandMeta to DOM in place of array index
				// console.log( myHandsMintNumArray.indexOf(thisId) );		//OK
				let arrIndex = myHandsMintNumArray.indexOf(thisId);
				// if it's 0
	
	
	
				// console.log("If switching to react componets here rather than DOM insertion...");
	
				switch(arrIndex) {
					case 0:
						
					console.log("First Hand SETTING HERE for NEW COMPONENT, need to pass in the data from the cpMetaLocal array");

						console.log(thisHandMeta);

						setHandOne(thisHandMeta);

						// document.getElementById('handOne').innerHTML = await thisHandData;
						break;
					case 1:
						setHandTwo(thisHandMeta);
						// document.getElementById('handTwo').innerHTML = await thisHandData;
						break;
					case 2:
						setHandThree(thisHandMeta);
						// document.getElementById('handThree').innerHTML = await thisHandData;
						break;
					case 3:
						setHandFour(thisHandMeta);
						// document.getElementById('handFour').innerHTML = await thisHandData;
						break;
					case 4:
						setHandFive(thisHandMeta);
						// document.getElementById('handFive').innerHTML = await thisHandData;
						break;
					default:
						console.log("Hand is not in first five, (1-5) so it's omitted!");
						// document.getElementById('rootTwo').innerHTML = await thisHandData;
				}
	
	
	
			}
			
			// CHECK UI and TAIL OF LOOP		
	
			// Loading Indicator UI - used to track speed and caching
			if(i === totalCpSupply-1) {
				//last one
				// if exists
				if(document.getElementById('temp-loading')){
					document.getElementById('temp-loading').remove();
				}
				
	
				// console.log(cpMetaLocal);
			} else {
				// first add the temp-loading div if it doesn't exist
				if(!document.getElementById('temp-loading')){
					let tempLoading = document.createElement('div');
					tempLoading.id = "temp-loading";
					tempLoading.innerHTML = "SYNCING CURRENT HAND OWNERS... " + (totalCpSupply-i) + " remaining";
					document.getElementById('loading-area').appendChild(tempLoading);
				} else {
				
					// append the number remainging to be processed
					document.getElementById('temp-loading').innerHTML = "SYNCING CURRENT HAND OWNERS... " + (totalCpSupply-i) + " remaining";
				}
			}
		}		// end for loop
	
		// console.log(await myHandsMintNumArray);		// expecting a full list of NFTs, mint numbers only for current user.
	
		// OK Here, maybe now use the list of ID's to build the output from the stored collection?
		// console.log(cpMetaLocal[myHandsMintNumArray.length-1]);
	
		// console.log(cpMeta);
		console.log(cpMetaLocal);
		console.log("To update the cpMeta object, data needs to be sent up to the API server?")
		
	
		// update the server with the latest data
		// fetch("https://api.justplay.cafe/data/setMeta", {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 		},
		// 		body: JSON.stringify(cpMeta)
		// 	})
		// 	.then(response => response.json())
		// 	.then((json) => console.log(json));
	
	
		let NFT_Page_Data = "<h1>Hi There</h1>";
		return NFT_Page_Data;
	
	}

    return (<>
	{isConnected ? 
		<>
			<h2>Dashboard Content</h2>
			<p>Contract: <strong>{cc.name}</strong>. {cu.handNum} {cc.symbol} owned
			<br /><b>Fresh Mints</b> and <b>Burns</b> can take time to sync on chain...</p>
			<hr />
			<h2>My Hands:</h2>
			{/* this is a list of all the hands the user owns */}

			
			<div id="dash-content-area">	
				<div id="loading-area"></div>
						
				{handOne && <HandContainer handData={handOne} /> }
				{handTwo && <HandContainer handData={handTwo} /> }
				{handThree && <HandContainer handData={handThree} /> }
				{handFour && <HandContainer handData={handFour} /> }
				{handFive && <HandContainer handData={handFive} /> }
				{/* <div id="handOne"></div>
				<div id="handTwo"></div>
				<div id="handThree"></div>
				<div id="handFour"></div>
				<div id="handFive"></div> */}
			</div>
			{/* <BurnBtn tokenId={1} /> */}

			

			
			
		</> : <h3>Login Please</h3>}
	</>);
}
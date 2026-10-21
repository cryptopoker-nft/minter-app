import React from "react";

import { httpGet } from './xmlHttpReq.jsx';
import { buildHandDisplayProfile } from "./dashBuildHand.jsx";
import { buildDeck } from "./buildDeck.jsx";



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
	return chainHandObj;

}

// needs: httpGet, transformHandDataToObject, buildHandDisplayProfile
export async function captureMeta(result, thisId, cpMetaLocal) {

	// console.log("This URI: " + result + " for MintIdNum: " + thisId);

	// console.log("Get hand from chainData by json data for MintIdNum: " + thisId);

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

	return handBundle;      // is this needed?

}
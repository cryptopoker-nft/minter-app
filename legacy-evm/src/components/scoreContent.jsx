import React, { useEffect } from "react";
import { useAccount } from 'wagmi';

import { cpMetaBak } from '../data/cpMeta.jsx';     // backup data for API server call


// import functions for checkCount and getBalance
import { checkCount, getBalance, getURI, getOwner } from "../../js/viemConnect.js";
import { cpContractPolygon } from "../../js/modules/contracts.js";	
import { cpMintArb, cpMintOp } from "../data/contracts.jsx";
import { getCpMeta } from "../functions/getCpMeta.jsx";

import { httpGet } from "../functions/xmlHttpReq.jsx";
import { buildDeck } from "../functions/buildDeck.jsx";

import { quickAssessHand } from "../functions/quickAssessHand.jsx";
import { scoreboardFinalOutput } from "../functions/scoreboardFinalOutput.jsx";
import { triggerEndOfLoop } from "../functions/scoreTriggerLoopEnd.jsx";
import { scoreHand } from "../functions/scoreHand.jsx";

function getCC(chainId){
	let currentContract = cpContractPolygon;
	let activeGameNum = 1;

	if(chainId === 10) {
		currentContract = cpMintOp;
		activeGameNum = 2;
	} if(chainId === 42161) {
		currentContract = cpMintArb;
		activeGameNum = 3;
	}

	return [currentContract, activeGameNum];
}

function getOSLivePrefix(chainId){

	if(chainId === 10) {
		return "https://opensea.io/assets/optimism/";
	} else if(chainId === 42161) {
		return "https://opensea.io/assets/arbitrum/";
	} else if(chainId === 137) {
		return "https://opensea.io/assets/polygon/";
	}

}

//this is the START of the main function to build the current data set for scoreboard
async function printScoreboardData(gameData, address, chainId) {

	let currentUserAddress = address;		// get current user address
	let cpCount = Number (await checkCount(chainId));		//await cpContract.count();

	let currentContract = getCC(chainId)[0];
	let activeGameNum = getCC(chainId)[1];
	// let cpMeta = cpMetaBak;		// backup data for API server call
	let cpMeta = await getCpMeta(chainId);

	//check against metadata storage for current
	console.log(cpMeta.length, cpCount === cpMeta.length);		// want true here

	var pairs = 0;
	var twoPair = 0;
	var trips = 0;
	var quads = 0;
	var straights = 0;
	var flush = 0;
	var fullHouse = 0;
	var royal = 0;

	var outputData = "";

	// add table header to myHands collection
	let allHandsScores = 0;			// take a runnning total of all hands in the game currently (omit folded hands)
	let activeHandsNum = 0;
	let myTotalScore = 0;
	let myHandsTable = '<table id="myHandsTable" class="table table-dark table-striped">\
						  <thead>\
						    <tr>\
						      <th scope="col" title="MintID">ID</th>\
						      <th scope="col">Hand</th>\
						      <th scope="col">Score</th>\
						    </tr>\
						  </thead>\
						  <tbody>';

	// this for loop runs through all hands currently registered in the contract
	for(let i=0;i<cpCount;i++){

		let ownerOf = "";		// address of NFT owner

		// if the global cache has a corresponding object for the mint
		if(cpMeta[i]) {							// console.log(cpMeta[i]);
			
			if(cpMeta[i].owner !== ""){
				ownerOf = cpMeta[i].owner;				// it has a owner stored
			} else {
				ownerOf = await getOwner(i,chainId);			// get and update owner data for this mint
			}

		} else {
			// create the object
			cpMeta[i] = {};
			cpMeta[i].owner = await getOwner(i,chainId);

			ownerOf = cpMeta[i].owner;
		}

		document.getElementById('mintCounter').innerHTML = "Reading Mint#:" + i;

		// this if/else pertains to ALL HANDS
		if(ownerOf === currentContract) {
			// skip it, it's a burn
			triggerEndOfLoop(i,cpCount, myHandsTable, myTotalScore, outputData);		

		} else {

			// lookup and set token URI for this mint
			if(cpMeta[i]) {

				if(!cpMeta[i].tokenURI) {
					
					cpMeta[i].tokenURI = await getURI(i,chainId);			// get it, set it
				}

			} else {
				// create the object
				cpMeta[i] = {id: i, owner: await getOwner(i,chainId), tokenURI: await getURI(i,chainId)};
				// cpMeta[i].id = i;
				// cpMeta[i].owner = await getOwner(i);			//cpContract.ownerOf(i);
				// cpMeta[i].tokenURI = await getURI(i);
			}

			let result = cpMeta[i].tokenURI;
			let urlTarget = "https://cryptopoker.mypinata.cloud/ipfs/" + result.slice(7);
			// let adjust = result.slice(7,66);

			// look up and set the metadata for this mint
			let jsonResult = await httpGet(urlTarget);		// try to avoid this ?

			if(!cpMeta[i].jsonMeta !== ""){
				// get and update json meta data for this mint 
				cpMeta[i].jsonMeta = jsonResult;		
			}

			let parseRes = JSON.parse(jsonResult);

			// get hand for display
			// remove only last 18 characters from string for display hand
			let thisName = parseRes.name.split(" ");		
			let thisHandArray = thisName.slice(4);
			let thisHandint = thisHandArray.toString();
			let thisHandDisplay = thisHandint.replaceAll(",,", " | ");

			// use hand array to determine additional classification (i.e. high card)

			let checkDeck = buildDeck();

			// internal storage variables for hand scoring generation
			let str;		// take only the first card
			let fix;
			let lastChar;	// = str.substring(str.length - 1);
			let newCard;
			let handInput = "";				// = "KC KC KC KC KC";

			// this to build handInput for hand ranking assessemnt
			thisHandArray.forEach(function(element) {

				str = element;		// take only the single card
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

				// console.log(result);		
				// should return a new array of only matching cards, with all metadata for extraction/scoring

				newCard = result[0].solo;
				// console.log(newCard);

				handInput += newCard + " ";		// add card and space

			});

			// WE ARE HERE

			// call the assesment and scoring function
			let quickRank = quickAssessHand(handInput, i);

			if(cpMeta[i].handInput){
				// has a handInput
			} else {
				// needs one
				cpMeta[i].handInput = handInput;
			}

			// store in global variable for later use
			if(cpMeta[i].quickRank){
				// has a quickrank, use it
				quickRank = cpMeta[i].quickRank;
			} else {
				// needs one
				cpMeta[i].quickRank = quickAssessHand(handInput, i);
			}
			
			// internal variables for the trait analysis of hands based on metadata

			console.log(parseRes);

			let attr = parseRes.attributes;

			let thisHandScore = 0;		// reset
			let thisHand = "<h5>ID#:"+i;
			let rowNum = 1;
			let thisVal = "";
			let osLivePrefix = getOSLivePrefix(chainId);

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
			else if(quickRank === 7) { twoPair++; }					// 25 two pair
			else if(quickRank === 8) { pairs++; }					// 10 pair
			else if(quickRank === 9) { /* nothing */ }				// 1 nothing



			console.log(attr, ownerOf, currentUserAddress);		// should not allow undefined to pass


			// if(attr){
				// this compilation added to outputData for table display of all Hands
				thisHand = '<tr>\
					<td>\
					<a href="'+osLivePrefix+currentContract+"/"+i+'" target=_blank title="View NFT on OpenSea">'+i+'</a>\
					<td>'+thisHandDisplay+'</td>\
					<td title='+thisHandScore+'>'+thisHandScore+'</td>\
				</tr>';

				// console.log(thisHand);

				if(ownerOf === currentUserAddress) {

					// if is owned by current user, then also add to their personal hand storage (display)
					let thisMyHand = '<tr>\
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

			// }		// end if attr

			// TEST for completion of for loop
			triggerEndOfLoop(i,cpCount, myHandsTable, myTotalScore, outputData);

		}

	}		// end for loop (i++)

	let sumData = [pairs,twoPair,trips,quads,straights,flush,fullHouse,royal];

	console.log(sumData);
	scoreboardFinalOutput(chainId, cpCount, sumData);		// gamedata for db data, cpCount for gameTotal, 

	console.log("RETROFIT THIS FUNCTION SUCH THAT IT GATHERS AS MUCH METADATA TO STORE AS POSSIBLE.");
	// console.log(cpMeta);		// this should be the full object to write back to the API server here

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

export function ScoreContent({cu, cc}) {
	const { address, connector, isConnected } = useAccount();

	console.log(cu);

	useEffect(() => {
		if(isConnected){
			// console.log(isConnected);
			printScoreboardData("", address, cc.chainId);		// auto run for testing
		}
	});

    return (<>
	{cu ? <h3 className="mainHeader">Game Detail</h3> : <h3>Login Please</h3>}
	</>);
}